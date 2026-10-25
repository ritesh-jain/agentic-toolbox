// Target definitions — single source of truth for target platforms
import type { Target } from '@/types/index.js';

export interface TargetDefinition {
  name: string;
  value: Target;
  description: string;
  directory: string;
  stripFields: string[];
  transformAgents: boolean;
  transformSkills: boolean;
}

export const TARGET_DEFINITIONS: Record<string, TargetDefinition> = {
  opencode: {
    name: 'opencode',
    value: 'opencode',
    description: 'Sync to .opencode/ directory',
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
    value: 'claude',
    description: 'Sync to .claude/ directory',
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
    value: 'agents',
    description: 'Sync to .agents/ directory (standard)',
    directory: '.agents',
    stripFields: [],
    transformAgents: false,
    transformSkills: false,
  },
};

export const TARGET_OPTIONS = Object.values(TARGET_DEFINITIONS).map(t => ({
  name: t.name,
  value: t.value,
  description: t.description,
}));

export function getTargetDefinition(target: Target): TargetDefinition {
  const def = TARGET_DEFINITIONS[target];
  if (!def) {
    throw new Error(`Unknown target: ${target}`);
  }
  return def;
}

export function getTargetNames(): Target[] {
  return Object.keys(TARGET_DEFINITIONS) as Target[];
}