# Foundation Harness Philosophy

Foundation Harness is the idea that AI-assisted development should be structured like disciplined engineering work, not one-off chat.

The core asset is not a clever prompt. The core asset is a workflow harness that makes useful behavior repeatable.

## Three-Layer Architecture

### Layer 1: Philosophy (Immutable)

The principles are embedded in the codebase and copied into `.agent-harness/philosophy.md` at init time. They are not meant to be edited by users. They define the invariant rules of the workflow.

### Layer 2: Mechanism (The Engine)

The mechanism implements the philosophy through CLI commands and file artifacts. It creates runs, collects context, runs verification, compares scope, and writes summaries. It uses soft enforcement — warnings, not blocks.

### Layer 3: Customization (User Control)

Users fill in PROJECT.md, CHECKS.md, and DECISIONS.md. These are their preferences and project-specific data. The mechanism reads them but doesn't enforce their format.

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

CHECKS.md lets users add project-specific commands that `devh verify` will run alongside auto-detected ones.

## Review

Diff review catches hidden behavior changes, missing tests, and scope drift. The default review includes scope comparison — changed files are checked against the plan's scope section and flagged if they fall outside it.

## Checkpoints

Run artifacts make work resumable:

- `task.md`
- `plan.md`
- `context.md`
- `verification.md`
- `review.md`
- `summary.md`

A `status` file tracks the run lifecycle: planned → in_progress → reviewed → summarized.

These files reduce repeated explanation cost across Codex, Claude Code, Cursor, Aider, and future tools.