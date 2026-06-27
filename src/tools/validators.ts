import { z } from 'zod';

/**
 * Zod schema for the save_lesson tool input.
 * Enforces structured, high-quality lesson data from the AI assistant.
 */
export const SaveLessonSchema = z.object({
  title: z
    .string()
    .min(10, 'Title must be at least 10 characters — be specific about the mistake pattern')
    .max(200)
    .describe('Concise title describing the mistake pattern (e.g., "React useEffect cleanup race condition")'),

  problem: z
    .string()
    .min(20, 'Problem description must be detailed enough to be useful')
    .describe('What went wrong — the symptom observed by the developer'),

  error_message: z
    .string()
    .optional()
    .describe('Exact error message, stack trace snippet, or compiler error if applicable'),

  root_cause: z
    .string()
    .min(20, 'Root cause must explain WHY, not just WHAT')
    .describe('The actual root cause — WHY this happened, not just what happened'),

  bad_code: z
    .string()
    .optional()
    .describe('The incorrect code snippet that caused the problem'),

  good_code: z
    .string()
    .optional()
    .describe('The corrected code snippet showing the fix'),

  lesson: z
    .string()
    .min(20, 'Lesson must be a meaningful takeaway')
    .describe('The key takeaway — what to always remember to avoid this mistake'),

  tags: z
    .array(z.string().min(1).max(30))
    .min(1, 'At least one tag is required for categorization')
    .max(10)
    .describe('Categorization tags (e.g., ["async", "react", "typescript", "race-condition"])'),

  language: z
    .string()
    .optional()
    .describe('Programming language (e.g., "typescript", "python", "rust")'),

  file_path: z
    .string()
    .optional()
    .describe('File path where the error occurred'),

  git_diff: z
    .string()
    .optional()
    .describe('Git diff context showing the change that fixed the issue'),

  review_questions: z
    .array(
      z.object({
        q: z.string().min(10).describe('A review question testing understanding of this lesson'),
        a: z.string().min(10).describe('The expected answer'),
      })
    )
    .min(1, 'At least one review question is required')
    .max(3, 'Maximum 3 review questions per lesson')
    .describe('1-3 review questions to test understanding during spaced repetition reviews'),
});

export type SaveLessonInput = z.infer<typeof SaveLessonSchema>;

/**
 * Zod schema for the memory (search) tool input.
 */
export const MemorySchema = z.object({
  query: z
    .string()
    .min(2)
    .describe('Search query — error pattern, keyword, tag name, or natural language description'),

  limit: z
    .number()
    .int()
    .min(1)
    .max(10)
    .default(3)
    .describe('Maximum number of results to return (default: 3)'),

  language: z
    .string()
    .optional()
    .describe('Filter results by programming language'),

  tags: z
    .array(z.string())
    .optional()
    .describe('Filter results by tags (matches any)'),
});

export type MemoryInput = z.infer<typeof MemorySchema>;
