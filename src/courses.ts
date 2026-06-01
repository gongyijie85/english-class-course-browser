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
    "updated": "2026-06-01 14:26",
    "size": "178 KB"
  },
  {
    "id": "speaking-dialogue",
    "title": "英语口语练习：课堂对话版",
    "category": "口语对话",
    "tags": [
      "Speaking",
      "Dialogue",
      "口语"
    ],
    "summary": "适合课堂复盘和跟读练习的英语口语对话材料。",
    "fileName": "英语口语练习_课堂对话版.pdf",
    "updated": "2026-06-01 14:50",
    "size": "162 KB"
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
    "updated": "2026-06-01 15:10",
    "size": "148 KB"
  },
  {
    "id": "lesson11-tenses",
    "title": "英语时态学习资料：Lesson 11",
    "category": "语法时态",
    "tags": [
      "Grammar",
      "Lesson 11",
      "时态"
    ],
    "summary": "Lesson 11 的时态知识点、例句和课堂学习资料。",
    "fileName": "英语时态学习资料_Lesson11.pdf",
    "updated": "2026-06-01 15:05",
    "size": "152 KB"
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
    "updated": "2026-06-01 15:00",
    "size": "158 KB"
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
    "updated": "2026-06-01 14:33",
    "size": "177 KB"
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
    "updated": "2026-06-01 14:45",
    "size": "190 KB"
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
    "updated": "2026-06-01 14:40",
    "size": "191 KB"
  }
];

export function courseUrl(course: Course): string {
  return `pdf/${encodeURIComponent(course.fileName)}`;
}
