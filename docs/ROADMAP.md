# Roadmap

> [!IMPORTANT]
> **AI Agents**: If you are an AI, please read the **AI Execution Workflow** section in [AGENTS.md](../AGENTS.md) to understand how this roadmap is structured and how to proceed with your tasks.

## 🎯 Current Main Long Term Goal: v1.0.0 Release — Hardened Sync Engine

**Objective**: Deliver a production-ready v1.0.0 with robust sync engine, proper YAML parsing, schema validation, test coverage, and CI/CD. The toolkit should be reliable for daily use across OpenCode, Claude Code, and standard `.agents/` targets.

### 📋 Up Next (Action Plan)

**Phase 1: Core Engine Hardening**
- [ ] 1.1 Replace regex frontmatter parser with `yaml` package in `src/transform.ts`
- [ ] 1.2 Add JSON Schema validation for `agentic-toolkit.json` (Zod or native)
- [ ] 1.3 Add structured error classes (`SyncError`, `ConfigError`, `TransformError`, `ParseError`)
- [ ] 1.4 Implement incremental sync with manifest (file hashes) — optional, behind flag

**Phase 2: Testing & Quality**
- [ ] 2.1 Set up Vitest test suite
- [ ] 2.2 Unit tests for `transform.ts` (all field stripping combinations)
- [ ] 2.3 Unit tests for `config.ts` (load, auto-discovery, invalid JSON)
- [ ] 2.4 Unit tests for `sync.ts` (syncToTarget, saveFromTarget, project merge)
- [ ] 2.5 Integration test: full sync cycle with temp directories

**Phase 3: CLI & UX Polish**
- [ ] 3.1 Colorized terminal output (ANSI codes, `--color` flag)
- [ ] 3.2 Verbose logging levels (`--verbose`, `--quiet`)
- [ ] 3.3 `--diff` flag for `--save` (preview reverse sync changes)
- [ ] 3.4 Shell completion scripts (bash, zsh, fish)

**Phase 4: CI/CD & Release**
- [ ] 4.1 GitHub Actions: build → test → lint on PR
- [ ] 4.2 GitHub Actions: publish to npm on git tag (`v*`)
- [ ] 4.3 Create `v1.0.0` tag and GitHub release
- [ ] 4.4 Update consuming projects to use `#v1.0.0`

### ✅ Completed (Current Goal Progress)

**Core Architecture**
- [x] Modular TypeScript architecture (7 modules)
- [x] Project-level agent/skill merge (`./agents/`, `./skills/`)
- [x] CLI flags: `--config`, `--save`, `--dry-run`, `--verbose`, `--help`
- [x] Platform-specific field stripping (OpenCode ↔ Claude)
- [x] Auto-discovery fallback (opencode.json, claude.json, .clauderc)
- [x] Strict TypeScript config with declaration maps
- [x] Build scripts (build, dev, clean, prepublishOnly)
- [x] Git submodule + npm local path dependency support

**Agent/Skill Templates**
- [x] `agents/Agent.md.sample` — Complete cross-platform template
- [x] `skills/SKILL.md.sample` — Complete cross-platform template
- [x] `agent-creator` skill with references
- [x] `skill-creator` skill with references
- [x] `agentic-resource-gatherer` skill with references
- [x] Example agents/skills in `assets/examples/`

---

## 📦 Backlog (Future Goals & Technical Debt)

**Future Main Goals**
- **Plugin System** — Allow custom transformers, validators, and target handlers via plugin API
- **Additional Targets** — Support for Cursor, Windsurf, Zed, VS Code extensions
- **Remote Config** — Fetch agent/skill definitions from remote registry
- **Web UI** — Optional local web dashboard for managing agents/skills

**Technical Debt & Improvements**
- **Manifest-Based Incremental Sync** — Track file hashes, only sync changed files (high impact for large projects)
- **Conflict Detection** — Warn when project files overwrite package templates
- **Dry-Run Enhancement** — Show unified diff preview for both forward and reverse sync
- **Structured Logging** — JSON output mode for tooling integration
- **Watch Mode** — `--watch` flag for automatic re-sync on file changes
- **Schema Migration** — Handle config file version upgrades gracefully

**Documentation**
- **Module-Level Docs** — Detailed specs for each `src/` module co-located with code
- **ADR Collection** — Architecture Decision Records for key choices
- **Migration Guide** — From regex parser to YAML, from submodule to npm, etc.

**Deferred / Lowest Priority**
- **GUI Dashboard** — Local web interface for agent/skill management
- **Cloud Registry** — Hosted agent/skill marketplace
- **Team Sync** — Shared configuration across team members

---

## 📋 Up Next (Detailed)

| # | Task | Module | Priority | Est. Effort |
|---|------|--------|----------|-------------|
| 1.1 | YAML parser replacement | `transform.ts` | 🔴 Critical | Medium |
| 1.2 | Config schema validation | `config.ts` | 🔴 Critical | Low |
| 1.3 | Structured error classes | `types.ts` + all | 🔴 Critical | Low |
| 2.1 | Vitest setup | `package.json` + `vitest.config.ts` | 🟡 High | Medium |
| 2.2 | Transform unit tests | `transform.test.ts` | 🟡 High | Medium |
| 2.3 | Config unit tests | `config.test.ts` | 🟡 High | Low |
| 2.4 | Sync unit tests | `sync.test.ts` | 🟡 High | High |
| 2.5 | Integration test | `sync.integration.test.ts` | 🟡 High | Medium |
| 3.1 | Colorized output | `cli.ts` | 🟢 Medium | Low |
| 3.2 | Verbose logging | `cli.ts` + `sync.ts` | 🟢 Medium | Low |
| 3.3 | `--diff` for `--save` | `sync.ts` + `cli.ts` | 🟢 Medium | Medium |
| 4.1 | GitHub Actions CI | `.github/workflows/ci.yml` | 🟢 Medium | Medium |
| 4.2 | GitHub Actions Release | `.github/workflows/release.yml` | 🟢 Medium | Low |
| 4.3 | v1.0.0 tag | git | 🟢 Medium | Low |

---

## Completed (Archive)

- [x] Initial sync engine (`start.js`)
- [x] TypeScript migration + modular architecture
- [x] Project-level merge (`./agents/`, `./skills/`)
- [x] CLI flags (`--config`, `--save`, `--dry-run`, `--verbose`, `--help`)
- [x] Build system (tsc, declaration maps, source maps)
- [x] Agent/skill templates with cross-platform fields
- [x] Creation pipeline skills (agent-creator, skill-creator, agentic-resource-gatherer)
- [x] Git submodule + npm local path dependency setup