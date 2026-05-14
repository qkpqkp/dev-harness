export const PRINCIPLES_MD = `# Dev Harness Philosophy

These principles are immutable. They define how AI-assisted development should work when using this harness.

## 1. Match Workflow Weight To Risk

Never jump straight into code. First decide how much process the task needs: small, medium, or large.

Small, clear changes need visible intent and verification. Risky, broad, or unclear changes need an explicit plan that states what will change, what will not change, and how to verify the result.

## 2. Context Should Be Small and Relevant

An AI agent does not need the whole repository. It needs project notes, recent git state, likely files, available checks, and durable decisions.

Load context deliberately. Summarize metadata and point toward relevant files instead of dumping source code.

## 3. Minimal Patches

Make the smallest change that correctly solves the task. Do not refactor unrelated code. Do not add convenience features. Do not rename things unless the plan says so.

If the patch is larger than the problem requires, stop and re-plan.

## 4. Verify After Every Change

Run the project's checks after implementing. A failing check is useful information. A missing check is also useful information and should be recorded.

Verification is not optional. It is a required artifact of every run.

## 5. Review the Diff

Before accepting any change, review the git diff. Diff review catches hidden behavior changes, missing tests, and scope drift.

The review must compare the diff against the approved plan. Any change outside the plan's scope should be flagged.

## 6. Leave Checkpoints

Standard and full runs produce artifacts such as task, plan, context, verification, review, and summary. These files reduce the cost of starting a new session and make work resumable across tools and time.

## 7. Record Decisions

When an important architectural or behavioral decision is made, record it in DECISIONS.md. Future sessions should not re-discover what was already decided.

## 8. Do Not Expand Scope

If you discover additional work that needs doing while implementing a plan, record it as a new task. Do not fold it into the current plan. The current plan's scope is a contract.

## 9. Do Not Loop

If the same action fails three times in a row with the same result, stop. Record what failed, move on to the rest of the plan, and report the unresolved failure at the end. Repeating identical attempts wastes resources without producing new information.
`;

export const AGENTS_MD = `# Agent Instructions

This project uses Dev Harness for AI-assisted development workflow.

## Before You Start

1. Read \`.agent-harness/philosophy.md\` for workflow principles.
2. Read \`.agent-harness/PROJECT.md\` for project context.
3. Read \`.agent-harness/CHECKS.md\` for verification commands.
4. Read \`.agent-harness/DECISIONS.md\` for recorded decisions.
5. Check \`.agent-harness/current-run\` for an active run. If one exists, read its \`plan.md\` first.

## Agent Rules

- Classify task risk before editing: small, medium, or large.
- Use the lightest process that fits the risk.
- For small clear tasks, a full plan is optional unless scope is unclear.
- For medium or large tasks, create or update a short plan before editing.
- Understand local context before changing files.
- Keep changes inside the agreed scope.
- If scope grows, stop and update the plan or ask.
- Run relevant verification before finishing.
- Review your diff before the final response.
- Update docs and tests when behavior changes.
- Record durable decisions in \`.agent-harness/DECISIONS.md\` when behavior or architecture changes.

## When Things Go Wrong

- If a test fails, use the fix-test-failure prompt: fix only the failing check, do not refactor.
- If the plan is wrong, re-plan. Do not silently deviate.
- If you are uncertain about scope, ask.
- If the same fix attempt fails three times, stop trying. Skip the blocked step, continue the rest of the plan, and report the unresolved failure in the summary. Do not burn tokens on repeated identical attempts.
`;
