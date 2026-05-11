from __future__ import annotations

from collections.abc import Callable

from fastapi import APIRouter, HTTPException, Request

from bugpilot.core.normalizer import normalize_sentry

router = APIRouter()
_processor: Callable[[dict], dict] | None = None


def set_processor(processor: Callable[[dict], dict]) -> None:
    global _processor
    _processor = processor


@router.post("/webhook/sentry")
async def sentry_webhook(request: Request) -> dict:
    try:
        payload = await request.json()
    except Exception as exc:
        raise HTTPException(status_code=400, detail="Invalid JSON payload") from exc

    normalized = normalize_sentry(payload)

    if _processor is None:
        return {"error": normalized, "decision": {"action": "ignore"}}

    return _processor(normalized)
