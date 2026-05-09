import path from "node:path";
import { writeText } from "../core/files.js";
import { logInfo } from "../core/logger.js";
import { createRun } from "../core/runs.js";

export async function commandPlan(args: string[]): Promise<void> {
  const task = args.join(" ").trim();
  if (!task) {
    throw new Error('Usage: devh plan "task description"');
  }

  const cwd = process.cwd();
  const run = await createRun(cwd, task);

  await writeText(
    path.join(run.dir, "task.md"),
    `# Task

${task}
`,
  );

  await writeText(
    path.join(run.dir, "plan.md"),
    `# Plan

## Goal

${task}

## Scope

- 

## Non-goals

- 

## Affected Areas

- 

## Proposed Steps

1. 

## Risks

- 

## Validation

- 

## Rollback Plan

- 

## Questions / Assumptions

- 
`,
  );

  logInfo(`created run: ${path.relative(cwd, run.dir)}`);
  logInfo("Edit plan.md before implementation when the task is non-trivial.");
}
