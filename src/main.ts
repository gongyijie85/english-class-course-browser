import "./styles.css";
import { Course, courseUrl, courses } from "./courses";

const appRoot = document.querySelector<HTMLDivElement>("#app");

if (!appRoot) {
  throw new Error("Missing app root");
}

const app = appRoot;

let activeCourse = courses[0];
let query = "";

const normalize = (value: string) => value.toLowerCase().trim();

function matchesCourse(course: Course, search: string): boolean {
  const normalizedSearch = normalize(search);
  if (!normalizedSearch) {
    return true;
  }

  const haystack = normalize(
    [course.title, course.fileName, course.summary, course.tags.join(" ")].join(" ")
  );

  return haystack.includes(normalizedSearch);
}

function renderCourseCard(course: Course): string {
  const isActive = course.id === activeCourse.id;
  const tags = course.tags.map((tag) => `<span>${tag}</span>`).join("");

  return `
    <article class="course-card ${isActive ? "is-active" : ""}" data-course-id="${course.id}">
      <button class="course-select" type="button" data-action="select" data-course-id="${course.id}">
        <span class="course-kicker">${course.size} · ${course.updated}</span>
        <strong>${course.title}</strong>
        <span class="course-summary">${course.summary}</span>
        <span class="tag-row">${tags}</span>
      </button>
      <div class="course-actions">
        <a href="${courseUrl(course)}" target="_blank" rel="noreferrer">打开</a>
        <a href="${courseUrl(course)}" download="${course.fileName}">下载</a>
      </div>
    </article>
  `;
}

function render(): void {
  const filteredCourses = courses.filter((course) => matchesCourse(course, query));
  const visibleActiveCourse =
    filteredCourses.find((course) => course.id === activeCourse.id) ?? filteredCourses[0] ?? activeCourse;

  if (visibleActiveCourse.id !== activeCourse.id) {
    activeCourse = visibleActiveCourse;
  }

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

        <div class="course-list" aria-live="polite">
          ${
            filteredCourses.length
              ? filteredCourses.map(renderCourseCard).join("")
              : `<p class="empty-state">没有找到匹配的课程资料。</p>`
          }
        </div>
      </section>

      <section class="reader-panel" aria-label="PDF 阅读器">
        <div class="reader-toolbar">
          <div>
            <p class="eyebrow">Now Reading</p>
            <h2>${activeCourse.title}</h2>
          </div>
          <div class="reader-actions">
            <a href="${courseUrl(activeCourse)}" target="_blank" rel="noreferrer">新窗口</a>
            <a href="${courseUrl(activeCourse)}" download="${activeCourse.fileName}">下载</a>
          </div>
        </div>
        <iframe
          title="${activeCourse.title}"
          src="${courseUrl(activeCourse)}"
          loading="lazy"
        ></iframe>
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
}

render();
