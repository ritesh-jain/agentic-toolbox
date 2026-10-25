# Sprint Tracker — Agentic Toolbox

> **Purpose**: Sprint-level, immediate task management. The micro-level companion to the Roadmap. Details the current epic, tasks in progress, finished steps, and pending items.

---

## Current Sprint: v0.3.x — Architecture Restructure & CLI Polish ✅ **COMPLETED**
**Sprint Goal**: Restructure `src/` into modular architecture, implement subcommands, replace regex parser with YAML, add config validation, structured errors, and path aliases.

**Sprint Dates**: 2026-10-25 → 2026-10-25

---

### 📋 Sprint Tasks

| # | Task | Owner | Status | Started | Dependencies | Est. Effort | Notes |
|---|------|-------|--------|---------|--------------|-------------|-------|
| 1 | Restructure `src/` into modular architecture (core/, utils/, cli/, types/) | | Done | 2026-10-25 | — | High | 46 new files |
| 2 | Implement subcommands (sync, validate, diff, init) | | Done | 2026-10-25 | 1 | Medium | CLI modularization |
| 3 | Replace regex frontmatter parser with `yaml` package | | Done | 2026-10-25 | 1 | Medium | src/core/transform/parser.ts |
| 4 | Add JSON Schema validation for `agentic-toolbox.json` | | Done | 2026-10-25 | 1 | Low | src/core/config/schema.ts |
| 5 | Implement structured error classes (SyncError, ConfigError, etc.) | | Done | 2026-10-25 | 1 | Low | src/utils/errors/classes.ts |
| 6 | Add TypeScript path aliases + tsc-alias | | Done | 2026-10-25 | 1 | Medium | tsconfig.json + build |
| 7 | Make all index.ts pure barrel exports | | Done | 2026-10-25 | 1 | Low | 3 violations fixed |
| 8 | Add colored console logger with levels | | Done | 2026-10-25 | 1 | Low | src/utils/logging/ |
| 9 | Add incremental sync manifest foundation | | Done | 2026-10-25 | 1 | High | src/core/sync/manifest.ts |
| 10 | Binary shebang + path resolution fixes | | Done | 2026-10-25 | 1 | Low | src/index.ts |

---

### 🚫 Blockers

| Blocker | Impact | Resolution |
|---------|--------|------------|
| Regex parser limits frontmatter features | Limits agent/skill definitions | Replaced with `yaml` package |
| No config validation | Invalid configs cause cryptic errors | Added schema validation |

---

### 📊 Velocity Tracking

| Sprint | Planned | Completed | Carryover | Notes |
|--------|---------|-----------|-----------|-------|
| v0.1.x npm Publish | 16 | 16 | 0 | Completed — 0.1.8 published |
| v0.2.x Bootstrapping + Hardening | 10 | 10 | 0 | Completed — bootstrapping validated |
| v0.3.x Architecture Restructure | 10 | 10 | 0 | Completed — full restructure |

---

## Previous Sprint: v0.2.x — Bootstrapping & Core Engine Hardening ✅ **COMPLETED**

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1 | Verify npm package installs correctly | Done | `npm install agentic-toolbox` |
| 2 | Run `npm install` in toolkit to pull published package | Done | Installs to node_modules/agentic-toolbox/ |
| 3 | Verify installed package structure (dist/, agents/, skills/, AGENTS.md) | Done | Check all template files present |
| 4 | Use published sync engine (`npx agentic-toolbox`) to sync toolkit | Done | Bootstrapping validation |
| 5 | Use published creation skills to create new agents/skills for toolkit | Done | agent-creator, skill-creator, resource-gatherer |
| 6 | Validate recursive improvement loop works end-to-end | Done | Toolkit builds itself |
| 7 | Replace regex frontmatter parser with `yaml` package | Done | src/transform.ts |
| 8 | Add JSON Schema validation for `agentic-toolbox.json` | Done | Zod or native |
| 9 | Implement structured error classes (SyncError, ConfigError, etc.) | Done | src/types.ts + all |
| 10 | Add optional incremental sync with manifest | Done | Behind `--incremental` flag |

---

### 🚫 Blockers (Resolved)

| Blocker | Impact | Resolution |
|---------|--------|------------|
| npm package not verified in toolkit | Blocks bootstrapping | Run `npm install` in toolkit repo |
| Regex parser limits frontmatter features | Limits agent/skill definitions | Replaced with `yaml` package |

---

## Previous Sprint: v0.1.x — npm Publishing ✅ COMPLETED

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1 | Create npm account & enable 2FA | Done | |
| 2 | `npm login` & verify | Done | |
| 3 | Generate granular npm access token | Done | |
| 4 | Add `NPM_TOKEN` to GitHub repo secrets | Done | |
| 5 | Create GitHub Actions publish workflow | Done | validate.yml + publish.yml |
| 6 | Verify `npm pack` output locally | Done | |
| 7 | Tag `v0.1.0` and push | Done | Up to v0.1.8 |
| 8 | Create GitHub Release from tag | Done | |
| 9 | Verify published package install | Done | `npm install agentic-toolbox` |
| 10 | Update README with npm install instructions | Done | |
| 11 | Package renamed to `agentic-toolbox` | Done | Bare name on npm |
| 12 | Version set to `0.1.0` → `0.1.8` | Done | |
| 13 | `prepublishOnly` script added | Done | Runs build on publish |
| 14 | `bin` field exposes `agentic-toolbox` command | Done | |
| 15 | `files` array configured correctly | Done | Includes dist/, agents/, skills/ |
| 16 | Local build verified | Done | `npm run build` passes |

---

### 🚫 Blockers (Resolved)

| Blocker | Impact | Resolution |
|---------|--------|------------|
| No npm account / token | Blocks publish | Account created, token generated |
| No GitHub Actions workflow | Blocks automated release | validate.yml + publish.yml created |
| semantic-release git notes failure | Blocked automated releases | Reverted to manual flow |

---

## Notes

- **Scope**: This tracker covers the v0.3.x architecture restructure sprint (completed).
- **Previous sprint** (v0.2.x Bootstrapping + Hardening) fully completed — bootstrapping validated end-to-end.
- **Next sprint** after v0.3.x: "Testing & Quality" per Roadmap Phase 2 (Vitest setup, unit tests, integration tests).
- Status values: `Done`, `In Progress`, `Pending`, `Blocked`