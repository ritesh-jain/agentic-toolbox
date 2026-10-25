// Diff command implementation
import { CliArgs, CommandResult, Target } from '@/types/index.js';
import { loadConfig } from '@/core/config/index.js';
import { getTargetConfig } from '@/core/sync/targets/index.js';
import { transformAgentContent } from '@/core/transform/index.js';
import { logger } from '@/utils/logging/index.js';
import { getPackageVersion } from '@/utils/fs/paths.js';
import * as fs from 'fs';
import * as path from 'path';
import { getParentProjectRoot, getToolkitDir } from '@/utils/fs/paths.js';

export async function diffCommand(args: CliArgs): Promise<CommandResult> {
  if (args.verbose) {
    logger.setLevel('debug');
  }

  if (args.noColor) {
    logger.setColor(false);
  }

  try {
    logger.info(`Agentic Toolbox v${getPackageVersion()} - Diff preview`);

    const config = loadConfig(args.configPath);
    const targets = args.targets ? (args.targets as string[]).map(t => t.trim() as Target) : config.resolvedTargets;

    let hasChanges = false;

    for (const targetName of targets) {
      const targetConfig = getTargetConfig(targetName);
      const targetDir = path.join(getParentProjectRoot(), targetConfig.directory);
      const toolkitDir = getToolkitDir();

      logger.info(`\n--- Diff for ${targetConfig.directory} ---`);

      // Check agents
      const toolkitAgentsDir = path.join(toolkitDir, 'agents');
      const projectAgentsDir = path.join(getParentProjectRoot(), config.paths?.agents || 'agents');

      if (fs.existsSync(toolkitAgentsDir)) {
        const agentFiles = fs.readdirSync(toolkitAgentsDir).filter(f => f.endsWith('.md'));
        for (const file of agentFiles) {
          const toolkitPath = path.join(toolkitAgentsDir, file);
          const targetPath = path.join(targetDir, 'agents', file);

          const toolkitContent = fs.readFileSync(toolkitPath, 'utf8');
          const transformedContent = targetConfig.transformAgents
            ? transformAgentContent(toolkitContent, targetName)
            : toolkitContent;

          if (fs.existsSync(targetPath)) {
            const currentContent = fs.readFileSync(targetPath, 'utf8');
            if (currentContent !== transformedContent) {
              hasChanges = true;
              logger.warn(`  M agents/${file} (modified)`);
              if (args.verbose) {
                printDiff(currentContent, transformedContent, file);
              }
            } else {
              logger.debug(`  = agents/${file} (unchanged)`);
            }
          } else {
            hasChanges = true;
            logger.success(`  + agents/${file} (new)`);
          }
        }
      }

      // Check project agents (override)
      if (fs.existsSync(projectAgentsDir)) {
        const agentFiles = fs.readdirSync(projectAgentsDir).filter(f => f.endsWith('.md'));
        for (const file of agentFiles) {
          const projectPath = path.join(projectAgentsDir, file);
          const targetPath = path.join(targetDir, 'agents', file);

          const projectContent = fs.readFileSync(projectPath, 'utf8');
          const transformedContent = targetConfig.transformAgents
            ? transformAgentContent(projectContent, targetName)
            : projectContent;

          if (fs.existsSync(targetPath)) {
            const currentContent = fs.readFileSync(targetPath, 'utf8');
            if (currentContent !== transformedContent) {
              hasChanges = true;
              logger.warn(`  M agents/${file} (project override)`);
              if (args.verbose) {
                printDiff(currentContent, transformedContent, file);
              }
            }
          } else {
            hasChanges = true;
            logger.success(`  + agents/${file} (project override, new)`);
          }
        }
      }

      // Check skills
      const toolkitSkillsDir = path.join(toolkitDir, 'skills');
      const projectSkillsDir = path.join(getParentProjectRoot(), config.paths?.skills || 'skills');

      if (fs.existsSync(toolkitSkillsDir)) {
        const skillDirs = fs.readdirSync(toolkitSkillsDir).filter(f =>
          fs.statSync(path.join(toolkitSkillsDir, f)).isDirectory()
        );
        for (const skillDir of skillDirs) {
          const targetSkillDir = path.join(targetDir, 'skills', skillDir);
          if (!fs.existsSync(targetSkillDir)) {
            hasChanges = true;
            logger.success(`  + skills/${skillDir}/ (new)`);
          } else {
            logger.debug(`  = skills/${skillDir}/ (exists)`);
          }
        }
      }

      if (fs.existsSync(projectSkillsDir)) {
        const skillDirs = fs.readdirSync(projectSkillsDir).filter(f =>
          fs.statSync(path.join(projectSkillsDir, f)).isDirectory()
        );
        for (const skillDir of skillDirs) {
          const targetSkillDir = path.join(targetDir, 'skills', skillDir);
          // For skills, we can't easily diff directories, just report
          if (!fs.existsSync(targetSkillDir)) {
            hasChanges = true;
            logger.success(`  + skills/${skillDir}/ (project override, new)`);
          } else {
            logger.warn(`  M skills/${skillDir}/ (project override)`);
          }
        }
      }
    }

    if (!hasChanges) {
      logger.info('\nNo changes detected');
    }

    return { success: true, exitCode: 0 };
  } catch (error) {
    logger.error(`Diff failed: ${error instanceof Error ? error.message : String(error)}`);
    return { success: false, exitCode: 1, error: error as Error };
  }
}

function printDiff(oldContent: string, newContent: string, filename: string): void {
  const oldLines = oldContent.split('\n');
  const newLines = newContent.split('\n');

  logger.info(`\n  --- ${filename}`);
  logger.info(`  +++ ${filename}`);

  // Simple line-by-line diff
  const maxLines = Math.max(oldLines.length, newLines.length);
  for (let i = 0; i < maxLines; i++) {
    const oldLine = oldLines[i];
    const newLine = newLines[i];

    if (oldLine !== newLine) {
      if (oldLine !== undefined) {
        logger.error(`  -${oldLine}`);
      }
      if (newLine !== undefined) {
        logger.success(`  +${newLine}`);
      }
    }
  }
}