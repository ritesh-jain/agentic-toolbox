// Config loader
import * as fs from 'fs';
import * as path from 'path';
import { Config, LoadedConfig, Target } from '@/types/index.js';
import { DEFAULT_CONFIG_NAME } from '@/utils/fs/paths.js';
import { getParentProjectRoot, getToolkitDir } from '@/utils/fs/paths.js';
import { discoverConfig } from './discovery.js';
import { validateConfig } from './schema.js';
import { ConfigError, ConfigErrorCode } from '@/utils/errors/classes.js';

export function loadConfig(customConfigPath?: string): LoadedConfig {
  const parentProjectRoot = getParentProjectRoot();
  const configPath = customConfigPath || path.join(parentProjectRoot, DEFAULT_CONFIG_NAME);
  const defaultConfig: Config = { targets: ['agents'] };

  let config: Config;

  if (fs.existsSync(configPath)) {
    try {
      const fileContent = fs.readFileSync(configPath, 'utf8');
      const parsedConfig = JSON.parse(fileContent);
      config = parsedConfig;
    } catch (error) {
      throw new ConfigError({
        code: ConfigErrorCode.CONFIG_INVALID_JSON,
        message: `Failed to parse config file: ${configPath}`,
        details: { path: configPath, originalError: error instanceof Error ? error.message : String(error) },
        path: configPath,
      });
    }
  } else {
    // Auto-discovery fallback
    config = discoverConfig(parentProjectRoot);
  }

  // Validate config
  const validation = validateConfig(config);
  if (!validation.valid) {
    throw new ConfigError({
      code: ConfigErrorCode.CONFIG_VALIDATION_FAILED,
      message: 'Config validation failed',
      details: { errors: validation.errors },
    });
  }

  // Resolve targets
  const resolvedTargets = resolveTargets(config.targets);

  return {
    ...config,
    resolvedTargets,
  };
}

function resolveTargets(targets?: Target[]): Target[] {
  if (!targets || targets.length === 0) {
    return ['agents'];
  }
  return targets;
}