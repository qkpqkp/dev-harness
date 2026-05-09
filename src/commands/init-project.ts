import path from "node:path";
import { exists, writeText } from "../core/files.js";
import { logInfo, logWarn } from "../core/logger.js";
import { HARNESS_DIR, harnessPath } from "../core/runs.js";

const projectFiles: Record<string, string> = {
  "PROJECT.md": `# Project

## Purpose

Describe what this project does and who it serves.

## Architecture Notes

- Add the important modules, boundaries, and data flow here.

## AI Collaboration Notes

- Keep context concise.
- Prefer minimal patches.
- Record important decisions in DECISIONS.md.
`,
  "CHECKS.md": `# Checks

Document the commands agents should run before finishing work.

## Required

- Add project-specific test, lint, and typecheck commands here.

## Optional

- Add slower or environment-dependent checks here.
`,
  "DECISIONS.md": `# Decisions

Record durable project decisions that future AI sessions should not rediscover.

## Entries

`,
  "RUNS.md": `# Runs

Generated workflow runs are indexed here.

`,
};

export async function commandInitProject(): Promise<void> {
  const cwd = process.cwd();

  for (const [name, content] of Object.entries(projectFiles)) {
    const filePath = harnessPath(cwd, name);
    if (await exists(filePath)) {
      logInfo(`exists: ${path.relative(cwd, filePath)}`);
      continue;
    }
    await writeText(filePath, content);
    logInfo(`created: ${path.relative(cwd, filePath)}`);
  }

  if (!(await exists(path.join(cwd, "AGENTS.md")))) {
    logWarn("No AGENTS.md found. Add one so coding agents load this repo's workflow constraints.");
  }

  logInfo(`
Next steps:
  devh plan "describe the task"
  devh context "describe the task"

Harness directory: ${HARNESS_DIR}/`);
}
