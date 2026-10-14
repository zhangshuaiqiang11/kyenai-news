export type AgentsMdStarterStack = "node" | "python" | "monorepo";

export type AgentsMdStarterInput = {
  projectName: string;
  stack: AgentsMdStarterStack;
  installCommand: string;
  testCommand: string;
  lintCommand: string;
  buildCommand: string;
  preferredPaths: string;
  restrictedPaths: string;
};

const starterDefaults: Record<AgentsMdStarterStack, Omit<AgentsMdStarterInput, "projectName" | "stack">> = {
  node: {
    installCommand: "npm ci",
    testCommand: "npm test",
    lintCommand: "npm run lint",
    buildCommand: "npm run build",
    preferredPaths: "src/, tests/",
    restrictedPaths: ".env*, node_modules/, dist/",
  },
  python: {
    installCommand: "uv sync",
    testCommand: "pytest",
    lintCommand: "ruff check .",
    buildCommand: "python -m build",
    preferredPaths: "src/, tests/",
    restrictedPaths: ".env*, .venv/, dist/",
  },
  monorepo: {
    installCommand: "pnpm install --frozen-lockfile",
    testCommand: "pnpm test",
    lintCommand: "pnpm lint",
    buildCommand: "pnpm build",
    preferredPaths: "apps/, packages/",
    restrictedPaths: ".env*, node_modules/, dist/, generated/",
  },
};

const stackLabels: Record<AgentsMdStarterStack, string> = {
  node: "Node.js",
  python: "Python",
  monorepo: "monorepo",
};

export function getAgentsMdStarterDefaults(
  stack: AgentsMdStarterStack,
  projectName = "My project",
): AgentsMdStarterInput {
  return { projectName, stack, ...starterDefaults[stack] };
}

function singleLine(value: string, fallback: string): string {
  const normalized = value
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/[`<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 240);
  return normalized || fallback;
}

export function renderAgentsMdStarter(input: AgentsMdStarterInput): string {
  const projectName = singleLine(input.projectName, "My project");
  const installCommand = singleLine(input.installCommand, starterDefaults[input.stack].installCommand);
  const testCommand = singleLine(input.testCommand, starterDefaults[input.stack].testCommand);
  const lintCommand = singleLine(input.lintCommand, starterDefaults[input.stack].lintCommand);
  const buildCommand = singleLine(input.buildCommand, starterDefaults[input.stack].buildCommand);
  const preferredPaths = singleLine(input.preferredPaths, starterDefaults[input.stack].preferredPaths);
  const restrictedPaths = singleLine(input.restrictedPaths, starterDefaults[input.stack].restrictedPaths);

  return `# AGENTS.md

## Project

- ${projectName} is a ${stackLabels[input.stack]} repository.
- These instructions apply to the entire repository unless a nearer AGENTS.md overrides them.

## Setup

- Install dependencies with \`${installCommand}\`.

## Verification

- Run \`${testCommand}\` after changing behavior.
- Run \`${lintCommand}\` before handoff.
- Run \`${buildCommand}\` when the change affects packaging or production output.

## Safe edit boundaries

- Prefer edits in ${preferredPaths}.
- Do not read or modify secret files or ${restrictedPaths} without explicit approval.
- Never expose credentials, delete data, or write to production systems.

## Definition of done

- Keep the change scoped and follow the nearest repository instructions.
- Report changed files, checks run, skipped checks, and remaining risks.
`;
}
