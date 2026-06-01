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
