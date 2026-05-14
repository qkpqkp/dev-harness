# Task T4: Per-file patch stats in `devh review`

## Difficulty

L2 — Medium

## Description

Extend `devh review` to include a per-file table showing lines added and removed. Currently the review shows a raw diff stat block. Add a structured table like:

```
| File | Added | Removed |
|------|-------|---------|
| src/cli.ts | 12 | 3 |
| src/mechanism/review.ts | 8 | 1 |
```

Parse this from `git diff --numstat HEAD`, which outputs `added\tremoved\tfilename`.

## Expected Scope

- Edit: `src/mechanism/review.ts` (add table generation)
- Possibly edit: `src/mechanism/git.ts` (add `getNumstat` helper if the agent chooses to separate concerns)

No other files should be touched.

## Acceptance Criteria

1. `review.md` contains a per-file table with file, added, removed columns.
2. Binary files show `-` for added/removed (this is what git numstat outputs).
3. When no diff exists, the table is empty or omitted with a note.
4. `pnpm typecheck` passes.
5. No files outside the expected scope are modified.

## Expected Agent Behavior

- Should not change the existing diff stat section — just add the table alongside it.
- Should not over-abstract. A simple loop over numstat output is sufficient.
- Should not modify unrelated commands or mechanism files.

## Task Prompt (for agent)

> Extend `devh review` to include a per-file table showing lines added and removed. Use `git diff --numstat HEAD` to get the data. Add the table to review.md alongside the existing diff summary. Do not remove the existing diff stat section. Do not modify other files.
