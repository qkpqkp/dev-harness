from __future__ import annotations


def normalize_sentry(payload: dict) -> dict:
    """Normalize a Sentry webhook payload into BugPilot's common schema."""
    error_message = (
        payload.get("error_message")
        or payload.get("message")
        or payload.get("title")
        or "Unknown error"
    )
    stack_trace = payload.get("stack_trace") or payload.get("culprit") or ""

    return {
        "source": "sentry",
        "title": payload.get("title") or error_message,
        "issue_id": str(payload.get("issue_id") or payload.get("id") or ""),
        "error_message": error_message,
        "stack_trace": stack_trace,
        "environment": payload.get("environment") or "unknown",
        "frequency": int(payload.get("frequency") or 1),
        "confidence": float(payload.get("confidence") or 0.9),
    }
