import { loadConfig } from './config.js';
import { syncToTarget, saveFromTarget } from './sync.js';
import type { AgenticToolkitConfig } from './types.js';

export function parseArgs(args: string[]): { configPath?: string; save: boolean; dryRun: boolean; verbose: boolean; help: boolean } {
  const configIndex = args.indexOf('--config');
  const customConfigPath = configIndex !== -1 ? args[configIndex + 1] : undefined;
  const isSave = args.includes('--save');
  const isDryRun = args.includes('--dry-run');
  const isVerbose = args.includes('--verbose') || args.includes('-v');
  const isHelp = args.includes('--help') || args.includes('-h');

  return { configPath: customConfigPath, save: isSave, dryRun: isDryRun, verbose: isVerbose, help: isHelp };
}

export function printHelp(): void {
  console.log(`
Agentic Toolkit - Cross-platform AI agent & skill sync engine

Usage:
  agentic-toolkit [options]

Options:
  --config <path>     Use a custom config file (default: agentic-toolkit.json)
  --save              Sync FROM target directories BACK TO toolkit (reverse sync)
  --dry-run           Preview what would be synced without making changes
  --verbose, -v       Enable verbose output
  --help, -h          Show this help message

Configuration (agentic-toolkit.json):
  {
    "targets": ["opencode", "claude", "agents"]
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

Examples:
  agentic-toolkit                    # Sync to all configured targets
  agentic-toolkit --save             # Save changes back to toolkit
  agentic-toolkit --dry-run --verbose # Preview with verbose output
  agentic-toolkit --config ./custom.json # Use custom config
`);
}

export async function runCli(args: string[]): Promise<{ success: boolean; exitCode: number }> {
  const parsed = parseArgs(args);

  if (parsed.help) {
    printHelp();
    return { success: true, exitCode: 0 };
  }

  const config = loadConfig(parsed.configPath);
  const targets = config.targets || ['agents'];

  const action = parsed.save ? 'Saving' : 'Syncing';
  console.log(`\nAgentic Toolkit - ${action} to ${targets.length} target(s)\n`);

  let allSuccess = true;

  if (parsed.save) {
    for (const target of targets) {
      const result = saveFromTarget(target, { dryRun: parsed.dryRun, verbose: parsed.verbose });
      if (result.success && result.count > 0) {
        console.log(`  ${result.message}`);
      } else if (!result.success) {
        console.error(`  Error: ${result.message}`);
        console.error(`    ${result.error?.message}`);
        allSuccess = false;
      }
    }
  } else {
    for (const target of targets) {
      const result = syncToTarget(target, {
        config,
        dryRun: parsed.dryRun,
        verbose: parsed.verbose,
      });
      if (result.success) {
        console.log(`  ${result.message}`);
      } else {
        console.error(`  Error: ${result.message}`);
        console.error(`    ${result.error?.message}`);
        allSuccess = false;
      }
    }
  }

  console.log('\nDone.\n');

  return { success: allSuccess, exitCode: allSuccess ? 0 : 1 };
}