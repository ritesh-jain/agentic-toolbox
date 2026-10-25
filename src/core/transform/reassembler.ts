// Reassemble frontmatter and body into final content
import { ParsedContent } from '@/types/index.js';
import { stringifyFrontmatter, extractFrontmatterDelimiters } from './parser.js';

export function reassembleContent(
  parsed: ParsedContent,
  originalContent: string
): string {
  if (!parsed.hasFrontmatter) {
    return originalContent;
  }

  const delimiters = extractFrontmatterDelimiters(originalContent);
  if (!delimiters) {
    return originalContent;
  }

  const frontmatterYaml = stringifyFrontmatter(parsed.frontmatter);
  return `${delimiters.opening}${frontmatterYaml}${delimiters.closing}${parsed.body}`;
}