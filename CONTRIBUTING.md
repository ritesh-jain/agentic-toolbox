# Contributing to Agentic Toolkit

Thank you for your interest in contributing to Agentic Toolkit! We welcome contributions that improve the sync engine, add platform support, enhance agent/skill templates, or fix bugs.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm 9+
- Git

### Local Development Setup

```bash
# Clone the repository
git clone https://github.com/ritesh-jain/agentic-toolkit.git
cd agentic-toolkit

# Install dependencies
npm install

# Build the project
npm run build

# Run in watch mode (for development)
npm run dev
```

## 🛠 Contribution Workflow

### 1. Reporting Issues

Before starting work on a bug or a new feature, please check if an issue already exists. If not, open a new issue with the following:
- **Bugs**: A clear description of the bug, steps to reproduce it, and the expected vs. actual behavior.
- **Feature Requests**: A detailed explanation of the proposed feature, the problem it solves, and how it fits into the product vision.

### 2. Branching Strategy

We use a structured branching model to keep the git history clean. Please use the following prefixes for your branch names:
- `feat/` → New features (e.g., `feat/yaml-frontmatter-parser`)
- `fix/` → Bug fixes (e.g., `fix/transform-multiline-strings`)
- `docs/` → Documentation updates (e.g., `docs/update-cli-help`)
- `refactor/` → Code improvements that do not change functionality (e.g., `refactor/sync-engine-strategy`)

### 3. Commit Conventions

Agentic Toolkit follows the [Conventional Commits](https://www.conventionalcommits.org/) specification.

**Format**: `<type>(<scope>): <description>`

**Common Types**:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools and libraries

**Example**: `feat(transform): add yaml package for frontmatter parsing`

### 4. Pull Request Process

When you are ready to submit your changes, open a Pull Request (PR) against the `main` branch. A high-quality PR should include:
- **Context**: A summary of what was changed and why.
- **Link**: Reference to the issue it resolves (e.g., `Closes #123`).
- **Verification**: Evidence that the changes were tested (e.g., build output, manual test results).
- **Build Status**: Confirmation that the project still builds successfully (`npm run build`).

## ✅ Quality Checklist

Before submitting your PR, please ensure you have completed the following:

- [ ] **Follow Standards**: Your code adheres to the project's TypeScript conventions (strict mode, ESM, proper types).
- [ ] **Linting**: You have run `npm run lint` (if available) and resolved all errors.
- [ ] **Build Check**: You have run `npm run build` and confirmed there are no TypeScript errors.
- [ ] **No Secrets**: You have verified that no API keys or secrets are committed.
- [ ] **Tests**: You have added tests for new functionality (when test infrastructure exists).
- [ ] **Non-Destructive**: If you moved or refactored files, you have ensured no critical historical information was lost.

## 🧐 Review Process

All PRs undergo a review process to ensure architectural alignment and code quality.
- **Feedback**: You may receive requests for changes. This is a normal part of the collaborative process.
- **Iterative Improvements**: Please address feedback promptly and push updated commits to your branch.
- **Approval**: Once the reviewer is satisfied, the PR will be merged into the main branch.

## 🎯 Code Standards (Summary)

- **Strict TypeScript** — No `any`, explicit types, ESM imports with `.js` extension
- **Naming** — `camelCase` variables/functions, `PascalCase` types/interfaces, `UPPER_SNAKE` constants
- **Error Handling** — Structured result types, early returns, no bare throws
- **Async** — `async/await` preferred, structured concurrency with `Promise.all`
- **File Organization** — Single responsibility per module, barrel exports avoided

Thank you for helping make Agentic Toolkit better!