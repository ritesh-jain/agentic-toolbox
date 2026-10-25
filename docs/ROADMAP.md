# Roadmap

> [!IMPORTANT]
> **AI Agents**: If you are an AI, please read the **AI Execution Workflow** section in [AGENTS.md](../AGENTS.md) to understand how this roadmap is structured and how to proceed with your tasks.

---

## 🎯 Current Sprint: Testing & Quality (v0.4.x)

*Target: Comprehensive test coverage and quality gates*

### Test Infrastructure
- [ ] Set up Vitest test suite
- [ ] Configure coverage thresholds (80%+)

### Unit Tests
- [ ] `src/core/transform/` — parser, stripper, reassembler
- [ ] `src/core/config/` — loader, schema, discovery
- [ ] `src/core/sync/` — engine, merger, manifest, targets
- [ ] `src/cli/args/` — argument parsing, flag handling
- [ ] `src/utils/fs/` — operations, atomic, paths

### Integration Tests
- [ ] Full sync cycle with temp directories
- [ ] Multi-target sync verification
- [ ] Project merge override behavior
- [ ] Incremental sync with manifest

### Quality Gates
- [ ] CI test execution on PR
- [ ] Coverage reporting
- [ ] Linting (ESLint + TypeScript strict)

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
| 1 | Vitest setup | `package.json` + `vitest.config.ts` | 🔴 Critical | Medium | Current |
| 2 | Transform unit tests | `core/transform/*.test.ts` | 🔴 Critical | Medium | Current |
| 3 | Config unit tests | `core/config/*.test.ts` | 🔴 Critical | Low | Current |
| 4 | Sync unit tests | `core/sync/*.test.ts` | 🔴 Critical | High | Current |
| 5 | Integration tests | `sync.integration.test.ts` | 🔴 Critical | Medium | Current |
| 6 | Colorized output | `cli.ts` | 🟢 Medium | Low | Next |
| 7 | Verbose logging | `cli.ts` + `sync.ts` | 🟢 Medium | Low | Next |
| 8 | Shell completions | `cli/` | 🟢 Medium | Medium | Next |

---

*Completed work (v0.1.x–v0.3.x) is documented in [CHANGELOG.md](../CHANGELOG.md).*