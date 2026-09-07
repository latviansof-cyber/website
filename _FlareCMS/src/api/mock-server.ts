import express from 'express';
import cors from 'cors';

// Mock blog data matching _FlareCMS schema
const mockPosts = [
  {
    rowid: 1,
    title: "Welcome to FlareCMS",
    content: "<h2>Getting Started</h2><p>FlareCMS is a modern blog management interface. This is your first blog post!</p>",
    type: "post",
    status: "publish",
    published: Date.now() - 86400000, // 1 day ago
    updated: Date.now(),
    labels: ["welcome", "cms"]
  },
  {
    rowid: 2,
    title: "Dark Theme Design System",
    content: "<h2>Modern UI</h2><p>Built with Material-UI and inspired by Payload CMS aesthetic.</p><ul><li>Dark background (#0f0f0f)</li><li>Payload blue accent (#3291ff)</li><li>Smooth transitions</li></ul>",
    type: "post",
    status: "publish",
    published: Date.now() - 172800000, // 2 days ago
    updated: Date.now(),
    labels: ["design", "ui", "theme"]
  },
  {
    rowid: 3,
    title: "About Pages",
    content: "<h2>Page Type</h2><p>This is a static page, not a blog post. Pages appear in the sidebar under 'Pages' section.</p>",
    type: "page",
    status: "publish",
    published: Date.now() - 259200000, // 3 days ago
    updated: Date.now(),
    labels: []
  }
];

const mockLabels = [
  { name: "welcome", count: 1 },
  { name: "cms", count: 1 },
  { name: "design", count: 1 },
  { name: "ui", count: 1 },
  { name: "theme", count: 1 }
];

const app = express();
app.use(cors());
app.use(express.json());

// GET /api/posts - List posts
app.get('/api/posts', (req, res) => {
  const type = req.query.type || 'post';
  const status = req.query.status || 'publish';
  const limit = parseInt(req.query.limit as string) || 20;
  
  const filtered = mockPosts
    .filter(p => p.type === type && p.status === status)
    .sort((a, b) => b.published - a.published)
    .slice(0, limit);
  
  res.json({ items: filtered });
});

// GET /api/posts/:id - Get single post
app.get('/api/posts/:id', (req, res) => {
  const post = mockPosts.find(p => p.rowid === parseInt(req.params.id));
  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }
  res.json(post);
});

// GET /api/labels - List all labels
app.get('/api/labels', (_req, res) => {
  res.json({ items: mockLabels });
});

// GET /api/posts/label/:label - Posts by label
app.get('/api/posts/label/:label', (req, res) => {
  const filtered = mockPosts
    .filter(p => p.labels.includes(req.params.label))
    .sort((a, b) => b.published - a.published);
  res.json({ items: filtered });
});

// POST /api/posts - Create post (stub)
app.post('/api/posts', (req, res) => {
  const newPost = {
    rowid: Math.max(...mockPosts.map(p => p.rowid)) + 1,
    ...req.body,
    published: Date.now(),
    updated: Date.now()
  };
  mockPosts.push(newPost);
  res.status(201).json(newPost);
});

// PUT /api/posts/:id - Update post (stub)
app.put('/api/posts/:id', (req, res) => {
  const post = mockPosts.find(p => p.rowid === parseInt(req.params.id));
  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }
  Object.assign(post, req.body, { updated: Date.now() });
  res.json(post);
});

// DELETE /api/posts/:id - Delete post (stub)
app.delete('/api/posts/:id', (req, res) => {
  const idx = mockPosts.findIndex(p => p.rowid === parseInt(req.params.id));
  if (idx === -1) {
    return res.status(404).json({ error: "Post not found" });
  }
  const [deleted] = mockPosts.splice(idx, 1);
  res.json(deleted);
});

const PORT = process.env.API_PORT || 3001;
app.listen(PORT, () => {
  console.log(`\n✅ FlareCMS Mock API running on http://localhost:${PORT}`);
  console.log(`   Serving endpoints: /api/posts, /api/labels`);
  console.log(`   Frontend at: http://localhost:3000\n`);
});
