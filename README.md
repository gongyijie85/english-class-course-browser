# English Class PDF Library

Static course browser for the PDF files in `public/pdf`.

## Course List (v2.3.0)

| Category | Course | Level |
|----------|--------|-------|
| 课堂总结 | Exercise and Health / 锻炼与健康 | A1-A2 |
| 主题讨论 | Addictions in Modern Life / 现代生活中的成瘾问题与应对 | A1-A2 |
| 主题讨论 | Trends and Phenomena / 潮流与现象探讨 | A1-A2 |
| 主题讨论 | 未来社会发展趋势探讨（10 个话题：AI / 婚恋 / 房价） | B1-B2 |
| 课堂总结 | English Communication Class / 英语交流课课堂要点总结 | A1-A2 |
| 口语对话 | Speaking Practice / 英语口语表达练习 | A1-A2 |
| 面试职场 | Interview Skills / 英语学习与面试技巧 | A1-A2 |
| 语法时态 | English Tenses: Lesson 11 / 英语时态学习资料 | A1-A2 |
| 语法时态 | English Tenses: Dialogue Practice / 英语时态学习资料：对话范文版 | A1-A2 |
| 综合笔记 | 英语综合学习笔记：面试·时态·发音（18 页综合复盘） | A1-A2 |

Each course PDF follows a unified structure: Cover, Learning Goals, Warm-up Questions, Key Vocabulary, Useful Expressions, Dialogue/Reading, Guided Practice, Speaking Task, Review, Homework.

## Local development

```powershell
npm install
npm run dev
```

## Build and preview

```powershell
npm run build
npm run preview
```

## Add new PDFs

1. Put new PDF files into `D:\English Class\PDF`.
2. Run:

```powershell
npm run sync:pdfs
npm run build
git add .
git commit -m "Add course PDFs"
git push
```

The sync command copies PDFs into both `public/pdf` and `pdf`, then updates
`src/courses.ts`. Render redeploys automatically after `git push`.

The in-page reader uses PDF.js canvas rendering. The browser only downloads a
file when the user explicitly clicks `下载`.

## Translation Plugin (v1.1.0)

Built-in word-translation plugin inspired by Language Reactor:

- **Translate Mode**: Toggle the "翻译模式" button in the reader toolbar. Once on, select any English word or sentence in the PDF to see the Chinese translation.
- **Translation Popup**: A popup appears near the selection showing the original text and translation. Click "+ 加入生词本" to save it.
- **Vocabulary Panel**: Click "生词本" to open the vocabulary panel from the right side. All saved words are stored in browser localStorage and persist across sessions.
- **Translation Source**: Uses the free MyMemory Translation API (rate-limited). Results are cached in memory during the session.

## Regenerate PDFs

PDF generation scripts are in `D:\English Class\`:

- `pdf_template.py` - Shared template engine (styles, layout, helper functions)
- `gen_course1.py` through `gen_course8.py` - Individual course content scripts

To regenerate all PDFs:

```powershell
cd "D:\English Class"
python gen_course1.py
python gen_course2.py
# ... etc
cd "D:\English Class\course-browser"
npm run sync:pdfs
npm run build
```

## Render Static Site

Use these settings in Render:

- Service Type: Static Site
- Root Directory: leave empty when deploying `gongyijie85/english-class-course-browser`
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`

This directory also includes `render.yaml` for Blueprint-based setup.

Render Static Sites are served from static storage/CDN and do not sleep like free
Web Services. If the site shows a cold-start page or stops after inactivity,
recreate it as a Static Site instead of a Web Service.
