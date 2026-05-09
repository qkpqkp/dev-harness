import path from "node:path";
import { appendFile } from "node:fs/promises";
import { ensureDir, exists, listDirs, readTextIfExists, writeText } from "./files.js";

export const HARNESS_DIR = ".agent-harness";
export const RUNS_DIR = "runs";

export function harnessPath(cwd: string, ...parts: string[]): string {
  return path.join(cwd, HARNESS_DIR, ...parts);
}

export function slugify(input: string): string {
  const slug = input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  return slug || "task";
}

export function timestampId(date = new Date()): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}-${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
}

export async function createRun(cwd: string, task: string): Promise<{ id: string; dir: string }> {
  const id = `${timestampId()}-${slugify(task)}`;
  const dir = harnessPath(cwd, RUNS_DIR, id);
  await ensureDir(dir);
  await writeText(harnessPath(cwd, "current-run"), id);
  await appendRunIndex(cwd, id, task);
  return { id, dir };
}

export async function getLatestRun(cwd: string): Promise<{ id: string; dir: string } | null> {
  const pointer = (await readTextIfExists(harnessPath(cwd, "current-run"))).trim();
  if (pointer) {
    const dir = harnessPath(cwd, RUNS_DIR, pointer);
    if (await exists(dir)) return { id: pointer, dir };
  }

  const dirs = await listDirs(harnessPath(cwd, RUNS_DIR));
  const id = dirs.at(-1);
  return id ? { id, dir: harnessPath(cwd, RUNS_DIR, id) } : null;
}

export async function requireLatestRun(cwd: string): Promise<{ id: string; dir: string }> {
  const run = await getLatestRun(cwd);
  if (!run) {
    throw new Error("No harness run found. Start with: devh plan \"task description\"");
  }
  return run;
}

export async function appendRunIndex(cwd: string, id: string, task: string): Promise<void> {
  const runsFile = harnessPath(cwd, "RUNS.md");
  const line = `- ${new Date().toISOString()} - ${id} - ${task}\n`;
  await ensureDir(path.dirname(runsFile));
  if (!(await exists(runsFile))) {
    await writeText(runsFile, "# Runs\n\n");
  }
  await appendFile(runsFile, line, "utf8");
}
