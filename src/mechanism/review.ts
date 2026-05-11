import path from "node:path";
import { writeText, readTextIfExists } from "./files.js";
import { getChangedFiles, getDiffStat, getDiffSummary } from "./git.js";
import { logInfo } from "./logger.js";
import { requireLatestRun } from "./lifecycle.js";
import { checkScopeAlignment } from "./checkpoints.js";

export async function runReview(): Promise<string> {
  const cwd = process.cwd();
  const run = await requireLatestRun(cwd);
  const changedFiles = await getChangedFiles(cwd);
  const diffStat = await getDiffStat(cwd);
  const diffSummary = await getDiffSummary(cwd);

  const scopeCheck = await checkScopeAlignment(run.dir, changedFiles);

  const scopeSection = scopeCheck.warnings.length > 0
    ? `## Scope Check\n\n${scopeCheck.warnings.map((w) => `- ${w}`).join("\n")}\n\n${
        scopeCheck.outOfScope.length > 0
          ? `### Out-of-Scope Files\n\n${scopeCheck.outOfScope.map((f) => `- ${f}`).join("\n")}`
          : ""
      }`
    : "## Scope Check\n\nAll changed files are within the plan scope.";

  const body = `# Review

## Changed Files

${changedFiles.length ? changedFiles.map((file) => `- ${file}`).join("\n") : "- No tracked git diff detected."}

${scopeSection}

## Diff Summary

\`\`\`text
${diffStat || diffSummary || "(no diff summary)"}
\`\`\`

## Review Checklist

- Correctness: Does the diff implement only the approved scope?
- Tests: Are relevant regression tests or checks present?
- Edge cases: Are empty, null, error, and boundary cases handled?
- Security: Does the diff avoid leaking secrets or weakening trust boundaries?
- Compatibility: Are public APIs, CLI behavior, and file formats preserved?
- Maintainability: Is the patch smaller than the problem requires, with no unrelated refactor?
- Workflow: Are docs/prompts/templates updated when workflow behavior changes?

## Risks

- 

## AI Reviewer Prompt

Use this prompt with an AI coding reviewer:

\`\`\`md
Review only the current git diff. Do not review unrelated existing code unless the diff makes it relevant.

Focus on correctness, missing tests, edge cases, security, architecture drift, overengineering, and hidden behavior changes.

Return findings first, ordered by severity, with file and line references where possible. If there are no actionable findings, say that clearly and list residual test gaps.
\`\`\`
`;

  await writeText(path.join(run.dir, "review.md"), body);
  logInfo(
    `updated: ${path.relative(cwd, path.join(run.dir, "review.md"))}`,
  );
  return body;
}