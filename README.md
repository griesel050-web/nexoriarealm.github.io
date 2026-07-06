# Nexoria Network Hub

Dark, futuristic multi-page website hub for the Nexoria Network.

## File Structure

```
nexoria-network/
├── index.html        ← Single HTML file, all 3 pages (Home / Network / Contact)
├── sites.json        ← ⭐ Edit this to add/remove/update your sites
├── css/
│   └── style.css     ← All styles (design tokens at the top)
├── js/
│   └── app.js        ← Loads sites.json, handles routing & rendering
└── README.md
```

## How to add a new site

Open `sites.json` and add an object to the `"sites"` array:

```json
{
  "id": "site-6",
  "name": "Nexoria Docs",
  "category": "Docs",
  "description": "Documentation and guides for the Nexoria ecosystem.",
  "url": "https://docs.nexoria.com",
  "icon": "◎",
  "status": "live",
  "tags": ["docs", "guides", "reference"]
}
```

### Field reference

| Field         | Required | Notes |
|---------------|----------|-------|
| `id`          | ✓        | Unique string, e.g. `site-6` |
| `name`        | ✓        | Display name |
| `category`    | ✓        | Used in filter bar — keep consistent |
| `description` | ✓        | 1–2 sentence summary |
| `url`         | ✓        | Full URL including `https://` |
| `icon`        | ✓        | Any single emoji or Unicode symbol |
| `status`      | ✓        | `live` \| `beta` \| `coming-soon` |
| `tags`        | ✓        | Array of lowercase strings |

## Updating branding / contact

Edit the `"network"` and `"contact"` blocks at the top of `sites.json`.

## Deployment

Just upload the whole folder to any static host (Netlify, Vercel, GitHub Pages, Cloudflare Pages). No build step needed.
