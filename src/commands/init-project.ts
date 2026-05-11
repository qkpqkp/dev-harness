import path from "node:path";
import { exists, readTextIfExists, writeText } from "../mechanism/files.js";
import { logInfo } from "../mechanism/logger.js";
import { HARNESS_DIR, harnessPath } from "../mechanism/lifecycle.js";
import { PRINCIPLES_MD } from "../philosophy/content.js";
import {
  PROJECT_TEMPLATE,
  CHECKS_TEMPLATE,
  DECISIONS_TEMPLATE,
  RUNS_TEMPLATE,
  AGENT_CONFIGS,
  updateDevhSection,
  DEVH_SECTION_START,
  DEVH_SECTION_END,
} from "../customization/templates.js";

const projectFiles: Record<string, string> = {
  "PROJECT.md": PROJECT_TEMPLATE,
  "CHECKS.md": CHECKS_TEMPLATE,
  "DECISIONS.md": DECISIONS_TEMPLATE,
  "RUNS.md": RUNS_TEMPLATE,
};

function extractDevhSection(fullContent: string): string {
  const startIdx = fullContent.indexOf(DEVH_SECTION_START);
  const endIdx = fullContent.lastIndexOf(DEVH_SECTION_END);
  if (startIdx === -1 || endIdx === -1) return "";
  return fullContent.slice(startIdx, endIdx + DEVH_SECTION_END.length);
}

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

  await writeText(harnessPath(cwd, "philosophy.md"), PRINCIPLES_MD);
  logInfo(`updated: ${path.relative(cwd, harnessPath(cwd, "philosophy.md"))}`);

  logInfo("");
  logInfo("Agent config files:");
  for (const config of AGENT_CONFIGS) {
    const filePath = path.join(cwd, config.filename);
    if (await exists(filePath)) {
      const existing = await readTextIfExists(filePath);
      if (existing.includes(DEVH_SECTION_START) && existing.includes(DEVH_SECTION_END)) {
        const newSection = extractDevhSection(config.content);
        const updated = updateDevhSection(existing, newSection);
        await writeText(filePath, updated);
        logInfo(`  updated: ${config.filename} (${config.description})`);
      } else {
        const appended = existing.trimEnd() + "\n\n" + config.content + "\n";
        await writeText(filePath, appended);
        logInfo(`  appended: ${config.filename} (${config.description}) — added devh section at end`);
      }
    } else {
      await writeText(filePath, config.content);
      logInfo(`  created: ${config.filename} (${config.description})`);
    }
  }

  logInfo("");
  logInfo(`Next steps:
  1. Edit .agent-harness/PROJECT.md with your project context.
  2. Edit .agent-harness/CHECKS.md with your verification commands.
  3. Run: devh plan "describe the task"

Harness directory: ${HARNESS_DIR}/`);
}