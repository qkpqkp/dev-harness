import path from "node:path";
import { exists, writeText } from "../mechanism/files.js";
import { logInfo } from "../mechanism/logger.js";
import { HARNESS_DIR, harnessPath } from "../mechanism/lifecycle.js";
import { PRINCIPLES_MD } from "../philosophy/content.js";
import {
  PROJECT_TEMPLATE,
  CHECKS_TEMPLATE,
  DECISIONS_TEMPLATE,
  RUNS_TEMPLATE,
  AGENT_CONFIGS,
} from "../customization/templates.js";

const projectFiles: Record<string, string> = {
  "PROJECT.md": PROJECT_TEMPLATE,
  "CHECKS.md": CHECKS_TEMPLATE,
  "DECISIONS.md": DECISIONS_TEMPLATE,
  "RUNS.md": RUNS_TEMPLATE,
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

  await writeText(harnessPath(cwd, "philosophy.md"), PRINCIPLES_MD);
  logInfo(`created: ${path.relative(cwd, harnessPath(cwd, "philosophy.md"))}`);

  logInfo("");
  logInfo("Agent config files:");
  for (const config of AGENT_CONFIGS) {
    const filePath = path.join(cwd, config.filename);
    if (await exists(filePath)) {
      logInfo(`  exists: ${config.filename} (${config.description}) — consider adding devh workflow reference`);
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