// YAML frontmatter parser using yaml package
import { parse, stringify } from 'yaml';
import { ParseError, ParseErrorCode } from '@/utils/errors/classes.js';

import type { FrontmatterData, ParsedContent } from '@/types/index.js';

const FRONTMATTER_REGEX = /^(---\n)([\s\S]*?)(\n---)/;

export function parseFrontmatter(content: string): ParsedContent {
  const match = content.match(FRONTMATTER_REGEX);
  if (!match) {
    return {
      frontmatter: {},
      body: content,
      hasFrontmatter: false,
    };
  }

  const [, opening, frontmatter, closing] = match;
  let parsed: FrontmatterData;

  try {
    parsed = parse(frontmatter) as FrontmatterData;
  } catch (error) {
    throw new ParseError({
      code: ParseErrorCode.YAML_PARSE_FAILED,
      message: 'Failed to parse YAML frontmatter',
      details: { originalError: error instanceof Error ? error.message : String(error) },
    });
  }

  // Find the body (everything after the closing ---)
  const bodyStart = match.index! + match[0].length;
  const body = content.slice(bodyStart).trimStart();

  return {
    frontmatter: parsed || {},
    body,
    hasFrontmatter: true,
  };
}

export function stringifyFrontmatter(frontmatter: FrontmatterData): string {
  try {
    return stringify(frontmatter);
  } catch (error) {
    throw new ParseError({
      code: ParseErrorCode.YAML_STRINGIFY_FAILED,
      message: 'Failed to stringify YAML frontmatter',
      details: { originalError: error instanceof Error ? error.message : String(error) },
    });
  }
}

export function extractFrontmatterDelimiters(content: string): { opening: string; closing: string } | null {
  const match = content.match(FRONTMATTER_REGEX);
  if (!match) {
    return null;
  }
  return {
    opening: match[1],
    closing: match[3],
  };
}