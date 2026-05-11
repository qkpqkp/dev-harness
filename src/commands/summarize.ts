import { runSummarize } from "../mechanism/summarize.js";
import { logInfo } from "../mechanism/logger.js";
import { requireLatestRun, setRunStatus } from "../mechanism/lifecycle.js";

export async function commandSummarize(): Promise<void> {
  const cwd = process.cwd();
  const run = await requireLatestRun(cwd);
  await runSummarize();
  await setRunStatus(run.dir, "summarized");
  logInfo(`status: summarized (run dir: ${run.id})`);
  logInfo("Run complete. Use the summary for your commit message and PR body.");
}