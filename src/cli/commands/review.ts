import chalk from 'chalk';
import { getDueReviews, recordReview, type LessonForReview } from '../../spaced-repetition/scheduler.js';
import { qualityLabel } from '../../spaced-repetition/sm2.js';
import { closeDatabase } from '../../db/connection.js';
import { createInterface } from 'node:readline';

function askQuestion(rl: ReturnType<typeof createInterface>, prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => resolve(answer.trim()));
  });
}

export async function reviewCommand(): Promise<void> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });

  try {
    const dueReviews = getDueReviews();

    if (dueReviews.length === 0) {
      console.log(chalk.green('\n  ✨ No lessons due for review. Great job!'));
      console.log(chalk.gray('     Check back later or run `athar status` for stats.\n'));
      rl.close();
      return;
    }

    console.log(chalk.bold(`\n╔${'═'.repeat(50)}╗`));
    console.log(chalk.bold(`║  أثر Review Session — ${chalk.yellow(dueReviews.length)} lesson(s) due${' '.repeat(Math.max(0, 50 - 30 - String(dueReviews.length).length))}║`));
    console.log(chalk.bold(`╚${'═'.repeat(50)}╝\n`));

    let reviewed = 0;
    let skipped = 0;

    for (let i = 0; i < dueReviews.length; i++) {
      const lesson = dueReviews[i];
      const tags = JSON.parse(lesson.tags || '[]') as string[];
      const questions = JSON.parse(lesson.review_questions || '[]') as Array<{ q: string; a: string }>;

      console.log(chalk.bold(`\n📖 Lesson ${i + 1}/${dueReviews.length}: "${lesson.title}"`));
      console.log(chalk.gray('━'.repeat(55)));
      console.log(`${chalk.gray('Tags:')} ${tags.map(t => chalk.blue(t)).join(', ')}`);
      console.log(`${chalk.gray('Language:')} ${lesson.language || 'N/A'}  ${chalk.gray('Status:')} ${lesson.status}`);

      // Show problem
      console.log(chalk.bold('\n❗ Problem:'));
      console.log(chalk.white(`   ${lesson.problem}`));

      // Show review questions one by one
      for (const question of questions) {
        console.log(chalk.bold.yellow(`\n❓ ${question.q}`));
        await askQuestion(rl, chalk.gray('\n   Press Enter to reveal answer...'));
        console.log(chalk.bold.green(`\n✅ ${question.a}`));
      }

      // Show root cause and lesson
      console.log(chalk.bold('\n🔍 Root Cause:'));
      console.log(chalk.white(`   ${lesson.root_cause}`));
      console.log(chalk.bold('\n💡 Key Lesson:'));
      console.log(chalk.white(`   ${lesson.lesson}`));

      // Show code comparison if available
      if (lesson.bad_code && lesson.good_code) {
        console.log(chalk.bold.red('\n✗ Bad Code:'));
        console.log(chalk.gray('   ┌─'));
        for (const line of lesson.bad_code.split('\n')) {
          console.log(chalk.red(`   │ ${line}`));
        }
        console.log(chalk.gray('   └─'));

        console.log(chalk.bold.green('\n✓ Good Code:'));
        console.log(chalk.gray('   ┌─'));
        for (const line of lesson.good_code.split('\n')) {
          console.log(chalk.green(`   │ ${line}`));
        }
        console.log(chalk.gray('   └─'));
      }

      // Ask for quality rating
      console.log(chalk.bold('\n📊 How well did you recall this?'));
      console.log(chalk.gray('   0 = Complete blackout'));
      console.log(chalk.gray('   1 = Incorrect, vague memory'));
      console.log(chalk.gray('   2 = Incorrect, but recognized answer'));
      console.log(chalk.gray('   3 = Correct with difficulty'));
      console.log(chalk.gray('   4 = Correct after hesitation'));
      console.log(chalk.gray('   5 = Perfect recall'));
      console.log(chalk.gray('   s = Skip this lesson'));

      let quality: number | null = null;
      while (quality === null) {
        const answer = await askQuestion(rl, chalk.bold('\n   Your rating (0-5 or s): '));

        if (answer.toLowerCase() === 's') {
          skipped++;
          console.log(chalk.gray('   Skipped.'));
          break;
        }

        const parsed = parseInt(answer, 10);
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 5) {
          quality = parsed;
        } else {
          console.log(chalk.red('   Please enter a number 0-5 or "s" to skip.'));
        }
      }

      if (quality !== null) {
        const result = recordReview(lesson.id, quality);
        reviewed++;

        console.log(`\n   ${qualityLabel(quality)}`);
        console.log(`   → Next review in ${chalk.bold(result.intervalDays + ' day(s)')} ${chalk.green('✓')}`);
        console.log(`   → Status: ${chalk.bold(result.newStatus)}`);
      }
    }

    // Summary
    console.log(chalk.bold(`\n${'━'.repeat(55)}`));
    console.log(chalk.bold('📋 Review Session Summary'));
    console.log(`   Reviewed: ${chalk.green(reviewed)}`);
    console.log(`   Skipped:  ${chalk.yellow(skipped)}`);
    console.log(`   Total:    ${dueReviews.length}`);
    console.log(chalk.bold(`${'━'.repeat(55)}\n`));

    if (reviewed > 0) {
      console.log(chalk.green('   🎉 Great work! Keep learning from your mistakes.\n'));
    }
  } finally {
    rl.close();
    closeDatabase();
  }
}
