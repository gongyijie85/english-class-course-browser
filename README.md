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
- Root Directory: `course-browser`
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`

This directory also includes `render.yaml` for Blueprint-based setup.
