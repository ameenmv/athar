import { DatabaseSync } from 'node:sqlite';
import { existsSync } from 'node:fs';
import { getDatabasePath } from '../utils/paths.js';
import { CREATE_TABLES } from './schema.js';
import { createLogger } from '../utils/logger.js';

const log = createLogger('db');

let db: DatabaseSync | null = null;

/**
 * Get the singleton database connection.
 * Creates the database and schema on first call.
 */
export function getDatabase(): DatabaseSync {
  if (db) return db;

  const dbPath = getDatabasePath();
  const isNew = !existsSync(dbPath);

  log.info(`Opening database at: ${dbPath}`);

  db = new DatabaseSync(dbPath);

  // Enable WAL mode for better concurrent read performance
  db.exec('PRAGMA journal_mode = WAL');
  db.exec('PRAGMA foreign_keys = ON');

  if (isNew) {
    log.info('Creating database schema (first run)...');
    db.exec(CREATE_TABLES);
    log.info('Schema created successfully.');
  } else {
    // Ensure FTS table and triggers exist (in case of upgrades)
    try {
      db.exec(CREATE_TABLES);
    } catch {
      // Tables already exist — that's fine
      log.debug('Schema already up to date.');
    }
  }

  return db;
}

/**
 * Close the database connection gracefully.
 */
export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
    log.info('Database connection closed.');
  }
}
