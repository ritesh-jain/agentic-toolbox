# Sprint Tracker — Agentic Toolkit

> **Purpose**: Sprint-level, immediate task management. The micro-level companion to the Roadmap. Details the current epic, tasks in progress, finished steps, and pending items.

---

## Current Sprint: v0.1.0 Release — npm Publishing

**Sprint Goal**: Publish `agentic-toolbox@0.1.0` to npm registry with proper CI/CD, provenance, and release automation.

**Sprint Dates**: [Start Date] → [End Date]

---

### 📋 Sprint Tasks

| # | Task | Owner | Status | Started | Dependencies | Est. Effort | Notes |
|---|------|-------|--------|---------|--------------|-------------|-------|
| 1 | Create npm account & enable 2FA | | Done | | — | Low | Required for publishing |
| 2 | `npm login` & verify | | Done | | npm account | Low | `npm whoami` should return username |
| 3 | Generate granular npm access token (publish scope) | | Pending | | npm account | Low | |
| 4 | Add `NPM_TOKEN` to GitHub repo secrets | | Pending | | npm token | Low | |
| 5 | Create GitHub Actions publish workflow (`.github/workflows/publish.yml`) | | Pending | | — | Medium | |
| 6 | Verify `npm pack` output locally | | Pending | | — | Low | |
| 7 | Tag `v0.1.0` and push | | Pending | 3, 4, 5, 6 | Low | |
| 8 | Create GitHub Release from tag | | Pending | 7 | Low | |
| 9 | Verify published package install (`npm install agentic-toolbox`) | | Pending | 8 | Low | |
| 10 | Update README with npm install instructions | | Pending | 9 | Low | |
| 11 | Package renamed to `agentic-toolbox` | | Done | | — | Low | Bare name, available on npm |
| 12 | Version set to `0.1.0` | | Done | | — | Low | Pre-1.0 release |
| 13 | `prepublishOnly` script added | | Done | | — | Low | Runs build on publish |
| 14 | `bin` field exposes `agentic-toolkit` command | | Done | | — | Low | |
| 15 | `files` array configured correctly | | Done | | — | Low | Includes dist/, agents/, skills/ |
| 16 | Local build verified | | Done | | — | Low | `npm run build` passes |

---

### 🚫 Blockers

| Blocker | Impact | Resolution |
|---------|--------|------------|
| No npm account / token | Blocks publish | Create account, generate granular token |
| No GitHub Actions workflow | Blocks automated release | Create `.github/workflows/publish.yml` |

---

### 📊 Velocity Tracking

| Sprint | Planned | Completed | Carryover | Notes |
|--------|---------|-----------|-----------|-------|
| v0.1.0 npm Publish | 16 | 8 | 8 | Focus: publish only |

---

## Notes

- **Scope**: This tracker covers ONLY the npm publishing sprint.
- **All other work** (YAML parser, tests, CI, CLI polish, plugin system, additional targets, etc.) lives in `docs/ROADMAP.md` for future sprints.
- After v0.1.0 publish, next sprint will be "Core Engine Hardening" per Roadmap Phase 1.
- Status values: `Done`, `In Progress`, `Pending`, `Blocked`