import { homedir, platform } from 'node:os';
import { join } from 'node:path';
import { mkdirSync, existsSync } from 'node:fs';

/**
 * XDG-compliant data directory for Athar.
 * 
 * Linux:   ~/.local/share/athar/
 * macOS:   ~/Library/Application Support/athar/
 * Windows: %APPDATA%/athar/
 */
export function getDataDir(): string {
  const home = homedir();
  let dataDir: string;

  switch (platform()) {
    case 'darwin':
      dataDir = join(home, 'Library', 'Application Support', 'athar');
      break;
    case 'win32':
      dataDir = join(process.env.APPDATA || join(home, 'AppData', 'Roaming'), 'athar');
      break;
    default: // linux, freebsd, etc.
      dataDir = join(process.env.XDG_DATA_HOME || join(home, '.local', 'share'), 'athar');
      break;
  }

  if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true });
  }

  return dataDir;
}

/**
 * Full path to the SQLite database file.
 */
export function getDatabasePath(): string {
  return join(getDataDir(), 'lessons.db');
}

/**
 * Path to the Antigravity IDE MCP config file.
 */
export function getMcpConfigPath(): string {
  const home = homedir();
  return join(home, '.gemini', 'config', 'mcp_config.json');
}
