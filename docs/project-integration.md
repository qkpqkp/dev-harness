# Project Integration

Use Dev Harness inside a project by creating a local `.agent-harness/` directory.

```bash
devh init-project
```

This creates:

```text
.agent-harness/
  PROJECT.md
  CHECKS.md
  DECISIONS.md
  RUNS.md
```

## PROJECT.md

Use this for stable project context:

- What the project does
- Architecture boundaries
- Important paths
- Local setup notes
- Domain language
- AI collaboration notes

## CHECKS.md

Use this for verification commands and caveats:

- Required fast checks
- Optional slow checks
- Environment-dependent checks
- Known flaky checks

## DECISIONS.md

Use this for durable decisions that should survive across sessions:

- Architecture decisions
- CLI behavior decisions
- Test strategy choices
- Compatibility constraints

## RUNS.md

The CLI appends workflow runs here. Each run has its own folder:

```text
.agent-harness/runs/YYYYMMDD-HHMMSS-slug/
  task.md
  plan.md
  context.md
  verification.md
  review.md
  summary.md
```

## AGENTS.md

Add a repo-level `AGENTS.md` so tools like Codex can load persistent instructions. It should point agents at the current run plan and explain local engineering rules.
