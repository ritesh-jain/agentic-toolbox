// Field stripper for frontmatter
import type { FrontmatterData } from '@/types/index.js';

export function stripFields(frontmatter: FrontmatterData, fieldsToStrip: string[]): FrontmatterData {
  const result: FrontmatterData = { ...frontmatter };

  for (const field of fieldsToStrip) {
    if (field in result) {
      delete result[field];
    }
  }

  return result;
}