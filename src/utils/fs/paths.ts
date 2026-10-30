// Path resolution utilities
import * as path from 'path';
import { fileURLToPath } from 'url';
import * as fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const DEFAULT_CONFIG_NAME = 'agentic-toolbox.json';

let cachedVersion: string = '0.0.0';

export function getPackageVersion(): string {
  if (cachedVersion !== '0.0.0') {
    return cachedVersion;
  }

  // Try to read from package.json - check both dist/ and source locations
  // When running from dist: __dirname = dist/utils/fs, need to go up 2 to get to project root
  // When running from source (ts-node): __dirname = src/utils/fs, need to go up 2 to get to project root
  const possiblePaths = [
    path.join(__dirname, '..', '..', 'package.json'),  // dist/ or src/
    path.join(__dirname, '..', '..', '..', 'package.json'),  // if in node_modules
  ];

  for (const packageJsonPath of possiblePaths) {
    try {
      const content = fs.readFileSync(packageJsonPath, 'utf8');
      const pkg = JSON.parse(content);
      if (pkg.version) {
        cachedVersion = pkg.version;
        return cachedVersion;
      }
    } catch {
      // continue to next path
    }
  }

  cachedVersion = '0.0.0';
  return cachedVersion;
}

export function getParentProjectRoot(): string {
  return process.cwd();
}

export function getToolkitDir(): string {
  // When installed as a dependency:
  // __dirname = node_modules/agentic-toolbox/dist/utils/fs
  // agents/ and skills/ are at package root (node_modules/agentic-toolbox/)
  // Need to go up 3 levels: dist/utils/fs -> dist/utils -> dist -> package root
  return path.join(__dirname, '..', '..', '..');
}

export function getToolkitAgentsDir(): string {
  return path.join(getToolkitDir(), 'agents');
}

export function getToolkitSkillsDir(): string {
  return path.join(getToolkitDir(), 'skills');
}

export function resolveTargetDir(targetDir: string): string {
  return path.join(getParentProjectRoot(), targetDir);
}

export function getConfigPath(customPath?: string): string {
  return customPath || path.join(getParentProjectRoot(), DEFAULT_CONFIG_NAME);
}