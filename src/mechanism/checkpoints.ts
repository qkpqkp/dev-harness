import { readTextIfExists } from "./files.js";

export type ScopeCheckResult = {
  inScope: string[];
  outOfScope: string[];
  warnings: string[];
};

export function parseScopeFromPlan(planContent: string): string[] {
  const scope: string[] = [];
  const lines = planContent.split(/\r?\n/);
  let inside = false;

  for (const line of lines) {
    if (/^##\s*Scope\b/i.test(line)) {
      inside = true;
      continue;
    }
    if (inside && /^##\s/.test(line)) {
      break;
    }
    if (inside) {
      const match = line.match(/^\s*-\s+(.+)/);
      if (match) {
        scope.push(match[1].trim());
      }
    }
  }

  return scope;
}

export function parseNonGoalsFromPlan(planContent: string): string[] {
  const nonGoals: string[] = [];
  const lines = planContent.split(/\r?\n/);
  let inside = false;

  for (const line of lines) {
    if (/^##\s*Non[- ]?goals\b/i.test(line)) {
      inside = true;
      continue;
    }
    if (inside && /^##\s/.test(line)) {
      break;
    }
    if (inside) {
      const match = line.match(/^\s*-\s+(.+)/);
      if (match) {
        nonGoals.push(match[1].trim());
      }
    }
  }

  return nonGoals;
}

export function extractFilePatterns(items: string[]): RegExp[] {
  const patterns: RegExp[] = [];

  for (const item of items) {
    const backtickMatches = item.match(/`([^`]+)`/g);
    if (backtickMatches && backtickMatches.length > 0) {
      for (const m of backtickMatches) {
        const inner = m.slice(1, -1).trim();
        if (/[/\\]/.test(inner) || /\.\w+$/.test(inner)) {
          const escaped = inner.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          try {
            patterns.push(new RegExp(escaped, "i"));
          } catch {
            // skip invalid
          }
        }
      }
    } else {
      const escaped = item.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      try {
        patterns.push(new RegExp(escaped, "i"));
      } catch {
        // skip invalid
      }
    }
  }

  return patterns;
}

export function compareChangesToScope(
  changedFiles: string[],
  scopeItems: string[],
  nonGoalItems: string[],
): ScopeCheckResult {
  const inScope: string[] = [];
  const outOfScope: string[] = [];
  const warnings: string[] = [];

  if (scopeItems.length === 0) {
    warnings.push("Plan scope is empty. Cannot verify that changes are in scope.");
    return { inScope: [], outOfScope: changedFiles, warnings };
  }

  const scopePatterns = extractFilePatterns(scopeItems);
  const nonGoalPatterns = extractFilePatterns(nonGoalItems);

  for (const file of changedFiles) {
    if (file.startsWith(".agent-harness/") || file === ".agent-harness") {
      continue;
    }

    const matchesScope = scopePatterns.some((p) => p.test(file));
    const matchesNonGoal = nonGoalPatterns.some((p) => p.test(file));

    if (matchesNonGoal && !matchesScope) {
      outOfScope.push(file);
      warnings.push(`${file} matches a non-goal pattern`);
    } else if (matchesScope) {
      inScope.push(file);
    } else if (scopePatterns.length > 0) {
      outOfScope.push(file);
    } else {
      inScope.push(file);
    }
  }

  if (outOfScope.length > 0) {
    warnings.push(
      `${outOfScope.length} file(s) changed outside the plan scope. Review whether these changes are intentional.`,
    );
  }

  return { inScope, outOfScope, warnings };
}

export async function checkScopeAlignment(
  runDir: string,
  changedFiles: string[],
): Promise<ScopeCheckResult> {
  const planContent = await readTextIfExists(`${runDir}/plan.md`);

  if (!planContent) {
    return {
      inScope: [],
      outOfScope: changedFiles,
      warnings: ["No plan.md found. Cannot compare changes to scope."],
    };
  }

  const scope = parseScopeFromPlan(planContent);
  const nonGoals = parseNonGoalsFromPlan(planContent);

  return compareChangesToScope(changedFiles, scope, nonGoals);
}