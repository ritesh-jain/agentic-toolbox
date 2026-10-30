// Path sanitization utilities
import * as path from 'path';
import { getParentProjectRoot, DEFAULT_CONFIG_NAME } from './paths.js';
import { ValidationError, ValidationErrorCode } from '../errors/index.js';

/**
 * Sanitizes a file path, ensuring it is a valid string, free of null bytes,
 * and contained within the expected root directory (preventing directory traversal).
 */
export function sanitizePath(filePath: string, rootDir: string = getParentProjectRoot()): string {
  if (!filePath || typeof filePath !== 'string') {
    throw new ValidationError({
      code: ValidationErrorCode.VALIDATION_FAILED,
      message: 'Path must be a non-empty string',
      details: { path: filePath },
    });
  }

  // Reject null bytes (common injection attack)
  if (filePath.includes('\0')) {
    throw new ValidationError({
      code: ValidationErrorCode.VALIDATION_FAILED,
      message: `Invalid path containing null bytes: "${filePath}"`,
      details: { path: filePath },
    });
  }

  // Resolve absolute path against rootDir
  const normalizedRoot = path.resolve(rootDir);
  const resolved = path.resolve(normalizedRoot, filePath);

  // Check for path traversal outside rootDir
  const relative = path.relative(normalizedRoot, resolved);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new ValidationError({
      code: ValidationErrorCode.VALIDATION_FAILED,
      message: `Path traversal detected: "${filePath}" resolves outside project root "${normalizedRoot}"`,
      details: { path: filePath, resolved, rootDir: normalizedRoot },
    });
  }

  return resolved;
}

/**
 * Sanitizes a config file path. Defaults to `agentic-toolbox.json` in the project root if omitted.
 * Verifies that the path ends with `.json` and does not traverse outside the project root.
 */
export function sanitizeConfigPath(customPath?: string, rootDir: string = getParentProjectRoot()): string {
  if (!customPath) {
    return path.join(rootDir, DEFAULT_CONFIG_NAME);
  }

  const sanitized = sanitizePath(customPath, rootDir);

  if (!sanitized.endsWith('.json')) {
    throw new ValidationError({
      code: ValidationErrorCode.VALIDATION_FAILED,
      message: `Config file must be a JSON file (.json), got: "${customPath}"`,
      details: { path: customPath, sanitized },
    });
  }

  return sanitized;
}
