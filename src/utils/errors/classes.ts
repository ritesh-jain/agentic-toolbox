// Structured error classes
import { ErrorCode, ErrorContext } from '@/types/index.js';

export class AgenticToolboxError extends Error {
  public readonly code: ErrorCode;
  public readonly context: Record<string, unknown>;
  public readonly path?: string;
  public readonly target?: string;

  constructor(context: ErrorContext) {
    super(context.message);
    this.name = this.constructor.name;
    this.code = context.code;
    this.context = context.details || {};
    this.path = context.path;
    this.target = context.target;

    // Maintains proper stack trace in V8 environments
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  toJSON(): object {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      context: this.context,
      path: this.path,
      target: this.target,
      stack: this.stack,
    };
  }
}

export class ConfigError extends AgenticToolboxError {
  constructor(context: ErrorContext) {
    super(context);
    this.name = 'ConfigError';
  }
}

export class SyncError extends AgenticToolboxError {
  constructor(context: ErrorContext) {
    super(context);
    this.name = 'SyncError';
  }
}

export class TransformError extends AgenticToolboxError {
  constructor(context: ErrorContext) {
    super(context);
    this.name = 'TransformError';
  }
}

export class ParseError extends AgenticToolboxError {
  constructor(context: ErrorContext) {
    super(context);
    this.name = 'ParseError';
  }
}

export class FsError extends AgenticToolboxError {
  constructor(context: ErrorContext) {
    super(context);
    this.name = 'FsError';
  }
}

export class CliError extends AgenticToolboxError {
  constructor(context: ErrorContext) {
    super(context);
    this.name = 'CliError';
  }
}

export class ValidationError extends AgenticToolboxError {
  constructor(context: ErrorContext) {
    super(context);
    this.name = 'ValidationError';
  }
}

// Error code enums
export enum ConfigErrorCode {
  CONFIG_NOT_FOUND = 'CONFIG_NOT_FOUND',
  CONFIG_INVALID_JSON = 'CONFIG_INVALID_JSON',
  CONFIG_VALIDATION_FAILED = 'CONFIG_VALIDATION_FAILED',
  CONFIG_UNKNOWN_TARGET = 'CONFIG_UNKNOWN_TARGET',
  CONFIG_UNKNOWN_FIELD = 'CONFIG_UNKNOWN_FIELD',
}

export enum SyncErrorCode {
  SYNC_TARGET_FAILED = 'SYNC_TARGET_FAILED',
  SYNC_DIRECTORY_CLEANUP_FAILED = 'SYNC_DIRECTORY_CLEANUP_FAILED',
  SYNC_FILE_READ_FAILED = 'SYNC_FILE_READ_FAILED',
  SYNC_FILE_WRITE_FAILED = 'SYNC_FILE_WRITE_FAILED',
  SYNC_FILE_COPY_FAILED = 'SYNC_FILE_COPY_FAILED',
  SYNC_MERGE_FAILED = 'SYNC_MERGE_FAILED',
}

export enum TransformErrorCode {
  TRANSFORM_PARSE_FAILED = 'TRANSFORM_PARSE_FAILED',
  TRANSFORM_STRIP_FAILED = 'TRANSFORM_STRIP_FAILED',
  TRANSFORM_REASSEMBLE_FAILED = 'TRANSFORM_REASSEMBLE_FAILED',
}

export enum ParseErrorCode {
  YAML_PARSE_FAILED = 'YAML_PARSE_FAILED',
  YAML_STRINGIFY_FAILED = 'YAML_STRINGIFY_FAILED',
}

export enum FsErrorCode {
  FS_READ_FAILED = 'FS_READ_FAILED',
  FS_WRITE_FAILED = 'FS_WRITE_FAILED',
  FS_COPY_FAILED = 'FS_COPY_FAILED',
  FS_REMOVE_FAILED = 'FS_REMOVE_FAILED',
  FS_PATH_RESOLUTION_FAILED = 'FS_PATH_RESOLUTION_FAILED',
}

export enum CliErrorCode {
  CLI_INVALID_ARGS = 'CLI_INVALID_ARGS',
  CLI_UNKNOWN_COMMAND = 'CLI_UNKNOWN_COMMAND',
}

export enum ValidationErrorCode {
  VALIDATION_FAILED = 'VALIDATION_FAILED',
}