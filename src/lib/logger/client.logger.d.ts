/**
 * Type declarations for the client logger module
 */

declare module '@/lib/logger/client.logger' {
  export interface Logger {
    debug(message: string, context?: Record<string, unknown>): void;
    info(message: string, context?: Record<string, unknown>): void;
    warn(message: string, context?: Record<string, unknown>): void;
    error(message: string, error?: Error, context?: Record<string, unknown>): void;
  }

  /**
   * Creates a new logger instance for a specific module
   * @param module The module name to identify the source of the logs
   * @returns A new logger instance
   */
  export function getClientLogger(module: string): Logger;

  /** Default logger instance */
  export const logger: Logger;
}
