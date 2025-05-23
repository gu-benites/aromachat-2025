// Logger configuration and utilities

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerOptions {
  level?: LogLevel;
  prefix?: string;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

class Logger {
  private level: number;
  private prefix: string;

  constructor(options: LoggerOptions = {}) {
    this.level = LOG_LEVELS[options.level || 'info'];
    this.prefix = options.prefix || '';
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= this.level;
  }

  private formatMessage(level: LogLevel, message: string, ...args: any[]): string {
    const timestamp = new Date().toISOString();
    const prefix = this.prefix ? `[${this.prefix}] ` : '';
    const formattedMessage = `[${timestamp}] ${level.toUpperCase()} ${prefix}${message}`;
    
    if (args.length > 0) {
      return `${formattedMessage} ${args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ')}`;
    }
    
    return formattedMessage;
  }

  debug(message: string, ...args: any[]): void {
    if (this.shouldLog('debug')) {
      console.debug(this.formatMessage('debug', message, ...args));
    }
  }

  info(message: string, ...args: any[]): void {
    if (this.shouldLog('info')) {
      console.info(this.formatMessage('info', message, ...args));
    }
  }

  warn(message: string, ...args: any[]): void {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', message, ...args));
    }
  }

  error(message: string, ...args: any[]): void {
    if (this.shouldLog('error')) {
      console.error(this.formatMessage('error', message, ...args));
    }
  }

  // Create a new logger instance with a prefix
  createLogger(options: LoggerOptions): Logger {
    return new Logger({
      ...options,
      prefix: options.prefix || this.prefix,
      level: options.level || (Object.keys(LOG_LEVELS).find(
        (key) => LOG_LEVELS[key as LogLevel] === this.level
      ) as LogLevel || 'info'),
    });
  }
}

// Create a default logger instance
export const logger = new Logger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
});

// Export the Logger class for custom logger instances
export { Logger };

export type { LogLevel, LoggerOptions };
