// Main CLI entry point
import { parseArgs } from './args/index.js';
import { printHelp } from './help/print-help.js';
import { subcommands, defaultCommand } from './args/subcommands.js';
import { getPackageVersion, sanitizeConfigPath } from '@/utils/fs/index.js';
import { CliArgs, CommandResult } from '@/types/index.js';
import * as fs from 'fs';

export async function runCli(argv: string[]): Promise<CommandResult> {
  // Handle version flag early
  if (argv.includes('--version') || argv.includes('-V')) {
    console.log(getPackageVersion());
    return { success: true, exitCode: 0 };
  }

  try {
    const args = parseArgs(argv);

    // Handle help
    if (args.help) {
      if (args.command && subcommands.some(c => c.name === args.command)) {
        printHelp(args.command);
      } else {
        printHelp();
      }
      return { success: true, exitCode: 0 };
    }

    // Smart default: if no command given and no config exists, show helpful hint
    const configPath = sanitizeConfigPath(args.configPath);
    const hasConfig = fs.existsSync(configPath);

    if (!args.command && !hasConfig) {
      console.log(`No config file found at ${configPath}`);
      console.log('Run one of the following to get started:');
      console.log('  agentic-toolbox init          # Create default config file');
      console.log('  agentic-toolbox init --force  # Overwrite existing config');
      console.log('');
      printHelp();
      return { success: true, exitCode: 0 };
    }

    // Route to command handler
    if (args.command && subcommands.some(c => c.name === args.command)) {
      const cmd = subcommands.find(c => c.name === args.command)!;
      return cmd.handler(args);
    }

    // Default to sync command for backward compatibility
    return defaultCommand(args);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Error: ${message}`);
    return { success: false, exitCode: 1, error: error as Error };
  }
}
