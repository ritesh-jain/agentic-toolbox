// Project merge logic
import { LoadedConfig } from '@/types/index.js';
import { getParentProjectRoot, getToolkitDir } from '@/utils/fs/paths.js';
import * as fs from 'fs';
import * as path from 'path';

export interface MergeResult {
  overwritten: string[];
  added: string[];
  skipped: string[];
}

export async function mergeAgents(
  targetDir: string,
  toolkitDir: string,
  projectDir: string,
  config: LoadedConfig
): Promise<MergeResult> {
  const result: MergeResult = { overwritten: [], added: [], skipped: [] };

  const toolkitAgentsDir = path.join(toolkitDir, 'agents');
  const projectAgentsDir = projectDir;

  if (!fs.existsSync(toolkitAgentsDir) && !fs.existsSync(projectAgentsDir)) {
    return result;
  }

  const toolkitFiles = new Set(fs.existsSync(toolkitAgentsDir)
    ? fs.readdirSync(toolkitAgentsDir).filter(f => f.endsWith('.md'))
    : []);
  const projectFiles = new Set(fs.existsSync(projectAgentsDir)
    ? fs.readdirSync(projectAgentsDir).filter(f => f.endsWith('.md'))
    : []);

  const allFiles = new Set([...toolkitFiles, ...projectFiles]);

  for (const file of allFiles) {
    const destPath = path.join(targetDir, 'agents', file);
    const isInToolkit = toolkitFiles.has(file);
    const isInProject = projectFiles.has(file);

    if (isInProject) {
      // Project file takes precedence
      const srcPath = path.join(projectAgentsDir, file);
      fs.copyFileSync(srcPath, destPath);
      if (isInToolkit) {
        result.overwritten.push(file);
      } else {
        result.added.push(file);
      }
    } else if (isInToolkit) {
      // Only in toolkit
      const srcPath = path.join(toolkitAgentsDir, file);
      fs.copyFileSync(srcPath, destPath);
      result.added.push(file);
    }
  }

  return result;
}

export async function mergeSkills(
  targetDir: string,
  toolkitDir: string,
  projectDir: string
): Promise<MergeResult> {
  const result: MergeResult = { overwritten: [], added: [], skipped: [] };

  const toolkitSkillsDir = path.join(toolkitDir, 'skills');
  const projectSkillsDir = projectDir;

  if (!fs.existsSync(toolkitSkillsDir) && !fs.existsSync(projectSkillsDir)) {
    return result;
  }

  // For skills, we do recursive directory merge
  // Project skills overwrite toolkit skills
  if (fs.existsSync(toolkitSkillsDir)) {
    copyDirectoryRecursive(toolkitSkillsDir, path.join(targetDir, 'skills'));
    result.added.push('skills/ (toolkit)');
  }

  if (fs.existsSync(projectSkillsDir)) {
    copyDirectoryRecursive(projectSkillsDir, path.join(targetDir, 'skills'));
    result.overwritten.push('skills/ (project)');
  }

  return result;
}

function copyDirectoryRecursive(src: string, dest: string): void {
  fs.cpSync(src, dest, { recursive: true });
}