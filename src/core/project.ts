import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { exists, isFile } from "./files.js";

export type PackageInfo = {
  packageManager: "pnpm" | "yarn" | "npm" | "unknown";
  scripts: Record<string, string>;
};

export async function detectPackageManager(cwd: string): Promise<PackageInfo["packageManager"]> {
  if (await exists(path.join(cwd, "pnpm-lock.yaml"))) return "pnpm";
  if (await exists(path.join(cwd, "yarn.lock"))) return "yarn";
  if (await exists(path.join(cwd, "package-lock.json"))) return "npm";
  if (await exists(path.join(cwd, "package.json"))) return "npm";
  return "unknown";
}

export async function readPackageInfo(cwd: string): Promise<PackageInfo> {
  const packagePath = path.join(cwd, "package.json");
  const packageManager = await detectPackageManager(cwd);

  if (!(await isFile(packagePath))) {
    return { packageManager, scripts: {} };
  }

  const raw = await readFile(packagePath, "utf8");
  const parsed = JSON.parse(raw) as { scripts?: Record<string, string> };
  return { packageManager, scripts: parsed.scripts ?? {} };
}

export function packageRunCommand(manager: PackageInfo["packageManager"], script: string): string {
  if (manager === "pnpm") return `pnpm ${script}`;
  if (manager === "yarn") return `yarn ${script}`;
  return `npm run ${script}`;
}

export async function summarizeTree(cwd: string, maxEntries = 80): Promise<string[]> {
  const ignored = new Set([".git", "node_modules", "dist", "__pycache__", ".agent-harness"]);
  const out: string[] = [];

  async function walk(dir: string, depth: number): Promise<void> {
    if (out.length >= maxEntries || depth > 2) return;
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
      if (ignored.has(entry.name) || out.length >= maxEntries) continue;
      const fullPath = path.join(dir, entry.name);
      const rel = path.relative(cwd, fullPath).replaceAll("\\", "/");
      out.push(`${"  ".repeat(depth)}${entry.isDirectory() ? rel + "/" : rel}`);
      if (entry.isDirectory()) {
        await walk(fullPath, depth + 1);
      }
    }
  }

  await walk(cwd, 0);
  return out;
}

export function taskKeywords(task: string): string[] {
  return Array.from(
    new Set(
      task
        .toLowerCase()
        .replace(/[^a-z0-9_\-\s/]/g, " ")
        .split(/\s+/)
        .filter((word) => word.length >= 3)
        .slice(0, 12),
    ),
  );
}
