// CLI types - strictly typed and separated by execution context

/**
 * Shared options strictly applicable to every executing command handler.
 */
export interface BaseCommandArgs {
  configPath?: string;
  verbose?: boolean;
  quiet?: boolean;
}

/** Arguments for 'agentic-toolbox sync' */
export interface SyncArgs extends BaseCommandArgs {
  dryRun?: boolean;
  incremental?: boolean;
  targets?: string[];
}

/** Arguments for 'agentic-toolbox init' */
export interface InitArgs extends BaseCommandArgs {
  force?: boolean;
  targets?: string[];
}

/** Arguments for 'agentic-toolbox validate' */
export interface ValidateArgs extends BaseCommandArgs {}

/** Arguments for 'agentic-toolbox diff' */
export interface DiffArgs extends BaseCommandArgs {
  targets?: string[];
}

/**
 * Top-level CLI arguments produced by the parser.
 * Contains only explicitly defined and supported flags. No index signature.
 */
export interface CliArgs extends BaseCommandArgs {
  command?: string;
  help?: boolean;
  version?: boolean;
  dryRun?: boolean;
  incremental?: boolean;
  force?: boolean;
  targets?: string[];
}

export interface FlagDefinition {
  name: string;
  alias?: string;
  description: string;
  type: 'boolean' | 'string' | 'string[]';
  default?: unknown;
}

export interface SubcommandDefinition {
  name: string;
  description: string;
  flags: FlagDefinition[];
  handler: (args: CliArgs) => Promise<CommandResult>;
}

export interface CommandResult {
  success: boolean;
  exitCode: number;
  message?: string;
  error?: Error;
}