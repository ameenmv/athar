import { spawn } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import chalk from 'chalk';
import { existsSync } from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function dashboardCommand() {
  console.log(chalk.blue('🔮 Starting Athar Dashboard...\n'));

  // __dirname is dist/cli/commands (in prod) or src/cli/commands (in dev)
  let serverPath = join(__dirname, '..', '..', '..', 'dashboard', '.output', 'server', 'index.mjs');
  
  if (!existsSync(serverPath)) {
    // try dev path
    serverPath = join(__dirname, '..', '..', 'dashboard', '.output', 'server', 'index.mjs');
  }

  if (!existsSync(serverPath)) {
    console.error(chalk.red('❌ Dashboard server not found. Please ensure the dashboard is built.'));
    console.error(chalk.gray('Expected path: ' + serverPath));
    process.exit(1);
  }

  const port = process.env.PORT || '3333';

  const child = spawn('node', ['--experimental-sqlite', serverPath], {
    env: { ...process.env, PORT: port, HOST: '127.0.0.1', NODE_ENV: 'production' },
    stdio: 'inherit'
  });

  child.on('error', (err) => {
    console.error(chalk.red('❌ Failed to start dashboard server:'), err.message);
  });
}
