# Architecture Overview — Agentic Toolbox

> **High-level technical blueprint** for the Agentic Toolbox sync engine.

---

## 🗺️ System Map

### Module Structure

```
src/
├── index.ts                      # CLI entry point
├── types/                        # Type definitions and target configurations
│   ├── index.ts                  # Barrel export
│   ├── targets.ts                # Target definitions, STRIP_FIELDS, TARGET_OPTIONS
│   ├── config.ts                 # Config, Target, SyncConfig, LoadedConfig
│   ├── sync.ts                   # SyncOptions, SyncResult, TargetConfig
│   ├── transform.ts              # StripFields, TransformOptions, ParsedContent
│   ├── errors.ts                 # ErrorCode, ErrorContext, ValidationError
│   └── cli.ts                    # CliArgs, FlagDefinition, SubcommandDefinition
├── utils/                        # Infrastructure utilities (fs, logging, errors)
│   ├── index.ts                  # Utils barrel export
│   ├── fs/                       # Safe filesystem operations
│   │   ├── index.ts              # FS operations barrel
│   │   ├── operations.ts         # read, write, copy, remove, exists
│   │   ├── atomic.ts             # Atomic writes
│   │   └── paths.ts              # Path resolution utilities
│   ├── logging/                  # Logging abstraction
│   │   ├── index.ts              # Logging barrel
│   │   ├── console.ts            # Console logger implementation
│   │   └── levels.ts             # Log levels
│   └── errors/                   # Structured error classes
│       ├── index.ts              # Errors barrel
│       ├── classes.ts            # Error classes (ConfigError, SyncError, etc.)
│       └── codes.ts              # Error code enums
├── core/                         # Core domain logic
│   ├── index.ts                  # Core barrel export
│   ├── config/                   # Configuration management
│   │   ├── index.ts              # Config public API
│   │   ├── loader.ts             # Config loading + auto-discovery
│   │   ├── schema.ts             # Config schema validation
│   │   └── discovery.ts          # Auto-discovery logic
│   ├── sync/                     # Sync engine
│   │   ├── index.ts              # Sync public API
│   │   ├── engine.ts             # Sync orchestration
│   │   ├── engine-internal.ts    # Internal sync implementation
│   │   ├── merger.ts             # Project merge logic
│   │   ├── manifest.ts           # Incremental sync manifest
│   │   └── targets/
│   │       ├── index.ts          # Target configurations
│   │       └── target-configs.ts # Target definitions + STRIP_FIELDS
│   └── transform/                # Frontmatter transformation
│       ├── index.ts              # Transform public API
│       ├── parser.ts             # YAML frontmatter parser
│       ├── stripper.ts           # Field stripper
│       ├── reassembler.ts        # Content reassembler
│       └── transform-agent.ts    # Main transform function
└── cli/                          # CLI interface
    ├── index.ts                  # CLI barrel export
    ├── run-cli.ts                # Main CLI entry point
    ├── args/                     # Argument parsing
    │   ├── index.ts              # Args barrel
    │   ├── parser.ts             # Argument parsing
    │   ├── flags.ts              # Flag definitions
    │   └── subcommands.ts        # Subcommand definitions
    ├── commands/                 # Command implementations
    │   ├── index.ts              # Commands barrel
    │   ├── sync.ts               # Sync command
    │   ├── validate.ts           # Validate command
    │   ├── diff.ts               # Diff command
    │   └── init.ts               # Init command
    └── help/                     # Help system
        ├── index.ts              # Help barrel
        ├── templates.ts          # Help text templates
        └── print-help.ts         # Print help function
```

### Dependency Hierarchy (Strictly One-Directional)

```
types ──► utils ──► core ──► cli
```

- **`types/`**: Single source of truth for types and target definitions. Internal imports only (never imports from `utils/`, `core/`, `cli/`).
- **`utils/`**: Infrastructure utilities (fs, logging, error classes). Can import from `types/` (never imports from `core/`, `cli/`).
- **`core/`**: Core domain logic (sync engine, config, transform). Can import from `types/` and `utils/` (never imports from `cli/`).
- **`cli/`**: CLI command routing and presentation. Can import from `types/`, `utils/`, and `core/`.

### Path Resolution

| Concept | Resolution |
|---------|------------|
| Parent Project Root | `process.cwd()` |
| Toolkit Dir | `import.meta.url` → `__dirname` |
| Config File | `agentic-toolbox.json` in parent root |

---

## 🏗️ Core Architectural Principles

### 1. Zero Symlinks
All file transfers use `read`, `write`, `purge` (`fs.rmSync`), and `copy` (`fs.cpSync`) operations only. No symbolic or hard links — avoids cross-platform issues, broken links, and permission problems.

### 2. Path Safety
- **Parent root**: `process.cwd()` — always the consuming project root
- **Toolkit dir**: `import.meta.url` → `__dirname` — always the toolkit location
- **Never hardcode paths** — all paths resolved dynamically

### 3. Encapsulation
Dependencies stay in toolkit's `package.json`. Never pollute the parent project's dependency graph. Toolkit is a self-contained unit.

### 4. Superset Master Files
Master agent/skill files contain a **superset** of all platform fields. The sync engine **transforms** (strips) per target:
- **OpenCode target**: Strips 12 Claude-only fields
- **Claude target**: Strips 10 OpenCode-only fields
- **Standard target**: No transformation

### 5. Project-Level Merge (Key Differentiator)
Sync is not a simple copy. It merges two sources in order:
1. **Package templates** (from `node_modules/agentic-toolbox/agents/`, `skills/`)
2. **Project customizations** (from `./agents/`, `./skills/` in consuming project)

Project files **override** package files with the same name. This enables customization without forking.

---

## 🔄 Data Flow

### Forward Sync (Default)

```
┌─────────────────────┐
│  Load Config        │
│  (agentic-toolbox.  │
│   json or auto)     │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  For Each Target    │
│  (.opencode, .claude,│
│  .agents)           │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  1. Remove Target   │
│     Directory       │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  2. Create Empty    │
│     agents/, skills/│
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  3. Copy Package    │
│     Agents +        │
│     Transform       │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  4. Merge Project   │
│     Agents          │
│     (override)      │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  5. Copy Package    │
│     Skills          │
│     (no transform)  │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  6. Merge Project   │
│     Skills          │
│     (override)      │
└─────────────────────┘
```

---

## 🛠️ Module Responsibilities

| Module | Responsibility | Key Exports |
|--------|---------------|-------------|
| `index.ts` | CLI entry point | `runCli()` |
| `cli/run-cli.ts` | CLI orchestration | `runCli()` |
| `cli/args/parser.ts` | Argument parsing | `parseArgs()` |
| `cli/args/subcommands.ts` | Subcommand definitions | `subcommands`, `defaultCommand` |
| `cli/commands/sync.ts` | Sync command | `syncCommand()` |
| `cli/commands/validate.ts` | Validate command | `validateCommand()` |
| `cli/commands/diff.ts` | Diff command | `diffCommand()` |
| `cli/commands/init.ts` | Init command | `initCommand()` |
| `core/config/loader.ts` | Config loading + auto-discovery | `loadConfig()` |
| `core/config/schema.ts` | Config schema validation | `validateConfig()` |
| `core/config/discovery.ts` | Auto-discovery logic | `discoverConfig()` |
| `core/sync/engine.ts` | Sync orchestration | `syncToTargets()`, `syncToTarget()` |
| `core/sync/engine-internal.ts` | Internal sync implementation | `syncToTargetImpl()` |
| `core/sync/merger.ts` | Project merge logic | `mergeAgents()`, `mergeSkills()` |
| `core/sync/manifest.ts` | Incremental sync manifest | `loadManifest()`, `saveManifest()`, `createFileEntry()` |
| `core/sync/targets/index.ts` | Target configurations | `TARGET_CONFIGS`, `getTargetConfig()` |
| `core/transform/index.ts` | Transform public API | `transformAgentContent()`, `parseFrontmatter()`, etc. |
| `core/transform/parser.ts` | YAML frontmatter parser | `parseFrontmatter()`, `stringifyFrontmatter()` |
| `core/transform/stripper.ts` | Field stripper | `stripFields()`, `getStripFields()` |
| `core/transform/reassembler.ts` | Content reassembler | `reassembleContent()` |
| `core/transform/transform-agent.ts` | Main transform function | `transformAgentContent()` |
| `utils/fs/operations.ts` | Safe filesystem operations | `readFile()`, `writeFile()`, `copyFile()`, etc. |
| `utils/fs/paths.ts` | Path resolution | `getParentProjectRoot()`, `getToolkitDir()` |
| `utils/logging/console.ts` | Colored console logger | `ConsoleLogger`, `logger` |
| `utils/errors/classes.ts` | Structured error classes | `ConfigError`, `SyncError`, `TransformError`, etc. |

---

## 🔧 Key Algorithms

### Frontmatter Transformation (`core/transform/`)

**Current**: YAML parser (`yaml` package)
```typescript
import { parse, stringify } from 'yaml';
// Parse frontmatter → remove fields → stringify → reassemble
```

**Field Stripping Logic**:
1. Match frontmatter between `---` delimiters
2. Parse YAML to object
3. Remove fields in `STRIP_FIELDS[target]`
4. Stringify back to YAML
5. Reassemble with original body

### Project Merge Strategy (`core/sync/merger.ts`)

**Agents** (with transformation):
```typescript
// 1. Package agents
for (file of packageAgents) {
  write(transform(file), target)
}
// 2. Project agents (overwrite)
for (file of projectAgents) {
  write(transform(file), target)
}
```

**Skills** (no transformation, recursive copy):
```typescript
// 1. Package skills
cpSync(packageSkills, targetSkills)
// 2. Project skills (overwrite)
cpSync(projectSkills, targetSkills)
```

### Auto-Discovery (`core/config/discovery.ts`)

```typescript
if (exists('opencode.json')) return { targets: ['opencode'] }
if (exists('claude.json') || exists('.clauderc')) return { targets: ['claude'] }
return { targets: ['agents'] }
```

---

## 🔒 Security & Safety

- **No symlinks** — eliminates link-based attacks
- **Path validation** — all paths resolved from known roots
- **Destructive operations guarded** — `fs.rmSync` only on target directories under parent root
- **No network access** — pure local file operations
- **No secrets in config** — `agentic-toolbox.json` only contains targets array

---

## 📈 Extensibility Points

| Extension Point | Mechanism | Status |
|----------------|-----------|--------|
| New Target Platform | Add to `TARGET_DEFINITIONS` in `types/targets.ts` | Manual code change |
| Custom Transformers | Not yet supported | Planned: plugin API |
| Custom Validators | Not yet supported | Planned: plugin API |
| Additional CLI Flags | Add to `flags.ts`, `subcommands.ts` | Manual code change |
| Config Schema | Native validation in `schema.ts` | Implemented |

---

## 🧪 Testing Strategy

| Layer | Approach | Tools |
|-------|----------|-------|
| Unit | Pure function tests (transform, config, path resolution) | Vitest |
| Integration | Temp directory sync cycles, project merge verification | Vitest + temp dirs |
| CLI | Argument parsing, help output, flag combinations | Vitest + spawn |
| E2E | Real project sync with multiple targets | Manual / scripted |

---

## 🚀 Deployment Pipeline

1. **Local**: `npm run build` → `dist/`
2. **Consume**: `npm install agentic-toolbox@0.5.0` (from npm registry)
3. **Run**: `npx agentic-toolbox` or `npm run agent:sync`

---

## 📦 Distribution

- **npm registry**: `agentic-toolbox@0.5.0` (published)
- **GitHub**: `ritesh-jain/agentic-toolbox` (source)
- **Binary**: `agentic-toolbox` (via `package.json:bin` → `dist/index.js`)
