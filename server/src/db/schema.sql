-- Notes are stored with ISO-8601 UTC timestamps so they sort lexicographically
-- and can be handed to `new Date()` without extra parsing.
CREATE TABLE IF NOT EXISTS notes (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  title      TEXT    NOT NULL,
  content    TEXT    NOT NULL DEFAULT '',
  created_at TEXT    NOT NULL,
  updated_at TEXT    NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_notes_updated_at ON notes (updated_at DESC, id DESC);
CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes (created_at DESC, id DESC);
