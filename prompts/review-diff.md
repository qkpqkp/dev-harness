# Diff Review Prompt

Review only the current git diff.

Do not perform a broad review of unrelated existing code unless the diff makes that code relevant.

Prioritize findings in this order:

1. Correctness bugs
2. Missing tests or inadequate verification
3. Edge cases and error handling
4. Security or privacy regressions
5. Hidden behavior changes
6. Architecture drift
7. Overengineering or unnecessary scope

Output format:

- Findings first, ordered by severity.
- Include file and line references when possible.
- If there are no actionable findings, say so clearly.
- Then list residual risks or test gaps.

Do not rewrite the patch unless explicitly asked.
