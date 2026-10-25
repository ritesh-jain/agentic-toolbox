// Atomic file writes
import * as fs from 'fs';
import * as path from 'path';
import { randomBytes } from 'crypto';

export function writeFileAtomic(filePath: string, content: string): void {
  const dir = path.dirname(filePath);
  const basename = path.basename(filePath);
  const tempFile = path.join(dir, `.${basename}.tmp.${randomBytes(8).toString('hex')}`);

  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(tempFile, content, 'utf8');
    fs.renameSync(tempFile, filePath);
  } catch (error) {
    // Cleanup temp file on error
    if (fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
    }
    throw error;
  }
}