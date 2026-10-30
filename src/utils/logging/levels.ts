// Logging levels and interface
export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'success';

export interface LoggerOptions {
  level?: LogLevel;
  useColor?: boolean;
  stream?: NodeJS.WritableStream;
  errorStream?: NodeJS.WritableStream;
}

export interface Logger {
  setLevel(level: LogLevel): void;
  setColor(enabled: boolean): void;
  setStream?(stream: NodeJS.WritableStream): void;
  setErrorStream?(errorStream: NodeJS.WritableStream): void;
  debug(message: string, ...args: unknown[]): void;
  info(message: string, ...args: unknown[]): void;
  warn(message: string, ...args: unknown[]): void;
  error(message: string, ...args: unknown[]): void;
  success(message: string, ...args: unknown[]): void;
}
