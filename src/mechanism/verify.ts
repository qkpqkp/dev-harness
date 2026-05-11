import path from "node:path";
import { readdir } from "node:fs/promises";
import { exists, writeText } from "./files.js";
import { logInfo } from "./logger.js";
import { packageRunCommand, readPackageInfo } from "./project.js";
import { requireLatestRun } from "./lifecycle.js";
import { runCommand, truncateOutput } from "./shell.js";
import { readTextIfExists } from "./files.js";

type Check = { name: string; command: string; reason: string };

async function hasDotNetProject(cwd: string): Promise<boolean> {
  if (await exists(path.join(cwd, "global.json"))) {
    return true;
  }

  const entries = await readdir(cwd, { withFileTypes: true });
  return entries.some(
    (entry) =>
      entry.isFile() &&
      (entry.name.endsWith(".sln") || entry.name.endsWith(".csproj")),
  );
}

function parseChecksWithFromChecksMd(content: string): Check[] {
  const checks: Check[] = [];
  const lines = content.split(/\r?\n/);
  let inRequired = false;

  for (const line of lines) {
    if (/^##\s*Required\b/i.test(line)) {
      inRequired = true;
      continue;
    }
    if (/^##\s/.test(line)) {
      inRequired = false;
      continue;
    }
    if (inRequired) {
      const match = line.match(/^\s*-\s+(.+)/);
      if (match) {
        const trimmed = match[1].trim();
        if (trimmed.startsWith("`") && trimmed.endsWith("`")) {
          checks.push({
            name: trimmed,
            command: trimmed.slice(1, -1),
            reason: "Listed in CHECKS.md Required",
          });
        } else {
          checks.push({
            name: trimmed,
            command: trimmed,
            reason: "Listed in CHECKS.md Required",
          });
        }
      }
    }
  }

  return checks;
}

async function detectChecks(cwd: string): Promise<Check[]> {
  const checks: Check[] = [];
  const packageInfo = await readPackageInfo(cwd);

  for (const script of ["typecheck", "lint", "test"]) {
    if (packageInfo.scripts[script]) {
      checks.push({
        name: script,
        command: packageRunCommand(packageInfo.packageManager, script),
        reason: `package.json script "${script}"`,
      });
    }
  }

  if (
    (await exists(path.join(cwd, "pyproject.toml"))) ||
    (await exists(path.join(cwd, "pytest.ini")))
  ) {
    checks.push({
      name: "pytest",
      command: "pytest",
      reason: "Python test config detected",
    });
  }

  if (await hasDotNetProject(cwd)) {
    checks.push({
      name: "dotnet test",
      command: "dotnet test",
      reason: ".NET project marker detected",
    });
  }

  const checksMd = await readTextIfExists(
    path.join(cwd, ".agent-harness", "CHECKS.md"),
  );
  if (checksMd) {
    const customChecks = parseChecksWithFromChecksMd(checksMd);
    const existingCommands = new Set(checks.map((c) => c.command));
    for (const cc of customChecks) {
      if (!existingCommands.has(cc.command)) {
        checks.push(cc);
      }
    }
  }

  return checks;
}

export async function runVerification(): Promise<string> {
  const cwd = process.cwd();
  const run = await requireLatestRun(cwd);
  const checks = await detectChecks(cwd);
  const results = [];

  for (const check of checks) {
    logInfo(`running: ${check.command}`);
    const result = await runCommand(check.command, cwd, 180_000);
    results.push({ check, result });
  }

  const passed = results.filter(
    ({ result }) => result.exitCode === 0 && !result.timedOut,
  ).length;
  const failed = results.length - passed;

  const body = `# Verification

## Summary

- Status: ${checks.length === 0 ? "not run" : failed === 0 ? "passed" : "failed"}
- Checks detected: ${checks.length}
- Passed: ${passed}
- Failed: ${failed}

## Detection

${checks.length ? checks.map((check) => `- ${check.name}: \`${check.command}\` (${check.reason})`).join("\n") : "- No runnable checks detected. Add commands to package.json scripts, CHECKS.md, pytest config, or .NET project metadata."}

## Results

${results.length
    ? results
        .map(
          ({ check, result }) => `### ${check.name}

- Command: \`${result.command}\`
- Exit code: ${result.exitCode}
- Timed out: ${result.timedOut}

\`\`\`text
${truncateOutput([result.stdout, result.stderr].filter(Boolean).join("\n\n")) || "(no output)"}
\`\`\`
`,
        )
        .join("\n")
    : "(no checks were run)"}
`;

  await writeText(path.join(run.dir, "verification.md"), body);
  logInfo(
    `updated: ${path.relative(cwd, path.join(run.dir, "verification.md"))}`,
  );
  return body;
}