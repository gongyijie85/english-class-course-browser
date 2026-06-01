# Changelog

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
