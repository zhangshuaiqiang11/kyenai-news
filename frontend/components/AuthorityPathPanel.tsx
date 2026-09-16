import Link from "next/link";

import {
  AUTHORITY_PILLAR_PATH,
  COMMERCIAL_PILLAR_PATH,
  INSTRUCTION_CHECKER_PATH,
  INSTRUCTION_TEMPLATE_PATH,
  COPILOT_SUPPORT_PATH,
  MCP_TROUBLESHOOTING_PATH,
  MCP_SECURITY_PATH,
  CURSOR_ENTERPRISE_PATH,
  RESEARCH_HUB_PATH,
} from "../lib/authority-paths";

type AuthorityPathPanelProps = {
  currentPath: string;
  includeChecker?: boolean;
};

export function AuthorityPathPanel({
  currentPath,
  includeChecker = false,
}: AuthorityPathPanelProps) {
  const isMcpPath = [MCP_TROUBLESHOOTING_PATH, MCP_SECURITY_PATH, CURSOR_ENTERPRISE_PATH].includes(currentPath);
  const isInstructionPath = [AUTHORITY_PILLAR_PATH, INSTRUCTION_TEMPLATE_PATH, COPILOT_SUPPORT_PATH, INSTRUCTION_CHECKER_PATH].includes(currentPath);
  const instructionSteps = [
    {
      href: AUTHORITY_PILLAR_PATH,
      label: "Choose the instruction file for each agent surface",
      description: "Map AGENTS.md, CLAUDE.md, Copilot instructions, and Cursor rules to documented readers.",
    },
    {
      href: INSTRUCTION_TEMPLATE_PATH,
      label: "Build an AGENTS.md template for the repository",
      description: "Start with verified commands, edit boundaries, safety rules, and completion checks.",
    },
    {
      href: COPILOT_SUPPORT_PATH,
      label: "Check whether a Copilot surface reads CLAUDE.md",
      description: "Use the current surface matrix before consolidating Copilot and Claude instructions.",
    },
    {
      href: INSTRUCTION_CHECKER_PATH,
      label: "Audit the instruction file before rollout",
      description: "Run browser-only checks without uploading repository guidance.",
    },
  ];
  const mcpSteps = [
    {
      href: MCP_TROUBLESHOOTING_PATH,
      label: "Diagnose an MCP server that is not showing tools",
      description: "Locate the first failing layer from configuration through tools/list and invocation.",
    },
    {
      href: MCP_SECURITY_PATH,
      label: "Apply the MCP server security checklist",
      description: "Review authentication, scopes, tool permissions, logging, revocation, and denied cases.",
    },
    {
      href: CURSOR_ENTERPRISE_PATH,
      label: "Review Cursor Enterprise controls and retention caveats",
      description: "Verify workspace policy, Privacy Mode, model and MCP controls, and contract evidence.",
    },
  ];
  const generalSteps = [
    {
      href: COMMERCIAL_PILLAR_PATH,
      label: "Compare Codex, Claude Code, Cursor, and Copilot",
      description: "Choose the operating model and the two tools worth piloting.",
    },
    {
      href: AUTHORITY_PILLAR_PATH,
      label: "Verify AGENTS.md, CLAUDE.md, Copilot, and Cursor rules",
      description: "Check which instruction file each approved product surface actually reads.",
    },
    {
      href: RESEARCH_HUB_PATH,
      label: "Open the datasets, templates, and security checklists",
      description: "Download versioned evidence and cite the underlying asset rather than this summary.",
    },
    ...(includeChecker
      ? [
          {
            href: INSTRUCTION_CHECKER_PATH,
            label: "Audit an instruction file before rollout",
            description: "Run the browser-only checker for missing commands, boundaries, and proof-of-done rules.",
          },
        ]
      : []),
  ];
  const steps = (isMcpPath ? mcpSteps : isInstructionPath ? instructionSteps : generalSteps)
    .filter((step) => step.href !== currentPath)
    .filter((step) => includeChecker || step.href !== INSTRUCTION_CHECKER_PATH);

  return (
    <section className="authority-path-panel" aria-labelledby="authority-path-heading">
      <div>
        <span>Decision and evidence path</span>
        <h2 id="authority-path-heading">
          {isMcpPath ? "Move from MCP diagnosis to controlled access" : isInstructionPath ? "Move from file choice to verified instructions" : "Move from tool choice to verifiable policy"}
        </h2>
      </div>
      <ol>
        {steps.map((step) => (
          <li key={step.href}>
            <Link href={step.href}>{step.label}</Link>
            <p>{step.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
