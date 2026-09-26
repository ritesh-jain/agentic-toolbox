import type { StripFields } from './types.js';
import { STRIP_FIELDS, FRONTMATTER_REGEX } from './constants.js';

export function transformAgentContent(content: string, target: 'opencode' | 'claude' | 'agents'): string {
  const fieldsToStrip = STRIP_FIELDS[target as keyof typeof STRIP_FIELDS];
  if (!fieldsToStrip || fieldsToStrip.length === 0) return content;

  const match = content.match(FRONTMATTER_REGEX);
  if (!match) return content;

  const [, opening, frontmatter, closing] = match;
  const lines = frontmatter.split('\n');
  const transformedLines: string[] = [];
  let skipBlock = false;
  let indent = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const fieldMatch = line.match(/^(\s*)(\w[\w-]*):/);

    if (fieldMatch) {
      const currentIndent = fieldMatch[1].length;
      const fieldName = fieldMatch[2];

      if (skipBlock) {
        if (currentIndent <= indent) {
          skipBlock = false;
        } else {
          continue;
        }
      }

      if (fieldsToStrip.includes(fieldName)) {
        skipBlock = true;
        indent = currentIndent;
        continue;
      }
    } else if (skipBlock) {
      continue;
    }

    transformedLines.push(line);
  }

  const transformedFrontmatter = transformedLines.join('\n');
  return content.replace(FRONTMATTER_REGEX, `${opening}${transformedFrontmatter}${closing}`);
}