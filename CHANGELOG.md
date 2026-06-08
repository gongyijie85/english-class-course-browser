# Changelog

## v2.4.0 - 2026-06-08

### 修复：PDF 页面被挤压变形

- **根因**：
  1. CSS 中 `.pdf-viewer canvas { max-width: 100%; height: auto; }` 会在容器宽度变化时，强行把 canvas 等比缩小到容器宽度，破坏 PDF 原本的 A4 比例
  2. `main.ts` 中 `availableWidth = viewer.clientWidth - 32` 写死了 32px 偏移，但实际 viewer 的 padding 是 `18px*2 = 36px`，与 22px 历史值都不匹配
  3. reader-toolbar 在长课程标题（"英语复合句核心句型复习资料"等）+ 翻译/生词本按钮下变得很高，把 PDF viewer 高度挤得很小
  4. `.pdf-page-wrapper` 又有 `margin-bottom: 18px` 又处在 grid 的 `gap: 18px` 里，页间距视觉上是 36px
- **修复方案**：
  1. JS 端用 `getComputedStyle` 拿真实 padding，同时按"可用宽度"和"可用高度"双约束取较小 scale，PDF 页面不再被 CSS 强制拉伸
  2. canvas 移除 `max-width: 100%` 限制，加上 `display: block`，viewer 容器允许横向滚动
  3. reader-toolbar padding 由 `20px 22px` 收到 `14px 22px`，标题字号减小并允许换行，让 toolbar 更紧凑
  4. `.reader-panel` 改为 `grid-template-rows: auto minmax(0, 1fr)`，保证 PDF viewer 能被压缩并出现滚动条
  5. `.pdf-page-wrapper` 去掉 `margin-bottom`，避免与 grid gap 重复造成过大间距
  6. 加 `Math.max(0.5, ...)` 最小 scale 保护，避免 reader-panel 太矮时内容看不清
- **效果**：大屏下 PDF 完整显示 A4 比例不会被压缩；窗口收窄时 viewer 出现横向滚动条而不是把页面缩变形；中长课程标题不再撑高 toolbar

## v2.3.0 - 2026-06-08

### 修复：PDF.js Worker 加载失败

- **根因**：构建产物中的 `pdf.worker-*.mjs` 在 Render 静态部署环境中，浏览器 `import()` 动态加载失败（`Setting up fake worker failed: "Failed to fetch dynamically imported module"`）
- **修复方案**：改用经典 Web Worker 模式——`new Worker(new URL("pdfjs-dist/build/pdf.worker.mjs", import.meta.url), { type: "module" })`，并将 `pdfjsLib.GlobalWorkerOptions.workerPort` 指向该 Worker 实例。这种方式不依赖 dynamic import()，对部署环境更友好
- **效果**：本地 Playwright 验证 28 页 PDF 全部 Canvas 渲染成功，0 page error，0 failed request

### 优化：最新课程展示与学习连续性

- **NEW 徽章**：按文件修改时间倒序，自动给最近 2 个课程加 NEW 徽章（醒目红橙色）
- **突出样式**：带 NEW 的课程卡片用 clay 红色加粗边框，渐变背景，一眼可见
- **加载进度**：点击阅读时显示"正在加载第 N / M 页..."，让用户知道渲染进度
- **加载失败兜底**：PDF 加载失败时不再只显示错误信息，自动提供"在新窗口打开"和"下载 PDF"两个备用入口
- **最近阅读自动恢复**：使用 localStorage 记忆上次打开的课程 ID，下次进入自动打开该 PDF（无需点击）

### 新增：未来社会发展趋势探讨课程

- **新增课程 PDF**：`未来社会发展趋势探讨_课程版.pdf`，10 页 B1-B2 级别
- **课程元数据**：标题"未来社会发展趋势探讨"，分类"主题讨论"，标签 Trends/Society/AI/B1-B2
- **内容覆盖**：AI 与就业、身份象征、房价与代际、婚恋与生育、个人与集体、长寿伦理、未来法律、科技、AI 恋爱等 10 个话题

## v2.2.0 - 2026-06-03

### 新增：综合学习笔记（面试 + 时态 + 发音）

- **新增课程 PDF**：`English_Learning_Notes_Comprehensive.pdf`，复制自 `C:\Users\Administrator\Documents\English_Learning_Notes.pdf`
- **课程元数据**：标题"英语综合学习笔记：面试·时态·发音"，分类"综合笔记"，标签 Interview/Tenses/Pronunciation/Vocabulary
- **内容覆盖**（18 页）：日常对话、面试技巧、同义词替换表、核心词汇精讲、元音发音规律、5 种过去与现在时态精讲、3 篇教师范文、学习建议
- **网站同步**：`sync:pdfs` 共同步 9 个 PDF；`build` 输出 dist 正常

## v1.1.0 - 2026-06-01

### 新增：划词翻译 + 生词本插件

- **PDF 文本层渲染**：集成 `pdfjs-dist` 的 `TextLayerBuilder`，在 PDF canvas 上叠加透明文本层，支持鼠标选中文本
- **划词翻译**：阅读器工具栏新增"翻译模式"开关，开启后选中任意英文单词或句子，自动调用 MyMemory 免费翻译 API 显示中文翻译
- **翻译浮窗**：选中文字后弹出翻译结果浮窗，显示原文和译文，带有关闭按钮
- **生词本**：翻译浮窗支持"加入生词本"按钮，收藏的单词永久保存在浏览器 localStorage 中
- **生词本面板**：阅读器工具栏新增"生词本"按钮，点击后从右侧滑出面板，可查看所有收藏单词及翻译，支持逐条删除
- **翻译缓存**：内存级翻译结果缓存，避免重复请求同一文本
- **智能过滤**：纯中文文本、过短文本（<2字符）、过长文本（>300字符）自动跳过翻译

## v2.1.0 - 2026-06-01

### Clarity and Readability Improvements

Comprehensive readability optimization for all 8 course PDFs:

- **Font sizes increased**: body 10pt → 11.5pt, Chinese 9pt → 10.5pt, vocab table 8pt → 9.5pt
- **Line spacing widened**: leading increased ~20% across all styles (e.g. body 15pt → 18pt)
- **Contrast improved**: muted color darkened from #5d6d7e → #3d4654, dark text from #1c1917 → #1a1a2e
- **Margins widened**: 20mm → 22mm for more breathing room
- **Vocab table**: larger cell padding, thicker grid lines, explicit leading set to 14pt
- **Footer**: font size 8pt → 9pt, line thickness 0.3 → 0.4

## v2.0.0 - 2026-06-01

### Major: Unified PDF Course Material Redesign

All 8 course PDFs have been redesigned with a unified professional template, following English language teaching methodology for adult learners.

#### Template Design
- Unified structure: Cover Page, Learning Goals, Warm-up Questions, Key Vocabulary, Useful Expressions, Dialogue/Reading, Guided Practice, Speaking Task, Review, Homework
- Consistent fonts: Calibri/CalibriB (English) + NotoSansSC (Chinese)
- Professional color scheme: Dark blue (#1a5276) primary, medium blue (#2e86c1) secondary
- A4 format with 20mm margins, page numbers and course title in footer
- Vocabulary tables with dark blue headers and alternating row backgrounds
- Bilingual dialogue format: speaker bold blue, English indented, Chinese gray annotation

#### Course PDFs Regenerated
| Course | Title | Pages |
|--------|-------|-------|
| Exercise and Health | 锻炼与健康 | 13 |
| Addictions in Modern Life | 现代生活中的成瘾问题与应对 | 13 |
| Trends and Phenomena | 潮流与现象探讨 | 14 |
| English Communication Class | 英语交流课课堂要点总结 | 13 |
| Speaking Practice | 英语口语表达练习 | 13 |
| Interview Skills | 英语学习与面试技巧 | 12 |
| English Tenses: Lesson 11 | 英语时态学习资料 | 16 |
| English Tenses: Dialogue Practice | 英语时态学习资料：对话范文版 | 15 |

#### Content Improvements
- Added Learning Goals and Warm-up Questions to all courses
- Expanded vocabulary tables with pronunciation, POS, and example sentences
- Preserved original classroom dialogues (范文) as core content
- Added expanded example sentences (2+ per vocabulary word)
- Created Guided Practice exercises (fill-in-blank, true/false, matching)
- Added Speaking Tasks (description, debate, role-play)
- Added Review section with key takeaways and self-check questions
- Added Homework section with writing, vocabulary review, and listening practice
- Included answer keys for all exercises

#### Technical Fixes
- Downgraded pdfjs-dist from v6.0.227 to v4.10.38 (fixes Promise.try compatibility)
- Fixed RenderParameters API change (removed `canvas` property)
- All PDFs render correctly via PDF.js in the course browser

## v1.0.0 - 2026-05-31

### Initial Release
- Static course browser with PDF.js viewer
- 8 course PDFs with basic content
- Category filtering and search
- Render Static Site deployment
