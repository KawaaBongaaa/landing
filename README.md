# pixPlace_pro_full

Static, SEO‑friendly, multi‑language landing ready for GitHub Pages.

## Language URLs
- English: `index.html`
- Russian: `ru.html`
- Spanish: `es.html`
- German: `de.html`
- French: `fr.html`
- Italian: `it.html`
- Portuguese: `pt.html`
- Japanese: `ja.html`
- Chinese: `zh.html`

All pages include `<link rel="alternate" hreflang="...">` for SEO.

## Lead & Payments
- Set `lead.mailto` and `lead.telegram` in `config.json`.
- Set `stripe.paymentLink` in `config.json` (static Payment Link recommended for GitHub Pages).

## Gallery
This site renders a native carousel (no Pinterest badge). Images are read from `gallery.json` (SEO‑friendly `alt`).
To sync with a Pinterest board, run the Node script below locally and commit the updated `gallery.json`.

### Update from board
1. `npm i node-fetch@3`
2. Edit `config.json` → `gallery.board`
3. `node tools/fetch_pinterest.mjs`
4. Commit `gallery.json`

> Due to Pinterest/CORS, real‑time client‑side scraping is not possible on static hosting without a proxy. The above keeps the site static and SEO‑friendly.



### Fixes applied
- Language dropdown closed by default; browser language auto-detection added.
- If gallery JSON files are missing the page shows demo images and a small notice explaining how to populate them.
