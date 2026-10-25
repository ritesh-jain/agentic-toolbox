// Field stripper for frontmatter
import type { Target } from '@/types/index.js';

// Local types
interface FrontmatterData {
  [key: string]: unknown;
}

interface StripFields {
  opencode: string[];
  claude: string[];
}

export function stripFields(frontmatter: FrontmatterData, fieldsToStrip: string[]): FrontmatterData {
  const result: FrontmatterData = { ...frontmatter };

  for (const field of fieldsToStrip) {
    if (field in result) {
      delete result[field];
    }
  }

  return result;
}

export function getStripFields(target: 'opencode' | 'claude' | 'agents', stripFields: StripFields): string[] {
  return stripFields[target as keyof StripFields] || [];
}