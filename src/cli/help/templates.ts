// Help text templates and formatting utilities
import { FlagDefinition, SubcommandDefinition } from '@/types/index.js';
import { flags } from '../args/flags.js';
import { subcommands } from '../args/subcommands.js';

/**
 * Formats a single flag definition with its long and optional short alias.
 */
export function getFlagDisplay(flag: FlagDefinition): string {
  return `--${flag.name}${flag.alias ? `, -${flag.alias}` : ''}`;
}

/**
 * Formats a list of flags with dynamic column padding based on the longest flag display.
 */
export function formatFlags(flagList: FlagDefinition[], minPadding: number = 2): string {
  if (flagList.length === 0) return '';
  const displays = flagList.map(f => getFlagDisplay(f));
  const maxLen = Math.max(...displays.map(d => d.length));
  const colWidth = maxLen + minPadding;

  return flagList
    .map((flag, idx) => `  ${displays[idx].padEnd(colWidth)} ${flag.description}`)
    .join('\n');
}

/**
 * Formats a list of subcommands with dynamic column padding based on the longest command name.
 */
export function formatCommands(cmdList: SubcommandDefinition[], minPadding: number = 2): string {
  if (cmdList.length === 0) return '';
  const maxLen = Math.max(...cmdList.map(c => c.name.length));
  const colWidth = maxLen + minPadding;

  return cmdList
    .map(cmd => `  ${cmd.name.padEnd(colWidth)} ${cmd.description}`)
    .join('\n');
}

export function generateGlobalHelp(): string {
  const flagsHelp = formatFlags(flags);
  const commandsHelp = formatCommands(subcommands);

  return `
Agentic Toolbox - Cross-platform AI agent & skill sync engine

Usage:
  agentic-toolbox [options] [command] [command-options]

Global Options:
${flagsHelp}

Commands:
${commandsHelp}

Examples:
  agentic-toolbox                    # Sync to all configured targets
  agentic-toolbox sync               # Explicit sync command
  agentic-toolbox sync --dry-run --verbose
  agentic-toolbox validate           # Validate config and definitions
  agentic-toolbox diff               # Show what would change
  agentic-toolbox init               # Create default config file
  agentic-toolbox --help             # Show this help
  agentic-toolbox --version          # Show version

Configuration (agentic-toolbox.json):
  {
    "targets": ["opencode", "claude", "agents"],
    "sync": { "incremental": false, "backup": true },
    "transform": { "preserveComments": false },
    "paths": { "agents": "agents", "skills": "skills" }
  }

Targets:
  opencode   - Sync to .opencode/ directory
  claude     - Sync to .claude/ directory
  agents     - Sync to .agents/ directory

Auto-discovery (when config file is missing):
  opencode.json    -> targets .opencode/
  claude.json      -> targets .claude/
  .clauderc        -> targets .claude/
  (default)        -> targets .agents/
`;
}

export function generateCommandHelp(commandName: string): string {
  const cmd = subcommands.find(c => c.name === commandName);
  if (!cmd) {
    return `Unknown command: ${commandName}`;
  }

  // Combine command flags with relevant global flags not already present
  const commandFlagNames = new Set(cmd.flags.map(f => f.name));
  const globalFlagsToShow = ['config', 'verbose', 'help']
    .filter(name => !commandFlagNames.has(name))
    .map(name => flags.find(f => f.name === name))
    .filter((f): f is FlagDefinition => f !== undefined);

  const allCmdFlags = [...cmd.flags, ...globalFlagsToShow];
  const optionsHelp = formatFlags(allCmdFlags);

  return `
agentic-toolbox ${cmd.name} - ${cmd.description}

Usage:
  agentic-toolbox ${cmd.name} [options]

Options:
${optionsHelp}
`;
}
