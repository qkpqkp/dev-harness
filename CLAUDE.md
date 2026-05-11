# Claude Code Instructions

This project uses Dev Harness for AI-assisted development workflow.

## Dev Harness Workflow

Read `.agent-harness/philosophy.md` for the full set of principles. Key points:

1. **Plan before you edit.** Create or read the plan in `.agent-harness/runs/<current>/plan.md` before making changes.
2. **Context first.** Run `devh context` and read the output before touching files.
3. **Scope is a contract.** Only implement what is in the plan scope. If you find more work, record it as a new task — do not fold it in.
4. **Verify after changes.** Run `devh verify` and address any failures before proceeding.
5. **Review the diff.** Run `devh review` and check for out-of-scope changes.
6. **Record decisions in** `.agent-harness/DECISIONS.md`.

## Hard Rules

- Do not implement anything outside the plan scope.
- Do not skip verification.
- Do not skip diff review.
- If scope is unclear, ask before proceeding.
- Update docs and tests when behavior changes.

## Quick Reference

```
devh init-project          # Set up .agent-harness/ directory
devh plan "task"           # Create a run and plan.md
devh context               # Collect git, structure, and harness context
devh verify                # Run checks (auto-detected + CHECKS.md)
devh review                # Diff review with scope comparison
devh summarize             # Close run, generate summary
```
