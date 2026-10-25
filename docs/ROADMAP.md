# Roadmap

> [!IMPORTANT]
> **AI Agents**: If you are an AI, please read the **AI Execution Workflow** section in [AGENTS.md](../AGENTS.md) to understand how this roadmap is structured and how to proceed with your tasks.

---

## 🎯 Current Sprint: MVP Consolidation (v0.4.x)

*Target: Minimum viable product — consumable library with reliable core functionality*

### Core Functionality Consolidation
- [ ] **Smart default behavior**: `agentic-toolbox` (no args) detects missing config → shows helpful hint with `init` subcommand usage
- [ ] **`init` subcommand enhancement**: `agentic-toolbox init [--force]` creates config if missing, supports `--force` to overwrite
- [ ] **Config validation**: Robust validation with clear error messages for malformed configs
- [ ] **Sync reliability**: Verify sync works correctly across all targets (opencode, claude, agents)
- [ ] **Error handling**: Consistent, actionable error messages across all commands

### Developer Experience
- [ ] **Clear help text**: `agentic-toolbox --help` shows clear usage for init + sync workflow
- [ ] **Version output**: `agentic-toolbox --version` / `-V`
- [ ] **Dry-run clarity**: `--dry-run` shows exactly what would change

---

## 🔮 Future Planning

### Next: CLI & UX Polish (v0.5.x)
- [ ] Colorized terminal output (ANSI codes, `--color` flag)
- [ ] Verbose logging levels (`--verbose`, `--quiet`)
- [ ] `--diff` flag for preview (unified diff) — *foundation exists*
- [ ] Shell completion scripts (bash, zsh, fish)

### Production Hardening (v1.0.x)
- [ ] Achieve 80%+ test coverage
- [ ] Performance benchmarks
- [ ] Security audit
- [ ] Documentation complete (ADRs, module specs)
- [ ] Create `v1.0.0` tag and GitHub release

### Post v1.0.x — Major Goals
- **Plugin System**: Custom transformers, validators, target handlers via plugin API
- **Additional Targets**: Cursor, Windsurf, Zed, VS Code extensions
- **Remote Configuration**: Fetch agent/skill definitions from remote registry
- **Web UI / Dashboard**: Optional local dashboard for managing agents/skills

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

## 📋 Task Breakdown

| # | Task | Module | Priority | Est. Effort | Target |
|---|------|--------|----------|-------------|--------|
| 1 | Smart default: no args + no config → helpful hint | `cli/run-cli.ts` | 🔴 Critical | Low | Current |
| 2 | `init` subcommand: `--force` flag, overwrite logic | `cli/commands/init.ts` | 🔴 Critical | Low | Current |
| 3 | Config validation improvements | `core/config/schema.ts` | 🟡 High | Low | Current |
| 4 | Sync reliability verification | `core/sync/` | 🟡 High | Medium | Current |
| 5 | Help text improvements | `cli/help/` | 🟢 Medium | Low | Current |
| 6 | Unit tests for init/sync | `core/`, `cli/` | 🔴 Critical | Medium | Current |
| 7 | Integration tests | `sync.integration.test.ts` | 🟡 High | Medium | Next |

---

*Completed work (v0.1.x–v0.3.x) is documented in [CHANGELOG.md](../CHANGELOG.md).*