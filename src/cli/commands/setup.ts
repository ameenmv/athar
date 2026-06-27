import chalk from 'chalk';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { getMcpConfigPath } from '../../utils/paths.js';

export async function setupCommand(): Promise<void> {
  console.log(chalk.bold('\n🔮 Athar Setup — Antigravity IDE Integration\n'));

  const configPath = getMcpConfigPath();
  const serverPath = resolve(join(import.meta.dirname, '..', '..', '..', 'dist', 'index.js'));

  // Check if dist/index.js exists
  if (!existsSync(serverPath)) {
    console.log(chalk.red('❌ Built server not found at:'), serverPath);
    console.log(chalk.yellow('   Run `npm run build` first.\n'));
    process.exit(1);
  }

  console.log(chalk.gray(`  Config path: ${configPath}`));
  console.log(chalk.gray(`  Server path: ${serverPath}\n`));

  // Read or create config
  let config: { mcpServers: Record<string, unknown> };
  if (existsSync(configPath)) {
    try {
      config = JSON.parse(readFileSync(configPath, 'utf-8'));
      if (!config.mcpServers) config.mcpServers = {};
    } catch {
      console.log(chalk.yellow('⚠️  Existing config is invalid, creating new one...'));
      config = { mcpServers: {} };
    }
  } else {
    // Create directory if needed
    const dir = join(configPath, '..');
    mkdirSync(dir, { recursive: true });
    config = { mcpServers: {} };
  }

  // Check if already configured
  if (config.mcpServers.athar) {
    console.log(chalk.yellow('⚠️  Athar is already configured in your MCP settings.'));
    console.log(chalk.gray('   Updating to latest path...\n'));
  }

  // Add/update athar entry
  config.mcpServers.athar = {
    command: 'node',
    args: ['--experimental-sqlite', serverPath],
  };

  // Write config
  writeFileSync(configPath, JSON.stringify(config, null, 2));

  console.log(chalk.green('✅ Athar MCP server configured successfully!\n'));
  console.log(chalk.bold('Next steps:'));
  console.log(chalk.white('  1. Refresh MCP servers in Antigravity IDE'));
  console.log(chalk.white('     (Click "..." → "Manage MCP Servers" → Refresh)'));
  console.log(chalk.white('  2. Start coding — the AI will save lessons automatically'));
  console.log(chalk.white('  3. Run `athar status` to check your progress\n'));
}
