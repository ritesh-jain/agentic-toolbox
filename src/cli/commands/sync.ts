// Sync command implementation
import { CliArgs, CommandResult, Target } from '@/types/index.js';
import { loadConfig } from '@/core/config/index.js';
import { syncToTargets } from '@/core/sync/index.js';
import { logger } from '@/utils/logging/index.js';
import { getPackageVersion } from '@/utils/fs/paths.js';

export async function syncCommand(args: CliArgs): Promise<CommandResult> {
  // Configure logger
  if (args.quiet) {
    logger.setLevel('error');
  } else if (args.verbose) {
    logger.setLevel('debug');
  }

  if (args.noColor) {
    logger.setColor(false);
  }

  try {
    logger.info(`Agentic Toolbox v${getPackageVersion()} - Syncing agents and skills`);

    const config = loadConfig(args.configPath);
    const targets = args.targets ? (args.targets as string[]).map(t => t.trim() as Target) : undefined;

    const results = await syncToTargets({ config, dryRun: args.dryRun, verbose: args.verbose, targets });

    let allSuccess = true;
    for (const result of results) {
      if (result.success) {
        logger.success(`  ${result.message}`);
        if (args.verbose && result.filesSynced) {
          for (const file of result.filesSynced) {
            logger.debug(`    ${file}`);
          }
        }
      } else {
        logger.error(`  ${result.message}`);
        if (result.error) {
          logger.error(`    ${result.error.message}`);
        }
        allSuccess = false;
      }
    }

    if (args.dryRun) {
      logger.info('\nDry run complete - no changes made');
    } else if (allSuccess) {
      logger.info('\nSync complete');
    }

    return { success: allSuccess, exitCode: allSuccess ? 0 : 1 };
  } catch (error) {
    logger.error(`Sync failed: ${error instanceof Error ? error.message : String(error)}`);
    return { success: false, exitCode: 1, error: error as Error };
  }
}