// Incremental sync manifest
import * as fs from 'fs';
import * as path from 'path';
import { createHash } from 'crypto';
import { getParentProjectRoot } from '@/utils/fs/paths.js';
import type { Target } from '@/types/index.js';

// Manifest types - module-specific
interface SyncManifest {
  version: number;
  files: Record<string, FileManifestEntry>;
}

interface FileManifestEntry {
  hash: string;
  size: number;
  mtime: number;
  target: Target;
}

const MANIFEST_FILENAME = '.agentic-toolbox-manifest.json';

export function getManifestPath(targetDir: string): string {
  return path.join(targetDir, MANIFEST_FILENAME);
}

export function loadManifest(targetDir: string): SyncManifest | null {
  const manifestPath = getManifestPath(targetDir);
  if (!fs.existsSync(manifestPath)) {
    return null;
  }
  try {
    const content = fs.readFileSync(manifestPath, 'utf8');
    return JSON.parse(content) as SyncManifest;
  } catch {
    return null;
  }
}

export function saveManifest(targetDir: string, manifest: SyncManifest): void {
  const manifestPath = getManifestPath(targetDir);
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
}

export function createManifest(): SyncManifest {
  return {
    version: 1,
    files: {},
  };
}

export function computeFileHash(filePath: string): string {
  const content = fs.readFileSync(filePath);
  return createHash('sha256').update(content).digest('hex').substring(0, 16);
}

export function createFileEntry(
  filePath: string,
  targetDir: string,
  target: Target
): FileManifestEntry {
  const stats = fs.statSync(filePath);
  const relativePath = path.relative(targetDir, filePath);
  return {
    hash: computeFileHash(filePath),
    size: stats.size,
    mtime: stats.mtimeMs,
    target,
  };
}

export function hasFileChanged(
  manifest: SyncManifest,
  filePath: string,
  targetDir: string,
  target: Target
): boolean {
  const relativePath = path.relative(targetDir, filePath);
  const entry = manifest.files[relativePath];
  if (!entry) {
    return true; // New file
  }
  const currentEntry = createFileEntry(filePath, targetDir, target);
  return currentEntry.hash !== entry.hash;
}

export function updateManifestForSync(
  manifest: SyncManifest,
  targetDir: string,
  target: Target,
  syncedFiles: string[]
): SyncManifest {
  const newManifest = { ...manifest, files: { ...manifest.files } };

  for (const file of syncedFiles) {
    const filePath = path.join(targetDir, file);
    if (fs.existsSync(filePath)) {
      newManifest.files[file] = createFileEntry(filePath, targetDir, target);
    } else {
      delete newManifest.files[file];
    }
  }

  return newManifest;
}