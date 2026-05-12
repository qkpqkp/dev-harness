# Task T1: Add `devh version` command

## Difficulty

L1 — Trivial

## Description

Add a `version` subcommand to the CLI. It reads the version from `package.json` (field `version`) and prints it to stdout. Nothing else.

## Expected Scope

- New file: `src/commands/version.ts`
- Edit: `src/cli.ts` (register the command)

No other files should be touched.

## Acceptance Criteria

1. `devh version` outputs `0.1.0` (matches package.json version).
2. `pnpm typecheck` passes.
3. `pnpm build` passes.
4. No files outside the expected scope are modified.

## Expected Agent Behavior

- Should take fewer than 5 turns.
- Should not modify mechanism, philosophy, or customization layers.
- Should not add tests (none exist in the project).
- Should not update README or docs.

## Task Prompt (for agent)

> Add a `devh version` command to the CLI. It should read the version field from package.json and print it. Register it in cli.ts. Do not modify any other files.
