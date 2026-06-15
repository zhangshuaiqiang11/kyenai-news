import React from "react";

import { instructionTemplates } from "../lib/instruction-resources";
import type { InstructionTemplate } from "../lib/types";
import { CodeExampleCard } from "./CodeExampleCard";

function getRootAgentsTemplate(): InstructionTemplate {
  const template = instructionTemplates.find((item) => item.id === "agents-md-template");
  if (!template) {
    throw new Error("Missing AGENTS.md template in instruction resources");
  }
  return template;
}

const rootTemplate = getRootAgentsTemplate();

const nestedAgentsMdExample = `# Web app instructions

## Scope
- These instructions apply to \`apps/web/\` only.
- Follow root AGENTS.md unless this file overrides a command or boundary.

## Setup
- Install from repository root: \`npm ci\`
- Start this package: \`npm run dev --workspace=apps/web\`

## Change rules
- Keep UI changes inside \`apps/web/src/\`.
- Shared utilities live in \`packages/ui/\`; coordinate cross-package edits in one change.

## Verification
- Run \`npm run lint --workspace=apps/web\`.
- Run \`npm test --workspace=apps/web\`.
- Run \`npm run build --workspace=apps/web\` for production-facing UI changes.

## Delivery
- Summarize changed files and verification results.
- Call out cross-package impact and any skipped checks.`;

export function AgentsMdTemplateResource() {
  return (
    <section className="instruction-resource-section" aria-labelledby="agents-md-template-heading">
      <div className="instruction-resource-heading">
        <div>
          <p className="instruction-resource-eyebrow">Starter files</p>
          <h2 id="agents-md-template-heading">AGENTS.md template previews</h2>
        </div>
        <p>Copy the root template first, then add nested files only where commands or ownership differ.</p>
      </div>

      <div className="instruction-template-grid">
        <CodeExampleCard
          title={rootTemplate.title}
          purpose={rootTemplate.purpose}
          body={rootTemplate.body}
          cautions={rootTemplate.cautions}
          downloadHref={`/resources/instruction-files/${rootTemplate.downloadName}`}
          downloadName={rootTemplate.downloadName}
        />
        <CodeExampleCard
          title="Nested AGENTS.md for monorepo packages"
          purpose="Scope setup, boundaries, and verification to one package without duplicating the whole repository policy."
          body={nestedAgentsMdExample}
          cautions={[
            "Place this file at the package root, for example apps/web/AGENTS.md.",
            "Keep shared security and review rules in the root file; override only what differs locally.",
          ]}
        />
      </div>
    </section>
  );
}
