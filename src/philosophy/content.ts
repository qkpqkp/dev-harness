export const PRINCIPLES_MD = `# Dev Harness Philosophy

These principles are immutable. They define how AI-assisted development should work when using this harness.

## 1. Plan Before You Edit

Never jump straight into code. Write a plan first. The plan states what will change, what will not change, and how to verify the change is correct.

A plan exists to make scope visible. Visibility makes it easier to say no to nearby work.

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

Every run produces artifacts: task, plan, context, verification, review, summary. These files reduce the cost of starting a new session and make work resumable across tools and time.

## 7. Record Decisions

When an important architectural or behavioral decision is made, record it in DECISIONS.md. Future sessions should not re-discover what was already decided.

## 8. Do Not Expand Scope

If you discover additional work that needs doing while implementing a plan, record it as a new task. Do not fold it into the current plan. The current plan's scope is a contract.
`;

export const AGENTS_MD = `# Agent Instructions

This project uses Dev Harness for AI-assisted development workflow.

## Before You Start

1. Read \`.agent-harness/philosophy.md\` for workflow principles.
2. Read \`.agent-harness/PROJECT.md\` for project context.
3. Read \`.agent-harness/CHECKS.md\` for verification commands.
4. Read \`.agent-harness/DECISIONS.md\` for recorded decisions.
5. Check \`.agent-harness/current-run\` for an active run. If one exists, read its \`plan.md\` first.

## Workflow

Follow this sequence. Do not skip steps.

1. **Plan**: Use \`devh plan "task description"\`. Fill in the plan's goal, scope, and non-goals before implementing.
2. **Context**: Use \`devh context\`. Read the generated context before touching any files.
3. **Implement**: Make only the changes described in the plan. Do not expand scope.
4. **Verify**: Use \`devh verify\`. Address any failing checks before proceeding.
5. **Review**: Use \`devh review\`. Compare every changed file against the plan's scope. Flag any out-of-scope changes.
6. **Summarize**: Use \`devh summarize\` to close the run.

## Hard Rules

- Do not implement anything not in the plan's scope.
- Do not skip verification.
- Do not skip diff review.
- If you find additional work, record it as a new task, do not fold it in.
- Record important decisions in \`.agent-harness/DECISIONS.md\`.
- Update docs and tests when behavior changes.

## When Things Go Wrong

- If a test fails, use the fix-test-failure prompt: fix only the failing check, do not refactor.
- If the plan is wrong, re-plan. Do not silently deviate.
- If you are uncertain about scope, ask.
`;