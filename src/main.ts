import styles from "./styles.css?inline";
import * as pdfjsLib from "pdfjs-dist";
import * as pdfViewer from "pdfjs-dist/web/pdf_viewer.mjs";
import { Course, courseUrl, courses } from "./courses";

// 用经典 Web Worker 模式加载 PDF.js worker
// 这种方式不依赖 dynamic import()，避免部署环境 .mjs MIME type 限制
const pdfWorker = new Worker(
  new URL("pdfjs-dist/build/pdf.worker.mjs", import.meta.url),
  { type: "module" }
);
pdfjsLib.GlobalWorkerOptions.workerPort = pdfWorker;

const appRoot = document.querySelector<HTMLDivElement>("#app");
if (!appRoot) {
  throw new Error("Missing app root");
}
const app = appRoot;

let activeCourse: Course | null = null;
let query = "";
let activeCategory = "全部";
let renderToken = 0;

// 记忆最近一次打开的课程 ID（存到 localStorage）
const LAST_COURSE_KEY = "english-class-last-course";
function getLastCourseId(): string | null {
  try { return localStorage.getItem(LAST_COURSE_KEY); } catch { return null; }
}
function setLastCourseId(id: string) {
  try { localStorage.setItem(LAST_COURSE_KEY, id); } catch { /* ignore */ }
}

/* ============================================================
   翻译与生词本模块
   ============================================================ */

let isTranslateMode = false;
let showVocabPanel = false;
const translationCache = new Map<string, string>();

interface VocabItem {
  word: string;
  translation: string;
  timestamp: number;
}

const VOCAB_KEY = "english-class-vocab";

function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function getVocabulary(): VocabItem[] {
  try {
    return JSON.parse(localStorage.getItem(VOCAB_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveVocabulary(vocab: VocabItem[]): void {
  localStorage.setItem(VOCAB_KEY, JSON.stringify(vocab));
}

function addToVocabulary(word: string, translation: string): void {
  const vocab = getVocabulary();
  if (!vocab.some((v) => v.word === word)) {
    vocab.unshift({ word, translation, timestamp: Date.now() });
    saveVocabulary(vocab);
  }
}

function removeFromVocabulary(word: string): void {
  saveVocabulary(getVocabulary().filter((v) => v.word !== word));
}

async function translateText(text: string): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed || trimmed.length > 300) return "";
  if (/^[\u4e00-\u9fa5\s\p{P}]+$/u.test(trimmed)) return "";
  if (trimmed.length < 2) return "";

  if (translationCache.has(trimmed)) return translationCache.get(trimmed)!;

  try {
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(trimmed)}&langpair=en|zh-CN`,
    );
    const data = await response.json();
    const result = data.responseData?.translatedText ?? "";
    if (result && result.toLowerCase() !== trimmed.toLowerCase()) {
      translationCache.set(trimmed, result);
    }
    return result;
  } catch {
    return "";
  }
}

/* ============================================================
   翻译浮窗
   ============================================================ */

let currentPopup: HTMLDivElement | null = null;

function showTranslationPopup(
  original: string,
  translation: string,
  x: number,
  y: number,
): void {
  hideTranslationPopup();

  const popup = document.createElement("div");
  popup.className = "translation-popup";
  popup.innerHTML = `
    <div class="translation-popup-header">
      <strong>${escapeHtml(original)}</strong>
      <button class="translation-popup-close" type="button" aria-label="关闭">×</button>
    </div>
    <div class="translation-popup-body">${escapeHtml(translation)}</div>
    <div class="translation-popup-actions">
      <button class="translation-popup-save" type="button">+ 加入生词本</button>
    </div>
  `;

  popup
    .querySelector(".translation-popup-close")
    ?.addEventListener("click", (e) => {
      e.stopPropagation();
      hideTranslationPopup();
    });

  popup
    .querySelector(".translation-popup-save")
    ?.addEventListener("click", (e) => {
      e.stopPropagation();
      addToVocabulary(original, translation);
      renderVocabPanel();
      const btn = popup.querySelector(
        ".translation-popup-save",
      ) as HTMLButtonElement;
      btn.textContent = "已收藏";
      btn.disabled = true;
    });

  const viewer = document.querySelector<HTMLElement>("#pdf-viewer");
  if (viewer) {
    const viewerRect = viewer.getBoundingClientRect();
    const left = x - viewerRect.left;
    const top = y - viewerRect.top - 8;
    popup.style.left = `${left}px`;
    popup.style.top = `${top}px`;
  }

  viewer?.appendChild(popup);
  currentPopup = popup;
}

function hideTranslationPopup(): void {
  currentPopup?.remove();
  currentPopup = null;
}

/* ============================================================
   生词本面板
   ============================================================ */

function renderVocabPanel(): void {
  document.querySelector<HTMLDivElement>(".vocab-panel")?.remove();
  if (!showVocabPanel) return;

  const vocab = getVocabulary();
  const panel = document.createElement("div");
  panel.className = "vocab-panel";
  panel.innerHTML = `
    <div class="vocab-panel-header">
      <strong>生词本 (${vocab.length})</strong>
      <button class="vocab-panel-close" type="button" aria-label="关闭">×</button>
    </div>
    <div class="vocab-panel-body">
      ${
        vocab.length === 0
          ? `<p class="vocab-empty">暂无收藏<br>开启翻译模式后选中单词即可收藏</p>`
          : vocab
              .map(
                (item) => `
            <div class="vocab-item">
              <div class="vocab-item-word">${escapeHtml(item.word)}</div>
              <div class="vocab-item-trans">${escapeHtml(item.translation)}</div>
              <button class="vocab-item-delete" data-word="${escapeHtml(item.word)}" type="button" aria-label="删除">×</button>
            </div>
          `,
              )
              .join("")
      }
    </div>
  `;

  panel
    .querySelector(".vocab-panel-close")
    ?.addEventListener("click", () => {
      showVocabPanel = false;
      renderVocabPanel();
    });

  panel
    .querySelectorAll<HTMLButtonElement>(".vocab-item-delete")
    .forEach((btn) => {
      btn.addEventListener("click", () => {
        removeFromVocabulary(btn.dataset.word ?? "");
        renderVocabPanel();
      });
    });

  document.body.appendChild(panel);
}

/* ============================================================
   划词翻译事件监听
   ============================================================ */

function setupTranslateListener(): void {
  document.addEventListener("mouseup", async (e) => {
    if (!isTranslateMode) {
      hideTranslationPopup();
      return;
    }

    const target = e.target as HTMLElement;
    if (
      target.closest(".translation-popup") ||
      target.closest(".vocab-panel")
    ) {
      return;
    }

    const selection = window.getSelection();
    const selectedText = selection?.toString().trim() ?? "";

    if (!selectedText || selectedText.length > 300) {
      hideTranslationPopup();
      return;
    }

    const viewer = document.querySelector("#pdf-viewer");
    if (!viewer) return;

    const range = selection?.rangeCount ? selection.getRangeAt(0) : null;
    if (!range) return;

    if (!viewer.contains(range.commonAncestorContainer)) return;

    const rect = range.getBoundingClientRect();
    const translation = await translateText(selectedText);

    if (translation) {
      showTranslationPopup(
        selectedText,
        translation,
        rect.left + rect.width / 2,
        rect.top,
      );
    } else {
      hideTranslationPopup();
    }
  });
}

/* ============================================================
   原有核心逻辑（课程浏览 + PDF 渲染）
   ============================================================ */

function injectStyles(): void {
  if (document.querySelector<HTMLStyleElement>("#course-browser-styles")) {
    return;
  }

  const styleElement = document.createElement("style");
  styleElement.id = "course-browser-styles";
  styleElement.textContent = styles;
  document.head.append(styleElement);
}

const normalize = (value: string) => value.toLowerCase().trim();

// 给"最新上传"的前两个课程打 NEW 徽章
function isNewCourse(course: Course): boolean {
  const sorted = [...courses].sort((a, b) => b.updated.localeCompare(a.updated));
  const rank = sorted.findIndex((c) => c.id === course.id);
  return rank >= 0 && rank < 2;
}

function matchesCourse(course: Course, search: string): boolean {
  if (activeCategory !== "全部" && course.category !== activeCategory) {
    return false;
  }

  const normalizedSearch = normalize(search);
  if (!normalizedSearch) {
    return true;
  }

  const haystack = normalize(
    [course.title, course.fileName, course.summary, course.tags.join(" ")].join(
      " ",
    ),
  );

  return haystack.includes(normalizedSearch);
}

function categories(): string[] {
  return ["全部", ...Array.from(new Set(courses.map((course) => course.category)))];
}

function groupCourses(courseList: Course[]): Array<[string, Course[]]> {
  const groups: Array<[string, Course[]]> = [];

  courseList.forEach((course) => {
    const existingGroup = groups.find(([category]) => category === course.category);
    if (existingGroup) {
      existingGroup[1].push(course);
      return;
    }

    groups.push([course.category, [course]]);
  });

  return groups;
}

function renderCourseCard(course: Course): string {
  const isActive = course.id === activeCourse?.id;
  const isNew = isNewCourse(course);
  const tags = course.tags.map((tag) => `<span>${tag}</span>`).join("");

  return `
    <article class="course-card ${isActive ? "is-active" : ""} ${isNew ? "is-new" : ""}" data-course-id="${course.id}">
      <div class="course-body">
        <span class="course-kicker">${course.size} · ${course.updated}</span>
        <strong>${course.title}${isNew ? '<span class="new-badge">NEW</span>' : ""}</strong>
        <span class="course-summary">${course.summary}</span>
        <span class="tag-row">${tags}</span>
      </div>
      <div class="course-actions">
        <button class="read-button" type="button" data-action="select" data-course-id="${course.id}">阅读</button>
        <a href="${courseUrl(course)}" target="_blank" rel="noreferrer">新窗口</a>
        <a href="${courseUrl(course)}" download="${course.fileName}">下载</a>
      </div>
    </article>
  `;
}

function render(): void {
  const filteredCourses = courses.filter((course) => matchesCourse(course, query));
  const groupedCourses = groupCourses(filteredCourses);
  const readerTitle = activeCourse?.title ?? "请选择一份课程资料";
  const readerContent = activeCourse
    ? `
        <div class="pdf-viewer" id="pdf-viewer" aria-label="${activeCourse.title}">
          <div class="pdf-loading">正在加载课程 PDF...</div>
        </div>
      `
    : `
        <div class="reader-empty">
          <p class="eyebrow">Ready</p>
          <h2>选择左侧资料后开始阅读</h2>
          <p>只有点击“阅读”才会加载 PDF；标签、搜索和分类不会触发下载。</p>
          <p style="margin-top:12px;color:var(--pine);font-size:0.85rem;">提示：加载 PDF 后可开启“翻译模式”，选中单词或句子即可查看中文翻译。</p>
        </div>
      `;
  const readerActions = activeCourse
    ? `
        <button class="translate-toggle ${isTranslateMode ? "is-active" : ""}" type="button" data-action="toggle-translate">翻译模式${isTranslateMode ? "：开" : ""}</button>
        <button class="vocab-toggle" type="button" data-action="toggle-vocab">生词本</button>
        <a href="${courseUrl(activeCourse)}" target="_blank" rel="noreferrer">新窗口</a>
        <a href="${courseUrl(activeCourse)}" download="${activeCourse.fileName}">下载</a>
      `
    : "";

  app.innerHTML = `
    <main class="shell">
      <section class="library-panel" aria-label="课程资料目录">
        <div class="brand-row">
          <div>
            <p class="eyebrow">English Class</p>
            <h1>PDF Course Library</h1>
          </div>
          <span class="count-pill">${courses.length} PDFs</span>
        </div>

        <div class="search-wrap">
          <label for="course-search">搜索课程</label>
          <input
            id="course-search"
            type="search"
            value="${query}"
            placeholder="时态 / 面试 / Addictions / Health"
            autocomplete="off"
          />
        </div>

        <div class="filter-row" aria-label="课程分类">
          ${categories()
            .map(
              (category) => `
                <button
                  class="${category === activeCategory ? "is-active" : ""}"
                  type="button"
                  data-action="filter"
                  data-category="${category}"
                >${category}</button>
              `,
            )
            .join("")}
        </div>

        <div class="course-list" aria-live="polite">
          ${
            filteredCourses.length
              ? groupedCourses
                  .map(
                    ([category, categoryCourses]) => `
                      <section class="course-group" aria-label="${category}">
                        <h3>${category}</h3>
                        ${categoryCourses.map(renderCourseCard).join("")}
                      </section>
                    `,
                  )
                  .join("")
              : `<p class="empty-state">没有找到匹配的课程资料。</p>`
          }
        </div>
      </section>

      <section class="reader-panel" aria-label="PDF 阅读器">
        <div class="reader-toolbar">
          <div>
            <p class="eyebrow">Now Reading</p>
            <h2>${readerTitle}</h2>
          </div>
          <div class="reader-actions">
            ${readerActions}
          </div>
        </div>
        ${readerContent}
      </section>
    </main>
  `;

  bindEvents();
  void renderActivePdf();
  renderVocabPanel();
}

function bindEvents(): void {
  const searchInput = document.querySelector<HTMLInputElement>("#course-search");
  searchInput?.addEventListener("input", (event) => {
    query = (event.target as HTMLInputElement).value;
    render();
    document.querySelector<HTMLInputElement>("#course-search")?.focus();
  });

  document
    .querySelectorAll<HTMLButtonElement>("[data-action='select']")
    .forEach((button) => {
      button.addEventListener("click", () => {
        const selected = courses.find((course) => course.id === button.dataset.courseId);
        if (selected) {
          activeCourse = selected;
          setLastCourseId(selected.id);
          render();
        }
      });
    });

  document
    .querySelectorAll<HTMLButtonElement>("[data-action='filter']")
    .forEach((button) => {
      button.addEventListener("click", () => {
        activeCategory = button.dataset.category ?? "全部";
        render();
      });
    });

  document
    .querySelectorAll<HTMLButtonElement>("[data-action='toggle-translate']")
    .forEach((btn) => {
      btn.addEventListener("click", () => {
        isTranslateMode = !isTranslateMode;
        render();
      });
    });

  document
    .querySelectorAll<HTMLButtonElement>("[data-action='toggle-vocab']")
    .forEach((btn) => {
      btn.addEventListener("click", () => {
        showVocabPanel = !showVocabPanel;
        renderVocabPanel();
      });
    });
}

async function renderActivePdf(): Promise<void> {
  const viewer = document.querySelector<HTMLDivElement>("#pdf-viewer");
  const course = activeCourse;
  const currentToken = ++renderToken;

  if (!viewer || !course) {
    return;
  }

  // 进度展示区域
  const showProgress = (text: string) => {
    const loading = viewer.querySelector<HTMLDivElement>(".pdf-loading");
    if (loading) loading.textContent = text;
  };

  try {
    showProgress(`正在加载 ${course.title} ...`);
    const loadingTask = pdfjsLib.getDocument({ url: courseUrl(course) });
    const pdf = await loadingTask.promise;

    if (currentToken !== renderToken) {
      return;
    }

    viewer.innerHTML = "";

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      if (currentToken !== renderToken) {
        return;
      }

      showProgress(`正在加载第 ${pageNumber} / ${pdf.numPages} 页 ...`);

      const page = await pdf.getPage(pageNumber);
      const baseViewport = page.getViewport({ scale: 1 });

      // 关键：用真实的 padding 计算可用宽度，避免 CSS 缩放挤压
      // PDF 是 A4 比例（1:√2≈1.414），如果用宽度算 scale，页面会按宽度撑满，高度超出时只滚
      const viewerStyle = window.getComputedStyle(viewer);
      const paddingX =
        parseFloat(viewerStyle.paddingLeft || "0") +
        parseFloat(viewerStyle.paddingRight || "0");
      const paddingY =
        parseFloat(viewerStyle.paddingTop || "0") +
        parseFloat(viewerStyle.paddingBottom || "0");
      const innerWidth = Math.max(0, viewer.clientWidth - paddingX);
      const innerHeight = Math.max(0, viewer.clientHeight - paddingY);

      // 留 4px 视觉余量，避免滚动条贴边
      const maxWidth = Math.max(320, innerWidth - 4);

      // 页面高度上限：可用高度 - 4px 余量 - 页面间距（首尾 18px gap）
      const maxHeight = Math.max(240, innerHeight - 22);

      // 同一个 scale 同时满足 width 和 height 上限，取较小者
      // 设最小 0.5 倍 scale 保护，避免 reader-panel 太矮时 PDF 内容被缩到看不清
      const widthScale = maxWidth / baseViewport.width;
      const heightScale = maxHeight / baseViewport.height;
      const scale = Math.max(0.5, Math.min(widthScale, heightScale, 2.5));

      const viewport = page.getViewport({ scale });
      const outputScale = Math.min(window.devicePixelRatio || 1, 2.5);

      const wrapper = document.createElement("div");
      wrapper.className = "pdf-page-wrapper";

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error("Canvas is not supported in this browser.");
      }

      canvas.width = Math.floor(viewport.width * outputScale);
      canvas.height = Math.floor(viewport.height * outputScale);
      canvas.style.width = `${Math.floor(viewport.width)}px`;
      canvas.style.height = `${Math.floor(viewport.height)}px`;
      canvas.setAttribute("aria-label", `${course.title} 第 ${pageNumber} 页`);

      wrapper.appendChild(canvas);
      viewer.appendChild(wrapper);

      await page.render({
        canvasContext: context,
        transform: outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : undefined,
        viewport,
      }).promise;

      if (currentToken !== renderToken) {
        return;
      }

      const textLayerBuilder = new pdfViewer.TextLayerBuilder({ pdfPage: page });
      await textLayerBuilder.render(viewport);
      textLayerBuilder.div.style.width = `${Math.floor(viewport.width)}px`;
      textLayerBuilder.div.style.height = `${Math.floor(viewport.height)}px`;
      wrapper.appendChild(textLayerBuilder.div);
    }
  } catch (error) {
    if (currentToken !== renderToken) {
      return;
    }

    const message = error instanceof Error ? error.message : "请使用新窗口打开。";
    viewer.innerHTML = `
      <div class="pdf-error">
        <strong>PDF 加载失败</strong>
        <span>${message}</span>
        <div class="pdf-error-actions">
          <a href="${courseUrl(course)}" target="_blank" rel="noreferrer">在新窗口打开</a>
          <a href="${courseUrl(course)}" download="${course.fileName}">下载 PDF</a>
        </div>
      </div>
    `;
  }
}

injectStyles();

// 启动时自动恢复最近一次打开的课程
const lastId = getLastCourseId();
if (lastId) {
  const last = courses.find((c) => c.id === lastId);
  if (last) activeCourse = last;
}

render();
setupTranslateListener();
