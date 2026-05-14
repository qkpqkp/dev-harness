# Project

## Purpose

Describe what this project does and who it serves.

## Architecture Notes

- Add the important modules, boundaries, and data flow here.

## AI Collaboration Notes

- Keep context concise.
- Prefer minimal patches.
- Match process weight to task risk: small tasks need less ceremony, larger or unclear tasks need a short plan.
- Escalate when scope grows or uncertainty appears.
- Record important decisions in DECISIONS.md.

## Behavior Policy

Customize how agents handle stuck situations. Adjust thresholds and actions to match your preferences.

- **Max retries**: 3 (how many times to retry the same fix before moving on)
- **On blocked**: skip and report (what to do when stuck: skip and report / stop and ask / keep trying)
- **Report in**: summary.md (where to record unresolved failures)
