// Configuration types
export interface Config {
  targets: Target[];
  sync?: SyncConfig;
  transform?: TransformConfig;
  paths?: PathsConfig;
}

export type Target = 'opencode' | 'claude' | 'agents';

export interface SyncConfig {
  incremental?: boolean;
  backup?: boolean;
}

export interface TransformConfig {
  preserveComments?: boolean;
}

export interface PathsConfig {
  agents?: string;
  skills?: string;
}

export interface LoadedConfig extends Config {
  resolvedTargets: Target[];
}