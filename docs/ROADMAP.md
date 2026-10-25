# Roadmap

> [!IMPORTANT]
> **AI Agents**: If you are an AI, please read the **AI Execution Workflow** section in [AGENTS.md](../AGENTS.md) to understand how this roadmap is structured and how to proceed with your tasks.

---

## 🎯 Current Sprint: CLI & UX Polish (v0.5.x)

*Target: Enhanced developer experience and CLI polish*

### Core Functionality
- [ ] Colorized terminal output (ANSI codes, `--color` flag)
- [ ] Verbose logging levels (`--verbose`, `--quiet`)
- [ ] `--diff` flag for preview (unified diff) — *foundation exists*
- [ ] Shell completion scripts (bash, zsh, fish)

---

## 🔮 Future Planning

### Next: Production Hardening (v1.0.x)
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
| 1 | Colorized terminal output | `cli/run-cli.ts` | 🔴 Critical | Low | v0.5.x |
| 2 | Verbose/quiet logging levels | `cli/run-cli.ts` | 🟡 High | Low | v0.5.x |
| 3 | `--diff` flag (unified diff) | `cli/commands/diff.ts` | 🟡 High | Medium | v0.5.x |
| 4 | Shell completions | `cli/` | 🟢 Medium | Medium | v0.5.x |
| 5 | Vitest setup | `package.json` + `vitest.config.ts` | 🔴 Critical | Medium | v0.5.x |
| 6 | Unit tests — transform | `core/transform/*.test.ts` | 🔴 Critical | Medium | v0.5.x |
| 7 | Unit tests — config | `core/config/*.test.ts` | 🔴 Critical | Low | v0.5.x |
| 8 | Unit tests — sync | `core/sync/*.test.ts` | 🔴 Critical | High | v0.5.x |
| 9 | Unit tests — CLI args | `cli/args/*.test.ts` | 🔴 Critical | Low | v0.5.x |
| 10 | Integration tests | `sync.integration.test.ts` | 🟡 High | Medium | v0.5.x |

---

*Completed work (v0.1.x–v0.4.x) is documented in [CHANGELOG.md](../CHANGELOG.md).*