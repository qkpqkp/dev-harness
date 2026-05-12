# Dev Harness Evaluation Plan

## Goal

Answer the question: **Does Dev Harness actually improve agent output quality?**

We need measurable, reproducible evidence — not intuition.

## What We Measure

Six dimensions, each with a concrete metric:

| # | Dimension | Metric | How to Collect |
|---|-----------|--------|----------------|
| 1 | **Scope Control** | Number of out-of-scope files changed | `git diff` vs plan scope |
| 2 | **Task Completion** | Binary: does the implementation pass acceptance criteria? | Manual + `devh verify` |
| 3 | **Context Efficiency** | Total agent turns / tokens to complete task | Agent session logs |
| 4 | **Session Recovery** | Can a fresh session continue from artifacts without re-explaining? | New session test |
| 5 | **Verification Coverage** | Did `devh verify` catch real problems? | false positive / negative count |
| 6 | **Review Signal** | Did `devh review` flag real issues? | false positive / negative count |

## Experimental Design

### A/B Comparison

For each benchmark task, run two variants:

- **Control (bare)**: Agent gets task description + standard AGENTS.md only. Free-form workflow.
- **Experiment (harness)**: Agent follows `devh plan → context → implement → verify → review → summarize`.

Both variants use the same agent (start with Claude Code / opencode).

### Benchmark Tasks

Five tasks, increasing difficulty, each with pre-written acceptance criteria.

#### Task 1 (L1 — Trivial): Add `devh version` command

- **Description**: Add a `version` subcommand that reads version from package.json and prints it.
- **Acceptance**: `devh version` outputs `0.1.0`. `pnpm typecheck` passes. `pnpm build` passes.
- **Scope**: 1-2 new files in `src/commands/`, 1 edit in `src/cli.ts`.
- **Why this task**: Minimal scope, easy to measure scope drift. Should be solvable in < 5 turns.

#### Task 2 (L1 — Simple): Add `--json` flag to `devh verify`

- **Description**: When `--json` is passed, `devh verify` writes results as JSON alongside the markdown.
- **Acceptance**: `devh verify --json` creates `verification.json`. `pnpm typecheck` passes.
- **Scope**: Modify `src/commands/verify.ts` and `src/mechanism/verify.ts`.
- **Why this task**: Tests whether the agent modifies only the targeted mechanism files or also touches unrelated commands.

#### Task 3 (L2 — Medium): Add `devh status` command

- **Description**: New command that shows current run lifecycle state, plan summary (first line of goal), and verification status (pass/fail/not run).
- **Acceptance**: `devh status` outputs a readable summary. Handles no-active-run case gracefully. `pnpm typecheck` passes.
- **Scope**: New file `src/commands/status.ts`, edit `src/cli.ts`, possibly extend `src/mechanism/lifecycle.ts`.
- **Why this task**: Requires understanding lifecycle state machine. Multiple files, but clear boundary.

#### Task 4 (L2 — Medium): Extend review to include diff patch stats per file

- **Description**: `devh review` should include lines added/removed per file in a table, not just the raw diff stat.
- **Acceptance**: `review.md` contains a per-file table with `file | added | removed`. `pnpm typecheck` passes.
- **Scope**: Modify `src/mechanism/review.ts` and possibly `src/mechanism/git.ts`.
- **Why this task**: Requires parsing git output. Tests whether agent adds unnecessary abstractions.

#### Task 5 (L3 — Complex): Add run archiving and `devh list-runs` command

- **Description**: After summarize, runs should be archivable. Add `devh list-runs` that shows all runs with status, date, and task. Add `devh archive <run-id>` that moves a run to `.agent-harness/archive/`.
- **Acceptance**: `devh list-runs` outputs formatted table. `devh archive <run-id>` moves run directory. `pnpm typecheck` passes. Existing workflow unaffected.
- **Scope**: New files in `src/commands/`, new mechanism functions, edit `src/cli.ts`.
- **Why this task**: Multi-file feature touching mechanism + CLI + templates. Tests scope discipline under complexity.

### Measurement Protocol

For each task × variant, record:

```
task:           T1
variant:        harness | bare
agent:          opencode / claude / codex / ...
-------------------------------------------------
completion:     yes | no | partial
turns:          N
files_changed:  [list]
scope_drift:    [files not in expected scope]
verify_passed:  yes | no
verify_issues:  [real problems caught]
review_flags:   [real issues] / [false positives]
recovery_test:  pass | fail
notes:          free text
```

### Session Recovery Test

After each task completes:

1. Start a completely new agent session.
2. Give it only: "Read the latest run artifacts. Continue where the last session left off."
3. For **harness** variant: agent should read `.agent-harness/runs/<id>/summary.md` and pick up.
4. For **bare** variant: agent has no structured artifacts to read.
5. Score: Did the new session understand prior work without human re-explanation?

## Implementation Phases

### Phase 1: Benchmark Materials (Do This First)

Create the evaluation infrastructure:

1. **Benchmark task definitions** — Write 5 task files with acceptance criteria
2. **Scoring template** — A markdown template to fill in for each run
3. **Setup script** — A script that creates a clean git branch for each task
4. **Evaluation runner guide** — Step-by-step instructions for a human to run the A/B test

Artifacts:
- `eval/tasks/T1-add-version-command.md`
- `eval/tasks/T2-add-json-flag-verify.md`
- `eval/tasks/T3-add-status-command.md`
- `eval/tasks/T4-review-per-file-stats.md`
- `eval/tasks/T5-archive-and-list-runs.md`
- `eval/scoring-template.md`
- `eval/setup-eval.ps1`
- `eval/HOW-TO-RUN.md`

### Phase 2: Manual A/B Testing

Run each task twice (bare + harness) with one agent. Fill in scoring template.

Expected output: `eval/results/T1-bare.md`, `eval/results/T1-harness.md`, etc.

### Phase 3: Analysis

Compare dimensions across bare vs harness. Write findings in `eval/analysis.md`.

Questions to answer:
- Does harness reduce scope drift?
- Does harness improve task completion rate?
- Does harness reduce turns/tokens needed?
- Does the session recovery advantage actually materialize?
- Are verify and review producing useful signal, or just noise?

### Phase 4 (Optional): Multi-Agent Testing

If Phase 3 shows promise, repeat with Codex, Cursor, Aider to test cross-agent generality.

### Phase 5 (Optional): Automation

If manual testing validates the approach, build an automated eval runner that:
- Creates clean worktrees
- Injects task + variant instructions
- Collects artifacts
- Auto-computes metrics from git diff and verification results

## Non-Goals

- Not building a benchmark framework or SaaS product.
- Not testing every possible agent — start with one, expand only if justified.
- Not measuring raw code quality (subjective) — focus on observable outcomes.
- Not automating the agent runs (manual A/B is fine for Phase 2).

## Risks

- **Sample size**: 5 tasks is small. Conclusions are directional, not statistically rigorous.
- **Observer bias**: Same person running both variants. Use objective metrics where possible.
- **Agent variance**: Same agent may perform differently on repeated runs. Record each run honestly.
- **Harness maturity**: The harness itself is v0.1. Some tasks might expose harness bugs, not agent quality issues. Record these separately.

## Validation

- Phase 1 complete when all task files and the scoring template exist.
- Phase 2 complete when all 10 result files (5 tasks × 2 variants) are filled in.
- Phase 3 complete when `eval/analysis.md` has findings for all 6 dimensions.
