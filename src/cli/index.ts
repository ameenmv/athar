#!/usr/bin/env node

/**
 * Athar CLI (أثر)
 * 
 * Commands:
 *   athar setup     — Configure Antigravity IDE integration
 *   athar review    — Interactive spaced repetition review
 *   athar status    — Show pending reviews and stats
 *   athar list      — Browse all lessons
 */

import { Command } from 'commander';
import { reviewCommand } from './commands/review.js';
import { statusCommand } from './commands/status.js';
import { listCommand } from './commands/list.js';
import { setupCommand } from './commands/setup.js';
import { dashboardCommand } from './commands/dashboard.js';

const program = new Command();

program
  .name('athar')
  .description('أثر — AI-powered programming lesson memory with spaced repetition')
  .version('0.1.0');

program
  .command('setup')
  .description('Configure Antigravity IDE to use Athar MCP server')
  .action(setupCommand);

program
  .command('review')
  .description('Start an interactive spaced repetition review session')
  .action(reviewCommand);

program
  .command('status')
  .description('Show pending reviews and lesson statistics')
  .action(statusCommand);

program
  .command('list')
  .description('Browse all saved lessons')
  .option('-t, --tag <tag>', 'Filter by tag')
  .option('-l, --language <lang>', 'Filter by programming language')
  .option('-s, --status <status>', 'Filter by status (new, learning, learned, mastered)')
  .option('-q, --search <query>', 'Search lessons by keyword')
  .option('-n, --limit <number>', 'Maximum results', '20')
  .action(listCommand);

program
  .command('dashboard')
  .description('Start the visual dashboard in your browser')
  .action(dashboardCommand);

program.parse();
