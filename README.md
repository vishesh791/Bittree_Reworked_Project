# Bittree — Personal Link Page Builder

Bittree is a full-stack web application for creating a public mini-profile that gathers a person's important links in one shareable page.

## Features
- Responsive landing page with a custom visual identity.
- Handle validation and unique public profile URLs.
- Link editor with add/remove controls and a live preview.
- Optional profile image and short bio.
- Server-side validation for handles, links, and profile image URLs.
- MongoDB persistence and public profile rendering.
- Accessible labels, loading feedback, and clear error states.

## Tech stack
- **Next.js 15 App Router** — pages, layouts, dynamic routes, and server-rendered public profiles.
- **React 18** — interactive builder, controlled inputs, and live preview.
- **JavaScript (ES2022+)** — client and server logic.
- **Tailwind CSS 3 + custom CSS** — utility styling and responsive design system.
- **MongoDB Node.js Driver** — persistence for profile documents.
- **React Toastify** — user feedback for publish actions.
- **Git/GitHub** — version control (recommended workflow).

## Requirements
- Node.js 20 or newer recommended.
- npm.
- A MongoDB database (local or MongoDB Atlas).

## Setup
1. Extract the ZIP and open the project directory in VS Code.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env.local` in the project root (do not commit this file):
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/?retryWrites=true&w=majority
   ```
   Replace the placeholder with your own connection string. Ensure the database user's permissions and Atlas network access are configured.
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:3000`.

## Data model
Database: `bittree`  
Collection: `links`

Example document (illustrative):
```json
{
  "handle": "alex-morgan",
  "pic": "https://example.com/avatar.jpg",
  "desc": "Designer and maker.",
  "links": [
    { "linktext": "Portfolio", "link": "https://example.com" }
  ],
  "createdAt": "2026-01-01T00:00:00.000Z"
}
```

For robust uniqueness under concurrent requests, create a unique index once in MongoDB:
```javascript
db.links.createIndex({ handle: 1 }, { unique: true })
```

## Routes
- `/` — marketing landing page and handle entry.
- `/generate?handle=yourname` — profile builder.
- `/<handle>` — public profile page.
- `POST /api/add` — validates and stores a new profile.

## Important production notes
- Configure `MONGODB_URI` in the deployment platform's environment settings; never expose it with a `NEXT_PUBLIC_` prefix.
- The original ZIP contained a local `.env.local`; it is intentionally excluded from this deliverable. Rotate the database password if the old value was ever committed or shared.
- Add authentication/edit/delete controls before treating this as a production service. At present, profiles are public and handles are intended to be claimed once.
- User-provided profile images are remote URLs. For a production-grade app, consider an image upload provider and stricter image-host policy.
- The original project archive included `.next` and `node_modules`; both are excluded from this clean source ZIP.

## Interview framing
Describe it as a **personal link-page builder**, not as a clone of a specific commercial product. Explain your own design decisions, validation rules, database schema, API route, and responsive preview. Do not claim features that are not implemented (for example, OAuth, analytics, drag-and-drop, or custom themes).
