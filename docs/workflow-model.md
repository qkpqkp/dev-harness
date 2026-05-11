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

Each step creates or updates an artifact in `.agent-harness/runs/<run-id>/`.

## Lifecycle States

Each run has a `status` file that tracks progress:

- `planned` — plan created, not yet implemented
- `in_progress` — context loaded, implementation started
- `reviewed` — diff reviewed with scope comparison
- `summarized` — run complete

## Task

Capture the user request as a durable artifact. The task file should be short and literal.

## Plan

Create an execution boundary before editing. Complex tasks should not proceed until the plan is reviewed or at least made explicit.

The harness warns if scope or non-goals sections are empty, but does not block. The real enforcement comes from agents reading the philosophy document.

## Context

Collect only the context needed to start:

- Git branch and status
- Recent commits
- Structure summary
- Related file guesses (keyword-based search)
- Package scripts
- Harness project notes
- Existing checks and decisions

## Implement

Implementation happens outside v0 of the CLI, usually in Codex, Claude Code, Cursor, Aider, or another coding agent. The agent should use `plan.md` and `context.md` as its starting boundary.

## Verify

Run detected checks and write `verification.md`. Passing checks are evidence. Failed or missing checks are recorded as risk.

Detection includes:
- Package.json scripts: typecheck, lint, test
- Python: pytest (if pyproject.toml or pytest.ini found)
- .NET: dotnet test (if .sln or .csproj found)
- CHECKS.md: custom commands listed under "Required" section

## Review

Generate `review.md` from the current git diff. Includes:

- Changed files list
- Scope comparison against plan.md (flags out-of-scope changes)
- Diff summary
- Review checklist
- AI reviewer prompt

## Fix

If checks or review fail, use `prompts/fix-test-failure.md` or a narrow follow-up plan. The fix should target the failing condition, not broaden the original task.

## Summarize

Create `summary.md` with changed files, verification status, remaining risks, and suggested commit/PR text.