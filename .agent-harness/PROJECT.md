# Project

## Purpose

Dev Harness (devh) is a CLI-first personal AI development workflow tool. It standardizes how AI agents plan, implement, verify, and review code changes by producing durable markdown artifacts.

## Architecture

Three-layer architecture:

- **Philosophy** (`src/philosophy/`): Immutable principles embedded as TypeScript constants. Copied to `.agent-harness/philosophy.md` at init time.
- **Mechanism** (`src/mechanism/`): The engine — lifecycle state machine, artifact validation, context collection, verification, review with scope comparison, summarization.
- **Customization** (`src/customization/`): Default templates for PROJECT.md, CHECKS.md, DECISIONS.md. Agent config generation for Claude Code, Codex, Cursor, Gemini.

CLI entry: `src/cli.ts` → `src/commands/` (thin wrappers around mechanism functions).

No external dependencies. Pure TypeScript/Node.js.

## Important Paths

- `src/philosophy/content.ts` — principle and agent instruction content
- `src/mechanism/` — core engine (lifecycle, artifacts, checkpoints, context, verify, review)
- `src/commands/` — CLI command handlers
- `src/customization/templates.ts` — default templates + agent configs
- `.agent-harness/` — runtime directory, not source code
- `prompts/` — external agent prompts (plan, implement, review-diff, fix-test-failure, sentry-fix)
- `bugpilot/` — legacy Python prototype, do not modify

## AI Collaboration Notes

- Keep context concise.
- Prefer minimal patches.
- Record important decisions in DECISIONS.md.
- Do not modify bugpilot/ unless a task explicitly targets it.