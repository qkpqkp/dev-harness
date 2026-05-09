import { spawn } from "node:child_process";

export type CommandResult = {
  command: string;
  exitCode: number | null;
  stdout: string;
  stderr: string;
  timedOut: boolean;
};

export async function runCommand(command: string, cwd: string, timeoutMs = 120_000): Promise<CommandResult> {
  return new Promise((resolve) => {
    const child = spawn(command, {
      cwd,
      shell: true,
      windowsHide: true,
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";
    let timedOut = false;

    const timer = setTimeout(() => {
      timedOut = true;
      child.kill();
    }, timeoutMs);

    child.stdout.on("data", (chunk: Buffer) => {
      stdout += chunk.toString("utf8");
    });
    child.stderr.on("data", (chunk: Buffer) => {
      stderr += chunk.toString("utf8");
    });

    child.on("close", (exitCode) => {
      clearTimeout(timer);
      resolve({ command, exitCode, stdout, stderr, timedOut });
    });
  });
}

export function truncateOutput(value: string, maxChars = 8000): string {
  if (value.length <= maxChars) {
    return value.trim();
  }
  return `${value.slice(0, maxChars).trim()}\n\n[truncated ${value.length - maxChars} chars]`;
}
