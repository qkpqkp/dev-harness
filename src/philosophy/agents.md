# Agent Instructions

This project uses Dev Harness for AI-assisted development workflow.

## Before You Start

1. Read `.agent-harness/philosophy.md` for workflow principles.
2. Read `.agent-harness/PROJECT.md` for project context.
3. Read `.agent-harness/CHECKS.md` for verification commands.
4. Read `.agent-harness/DECISIONS.md` for recorded decisions.
5. Check `.agent-harness/current-run` for an active run. If one exists, read its `plan.md` first.

## Agent Rules

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

## When Things Go Wrong

- If a test fails, use the fix-test-failure prompt: fix only the failing check, do not refactor.
- If the plan is wrong, re-plan. Do not silently deviate.
- If you are uncertain about scope, ask.
- If the same fix attempt fails three times, stop trying. Skip the blocked step, continue the rest of the plan, and report the unresolved failure in the summary. Do not burn tokens on repeated identical attempts.
