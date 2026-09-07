# _FlareCMS Setup Guide

## Quick Start (Development)

### 1. Install Dependencies
```bash
cd /Users/vasilkoff/Projects/latviansof/_FlareCMS
npm install
```

### 2. Run Full Stack (Frontend + Mock API)

**Option A: Both servers together**
```bash
npm run dev:full
```
- Frontend: http://localhost:3000
- API: http://localhost:3001

**Option B: Separately (for debugging)**
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - API
npm run api
```

### 3. Open Browser
http://localhost:3000

---

## Project Structure

```
_FlareCMS/
├── src/
│   ├── api/
│   │   └── mock-server.ts          # 🆕 Mock REST API with sample blog posts
│   ├── theme.ts                    # Material-UI + Payload CMS aesthetic
│   ├── App.tsx                     # Main layout with sidebar
│   ├── Sidebar.tsx                 # Navigation with icons
│   ├── PostDetail.tsx              # Post view + modern styling
│   ├── Editor.tsx                  # Markdown editor
│   ├── index.tsx                   # App bootstrap
│   └── ...
├── public/
│   └── index.html                  # Vite HTML entry
├── MIGRATIONS_REFERENCE.md         # 🆕 Database migrations guide
├── SETUP.md                        # This file
├── package.json                    # 🆕 Updated with express, cors
├── vite.config.ts                  # Vite bundler config
├── tsconfig.json                   # TypeScript config
└── ...
```

---

## Features

### ✅ Frontend (_FlareCMS)
- **Dark Theme:** Payload CMS inspired (#3291ff primary, #0f0f0f background)
- **Responsive Layout:** Sidebar navigation + main content
- **Markdown Editor:** Split-pane (textarea + live preview)
- **Post Management:** Create, read, update, delete blog posts
- **Labels:** Tag system with cloud display
- **Pages:** Static pages separate from blog posts

### ✅ Backend (Mock API)
- `/api/posts` - List/create posts
- `/api/posts/:id` - Get/update/delete single post
- `/api/labels` - List all labels/tags
- `/api/posts/label/:label` - Filter by label

### 📦 Sample Data
The mock API ships with 3 sample blog posts demonstrating:
- Post with labels
- Post with HTML content
- Static page

---

## Database Integration Options

### Option 1: Mock API (Current - Dev/Demo)
```bash
npm run dev:full
# Uses in-memory data, resets on restart
```
✅ **Pros:** Zero setup, instant dev experience  
❌ **Cons:** Data lost on restart, not persistent

### Option 2: Payload CMS (Production)
```typescript
// src/App.tsx
const API_BASE = process.env.REACT_APP_API_URL || 
  "https://latviansofdarwin.org.au/api";

// Then use: fetch(`${API_BASE}/posts?draft=true`)
```
✅ **Pros:** Production-ready, full CMS features  
❌ **Cons:** Requires Payload backend running

### Option 3: SonicJS (Alternative CMS)
```typescript
// Use /api/documents endpoints
const API_BASE = "http://sonicjs-server/api";
```

### Option 4: SQLite + Better-Auth (Full Stack)
Use the SonicJS migrations from `/_SonicJS/latviansof/migrations/`:
```bash
# 1. Create database
sqlite3 blog.db < /_SonicJS/latviansof/migrations/0001_core.sql
sqlite3 blog.db < /_SonicJS/latviansof/migrations/0002_documents.sql

# 2. Update mock-server.ts to query SQLite instead of in-memory
# 3. Deploy together
```

---

## API Endpoints Reference

All endpoints return JSON. Base URL: `http://localhost:3001` (dev)

### GET /api/posts
List all posts with optional filters

**Query Parameters:**
- `type` - "post" | "page" (default: "post")
- `status` - "publish" | "draft" (default: "publish")
- `limit` - Number of results (default: 20)

**Example:**
```bash
curl http://localhost:3001/api/posts?type=post&limit=5
```

**Response:**
```json
{
  "items": [
    {
      "rowid": 1,
      "title": "Welcome to FlareCMS",
      "content": "<h2>Getting Started</h2>...",
      "type": "post",
      "status": "publish",
      "published": 1725360000000,
      "updated": 1725360000000,
      "labels": ["welcome", "cms"]
    }
  ]
}
```

### GET /api/posts/:id
Get a single post by ID

**Example:**
```bash
curl http://localhost:3001/api/posts/1
```

### POST /api/posts
Create a new post

**Body:**
```json
{
  "title": "New Post",
  "content": "# Markdown content",
  "type": "post",
  "status": "publish",
  "labels": ["tag1", "tag2"]
}
```

### PUT /api/posts/:id
Update a post

### DELETE /api/posts/:id
Delete a post

### GET /api/labels
List all labels with post counts

**Response:**
```json
{
  "items": [
    { "name": "welcome", "count": 1 },
    { "name": "design", "count": 2 }
  ]
}
```

### GET /api/posts/label/:label
Get all posts with a specific label

---

## Development Workflow

### 1. Add New Features
```bash
# Edit src/App.tsx, src/Sidebar.tsx, etc.
npm run dev:full
# Changes auto-reload (HMR)
```

### 2. Update Mock Data
Edit `src/api/mock-server.ts`:
```typescript
const mockPosts = [
  // Add/modify posts here
];
```
Restart API server (Ctrl+C, `npm run api`)

### 3. Add Real Backend
- Connect to Payload CMS `/api` endpoints
- Update API_BASE URL
- Run Payload Worker locally or use production

### 4. Build for Production
```bash
npm run build
npm run build-all  # Also builds Cloudflare Functions if needed
```

---

## Comparison: Production vs Local

| Feature | Production (latviansofdarwin.org.au) | Local (_FlareCMS) |
|---------|--------------------------------------|------------------|
| **Engine** | Next.js + Payload CMS | Vite + React + Mock API |
| **Purpose** | Main website | Blog CMS admin tool |
| **Theme** | Burgundy/gold | Dark + Payload blue |
| **Database** | Cloudflare D1 (SQLite) | In-memory (dev) |
| **URL** | latviansofdarwin.org.au | localhost:3000 |
| **API** | /api/* (Payload) | localhost:3001 (Mock) |
| **Users** | Public website | Internal admin tool |

---

## Troubleshooting

### Port 3000/3001 Already in Use
```bash
# Kill existing processes
pkill -f "node.*3000"
pkill -f "vite"

# Or use different ports
PORT=3010 npm run dev
API_PORT=3011 npm run api
```

### API Not Responding
```bash
# Check if running
curl http://localhost:3001/api/posts

# Restart
npm run api
```

### Styling Issues
- Check `src/theme.ts` for Material-UI theme
- Verify `src/index.tsx` has `<ThemeProvider>`
- Clear browser cache: `Ctrl+Shift+Delete`

### Build Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
npm install

# Rebuild
npm run build
```

---

## Next Steps

1. ✅ Frontend UI complete (Vite + React + MUI)
2. ✅ Mock API running (mock-server.ts)
3. ⏳ **Connect to production Payload CMS** (update API_BASE)
4. ⏳ Add authentication (login form)
5. ⏳ Add post creation/editing UI
6. ⏳ Deploy to Cloudflare Workers Pages

---

## Related Files

- **Migrations:** `MIGRATIONS_REFERENCE.md`
- **Theme:** `src/theme.ts`
- **Production Site:** `/Users/vasilkoff/Projects/latviansof/src/payload.config.ts`
- **SonicJS CMS:** `/_SonicJS/latviansof/migrations/`
- **Project Docs:** `/Users/vasilkoff/Projects/latviansof/AGENTS.md`

---

**Last Updated:** September 3, 2026  
**Status:** ✅ Ready for development
