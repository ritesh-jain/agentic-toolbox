# Architecture Overview — Agentic Toolkit

> **High-level technical blueprint** for the Agentic Toolkit sync engine.

---

## 🗺️ System Map

### Module Structure

```
src/
├── index.ts            # CLI entry point
├── cli.ts              # Argument parsing, help, orchestration
├── config.ts           # Config loading + auto-discovery
├── constants.ts        # TOOL_MAP, STRIP_FIELDS, regexes
├── transform.ts        # Frontmatter transformation per platform
├── sync.ts             # syncToTarget (with project merge)
└── types.ts            # TypeScript interfaces
```

### Path Resolution

| Concept | Resolution |
|---------|------------|
| Parent Project Root | `process.cwd()` |
| Toolkit Dir | `import.meta.url` → `__dirname` |
| Config File | `agentic-toolkit.json` in parent root |

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
1. **Package templates** (from `node_modules/@riteshjain/agentic-toolkit/agents/`, `skills/`)
2. **Project customizations** (from `./agents/`, `./skills/` in consuming project)

Project files **override** package files with the same name. This enables customization without forking.

---

## 🔄 Data Flow

### Forward Sync (Default)

```
┌─────────────────────┐
│  Load Config        │
│  (agentic-toolkit.  │
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
| `cli.ts` | Arg parsing, help, orchestration | `parseArgs()`, `printHelp()`, `runCli()` |
| `config.ts` | Config loading + auto-discovery | `loadConfig()`, `getParentProjectRoot()`, `getSubmoduleDir()` |
| `constants.ts` | Shared constants | `TOOL_MAP`, `STRIP_FIELDS`, `FRONTMATTER_REGEX` |
| `transform.ts` | Frontmatter transformation | `transformAgentContent()` |
| `sync.ts` | Sync logic (forward) | `syncToTarget()` |
| `types.ts` | TypeScript interfaces | `ToolMap`, `StripFields`, `AgenticToolkitConfig`, `CliOptions`, `SyncResult` |

---

## 🔧 Key Algorithms

### Frontmatter Transformation (`transform.ts`)

**Current**: Regex-based parsing
```typescript
const FRONTMATTER_REGEX = /^(---\n)([\s\S]*?)(\n---)/;
// Line-by-line parsing with indent tracking for nested blocks
```

**Planned**: YAML parser (`yaml` package)
```typescript
import { parse, stringify } from 'yaml';
// Parse frontmatter → remove fields → stringify → reassemble
```

**Field Stripping Logic**:
1. Match frontmatter between `---` delimiters
2. Split into lines
3. Track indent level for nested YAML blocks
4. Skip lines for fields in `STRIP_FIELDS[target]`
5. Rejoin and replace in original content

### Project Merge Strategy (`sync.ts`)

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

### Auto-Discovery (`config.ts`)

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
- **No secrets in config** — `agentic-toolkit.json` only contains targets array

---

## 📈 Extensibility Points

| Extension Point | Mechanism | Status |
|----------------|-----------|--------|
| New Target Platform | Add to `TOOL_MAP`, `STRIP_FIELDS` | Manual code change |
| Custom Transformers | Not yet supported | Planned: plugin API |
| Custom Validators | Not yet supported | Planned: plugin API |
| Additional CLI Flags | Add to `parseArgs()`, `CliOptions` | Manual code change |
| Config Schema | JSON Schema / Zod | Planned |

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
2. **Consume**: `npm install git+https://github.com/ritesh-jain/agentic-toolkit.git#main`
3. **Run**: `npx agentic-toolkit` or `npm run agent:sync`