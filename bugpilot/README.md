# BugPilot (v0.1)

BugPilot is a lightweight AI-powered DevOps helper.

## What it does

1. Receives production errors from a Sentry webhook.
2. Normalizes payloads into a standard error schema.
3. Applies deterministic orchestration rules (no AI in pipeline logic).
4. Runs an AI coding agent through CLI (Claude + MCP for Sentry/GitHub).

## Tech stack

- Python 3.11+
- FastAPI
- SQLite (`sqlite3`)
- PyYAML
- `subprocess` for Claude CLI execution

## Run locally

1. Install dependencies:

```bash
pip install fastapi uvicorn pyyaml
```

2. Start server from repository root:

```bash
uvicorn bugpilot.main:app --reload
```

The first run creates `bugpilot/db.sqlite` automatically.

## Test with curl

```bash
curl -X POST http://127.0.0.1:8000/webhook/sentry \
  -H "Content-Type: application/json" \
  -d '{
    "issue_id": "SENTRY-101",
    "title": "TypeError in checkout",
    "error_message": "NoneType is not subscriptable",
    "stack_trace": "File \"checkout.py\", line 18, in create_order",
    "environment": "production"
  }'
```

## Example webhook payload

```json
{
  "issue_id": "SENTRY-101",
  "title": "TypeError in checkout",
  "error_message": "NoneType is not subscriptable",
  "stack_trace": "File \"checkout.py\", line 18, in create_order",
  "environment": "production",
  "frequency": 3
}
```

## Pipeline flow

`/webhook/sentry` -> normalize -> orchestrate -> `fix | issue_only | ignore`

When action is `fix`, BugPilot calls:

```bash
claude --mcp sentry --mcp github -p "<rendered prompt>"
```
