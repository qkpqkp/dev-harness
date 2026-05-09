# Fix Test Failure Prompt

Fix only the failing checks.

Workflow:

1. Read the failing command and output.
2. Identify the root cause.
3. Inspect only the relevant files.
4. Apply the smallest possible fix.
5. Re-run the relevant failing check.
6. If needed, run adjacent checks that could be affected.

Forbidden:

- Do not refactor unrelated code.
- Do not skip or weaken tests to make them pass.
- Do not change public behavior unless the failure proves it is wrong.
- Do not update snapshots blindly.

Record what failed, what changed, and what was re-run.
