/**
 * Client-side logger utility
 * Centralized logging for client-side code with different log levels
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';
type LogContext = Record<string, unknown>;

/**
 * Client logger class
 */
class ClientLogger {
  private readonly module: string;
  private readonly enabled: boolean;

  constructor(module: string) {
    this.module = module;
    this.enabled = process.env.NODE_ENV !== 'production' || 
                  process.env['NEXT_PUBLIC_ENABLE_LOGGING'] === 'true';
  }

  private log(level: LogLevel, message: string, context?: LogContext) {
    if (!this.enabled) return;

    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      module: this.module,
      message,
      ...context,
    };

    // In development, log with appropriate console method
    if (process.env.NODE_ENV !== 'production') {
      const logMethod = level === 'error' ? 'error' :
                      level === 'warn' ? 'warn' :
                      level === 'info' ? 'info' : 'log';
      
      console[logMethod](`[${timestamp}] ${level.toUpperCase()} [${this.module}] ${message}`, 
        context || '');
    }

    // In production, send logs to your logging service
    if (process.env.NODE_ENV === 'production') {
      this.sendToLoggingService(logEntry);
    }
  }

  private async sendToLoggingService(data: Record<string, unknown>) {
    try {
      // Replace with your actual logging service endpoint
      await fetch('/api/logs/client', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      // Don't log the error to avoid infinite loops
      console.error('Failed to send log to server:', error);
    }
  }

  debug(message: string, context?: LogContext) {
    this.log('debug', message, context);
  }

  info(message: string, context?: LogContext) {
    this.log('info', message, context);
  }

  warn(message: string, context?: LogContext) {
    this.log('warn', message, context);
  }

  error(message: string, error?: Error, context?: LogContext) {
    this.log('error', message, {
      ...context,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined,
      } : undefined,
    });
  }
}

/**
 * Creates a new logger instance for a specific module
 * @param module The module name to identify the source of the logs
 * @returns A new logger instance
 */
export function getClientLogger(module: string): ClientLogger {
  return new ClientLogger(module);
}

// Default logger instance
export const logger = getClientLogger('app');
