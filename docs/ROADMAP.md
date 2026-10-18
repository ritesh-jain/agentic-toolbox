# Roadmap

> [!IMPORTANT]
> **AI Agents**: If you are an AI, please read the **AI Execution Workflow** section in [AGENTS.md](../AGENTS.md) to understand how this roadmap is structured and how to proceed with your tasks.

---

## 🎯 Release Phases

### Phase 0: v0.1.0 — npm Publishing (Current Sprint)
*Scope: `docs/TRACKER.md`*

- [ ] Publish `agentic-toolbox@0.1.0` to npm
- [ ] GitHub Actions publish workflow with provenance
- [ ] Verify install and update README

---

### Phase 1: v0.2.0 — Core Engine Hardening
*Target: Post-publish, first feature sprint*

**1.1 YAML Frontmatter Parser**
- [ ] Replace regex parser with `yaml` package in `src/transform.ts`
- [ ] Handle arrays, multiline strings, comments
- [ ] Preserve field stripping behavior for OpenCode/Claude

**1.2 Config Schema Validation**
- [ ] Add JSON Schema validation for `agentic-toolkit.json` (Zod or native)
- [ ] Validate `targets` array, reject unknown fields

**1.3 Structured Error Classes**
- [ ] `SyncError`, `ConfigError`, `TransformError`, `ParseError`
- [ ] Consistent error codes and user-facing messages

**1.4 Incremental Sync (Optional)**
- [ ] Manifest-based sync with file hashes
- [ ] Behind `--incremental` flag

---

### Phase 2: v0.3.0 — Testing & Quality

**2.1 Test Infrastructure**
- [ ] Set up Vitest test suite
- [ ] Configure coverage thresholds

**2.2 Unit Tests**
- [ ] `transform.ts` — all field stripping combinations
- [ ] `config.ts` — load, auto-discovery, invalid JSON
- [ ] `sync.ts` — syncToTarget, project merge
- [ ] `cli.ts` — argument parsing, help output

**2.3 Integration Tests**
- [ ] Full sync cycle with temp directories
- [ ] Multi-target sync verification
- [ ] Project merge override behavior

---

### Phase 3: v0.4.0 — CLI & UX Polish

- [ ] Colorized terminal output (ANSI codes, `--color` flag)
- [ ] Verbose logging levels (`--verbose`, `--quiet`)
- [ ] `--diff` flag for preview (unified diff)
- [ ] Shell completion scripts (bash, zsh, fish)

---

### Phase 4: v0.5.0 — CI/CD & Release Automation

- [ ] GitHub Actions CI: build → test → lint on PR
- [ ] GitHub Actions Release: publish on git tag (`v*`)
- [ ] Automated changelog generation
- [ ] Version bump workflow

---

### Phase 5: v1.0.0 — Production Hardening

- [ ] Achieve 80%+ test coverage
- [ ] Performance benchmarks
- [ ] Security audit
- [ ] Documentation complete (ADRs, module specs)
- [ ] Create `v1.0.0` tag and GitHub release

---

## 📦 Future Major Goals (Post v1.0.0)

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
| 1.1 | YAML parser replacement | `transform.ts` | 🔴 Critical | Medium | 1 |
| 1.2 | Config schema validation | `config.ts` | 🔴 Critical | Low | 1 |
| 1.3 | Structured error classes | `types.ts` + all | 🔴 Critical | Low | 1 |
| 2.1 | Vitest setup | `package.json` + `vitest.config.ts` | 🟡 High | Medium | 2 |
| 2.2 | Transform unit tests | `transform.test.ts` | 🟡 High | Medium | 2 |
| 2.3 | Config unit tests | `config.test.ts` | 🟡 High | Low | 2 |
| 2.4 | Sync unit tests | `sync.test.ts` | 🟡 High | High | 2 |
| 2.5 | Integration test | `sync.integration.test.ts` | 🟡 High | Medium | 2 |
| 3.1 | Colorized output | `cli.ts` | 🟢 Medium | Low | 3 |
| 3.2 | Verbose logging | `cli.ts` + `sync.ts` | 🟢 Medium | Low | 3 |
| 3.3 | `--diff` flag | `sync.ts` + `cli.ts` | 🟢 Medium | Medium | 3 |
| 4.1 | GitHub Actions CI | `.github/workflows/ci.yml` | 🟢 Medium | Medium | 4 |
| 4.2 | GitHub Actions Release | `.github/workflows/release.yml` | 🟢 Medium | Low | 4 |

---

*Completed work is documented in [CHANGELOG.md](../CHANGELOG.md).*