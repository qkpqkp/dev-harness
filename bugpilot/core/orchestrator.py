from __future__ import annotations

import sqlite3
from pathlib import Path

import yaml


class Orchestrator:
    def __init__(self, db_path: str = "db.sqlite", config_path: str = "config.yaml") -> None:
        self.db_path = Path(db_path)
        self.config_path = Path(config_path)
        self._ensure_db()

    def _ensure_db(self) -> None:
        with sqlite3.connect(self.db_path) as conn:
            conn.execute(
                "CREATE TABLE IF NOT EXISTS processed_errors(issue_id TEXT PRIMARY KEY)"
            )
            conn.commit()

    def load_config(self) -> dict:
        with self.config_path.open("r", encoding="utf-8") as handle:
            return yaml.safe_load(handle) or {}

    def is_processed(self, issue_id: str) -> bool:
        if not issue_id:
            return False

        with sqlite3.connect(self.db_path) as conn:
            row = conn.execute(
                "SELECT 1 FROM processed_errors WHERE issue_id = ?", (issue_id,)
            ).fetchone()
            return row is not None

    def mark_processed(self, issue_id: str) -> None:
        if not issue_id:
            return

        with sqlite3.connect(self.db_path) as conn:
            conn.execute(
                "INSERT OR IGNORE INTO processed_errors(issue_id) VALUES (?)", (issue_id,)
            )
            conn.commit()

    def decide(self, error: dict) -> dict:
        config = self.load_config()
        issue_id = error.get("issue_id", "")

        if self.is_processed(issue_id):
            return {"action": "ignore"}

        required_env = config.get("filters", {}).get("environment", "production")
        if error.get("environment") != required_env:
            return {"action": "ignore"}

        if not error.get("stack_trace"):
            self.mark_processed(issue_id)
            return {"action": "issue_only"}

        self.mark_processed(issue_id)
        return {"action": "fix"}
