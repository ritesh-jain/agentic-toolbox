// Config schema validation (using Zod-like validation without external dependency)
import { Config, Target, ValidationError } from '@/types/index.js';
import { getTargetNames } from '@/core/sync/targets/index.js';

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

export function validateConfig(config: Config): ValidationResult {
  const errors: ValidationError[] = [];

  // Validate targets
  if (config.targets !== undefined) {
    if (!Array.isArray(config.targets)) {
      errors.push({
        field: 'targets',
        message: 'targets must be an array',
        value: config.targets,
      });
    } else {
      const validTargets = getTargetNames();
      for (const target of config.targets) {
        if (!validTargets.includes(target)) {
          errors.push({
            field: 'targets',
            message: `Unknown target: ${target}. Valid targets: ${validTargets.join(', ')}`,
            value: target,
          });
        }
      }
    }
  }

  // Validate sync config
  if (config.sync !== undefined) {
    if (typeof config.sync !== 'object' || config.sync === null) {
      errors.push({
        field: 'sync',
        message: 'sync must be an object',
        value: config.sync,
      });
    } else {
      if (config.sync.incremental !== undefined && typeof config.sync.incremental !== 'boolean') {
        errors.push({
          field: 'sync.incremental',
          message: 'sync.incremental must be a boolean',
          value: config.sync.incremental,
        });
      }
      if (config.sync.backup !== undefined && typeof config.sync.backup !== 'boolean') {
        errors.push({
          field: 'sync.backup',
          message: 'sync.backup must be a boolean',
          value: config.sync.backup,
        });
      }
    }
  }

  // Validate transform config
  if (config.transform !== undefined) {
    if (typeof config.transform !== 'object' || config.transform === null) {
      errors.push({
        field: 'transform',
        message: 'transform must be an object',
        value: config.transform,
      });
    } else {
      if (config.transform.preserveComments !== undefined && typeof config.transform.preserveComments !== 'boolean') {
        errors.push({
          field: 'transform.preserveComments',
          message: 'transform.preserveComments must be a boolean',
          value: config.transform.preserveComments,
        });
      }
    }
  }

  // Validate paths config
  if (config.paths !== undefined) {
    if (typeof config.paths !== 'object' || config.paths === null) {
      errors.push({
        field: 'paths',
        message: 'paths must be an object',
        value: config.paths,
      });
    } else {
      if (config.paths.agents !== undefined && typeof config.paths.agents !== 'string') {
        errors.push({
          field: 'paths.agents',
          message: 'paths.agents must be a string',
          value: config.paths.agents,
        });
      }
      if (config.paths.skills !== undefined && typeof config.paths.skills !== 'string') {
        errors.push({
          field: 'paths.skills',
          message: 'paths.skills must be a string',
          value: config.paths.skills,
        });
      }
    }
  }

  // Check for unknown fields
  const knownFields = ['targets', 'sync', 'transform', 'paths'];
  for (const key of Object.keys(config)) {
    if (!knownFields.includes(key)) {
      errors.push({
        field: key,
        message: `Unknown config field: ${key}`,
        value: config[key as keyof Config],
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function createDefaultConfig(): Config {
  return {
    targets: ['agents'],
    sync: {
      incremental: false,
      backup: true,
    },
    transform: {
      preserveComments: false,
    },
    paths: {
      agents: 'agents',
      skills: 'skills',
    },
  };
}