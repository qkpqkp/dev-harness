# Dev Harness

Dev Harness is a lightweight, CLI-first personal AI development workflow toolbox.

It exists to make AI-assisted coding more disciplined: plan first, load focused context, keep implementation scope tight, run verification, review the diff, and leave reusable artifacts for the next session.

This repository started from a small BugPilot Sentry-fix prototype. That idea now becomes one workflow inside a broader personal development harness.

## What This Is

- A local CLI for generating AI development artifacts.
- A repeatable workflow model for Codex, Claude Code, Cursor, Aider, and similar coding agents.
- A small TypeScript/Node.js tool that standardizes project context, plans, checks, reviews, and summaries.
- A foundation for AI-native development workflow, not prompt-only experimentation.

## What This Is Not

- Not a SaaS product.
- Not a web platform.
- Not a heavy multi-agent framework.
- Not an AI IDE.
- Not a tool that lets agents run indefinitely without engineering constraints.

## Why It Exists

AI coding sessions often repeat the same setup cost: explaining the project, restating constraints, deciding checks, reviewing scope, and summarizing what changed. Dev Harness turns those repeated steps into durable files:

- `.agent-harness/PROJECT.md`
- `.agent-harness/CHECKS.md`
- `.agent-harness/DECISIONS.md`
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
task -> plan -> context -> implement -> verify -> review -> fix -> summarize
```

Example:

```bash
devh init-project
devh plan "fix login redirect bug"
devh context "fix login redirect bug"

# Give the run folder to Codex, Claude Code, Cursor, Aider, or another agent.
# Ask it to implement only the approved plan.

devh verify
devh review
devh summarize
```

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

Then fill in:

- `.agent-harness/PROJECT.md` for architecture and domain context.
- `.agent-harness/CHECKS.md` for project-specific verification.
- `.agent-harness/DECISIONS.md` for durable decisions.
- `AGENTS.md` for repo-level coding-agent instructions.

## Legacy BugPilot Prototype

The `bugpilot/` Python directory is preserved as the original Sentry-driven error-fix prototype. The long-term direction is to express that flow as a `sentry-fix` harness workflow rather than a standalone heavy automation platform.
