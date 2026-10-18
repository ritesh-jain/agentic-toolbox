# Documentation Index for Agentic Toolkit

This document is a living scratchpad that captures the planned documentation structure for the Agentic Toolkit project.

---

## Table of Contents

- [Core Project Documentation](#core-project-documentation)
- [Guidelines & Standards](#guidelines--standards)
- [Architecture Decision Records](#architecture-decision-records)
- [Developer Guides](#developer-guides)

---

## Core Project Documentation

| File | Location | Purpose (Technical) | Developer's Perspective | Status |
|------|----------|-------------------|------------------------|--------|
| **README.md** | Project root | Project overview, features, tech stack, quick start commands, installation, usage, and links to other docs. | The entry point for anyone landing on the repo. Should make them immediately understand what the toolkit is, why they should care, and how to get started in 5 minutes. | completed |
| **AGENTS.md** | Project root | AI agent guidelines: CLI flags, sync engine architecture, agent/skill creation process, frontmatter field reference, backlog. | This is the system prompt for AI assistants. When an AI starts working on this codebase, this file teleports it into the project context. | completed |
| **ROADMAP.md** | `docs/roadmap.md` | Future release phases (v0.2.0 → v1.0.0+), prioritized feature backlog, technical debt, documentation tasks. | The strategic plan. During sprint planning, look here to decide what comes next. No completed work — only future. | completed |
| **ARCHITECTURE.md** | `docs/architecture.md` | High-level system design: sync engine, transform logic, CLI, project-level merge, data flow. | The big-picture map. When adding a new feature or fixing a cross-cutting bug, read this first. | completed |
| **CHANGELOG.md** | `docs/changelog.md` | Curated, chronological log of notable changes per release. Follows [Keep a Changelog](https://keepachangelog.com/) format. | The curated history of what actually changed. Unlike git log which is noisy, this highlights changes that matter. | completed |
| **TRACKER.md** | `docs/tracker.md` | Current sprint only: unified task table with status column (Done/In Progress/Pending/Blocked), blockers, velocity. | The active sprint state. Update daily. No backlog, no history — only what we're doing right now. | completed |

---

## Guidelines & Standards

| File | Location | Purpose (Technical) | Developer's Perspective | Status |
|------|----------|-------------------|------------------------|--------|
| **CONTRIBUTING.md** | Project root | Human contributor guide: PR workflow, branch naming, commit message conventions, how to run tests/lint, review process. | The onboarding doc for other humans. If someone wants to submit a PR, this is where they learn the rituals. | completed |
| **CODE-STANDARDS.md** | `docs/code-standards.md` | Formal coding conventions: naming rules, file organization, TypeScript patterns, import order, error handling patterns. | My personal rulebook for code style. Write them down once so AI-generated code matches the project style. | planned |

---

## Architecture Decision Records

| File | Location | Purpose (Technical) | Developer's Perspective | Status |
|------|----------|-------------------|------------------------|--------|
| **ADR/001-modular-sync-engine.md** | `docs/adr/` | Decision to split sync engine into 7 modules (cli, config, constants, transform, sync, types, index). Alternatives: single file, fewer modules. | Why 7 modules? This ADR captures the trade-off between granularity and complexity. Prevents future consolidation that loses separation of concerns. | planned |
| **ADR/002-project-level-merge.md** | `docs/adr/` | Decision to merge project-level agents/skills on sync. Alternatives: package-only, separate directories. | The merge strategy is a key differentiator. This ADR explains why project files override package templates, enabling customization without forking. | planned |
| **ADR/003-yaml-frontmatter-parser.md** | `docs/adr/` | Decision to replace regex parser with `yaml` package. Alternatives: improve regex, use js-yaml. | Regex parsing is fragile. This ADR documents the migration path to a proper YAML parser for robustness. | planned |
| **ADR/004-cli-flag-design.md** | `docs/adr/` | Decision on CLI flags (`--config`, `--dry-run`, `--verbose`, `--help`). Alternatives: subcommands, env vars. | CLI design affects UX. This ADR captures why flags over subcommands for a simple sync tool. | planned |

---

## Developer Guides

| File | Location | Purpose (Technical) | Developer's Perspective | Status |
|------|----------|-------------------|------------------------|--------|
| **development.md** | `docs/dev/development.md` | Local environment setup: prerequisites, npm install, npm run build, npm run dev, test commands, common dev workflows. | The "I just cloned the repo, now what?" guide. Linear, copy-paste-friendly sequence to get a dev environment running in under 5 minutes. | planned |
| **testing.md** | `docs/dev/testing.md` | Testing strategy: unit test patterns (Vitest), integration test approach for sync engine, CLI testing. | How to actually test the sync engine. Since it deletes directories, tests must be careful. | planned |
| **release.md** | `docs/dev/release.md` | Release process: version bump, changelog update, git tag, GitHub release. | The release checklist. Step-by-step so releases are consistent. | planned |

---

## Architecture & Quality Reference

| File | Location | Purpose | Developer's Perspective | Status |
|------|----------|---------|------------------------|--------|
| **sync-engine-spec.md** | `docs/sync-engine-spec.md` | Detailed specification of sync engine: syncToTarget, project merge, transform logic, error handling. | The reference implementation spec. When modifying sync behavior, read this first. | planned |

---

This index is a living document. As the project evolves and new decisions are made, new ADRs will be added, new module docs may be created, and existing files may be updated.