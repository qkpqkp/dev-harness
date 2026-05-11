#!/usr/bin/env node
import { commandInitProject } from "./commands/init-project.js";
import { commandPlan } from "./commands/plan.js";
import { commandContext } from "./commands/context.js";
import { commandVerify } from "./commands/verify.js";
import { commandReview } from "./commands/review.js";
import { commandSummarize } from "./commands/summarize.js";
import { logInfo, logWarn } from "./mechanism/logger.js";

type CommandHandler = (args: string[]) => Promise<void>;

const commands: Record<string, CommandHandler> = {
  "init-project": commandInitProject,
  plan: commandPlan,
  context: commandContext,
  verify: commandVerify,
  review: commandReview,
  summarize: commandSummarize,
};

function logError(message: string): void {
  console.error(`error: ${message}`);
}

function printHelp(): void {
  logInfo(`devh - personal AI development workflow harness

Usage:
  devh init-project
  devh plan "task description"
  devh context ["task description"]
  devh verify
  devh review
  devh summarize

v0 generates workflow artifacts and enforces a disciplined flow.
It does not call LLM APIs.

Workflow: plan -> context -> implement -> verify -> review -> summarize
Run init-project first to set up the .agent-harness directory.`);
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