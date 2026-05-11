import { runVerification } from "../mechanism/verify.js";
import { logInfo } from "../mechanism/logger.js";

export async function commandVerify(): Promise<void> {
  const body = await runVerification();
  const statusMatch = body.match(/- Status:\s*(.+)/);
  const status = statusMatch?.[1]?.trim() || "unknown";
  logInfo(`verification status: ${status}`);
}