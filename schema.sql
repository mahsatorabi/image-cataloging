CREATE TABLE IF NOT EXISTS images (
  id TEXT PRIMARY KEY,
  filename TEXT NOT NULL,
  content_type TEXT NOT NULL,
  r2_key TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS catalog_layers (
  image_id TEXT PRIMARY KEY REFERENCES images(id) ON DELETE CASCADE,
  objects_json TEXT NOT NULL,
  description TEXT NOT NULL,
  concepts_json TEXT NOT NULL,
  embedding_json TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_catalog_description ON catalog_layers(description);
