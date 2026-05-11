# Dev Harness

Dev Harness is a lightweight, CLI-first personal AI development workflow harness.

It exists to make AI-assisted coding more disciplined: plan first, load focused context, keep implementation scope tight, run verification, review the diff, and leave reusable artifacts for the next session.

## What This Is

- A local CLI for generating AI development artifacts with soft enforcement.
- A repeatable workflow model for Codex, Claude Code, Cursor, Aider, and similar coding agents.
- A small TypeScript/Node.js tool that standardizes project context, plans, checks, reviews, and summaries.
- A foundation for AI-native development workflow, not prompt-only experimentation.

## What This Is Not

- Not a SaaS product.
- Not a web platform.
- Not a heavy multi-agent framework.
- Not an AI IDE.
- Not a tool that lets agents run indefinitely without engineering constraints.

## Architecture

The codebase has three layers:

### Layer 1: Philosophy (`src/philosophy/`)

Immutable workflow principles embedded as code. These define how AI-assisted development should work. Never modified by users — copied into `.agent-harness/philosophy.md` at init time so agents always have access.

Core principles: plan before you edit, minimal patches, verify after every change, review the diff against plan scope, leave checkpoints, record decisions, do not expand scope.

### Layer 2: Mechanism (`src/mechanism/`)

The engine that implements the philosophy:

- **Lifecycle management**: Run states (`planned → in_progress → reviewed → summarized`) tracked in `.agent-harness/runs/<id>/status`
- **Artifact validation**: Soft checks — `devh plan` warns if scope or non-goals are empty but doesn't block
- **Context collection**: Git state, project structure, keyword-based file discovery, harness project notes
- **Verification**: Auto-detects package.json scripts, pytest, .NET; also reads custom commands from CHECKS.md
- **Review with scope comparison**: `devh review` compares changed files against plan scope and flags out-of-scope changes

### Layer 3: Customization (`src/customization/`)

Default templates that users can override:

- `PROJECT.md` — project context and architecture notes
- `CHECKS.md` — verification commands and prohibitions
- `DECISIONS.md` — durable cross-session decisions

## Why It Exists

AI coding sessions often repeat the same setup cost: explaining the project, restating constraints, deciding checks, reviewing scope, and summarizing what changed. Dev Harness turns those repeated steps into durable files:

- `.agent-harness/philosophy.md` — immutable principles (copied from Layer 1)
- `.agent-harness/PROJECT.md` — project context
- `.agent-harness/CHECKS.md` — verification commands
- `.agent-harness/DECISIONS.md` — cross-session decisions
- `.agent-harness/runs/<run-id>/plan.md`
- `.agent-harness/runs/<run-id>/context.md`
- `.agent-harness/runs/<run-id>/verification.md`
- `.agent-harness/runs/<run-id>/review.md`
- `.agent-harness/runs/<run-id>/summary.md`

The goal is lower context cost, fewer off-scope edits, and clearer handoff between human and AI.

## Install

```bash
pnpm install
pnpm build
pnpm link --global
```

For local development without linking:

```bash
pnpm dev -- plan "fix login redirect bug"
```

## CLI

```bash
devh init-project
devh plan "fix login redirect bug"
devh context "fix login redirect bug"
devh verify
devh review
devh summarize
```

v0 does not call an LLM API. It prepares artifacts that AI coding agents can read and use.

## Standard Workflow

```text
task -> plan -> context -> implement -> verify -> review -> summarize
```

Each step creates or updates an artifact in `.agent-harness/runs/<run-id>/`. The lifecycle is tracked via a `status` file:

- `planned` — plan created, awaiting implementation
- `in_progress` — context loaded, implementation started
- `reviewed` — diff reviewed with scope comparison
- `summarized` — run complete

## Soft Enforcement

The harness uses soft enforcement, not hard blocks:

- `devh plan` warns if scope or non-goals sections are empty
- `devh review` compares changed files against plan scope and flags out-of-scope changes
- `devh verify` runs all detected checks and records results

All warnings are advisory. The real enforcement comes from the philosophy document that agents read and follow.

## Working With Coding Agents

Use Dev Harness as the shared working memory for agents:

- Ask Codex to read `AGENTS.md` and the latest `.agent-harness/runs/<run-id>/plan.md`.
- Ask Claude Code to implement only the approved plan and update verification artifacts.
- Ask Cursor to use `context.md` before editing files.
- Ask Aider to review only the current git diff using `prompts/review-diff.md`.

The harness does not replace these tools. It gives them a stable workflow boundary.

## Project Integration

Run this in any project:

```bash
devh init-project
```

This creates the `.agent-harness/` directory with PROJECT.md, CHECKS.md, DECISIONS.md, RUNS.md, and philosophy.md. It also suggests content for AGENTS.md.

Then fill in:

- `.agent-harness/PROJECT.md` for architecture and domain context.
- `.agent-harness/CHECKS.md` for project-specific verification commands and prohibitions.
- `.agent-harness/DECISIONS.md` for durable decisions.
- `AGENTS.md` for repo-level coding-agent instructions.

## Legacy Note

The original BugPilot Python prototype has been removed. Its concepts may resurface as a `sentry-fix` harness workflow in the future.