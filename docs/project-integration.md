# Project Integration

Use Dev Harness inside a project by creating a local `.agent-harness/` directory.

```bash
devh init-project
```

This creates:

```text
.agent-harness/
  philosophy.md    <- Immutable principles (copied from Layer 1, do not edit)
  PROJECT.md       <- Project context and architecture (edit this)
  CHECKS.md        <- Verification commands and prohibitions (edit this)
  DECISIONS.md     <- Durable cross-session decisions (edit this)
  RUNS.md           <- Run index (auto-populated)
  current-run       <- Points to the latest run ID
```

It also suggests content for `AGENTS.md` if one does not exist.

## Three-Layer Guarantee

- **philosophy.md** is copied from the harness's embedded principles. It is meant to be read by agents, not edited by users. Re-running `devh init-project` will recreate it if deleted.
- **PROJECT.md, CHECKS.md, DECISIONS.md** are user-owned. The harness creates them from templates but expects users to fill them in.
- The mechanism layer reads these files but doesn't enforce their format beyond checking if sections exist.

## PROJECT.md

Use this for stable project context:

- What the project does
- Architecture boundaries
- Important paths
- Local setup notes
- Domain language
- AI collaboration notes

## CHECKS.md

Use this for verification commands and prohibitions:

- Required fast checks (commands under `## Required`)
- Optional slow checks
- Prohibitions: files, directories, or patterns agents must not modify

Commands listed under `## Required` are picked up by `devh verify` and run alongside auto-detected checks.

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
  status
```

## AGENTS.md

Add a repo-level `AGENTS.md` so tools like Codex can load persistent instructions. It should point agents at the current run plan and explain local engineering rules.

`devh init-project` will suggest content for AGENTS.md if it does not exist.