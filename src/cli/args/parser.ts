// Argument parsing implementation
import { CliArgs, FlagDefinition, SubcommandDefinition } from '@/types/index.js';
import { flags } from './flags.js';
import { subcommands } from './subcommands.js';
import { getFlagStrategy } from './strategies.js';

function kebabToCamel(str: string): string {
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

function findFlagDef(allFlags: FlagDefinition[], flagName: string): FlagDefinition | undefined {
  const camelFlagName = kebabToCamel(flagName);
  return allFlags.find(f => f.name === camelFlagName || f.alias === flagName);
}

function parseFlags(argv: string[], startIndex: number, allFlags: FlagDefinition[]): { args: CliArgs; nextIndex: number } {
  const args: Record<string, unknown> = {};
  let i = startIndex;

  while (i < argv.length) {
    const arg = argv[i];

    if (arg.startsWith('--')) {
      const flagName = arg.slice(2);
      const flagDef = findFlagDef(allFlags, flagName);

      if (!flagDef) {
        throw new Error(`Unknown flag: --${flagName}`);
      }

      const targetName = flagDef.name === 'config' ? 'configPath' : flagDef.name;
      const strategy = getFlagStrategy(flagDef.type);
      const result = strategy.parse(flagDef, `--${flagName}`, argv, i, args[targetName]);
      args[targetName] = result.value;
      i = result.nextIndex;
    } else if (arg.startsWith('-') && arg.length === 2) {
      // Short flag
      const shortFlag = arg[1];
      const flagDef = allFlags.find(f => f.alias === shortFlag);

      if (!flagDef) {
        throw new Error(`Unknown flag: -${shortFlag}`);
      }

      const targetName = flagDef.name === 'config' ? 'configPath' : flagDef.name;
      const strategy = getFlagStrategy(flagDef.type);
      const result = strategy.parse(flagDef, `-${shortFlag}`, argv, i, args[targetName]);
      args[targetName] = result.value;
      i = result.nextIndex;
    } else {
      // Positional argument
      if (!args.command) {
        args.command = arg;
      }
    }

    i++;
  }

  return { args: args as unknown as CliArgs, nextIndex: i };
}

export function parseArgs(argv: string[]): CliArgs {
  // First pass: find the command (first positional arg that's not a flag)
  let command: string | undefined;
  let firstNonFlagIndex = -1;

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg.startsWith('-')) {
      command = arg;
      firstNonFlagIndex = i;
      break;
    }
  }

  // Get subcommand definition if command exists
  const subcommand = command ? subcommands.find(c => c.name === command) : undefined;

  // Combine global flags with subcommand-specific flags
  const allFlags = subcommand ? [...flags, ...subcommand.flags] : flags;

  // Parse flags before the command
  const { args: beforeArgs } = parseFlags(argv, 0, allFlags);

  // Parse flags after the command
  const startAfterCommand = firstNonFlagIndex + 1;
  const { args: afterArgs } = parseFlags(argv, startAfterCommand, allFlags);

  // Merge results
  const mergedArgs: CliArgs = {
    ...beforeArgs,
    ...afterArgs,
    command: beforeArgs.command || afterArgs.command || command,
  };

  return mergedArgs;
}

export function getFlagDefinition(name: string): FlagDefinition | undefined {
  return flags.find(f => f.name === name || f.alias === name);
}

export function getSubcommandDefinition(name: string): SubcommandDefinition | undefined {
  return subcommands.find(c => c.name === name);
}
