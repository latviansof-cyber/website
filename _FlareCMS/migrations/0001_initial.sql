CREATE TABLE IF NOT EXISTS posts (
  rowid INTEGER PRIMARY KEY,
  published INTEGER NOT NULL DEFAULT (ROUND(unixepoch('subsec') * 1000)),
  updated INTEGER NOT NULL DEFAULT (ROUND(unixepoch('subsec') * 1000)),
  type TEXT NOT NULL DEFAULT 'post',
  status TEXT NOT NULL DEFAULT 'publish',
  title TEXT NOT NULL,
  content TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS typeStatusPublishedIdIdx
  ON posts (type, status, published, rowid);

CREATE TABLE IF NOT EXISTS labels (
  postId INTEGER NOT NULL REFERENCES posts(rowid) ON DELETE CASCADE,
  name TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idNameIdx ON labels (postId, name);
CREATE INDEX IF NOT EXISTS nameIdx ON labels (name);

CREATE TABLE IF NOT EXISTS replies (
  rowid INTEGER PRIMARY KEY,
  published INTEGER NOT NULL DEFAULT (ROUND(unixepoch('subsec') * 1000)),
  content TEXT NOT NULL,
  postId INTEGER NOT NULL REFERENCES posts(rowid) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS postIdIdx ON replies (postId);

CREATE TABLE IF NOT EXISTS options (
  key TEXT PRIMARY KEY NOT NULL,
  value TEXT NOT NULL
);

