# Arnob Portfolio — Three.js scroll site

A static, deployable portfolio built around the supplied work. No build step is required.

## Local preview

Do **not** double-click `index.html`; ES modules and video behavior are more reliable through a local server.

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`.

The Three.js layer is loaded from cdnjs. If it cannot load, the site deliberately falls back to the CSS experience and all portfolio content still works.

## Cloudflare Pages — easiest deployment

### Option A: Direct Upload
Use this only if you are happy with manual uploads. Cloudflare does not let an existing Direct Upload project switch to Git integration later; you would create a new Pages project.

1. In Cloudflare, go to **Workers & Pages** → **Create** → **Pages** → **Upload assets / Direct Upload**.
2. Upload the contents of this folder (or the provided ZIP).
3. Cloudflare gives you a `*.pages.dev` preview URL.
4. Test desktop + mobile.
5. In the Pages project, open **Custom domains** → **Set up a custom domain** → enter `arnob58.com`.
6. If the domain's DNS is already on Cloudflare, the record is usually created automatically. Otherwise Cloudflare will tell you exactly which DNS record to add at the registrar/DNS provider.

### Option B: GitHub (recommended for ongoing edits)
1. Create a GitHub repository and put these files at the repository root.
2. In Cloudflare Pages choose **Connect to Git** and select the repository.
3. Framework preset: **None**.
4. Build command: leave blank (or use `exit 0`).
5. Build output directory: `.` (repository root).
6. Deploy, then add `arnob58.com` under **Custom domains**.
7. Future pushes to GitHub automatically redeploy the site.

## Before going live

- Replace or add contact / LinkedIn links in `index.html` when you want them visible.
- Check every video and PDF link.
- Confirm the claims/metrics still match the version you want recruiters to see.
- Keep filenames under `assets/` stable if you edit the copy only.

## Structure

- `index.html` — content and semantic structure
- `styles.css` — visual design, responsive layout, scroll presentation
- `main.js` — scroll behavior, counters, project switching, modal video, Three.js scene
- `assets/images` — optimized WebP portfolio images + posters
- `assets/videos` — web-optimized H.264 videos
- `assets/docs` — source portfolio PDFs
- `_headers` — useful Cloudflare Pages headers
