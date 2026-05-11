# Sentry Workflow

Sentry-driven fixes are a future workflow, not the whole product.

The original BugPilot prototype explored:

```text
Sentry
-> error parsing
-> context discovery
-> AI fix
-> verification
-> PR
```

In Dev Harness, this becomes a structured workflow that can be used by an agent without becoming a heavy automation platform.

## v0 Boundary

v0 does not call the Sentry API and does not create PRs automatically.

It provides:

- `prompts/sentry-fix.md`
- `workflows/sentry-fix.yaml`
- Run artifacts for context, verification, review, and summary

## Future Shape

A future `sentry-fix` command could:

1. Accept an error report JSON file or pasted text.
2. Extract stack trace frames.
3. Guess relevant files.
4. Create a run folder.
5. Write a reproduction checklist.
6. Ask the human or coding agent to approve the plan.
7. Verify the final patch.
8. Prepare PR summary text.

## Constraints

- Require human review for production fixes.
- Prefer regression tests.
- Keep patches local to the root cause.
- Do not hide risky automation behind webhook side effects.
