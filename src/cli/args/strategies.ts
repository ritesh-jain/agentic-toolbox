// Flag parsing strategies - implements the Strategy pattern for FlagDefinition types
import { FlagDefinition, FlagStrategy, FlagParseResult } from '@/types/index.js';

export const booleanStrategy: FlagStrategy = {
  parse(
    _flagDef: FlagDefinition,
    _rawFlag: string,
    _argv: string[],
    currentIndex: number
  ): FlagParseResult {
    return {
      value: true,
      nextIndex: currentIndex,
    };
  },
};

export const stringStrategy: FlagStrategy = {
  parse(
    _flagDef: FlagDefinition,
    rawFlag: string,
    argv: string[],
    currentIndex: number
  ): FlagParseResult {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= argv.length) {
      throw new Error(`Flag ${rawFlag} requires a value`);
    }
    return {
      value: argv[nextIndex],
      nextIndex,
    };
  },
};

export const stringArrayStrategy: FlagStrategy = {
  parse(
    _flagDef: FlagDefinition,
    rawFlag: string,
    argv: string[],
    currentIndex: number,
    currentValue?: unknown
  ): FlagParseResult {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= argv.length) {
      throw new Error(`Flag ${rawFlag} requires a value`);
    }
    const values = argv[nextIndex].split(',').map(v => v.trim());
    const existing = Array.isArray(currentValue) ? (currentValue as string[]) : [];
    return {
      value: existing.length > 0 ? [...existing, ...values] : values,
      nextIndex,
    };
  },
};

export const FLAG_STRATEGIES: Record<FlagDefinition['type'], FlagStrategy> = {
  boolean: booleanStrategy,
  string: stringStrategy,
  'string[]': stringArrayStrategy,
};

export function getFlagStrategy(type: FlagDefinition['type']): FlagStrategy {
  const strategy = FLAG_STRATEGIES[type];
  if (!strategy) {
    throw new Error(`Unsupported flag type: ${type}`);
  }
  return strategy;
}
