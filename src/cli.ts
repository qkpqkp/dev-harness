#!/usr/bin/env node
import { commandContext } from "./commands/context.js";
import { commandInitProject } from "./commands/init-project.js";
import { commandPlan } from "./commands/plan.js";
import { commandReview } from "./commands/review.js";
import { commandSummarize } from "./commands/summarize.js";
import { commandVerify } from "./commands/verify.js";
import { logError, logInfo } from "./core/logger.js";

type CommandHandler = (args: string[]) => Promise<void>;

const commands: Record<string, CommandHandler> = {
  "init-project": commandInitProject,
  plan: commandPlan,
  context: commandContext,
  verify: commandVerify,
  review: commandReview,
  summarize: commandSummarize,
};

function printHelp(): void {
  logInfo(`devh - personal AI development workflow harness

Usage:
  devh init-project
  devh plan "task description"
  devh context "task description"
  devh verify
  devh review
  devh summarize

v0 generates workflow artifacts only. It does not call LLM APIs or mutate remote services.`);
}

async function main(): Promise<void> {
  const [, , command, ...args] = process.argv;

  if (!command || command === "-h" || command === "--help") {
    printHelp();
    return;
  }

  const handler = commands[command];
  if (!handler) {
    logError(`Unknown command: ${command}`);
    printHelp();
    process.exitCode = 1;
    return;
  }

  await handler(args);
}

main().catch((error: unknown) => {
  logError(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
