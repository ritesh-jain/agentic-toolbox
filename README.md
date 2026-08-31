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

## Quick Start (npm Package)

### 1. Install from GitHub

```bash
# HTTPS (public)
npm install --save-dev git+https://github.com/ritesh-jain/agentic-toolkit.git

# Or SSH
npm install --save-dev git+ssh://git@github.com/ritesh-jain/agentic-toolkit.git
```

### 2. Add npm Scripts

Add to your `package.json`:

```json
{
  "scripts": {
    "agent:sync": "agentic-toolkit",
    "agent:save": "agentic-toolkit --save"
  }
}
```

### 3. Create Config File

Create `agentic-toolkit.json` in your project root:

```json
{
  "targets": ["opencode", "claude"]
}
```

### 4. Run Sync

```bash
npm run agent:sync
```

---

## Alternative: Git Submodule

If you prefer the submodule approach (for contributing back to the toolkit):

```bash
git submodule add https://github.com/ritesh-jain/agentic-toolkit.git scripts/agentic-toolkit
```

Then use `npx ./scripts/agentic-toolkit agentic-toolkit --config ./agentic-toolkit.json` instead of the binary.

---

## Commands

| Command | Description |
|---------|-------------|
| `agentic-toolkit` | Sync agents/skills from package to target directories |
| `agentic-toolkit --save` | Save changes FROM target directories BACK to package (submodule only) |
| `agentic-toolkit --config <path>` | Use custom config file |

---

## Configuration

### `agentic-toolkit.json`

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
agentic-toolkit --config ./my-custom-config.json
```

---

## Repository Structure

```
node_modules/@riteshjain/agentic-toolkit/
├── package.json         # CLI binary definition
├── start.js             # Sync engine
├── AGENTS.md            # Instructions for AI models
├── README.md            # This file
├── agents/              # Agent definitions
│   ├── Agent.md.sample  # Template for new agents
│   └── *.md             # Your agent files
└── skills/              # Skill definitions
    ├── SKILL.md.sample  # Template for new skills
    └── */               # Skill directories with SKILL.md
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
   cp node_modules/@riteshjain/agentic-toolkit/agents/Agent.md.sample agents/MyAgent.md
   ```

2. Edit the new file with your agent's configuration

3. Run sync:
   ```bash
   npm run agent:sync
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
   cp node_modules/@riteshjain/agentic-toolkit/skills/SKILL.md.sample skills/my-skill/SKILL.md
   ```

3. Edit the new file with your skill's configuration

4. Run sync:
   ```bash
   npm run agent:sync
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

Add these to your project's `.gitignore`:

```gitignore
# AI Agent Toolkit - Generated directories
.opencode/
.claude/
.agents/
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

The sync engine (`start.js`) reads your master agent/skill files (which contain a **superset** of all platform fields), then **transforms** them per target:

- **For OpenCode**: Strips Claude-only fields (`tools`, `permissionMode`, `maxTurns`, `skills`, `mcpServers`, `hooks`, `memory`, `background`, `effort`, `isolation`, `initialPrompt`)
- **For Claude**: Strips OpenCode-only fields (`permission`, `mode`, `temperature`, `steps`, `disable`, `prompt`, `hidden`, `top_p`, `reasoningEffort`, `textVerbosity`)
- **For Standard**: No transformation (keeps all fields)

This means you maintain **one master file** per agent/skill, and get platform-optimized configs automatically.

---

## Troubleshooting

### Sync not working

1. Verify `agentic-toolkit.json` exists in project root
2. Run with explicit config: `agentic-toolkit --config ./agentic-toolkit.json`

### Changes not persisting (npm package)

The `--save` flag writes to `node_modules/` which doesn't persist across installs. For npm usage:
- Treat the package as read-only source of truth
- Maintain custom agents/skills in your project's `agents/` and `skills/` folders
- Or fork the repo and publish your own version to npm

### Wrong target directory

Check your `agentic-toolkit.json` `targets` value, or let auto-discovery work by removing the config file.

---

## License

MIT — See LICENSE for details.