# Scoring: T1 — Bare Variant

## Run Info

- **Task**: T1
- **Variant**: bare
- **Agent**: opencode (glm-5.1), simulated bare workflow
- **Date**: 2026-05-11
- **Branch**: eval/T1-bare

## D1: Task Completion

- **Result**: yes
- **Notes**: `devh version` outputs `0.1.0`. typecheck passes. build passes.

## D2: Scope Control

- **Expected scope files**: `src/commands/version.ts` (new), `src/cli.ts` (edit)
- **Actual changed files**: `src/cli.ts` (modified), `src/commands/version.ts` (new, untracked)
- **Out-of-scope files**: none
- **Scope drift count**: 0

```
src/cli.ts
```

(Untracked: `src/commands/version.ts`)

## D3: Context Efficiency

- **Agent turns**: 2
  - Turn 1: Read cli.ts, created version.ts, edited cli.ts
  - Turn 2: Fixed path resolution (used cwd instead of __dirname), rebuilt, verified
- **Estimated tokens**: ~3000 (two read + two write + two build cycles)
- **Notes**: First attempt used `import.meta.url` / `__dirname` approach which failed at runtime because dist/ doesn't contain package.json. Self-corrected in turn 2.

## D4: Session Recovery

**Test**: Start a new session. Say: "Continue working on the last task."

- **Recovery**: n/a (bare variant — no structured artifacts)
- **Notes**: A new session would have no context. Would need git log / diff to reconstruct what was done.

## D5: Verification Coverage

- **`devh verify` ran**: no (bare variant)
- **Checks detected**: n/a
- **Real issues caught**: n/a
- **False positives**: n/a
- **False negatives**: The runtime path bug (dist/ has no package.json) was caught manually, not by automated verification.

## D6: Review Signal

- **`devh review` ran**: no (bare variant)
- **Scope check result**: n/a
- **Real issues flagged**: n/a
- **False positives**: n/a
- **False negatives**: n/a

## Artifacts Produced

None. Bare variant produces no structured artifacts.

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
 
 function logError(message: string): void {
```

New file: `src/commands/version.ts`

```typescript
import fs from "node:fs";
import path from "node:path";

export async function commandVersion(): Promise<void> {
  const pkgPath = path.resolve(process.cwd(), "package.json");
  const raw = fs.readFileSync(pkgPath, "utf-8");
  const pkg = JSON.parse(raw);
  console.log(pkg.version);
}
```

## Overall Notes

- Task completed correctly in 2 turns.
- One bug (path resolution) caught and fixed manually. In a harness workflow, `devh verify` wouldn't have caught this either since it only runs typecheck, not runtime tests.
- Zero scope drift.
- No structured artifacts left for future sessions.
- The bare variant was efficient for this trivial task. Harness overhead would likely exceed the benefit for L1 tasks.
