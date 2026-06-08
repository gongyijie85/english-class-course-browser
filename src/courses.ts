export type Course = {
  id: string;
  title: string;
  fileName: string;
  category: string;
  updated: string;
  size: string;
  tags: string[];
  summary: string;
};

export const courses: Course[] = [
  {
    "id": "exercise-health",
    "title": "课堂要点总结：Exercise and Health",
    "category": "课堂总结",
    "tags": [
      "Health",
      "Discussion",
      "课堂总结"
    ],
    "summary": "围绕运动、健康习惯和课堂要点整理的阅读资料。",
    "fileName": "课堂要点总结_Exercise_and_Health.pdf",
    "updated": "2026-06-01 17:00",
    "size": "143 KB"
  },
  {
    "id": "future-society-trends",
    "title": "未来社会发展趋势探讨",
    "category": "主题讨论",
    "tags": [
      "Future",
      "Society",
      "Trends",
      "Discussion",
      "未来"
    ],
    "summary": "围绕 AI 与就业、身份象征、房价与代际、婚恋与生育、个人主义与集体主义、长寿伦理、未来法律、科技与星际、AI 恋爱等 10 个话题展开的未来趋势综合讨论课。",
    "fileName": "未来社会发展趋势探讨_课程版.pdf",
    "updated": "2026-06-08 12:05",
    "size": "235 KB"
  },
  {
    "id": "pronunciation-course",
    "title": "英语发音课程学习资料",
    "category": "发音训练",
    "tags": [
      "Pronunciation",
      "Speaking",
      "发音"
    ],
    "summary": "围绕音素、重音、连读和句子节奏整理的英语发音训练讲义。",
    "fileName": "英语发音课程学习资料.pdf",
    "updated": "2026-06-01 17:00",
    "size": "217 KB"
  },
  {
    "id": "complex-sentences",
    "title": "英语复合句核心句型复习资料",
    "category": "语法句型",
    "tags": [
      "Grammar",
      "Sentence Patterns",
      "复合句"
    ],
    "summary": "复习目的、条件、方式、让步和伴随动作等复合句核心句型。",
    "fileName": "英语复合句核心句型复习资料.pdf",
    "updated": "2026-06-01 17:00",
    "size": "164 KB"
  },
  {
    "id": "tense-dialogue",
    "title": "英语时态学习资料：对话范文版",
    "category": "语法时态",
    "tags": [
      "Grammar",
      "Tenses",
      "时态"
    ],
    "summary": "通过对话范文理解常用英语时态的实际表达。",
    "fileName": "英语时态学习资料_对话范文版.pdf",
    "updated": "2026-06-01 17:00",
    "size": "148 KB"
  },
  {
    "id": "interview-skills",
    "title": "英语学习与面试技巧：课堂版",
    "category": "面试职场",
    "tags": [
      "Interview",
      "Career",
      "面试"
    ],
    "summary": "面试场景下的英语表达、学习方法和课堂练习内容。",
    "fileName": "英语学习与面试技巧_课堂版.pdf",
    "updated": "2026-06-01 17:00",
    "size": "207 KB"
  },
  {
    "id": "addictions-notes",
    "title": "English Class Notes: Addictions",
    "category": "主题讨论",
    "tags": [
      "Addictions",
      "Notes",
      "Vocabulary"
    ],
    "summary": "Topic notes for discussing addictions, habits, and related vocabulary.",
    "fileName": "English_Class_Notes_Addictions.pdf",
    "updated": "2026-06-01 17:00",
    "size": "188 KB"
  },
  {
    "id": "class-summary",
    "title": "English Class Summary",
    "category": "课堂总结",
    "tags": [
      "Summary",
      "Review",
      "课堂总结"
    ],
    "summary": "A general class summary for quick review and after-class reading.",
    "fileName": "english_class_summary.pdf",
    "updated": "2026-06-01 17:00",
    "size": "188 KB"
  },
  {
    "id": "learning-notes-comprehensive",
    "title": "英语综合学习笔记：面试·时态·发音",
    "category": "综合笔记",
    "tags": [
      "Interview",
      "Tenses",
      "Pronunciation",
      "Vocabulary",
      "综合"
    ],
    "summary": "覆盖日常表达、面试技巧、核心词汇、元音发音、5种过去与现在时态以及教师范文的综合学习笔记。",
    "fileName": "English_Learning_Notes_Comprehensive.pdf",
    "updated": "2026-06-03 19:40",
    "size": "298 KB"
  },
  {
    "id": "trends-dialogue",
    "title": "English Lesson: Trends Dialogue",
    "category": "主题讨论",
    "tags": [
      "Trends",
      "Dialogue",
      "Discussion"
    ],
    "summary": "Dialogue-based material for talking about trends and opinions.",
    "fileName": "English_Lesson_Trends_Dialogue.pdf",
    "updated": "2026-06-01 17:00",
    "size": "201 KB"
  }
];

export function courseUrl(course: Course): string {
  return `pdf/${encodeURIComponent(course.fileName)}`;
}
