from __future__ import annotations

import subprocess
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parents[1]


def run_fix_agent(error: dict, config: dict) -> None:
    prompt_template_path = BASE_DIR / "skills" / "fix_error.prompt"
    prompt_template = prompt_template_path.read_text(encoding="utf-8")

    blocked_paths = config.get("risk", {}).get("blocked_paths", [])
    prompt = (
        prompt_template.replace("{{error_message}}", error.get("error_message", ""))
        .replace("{{stack_trace}}", error.get("stack_trace", ""))
        .replace("{{blocked_paths}}", ", ".join(blocked_paths) or "none")
    )

    result = subprocess.run(
        ["claude", "--mcp", "sentry", "--mcp", "github", "-p", prompt],
        capture_output=True,
        text=True,
        check=False,
    )

    if result.stdout:
        print(result.stdout)
    if result.stderr:
        print(result.stderr)
