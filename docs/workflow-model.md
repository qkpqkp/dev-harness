# Workflow Model

The standard loop is:

```text
task
-> plan
-> context
-> implement
-> verify
-> review
-> fix
-> summarize
```

## Task

Capture the user request as a durable artifact. The task file should be short and literal.

## Plan

Create an execution boundary before editing. Complex tasks should not proceed until the plan is reviewed or at least made explicit.

## Context

Collect only the context needed to start:

- Git branch and status
- Recent commits
- Structure summary
- Related file guesses
- Package scripts
- Harness project notes
- Existing checks and decisions

## Implement

Implementation happens outside v0 of the CLI, usually in Codex, Claude Code, Cursor, Aider, or another coding agent. The agent should use `plan.md` and `context.md` as its starting boundary.

## Verify

Run detected checks and write `verification.md`. Passing checks are evidence. Failed or missing checks are recorded as risk.

## Review

Generate `review.md` from the current git diff. Use it directly or give it to an AI reviewer with `prompts/review-diff.md`.

## Fix

If checks or review fail, use `prompts/fix-test-failure.md` or a narrow follow-up plan. The fix should target the failing condition, not broaden the original task.

## Summarize

Create `summary.md` with changed files, verification status, remaining risks, and suggested commit/PR text.
