# Fieldnotes — Johnnie Tse's engineering blog

A static portfolio and long-form engineering blog built from HTML, CSS, and JavaScript. The home page organizes project stories and open-source contributions newest first. Each story has its own readable page with repository links, technical notes, diagrams, images, code excerpts, and contribution history where the public source supports it.

## Run locally

Open `index.html` in a browser, or start a local static server:

```powershell
python -m http.server 8000
```

Then visit <http://localhost:8000>.

## Deploy on Vercel

Import this repository in Vercel and use these settings:

- Framework preset: **Other**
- Build command: leave blank
- Output directory: `.`

The site is already static; Vercel serves `index.html` and the files beside it directly. No environment variables are required.

## Site files

- `index.html` — project and contribution archive
- `articles/` — individual story pages
- `contributions.html` — searchable public contribution ledger
- `posts.js`, `activity-data.js`, `contribution-stories.js`, `story-details.js`, `repo-history.js` — archive and story data
- `blog.js`, `article.css` — page rendering and styling
- `covers/`, `covers.js` — article images and diagrams

The archive reflects public-source research through November 8, 2026. Source repository links are included throughout the site.
