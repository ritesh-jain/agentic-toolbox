# Sprint Tracker — Agentic Toolbox

> **Purpose**: Sprint-level, immediate task management. The micro-level companion to the Roadmap. Details the current epic, tasks in progress, finished steps, and pending items.

---

## Current Sprint: v0.2.x — Bootstrapping & Core Engine Hardening
**Sprint Goal**: Implement bootstrapping — use published `agentic-toolbox@0.1.8` to build the toolkit itself, creating a recursive improvement loop. Begin core engine hardening (YAML parser, config validation, error classes).

**Sprint Dates**: [Start Date] → [End Date]

---

### 📋 Sprint Tasks

| # | Task | Owner | Status | Started | Dependencies | Est. Effort | Notes |
|---|------|-------|--------|---------|--------------|-------------|-------|
| 1 | Verify npm package installs correctly | | In Progress | | agentic-toolbox@0.1.8 published | Low | `npm install agentic-toolbox` |
| 2 | Run `npm install` in toolkit to pull published package | | Pending | 1 | — | Low | Installs to node_modules/agentic-toolbox/ |
| 3 | Verify installed package structure (dist/, agents/, skills/, AGENTS.md) | | Pending | 2 | — | Low | Check all template files present |
| 4 | Use published sync engine (`npx agentic-toolbox`) to sync toolkit | | Pending | 3 | — | Medium | Bootstrapping validation |
| 5 | Use published creation skills to create new agents/skills for toolkit | | Pending | 4 | — | Medium | agent-creator, skill-creator, resource-gatherer |
| 6 | Validate recursive improvement loop works end-to-end | | Pending | 5 | — | Medium | Toolkit builds itself |
| 7 | Replace regex frontmatter parser with `yaml` package | | Pending | — | — | Medium | src/transform.ts |
| 8 | Add JSON Schema validation for `agentic-toolbox.json` | | Pending | — | — | Low | Zod or native |
| 9 | Implement structured error classes (SyncError, ConfigError, etc.) | | Pending | — | — | Low | src/types.ts + all |
| 10 | Add optional incremental sync with manifest | | Pending | — | — | High | Behind `--incremental` flag |

---

### 🚫 Blockers

| Blocker | Impact | Resolution |
|---------|--------|------------|
| npm package not verified in toolkit | Blocks bootstrapping | Run `npm install` in toolkit repo |
| Regex parser limits frontmatter features | Limits agent/skill definitions | Replace with `yaml` package |

---

### 📊 Velocity Tracking

| Sprint | Planned | Completed | Carryover | Notes |
|--------|---------|-----------|-----------|-------|
| v0.1.x npm Publish | 16 | 16 | 0 | Completed — 0.1.8 published |
| v0.2.x Bootstrapping + Hardening | 10 | 0 | 10 | Active |

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

- **Scope**: This tracker covers the bootstrapping + core engine hardening sprint.
- **Previous sprint** (v0.1.x npm Publishing) fully completed — package published up to 0.1.8.
- **Bootstrapping milestone**: Toolkit uses its own published npm package to build itself.
- **Next sprint** after v0.2.x: "Testing & Quality" per Roadmap Phase 2.
- Status values: `Done`, `In Progress`, `Pending`, `Blocked`