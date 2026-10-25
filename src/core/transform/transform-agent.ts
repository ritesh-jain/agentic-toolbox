// Main transform function - ties parser, stripper, reassembler together
import { parseFrontmatter } from './parser.js';
import { stripFields, getStripFields } from './stripper.js';
import { reassembleContent } from './reassembler.js';
import type { Target } from '@/types/index.js';

// Transform types - module-specific
interface TransformOptions {
  target: Target;
  stripFields: string[];
  preserveComments?: boolean;
}

interface StripFields {
  opencode: string[];
  claude: string[];
}

interface FrontmatterData {
  [key: string]: unknown;
}

interface ParsedContent {
  frontmatter: FrontmatterData;
  body: string;
  hasFrontmatter: boolean;
}

export function transformAgentContent(content: string, target: TransformOptions['target']): string {
  const options: TransformOptions = {
    target,
    stripFields: getStripFields(target, STRIP_FIELDS),
    preserveComments: false,
  };

  const parsed = parseFrontmatter(content);

  if (!parsed.hasFrontmatter || options.stripFields.length === 0) {
    return content;
  }

  const strippedFrontmatter = stripFields(parsed.frontmatter, options.stripFields);
  const transformed: ParsedContent = {
    ...parsed,
    frontmatter: strippedFrontmatter,
  };

  return reassembleContent(transformed, content);
}

// STRIP_FIELDS moved here from constants.ts for better organization
const STRIP_FIELDS: StripFields = {
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
};