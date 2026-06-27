/**
 * SM-2 Spaced Repetition Algorithm
 * 
 * Based on the SuperMemo-2 algorithm by Piotr Wozniak.
 * Calculates optimal review intervals based on recall quality.
 * 
 * Quality scores:
 *   5 — Perfect response (instant recall)
 *   4 — Correct after hesitation
 *   3 — Correct with significant difficulty
 *   2 — Incorrect, but felt close / recognized the answer
 *   1 — Incorrect, vague memory
 *   0 — Complete blackout
 */

export interface SM2State {
  repetitions: number;
  easinessFactor: number;
  intervalDays: number;
}

export interface SM2Result extends SM2State {
  nextReviewAt: Date;
  status: 'new' | 'learning' | 'learned' | 'mastered';
}

/**
 * Calculate the next review state using the SM-2 algorithm.
 * 
 * @param current - Current card state
 * @param quality - Recall quality (0-5)
 * @returns Updated state with next review date
 */
export function calculateSM2(current: SM2State, quality: number): SM2Result {
  // Clamp quality to valid range
  quality = Math.max(0, Math.min(5, Math.round(quality)));

  let { repetitions, easinessFactor, intervalDays } = current;

  // Calculate new Easiness Factor
  // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  let newEF = easinessFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (newEF < 1.3) newEF = 1.3; // EF cannot drop below 1.3

  let newRepetitions: number;
  let newInterval: number;

  if (quality < 3) {
    // Failed recall → reset to beginning
    newRepetitions = 0;
    newInterval = 1; // Review again tomorrow
  } else {
    // Successful recall → advance
    newRepetitions = repetitions + 1;

    if (newRepetitions === 1) {
      newInterval = 1;         // First success: review in 1 day
    } else if (newRepetitions === 2) {
      newInterval = 6;         // Second success: review in 6 days
    } else {
      newInterval = Math.round(intervalDays * newEF);
    }
  }

  // Calculate next review date
  const nextReviewAt = new Date();
  nextReviewAt.setDate(nextReviewAt.getDate() + newInterval);

  // Determine status based on repetitions and EF
  let status: SM2Result['status'];
  if (newRepetitions === 0) {
    status = 'new';
  } else if (newRepetitions <= 2) {
    status = 'learning';
  } else if (newRepetitions <= 5 || newEF < 2.5) {
    status = 'learned';
  } else {
    status = 'mastered';
  }

  return {
    repetitions: newRepetitions,
    easinessFactor: Math.round(newEF * 100) / 100, // Round to 2 decimals
    intervalDays: newInterval,
    nextReviewAt,
    status,
  };
}

/**
 * Get a human-readable description of the quality score.
 */
export function qualityLabel(q: number): string {
  switch (q) {
    case 0: return '🟥 Complete blackout';
    case 1: return '🟧 Incorrect, vague memory';
    case 2: return '🟨 Incorrect, but recognized the answer';
    case 3: return '🟩 Correct with significant difficulty';
    case 4: return '🟦 Correct after hesitation';
    case 5: return '🟪 Perfect recall';
    default: return `Unknown (${q})`;
  }
}
