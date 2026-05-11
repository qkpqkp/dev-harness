import { runReview } from "../mechanism/review.js";
import { logInfo } from "../mechanism/logger.js";
import { requireLatestRun, setRunStatus } from "../mechanism/lifecycle.js";

export async function commandReview(): Promise<void> {
  const cwd = process.cwd();
  const run = await requireLatestRun(cwd);
  await runReview();
  await setRunStatus(run.dir, "reviewed");
  logInfo("review complete. Check review.md for scope alignment and diff analysis.");
  logInfo(`status: reviewed (run dir: ${run.id})`);
}