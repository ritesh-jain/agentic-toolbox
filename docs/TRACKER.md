# Sprint Tracker — Agentic Toolbox

> **Purpose**: Sprint-level, immediate task management. The micro-level companion to the Roadmap. Details the current epic, tasks in progress, finished steps, and pending items.

---

## Current Sprint: v0.4.x — MVP Consolidation 🔄 **ACTIVE**
**Sprint Goal**: Consolidate app features to MVP — reliable `init` subcommand, smart default behavior, robust sync, clear errors.

**Sprint Dates**: 2026-10-25 → [End Date]

---

### 📋 Sprint Tasks

| # | Task | Owner | Status | Started | Dependencies | Est. Effort | Notes |
|---|------|-------|--------|---------|--------------|-------------|-------|
| 1 | Smart default: no args + no config → helpful hint with init usage | | In Progress | 2026-10-25 | — | Low | `cli/run-cli.ts` |
| 2 | `init` subcommand: add `--force` flag, overwrite logic | | Pending | 2026-10-25 | 1 | Low | `cli/commands/init.ts` |
| 3 | Config validation improvements: clear error messages | | Pending | 2026-10-25 | 1 | Low | `core/config/schema.ts` |
| 4 | Sync reliability: verify all targets work correctly | | Pending | 2026-10-25 | 1 | Medium | `core/sync/` |
| 5 | Error handling: consistent, actionable messages | | Pending | 2026-10-25 | 1 | Low | `utils/errors/`, `cli/` |
| 6 | Help text: clear init + sync workflow | | Pending | 2026-10-25 | 1 | Low | `cli/help/` |
| 7 | Unit tests for init/sync commands | | Pending | 2026-10-25 | 1 | Medium | `core/`, `cli/` |
| 8 | Integration tests for full workflow | | Pending | 2026-10-25 | 7 | Medium | `sync.integration.test.ts` |

---

### 🚫 Blockers

| Blocker | Impact | Resolution |
|---------|--------|------------|
| None currently | — | — |

---

*Completed sprints (v0.1.x–v0.3.x) are documented in [CHANGELOG.md](../CHANGELOG.md).*