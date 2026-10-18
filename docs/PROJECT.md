# Project Definition: Agentic Toolkit

**Document Status**: Active
**Role**: Product Requirements Document (PRD) / Vision Statement
**Perspective**: Project Lead → Developer / Contributor

---

## 1. Product Vision

Agentic Toolkit is a **cross-platform AI agent and skill synchronization engine**. It solves the fragmentation problem where different AI coding tools (OpenCode, Claude Code, standard `.agents/`) expect configuration in different locations with different field schemas.

The vision: **Define once, sync everywhere.** Maintain a single source of truth for your AI agents and skills, and let the toolkit handle platform-specific transformations and distribution.

Unlike tool-specific configuration managers, Agentic Toolkit:
- Is **tool-agnostic** — works with any AI coding assistant
- Uses a **superset format** — master files contain all fields; engine strips per target
- Supports **project-level customization** — override package templates locally
- Is **technology-neutral** — pure Node.js CLI, no cloud dependency

---

## 2. Target Audience

Agentic Toolkit is designed for:

- **AI-Assisted Developers** — Engineers who use AI coding assistants daily and want consistent agent/skill configurations across tools
- **Tool Developers** — Creators of AI coding assistants who want a standard format for agent/skill definitions
- **Team Leads** — Organizations wanting standardized AI assistant configurations across team members
- **Agent/Skill Authors** — People creating reusable agents and skills who want maximum platform compatibility

---

## 3. Core Use Cases

### 3.1. Single Source of Truth
The user defines agents and skills once in the toolkit (or their project), runs `agentic-toolkit`, and gets properly formatted configurations for OpenCode, Claude Code, and standard `.agents/` directories.

### 3.2. Cross-Platform Agent/Skill Development
Authors write agents/skills using a superset of all platform fields. The toolkit handles stripping incompatible fields per target:
- **For OpenCode**: Strips Claude-only fields (`tools`, `permissionMode`, `maxTurns`, `skills`, `mcpServers`, `hooks`, `memory`, `background`, `effort`, `isolation`, `initialPrompt`)
- **For Claude**: Strips OpenCode-only fields (`permission`, `mode`, `temperature`, `steps`, `disable`, `prompt`, `hidden`, `top_p`, `reasoningEffort`, `textVerbosity`)

### 3.3. Project-Level Customization
Consuming projects can maintain their own `./agents/` and `./skills/` directories. On sync, these **override** package templates, allowing project-specific customizations without forking the toolkit.

### 3.4. Toolkit Development
Developers can work on the toolkit directly with full TypeScript support, watch mode (`npm run dev`), and build pipeline (`npm run build`).

---

## 4. Domain Concepts (The Agentic Toolkit Ontology)

| Concept | Definition | Relationship |
|----------|------------|--------------|
| **Agent** | An AI persona definition with frontmatter (capabilities, triggers, permissions) and a system prompt | Consumed by AI tools; synced to target directories |
| **Skill** | A reusable automation capability with frontmatter (triggers, instructions, I/O format) and Markdown instructions | Invoked by agents or users; synced to target directories |
| **Target** | A destination platform/directory (`.opencode/`, `.claude/`, `.agents/`) | Receives transformed agent/skill files |
| **Transform** | Platform-specific field stripping applied during sync | Applied per target during forward sync |
| **Project Merge** | Merging project-level `./agents/`, `./skills/` with package templates | Project files override package files on sync |
| **Config** | `agentic-toolkit.json` defining targets and options | Controls sync behavior |

---

## 5. Success Criteria (The "Definition of Done")

From a product perspective, Agentic Toolkit is successful when:

1. **Reliability**: A user can define an agent once, run `agentic-toolkit`, and get working configurations in `.opencode/`, `.claude/`, and `.agents/` without manual edits.
2. **Fidelity**: No data loss during transform — all compatible fields preserved, incompatible fields cleanly stripped.
3. **Extensibility**: Project-level customizations work seamlessly.
4. **Developer Experience**: `npm run build && npx agentic-toolkit` works out of the box; clear error messages; helpful `--help`.
5. **Reliability**: Zero data corruption — sync never loses user data, `--dry-run` accurately previews changes.
6. **Adoption**: Toolkit is consumable as npm dependency from GitHub.