// Main transform function - ties parser, stripper, reassembler together
import { parseFrontmatter } from './parser.js';
import { stripFields } from './stripper.js';
import { reassembleContent } from './reassembler.js';
import { Target, TransformOptions, ParsedContent, getStripFields } from '@/types/index.js';

export function transformAgentContent(content: string, target: Target): string {
  const options: TransformOptions = {
    target,
    stripFields: getStripFields(target),
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