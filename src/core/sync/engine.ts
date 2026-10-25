// Sync engine - main orchestration
import { SyncOptions, SyncResult, TargetConfig, LoadedConfig } from '@/types/index.js';
import { getTargetConfig, getAllTargetConfigs } from './targets/index.js';
import { syncToTargetImpl } from './engine-internal.js';

export async function syncToTargets(options: SyncOptions): Promise<SyncResult[]> {
  const targets = options.targets || options.config.resolvedTargets;
  const results: SyncResult[] = [];

  for (const target of targets) {
    const targetConfig = getTargetConfig(target);
    const result = await syncToTargetImpl(target, targetConfig, options);
    results.push(result);
  }

  return results;
}

export async function syncToTarget(
  target: TargetConfig['name'],
  options: SyncOptions
): Promise<SyncResult> {
  const targetConfig = getTargetConfig(target);
  return syncToTargetImpl(target, targetConfig, options);
}