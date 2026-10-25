// Target configurations
import { TargetConfig, Target } from '@/types/index.js';

export const TARGET_CONFIGS: Record<Target, TargetConfig> = {
  opencode: {
    name: 'opencode',
    directory: '.opencode',
    stripFields: [
      'tools',
      'disallowedTools',
      'permissionMode',
      'maxTurns',
      'skills',
      'mcpServers',
      'hooks',
      'memory',
      'background',
      'effort',
      'isolation',
      'initialPrompt',
    ],
    transformAgents: true,
    transformSkills: false,
  },
  claude: {
    name: 'claude',
    directory: '.claude',
    stripFields: [
      'permission',
      'mode',
      'temperature',
      'steps',
      'disable',
      'prompt',
      'hidden',
      'top_p',
      'reasoningEffort',
      'textVerbosity',
    ],
    transformAgents: true,
    transformSkills: false,
  },
  agents: {
    name: 'agents',
    directory: '.agents',
    stripFields: [],
    transformAgents: false,
    transformSkills: false,
  },
};

export function getTargetConfig(target: Target): TargetConfig {
  const config = TARGET_CONFIGS[target];
  if (!config) {
    throw new Error(`Unknown target: ${target}`);
  }
  return config;
}

export function getAllTargetConfigs(): TargetConfig[] {
  return Object.values(TARGET_CONFIGS);
}

export function getTargetNames(): Target[] {
  return Object.keys(TARGET_CONFIGS) as Target[];
}