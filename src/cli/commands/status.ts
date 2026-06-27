import chalk from 'chalk';
import { getStats } from '../../spaced-repetition/scheduler.js';
import { closeDatabase } from '../../db/connection.js';

export async function statusCommand(): Promise<void> {
  try {
    const stats = getStats();

    console.log(chalk.bold('\n📊 Athar Memory Status'));
    console.log(chalk.gray('━'.repeat(40)));

    console.log(`\n  Total Lessons:    ${chalk.bold.white(stats.total)}`);
    console.log(`  Due Today:        ${stats.dueToday > 0 ? chalk.bold.yellow(stats.dueToday + ' ⚠️') : chalk.green('0 ✓')}`);
    console.log(`  Due This Week:    ${chalk.white(stats.dueThisWeek)}`);

    console.log(chalk.bold('\n  By Status:'));
    console.log(`    🆕  New:         ${chalk.white(stats.byStatus['new'] || 0)}`);
    console.log(`    📖  Learning:    ${chalk.cyan(stats.byStatus['learning'] || 0)}`);
    console.log(`    ✅  Learned:     ${chalk.green(stats.byStatus['learned'] || 0)}`);
    console.log(`    🏆  Mastered:    ${chalk.magenta(stats.byStatus['mastered'] || 0)}`);

    if (stats.topTags.length > 0) {
      console.log(chalk.bold('\n  Top Tags:'));
      for (const { tag, count } of stats.topTags) {
        const bar = chalk.blue('█'.repeat(Math.min(count * 2, 20)));
        console.log(`    ${chalk.white(tag.padEnd(18))} ${bar} ${chalk.gray(count)}`);
      }
    }

    if (stats.dueToday > 0) {
      console.log(chalk.yellow(`\n  💡 You have ${stats.dueToday} lesson(s) due for review!`));
      console.log(chalk.white('     Run `athar review` to start.\n'));
    } else if (stats.total === 0) {
      console.log(chalk.gray('\n  No lessons yet. Start coding with Athar MCP in your IDE!\n'));
    } else {
      console.log(chalk.green('\n  ✨ All caught up! No reviews due today.\n'));
    }
  } finally {
    closeDatabase();
  }
}
