// Main CLI entry point
import { parseArgs } from './args/index.js';
import { printHelp } from './help/print-help.js';
import { subcommands, defaultCommand } from './args/subcommands.js';
import { getPackageVersion } from '@/utils/fs/paths.js';
import { CliArgs, CommandResult } from '@/types/index.js';

export async function runCli(argv: string[]): Promise<CommandResult> {
  // Handle version flag early
  if (argv.includes('--version') || argv.includes('-V')) {
    console.log(getPackageVersion());
    return { success: true, exitCode: 0 };
  }

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

  // Route to command handler
  if (args.command && subcommands.some(c => c.name === args.command)) {
    const cmd = subcommands.find(c => c.name === args.command)!;
    return cmd.handler(args);
  }

  // Default to sync command for backward compatibility
  return defaultCommand(args);
}