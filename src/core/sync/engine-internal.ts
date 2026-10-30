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
        for (const file of agentFiles) {
          const srcPath = path.join(toolkitAgentsDir, file);
          const destPath = path.join(targetDir, 'agents', file);
          const content = fs.readFileSync(srcPath, 'utf8');
          const transformed = targetConfig.transformAgents
            ? transformAgentContent(content, targetName)
            : content;
          fs.writeFileSync(destPath, transformed);
          const agentName = file.replace(/\.md$/, '');
          filesSynced.push(`agents/${file}`);
          log(`[OK]   '${agentName}' Agent Synced to ${targetConfig.directory}`, true);
        }
      } else {
        log(`    Toolkit agents directory not found: ${toolkitAgentsDir}`, options.verbose);
      }

      // Then merge project agents (overwrites toolkit agents with same name)
      if (fs.existsSync(projectAgentsDir)) {
        const agentFiles = fs.readdirSync(projectAgentsDir).filter(f => f.endsWith('.md'));
        for (const file of agentFiles) {
          const srcPath = path.join(projectAgentsDir, file);
          const destPath = path.join(targetDir, 'agents', file);
          const content = fs.readFileSync(srcPath, 'utf8');
          const transformed = targetConfig.transformAgents
            ? transformAgentContent(content, targetName)
            : content;
          fs.writeFileSync(destPath, transformed);
          const agentName = file.replace(/\.md$/, '');
          filesSynced.push(`agents/${file}`);
          log(`[OK]   '${agentName}' Agent Synced to ${targetConfig.directory}`, true);
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
        for (const skillDir of skillDirs) {
          await copyDirectoryRecursive(
            path.join(toolkitSkillsDir, skillDir),
            path.join(targetDir, 'skills', skillDir)
          );
          filesSynced.push(`skills/${skillDir}/`);
          log(`[OK]   '${skillDir}' Skill Synced to ${targetConfig.directory}`, true);
        }
      } else {
        log(`    Toolkit skills directory not found: ${toolkitSkillsDir}`, options.verbose);
      }

      // Then merge project skills (overwrites toolkit skills)
      if (fs.existsSync(projectSkillsDir)) {
        const skillDirs = fs.readdirSync(projectSkillsDir).filter(f => fs.statSync(path.join(projectSkillsDir, f)).isDirectory());
        for (const skillDir of skillDirs) {
          await copyDirectoryRecursive(
            path.join(projectSkillsDir, skillDir),
            path.join(targetDir, 'skills', skillDir)
          );
          filesSynced.push(`skills/${skillDir}/`);
          log(`[OK]   '${skillDir}' Skill Synced to ${targetConfig.directory}`, true);
        }
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