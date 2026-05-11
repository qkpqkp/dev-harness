import { createRun } from "../mechanism/lifecycle.js";
import { writeTask, writePlan, validatePlan } from "../mechanism/artifacts.js";
import { logInfo, logWarn } from "../mechanism/logger.js";
import { formatWarnings } from "../mechanism/artifacts.js";

export async function commandPlan(args: string[]): Promise<void> {
  const task = args.join(" ").trim();
  if (!task) {
    throw new Error('Usage: devh plan "task description"');
  }

  const cwd = process.cwd();
  const run = await createRun(cwd, task);

  await writeTask(run.dir, task);
  await writePlan(run.dir, task);

  const warnings = await validatePlan(run.dir);
  if (warnings.length > 0) {
    logWarn("Plan validation:");
    logInfo(formatWarnings(warnings));
  }

  logInfo(`created run: ${run.id}`);
  logInfo(`status: planned`);
  logInfo("");
  logInfo("Next steps:");
  logInfo("  1. Edit plan.md to fill in scope, non-goals, and steps before implementing.");
  logInfo("  2. Run: devh context");
}