/**
 * Database schema for Athar lessons.
 * 
 * Designed for:
 * - Structured lesson storage with rich metadata
 * - SM-2 spaced repetition scheduling
 * - Full-text search across lesson content
 * - Bilingual support (Arabic + English)
 */

export const SCHEMA_VERSION = 1;

export const CREATE_TABLES = `
  -- Main lessons table
  CREATE TABLE IF NOT EXISTS lessons (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    
    -- Core lesson content (bilingual: AR/EN)
    title            TEXT NOT NULL,
    problem          TEXT NOT NULL,
    error_message    TEXT,
    root_cause       TEXT NOT NULL,
    bad_code         TEXT,
    good_code        TEXT,
    lesson           TEXT NOT NULL,
    
    -- Categorization
    tags             TEXT,          -- JSON array: ["async", "react", "typescript"]
    language         TEXT,          -- Programming language: "typescript", "python", etc.
    file_path        TEXT,          -- Original file where error occurred
    git_diff         TEXT,          -- Git diff context (auto-captured or provided)
    
    -- Spaced repetition (SM-2 algorithm)
    repetitions      INTEGER DEFAULT 0,
    easiness_factor  REAL    DEFAULT 2.5,
    interval_days    INTEGER DEFAULT 0,
    next_review_at   TEXT,          -- ISO 8601 datetime
    last_reviewed_at TEXT,
    
    -- Review questions: JSON array of {q, a} objects
    review_questions TEXT NOT NULL,
    
    -- Status tracking
    status           TEXT DEFAULT 'new' CHECK(status IN ('new', 'learning', 'learned', 'mastered')),
    quality_score    INTEGER,       -- Last SM-2 quality score (0-5)
    review_count     INTEGER DEFAULT 0,
    
    -- Metadata
    created_at       TEXT DEFAULT (datetime('now')),
    updated_at       TEXT DEFAULT (datetime('now'))
  );

  -- Performance indexes
  CREATE INDEX IF NOT EXISTS idx_lessons_next_review ON lessons(next_review_at);
  CREATE INDEX IF NOT EXISTS idx_lessons_status      ON lessons(status);
  CREATE INDEX IF NOT EXISTS idx_lessons_language     ON lessons(language);
  CREATE INDEX IF NOT EXISTS idx_lessons_created      ON lessons(created_at);

  -- Full-text search virtual table
  CREATE VIRTUAL TABLE IF NOT EXISTS lessons_fts USING fts5(
    title,
    problem,
    root_cause,
    lesson,
    tags,
    content=lessons,
    content_rowid=id
  );

  -- Triggers to keep FTS in sync
  CREATE TRIGGER IF NOT EXISTS lessons_ai AFTER INSERT ON lessons BEGIN
    INSERT INTO lessons_fts(rowid, title, problem, root_cause, lesson, tags)
    VALUES (new.id, new.title, new.problem, new.root_cause, new.lesson, new.tags);
  END;

  CREATE TRIGGER IF NOT EXISTS lessons_ad AFTER DELETE ON lessons BEGIN
    INSERT INTO lessons_fts(lessons_fts, rowid, title, problem, root_cause, lesson, tags)
    VALUES ('delete', old.id, old.title, old.problem, old.root_cause, old.lesson, old.tags);
  END;

  CREATE TRIGGER IF NOT EXISTS lessons_au AFTER UPDATE ON lessons BEGIN
    INSERT INTO lessons_fts(lessons_fts, rowid, title, problem, root_cause, lesson, tags)
    VALUES ('delete', old.id, old.title, old.problem, old.root_cause, old.lesson, old.tags);
    INSERT INTO lessons_fts(rowid, title, problem, root_cause, lesson, tags)
    VALUES (new.id, new.title, new.problem, new.root_cause, new.lesson, new.tags);
  END;

  -- Schema version tracking
  CREATE TABLE IF NOT EXISTS schema_meta (
    key   TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );

  INSERT OR REPLACE INTO schema_meta (key, value)
  VALUES ('version', '${SCHEMA_VERSION}');
`;
