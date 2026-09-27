# Sprint Tracker — Agentic Toolkit

> **Purpose**: Sprint-level, immediate task management. The micro-level companion to the Roadmap. Details the current epic, tasks in progress, finished steps, and pending items.

---

## Current Sprint: v1.0.0 Release — Core Engine Hardening

**Sprint Goal**: Replace regex frontmatter parser with YAML, add config validation, implement structured errors, achieve 80%+ test coverage.

**Sprint Dates**: [Start Date] → [End Date]

---

### 🔴 In Progress

| Task | Owner | Started | Notes |
|------|-------|---------|-------|
| 1.1 Replace regex frontmatter parser with `yaml` package | | | `src/transform.ts` — handle arrays, multiline, comments |
| 1.2 Add JSON Schema validation for `agentic-toolkit.json` | | | Zod or native — validate targets array |

### 🟡 Ready / Next Up

| Task | Priority | Dependencies | Est. Effort |
|------|----------|--------------|-------------|
| 1.3 Structured error classes (`SyncError`, `ConfigError`, `TransformError`, `ParseError`) | High | 1.1, 1.2 | Low |
| 2.1 Vitest setup + config | High | — | Medium |
| 2.2 Transform unit tests | High | 1.1 | Medium |
| 2.3 Config unit tests | High | 1.2 | Low |
| 2.4 Sync unit tests | High | 1.3 | High |
| 2.5 Integration test | High | 2.1-2.4 | Medium |

### ✅ Completed This Sprint

| Task | Completed | Notes |
|------|-----------|-------|
| Modular TypeScript architecture | ✅ | 7 modules |
| Project-level merge | ✅ | `./agents/`, `./skills/` override |
| CLI flags (`--config`, `--save`, `--dry-run`, `--verbose`, `--help`) | ✅ | |
| Auto-discovery fallback | ✅ | |
| Agent/skill templates | ✅ | |
| Creation pipeline skills | ✅ | |
| Build system + `prepublishOnly` | ✅ | |
| Git submodule + npm local path support | ✅ | |

---

## Backlog (Groomed)

| Task | Priority | Epic | Est. Effort |
|------|----------|------|-------------|
| 3.1 Colorized terminal output | Medium | CLI Polish | Low |
| 3.2 Verbose logging levels | Medium | CLI Polish | Low |
| 3.3 `--diff` flag for `--save` | Medium | CLI Polish | Medium |
| 4.1 GitHub Actions CI | Medium | CI/CD | Medium |
| 4.2 GitHub Actions Release | Medium | CI/CD | Low |
| 4.3 v1.0.0 tag + release | Medium | Release | Low |
| Plugin System | Low | Future | High |
| Additional Targets (Cursor, Zed, etc.) | Low | Future | Medium |
| Manifest-based incremental sync | High | Performance | High |
| Conflict detection on merge | Medium | Reliability | Medium |
| Watch mode (`--watch`) | Low | UX | Medium |

---

## Sprint Retrospective Notes

### Sprint N (v1.0.0 Prep)
**What went well**: Modular architecture clean, project merge working, templates comprehensive.
**What needs improvement**: Regex parser fragile, no tests, no CI.
**Action items**: Prioritize YAML parser + tests + CI for next sprint.

---

## Velocity Tracking

| Sprint | Planned | Completed | Carryover | Notes |
|--------|---------|-----------|-----------|-------|
| v1.0.0 Prep | 8 | 0 | 8 | Just starting |

---

## Blockers

| Blocker | Impact | Resolution |
|---------|--------|------------|
| Regex parser fragility | High — corrupts frontmatter on edge cases | Replace with `yaml` package (Task 1.1) |
| No test coverage | High — cannot refactor safely | Vitest setup (Task 2.1) |
| No CI | Medium — manual verification only | GitHub Actions (Task 4.1) |