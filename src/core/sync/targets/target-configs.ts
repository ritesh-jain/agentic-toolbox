// Target configurations — re-exported from types/targets.js as single source of truth
import {
  Target,
  TargetConfig,
  TARGET_DEFINITIONS,
  getTargetDefinition,
  getAllTargetConfigs,
  getTargetNames,
} from '@/types/index.js';

export const TARGET_CONFIGS: Record<Target, TargetConfig> = TARGET_DEFINITIONS;

export function getTargetConfig(target: Target): TargetConfig {
  return getTargetDefinition(target);
}

export { getAllTargetConfigs, getTargetNames };