import path from "node:path";
import { readTextIfExists, writeText } from "./files.js";
import { getBranch, getRecentCommits, getStatus } from "./git.js";
import { logInfo } from "./logger.js";
import { readPackageInfo, summarizeTree, taskKeywords } from "./project.js";
import { harnessPath, requireLatestRun } from "./lifecycle.js";
import { runCommand, truncateOutput } from "./shell.js";

async function findRelatedFiles(
  cwd: string,
  task: string,
): Promise<string[]> {
  const keywords = taskKeywords(task);
  if (keywords.length === 0) return [];

  const fileQuery = keywords.map((word) => `-g "*${word}*"`).join(" ");
  const nameResult = await runCommand(
    `rg --files ${fileQuery}`,
    cwd,
    20_000,
  );
  const byName =
    nameResult.exitCode === 0
      ? nameResult.stdout.split(/\r?\n/).filter(Boolean)
      : [];

  const contentQuery = keywords.slice(0, 6).join("|");
  const contentResult = await runCommand(
    `rg -l -i "${contentQuery}" --glob "!node_modules/**" --glob "!dist/**" --glob "!.git/**"`,
    cwd,
    20_000,
  );
  const byContent =
    contentResult.exitCode === 0
      ? contentResult.stdout.split(/\r?\n/).filter(Boolean)
      : [];

  return Array.from(new Set([...byName, ...byContent])).slice(0, 40);
}

export async function collectContext(taskOverride?: string): Promise<string> {
  const cwd = process.cwd();
  const run = await requireLatestRun(cwd);
  const task =
    taskOverride ??
    (await readTextIfExists(path.join(run.dir, "task.md")))
      .replace(/^# Task\s*/i, "")
      .trim();
  const packageInfo = await readPackageInfo(cwd);
  const relatedFiles = await findRelatedFiles(cwd, task);

  const harnessProject = await readTextIfExists(
    harnessPath(cwd, "PROJECT.md"),
  );
  const harnessChecks = await readTextIfExists(
    harnessPath(cwd, "CHECKS.md"),
  );
  const harnessDecisions = await readTextIfExists(
    harnessPath(cwd, "DECISIONS.md"),
  );

  const scriptLines = Object.entries(packageInfo.scripts).map(
    ([name, script]) => `- ${name}: \`${script}\``,
  );
  const content = `# Context

## Task

${task || "(not provided)"}

## Git

- Branch: ${await getBranch(cwd) || "(unknown)"}

\`\`\`text
${await getStatus(cwd) || "(git status unavailable)"}
\`\`\`

## Recent Commits

\`\`\`text
${await getRecentCommits(cwd) || "(recent commits unavailable)"}
\`\`\`

## Project Structure Summary

\`\`\`text
${(await summarizeTree(cwd)).join("\n")}
\`\`\`

## Related Files Guess

${relatedFiles.length ? relatedFiles.map((file) => `- ${file}`).join("\n") : "- No likely files found from task keywords."}

## Package Scripts

- Package manager: ${packageInfo.packageManager}
${scriptLines.length ? scriptLines.join("\n") : "- No package.json scripts detected."}

## Harness Project Notes

${truncateOutput(harnessProject || "(no PROJECT.md yet)", 3000)}

## Harness Checks

${truncateOutput(harnessChecks || "(no CHECKS.md yet)", 2000)}

## Harness Decisions

${truncateOutput(harnessDecisions || "(no DECISIONS.md yet)", 3000)}

## Token Discipline

- This context intentionally summarizes structure and metadata.
- Read only the listed related files first.
- Avoid loading large generated files unless the plan explicitly requires it.
`;

  await writeText(path.join(run.dir, "context.md"), content);
  logInfo(
    `updated: ${path.relative(cwd, path.join(run.dir, "context.md"))}`,
  );
  return content;
}