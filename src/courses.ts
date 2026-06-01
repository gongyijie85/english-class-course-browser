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
    "updated": "2026-06-01 16:25",
    "size": "107 KB"
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
    "updated": "2026-06-01 16:25",
    "size": "112 KB"
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
    "updated": "2026-06-01 16:25",
    "size": "109 KB"
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
    "updated": "2026-06-01 16:25",
    "size": "108 KB"
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
    "updated": "2026-06-01 16:25",
    "size": "113 KB"
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
    "updated": "2026-06-01 16:25",
    "size": "108 KB"
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
    "updated": "2026-06-01 16:25",
    "size": "114 KB"
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
    "updated": "2026-06-01 16:25",
    "size": "110 KB"
  }
];

export function courseUrl(course: Course): string {
  return `pdf/${encodeURIComponent(course.fileName)}`;
}
