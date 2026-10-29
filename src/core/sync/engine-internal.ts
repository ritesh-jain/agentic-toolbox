// Internal sync implementation
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SyncOptions, SyncResult, TargetConfig, LoadedConfig } from '@/types/index.js';
import { getParentProjectRoot, getToolkitDir } from '@/utils/fs/paths.js';
import { transformAgentContent } from '@/core/transform/index.js';
import { log } from '@/utils/logging/index.js';
import { SyncError, SyncErrorCode } from '@/utils/errors/classes.js';

export async function syncToTargetImpl(
  targetName: TargetConfig['name'],
  targetConfig: TargetConfig,
  options: SyncOptions
): Promise<SyncResult> {
  const parentProjectRoot = getParentProjectRoot();
  const toolkitDir = getToolkitDir();
  const targetDir = path.join(parentProjectRoot, targetConfig.directory);

  log(`  Syncing to ${targetConfig.directory}...`, options.verbose);

  try {
    if (!options.dryRun) {
      await cleanupTargetDirectory(targetDir);
      await createTargetDirectories(targetDir);
    }

    const toolkitAgentsDir = path.join(toolkitDir, 'agents');
    const toolkitSkillsDir = path.join(toolkitDir, 'skills');
    const projectAgentsDir = path.join(parentProjectRoot, options.config.paths?.agents || 'agents');
    const projectSkillsDir = path.join(parentProjectRoot, options.config.paths?.skills || 'skills');

    const filesSynced: string[] = [];

    // Sync agents with transformation
    if (!options.dryRun) {
      // First sync toolkit agents
      if (fs.existsSync(toolkitAgentsDir)) {
        const agentFiles = fs.readdirSync(toolkitAgentsDir).filter(f => f.endsWith('.md'));
        log(`    Found ${agentFiles.length} agent(s) in toolkit: ${agentFiles.join(', ')}`, options.verbose);
        for (const file of agentFiles) {
          const srcPath = path.join(toolkitAgentsDir, file);
          const destPath = path.join(targetDir, 'agents', file);
          const content = fs.readFileSync(srcPath, 'utf8');
          const transformed = targetConfig.transformAgents
            ? transformAgentContent(content, targetName)
            : content;
          fs.writeFileSync(destPath, transformed);
          filesSynced.push(`agents/${file}`);
          log(`    Copied agent: ${file}`, options.verbose);
        }
      } else {
        log(`    Toolkit agents directory not found: ${toolkitAgentsDir}`, options.verbose);
      }

      // Then merge project agents (overwrites toolkit agents with same name)
      if (fs.existsSync(projectAgentsDir)) {
        const agentFiles = fs.readdirSync(projectAgentsDir).filter(f => f.endsWith('.md'));
        log(`    Found ${agentFiles.length} agent(s) in project: ${agentFiles.join(', ')}`, options.verbose);
        for (const file of agentFiles) {
          const srcPath = path.join(projectAgentsDir, file);
          const destPath = path.join(targetDir, 'agents', file);
          const content = fs.readFileSync(srcPath, 'utf8');
          const transformed = targetConfig.transformAgents
            ? transformAgentContent(content, targetName)
            : content;
          fs.writeFileSync(destPath, transformed);
          filesSynced.push(`agents/${file}`);
          log(`    Merged project agent: ${file}`, options.verbose);
        }
      } else {
        log(`    Project agents directory not found: ${projectAgentsDir}`, options.verbose);
      }
    }

    // Sync skills (no transformation needed)
    if (!options.dryRun) {
      // First sync toolkit skills
      if (fs.existsSync(toolkitSkillsDir)) {
        const skillDirs = fs.readdirSync(toolkitSkillsDir).filter(f => fs.statSync(path.join(toolkitSkillsDir, f)).isDirectory());
        log(`    Found ${skillDirs.length} skill(s) in toolkit: ${skillDirs.join(', ')}`, options.verbose);
        await copyDirectoryRecursive(toolkitSkillsDir, path.join(targetDir, 'skills'));
        filesSynced.push('skills/');
        log(`    Copied skills from toolkit`, options.verbose);
      } else {
        log(`    Toolkit skills directory not found: ${toolkitSkillsDir}`, options.verbose);
      }

      // Then merge project skills (overwrites toolkit skills)
      if (fs.existsSync(projectSkillsDir)) {
        const skillDirs = fs.readdirSync(projectSkillsDir).filter(f => fs.statSync(path.join(projectSkillsDir, f)).isDirectory());
        log(`    Found ${skillDirs.length} skill(s) in project: ${skillDirs.join(', ')}`, options.verbose);
        await copyDirectoryRecursive(projectSkillsDir, path.join(targetDir, 'skills'));
        filesSynced.push('skills/');
        log(`    Merged project skills`, options.verbose);
      } else {
        log(`    Project skills directory not found: ${projectSkillsDir}`, options.verbose);
      }
    }

    return {
      success: true,
      message: `Synced to ${targetConfig.directory}`,
      target: targetName,
      filesSynced,
    };
  } catch (error) {
    return {
      success: false,
      target: targetName,
      message: `Failed to sync to ${targetConfig.directory}`,
      error: error as Error,
    };
  }
}

async function cleanupTargetDirectory(targetDir: string): Promise<void> {
  if (fs.existsSync(targetDir)) {
    fs.rmSync(targetDir, { recursive: true, force: true });
  }
}

async function createTargetDirectories(targetDir: string): Promise<void> {
  fs.mkdirSync(path.join(targetDir, 'agents'), { recursive: true });
  fs.mkdirSync(path.join(targetDir, 'skills'), { recursive: true });
}

async function copyDirectoryRecursive(src: string, dest: string): Promise<void> {
  fs.cpSync(src, dest, { recursive: true });
}