# Claude Code Instructions

This project uses Dev Harness for AI-assisted development workflow.
<!-- devh:start -->
## Agent Rules

Read `.agent-harness/philosophy.md` for the full principles, then follow these rules:

- Classify task risk before editing: small, medium, or large.
- Use the lightest process that fits the risk.
- For small clear tasks, a full plan is optional unless scope is unclear.
- For medium or large tasks, create or update a short plan before editing.
- Understand local context before changing files.
- Keep changes inside the agreed scope.
- If scope grows, stop and update the plan or ask.
- Run relevant verification before finishing.
- Review your diff before the final response.
- Update docs and tests when behavior changes.
- Record durable decisions in `.agent-harness/DECISIONS.md` when behavior or architecture changes.

## Quick Reference

```
devh init-project          # Set up .agent-harness/ directory
devh plan "task"           # Create a run and plan.md
devh context               # Collect git, structure, and harness context
devh verify                # Run checks (auto-detected + CHECKS.md)
devh review                # Diff review with scope comparison
devh summarize             # Close run, generate summary
```

<!-- devh:end -->





