import path from "node:path";
import { readTextIfExists, writeText } from "../core/files.js";
import { getChangedFiles } from "../core/git.js";
import { logInfo } from "../core/logger.js";
import { requireLatestRun } from "../core/runs.js";

function extractStatus(verification: string): string {
  const match = verification.match(/- Status:\s*(.+)/);
  return match?.[1]?.trim() || "unknown";
}

export async function commandSummarize(): Promise<void> {
  const cwd = process.cwd();
  const run = await requireLatestRun(cwd);
  const task = (await readTextIfExists(path.join(run.dir, "task.md"))).replace(/^# Task\s*/i, "").trim();
  const verification = await readTextIfExists(path.join(run.dir, "verification.md"));
  const changedFiles = await getChangedFiles(cwd);
  const summaryPath = path.join(run.dir, "summary.md");

  const body = `# Summary

## Task

${task || "(task not recorded)"}

## Changed Files

${changedFiles.length ? changedFiles.map((file) => `- ${file}`).join("\n") : "- No tracked git diff detected."}

## Verification Status

${extractStatus(verification)}

## Remaining Risks

- 

## Suggested Commit Message

\`\`\`text
chore: update development harness workflow
\`\`\`

## Suggested PR Body

\`\`\`md
## Summary

- 

## Verification

- ${extractStatus(verification)}

## Risks

- 
\`\`\`
`;

  await writeText(summaryPath, body);
  logInfo(`updated: ${path.relative(cwd, summaryPath)}`);
}
