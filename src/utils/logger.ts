/**
 * Logger utility for Athar.
 * 
 * CRITICAL: In MCP servers using stdio transport, stdout is the JSON-RPC channel.
 * ALL logging MUST go to stderr. Using console.log() would corrupt the protocol.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LOG_COLORS: Record<LogLevel, string> = {
  debug: '\x1b[90m',  // gray
  info: '\x1b[36m',   // cyan
  warn: '\x1b[33m',   // yellow
  error: '\x1b[31m',  // red
};

const RESET = '\x1b[0m';

class Logger {
  private context: string;
  private isVerbose: boolean;

  constructor(context: string) {
    this.context = context;
    this.isVerbose = process.env.ATHAR_DEBUG === '1' || process.env.ATHAR_DEBUG === 'true';
  }

  private write(level: LogLevel, message: string, ...args: unknown[]): void {
    if (level === 'debug' && !this.isVerbose) return;

    const timestamp = new Date().toISOString().slice(11, 23); // HH:mm:ss.SSS
    const color = LOG_COLORS[level];
    const prefix = `${color}[${timestamp}] [${level.toUpperCase()}] [${this.context}]${RESET}`;

    // Always write to stderr — never stdout
    process.stderr.write(`${prefix} ${message}\n`);
    if (args.length > 0) {
      for (const arg of args) {
        process.stderr.write(`  ${typeof arg === 'string' ? arg : JSON.stringify(arg, null, 2)}\n`);
      }
    }
  }

  debug(message: string, ...args: unknown[]): void {
    this.write('debug', message, ...args);
  }

  info(message: string, ...args: unknown[]): void {
    this.write('info', message, ...args);
  }

  warn(message: string, ...args: unknown[]): void {
    this.write('warn', message, ...args);
  }

  error(message: string, ...args: unknown[]): void {
    this.write('error', message, ...args);
  }
}

/**
 * Create a namespaced logger instance.
 * @param context - Module name (e.g., 'server', 'db', 'save-lesson')
 */
export function createLogger(context: string): Logger {
  return new Logger(context);
}
