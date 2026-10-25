# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [0.3.0] - 2026-10-25

### Added
- **Modular CLI Architecture**: Subcommands (`sync`, `validate`, `diff`, `init`) with dedicated implementations
- **Config Schema Validation**: Zod-like validation for `agentic-toolbox.json` with unknown field detection
- **YAML Frontmatter Parser**: Replaced regex-based parsing with `yaml` package for robust frontmatter handling
- **Structured Error Classes**: `SyncError`, `ConfigError`, `TransformError`, `ParseError`, `FsError`, `CliError`, `ValidationError` with error codes
- **Colored Console Logger**: Leveled logging (debug/info/warn/error/success) with ANSI colors
- **TypeScript Path Aliases**: `@/`, `@types/`, `@core/`, `@utils/`, `@cli/` for clean imports
- **tsc-alias Integration**: Runtime path alias resolution for compiled output

### Changed
- **Complete Architecture Restructure**: `src/` reorganized into `core/`, `utils/`, `cli/`, `types/` with clear separation of concerns
- **Barrel Export Pattern**: All `index.ts` files are now pure re-exports (no implementation)
- **CLI Refactor**: Argument parsing supports kebab-case flags, subcommand-specific flags, and proper flag merging
- **Sync Engine**: Modularized into `engine`, `targets`, `merger`, `manifest` with incremental sync foundation
- **Transform Pipeline**: Separated `parser`, `stripper`, `reassembler` for testability
- **Config System**: Split into `loader`, `schema`, `discovery` with full validation
- **Dev Script**: `npm run dev` now builds and runs CLI for rapid iteration
- **Version**: Bumped to 0.3.0 (minor) for architecture milestone

### Fixed
- **Binary Execution**: Added shebang to `src/index.ts` for proper npm bin wrapper
- **Path Resolution**: Robust toolkit directory detection for both source and installed contexts

## [0.2.0] - 2026-10-25

### Added
- **Bootstrapping**: Package now depends on itself (`agentic-toolbox@0.1.8` as devDependency) — the toolkit uses its own published version for development
- **Self-Hosting**: Published npm package can be used to develop the toolkit itself, creating a recursive improvement loop via bootstrapping

### Changed
- **Package Rename**: `agentic-toolkit` → `agentic-toolbox` across entire codebase
  - Binary name: `agentic-toolkit` → `agentic-toolbox`
  - Config file: `agentic-toolkit.json` → `agentic-toolbox.json`
  - All documentation, source code, and references updated
- **Manual Release Flow**: Simplified from semantic-release to manual version bump + PR validation + merge + npm stage + manual promote
- **Version**: Bumped to 0.2.0 (minor) for bootstrapping milestone

### Fixed
- **Repository URLs**: Updated to `ritesh-jain/agentic-toolbox` consistently

## [0.1.8] - 2026-10-24

### Added
- **CI/CD Pipeline**: GitHub Actions workflows for validation and npm staging
  - `validate.yml`: Runs on PR — build, test, package.json validation
  - `publish.yml`: Runs on merge to main — stages to npm via OIDC
- **npm OIDC Trusted Publisher**: Configured for automated staging with provenance
- **Manual Release Flow**: Version bump via `npm version`, PR validation, merge, stage, manual promote

### Changed
- **Release Process**: Reverted from semantic-release to simple manual flow
- **Workflows**: Removed semantic-release automation; kept `validate.yml` and `publish.yml`

## [0.1.5] - 2026-10-18

### Added
- **npm Publishing**: Package published to npm registry as `agentic-toolbox`
- **GitHub Actions CI**: Automated validation on PR (build, test, package.json check)
- **npm Staging**: Automated `npm stage publish` on merge with OIDC provenance
- **Manual Promote**: `npm promote` for controlled public release

### Changed
- **Distribution**: npm-only (removed git submodule support)
- **Package Name**: `@riteshjain/agentic-toolkit` → `agentic-toolbox` (bare name)

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
- Soon-to-removed features

#### Removed
- Removed features

#### Fixed
- Bug fixes

#### Security
- Vulnerability fixes