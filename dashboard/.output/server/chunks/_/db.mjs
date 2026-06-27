import { DatabaseSync } from 'node:sqlite';
import { join } from 'node:path';
import { homedir } from 'node:os';
import { existsSync } from 'node:fs';

let db = null;
function getAtharDb() {
  if (db) return db;
  const platform = process.platform;
  let dataDir;
  if (platform === "darwin") {
    dataDir = join(homedir(), "Library", "Application Support", "athar");
  } else if (platform === "win32") {
    dataDir = join(process.env.APPDATA || join(homedir(), "AppData", "Roaming"), "athar");
  } else {
    dataDir = join(process.env.XDG_DATA_HOME || join(homedir(), ".local", "share"), "athar");
  }
  const dbPath = join(dataDir, "lessons.db");
  if (!existsSync(dbPath)) {
    throw new Error(`Athar database not found at ${dbPath}. Run the MCP server first to create it.`);
  }
  db = new DatabaseSync(dbPath, { readOnly: true });
  return db;
}

export { getAtharDb as g };
//# sourceMappingURL=db.mjs.map
