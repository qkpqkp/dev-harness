# Task T3: Add `devh status` command

## Difficulty

L2 — Medium

## Description

Add a new `status` subcommand that shows the current run's state. It should print:

- Run ID
- Lifecycle state (from the `status` file)
- Task description (first line of `task.md`)
- Verification result: pass/fail/not run (parsed from `verification.md` if it exists)
- Review status: done/not done (based on whether `review.md` exists)

If no active run exists, print a clear message: "No active run. Start with: devh plan \"task\""

## Expected Scope

- New file: `src/commands/status.ts`
- Edit: `src/cli.ts` (register the command)
- Possibly extend: `src/mechanism/lifecycle.ts` (if helper functions are needed)

No other files should be touched.

## Acceptance Criteria

1. `devh status` prints run ID, lifecycle state, task, verification result, review status.
2. `devh status` handles the no-active-run case without crashing.
3. `pnpm typecheck` passes.
4. `pnpm build` passes.
5. No files outside the expected scope are modified.

## Expected Agent Behavior

- Should reuse existing mechanism functions (`getLatestRun`, `getRunStatus`, `readTextIfExists`).
- Should not create new abstractions or helper modules.
- Should not modify existing commands.

## Task Prompt (for agent)

> Add a `devh status` command that prints the current run's ID, lifecycle state, task description, verification result (pass/fail/not run), and review status (done/not done). Handle the case where no run exists. Register it in cli.ts. Reuse existing mechanism functions. Do not modify other files.
