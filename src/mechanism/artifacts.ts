import path from "node:path";
import { readTextIfExists, writeText } from "./files.js";

export type ArtifactWarning = {
  file: string;
  section: string;
  message: string;
};

const REQUIRED_PLAN_SECTIONS = [
  { key: "Goal", patterns: [/^##\s*Goal\b/m] },
  { key: "Scope", patterns: [/^##\s*Scope\b/m] },
  { key: "Non-goals", patterns: [/^##\s*Non[- ]?goals\b/im] },
] as const;

export async function writeTask(
  dir: string,
  task: string,
): Promise<string> {
  const filePath = path.join(dir, "task.md");
  await writeText(filePath, `# Task\n\n${task}\n`);
  return filePath;
}

export async function writePlan(dir: string, task: string): Promise<string> {
  const filePath = path.join(dir, "plan.md");
  await writeText(
    filePath,
    `# Plan

## Goal

${task}

## Scope

- 

## Non-goals

- 

## Affected Files

- 

## Proposed Steps

1. 

## Risks

- 

## Validation

- 

## Rollback

- 

## Assumptions / Questions

- 
`,
  );
  return filePath;
}

export async function writeContext(dir: string, content: string): Promise<string> {
  const filePath = path.join(dir, "context.md");
  await writeText(filePath, content);
  return filePath;
}

export async function writeVerification(
  dir: string,
  content: string,
): Promise<string> {
  const filePath = path.join(dir, "verification.md");
  await writeText(filePath, content);
  return filePath;
}

export async function writeReview(
  dir: string,
  content: string,
): Promise<string> {
  const filePath = path.join(dir, "review.md");
  await writeText(filePath, content);
  return filePath;
}

export async function writeSummary(
  dir: string,
  content: string,
): Promise<string> {
  const filePath = path.join(dir, "summary.md");
  await writeText(filePath, content);
  return filePath;
}

export async function validatePlan(dir: string): Promise<ArtifactWarning[]> {
  const warnings: ArtifactWarning[] = [];
  const planContent = await readTextIfExists(path.join(dir, "plan.md"));

  if (!planContent) {
    warnings.push({
      file: "plan.md",
      section: "",
      message: "plan.md is missing. Create one with: devh plan",
    });
    return warnings;
  }

  for (const section of REQUIRED_PLAN_SECTIONS) {
    const found = section.patterns.some((p) => p.test(planContent));
    if (!found) {
      warnings.push({
        file: "plan.md",
        section: section.key,
        message: `plan.md is missing required section: ${section.key}`,
      });
      continue;
    }

    const lines = planContent.split(/\r?\n/);
    let inside = false;
    let hasContent = false;
    for (const line of lines) {
      if (section.patterns.some((p) => p.test(line))) {
        inside = true;
        continue;
      }
      if (inside && /^##\s/.test(line)) {
        break;
      }
      if (inside && line.trim().length > 0) {
        if (!line.trim().startsWith("-")) {
          hasContent = true;
        } else if (line.trim() !== "-") {
          hasContent = true;
        }
      }
    }
    if (inside && !hasContent) {
      warnings.push({
        file: "plan.md",
        section: section.key,
        message: `plan.md section "${section.key}" appears empty. Consider filling it in before implementing.`,
      });
    }
  }

  return warnings;
}

export function formatWarnings(warnings: ArtifactWarning[]): string {
  return warnings
    .map((w) => `  \u26A0 ${w.file}: ${w.message}`)
    .join("\n");
}