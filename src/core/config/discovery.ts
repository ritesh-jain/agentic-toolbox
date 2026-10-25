// Auto-discovery logic
import * as fs from 'fs';
import * as path from 'path';
import { Config, Target } from '@/types/index.js';

export function discoverConfig(projectRoot: string): Config {
  // Check for OpenCode config
  if (fs.existsSync(path.join(projectRoot, 'opencode.json'))) {
    return { targets: ['opencode'] };
  }

  // Check for Claude config
  if (
    fs.existsSync(path.join(projectRoot, 'claude.json')) ||
    fs.existsSync(path.join(projectRoot, '.clauderc'))
  ) {
    return { targets: ['claude'] };
  }

  // Default to standard agents
  return { targets: ['agents'] };
}

export function getDiscoveredTargets(projectRoot: string): Target[] {
  const config = discoverConfig(projectRoot);
  return config.targets;
}