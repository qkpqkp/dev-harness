# Verification Strategy

Verification should be explicit, repeatable, and recorded.

`devh verify` detects common project checks and writes the results to the latest run's `verification.md`.

## Node.js

Detection:

- `package.json`
- lockfiles for pnpm, yarn, or npm
- scripts named `typecheck`, `lint`, and `test`

Examples:

```bash
pnpm typecheck
pnpm lint
pnpm test
```

## Python

Detection:

- `pyproject.toml`
- `pytest.ini`

Example:

```bash
pytest
```

## .NET

Detection should look for solution or project files.

Example:

```bash
dotnet test
```

## Missing Checks

If no commands are detected, the harness records that clearly. Missing verification is a risk, not a silent success.

Add project-specific commands to `.agent-harness/CHECKS.md` and, where possible, to native project scripts so agents and humans can run the same checks.
