// Subcommand definitions
import { SubcommandDefinition, CliArgs, CommandResult } from '@/types/index.js';
import { syncCommand } from '../commands/sync.js';
import { validateCommand } from '../commands/validate.js';
import { diffCommand } from '../commands/diff.js';
import { initCommand } from '../commands/init.js';

export const subcommands: SubcommandDefinition[] = [
  {
    name: 'sync',
    description: 'Sync agents and skills to target directories',
    flags: [
      { name: 'dryRun', alias: 'd', description: 'Preview changes without applying', type: 'boolean' },
      { name: 'verbose', alias: 'v', description: 'Enable verbose output', type: 'boolean' },
      { name: 'targets', alias: 't', description: 'Comma-separated targets', type: 'string[]' },
      { name: 'config', alias: 'c', description: 'Custom config file', type: 'string' },
      { name: 'incremental', description: 'Use incremental sync with manifest', type: 'boolean' },
    ],
    handler: syncCommand,
  },
  {
    name: 'validate',
    description: 'Validate config file and agent/skill definitions',
    flags: [
      { name: 'config', alias: 'c', description: 'Custom config file', type: 'string' },
      { name: 'verbose', alias: 'v', description: 'Enable verbose output', type: 'boolean' },
    ],
    handler: validateCommand,
  },
  {
    name: 'diff',
    description: 'Show unified diff of what would change',
    flags: [
      { name: 'config', alias: 'c', description: 'Custom config file', type: 'string' },
      { name: 'targets', alias: 't', description: 'Comma-separated targets', type: 'string[]' },
    ],
    handler: diffCommand,
  },
  {
    name: 'init',
    description: 'Create a new agentic-toolbox.json config file',
    flags: [
      { name: 'force', alias: 'f', description: 'Overwrite existing config', type: 'boolean' },
    ],
    handler: initCommand,
  },
];

// Default command (when no subcommand specified)
export async function defaultCommand(args: CliArgs): Promise<CommandResult> {
  // Default to sync command for backward compatibility
  return syncCommand(args);
}