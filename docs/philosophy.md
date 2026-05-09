# Foundation Harness Philosophy

Foundation Harness is the idea that AI-assisted development should be structured like disciplined engineering work, not one-off chat.

The core asset is not a clever prompt. The core asset is a workflow harness that makes useful behavior repeatable:

- Load project context deliberately.
- Decompose the task before editing.
- Constrain execution scope.
- Prefer minimal patches.
- Verify with real checks.
- Review the diff.
- Leave checkpoints for future sessions.

## Context Loading

Context should be useful, current, and small. A coding agent does not need the whole repository up front. It needs project notes, recent git state, likely files, available checks, and durable decisions.

`devh context` creates a token-efficient starting point. It summarizes metadata and points the agent toward relevant files instead of dumping source code.

## Task Decomposition

Plans make scope visible. They also make it easier to say no to nearby work.

A good plan states:

- Goal
- Scope
- Non-goals
- Affected areas
- Risks
- Validation
- Rollback
- Assumptions

## Execution Constraints

AI agents are most useful when the constraints are explicit:

- Implement the approved plan only.
- Avoid unrelated refactors.
- Preserve compatibility unless the plan says otherwise.
- Update docs and tests when behavior changes.

## Verification

The harness treats verification as a required artifact, not an afterthought. A failed check is useful information. A missing check is also useful information and should be recorded.

## Review

Diff review catches hidden behavior changes, missing tests, and scope drift. The default review mode is diff-only because broad reviews waste context and encourage unrelated changes.

## Checkpoints

Run artifacts make work resumable:

- `task.md`
- `plan.md`
- `context.md`
- `verification.md`
- `review.md`
- `summary.md`

These files reduce repeated explanation cost across Codex, Claude Code, Cursor, Aider, and future tools.
