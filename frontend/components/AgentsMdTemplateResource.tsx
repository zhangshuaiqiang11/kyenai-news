import React from "react";

import { agentsMdVariantTemplates, instructionTemplates } from "../lib/instruction-resources";
import type { InstructionTemplate } from "../lib/types";
import { AgentsMdStarterBuilder } from "./AgentsMdStarterBuilder";
import { CodeExampleCard } from "./CodeExampleCard";

function getRootAgentsTemplate(): InstructionTemplate {
  const template = instructionTemplates.find((item) => item.id === "agents-md-template");
  if (!template) {
    throw new Error("Missing AGENTS.md template in instruction resources");
  }
  return template;
}

const rootTemplate = getRootAgentsTemplate();

const githubExamplesUrl =
  "https://github.com/zhangshuaiqiang11/kyenai-news/tree/codex/develop/artifacts/kyenai-agent-instruction-files";

const loadingOrder = [
  {
    scope: "Global defaults",
    files: "~/.codex/AGENTS.override.md → AGENTS.md",
    note: "Codex uses the first non-empty file at the global level.",
  },
  {
    scope: "Repository root",
    files: "AGENTS.override.md → AGENTS.md → configured fallback",
    note: "At most one instruction file is included for each directory.",
  },
  {
    scope: "Nested directory",
    files: "nearest AGENTS.override.md or AGENTS.md",
    note: "Files closer to the working directory appear later and override earlier guidance.",
  },
] as const;

export function AgentsMdTemplateResource() {
  return (
    <>
      <AgentsMdStarterBuilder />
      <section className="instruction-resource-section" aria-labelledby="agents-md-template-heading">
        <div className="instruction-resource-heading">
          <div>
            <p className="instruction-resource-eyebrow">Starter files</p>
            <h2 id="agents-md-template-heading">AGENTS.md template previews</h2>
          </div>
          <p>Copy the root template first, then choose the Node.js, Python, or monorepo edition that matches the repository.</p>
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
          {agentsMdVariantTemplates.map((template) => (
            <CodeExampleCard
              key={template.id}
              title={template.title}
              purpose={template.purpose}
              body={template.body}
              cautions={template.cautions}
              downloadHref={`/resources/instruction-files/${template.downloadName}`}
              downloadName={template.downloadName}
            />
          ))}
        </div>

        <section className="agents-loading-order" aria-labelledby="agents-loading-order-heading">
          <div className="instruction-resource-heading">
            <div>
              <p className="instruction-resource-eyebrow">Codex precedence</p>
              <h3 id="agents-loading-order-heading">How AGENTS.md loading priority works</h3>
            </div>
            <p>Verified against OpenAI&apos;s AGENTS.md documentation on July 19, 2026.</p>
          </div>
          <ol>
            {loadingOrder.map((step, index) => (
              <li key={step.scope}>
                <span>{index + 1}</span>
                <div>
                  <strong>{step.scope}</strong>
                  <code>{step.files}</code>
                  <p>{step.note}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="agents-loading-limit">
            Codex builds this chain once per run, skips empty files, and stops when the combined instruction size reaches the configured limit. Keep shared policy near the root and local exceptions near the code they govern.
          </p>
        </section>

        <aside className="agents-github-asset">
          <div>
            <p className="instruction-resource-eyebrow">GitHub example package</p>
            <h3>Review every template and generated resource in source control</h3>
            <p>The repository package includes templates, compatibility data, a sample instruction tree, and a deterministic verifier.</p>
          </div>
          <a href={githubExamplesUrl} rel="noreferrer" target="_blank">Open the GitHub examples</a>
        </aside>
      </section>
    </>
  );
}
