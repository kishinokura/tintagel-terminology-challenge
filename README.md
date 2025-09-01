# Tintagel Terminology Challenge (Vite + React + TypeScript)

Bilingual (EN/JA) mini-game built with Vite + React. ADHD-friendly: short rounds, immediate feedback, keyboard shortcuts.

## Quick Start
```bash
npm install
npm run dev
# open http://localhost:5173
```

## Build
```bash
npm run build
npm run preview  # local preview of dist/
```

## Deploy to GitHub Pages (official Actions)
1. **Edit the Vite `base`** value in `vite.config.ts`:
   - If your site will be at `https://USERNAME.github.io/` **or** at a custom domain → set `base: '/'`.
   - If your site will be at `https://USERNAME.github.io/REPO/` → set `base: '/REPO/'`.
2. Commit and push this repository to GitHub.
3. In **Settings → Pages**, set **Source** to **GitHub Actions**.
4. The workflow `.github/workflows/deploy.yml` builds and deploys on every push to `main`.

After deploy, your URL will be printed at the end of the workflow logs.

### Security notes
- Uses **official** GitHub Actions only (`actions/*`), no third-party deployers.
- Workflow uses the minimal required permissions: `contents: read`, `pages: write`, and `id-token: write`.
- No secrets are needed for GitHub Pages; do **not** commit API tokens.
