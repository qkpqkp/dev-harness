# Implementation Prompt

Implement the approved plan only.

Rules:

- Use `.agent-harness/runs/<run-id>/plan.md` as the execution boundary.
- Do not expand scope without updating the plan.
- Make the smallest patch that correctly solves the task.
- Do not modify unrelated files.
- Preserve public API and CLI compatibility unless the plan explicitly changes it.
- Follow existing project style and helper APIs.
- Add or update tests when behavior changes.
- Update docs when workflow behavior changes.
- Record important durable decisions in `.agent-harness/DECISIONS.md`.

Before finishing:

- Run the validation commands from the plan or `.agent-harness/CHECKS.md`.
- Generate or update verification notes.
- Review the git diff for accidental changes.
- Summarize remaining risks.
