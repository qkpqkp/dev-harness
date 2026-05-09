import { runCommand } from "./shell.js";

async function git(args: string, cwd: string): Promise<string> {
  const result = await runCommand(`git ${args}`, cwd, 30_000);
  if (result.exitCode !== 0) {
    return "";
  }
  return result.stdout.trim();
}

export async function getBranch(cwd: string): Promise<string> {
  return git("rev-parse --abbrev-ref HEAD", cwd);
}

export async function getStatus(cwd: string): Promise<string> {
  return git("status --short --branch", cwd);
}

export async function getRecentCommits(cwd: string, count = 8): Promise<string> {
  return git(`log -${count} --oneline --decorate`, cwd);
}

export async function getChangedFiles(cwd: string): Promise<string[]> {
  const output = await git("diff --name-only HEAD", cwd);
  return output ? output.split(/\r?\n/).filter(Boolean) : [];
}

export async function getDiffStat(cwd: string): Promise<string> {
  return git("diff --stat HEAD", cwd);
}

export async function getDiffSummary(cwd: string): Promise<string> {
  return git("diff --shortstat HEAD", cwd);
}
