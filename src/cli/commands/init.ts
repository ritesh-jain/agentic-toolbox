// Init command implementation
import { CliArgs, CommandResult } from '@/types/index.js';
import { createDefaultConfig } from '@/core/config/schema.js';
import { logger } from '@/utils/logging/index.js';
import { getPackageVersion } from '@/utils/fs/paths.js';
import * as fs from 'fs';
import * as path from 'path';
import { getParentProjectRoot, DEFAULT_CONFIG_NAME } from '@/utils/fs/paths.js';

export async function initCommand(args: CliArgs): Promise<CommandResult> {
  if (args.verbose) {
    logger.setLevel('debug');
  }

  if (args.noColor) {
    logger.setColor(false);
  }

  try {
    logger.info(`Agentic Toolbox v${getPackageVersion()} - Initializing config`);

    const configPath = path.join(getParentProjectRoot(), DEFAULT_CONFIG_NAME);

    if (fs.existsSync(configPath) && !args.force) {
      logger.error(`Config file already exists at ${configPath}`);
      logger.info('Use --force to overwrite');
      return { success: false, exitCode: 1 };
    }

    const config = createDefaultConfig();
    const configContent = JSON.stringify(config, null, 2);

    fs.writeFileSync(configPath, configContent, 'utf8');

    logger.success(`Created ${DEFAULT_CONFIG_NAME}`);
    logger.info('\nDefault configuration:');
    logger.info(configContent);
    logger.info('\nEdit this file to customize your sync targets and options.');

    return { success: true, exitCode: 0 };
  } catch (error) {
    logger.error(`Init failed: ${error instanceof Error ? error.message : String(error)}`);
    return { success: false, exitCode: 1, error: error as Error };
  }
}