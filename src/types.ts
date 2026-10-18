export interface ToolMap {
  opencode: string;
  claude: string;
  agents: string;
}

export interface StripFields {
  opencode: string[];
  claude: string[];
}

export interface AgenticToolkitConfig {
  targets: ('opencode' | 'claude' | 'agents')[];
}

export interface CliOptions {
  configPath?: string;
  dryRun: boolean;
  verbose: boolean;
  help: boolean;
}

export interface SyncResult {
  target: string;
  success: boolean;
  message?: string;
  error?: Error;
}