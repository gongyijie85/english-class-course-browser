import { copyFileSync, mkdirSync, readdirSync, statSync, unlinkSync, writeFileSync } from "node:fs";
import { basename, extname, join, resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const sourceDir = resolve(projectRoot, "..", "PDF");
const publicPdfDir = join(projectRoot, "public", "pdf");
const rootPdfDir = join(projectRoot, "pdf");
const coursesPath = join(projectRoot, "src", "courses.ts");

const knownMeta = {
  "课堂要点总结_Exercise_and_Health.pdf": {
    id: "exercise-health",
    title: "课堂要点总结：Exercise and Health",
    category: "课堂总结",
    tags: ["Health", "Discussion", "课堂总结"],
    summary: "围绕运动、健康习惯和课堂要点整理的阅读资料。"
  },
  "英语口语练习_课堂对话版.pdf": {
    id: "speaking-dialogue",
    title: "英语口语练习：课堂对话版",
    category: "口语对话",
    tags: ["Speaking", "Dialogue", "口语"],
    summary: "适合课堂复盘和跟读练习的英语口语对话材料。"
  },
  "英语时态学习资料_对话范文版.pdf": {
    id: "tense-dialogue",
    title: "英语时态学习资料：对话范文版",
    category: "语法时态",
    tags: ["Grammar", "Tenses", "时态"],
    summary: "通过对话范文理解常用英语时态的实际表达。"
  },
  "英语发音课程学习资料.pdf": {
    id: "pronunciation-course",
    title: "英语发音课程学习资料",
    category: "发音训练",
    tags: ["Pronunciation", "Speaking", "发音"],
    summary: "围绕音素、重音、连读和句子节奏整理的英语发音训练讲义。"
  },
  "英语复合句核心句型复习资料.pdf": {
    id: "complex-sentences",
    title: "英语复合句核心句型复习资料",
    category: "语法句型",
    tags: ["Grammar", "Sentence Patterns", "复合句"],
    summary: "复习目的、条件、方式、让步和伴随动作等复合句核心句型。"
  },
  "英语学习与面试技巧_课堂版.pdf": {
    id: "interview-skills",
    title: "英语学习与面试技巧：课堂版",
    category: "面试职场",
    tags: ["Interview", "Career", "面试"],
    summary: "面试场景下的英语表达、学习方法和课堂练习内容。"
  },
  "English_Class_Notes_Addictions.pdf": {
    id: "addictions-notes",
    title: "English Class Notes: Addictions",
    category: "主题讨论",
    tags: ["Addictions", "Notes", "Vocabulary"],
    summary: "Topic notes for discussing addictions, habits, and related vocabulary."
  },
  "english_class_summary.pdf": {
    id: "class-summary",
    title: "English Class Summary",
    category: "课堂总结",
    tags: ["Summary", "Review", "课堂总结"],
    summary: "A general class summary for quick review and after-class reading."
  },
  "English_Lesson_Trends_Dialogue.pdf": {
    id: "trends-dialogue",
    title: "English Lesson: Trends Dialogue",
    category: "主题讨论",
    tags: ["Trends", "Dialogue", "Discussion"],
    summary: "Dialogue-based material for talking about trends and opinions."
  },
  "English_Learning_Notes_Comprehensive.pdf": {
    id: "learning-notes-comprehensive",
    title: "英语综合学习笔记：面试·时态·发音",
    category: "综合笔记",
    tags: ["Interview", "Tenses", "Pronunciation", "Vocabulary", "综合"],
    summary: "覆盖日常表达、面试技巧、核心词汇、元音发音、5种过去与现在时态以及教师范文的综合学习笔记。"
  },
  "未来社会发展趋势探讨_课程版.pdf": {
    id: "future-society-trends",
    title: "未来社会发展趋势探讨",
    category: "主题讨论",
    tags: ["Future", "Society", "Trends", "Discussion", "未来"],
    summary: "围绕 AI 与就业、身份象征、房价与代际、婚恋与生育、个人主义与集体主义、长寿伦理、未来法律、科技与星际、AI 恋爱等 10 个话题展开的未来趋势综合讨论课。"
  }
};

function slugify(fileName) {
  return basename(fileName, extname(fileName))
    .normalize("NFKD")
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase() || "course";
}

function titleFromFile(fileName) {
  return basename(fileName, extname(fileName)).replace(/_/g, " ");
}

function inferMeta(fileName) {
  const name = titleFromFile(fileName);
  const lower = fileName.toLowerCase();
  const tags = ["PDF"];
  let category = "新资料";

  if (fileName.includes("时态") || lower.includes("tense") || lower.includes("grammar")) {
    category = "语法时态";
    tags.push("Grammar", "时态");
  } else if (fileName.includes("口语") || lower.includes("dialogue") || lower.includes("speaking")) {
    category = "口语对话";
    tags.push("Speaking", "Dialogue");
  } else if (fileName.includes("面试") || lower.includes("interview")) {
    category = "面试职场";
    tags.push("Interview");
  } else if (fileName.includes("总结") || lower.includes("summary")) {
    category = "课堂总结";
    tags.push("Summary");
  }

  return {
    id: slugify(fileName),
    title: name,
    category,
    tags,
    summary: "新加入的课程 PDF，可在线阅读或下载。"
  };
}

function formatSize(bytes) {
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

function formatDate(date) {
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`;
}

mkdirSync(publicPdfDir, { recursive: true });
mkdirSync(rootPdfDir, { recursive: true });

const pdfFiles = readdirSync(sourceDir)
  .filter((fileName) => fileName.toLowerCase().endsWith(".pdf"))
  .sort((a, b) => a.localeCompare(b, "zh-CN"));

const sourcePdfSet = new Set(pdfFiles);

for (const targetDir of [publicPdfDir, rootPdfDir]) {
  for (const fileName of readdirSync(targetDir)) {
    if (fileName.toLowerCase().endsWith(".pdf") && !sourcePdfSet.has(fileName)) {
      unlinkSync(join(targetDir, fileName));
    }
  }
}

const courses = pdfFiles.map((fileName) => {
  const sourcePath = join(sourceDir, fileName);
  const stat = statSync(sourcePath);
  copyFileSync(sourcePath, join(publicPdfDir, fileName));
  copyFileSync(sourcePath, join(rootPdfDir, fileName));

  return {
    ...(knownMeta[fileName] ?? inferMeta(fileName)),
    fileName,
    updated: formatDate(stat.mtime),
    size: formatSize(stat.size)
  };
});

const courseSource = `export type Course = {
  id: string;
  title: string;
  fileName: string;
  category: string;
  updated: string;
  size: string;
  tags: string[];
  summary: string;
};

export const courses: Course[] = ${JSON.stringify(courses, null, 2)};

export function courseUrl(course: Course): string {
  return \`pdf/\${encodeURIComponent(course.fileName)}\`;
}
`;

writeFileSync(coursesPath, courseSource);
console.log(`Synced ${courses.length} PDF files from ${sourceDir}`);
