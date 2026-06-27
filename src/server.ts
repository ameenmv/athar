import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { SaveLessonSchema, MemorySchema } from './tools/validators.js';
import { saveLesson } from './tools/save-lesson.js';
import { searchMemory } from './tools/memory.js';
import { createLogger } from './utils/logger.js';

const log = createLogger('server');

/**
 * Create and configure the Athar MCP server.
 * Registers all tools and their handlers.
 */
export function createAtharServer(): McpServer {
  const server = new McpServer(
    {
      name: 'athar',
      version: '0.1.0',
    },
    {
      instructions: `You have access to **Athar (أثر)**, a programming lesson memory system that captures and recalls lessons from real coding mistakes.

## WHEN TO SAVE A LESSON (save_lesson):
- When you help fix a **non-trivial bug** and identify a clear root cause
- When a **misconception** about an API, language feature, or framework is corrected
- When a **debugging session** reveals unexpected behavior worth remembering
- When an **architectural mistake** is identified and a better pattern is suggested
- When a **security vulnerability** or performance anti-pattern is discovered

## WHEN NOT TO SAVE:
- Simple typos, formatting changes, or import order fixes
- Routine code generation without any mistake involved
- Style preferences or subjective code choices
- Changes so trivial they wouldn't teach anyone anything

## WHEN TO SEARCH MEMORY (memory):
- When you detect an error pattern that looks like a past mistake
- When the developer explicitly asks "have I done this before?" or similar
- When starting work in an area where past lessons might prevent repeated errors
- Proactively at the start of a debugging session in a known problem area

## IMPORTANT GUIDELINES:
- Always include code examples (bad_code + good_code) when applicable
- Write lessons in the same language the developer uses (Arabic or English)
- Tags should be specific and lowercase (e.g., "async-await", "react-hooks", "sql-injection")
- Review questions should test understanding, not just recall
- The git_diff field is optional — include it if the fix involves specific file changes`,
    }
  );

  // ═══════════════════════════════════════════════════════
  // Tool: save_lesson
  // ═══════════════════════════════════════════════════════
  server.tool(
    'save_lesson',
    `Save a programming lesson learned from a real mistake during this coding session.

ONLY call this when you identify a genuine, non-trivial learning moment — NOT for formatting changes, simple typos, or routine code adjustments.

The lesson must contain:
- A clear problem description (what went wrong)
- A root cause analysis (WHY it happened)
- An actionable takeaway (what to remember)
- At least one review question for spaced repetition`,
    {
      title: SaveLessonSchema.shape.title,
      problem: SaveLessonSchema.shape.problem,
      error_message: SaveLessonSchema.shape.error_message,
      root_cause: SaveLessonSchema.shape.root_cause,
      bad_code: SaveLessonSchema.shape.bad_code,
      good_code: SaveLessonSchema.shape.good_code,
      lesson: SaveLessonSchema.shape.lesson,
      tags: SaveLessonSchema.shape.tags,
      language: SaveLessonSchema.shape.language,
      file_path: SaveLessonSchema.shape.file_path,
      git_diff: SaveLessonSchema.shape.git_diff,
      review_questions: SaveLessonSchema.shape.review_questions,
    },
    async (args) => {
      log.info('save_lesson called', args.title);
      try {
        const result = saveLesson(args as any);
        return {
          content: [
            {
              type: 'text' as const,
              text: result.message,
            },
          ],
          isError: !result.success,
        };
      } catch (err) {
        log.error('save_lesson failed', String(err));
        return {
          content: [
            {
              type: 'text' as const,
              text: `❌ Failed to save lesson: ${err instanceof Error ? err.message : String(err)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // ═══════════════════════════════════════════════════════
  // Tool: memory
  // ═══════════════════════════════════════════════════════
  server.tool(
    'memory',
    `Search your programming lesson history for past mistakes and solutions.

Use this when:
- You detect an error pattern that might match a previously learned lesson
- The developer asks about past mistakes in a specific area
- You want to proactively check if a similar mistake has been made before

Returns relevant lessons with their problem, root cause, solution, and code examples.`,
    {
      query: MemorySchema.shape.query,
      limit: MemorySchema.shape.limit,
      language: MemorySchema.shape.language,
      tags: MemorySchema.shape.tags,
    },
    async (args) => {
      log.info('memory called', args.query);
      try {
        const result = searchMemory(args as any);
        return {
          content: [
            {
              type: 'text' as const,
              text: result.message,
            },
          ],
        };
      } catch (err) {
        log.error('memory search failed', String(err));
        return {
          content: [
            {
              type: 'text' as const,
              text: `❌ Memory search failed: ${err instanceof Error ? err.message : String(err)}`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  log.info('Athar MCP server created with 2 tools: save_lesson, memory');
  return server;
}
