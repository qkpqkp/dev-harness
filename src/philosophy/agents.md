# Agent Instructions

This project uses Dev Harness for AI-assisted development workflow.

## Before You Start

1. Read `.agent-harness/philosophy.md` for workflow principles.
2. Read `.agent-harness/PROJECT.md` for project context.
3. Read `.agent-harness/CHECKS.md` for verification commands.
4. Read `.agent-harness/DECISIONS.md` for recorded decisions.
5. Check `.agent-harness/current-run` for an active run. If one exists, read its `plan.md` first.

## Workflow

Follow this sequence. Do not skip steps.

1. **Plan**: Use `devh plan "task description"`. Fill in the plan's goal, scope, and non-goals before implementing.
2. **Context**: Use `devh context`. Read the generated context before touching any files.
3. **Implement**: Make only the changes described in the plan. Do not expand scope.
4. **Verify**: Use `devh verify`. Address any failing checks before proceeding.
5. **Review**: Use `devh review`. Compare every changed file against the plan's scope. Flag any out-of-scope changes.
6. **Summarize**: Use `devh summarize` to close the run.

## Hard Rules

- Do not implement anything not in the plan's scope.
- Do not skip verification.
- Do not skip diff review.
- If you find additional work, record it as a new task, do not fold it in.
- Record important decisions in `.agent-harness/DECISIONS.md`.
- Update docs and tests when behavior changes.

## When Things Go Wrong

- If a test fails, use the fix-test-failure prompt: fix only the failing check, do not refactor.
- If the plan is wrong, re-plan. Do not silently deviate.
- If you are uncertain about scope, ask.