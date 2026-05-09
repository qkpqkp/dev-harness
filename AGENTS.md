# AGENTS.md

This repository is a personal AI development harness: a lightweight, CLI-first workflow toolbox for AI-assisted software development.

## Product Boundary

- Do not turn this into a web app.
- Do not build a SaaS platform.
- Do not implement multi-agent orchestration.
- Do not create a heavy agent framework or AI IDE.
- Prefer local files, CLI commands, and explicit artifacts over hidden automation.

## Engineering Style

- Use simple, maintainable TypeScript and Node.js.
- Keep CLI commands small and composable.
- Avoid heavy dependencies unless they clearly remove more complexity than they add.
- Prefer readable code over clever abstractions.
- Avoid destructive filesystem or git operations.
- Preserve user files and existing run artifacts.

## Workflow Principles

- Understand context before implementation.
- Create or update a plan before complex multi-step work.
- Keep patches minimal and scoped.
- Run relevant verification before finishing.
- Review the diff before summarizing.
- Record durable decisions and checkpoints.

For complex tasks, use:

```text
.agent-harness/runs/<run-id>/plan.md
```

as the execution plan. Update it when the scope changes materially.

## Documentation Requirements

- Workflow behavior changes must update docs.
- Prompt changes should update the relevant prompt file and docs when behavior changes.
- New commands should include README usage and at least one artifact example.

## Existing Prototype

The `bugpilot/` directory is a preserved Python prototype for Sentry error ingestion and AI-assisted fixes. Treat it as legacy/reference material unless a task explicitly targets it.
