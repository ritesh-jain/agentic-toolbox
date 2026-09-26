import type { ToolMap, StripFields } from './types.js';

export const TOOL_MAP: ToolMap = {
  opencode: '.opencode',
  claude: '.claude',
  agents: '.agents',
} as const;

export const STRIP_FIELDS: StripFields = {
  opencode: [
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
  claude: [
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
} as const;

export const DEFAULT_CONFIG_NAME = 'agentic-toolkit.json';

export const FRONTMATTER_REGEX = /^(---\n)([\s\S]*?)(\n---)/;