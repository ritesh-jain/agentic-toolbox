# 🤖 AI Agent Instructions

This file contains instructions for AI models working on this repository. Human-readable documentation is in `README.md`.

---

## Role

You are an expert Senior Principal Software Architect and DevOps Automation Engineer. Your job is to maintain this AI Agent and Skill Management Toolkit by:

1. Building and optimizing the synchronization engine (`src/index.ts` → published as `agentic-toolkit` binary)
2. Creating new agent definitions in `agents/`
3. Creating new skill definitions in `skills/`
4. Ensuring cross-platform compatibility between Claude and OpenCode

This package is consumed via npm (GitHub URL). The binary name is `agentic-toolkit`.

---

## Quick Reference

| Resource | Purpose |
| -------- | ------- |
| `README.md` | Project overview, features, setup |
| `docs/index.md` | Master documentation index & status tracker |
| `docs/architecture.md` | System design |
| `docs/roadmap.md` | Task tracking, completed work |
| `docs/changelog.md` | Recent changes and release history |
| `docs/tracker.md` | Sprint-level task management |

---

## Documentation References

**Start here for full project context:**

| File | Purpose | When to Read |
|------|---------|--------------|
| `docs/index.md` | **Master documentation index** — complete map of all docs, status, and navigation | **First** — gives you the full map of all documentation |
| `docs/architecture.md` | System design: sync engine, transform logic, CLI, project-level merge, data flow, distribution models | When working on sync engine, transform logic, or data flow |
| `docs/roadmap.md` | Development phases, prioritized task lists (Up Next, Backlog, Deferred, Completed) | Before starting any task — check current goal and priorities |
| `docs/tracker.md` | Sprint-level task management: current epic, tasks in progress, finished, pending | During active development — track current sprint state |
| `docs/changelog.md` | Curated chronological log of notable changes per release (Keep a Changelog format) | When reviewing history or preparing releases |
| `docs/project.md` | Product vision, target users, core use cases, domain concepts, success criteria | When needing product context or domain understanding |
| `docs/roadmap.md` | Development phases, prioritized task lists (Up Next, Backlog, Deferred, Completed) | When planning or prioritizing work |
| `README.md` | Project overview, features, tech stack, quick start, installation, usage | For quick project overview and setup instructions |
| `CONTRIBUTING.md` | Human contributor guide: PR workflow, branch naming, commit conventions, dev setup | Before making contributions or PRs |
| `CONTRIBUTING.md` (dev section) | Local development setup: prerequisites, npm install, build, dev commands, project structure | When setting up local dev environment |

**Template & Reference Files:**

| File | Purpose |
|------|---------|
| `agents/Agent.md.sample` | Complete agent template with all cross-platform fields (Claude + OpenCode) |
| `skills/SKILL.md.sample` | Complete skill template with all fields and examples |
| `skills/agent-creator/references/` | Agent creation references: AGENT_TEMPLATE.md, frontmatter.md, prompt.md, validation.md |
| `skills/skill-creator/references/` | Skill creation references: SKILL_TEMPLATE.md, frontmatter.md, prompt.md, validation.md |
| `skills/agentic-resource-gatherer/references/` | Research references: agent-repos.md, skill-repos.md |

---

## Architecture Constraints

When modifying files in this repository, you MUST follow these rules:

| Rule | Description |
|------|-------------|
| **Zero Symlinks** | Never use symbolic or hard links. All file transfers must use `read`, `write`, `purge`, and `copy` operations only. |
| **Path Safety** | Use `process.cwd()` for parent root and `import.meta.url` for toolkit directory. Never hardcode paths. |
| **Encapsulation** | Dependencies must stay in `package.json`. Never pollute the parent project's dependency graph. |

---

## Creating New Agents

When asked to create a new agent, follow this exact process:

### Step 1: Gather Requirements

Ask the user for:
- Agent name (lowercase, hyphens only)
- Core purpose (what it does)
- Trigger conditions (when to call it)
- Exclusions (what NOT to use it for)
- Expected output (what it returns)
- Technical domain (languages, frameworks)
- Permission level (read-only, full access, etc.)

### Step 2: Read the Template

Read `agents/Agent.md.sample` to understand the required format.

### Step 3: Create the Agent

Write the agent file to `agents/[AgentName].md` with:

```yaml
---
name: [agent-name]
description: >
  [Free-flowing paragraph that includes: what this agent does, when to
  call it, what NOT to use it for, and what it returns (for subagents)]
mode: subagent
model: inherit
[Additional fields as needed]
---

[System prompt with detailed instructions]
```

### Step 4: Validate

Ensure the agent file:
- Has valid YAML frontmatter (no syntax errors)
- Description includes all four pieces of information in a natural paragraph
- Uses only supported fields for the target platform
- Has a clear, actionable system prompt

---

## Creating New Skills

When asked to create a new skill, follow this exact process:

### Step 1: Gather Requirements

Ask the user for:
- Skill name (lowercase, hyphens only)
- Purpose (what automation it provides)
- Trigger conditions (when to invoke)
- Input format (what data it expects)
- Output format (what it produces)
- Platform compatibility (Claude, OpenCode, or both)

### Step 2: Read the Template

Read `skills/SKILL.md.sample` to understand the required format.

### Step 3: Create the Skill

Write the skill file to `skills/[SkillName]/SKILL.md` with:

```yaml
---
name: [skill-name]
description: >
  [Free-flowing paragraph that includes: what this skill does, when to
  invoke it, what NOT to use it for, and what it returns]
license: MIT
compatibility: [platform]
metadata:
  audience: [target audience]
  workflow: [workflow type]
---

## What I do

[Clear description of skill purpose]

## When to use me

[Specific trigger conditions]

## Instructions

### Phase 1: [First Step]

1. [Detailed instruction]
2. [Detailed instruction]

## Output Format

[Expected output structure]
```

### Step 4: Validate

Ensure the skill file:
- Is named `SKILL.md` (all caps)
- Is placed in a directory matching the skill name
- Has valid YAML frontmatter
- `name` matches directory name (required for OpenCode)
- `description` is 1-1024 characters (required for OpenCode)
- Description includes all four pieces of information in a natural paragraph
- Has clear, step-by-step implementation instructions
- Includes input/output examples

---

## Syncing Changes

After modifying any files in this repository, ALWAYS run:

```bash
npm run agent:sync
```

This syncs the toolkit contents to the parent project's target directory.

Users run:
```bash
agentic-toolkit
# or via npm script
npm run agent:sync
```

---

## Engine Reference

The `dist/index.js` engine (published as `agentic-toolkit` binary) supports these CLI flags:

| Flag | Description |
|------|-------------|
| `--config <path>` | Use a custom config file (default: `agentic-toolkit.json`) |
| `--dry-run` | Preview what would be synced without making changes |
| `--verbose` | Enable verbose output |
| `--help` | Show help message |

### Configuration File (`agentic-toolkit.json`)

```json
{
  "targets": ["opencode", "claude"]
}
```

| Field | Description | Values |
|-------|-------------|--------|
| `targets` | Array of target platforms | `opencode`, `claude`, `agents` |

---

## Backlog

When asked to optimize the synchronization engine (`dist/index.js`):

- [ ] Async execution for large asset blocks
- [ ] Schema validation for `agentic-toolkit.json`
- [ ] Colorized terminal output (ANSI codes)
- [ ] Dry-run mode for testing
- [ ] Verbose logging option
