# Unified Tracker: Agentic Toolbox

**Created**: 2026-10-25
**App**: `agentic-toolbox` — Cross-platform AI agent & skill sync engine for Claude Code and OpenCode

---
## Status Key
| Status | Meaning |
| --------------- | ------------------------- |
| `DONE` | Completed and verified |
| `IN PROGRESS` | Currently being worked on |
| `TODO` | Not started |
| `BLOCKED` | Blocked by another item |
| `N/A` | No longer applicable |

---
## Code Organization Philosophy
```
src/
├── shared/        # Shared constants, types, utilities. Never imports from core/, cli/, utils/
├── types/         # Shared type definitions. Can import from shared/. Never imports from core/, cli/, utils/
├── core/          # Core domain logic (config, sync, transform). Can import from shared/, types/
├── utils/         # Infrastructure utilities (fs, logging, errors). Can import from shared/, types/
├── cli/           # CLI interface. Can import from shared/, types/, core/, utils/
```
**Import rules (strictly one-directional):**
- `shared/` → only internal imports
- `types/` → can import from `shared/`
- `core/` → can import from `shared/`, `types/`
- `utils/` → can import from `shared/`, `types/`
- `cli/` → can import from `shared/`, `types/`, `core/`, `utils/`

---
## Approach
Work through items **one at a time**, in order. For each item:
1. **Discuss** — Present the item, explain what needs to change, show current code. Set item status to `IN PROGRESS` in tracker.
2. **Finalize** — Ask questions, agree on implementation. Use the question tool for all queries (multiple-choice with custom option).
3. **Go-ahead** — User says "proceed" or similar
4. **Implement** — Make the code changes only. Do NOT commit.
5. **Review** — User reviews the code changes. Request amendments if needed.
6. **Approval** — User gives explicit approval to commit. Do NOT commit without this.
7. **Verify** — Run lint/typecheck (`npm run build`)
7. **Commit** — Follow [Commit Instructions](#commit-instructions) below
8. **Update tracker** — Mark item as `DONE`
9. **Next item** — Repeat from step 1

**One item at a time. No skipping ahead.**

---
## Commit Instructions
**Format:** `<type>(<scope>): <short summary>` with optional body explaining *what* and *why*.
**Types:** `feat`, `fix`, `refactor`, `style`, `docs`, `chore`, `test`, `build`, `ci`
**Scopes:** Module or component name in lowercase (`config`, `sync`, `transform`, `cli`, `shared`, `types`, `utils`, `errors`, `logging`). No scope for cross-cutting changes.
**Rules:**
1. Never use `git add .` — stage files selectively
2. Never commit secrets, `.env`, or build artifacts
3. Each commit = one logical atomic change
4. Verify build/lint passes before committing

---
## 1. Constants & Shared Definitions Consolidation
| # | Item | Description | Status | Notes |
| --- | -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------ |
| C1 | Create `src/shared/targets.ts` | Single source of truth for target definitions: `TARGET_DEFINITIONS`, `STRIP_FIELDS`, `TARGET_OPTIONS`. Eliminate 4x duplication across `target-configs.ts`, `transform-agent.ts`, `init.ts`, `types/transform.ts`. | TODO | See [Duplication Map](#duplication-map) below. |
| C2 | Create `src/shared/constants.ts` | Centralize all magic strings: error codes, error messages, exit codes, regex patterns, file extensions, default values. | TODO | See [Magic Strings Inventory](#magic-strings-inventory) below. |
| C3 | Consolidate duplicate types | Move `FrontmatterData`, `ParsedContent`, `StripFields` from `types/transform.ts`, `transform-agent.ts`, `stripper.ts`, `parser.ts` to `types/transform.ts` as single source. | TODO | 4x duplication of `FrontmatterData`, `ParsedContent`; 3x `StripFields`. |
| C4 | Move `STRIP_FIELDS` to targets layer | Move `STRIP_FIELDS` from `src/core/transform/transform-agent.ts` to `src/shared/targets.ts` — belongs in targets layer, not transform layer. | TODO | Violates SRP — transform layer shouldn't own target-specific strip lists. |

### Duplication Map
| Definition | Current Locations (4x+) | Target Location |
|------------|------------------------|-----------------|
| Target names (`opencode`, `claude`, `agents`) | `target-configs.ts`, `transform-agent.ts`, `init.ts`, `types/transform.ts`, `types/config.ts`, `types/sync.ts`, `types/cli.ts` | `shared/targets.ts` |
| `STRIP_FIELDS` (opencode/claude arrays) | `target-configs.ts`, `transform-agent.ts`, `types/transform.ts` | `shared/targets.ts` |
| `TARGET_OPTIONS` (name/value/description) | `target-configs.ts` (implicit), `init.ts` (2x), `types/transform.ts` (interface) | `shared/targets.ts` |
| `Target` type | `types/config.ts`, `types/sync.ts`, `types/transform.ts`, `types/cli.ts`, `types/index.ts` | `types/config.ts` (single source) |

### Magic Strings Inventory
| Category | Examples | Target Location |
|----------|----------|-----------------|
| Error codes | `'CONFIG_NOT_FOUND'`, `'CONFIG_INVALID_JSON'`, `'SYNC_TARGET_FAILED'` | `shared/constants.ts` |
| Error messages | `'Config file already exists at...'`, `'targets must be an array'` | `shared/constants.ts` |
| Exit codes | `process.exit(1)`, `process.exit(0)` | `shared/constants.ts` |
| Regex patterns | `/^(---\n)([\s\S]*?)(\n---)/` (frontmatter) | `shared/constants.ts` |
| File extensions | `'.md'`, `'.json'` | `shared/constants.ts` |
| Default values | `'agents'`, `incremental: false`, `backup: true` | `shared/constants.ts` |
| ExitPromptError | `'ExitPromptError'` (in init.ts) | `shared/constants.ts` |

---
## 2. Type System Consolidation
| # | Item | Description | Status | Notes |
| --- | -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------ |
| T1 | Consolidate `Target` type | Single source in `types/config.ts`, re-export from `types/index.ts`. Remove from `sync.ts`, `transform.ts`, `cli.ts`. | TODO | Currently in 5 files. |
| T2 | Consolidate `StripFields` | Single definition in `shared/targets.ts`, re-export from `types/transform.ts`. | TODO | Currently in 3 files. |
| T3 | Consolidate `FrontmatterData` / `ParsedContent` | Single definition in `types/transform.ts`. Remove from `transform-agent.ts`, `parser.ts`, `stripper.ts`. | TODO | 4x duplication. |
| T4 | Consolidate `FrontmatterData` / `ParsedContent` interfaces | Move local interface declarations from `transform-agent.ts`, `parser.ts`, `stripper.ts` to `types/transform.ts`. | TODO | 4 files have local copies. |
| T5 | Split `CliArgs` by command | Create `SyncArgs`, `InitArgs`, `ValidateArgs`, `DiffArgs` extending base `CliArgs`. | TODO | Current `CliArgs` has 12 optional props; commands use subset. |
| T6 | Remove `[key: string]: unknown` from `CliArgs` | Replace with explicit types. | TODO | Violates type safety. |

---
## 3. CLI Architecture Improvements
| # | Item | Description | Status | Notes |
| --- | -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------ |
| CLI1 | Strategy pattern for arg parser | Replace hardcoded `parseFlags` in `src/cli/args/parser.ts` with strategy pattern for extensibility. | TODO | Open/Closed Principle violation. |
| CLI2 | Extract CLI arg types per command | Create `SyncArgs`, `InitArgs`, `ValidateArgs`, `DiffArgs` in `types/cli.ts`. | TODO | Current `CliArgs` has 12 optional props. |
| CLI3 | Input sanitization utilities | Add `sanitizePath()`, `validateTarget()`, `sanitizeConfigPath()` in `shared/validation.ts`. | TODO | No input sanitization currently. |
| CLI4 | Logger dependency injection | `ConsoleLogger` should accept `WritableStream` instead of hardcoding `process.stdout`. | TODO | Enables testing with `MemoryStream`. |
| CLI5 | Help text generation | Move help templates to `shared/help.ts` for reuse. | TODO | Templates duplicated in `templates.ts`. |

---
## 4. Error Handling & Validation Improvements
| # | Item | Description | Status | Notes |
| --- | -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------ |
| E1 | Structured error message constants | Move all error messages to `shared/constants.ts` with consistent formatting: `{field}: {message} (got: {value})`. | TODO | Current messages inconsistent. |
| E2 | Validation error display | Already done in `validate.ts` — display field, message, received value. | DONE | Completed in Task 3. |
| E3 | Error context preservation | Ensure all `ConfigError`, `SyncError` etc. preserve full context (path, target, original error). | TODO | Some throw raw strings. |
| E4 | Standardize error throwing | Replace `throw new Error(...)` with structured `ConfigError`, `SyncError` etc. | TODO | Mixed patterns. |
| E5 | Validation result type safety | Ensure `ValidationError` type includes `field`, `message`, `value?` consistently. | TODO | Done in types but not all throw sites use it. |

---
## 5. Sync Engine & Transform Improvements
| # | Item | Description | Status | Notes |
| --- | -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------ |
| S1 | Move `STRIP_FIELDS` to `shared/targets.ts` | Remove from `transform-agent.ts`, import from `shared/targets.ts`. | TODO | Part of C4. |
| S2 | Extract transform pipeline interfaces | Define `TransformPipeline` interface with `parse()`, `strip()`, `reassemble()` methods. | TODO | Enables testing/mocking. |
| S3 | YAML parser error context | Improve `parser.ts` error messages with line/column from YAML parser. | TODO | Currently generic. |
| S4 | Manifest-based incremental sync | Implement `--incremental` flag using manifest in `core/sync/manifest.ts`. | TODO | Foundation exists, flag not wired. |
| S5 | Sync conflict detection | Warn when project files override package templates. | TODO | Currently silent override. |

---
## 5. Error Classes & Logging
| # | Item | Description | Status | Notes |
| --- | -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------ |
| ER1 | Error codes enum | `shared/constants.ts` with `ERROR_CODES` enum and message templates. | TODO | Part of C2. |
| ER2 | Logger stream injection | `ConsoleLogger` constructor accepts `WritableStream` (default `process.stdout`). | TODO | CLI4. |
| ER2 | Structured JSON logging | Add `--json` flag for machine-readable output. | TODO | For CI/CD integration. |
| ER3 | Error context serialization | `toJSON()` on all error classes includes code, context, path, target, stack. | DONE | Already implemented. |
| ER4 | Correlation IDs | Add request/correlation ID to all log entries for tracing. | TODO | For debugging sync runs. |

---
## 5. Testing Infrastructure
| # | Item | Description | Status | Notes |
| --- | -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------ |
| TST1 | Vitest setup | Install Vitest, configure `vitest.config.ts`, add test scripts. | TODO | Phase 3 sprint. |
| TST2 | Unit tests — transform | Test parser, stripper, reassembler with various YAML inputs. | TODO | Core module. |
| TST3 | Unit tests — config | Test loader, schema validation, discovery. | TODO | |
| TST4 | Unit tests — sync | Test engine, merger, manifest, targets. | TODO | |
| TST5 | Unit tests — CLI args | Test parser, flag handling, subcommands. | TODO | |
| TST6 | Integration tests | Full sync cycle with temp directories, multi-target, manifest. | TODO | |
| TST7 | Coverage thresholds | Configure 80%+ coverage in `vitest.config.ts`. | TODO | |

---
## 6. Documentation & Developer Experience
| # | Item | Description | Status | Notes |
| --- | -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------ |
| D1 | Module-level docs | Detailed specs for each `src/` module (`core/config.md`, `core/sync.md`, etc.). | TODO | |
| D2 | ADR Collection | Architecture Decision Records for key choices (path aliases, YAML parser, error classes, etc.). | TODO | |
| D3 | Migration Guide | From regex parser to YAML, from flat to modular structure. | TODO | |
| D4 | Developer Guides | `development.md`, `testing.md`, `release.md`. | TODO | |
| D5 | README sync | Ensure README reflects current CLI (`init --force` interactive, `--targets`, etc.). | TODO | |
| D6 | CHANGELOG sync | Ensure CHANGELOG has all 0.3.0 features documented. | DONE | Completed in v0.3.0 release. |

---
## 6. Technical Debt & Code Quality
| # | Item | Description | Status | Notes |
| --- | -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------ |
| TD1 | Remove `require()` calls | Replace `require()` with `import` in `engine-internal.ts`, `merger.ts`, `manifest.ts`, `sync.ts`, `config.ts`, `utils/fs/*`. | TODO | ESM consistency. |
| TD2 | Hardcoded `.md` filter | Extract `FILE_EXTENSION = '.md'` to `shared/constants.ts`. | TODO | Used in 4+ files. |
| TD3 | Path traversal protection | Add `resolveSafePath(base, userPath)` in `utils/fs/operations.ts`. | TODO | Security hardening. |
| TD4 | Input validation | Validate `configPath`, `target` values before filesystem ops. | TODO | Currently minimal. |
| TD5 | Remove `require()` in utils | `utils/fs/atomic.ts`, `utils/fs/index.ts`, `utils/fs/paths.ts` use `require()`. | TODO | ESM consistency. |
| TD6 | Remove `require()` in core | `core/sync/engine-internal.ts`, `merger.ts`, `manifest.ts` use `require()`. | TODO | ESM consistency. |

---
## 6. Architecture Decisions Log
| # | Decision | Chosen | Date |
| --- | --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| AD1 | Modular architecture | `core/`, `utils/`, `cli/`, `types/`, `shared/` with one-directional imports | 2026-10-25 |
| AD2 | Path aliases | `@/`, `@types/`, `@core/`, `@utils/`, `@cli/`, `@shared/` in `tsconfig.json` | 2026-10-25 |
| AD3 | Binary shebang | `#!/usr/bin/env node` in `src/index.ts` | 2026-10-25 |
| AD4 | YAML parser | `yaml` package (not regex) for robust frontmatter parsing | 2026-10-25 |
| AD5 | Error classes | Structured error classes with codes, context, path, target | 2026-10-25 |
| AD6 | Path aliases + tsc-alias | `@/`, `@types/`, `@core/`, `@utils/`, `@cli/`, `@shared/` + `tsc-alias` | 2026-10-25 |
| AD7 | Bootstrapping | Package depends on itself (`agentic-toolbox@0.3.0` as devDependency) | 2026-10-25 |
| AD8 | Interactive init | `@inquirer/prompts` checkbox for target selection | 2026-10-25 |
| AD9 | Manual release flow | Version bump → PR → merge → stage → manual `npm promote` | 2026-10-25 |

---
## 7. Future Sprint Scratchpad (Next Iteration Cycle)
| # | Item | Description | Notes |
| --- | -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| F1 | Vitest + CI integration | Test runner, CI job running `tsc+lint+build` | Largest structural risk. |
| F2 | Plugin system design | Custom transformers, validators, target handlers via plugin API. | Post-v1.0. |
| F3 | Additional targets | Cursor, Windsurf, Zed, VS Code extensions. | Post-v1.0. |
| F4 | Remote configuration | Fetch agent/skill definitions from remote registry. | Post-v1.0. |
| F5 | Web UI / Dashboard | Optional local dashboard for managing agents/skills. | Post-v1.0. |
| F6 | Watch mode (`--watch`) | Auto re-sync on file changes. | Low priority. |
| F7 | Schema migration | Handle config version upgrades. | Low priority. |
| F8 | Shell completions | Bash/zsh/fish completion scripts. | v0.5.x. |
| F9 | Structured logging (JSON) | `--json` flag for machine-readable output. | Medium priority. |
| F10 | Manifest-based incremental sync | Track file hashes, only sync changed files. | High priority, v0.4.x. |

---
## 8. Code Review Findings (from current analysis)
| # | Item | Description | Severity | Notes |
| --- | -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------ |
| CR1 | Target definitions duplicated 4x | `target-configs.ts`, `transform-agent.ts`, `init.ts`, `types/transform.ts` | Critical | C1, C4. |
| CR2 | `STRIP_FIELDS` in transform layer | Violates SRP — strip lists belong in targets config | Critical | C4. |
| CR3 | Magic strings everywhere | Error codes, messages, exit codes, regex, defaults | Critical | C2. |
| CR4 | Type duplication | `Target`, `StripFields`, `FrontmatterData`, `ParsedContent` in 3-5 files each | High | T1-T4. |
| CR5 | `CliArgs` too broad | 12 optional props, commands use subset | High | CLI2. |
| CR6 | Argument parser not extensible | Hardcoded parsing logic | Medium | CLI1. |
| CR7 | No input sanitization | Path traversal, config injection risks | High | TD3, CLI3. |
| CR8 | Mixed error patterns | Structured errors + raw strings | Medium | E3, E4. |
| CR9 | Logger not testable | Hardcodes `process.stdout` | Medium | CLI4. |
| CR10 | `require()` in ESM codebase | Multiple files | Low | TD1, TD5, TD6. |

---
## 9. Next Iteration Scratchpad (v0.4.x MVP Consolidation)
| # | Item | Description | Target |
| --- | -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| M1 | Task 4: Sync reliability verification | Verify all targets, field transformation, dry-run, diff, incremental | Current |
| M2 | Task 5: Error handling consistency | Consistent messages, structured errors, correlation IDs | Current |
| M3 | Task 6: Help text improvements | Clear init + sync workflow, better examples | Current |
| M4 | Task 7: Unit tests | Vitest setup, transform/config/sync/cli tests | Next |
| M5 | Task 8: Integration tests | Temp directories, multi-target, manifest | Next |
| M6 | Constants consolidation | `shared/targets.ts`, `shared/constants.ts` | v0.4.1 |
| M7 | Type consolidation | `types/` cleanup, single source of truth | v0.4.1 |
| M8 | CLI argument parser refactor | Strategy pattern, per-command arg types | v0.4.2 |
| M9 | Error message constants | `shared/constants.ts` | v0.4.2 |
| M10 | Input sanitization | `shared/validation.ts` | v0.4.2 |

---
## 10. Decisions Log (for this project)
| # | Decision | Chosen | Date |
| --- | --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| D1 | Modular architecture | `core/`, `utils/`, `cli/`, `types/`, `shared/` with one-directional imports | 2026-10-25 |
| D2 | Path aliases | `@/`, `@types/`, `@core/`, `@utils/`, `@cli/`, `@shared/` in `tsconfig.json` | 2026-10-25 |
| D3 | Binary shebang | `#!/usr/bin/env node` in `src/index.ts` | 2026-10-25 |
| D4 | YAML parser | `yaml` package (not regex) for robust frontmatter parsing | 2026-10-25 |
| D5 | Error classes | Structured error classes with codes, context, path, target | 2026-10-25 |
| D6 | Path aliases + tsc-alias | `@/`, `@types/`, `@core/`, `@utils/`, `@cli/`, `@shared/` + `tsc-alias` | 2026-10-25 |
| D7 | Bootstrapping | Package depends on itself (`agentic-toolbox@0.3.0` as devDependency) | 2026-10-25 |
| D8 | Interactive init | `@inquirer/prompts` checkbox for target selection | 2026-10-25 |
| D9 | Manual release flow | Version bump → PR → merge → stage → manual `npm promote` | 2026-10-25 |

---
## 10. Completed Sprint History
| Sprint | Goal | Status | Key Deliverables |
|--------|------|--------|------------------|
| v0.1.x | npm Publishing | DONE | Package on npm, CI/CD, manual release flow |
| v0.2.x | Bootstrapping & Core Hardening | DONE | Self-hosting, YAML parser, config validation, structured errors |
| v0.3.x | Architecture Restructure | DONE | Modular src/, subcommands, YAML parser, config validation, path aliases |
| v0.4.x | MVP Consolidation | IN PROGRESS | Smart defaults, init interactive, validation errors, sync reliability |

---
*Completed work (v0.1.x–v0.3.x) is documented in [CHANGELOG.md](../CHANGELOG.md).*
