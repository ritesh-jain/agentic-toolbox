// CLI types
export interface CliArgs {
  command?: string;
  configPath?: string;
  dryRun?: boolean;
  verbose?: boolean;
  help?: boolean;
  version?: boolean;
  targets?: string[];
  quiet?: boolean;
  color?: boolean;
  [key: string]: unknown;
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