# How to Run the Dev Harness Evaluation

## Prerequisites

- Dev Harness built and linked (`pnpm build && pnpm link --global`)
- The agent you want to test (e.g., opencode, Claude Code, Codex CLI)
- A clean working tree on `main` branch

## Overview

5 tasks, 2 variants each, 10 total runs.

| Task | Difficulty | Description |
|------|-----------|-------------|
| T1 | L1 Trivial | Add `devh version` command |
| T2 | L1 Simple | Add `--json` flag to `devh verify` |
| T3 | L2 Medium | Add `devh status` command |
| T4 | L2 Medium | Per-file stats in `devh review` |
| T5 | L3 Complex | Run archiving + `devh list-runs` |

Each task has two variants:

- **bare**: Agent gets the task prompt + AGENTS.md only. Free-form workflow.
- **harness**: Agent follows `devh plan → context → implement → verify → review → summarize`.

## Step-by-Step

### 1. Set up a run

```powershell
# From repo root
.\eval\setup-eval.ps1 -Task 1 -Variant bare
```

This creates a branch `eval/T1-bare` and prints the task prompt and instructions.

### 2. Run the agent

For **bare** variant:
- Open your agent in the repo.
- Give it only the task prompt printed by setup.
- Do NOT run any `devh` commands.
- Let the agent work freely.

For **harness** variant:
- Open your agent in the repo.
- Give it the task prompt AND tell it to follow the devh workflow.
- The agent should run `devh plan`, `devh context`, implement, `devh verify`, `devh review`, `devh summarize`.

### 3. Fill in the scoring template

```powershell
# Copy the template
Copy-Item eval\scoring-template.md eval\results\T1-bare.md
```

Fill in every section:
- Record git diff output.
- Count agent turns.
- Run the session recovery test.
- For harness variant, check artifact quality.

### 4. Commit results

```powershell
git add eval\results\T1-bare.md
git commit -m "eval: T1-bare results"
```

### 5. Return to main

```powershell
git checkout main
```

### 6. Repeat

Run the same task with the other variant, then move to the next task.

Recommended order:

1. T1 bare → T1 harness
2. T2 bare → T2 harness
3. T3 bare → T3 harness
4. T4 bare → T4 harness
5. T5 bare → T5 harness

## Session Recovery Test

After each task, before committing results:

1. Start a **new** agent session (fresh context).
2. For **harness** variant: "Read the latest run artifacts in `.agent-harness/runs/`. Continue where the last session left off."
3. For **bare** variant: "Continue working on the last task you were doing."
4. Record whether the new session understood the prior work.

## Analysis

After all 10 runs are complete, compare results across all 6 dimensions:

1. **Task Completion** — did harness variant complete more tasks?
2. **Scope Control** — did harness variant have fewer out-of-scope changes?
3. **Context Efficiency** — did harness variant use fewer turns/tokens?
4. **Session Recovery** — did harness artifacts help the new session?
5. **Verification Coverage** — did `devh verify` catch real issues?
6. **Review Signal** — did `devh review` flag real problems?

Write findings in `eval/analysis.md`.

## Tips

- Run tasks in order of difficulty. Stop early if results are clearly one-sided.
- Be honest. Record what actually happened, not what you expected.
- If the agent fails on a bare variant, that's a data point — don't retry to get a "better" result.
- If the harness itself has bugs during testing, record them separately in `eval/harness-bugs.md`.
- Keep each run isolated on its own branch so they don't interfere.
