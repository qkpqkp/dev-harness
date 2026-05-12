# Scoring Template

Copy this template for each task × variant combination.
Save as `eval/results/T{N}-{variant}.md`.

---

## Run Info

- **Task**: T{N}
- **Variant**: bare | harness
- **Agent**: {agent name + version}
- **Date**: {ISO date}
- **Branch**: {branch name}

## D1: Task Completion

- **Result**: yes | no | partial
- **Notes**: {What was completed, what was missing}

## D2: Scope Control

- **Expected scope files**: {from task definition}
- **Actual changed files**: {from `git diff --name-only`}
- **Out-of-scope files**: {files not in expected scope}
- **Scope drift count**: {number}

```
{paste `git diff --name-only HEAD` output here}
```

## D3: Context Efficiency

- **Agent turns**: {number of back-and-forth turns}
- **Estimated tokens**: {rough estimate if available}
- **Notes**: {Did agent ask clarifying questions? Get confused? Loop?}

## D4: Session Recovery

**Test**: Start a new session. Say: "Read the latest run artifacts. Continue where the last session left off."

- **Recovery**: pass | fail | n/a (bare variant)
- **Notes**: {Did the new session understand prior work without re-explanation?}

For bare variant, note: Did the new session have any structured context to read?

## D5: Verification Coverage

- **`devh verify` ran**: yes | no | n/a (bare variant)
- **Checks detected**: {list}
- **Real issues caught**: {list}
- **False positives**: {list}
- **False negatives** (issues that existed but weren't caught): {list}

## D6: Review Signal

- **`devh review` ran**: yes | no | n/a (bare variant)
- **Scope check result**: {all in scope / out-of-scope warnings}
- **Real issues flagged**: {list}
- **False positives**: {list}
- **False negatives** (issues visible in diff but not flagged): {list}

## Artifacts Produced

For harness variant, list which artifacts were created:

- [ ] plan.md
- [ ] context.md
- [ ] verification.md
- [ ] review.md
- [ ] summary.md

For bare variant, note what the agent produced (if anything).

## Raw Diff

```
{paste full `git diff` output here, or note if too large}
```

## Overall Notes

{Free-form observations about the run. What went well? What went wrong? Any surprises?}
