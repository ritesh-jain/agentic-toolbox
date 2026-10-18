import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { AgenticToolkitConfig } from './types.js';
import { DEFAULT_CONFIG_NAME } from './constants.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getParentProjectRoot(): string {
  return process.cwd();
}

function getSubmoduleDir(): string {
  return __dirname;
}

export function loadConfig(customConfigPath?: string): AgenticToolkitConfig {
  const parentProjectRoot = getParentProjectRoot();
  const configPath = customConfigPath || path.join(parentProjectRoot, DEFAULT_CONFIG_NAME);
  const defaultConfig: AgenticToolkitConfig = { targets: ['agents'] };

  if (fs.existsSync(configPath)) {
    try {
      const fileContent = fs.readFileSync(configPath, 'utf8');
      const parsedConfig = JSON.parse(fileContent);

      if (parsedConfig.targets && Array.isArray(parsedConfig.targets)) {
        return parsedConfig;
      }
    } catch {
      // Invalid JSON, fall back to auto-discovery
    }
  }

  // Fallback Discovery
  if (fs.existsSync(path.join(parentProjectRoot, 'opencode.json'))) {
    return { targets: ['opencode'] };
  }
  if (
    fs.existsSync(path.join(parentProjectRoot, 'claude.json')) ||
    fs.existsSync(path.join(parentProjectRoot, '.clauderc'))
  ) {
    return { targets: ['claude'] };
  }

  return defaultConfig;
}

export { getParentProjectRoot, getSubmoduleDir };