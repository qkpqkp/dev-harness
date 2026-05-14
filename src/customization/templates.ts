export const PROJECT_TEMPLATE = `# Project

## Purpose

Describe what this project does and who it serves.

## Architecture Notes

- Add the important modules, boundaries, and data flow here.

## AI Collaboration Notes

- Keep context concise.
- Prefer minimal patches.
- Match process weight to task risk: small tasks need less ceremony, larger or unclear tasks need a short plan.
- Escalate when scope grows or uncertainty appears.
- Record important decisions in DECISIONS.md.

## Behavior Policy

Customize how agents handle stuck situations. Adjust thresholds and actions to match your preferences.

- **Max retries**: 3 (how many times to retry the same fix before moving on)
- **On blocked**: skip and report (what to do when stuck: skip and report / stop and ask / keep trying)
- **Report in**: summary.md (where to record unresolved failures)
`;

export const CHECKS_TEMPLATE = `# Checks

Document the commands agents should run before finishing work.

## Required

<!-- Add your project-specific commands here, e.g.: -->
<!-- - \`pnpm typecheck\` -->
<!-- - \`pnpm lint\` -->
<!-- - \`pnpm test\` -->

## Optional

<!-- Add slower or environment-dependent checks here. -->

## Prohibitions

<!-- List files, directories, or patterns agents must not modify. -->
`;

export const DECISIONS_TEMPLATE = `# Decisions

Record durable project decisions that future AI sessions should not re-discover.

## Entries
`;

export const RUNS_TEMPLATE = `# Runs

Generated workflow runs are indexed here.

`;

// Agent configuration files
// These are generated at project root during init-project.
// Each agent reads a different config file; content is fundamentally the same.
// The devh section is wrapped in markers so we can update it without
// overwriting user-added content.

export const DEVH_SECTION_START = "<!-- devh:start -->";
export const DEVH_SECTION_END = "<!-- devh:end -->";

const AGENT_WORKFLOW_BODY = `## Agent Rules

Read \`.agent-harness/philosophy.md\` for the full principles, then follow these rules:

- Classify task risk before editing: small, medium, or large.
- Use the lightest process that fits the risk.
- For small clear tasks, a full plan is optional unless scope is unclear.
- For medium or large tasks, create or update a short plan before editing.
- Understand local context before changing files.
- Keep changes inside the agreed scope.
- If scope grows, stop and update the plan or ask.
- Run relevant verification before finishing.
- Review your diff before the final response.
- Update docs and tests when behavior changes.
- Record durable decisions in \`.agent-harness/DECISIONS.md\` when behavior or architecture changes.

## Quick Reference

\`\`\`
devh init-project          # Set up .agent-harness/ directory
devh plan "task"           # Create a run and plan.md
devh context               # Collect git, structure, and harness context
devh verify                # Run checks (auto-detected + CHECKS.md)
devh review                # Diff review with scope comparison
devh summarize             # Close run, generate summary
\`\`\`
`;

const DEVH_SECTION = `${DEVH_SECTION_START}\n${AGENT_WORKFLOW_BODY}\n${DEVH_SECTION_END}`;

export const AGENTS_MD = `# Agent Instructions

This project uses Dev Harness for AI-assisted development workflow.
${DEVH_SECTION}
`;

export const CLAUDE_MD = `# Claude Code Instructions

This project uses Dev Harness for AI-assisted development workflow.
${DEVH_SECTION}
`;

export const CURSORRULES = `This project uses Dev Harness for AI-assisted development workflow.
${DEVH_SECTION}
`;

export const GEMINI_MD = `# Gemini Instructions

This project uses Dev Harness for AI-assisted development workflow.
${DEVH_SECTION}
`;

export type AgentConfig = {
  filename: string;
  content: string;
  description: string;
  supportsMarkers: boolean;
};

export const AGENT_CONFIGS: AgentConfig[] = [
  { filename: "AGENTS.md", content: AGENTS_MD, description: "Codex / opencode", supportsMarkers: true },
  { filename: "CLAUDE.md", content: CLAUDE_MD, description: "Claude Code", supportsMarkers: true },
  { filename: ".cursorrules", content: CURSORRULES, description: "Cursor", supportsMarkers: true },
  { filename: "GEMINI.md", content: GEMINI_MD, description: "Gemini", supportsMarkers: true },
];

export function updateDevhSection(existingContent: string, newSection: string): string {
  const startIndex = existingContent.indexOf(DEVH_SECTION_START);
  const endIndex = existingContent.indexOf(DEVH_SECTION_END);

  if (startIndex === -1 || endIndex === -1) {
    return existingContent + "\n" + newSection + "\n";
  }

  const before = existingContent.slice(0, startIndex);
  const after = existingContent.slice(endIndex + DEVH_SECTION_END.length);

  return before + newSection + "\n" + after;
}
