import { collectContext } from "../mechanism/context.js";
import { logInfo, logWarn } from "../mechanism/logger.js";
import { validatePlan, formatWarnings } from "../mechanism/artifacts.js";
import { requireLatestRun, setRunStatus } from "../mechanism/lifecycle.js";

export async function commandContext(args: string[]): Promise<void> {
  const taskOverride = args.join(" ").trim() || undefined;

  const cwd = process.cwd();
  const run = await requireLatestRun(cwd);

  const warnings = await validatePlan(run.dir);
  if (warnings.length > 0) {
    logWarn("Plan validation:");
    logInfo(formatWarnings(warnings));
    logInfo("");
  }

  await setRunStatus(run.dir, "in_progress");
  await collectContext(taskOverride);
  logInfo(`status: in_progress`);
}