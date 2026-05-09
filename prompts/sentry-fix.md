# Sentry Fix Prompt

Use this workflow for production error reports.

```text
error report
-> stack trace extraction
-> relevant file discovery
-> reproduction attempt
-> regression test
-> minimal patch
-> verification
-> PR summary
```

Inputs:

- Error title and message
- Stack trace
- Environment
- Frequency or impact if available
- Recent release or commit if available

Rules:

- Start with the stack trace and suspected owning files.
- Try to reproduce before patching.
- Add a regression test when practical.
- Keep the patch minimal and local to the root cause.
- Run the narrowest relevant check first, then broader checks if the change passes.
- Do not modify unrelated error handling, logging, or architecture.

Output:

- Root cause
- Files changed
- Regression coverage
- Verification results
- Residual production risk
- Suggested PR summary
