import Link from "next/link";

import {
  AUTHORITY_PILLAR_PATH,
  COMMERCIAL_PILLAR_PATH,
  INSTRUCTION_CHECKER_PATH,
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
  const steps = [
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
  ].filter((step) => step.href !== currentPath);

  return (
    <section className="authority-path-panel" aria-labelledby="authority-path-heading">
      <div>
        <span>Decision and evidence path</span>
        <h2 id="authority-path-heading">Move from tool choice to verifiable policy</h2>
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
