# Nexoria Network Hub

Red/dark futuristic multi-page website hub — 4 pages: Home, Network, Socials, Contact.

## File Structure

```
nexoria-network/
├── index.html        ← All 4 pages (SPA with hash routing)
├── sites.json        ← ⭐ Edit to add/remove/update your sites
├── social.json       ← ⭐ Edit to add/remove social media links
├── css/
│   └── style.css     ← All styles (tweak tokens at top to retheme)
├── js/
│   └── app.js        ← Loads JSON files, handles routing & rendering
└── README.md
```

## How to add a new site — sites.json

```json
{
  "id": "site-4",
  "name": "Nexo Docs",
  "category": "Docs",
  "description": "Documentation and guides for the Nexo ecosystem.",
  "url": "https://docs.nexosites.xyz",
  "status": "live",
  "tags": ["docs", "guides"]
}
```

Status options: `live` | `beta` | `coming-soon`

Icons are loaded automatically from each site's favicon via Google's favicon service.

## How to add a social — social.json

```json
{
  "platform": "TikTok",
  "handle": "@nexosites",
  "url": "https://tiktok.com/@nexosites",
  "icon": "tiktok"
}
```

Supported icon values: `x` `instagram` `github` `linkedin` `youtube` `discord` `tiktok` `facebook`

## Deployment

Upload the entire folder to Netlify, Vercel, GitHub Pages, or Cloudflare Pages. No build step needed.
