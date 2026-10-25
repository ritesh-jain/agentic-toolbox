// Error types
export type ErrorCode =
  | 'CONFIG_NOT_FOUND'
  | 'CONFIG_INVALID_JSON'
  | 'CONFIG_VALIDATION_FAILED'
  | 'CONFIG_UNKNOWN_TARGET'
  | 'CONFIG_UNKNOWN_FIELD'
  | 'SYNC_TARGET_FAILED'
  | 'SYNC_DIRECTORY_CLEANUP_FAILED'
  | 'SYNC_FILE_READ_FAILED'
  | 'SYNC_FILE_WRITE_FAILED'
  | 'SYNC_FILE_COPY_FAILED'
  | 'SYNC_MERGE_FAILED'
  | 'TRANSFORM_PARSE_FAILED'
  | 'TRANSFORM_STRIP_FAILED'
  | 'TRANSFORM_REASSEMBLE_FAILED'
  | 'FS_READ_FAILED'
  | 'FS_WRITE_FAILED'
  | 'FS_COPY_FAILED'
  | 'FS_REMOVE_FAILED'
  | 'FS_PATH_RESOLUTION_FAILED'
  | 'YAML_PARSE_FAILED'
  | 'YAML_STRINGIFY_FAILED'
  | 'CLI_INVALID_ARGS'
  | 'CLI_UNKNOWN_COMMAND'
  | 'VALIDATION_FAILED';

export interface ErrorContext {
  code: ErrorCode;
  message: string;
  details?: Record<string, unknown>;
  path?: string;
  target?: string;
}

export interface ValidationError {
  field: string;
  message: string;
  value?: unknown;
}