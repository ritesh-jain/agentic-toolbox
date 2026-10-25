# Roadmap

> [!IMPORTANT]
> **AI Agents**: If you are an AI, please read the **AI Execution Workflow** section in [AGENTS.md](../AGENTS.md) to understand how this roadmap is structured and how to proceed with your tasks.

---

## 🎯 Release Phases

### Phase 0: v0.1.x — npm Publishing ✅ **COMPLETED**
*Scope: `docs/TRACKER.md`*

- [x] Publish `agentic-toolbox@0.1.0` to npm
- [x] GitHub Actions publish workflow with provenance
- [x] Verify install and update README
- [x] Package renamed to `agentic-toolbox` (bare name)
- [x] Version bumped to 0.1.8 (published)
- [x] CI/CD pipeline: validate.yml + publish.yml with OIDC provenance
- [x] Manual release flow established (version bump → PR → merge → stage → promote)

---

### Phase 1: v0.2.x — Core Engine Hardening & Bootstrapping ✅ **COMPLETED**
*Target: Bootstrapping milestone — toolkit builds itself using published npm package*

**1.1 Bootstrapping Implementation**
- [x] Verify npm package `agentic-toolbox@0.1.8` installs correctly
- [x] Use published sync engine to manage toolkit's own agents/skills
- [x] Use published creation skills (`agent-creator`, `skill-creator`, `agentic-resource-gatherer`) to build new agents/skills for toolkit
- [x] Validate recursive improvement loop: toolkit → better agents/skills → better toolkit

**1.2 YAML Frontmatter Parser**
- [x] Replace regex parser with `yaml` package in `src/transform.ts`
- [x] Handle arrays, multiline strings, comments
- [x] Preserve field stripping behavior for OpenCode/Claude

**1.3 Config Schema Validation**
- [x] Add JSON Schema validation for `agentic-toolbox.json` (Zod or native)
- [x] Validate `targets` array, reject unknown fields

**1.4 Structured Error Classes**
- [x] `SyncError`, `ConfigError`, `TransformError`, `ParseError`
- [x] Consistent error codes and user-facing messages

**1.5 Incremental Sync (Optional)**
- [x] Manifest-based sync with file hashes
- [x] Behind `--incremental` flag

---

### Phase 2: v0.3.x — Architecture Restructure & CLI Polish ✅ **COMPLETED**
*Target: Modular architecture, subcommands, barrel exports, path aliases*

**2.1 Modular Architecture Restructure**
- [x] Restructure `src/` into `core/`, `utils/`, `cli/`, `types/`
- [x] Clear separation: `core/config`, `core/sync`, `core/transform`, `utils/fs`, `utils/logging`, `utils/errors`, `cli/commands`, `cli/args`, `cli/help`
- [x] All `index.ts` files are pure barrel exports (no implementation)

**2.2 CLI Subcommands**
- [x] `sync` — explicit sync command with flags
- [x] `validate` — config + agent/skill validation
- [x] `diff` — unified diff preview
- [x] `init` — scaffold `agentic-toolbox.json`
- [x] Global flags: `--config`, `--dry-run`, `--verbose`, `--targets`, `--quiet`, `--color`

**2.3 YAML Frontmatter Parser**
- [x] Replaced regex parser with `yaml` package in `src/core/transform/parser.ts`
- [x] Proper YAML parsing with error handling

**2.4 Config Schema Validation**
- [x] Native validation in `src/core/config/schema.ts`
- [x] Validates `targets`, `sync`, `transform`, `paths` sections
- [x] Rejects unknown fields with clear error messages

**2.5 Structured Error Classes**
- [x] `SyncError`, `ConfigError`, `TransformError`, `ParseError`, `FsError`, `CliError`, `ValidationError`
- [x] Error codes enum with consistent codes
- [x] Context-aware error messages

**2.6 TypeScript Path Aliases + tsc-alias**
- [x] `@/`, `@types/`, `@core/`, `@utils/`, `@cli/` aliases in `tsconfig.json`
- [x] `tsc-alias` in build pipeline for runtime resolution

**2.7 Incremental Sync Foundation**
- [x] Manifest-based sync in `src/core/sync/manifest.ts`
- [x] SHA-256 file hashing, change detection

**2.8 Developer Experience**
- [x] `dev` script: build + run CLI
- [x] Colored console logger with levels (debug/info/warn/error/success)
- [x] Binary shebang for proper execution

---

### Phase 3: v0.4.x — Testing & Quality 🔄 **NEXT**
*Target: Comprehensive test coverage and quality gates*

**3.1 Test Infrastructure**
- [ ] Set up Vitest test suite
- [ ] Configure coverage thresholds (80%+)

**3.2 Unit Tests**
- [ ] `src/core/transform/` — parser, stripper, reassembler
- [ ] `src/core/config/` — loader, schema, discovery
- [ ] `src/core/sync/` — engine, merger, manifest, targets
- [ ] `src/cli/args/` — argument parsing, flag handling
- [ ] `src/utils/fs/` — operations, atomic, paths

**3.3 Integration Tests**
- [ ] Full sync cycle with temp directories
- [ ] Multi-target sync verification
- [ ] Project merge override behavior
- [ ] Incremental sync with manifest

**3.4 Quality Gates**
- [ ] CI test execution on PR
- [ ] Coverage reporting
- [ ] Linting (ESLint + TypeScript strict)

---

### Phase 4: v0.5.x — CLI & UX Polish

- [ ] Colorized terminal output (ANSI codes, `--color` flag) — *partially done in logger*
- [ ] Verbose logging levels (`--verbose`, `--quiet`) — *partially done in logger*
- [ ] `--diff` flag for preview (unified diff) — *done in v0.3.x*
- [ ] Shell completion scripts (bash, zsh, fish)

---

### Phase 5: v0.6.x — CI/CD & Release Automation ✅ **COMPLETED**

- [x] GitHub Actions CI: build → test → lint on PR (`validate.yml`)
- [x] GitHub Actions Release: stage on merge (`publish.yml`)
- [x] Manual release flow: version bump → PR → merge → stage → promote
- [x] npm OIDC trusted publisher with provenance

---

### Phase 6: v1.0.x — Production Hardening

- [ ] Achieve 80%+ test coverage
- [ ] Performance benchmarks
- [ ] Security audit
- [ ] Documentation complete (ADRs, module specs)
- [ ] Create `v1.0.0` tag and GitHub release

---

## 📦 Future Major Goals (Post v1.0.x)

### Plugin System
- Allow custom transformers, validators, target handlers via plugin API
- Plugin discovery and loading mechanism

### Additional Targets
- Cursor, Windsurf, Zed, VS Code extensions
- Generic `.agents/` enhancements

### Remote Configuration
- Fetch agent/skill definitions from remote registry
- Versioned remote configs with caching

### Web UI / Dashboard
- Optional local web dashboard for managing agents/skills
- Visual sync status and conflict resolution

---

## 🔧 Technical Debt & Improvements

| Item | Priority | Effort | Notes |
|------|----------|--------|-------|
| Manifest-Based Incremental Sync | High | High | Track file hashes, only sync changed files |
| Conflict Detection on Merge | Medium | Medium | Warn when project files override package templates |
| Dry-Run Enhancement (unified diff) | Medium | Medium | Show actual changes preview |
| Structured Logging (JSON output) | Medium | Low | For tooling integration |
| Watch Mode (`--watch`) | Low | Medium | Auto re-sync on file changes |
| Schema Migration | Low | Low | Handle config version upgrades |

---

## 📚 Documentation

- [ ] Module-Level Docs — Detailed specs for each `src/` module
- [ ] ADR Collection — Architecture Decision Records for key choices
- [ ] Migration Guide — From regex parser to YAML, etc.
- [ ] Developer Guides — `development.md`, `testing.md`, `release.md`

---

## 📋 Detailed Task Breakdown

| # | Task | Module | Priority | Est. Effort | Phase |
|---|------|--------|----------|-------------|-------|
| 2.1 | Modular architecture restructure | `src/` | 🔴 Critical | High | 2 |
| 2.2 | CLI subcommands | `cli/commands/` | 🔴 Critical | Medium | 2 |
| 2.3 | YAML parser replacement | `core/transform/parser.ts` | 🔴 Critical | Medium | 2 |
| 2.4 | Config schema validation | `core/config/schema.ts` | 🔴 Critical | Low | 2 |
| 2.5 | Structured error classes | `utils/errors/classes.ts` | 🔴 Critical | Low | 2 |
| 2.6 | Path aliases + tsc-alias | `tsconfig.json` | 🟡 High | Medium | 2 |
| 2.7 | Incremental sync foundation | `core/sync/manifest.ts` | 🟡 High | High | 2 |
| 2.8 | Barrel exports cleanup | `src/**/index.ts` | 🟢 Medium | Low | 2 |
| 3.1 | Vitest setup | `package.json` + `vitest.config.ts` | 🔴 Critical | Medium | 3 |
| 3.2 | Transform unit tests | `core/transform/*.test.ts` | 🔴 Critical | Medium | 3 |
| 3.3 | Config unit tests | `core/config/*.test.ts` | 🔴 Critical | Low | 3 |
| 3.4 | Sync unit tests | `core/sync/*.test.ts` | 🔴 Critical | High | 3 |
| 3.5 | Integration tests | `sync.integration.test.ts` | 🔴 Critical | Medium | 3 |

---

*Completed work is documented in [CHANGELOG.md](../CHANGELOG.md).*