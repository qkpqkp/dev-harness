# Task T2: Add `--json` flag to `devh verify`

## Difficulty

L1 — Simple

## Description

When `--json` is passed, `devh verify` should write a `verification.json` file alongside the existing `verification.md`. The JSON file should contain a structured object with the same information: summary (status, checks detected, passed, failed) and results array (check name, command, exit code, timed out, output).

## Expected Scope

- Edit: `src/commands/verify.ts` (parse `--json` flag)
- Edit: `src/mechanism/verify.ts` (add JSON output)

No other files should be touched.

## Acceptance Criteria

1. `devh verify --json` creates `verification.json` in the run directory.
2. `devh verify` (without flag) works exactly as before, no JSON file created.
3. The JSON file is valid JSON and contains summary + results.
4. `pnpm typecheck` passes.
5. No files outside the expected scope are modified.

## Expected Agent Behavior

- Should not add new dependencies.
- Should not refactor the existing verify logic beyond what is needed.
- Should not modify other commands.

## Task Prompt (for agent)

> Add a `--json` flag to `devh verify`. When passed, write a `verification.json` file in the run directory with structured results (summary object + results array). Do not change the default behavior when the flag is not passed. Do not modify any other commands or files.
