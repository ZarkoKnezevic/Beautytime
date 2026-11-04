/**
 * Logger utility for consistent logging across the application.
 */

interface LogOptions {
  serverOnly?: boolean;
}

/**
 * Strip Storyblok access tokens from anything that reaches the console.
 * Framework errors (e.g. Next's "Dynamic server usage") embed the full fetch
 * URL, so redaction has to happen here, not only in the fetcher.
 */
const TOKEN_RE = /([?&]token=)[^&\s)]+/g;

function redact(value: unknown): unknown {
  if (typeof value === 'string') return value.replace(TOKEN_RE, '$1***');
  if (value instanceof Error) return redact(value.message);
  return value;
}

class Logger {
  private isServer = typeof window === 'undefined';
  private isDevelopment = process.env.NODE_ENV === 'development';

  private shouldLog(options?: LogOptions): boolean {
    if (options?.serverOnly && !this.isServer) {
      return false;
    }
    return this.isDevelopment || this.isServer;
  }

  info(message: string, ...args: unknown[]): void {
    if (this.shouldLog()) {
      console.log(`ℹ️ ${redact(message)}`, ...args.map(redact));
    }
  }

  warn(message: string, ...args: unknown[]): void {
    if (this.shouldLog()) {
      console.warn(`⚠️ ${redact(message)}`, ...args.map(redact));
    }
  }

  error(message: string, ...args: unknown[]): void {
    if (this.shouldLog()) {
      console.error(`❌ ${redact(message)}`, ...args.map(redact));
    }
  }

  debug(message: string, ...args: unknown[]): void {
    if (this.shouldLog({ serverOnly: true })) {
      console.log(`🔍 ${redact(message)}`, ...args.map(redact));
    }
  }
}

export const logger = new Logger();
