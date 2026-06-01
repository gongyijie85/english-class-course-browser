# English Class PDF Library

Static course browser for the PDF files in `public/pdf`.

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
