// Help text templates
import { FlagDefinition, SubcommandDefinition } from '@/types/index.js';
import { flags } from '../args/flags.js';
import { subcommands } from '../args/subcommands.js';

export function generateGlobalHelp(): string {
  const globalFlags = flags.filter(f => !['config', 'dryRun', 'verbose', 'help', 'version'].includes(f.name));

  let help = `
Agentic Toolbox - Cross-platform AI agent & skill sync engine

Usage:
  agentic-toolbox [options] [command] [command-options]

Global Options:
`;

  for (const flag of flags) {
    const alias = flag.alias ? `, -${flag.alias}` : '';
    help += `  --${flag.name}${alias.padEnd(20)} ${flag.description}\n`;
  }

  help += `\nCommands:\n`;
  for (const cmd of subcommands) {
    help += `  ${cmd.name.padEnd(12)} ${cmd.description}\n`;
  }

  help += `
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

  return help;
}

export function generateCommandHelp(commandName: string): string {
  const cmd = subcommands.find(c => c.name === commandName);
  if (!cmd) {
    return `Unknown command: ${commandName}`;
  }

  let help = `
agentic-toolbox ${cmd.name} - ${cmd.description}

Usage:
  agentic-toolbox ${cmd.name} [options]

Options:
`;

  // Command-specific flags
  for (const flag of cmd.flags) {
    const alias = flag.alias ? `, -${flag.alias}` : '';
    help += `  --${flag.name}${alias.padEnd(20)} ${flag.description}\n`;
  }

  // Add global flags that aren't already defined in command flags
  const commandFlagNames = new Set(cmd.flags.map(f => f.name));
  const globalFlagsToShow = ['config', 'verbose', 'help'].filter(name => !commandFlagNames.has(name));
  
  for (const flagName of globalFlagsToShow) {
    const flag = flags.find(f => f.name === flagName);
    if (flag) {
      const alias = flag.alias ? `, -${flag.alias}` : '';
      help += `  --${flag.name}${alias.padEnd(20)} ${flag.description}\n`;
    }
  }

  return help;
}