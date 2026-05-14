# Agent Instructions

This project uses Dev Harness for AI-assisted development workflow.

## Agent Rules

Read `.agent-harness/philosophy.md` for the full principles, then follow these rules:

- Classify task risk before editing: small, medium, or large.
- Use the lightest process that fits the risk.
- For small clear tasks, a full plan is optional unless scope is unclear.
- For medium or large tasks, create or update a short plan before editing.
- Understand local context before changing files.
- Keep changes inside the agreed scope.
- If scope grows, stop and update the plan or ask.
- Run relevant verification before finishing.
- Review your diff before the final response.
- Update docs and tests when behavior changes.
- Record durable decisions in `.agent-harness/DECISIONS.md` when behavior or architecture changes.

## Quick Reference

```
devh init-project          # Set up .agent-harness/ directory
devh plan "task"           # Create a run and plan.md
devh context               # Collect git, structure, and harness context
devh verify                # Run checks (auto-detected + CHECKS.md)
devh review                # Diff review with scope comparison
devh summarize             # Close run, generate summary
```




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

## Key Mechanisms

- **Lifecycle states**: `planned → in_progress → reviewed → summarized`. Stored in `.agent-harness/runs/<id>/status`.
- **Scope validation**: `devh plan` warns if scope or non-goals are empty. `devh review` compares changed files against plan scope.
- **CHECKS.md integration**: Users can list custom commands in CHECKS.md that `devh verify` will run alongside auto-detected ones.
- **Philosophy anchoring**: `devh init-project` copies immutable principles into `.agent-harness/philosophy.md` so agents always have access.

## Documentation Requirements

- Workflow behavior changes must update docs.
- Prompt changes should update the relevant prompt file and docs when behavior changes.
- New commands should include README usage and at least one artifact example.

## Legacy Note

The original BugPilot Python prototype has been removed. Its concepts may resurface as a `sentry-fix` harness workflow in the future.

# Agent Instructions

This project uses Dev Harness for AI-assisted development workflow.
<!-- devh:start -->
## Agent Rules

Read `.agent-harness/philosophy.md` for the full principles, then follow these rules:

- Classify task risk before editing: small, medium, or large.
- Use the lightest process that fits the risk.
- For small clear tasks, a full plan is optional unless scope is unclear.
- For medium or large tasks, create or update a short plan before editing.
- Understand local context before changing files.
- Keep changes inside the agreed scope.
- If scope grows, stop and update the plan or ask.
- Run relevant verification before finishing.
- Review your diff before the final response.
- Update docs and tests when behavior changes.
- Record durable decisions in `.agent-harness/DECISIONS.md` when behavior or architecture changes.

## Quick Reference

```
devh init-project          # Set up .agent-harness/ directory
devh plan "task"           # Create a run and plan.md
devh context               # Collect git, structure, and harness context
devh verify                # Run checks (auto-detected + CHECKS.md)
devh review                # Diff review with scope comparison
devh summarize             # Close run, generate summary
```

<!-- devh:end -->



