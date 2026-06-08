# Changelog

## v2.3.0 - 2026-06-08

### 新增：未来社会发展趋势探讨（Future Society: Trends & Outlook）

- **新增课程 PDF**：`未来社会发展趋势探讨_课程版.pdf`（28 页，240 KB），整合自 `origin pdf/未来社会发展趋势探讨.pdf`
- **课程元数据**：标题"未来社会发展趋势探讨"，分类"主题讨论"，标签 Future / Society / Trends / Discussion / 未来
- **内容覆盖**（28 页）：10 个话题（AI 与就业、当代身份象征、房价与代际、婚恋与生育、个人主义 vs 集体主义、长寿与伦理、未来法律、科技与星际、AI 恋爱与外语、对未来的整体看法）；40 个核心词汇表；9 个实用表达子主题；10 个课堂对话场景；4 个引导练习 + 完整参考答案；口语任务；10 条复盘要点 + 话题总结表；课后练习（写作 / 词汇 / 听力）；附录：Speaker 3 & 4 课堂语法纠错
- **网站同步**：`scripts/sync-pdfs.mjs` 的 `knownMeta` 新增该 PDF 元数据；`node scripts/sync-pdfs.mjs` 同步 10 个 PDF；自动复制到 `public/pdf/` 和 `pdf/`；`src/courses.ts` 重新生成包含新条目
- **验证**：`npx tsc --noEmit` 通过；`npx vite build` 成功生成 dist

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
