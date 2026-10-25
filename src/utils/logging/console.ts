// Console logger implementation
import { LogLevel, Logger, LoggerOptions } from './levels.js';

export class ConsoleLogger implements Logger {
  private level: LogLevel;
  private useColor: boolean;
  private stream: NodeJS.WritableStream;
  private errorStream: NodeJS.WritableStream;

  constructor(options: LoggerOptions = {}) {
    this.level = options.level ?? 'info';
    this.stream = options.stream ?? process.stdout;
    this.errorStream = options.errorStream ?? process.stderr;

    const isTTY = Boolean((this.stream as { isTTY?: boolean }).isTTY);
    this.useColor = (options.useColor ?? true) && isTTY;
  }

  setLevel(level: LogLevel): void {
    this.level = level;
  }

  setColor(enabled: boolean): void {
    const isTTY = Boolean((this.stream as { isTTY?: boolean }).isTTY);
    this.useColor = enabled && isTTY;
  }

  setStream(stream: NodeJS.WritableStream): void {
    this.stream = stream;
    const isTTY = Boolean((this.stream as { isTTY?: boolean }).isTTY);
    this.useColor = this.useColor && isTTY;
  }

  setErrorStream(errorStream: NodeJS.WritableStream): void {
    this.errorStream = errorStream;
  }

  getStream(): NodeJS.WritableStream {
    return this.stream;
  }

  getErrorStream(): NodeJS.WritableStream {
    return this.errorStream;
  }

  debug(message: string, ...args: unknown[]): void {
    this.log('debug', message, args);
  }

  info(message: string, ...args: unknown[]): void {
    this.log('info', message, args);
  }

  warn(message: string, ...args: unknown[]): void {
    this.log('warn', message, args);
  }

  error(message: string, ...args: unknown[]): void {
    this.log('error', message, args);
  }

  success(message: string, ...args: unknown[]): void {
    this.log('success', message, args);
  }

  private log(level: LogLevel, message: string, args: unknown[]): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const prefix = this.getPrefix(level);
    const formattedArgs = args.length > 0 ? ' ' + args.map(String).join(' ') : '';
    const output = `${prefix} ${message}${formattedArgs}\n`;

    switch (level) {
      case 'debug':
      case 'info':
      case 'success':
        this.stream.write(output);
        break;
      case 'warn':
      case 'error':
        this.errorStream.write(output);
        break;
    }
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3,
      success: 1,
    };
    return levels[level] >= levels[this.level];
  }

  private getPrefix(level: LogLevel): string {
    const prefixes: Record<LogLevel, string> = {
      debug: this.colorize('DEBUG', 'gray'),
      info: this.colorize('INFO', 'blue'),
      warn: this.colorize('WARN', 'yellow'),
      error: this.colorize('ERROR', 'red'),
      success: this.colorize('OK', 'green'),
    };
    return prefixes[level];
  }

  private colorize(text: string, color: string): string {
    if (!this.useColor) {
      return `[${text}]`;
    }
    const colors: Record<string, string> = {
      gray: '\x1b[90m',
      blue: '\x1b[34m',
      yellow: '\x1b[33m',
      red: '\x1b[31m',
      green: '\x1b[32m',
      reset: '\x1b[0m',
    };
    return `${colors[color]}[${text}]${colors.reset}`;
  }
}

export function createLogger(options?: LoggerOptions): Logger {
  return new ConsoleLogger(options);
}

export const logger = new ConsoleLogger();

export function log(message: string, verbose: boolean = false): void {
  if (verbose) {
    logger.debug(message);
  }
}
