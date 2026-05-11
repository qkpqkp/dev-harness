# Agent Instructions

This project uses Dev Harness for AI-assisted development workflow.

## Dev Harness Workflow

Read `.agent-harness/philosophy.md` for the full set of principles. Key points:

1. **Plan before you edit.** Create or read the plan in `.agent-harness/runs/<current>/plan.md` before making changes.
2. **Context first.** Run `devh context` and read the output before touching files.
3. **Scope is a contract.** Only implement what is in the plan scope. If you find more work, record it as a new task — do not fold it in.
4. **Verify after changes.** Run `devh verify` and address any failures before proceeding.
5. **Review the diff.** Run `devh review` and check for out-of-scope changes.
6. **Record decisions in** `.agent-harness/DECISIONS.md`.

## Hard Rules

- Do not implement anything outside the plan scope.
- Do not skip verification.
- Do not skip diff review.
- If scope is unclear, ask before proceeding.
- Update docs and tests when behavior changes.

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
## Dev Harness Workflow

Read `.agent-harness/philosophy.md` for the full set of principles. Key points:

1. **Plan before you edit.** Create or read the plan in `.agent-harness/runs/<current>/plan.md` before making changes.
2. **Context first.** Run `devh context` and read the output before touching files.
3. **Scope is a contract.** Only implement what is in the plan scope. If you find more work, record it as a new task — do not fold it in.
4. **Verify after changes.** Run `devh verify` and address any failures before proceeding.
5. **Review the diff.** Run `devh review` and check for out-of-scope changes.
6. **Record decisions in** `.agent-harness/DECISIONS.md`.

## Hard Rules

- Do not implement anything outside the plan scope.
- Do not skip verification.
- Do not skip diff review.
- If scope is unclear, ask before proceeding.
- Update docs and tests when behavior changes.

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


