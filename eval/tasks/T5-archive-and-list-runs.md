# Task T5: Run archiving and `devh list-runs` command

## Difficulty

L3 — Complex

## Description

Add two new features:

1. `devh list-runs` — prints a table of all runs in `.agent-harness/runs/`. Each row shows: run ID, status, date (parsed from ID), and task description (first line of task.md).

2. `devh archive <run-id>` — moves a summarized run from `.agent-harness/runs/` to `.agent-harness/archive/`. Only summarized runs can be archived. Attempting to archive a non-summarized run should print a warning and exit.

## Expected Scope

- New file: `src/commands/list-runs.ts`
- New file: `src/commands/archive.ts`
- Edit: `src/cli.ts` (register both commands)
- Possibly extend: `src/mechanism/lifecycle.ts` (list runs, archive helpers)

No other files should be touched.

## Acceptance Criteria

1. `devh list-runs` outputs a formatted table with run ID, status, date, task.
2. `devh list-runs` handles the case where no runs exist.
3. `devh archive <run-id>` moves the run directory to `.agent-harness/archive/`.
4. `devh archive <run-id>` refuses to archive non-summarized runs with a clear message.
5. `devh archive <run-id>` handles non-existent run IDs gracefully.
6. Existing commands (`plan`, `verify`, `review`, `summarize`) still work.
7. `pnpm typecheck` passes.
8. `pnpm build` passes.
9. No files outside the expected scope are modified.

## Expected Agent Behavior

- Should reuse `listDirs`, `getRunStatus`, `readTextIfExists` from existing mechanism.
- Should not create a database or indexing system.
- Should not modify existing commands or their behavior.
- Should keep the archive logic simple — just a directory move.

## Task Prompt (for agent)

> Add `devh list-runs` that shows all runs with ID, status, date, and task in a table. Add `devh archive <run-id>` that moves a summarized run to `.agent-harness/archive/` and refuses non-summarized runs. Register both in cli.ts. Reuse existing mechanism functions. Do not modify existing commands or other files.
