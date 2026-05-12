# Scoring: T1 — Harness Variant

## Run Info

- **Task**: T1
- **Variant**: harness
- **Agent**: opencode (glm-5.1), following devh workflow
- **Date**: 2026-05-11
- **Branch**: eval/T1-harness

## D1: Task Completion

- **Result**: yes
- **Notes**: `devh version` outputs `0.1.0`. typecheck passes. build passes.

## D2: Scope Control

- **Expected scope files**: `src/commands/version.ts` (new), `src/cli.ts` (edit)
- **Actual changed files**: `src/cli.ts` (modified), `src/commands/version.ts` (new, untracked), `.agent-harness/RUNS.md` (harness artifact)
- **Out-of-scope files**: `.agent-harness/RUNS.md` (expected — harness side effect)
- **Scope drift count**: 0 (`.agent-harness/RUNS.md` is harness infrastructure, not code drift)

```
.agent-harness/RUNS.md
src/cli.ts
```

(Untracked: `src/commands/version.ts`)

## D3: Context Efficiency

- **Agent turns**: 7
  - Turn 1: `devh plan`
  - Turn 2: Fill in plan.md (scope, non-goals, steps)
  - Turn 3: `devh context`
  - Turn 4: Implement (create version.ts, edit cli.ts)
  - Turn 5: `devh verify`
  - Turn 6: `devh review`
  - Turn 7: `devh summarize`
- **Estimated tokens**: ~6000 (7 turns, more reads/writes than bare)
- **Notes**: 3.5x more turns than bare variant (7 vs 2). Most turns are harness ceremony, not productive work. The plan filling step (Turn 2) was the most valuable — forced explicit scope and risk thinking.

## D4: Session Recovery

**Test**: Start a new session. Say: "Read the latest run artifacts. Continue where the last session left off."

- **Recovery**: pass
- **Notes**: A new session can read:
  - `plan.md` — full scope, non-goals, steps, risks
  - `context.md` — git state, project structure, related files
  - `verification.md` — check results
  - `review.md` — diff analysis, scope check
  - `summary.md` — final status, changed files
  All structured and readable without human explanation.

## D5: Verification Coverage

- **`devh verify` ran**: yes
- **Checks detected**: `pnpm typecheck`, `pnpm build`
- **Real issues caught**: 0 (none existed)
- **False positives**: 0
- **False negatives**: 0

Verification ran automatically and passed. For this trivial task, no issues were present to catch.

## D6: Review Signal

- **`devh review` ran**: yes
- **Scope check result**: flagged `src/cli.ts` and `.agent-harness/RUNS.md` as out-of-scope
- **Real issues flagged**: 0
- **False positives**: 2 — `src/cli.ts` was explicitly in plan scope (under "Affected Files" section, written as `` `src/cli.ts` `` with backticks). The scope matcher uses regex on the raw scope text, and backtick-wrapped paths don't match plain filenames.
- **False negatives**: 0

**This is a harness bug**: scope items written with backtick formatting (`` `src/cli.ts` ``) don't match actual filenames. The `extractFilePatterns` function regex-escapes the entire string including backticks.

## Artifacts Produced

- [x] plan.md — filled with scope, non-goals, steps, risks, validation, rollback
- [x] context.md — git state, project structure, related files, harness notes
- [x] verification.md — typecheck + build passed
- [x] review.md — diff summary + scope check (with false positive)
- [x] summary.md — changed files, verification status, commit message

## Raw Diff

```diff
diff --git a/src/cli.ts b/src/cli.ts
index 9fe9d52..ea2741d 100644
--- a/src/cli.ts
+++ b/src/cli.ts
@@ -5,6 +5,7 @@ import { commandContext } from "./commands/context.js";
 import { commandVerify } from "./commands/verify.js";
 import { commandReview } from "./commands/review.js";
 import { commandSummarize } from "./commands/summarize.js";
+import { commandVersion } from "./commands/version.js";
 import { logInfo, logWarn } from "./mechanism/logger.js";
 
 type CommandHandler = (args: string[]) => Promise<void>;
@@ -16,6 +17,7 @@ const commands: Record<string, CommandHandler> = {
   verify: commandVerify,
   review: commandReview,
   summarize: commandSummarize,
+  version: commandVersion,
 };
```

New file: `src/commands/version.ts` (identical to bare variant)

## Overall Notes

- Same correct implementation as bare variant.
- **3.5x more turns** (7 vs 2) due to harness ceremony steps.
- **Plan filling was the most valuable step** — forced thinking about scope, non-goals, and risks before coding. This is where harness discipline adds value.
- **Session recovery is the clearest win** — structured artifacts vs nothing.
- **Harness bug discovered**: scope matching doesn't handle backtick-formatted file paths. This is a real bug worth fixing.
- **False positive in review**: The scope check flagged `src/cli.ts` as out-of-scope even though it was explicitly listed in the plan. This reduces trust in the review signal.
- For L1 trivial tasks, harness overhead is high relative to task complexity. The value proposition strengthens as tasks get harder.
