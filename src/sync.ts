import fs from 'fs';
import path from 'path';
import { getParentProjectRoot, getSubmoduleDir } from './config.js';
import { TOOL_MAP } from './constants.js';
import { transformAgentContent } from './transform.js';
import type { AgenticToolkitConfig } from './types.js';

interface SyncOptions {
  config: AgenticToolkitConfig;
  dryRun?: boolean;
  verbose?: boolean;
}

function log(message: string, verbose: boolean = false): void {
  if (verbose) {
    console.log(message);
  }
}

export function syncToTarget(target: 'opencode' | 'claude' | 'agents', options: SyncOptions): { success: boolean; message?: string; error?: Error } {
  const parentProjectRoot = getParentProjectRoot();
  const submoduleDir = getSubmoduleDir();
  const targetDir = path.join(parentProjectRoot, TOOL_MAP[target]);

  log(`  Syncing to ${TOOL_MAP[target]}...`, options.verbose);

  try {
    if (!options.dryRun) {
      if (fs.existsSync(targetDir)) {
        fs.rmSync(targetDir, { recursive: true, force: true });
      }

      fs.mkdirSync(path.join(targetDir, 'agents'), { recursive: true });
      fs.mkdirSync(path.join(targetDir, 'skills'), { recursive: true });
    }

    const submoduleAgents = path.join(submoduleDir, '..', 'agents');
    const submoduleSkills = path.join(submoduleDir, '..', 'skills');

    // Also check project-level agents/skills
    const projectAgents = path.join(parentProjectRoot, 'agents');
    const projectSkills = path.join(parentProjectRoot, 'skills');

    // Sync agents with transformation
    if (!options.dryRun) {
      // First sync package agents
      if (fs.existsSync(submoduleAgents)) {
        const agentFiles = fs.readdirSync(submoduleAgents).filter(f => f.endsWith('.md'));
        for (const file of agentFiles) {
          const srcPath = path.join(submoduleAgents, file);
          const destPath = path.join(targetDir, 'agents', file);
          const content = fs.readFileSync(srcPath, 'utf8');
          const transformed = transformAgentContent(content, target);
          fs.writeFileSync(destPath, transformed);
          log(`    Copied agent: ${file}`, options.verbose);
        }
      }

      // Then merge project agents (overwrites package agents with same name)
      if (fs.existsSync(projectAgents)) {
        const agentFiles = fs.readdirSync(projectAgents).filter(f => f.endsWith('.md'));
        for (const file of agentFiles) {
          const srcPath = path.join(projectAgents, file);
          const destPath = path.join(targetDir, 'agents', file);
          const content = fs.readFileSync(srcPath, 'utf8');
          const transformed = transformAgentContent(content, target);
          fs.writeFileSync(destPath, transformed);
          log(`    Merged project agent: ${file}`, options.verbose);
        }
      }
    }

    // Sync skills (no transformation needed)
    if (!options.dryRun) {
      // First sync package skills
      if (fs.existsSync(submoduleSkills)) {
        fs.cpSync(submoduleSkills, path.join(targetDir, 'skills'), { recursive: true });
        log(`    Copied skills from package`, options.verbose);
      }

      // Then merge project skills
      if (fs.existsSync(projectSkills)) {
        fs.cpSync(projectSkills, path.join(targetDir, 'skills'), { recursive: true });
        log(`    Merged project skills`, options.verbose);
      }
    }

    return { success: true, message: `Synced to ${TOOL_MAP[target]}` };
  } catch (error) {
    return { success: false, error: error as Error, message: `Failed to sync to ${TOOL_MAP[target]}` };
  }
}