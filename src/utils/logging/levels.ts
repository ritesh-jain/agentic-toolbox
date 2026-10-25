// Logging levels and interface
export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'success';

export interface Logger {
  setLevel(level: LogLevel): void;
  setColor(enabled: boolean): void;
  debug(message: string, ...args: unknown[]): void;
  info(message: string, ...args: unknown[]): void;
  warn(message: string, ...args: unknown[]): void;
  error(message: string, ...args: unknown[]): void;
  success(message: string, ...args: unknown[]): void;
}

export function createLogger(level: LogLevel = 'info', useColor: boolean = true): Logger {
  // Dynamic import to avoid circular dependency
  const { ConsoleLogger } = require('./console.js');
  return new ConsoleLogger(level, useColor);
}