# Scoring: T2 — Harness Variant

## Run Info

- **Task**: T2
- **Variant**: harness
- **Agent**: opencode (glm-5.1), following devh workflow
- **Date**: 2026-05-12
- **Branch**: eval/T2-harness

## D1: Task Completion

- **Result**: yes
- **Notes**: Identical implementation to bare variant. All acceptance criteria met.

## D2: Scope Control

- **Expected scope files**: `src/mechanism/verify.ts`, `src/commands/verify.ts`
- **Actual changed files**: `src/mechanism/verify.ts`, `src/commands/verify.ts`
- **Out-of-scope files**: none
- **Scope drift count**: 0

```
src/commands/verify.ts
src/mechanism/verify.ts
```

## D3: Context Efficiency

- **Agent turns**: 7
  - Turn 1: `devh plan`
  - Turn 2: Fill in plan.md
  - Turn 3: `devh context`
  - Turn 4: Implement (edit verify.ts x2, edit commands/verify.ts)
  - Turn 5: Build + `devh verify -- --json`
  - Turn 6: `devh review`
  - Turn 7: `devh summarize`
- **Estimated tokens**: ~6000
- **Notes**: 7x more turns than bare (7 vs 1). Again, most turns are harness ceremony. Implementation was identical to bare variant.

## D4: Session Recovery

- **Recovery**: pass
- **Notes**: Full artifact chain available: plan.md with explicit scope/non-goals, context.md with project structure, verification.md + verification.json with check results, review.md confirming all in scope, summary.md.

## D5: Verification Coverage

- **`devh verify` ran**: yes
- **Checks detected**: `pnpm typecheck`, `pnpm build`
- **Real issues caught**: 0
- **False positives**: 0
- **False negatives**: 0

## D6: Review Signal

- **`devh review` ran**: yes
- **Scope check result**: "All changed files are within the plan scope." — correct after bug fix
- **Real issues flagged**: 0
- **False positives**: 0 (bug fix from T1 eval worked!)
- **False negatives**: 0

## Artifacts Produced

- [x] plan.md
- [x] context.md
- [x] verification.md
- [x] verification.json (new artifact from the feature itself)
- [x] review.md — correct scope check this time
- [x] summary.md

## Overall Notes

- Same correct implementation as bare variant.
- Bug fix from T1 eval immediately paid off — review produced correct scope check with zero false positives.
- **7x turn overhead** (7 vs 1) for the same task. The harness adds no implementation value for well-scoped, simple tasks where the agent already has full context.
- **Key observation**: The harness value is cumulative — the plan.md forced scope articulation, and the review caught scope violations (or confirmed no violations). For T1, it caught a real bug. For T2, it confirmed correctness. Both are useful signals.
- The session recovery advantage remains the clearest differentiator.
