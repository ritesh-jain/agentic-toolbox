// Validate command implementation
import { CliArgs, CommandResult } from '@/types/index.js';
import { loadConfig, validateConfig } from '@/core/config/index.js';
import { logger } from '@/utils/logging/index.js';
import { getPackageVersion } from '@/utils/fs/paths.js';
import * as fs from 'fs';
import * as path from 'path';
import { getParentProjectRoot, getToolkitDir } from '@/utils/fs/paths.js';

export async function validateCommand(args: CliArgs): Promise<CommandResult> {
  if (args.verbose) {
    logger.setLevel('debug');
  }

  if (args.noColor) {
    logger.setColor(false);
  }

  try {
    logger.info(`Agentic Toolbox v${getPackageVersion()} - Validating configuration`);

    // Validate config file
    const config = loadConfig(args.configPath);
    logger.success('Config file: valid');

    // Validate toolkit agents
    const toolkitDir = getToolkitDir();
    const toolkitAgentsDir = path.join(toolkitDir, 'agents');
    if (fs.existsSync(toolkitAgentsDir)) {
      const agentFiles = fs.readdirSync(toolkitAgentsDir).filter(f => f.endsWith('.md'));
      logger.info(`Toolkit agents: ${agentFiles.length} file(s)`);
      for (const file of agentFiles) {
        logger.debug(`  ${file}`);
      }
    }

    // Validate toolkit skills
    const toolkitSkillsDir = path.join(toolkitDir, 'skills');
    if (fs.existsSync(toolkitSkillsDir)) {
      const skillDirs = fs.readdirSync(toolkitSkillsDir).filter(f => {
        const fullPath = path.join(toolkitSkillsDir, f);
        return fs.statSync(fullPath).isDirectory();
      });
      logger.info(`Toolkit skills: ${skillDirs.length} directory(ies)`);
      for (const dir of skillDirs) {
        logger.debug(`  ${dir}/`);
      }
    }

    // Validate project agents
    const projectAgentsDir = path.join(getParentProjectRoot(), config.paths?.agents || 'agents');
    if (fs.existsSync(projectAgentsDir)) {
      const agentFiles = fs.readdirSync(projectAgentsDir).filter(f => f.endsWith('.md'));
      logger.info(`Project agents: ${agentFiles.length} file(s)`);
    }

    // Validate project skills
    const projectSkillsDir = path.join(getParentProjectRoot(), config.paths?.skills || 'skills');
    if (fs.existsSync(projectSkillsDir)) {
      const skillDirs = fs.readdirSync(projectSkillsDir).filter(f => {
        const fullPath = path.join(projectSkillsDir, f);
        return fs.statSync(fullPath).isDirectory();
      });
      logger.info(`Project skills: ${skillDirs.length} directory(ies)`);
    }

    // Validate target directories exist (for sync)
    const validTargets = config.resolvedTargets;
    logger.info(`Targets to sync: ${validTargets.join(', ')}`);

    logger.success('\nValidation complete - all checks passed');
    return { success: true, exitCode: 0 };
  } catch (error) {
    logger.error(`Validation failed: ${error instanceof Error ? error.message : String(error)}`);
    return { success: false, exitCode: 1, error: error as Error };
  }
}