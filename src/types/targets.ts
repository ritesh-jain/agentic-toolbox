// Target definitions — single source of truth for target platforms
import type { Target } from './config.js';

export interface TargetDefinition {
  name: Target;
  value: Target;
  description: string;
  directory: string;
  stripFields: string[];
  transformAgents: boolean;
  transformSkills: boolean;
}

export type TargetConfig = TargetDefinition;

export const TARGET_DEFINITIONS: Record<Target, TargetDefinition> = {
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

export function getAllTargetConfigs(): TargetConfig[] {
  return Object.values(TARGET_DEFINITIONS);
}

export function getStripFields(target: Target): string[] {
  return TARGET_DEFINITIONS[target]?.stripFields ?? [];
}

export function isValidTarget(target: string): target is Target {
  return typeof target === 'string' && Object.prototype.hasOwnProperty.call(TARGET_DEFINITIONS, target.trim());
}

export function validateTarget(target: string): Target {
  const trimmed = typeof target === 'string' ? target.trim() : '';
  if (!isValidTarget(trimmed)) {
    const validTargets = getTargetNames().join(', ');
    throw new Error(`Invalid target: "${target}". Expected one of: ${validTargets}`);
  }
  return trimmed as Target;
}

export function validateTargets(targets: string[]): Target[] {
  if (!Array.isArray(targets)) {
    throw new Error('Targets must be an array of strings');
  }
  return targets.map(t => validateTarget(t));
}
