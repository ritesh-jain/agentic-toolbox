// Sync types
import type { LoadedConfig, Target } from './config.js';

export interface SyncOptions {
  config: LoadedConfig;
  dryRun?: boolean;
  verbose?: boolean;
  targets?: Target[];
}

export interface SyncResult {
  target: Target;
  success: boolean;
  message?: string;
  error?: Error;
  filesSynced?: string[];
}

export type { TargetConfig } from './targets.js';

export interface SyncManifest {
  version: number;
  files: Record<string, FileManifestEntry>;
}

export interface FileManifestEntry {
  hash: string;
  size: number;
  mtime: number;
  target: Target;
}