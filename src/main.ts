import styles from "./styles.css?inline";
import { Course, courseUrl, courses } from "./courses";

const appRoot = document.querySelector<HTMLDivElement>("#app");

if (!appRoot) {
  throw new Error("Missing app root");
}

const app = appRoot;

let activeCourse: Course | null = null;
let query = "";
let activeCategory = "全部";

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

function matchesCourse(course: Course, search: string): boolean {
  if (activeCategory !== "全部" && course.category !== activeCategory) {
    return false;
  }

  const normalizedSearch = normalize(search);
  if (!normalizedSearch) {
    return true;
  }

  const haystack = normalize(
    [course.title, course.fileName, course.summary, course.tags.join(" ")].join(" ")
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
  const tags = course.tags.map((tag) => `<span>${tag}</span>`).join("");

  return `
    <article class="course-card ${isActive ? "is-active" : ""}" data-course-id="${course.id}">
      <div class="course-body">
        <span class="course-kicker">${course.size} · ${course.updated}</span>
        <strong>${course.title}</strong>
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
        <iframe
          title="${activeCourse.title}"
          src="${courseUrl(activeCourse)}"
          loading="lazy"
        ></iframe>
      `
    : `
        <div class="reader-empty">
          <p class="eyebrow">Ready</p>
          <h2>选择左侧资料后开始阅读</h2>
          <p>只有点击“阅读”才会加载 PDF；标签、搜索和分类不会触发下载。</p>
        </div>
      `;
  const readerActions = activeCourse
    ? `
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
              `
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
                    `
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
}

function bindEvents(): void {
  const searchInput = document.querySelector<HTMLInputElement>("#course-search");
  searchInput?.addEventListener("input", (event) => {
    query = (event.target as HTMLInputElement).value;
    render();
    document.querySelector<HTMLInputElement>("#course-search")?.focus();
  });

  document.querySelectorAll<HTMLButtonElement>("[data-action='select']").forEach((button) => {
    button.addEventListener("click", () => {
      const selected = courses.find((course) => course.id === button.dataset.courseId);
      if (selected) {
        activeCourse = selected;
        render();
      }
    });
  });

  document.querySelectorAll<HTMLButtonElement>("[data-action='filter']").forEach((button) => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.category ?? "全部";
      render();
    });
  });
}

injectStyles();
render();
