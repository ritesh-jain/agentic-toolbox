# Roadmap

> [!IMPORTANT]
> **AI Agents**: If you are an AI, please read the **AI Execution Workflow** section in [AGENTS.md](../AGENTS.md) to understand how this roadmap is structured and how to proceed with your tasks.

---

## 🎯 Release Phases

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

- [ ] Colorized terminal output (ANSI codes, `--color` flag)
- [ ] Verbose logging levels (`--verbose`, `--quiet`)
- [ ] `--diff` flag for preview (unified diff) — *foundation exists in v0.3.x*
- [ ] Shell completion scripts (bash, zsh, fish)

---

### Phase 5: v1.0.x — Production Hardening

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
| 3.1 | Vitest setup | `package.json` + `vitest.config.ts` | 🔴 Critical | Medium | 3 |
| 3.2 | Transform unit tests | `core/transform/*.test.ts` | 🔴 Critical | Medium | 3 |
| 3.3 | Config unit tests | `core/config/*.test.ts` | 🔴 Critical | Low | 3 |
| 3.4 | Sync unit tests | `core/sync/*.test.ts` | 🔴 Critical | High | 3 |
| 3.5 | Integration tests | `sync.integration.test.ts` | 🔴 Critical | Medium | 3 |
| 4.1 | Colorized output | `cli.ts` | 🟢 Medium | Low | 4 |
| 4.2 | Verbose logging | `cli.ts` + `sync.ts` | 🟢 Medium | Low | 4 |
| 4.3 | Shell completions | `cli/` | 🟢 Medium | Medium | 4 |

---

*Completed work (v0.1.x–v0.3.x) is documented in [CHANGELOG.md](../CHANGELOG.md).*