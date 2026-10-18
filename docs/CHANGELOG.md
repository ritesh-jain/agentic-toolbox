# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [0.1.0] - 2026-09-27

### Added
- **Modular TypeScript Architecture**: Split `start.js` into 7 modules (`index`, `cli`, `config`, `constants`, `transform`, `sync`, `types`) with strict TypeScript
- **Project-Level Merge**: Sync now merges `./agents/` and `./skills/` from consuming project, overriding package templates
- **CLI Flags**: `--config`, `--dry-run`, `--verbose`, `--help`
- **Auto-Discovery**: Falls back to `opencode.json` → `.opencode/`, `claude.json`/`.clauderc` → `.claude/`, default → `.agents/`
- **Agent Templates**: Complete cross-platform `agents/Agent.md.sample` with all Claude and OpenCode fields
- **Skill Templates**: Complete cross-platform `skills/SKILL.md.sample` with all fields
- **Creation Pipeline Skills**: `agent-creator`, `skill-creator`, `agentic-resource-gatherer` with references and examples
- **Build System**: `tsc` with declaration maps, source maps
- **npm Dependency**: Supports npm package consumption from GitHub (package name: `agentic-toolbox`)

### Changed
- **Sync Engine**: Rewritten in TypeScript with modular architecture
- **Field Stripping**: Moved to `constants.ts` with `STRIP_FIELDS` map
- **Config Loading**: Extracted to `config.ts` with auto-discovery
- **CLI**: Argument parsing, help, and orchestration in `cli.ts`
- **Package renamed**: `@riteshjain/agentic-toolkit` → `agentic-toolbox` (bare name)
- **Distribution**: npm-only (removed git submodule support)

### Removed
- **Reverse sync**: `--save` flag and `saveFromTarget()` functionality
- **Legacy entry point**: `start.js` removed (replaced by `src/index.ts` → `dist/index.js`)
- **Git submodule support**: Documentation and code paths removed

### Fixed
- **Project Merge Order**: Package agents/skills copied first, then project files override
- **Path Resolution**: Uses `process.cwd()` for parent, `import.meta.url` for toolkit dir

---

## Release Notes Template

### [X.Y.Z] - YYYY-MM-DD

#### Added
- Feature descriptions

#### Changed
- Changes to existing functionality

#### Deprecated
- Soon-to-be-removed features

#### Removed
- Removed features

#### Fixed
- Bug fixes

#### Security
- Vulnerability fixes