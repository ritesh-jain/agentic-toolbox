// Transform types
import type { Target } from './config.js';

export interface StripFields {
  opencode: string[];
  claude: string[];
}

export interface TransformOptions {
  target: Target;
  stripFields: string[];
  preserveComments?: boolean;
}

export interface FrontmatterData {
  [key: string]: unknown;
}

export interface ParsedContent {
  frontmatter: FrontmatterData;
  body: string;
  hasFrontmatter: boolean;
}