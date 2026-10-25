// Flag definitions
import { FlagDefinition } from '@/types/index.js';

export const flags: FlagDefinition[] = [
  {
    name: 'config',
    alias: 'c',
    description: 'Use a custom config file',
    type: 'string',
  },
  {
    name: 'dryRun',
    alias: 'd',
    description: 'Preview what would be synced without making changes',
    type: 'boolean',
  },
  {
    name: 'verbose',
    alias: 'v',
    description: 'Enable verbose output',
    type: 'boolean',
  },
  {
    name: 'help',
    alias: 'h',
    description: 'Show help message',
    type: 'boolean',
  },
  {
    name: 'version',
    alias: 'V',
    description: 'Show version',
    type: 'boolean',
  },
  {
    name: 'targets',
    alias: 't',
    description: 'Comma-separated list of targets to sync',
    type: 'string[]',
  },
  {
    name: 'quiet',
    alias: 'q',
    description: 'Suppress non-error output',
    type: 'boolean',
  },
  {
    name: 'color',
    description: 'Force color output',
    type: 'boolean',
  },
  {
    name: 'noColor',
    description: 'Disable color output',
    type: 'boolean',
  },
];