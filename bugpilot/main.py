from __future__ import annotations

from pathlib import Path

from fastapi import FastAPI

from bugpilot.core.orchestrator import Orchestrator
from bugpilot.ingestion.sentry_webhook import router as sentry_router
from bugpilot.ingestion.sentry_webhook import set_processor
from bugpilot.runners.claude_runner import run_fix_agent

BASE_DIR = Path(__file__).resolve().parent

app = FastAPI(title="BugPilot", version="0.1.0")
app.include_router(sentry_router)

orchestrator = Orchestrator(
    db_path=str(BASE_DIR / "db.sqlite"),
    config_path=str(BASE_DIR / "config.yaml"),
)


def process_error(error: dict) -> dict:
    decision = orchestrator.decide(error)
    if decision["action"] == "fix":
        config = orchestrator.load_config()
        run_fix_agent(error, config)
    return {"error": error, "decision": decision}


set_processor(process_error)
