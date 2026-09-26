# 🚀 Cross-Platform AI Agent & Skill Sync Engine

A tool-agnostic configuration pipeline that manages your AI coding personas (`agents`) and automated utility capabilities (`skills`) across multiple projects and platforms.

---

## What This Does

Different AI coding tools expect configuration files in different locations:

| Tool | Expected Location |
|------|-------------------|
| **OpenCode** | `.opencode/` |
| **Claude Code** | `.claude/` |
| **Standard** | `.agents/` |

This package acts as a **single source of truth** that syncs your agents and skills to whatever tool each project uses. No broken symlinks, no cross-platform issues.

---

## Installation

Choose the method that matches your project stack. **80–90% of Node.js/TypeScript projects should use Option A.** Non-Node.js projects (Java, Go, Python, etc.) use Option B.

| Method | Best For | Install | Run |
|--------|----------|---------|-----|
| **A. npm Package** | Node.js / TypeScript / JS | `npm install --save-dev git+https://...` | `agentic-toolkit` |
| **B. Git Submodule** | Java, Go, Python, any non-Node stack | `git submodule add ...` | `node ./scripts/agentic-toolkit/start.js` |

> **Prerequisite:** Node.js `>=18` is required for **both** methods — the sync engine is Node-based even when the parent project is Java/Go/Python.

### Option A: npm Package (Recommended — Node.js / TypeScript / JS)

Use this for all Node.js-based hobby projects. The toolkit is consumed as a normal dev dependency directly from GitHub — no registry publish needed.

#### 1. Install from GitHub

```bash
# HTTPS (public repo — works everywhere, no SSH keys needed)
npm install --save-dev git+https://github.com/ritesh-jain/agentic-toolkit.git

# Or SSH (if you have GitHub SSH keys set up)
npm install --save-dev git+ssh://git@github.com/ritesh-jain/agentic-toolkit.git

# Pin to a branch/tag/commit if needed
npm install --save-dev git+https://github.com/ritesh-jain/agentic-toolkit.git#main
npm install --save-dev git+https://github.com/ritesh-jain/agentic-toolkit.git#v1.0.0
```

This adds to your `package.json`:

```json
{
  "devDependencies": {
    "@riteshjain/agentic-toolkit": "git+https://github.com/ritesh-jain/agentic-toolkit.git"
  }
}
```

#### 2. Add npm Scripts

```json
{
  "scripts": {
    "agent:sync": "agentic-toolkit",
    "agent:save": "agentic-toolkit --save"
  }
}
```

The binary `agentic-toolkit` is exposed via `package.json:bin` → `start.js` and is available automatically through `npx` / npm scripts.

#### 3. Create Config File

Create `agentic-toolkit.json` in your project root:

```json
{
  "targets": ["opencode", "claude"]
}
```

#### 4. Run Sync

```bash
npm run agent:sync
# or directly
npx agentic-toolkit
npx agentic-toolkit --config ./agentic-toolkit.json
```

#### Updating

```bash
npm update @riteshjain/agentic-toolkit
# or reinstall to pull latest main
npm install --save-dev git+https://github.com/ritesh-jain/agentic-toolkit.git#main
```

---

### Option B: Git Submodule (Java, Go, Python & Other Non-Node.js Projects)

Use this when the parent project has **no `package.json`** and you cannot run `npm install` — e.g., a Java/Maven/Gradle project. The toolkit lives as a tracked submodule and is invoked with `node` directly.

#### 1. Add as Submodule

```bash
# Pick a path that won't collide — `scripts/agentic-toolkit` is recommended
git submodule add https://github.com/ritesh-jain/agentic-toolkit.git scripts/agentic-toolkit

# Or via SSH
git submodule add git@github.com:ritesh-jain/agentic-toolkit.git scripts/agentic-toolkit
```

Add to your parent `.gitmodules` (auto-created). Commit it:

```bash
git add .gitmodules scripts/agentic-toolkit
git commit -m "chore: add agentic-toolkit submodule"
```

#### 2. Create Config File

Same as npm method — create `agentic-toolkit.json` in the **parent project root** (not inside the submodule):

```json
{
  "targets": ["opencode"]
}
```

#### 3. Run Sync

No `package.json` scripts needed — invoke the engine directly:

```bash
# From parent project root — any of these work:
node ./scripts/agentic-toolkit/start.js
node ./scripts/agentic-toolkit/start.js --config ./agentic-toolkit.json
npx ./scripts/agentic-toolkit

# Reverse sync (save edits back into the submodule for committing):
node ./scripts/agentic-toolkit/start.js --save
```

For convenience, add a Makefile / shell alias / Gradle task:

```makefile
# Makefile
agent-sync:
	node ./scripts/agentic-toolkit/start.js

agent-save:
	node ./scripts/agentic-toolkit/start.js --save
```

```bash
# .bashrc / .zshrc alias
alias agent-sync="node ./scripts/agentic-toolkit/start.js"
```

#### 4. Cloning & Updating

```bash
# First clone of a project that already has the submodule
git clone --recurse-submodules <parent-repo-url>
# or if already cloned
git submodule update --init --recursive

# Pull latest toolkit changes
git -C scripts/agentic-toolkit pull origin main
git add scripts/agentic-toolkit
git commit -m "chore: bump agentic-toolkit"
```

---

## Commands

Both methods expose the same CLI. Only the invocation prefix differs.

| Command | npm Package | Git Submodule | Description |
|---------|-------------|---------------|-------------|
| Sync | `agentic-toolkit` | `node ./scripts/agentic-toolkit/start.js` | Sync agents/skills from toolkit to target dirs |
| Save | `agentic-toolkit --save` | `node ./scripts/agentic-toolkit/start.js --save` | Save changes FROM target dirs BACK to toolkit |
| Custom config | `agentic-toolkit --config <path>` | `node ./scripts/agentic-toolkit/start.js --config <path>` | Use a non-default config file |

Via npm scripts these become:

```bash
npm run agent:sync        # → agentic-toolkit
npm run agent:save        # → agentic-toolkit --save
```

---

## Configuration

### `agentic-toolkit.json`

Located in the **parent project root** (alongside `package.json` for Node projects, alongside `pom.xml`/`build.gradle` for Java projects).

| Field | Description |
|-------|-------------|
| `targets` | Array of target platforms: `opencode`, `claude`, or `agents` |

### Example Configurations

Sync to OpenCode only:
```json
{ "targets": ["opencode"] }
```

Sync to both OpenCode and Claude:
```json
{ "targets": ["opencode", "claude"] }
```

Sync to all platforms:
```json
{ "targets": ["opencode", "claude", "agents"] }
```

### Auto-Discovery

If `agentic-toolkit.json` is missing, the engine auto-detects:
- `opencode.json` → targets `.opencode/`
- `claude.json` or `.clauderc` → targets `.claude/`
- Otherwise → targets `.agents/`

### Custom Config Path

```bash
# npm
agentic-toolkit --config ./my-custom-config.json
# submodule
node ./scripts/agentic-toolkit/start.js --config ./my-custom-config.json
```

---

## Repository Structure

### When installed via npm

```
parent-project/
├── package.json
├── agentic-toolkit.json
├── node_modules/@riteshjain/agentic-toolkit/
│   ├── package.json         # CLI binary: agentic-toolkit → start.js
│   ├── start.js             # Sync engine
│   ├── AGENTS.md            # Instructions for AI models
│   ├── README.md            # This file
│   ├── agents/              # Agent definitions
│   │   ├── Agent.md.sample
│   │   └── *.md
│   └── skills/              # Skill definitions
│       ├── SKILL.md.sample
│       └── */               # Skill dirs with SKILL.md
├── .opencode/               # Generated (gitignored)
├── .claude/                 # Generated (gitignored)
└── .agents/                 # Generated (gitignored)
```

### When added as git submodule

```
parent-project/                          # e.g., Java/Maven project
├── pom.xml / build.gradle
├── agentic-toolkit.json
├── scripts/agentic-toolkit/             # ← submodule
│   ├── package.json
│   ├── start.js
│   ├── AGENTS.md
│   ├── README.md
│   ├── agents/
│   └── skills/
├── .opencode/                           # Generated (gitignored)
├── .claude/                             # Generated (gitignored)
└── .agents/                             # Generated (gitignored)
```

---

## Creating New Agents

### Option A: Use the Creation Pipeline (Recommended)

The toolkit includes an orchestration agent `agentic-tools-creator` that uses three skills to create agents:

1. **agentic-resource-gatherer** — Searches public repos for similar agents
2. **agent-creator** — Generates the agent file
3. **agentic-tools-creator** — Orchestrates the workflow

Invoke via your AI assistant (Claude/OpenCode) with the agentic-tools-creator agent.

### Option B: Manual Creation

1. Copy the template:

   ```bash
   # npm package
   cp node_modules/@riteshjain/agentic-toolkit/agents/Agent.md.sample agents/MyAgent.md
   # submodule
   cp scripts/agentic-toolkit/agents/Agent.md.sample agents/MyAgent.md
   ```

2. Edit the new file with your agent's configuration

3. Run sync:

   ```bash
   # npm
   npm run agent:sync
   # submodule (Java etc.)
   node ./scripts/agentic-toolkit/start.js
   ```

### Agent Description Format

Every agent description MUST be a free-flowing paragraph that includes:
- What this agent does (its core capability)
- When to call this agent (trigger conditions)
- What NOT to use it for (exclusions)
- What it returns (for subagents, omit for primary agents)

---

## Creating New Skills

### Option A: Use the Creation Pipeline

Same as agents — use the `agentic-tools-creator` agent with type="skill".

### Option B: Manual Creation

1. Create a directory for the skill:
   ```bash
   mkdir -p skills/my-skill
   ```

2. Copy the template:

   ```bash
   # npm package
   cp node_modules/@riteshjain/agentic-toolkit/skills/SKILL.md.sample skills/my-skill/SKILL.md
   # submodule
   cp scripts/agentic-toolkit/skills/SKILL.md.sample skills/my-skill/SKILL.md
   ```

3. Edit the new file with your skill's configuration

4. Run sync:

   ```bash
   npm run agent:sync
   # or
   node ./scripts/agentic-toolkit/start.js
   ```

### Skill File Structure

Skills must be placed in a directory with `SKILL.md` as the entrypoint:

```
skills/
└── my-skill/
    ├── SKILL.md           # Main instructions (required)
    ├── template.md        # Optional template
    ├── examples/
    │   └── sample.md      # Optional examples
    └── scripts/
        └── helper.sh      # Optional scripts
```

### Skill Description Format

Every skill description MUST be a free-flowing paragraph that includes:
- What this skill does (its purpose)
- When to invoke it (trigger conditions)
- What NOT to use it for (exclusions)
- What it returns (output structure)

---

## Gitignore

Add these to your parent project's `.gitignore` (both Node.js and Java projects):

```gitignore
# AI Agent Toolkit - Generated directories
.opencode/
.claude/
.agents/
```

For submodule projects, do **not** ignore the submodule path:

```gitignore
# Keep the submodule itself tracked
!scripts/agentic-toolkit/
```

---

## Platform Compatibility

This toolkit works with both Claude and OpenCode. Agent files use a superset of both platforms' configuration options:

| Feature | Claude | OpenCode |
|---------|--------|----------|
| Tool control | `tools` field | `permission` field |
| Model selection | `model` aliases | `provider/model-id` |
| Permission modes | `permissionMode` | `permission` object |
| Turn limits | `maxTurns` | `steps` |
| Memory | `memory` field | Not supported |
| MCP servers | `mcpServers` field | Not in agents |

For detailed field documentation, see `agents/Agent.md.sample`.

---

## How It Works

The sync engine (`start.js`, published as `agentic-toolkit` binary) reads your master agent/skill files (which contain a **superset** of all platform fields), then **transforms** them per target:

- **For OpenCode**: Strips Claude-only fields (`tools`, `permissionMode`, `maxTurns`, `skills`, `mcpServers`, `hooks`, `memory`, `background`, `effort`, `isolation`, `initialPrompt`)
- **For Claude**: Strips OpenCode-only fields (`permission`, `mode`, `temperature`, `steps`, `disable`, `prompt`, `hidden`, `top_p`, `reasoningEffort`, `textVerbosity`)
- **For Standard**: No transformation (keeps all fields)

This means you maintain **one master file** per agent/skill, and get platform-optimized configs automatically.

---

## Troubleshooting

### Sync not working

1. Verify `agentic-toolkit.json` exists in project root
2. Check the toolkit is installed:
   ```bash
   # npm
   ls node_modules/@riteshjain/agentic-toolkit/start.js
   npx agentic-toolkit --config ./agentic-toolkit.json

   # submodule
   ls scripts/agentic-toolkit/start.js
   node ./scripts/agentic-toolkit/start.js --config ./agentic-toolkit.json
   git submodule update --init --recursive
   ```

### Changes not persisting

- **npm package:** The `--save` flag writes to `node_modules/` which doesn't persist across installs. For npm usage:
  - Treat the package as read-only source of truth
  - Maintain custom agents/skills in your project's own `agents/` and `skills/` folders
  - Or fork the repo and publish your own version
- **Git submodule:** `--save` writes back into `scripts/agentic-toolkit/` — commit and push the submodule:
  ```bash
  node ./scripts/agentic-toolkit/start.js --save
  git -C scripts/agentic-toolkit status
  git -C scripts/agentic-toolkit add -A && git -C scripts/agentic-toolkit commit -m "feat: update agents"
  git add scripts/agentic-toolkit && git commit -m "chore: bump toolkit"
  ```

### Wrong target directory

Check your `agentic-toolkit.json` `targets` value, or let auto-discovery work by removing the config file.

---

## License

MIT — See LICENSE for details.
