import { InitArgs, CommandResult, Target, TARGET_OPTIONS } from '@/types/index.js';
import { createDefaultConfig } from '@/core/config/schema.js';
import { logger } from '@/utils/logging/index.js';
import { getPackageVersion } from '@/utils/fs/paths.js';
import * as fs from 'fs';
import * as path from 'path';
import { getParentProjectRoot, DEFAULT_CONFIG_NAME } from '@/utils/fs/paths.js';
import { checkbox } from '@inquirer/prompts';

async function promptForTargets(): Promise<Target[]> {
  const answers = await checkbox({
    message: 'Select target platforms to sync to:',
    choices: TARGET_OPTIONS,
    required: true,
    validate: (choices: readonly { value: string; checked: boolean }[]) => {
      const selected = choices.filter(c => c.checked).map(c => c.value);
      return selected.length > 0 || 'Select at least one target';
    },
  });
  return answers as Target[];
}

export async function initCommand(args: InitArgs): Promise<CommandResult> {
  if (args.verbose) {
    logger.setLevel('debug');
  }

  try {
    logger.info(`Agentic Toolbox v${getPackageVersion()} - Initializing config`);

    const configPath = path.join(getParentProjectRoot(), DEFAULT_CONFIG_NAME);

    if (fs.existsSync(configPath) && !args.force) {
      logger.error(`Config file already exists at ${configPath}`);
      logger.info('Use --force to overwrite');
      return { success: false, exitCode: 1 };
    }

    // Determine targets: from args.targets, or prompt interactively
    let targets: Target[] = [];
    if (args.targets) {
      targets = args.targets as Target[];
    } else {
      // Always prompt interactively unless targets explicitly provided via --targets
      targets = await promptForTargets();
    }

    const config = createDefaultConfig();
    config.targets = targets.length > 0 ? targets : ['agents'];
    const configContent = JSON.stringify(config, null, 2);

    fs.writeFileSync(configPath, configContent, 'utf8');

    logger.success(`Created ${DEFAULT_CONFIG_NAME}`);
    logger.info(`Config written to: ${configPath}`);
    logger.info('Edit this file to customize sync options and paths.');

    return { success: true, exitCode: 0 };
  } catch (error) {
    // Handle user canceling the prompt
    if (error instanceof Error && error.name === 'ExitPromptError') {
      logger.info('Init cancelled');
      return { success: false, exitCode: 0 };
    }
    logger.error(`Init failed: ${error instanceof Error ? error.message : String(error)}`);
    return { success: false, exitCode: 1, error: error as Error };
  }
}