import React from "react";

import { claudeCodeSetupExamples, claudeCodeSetupVerifiedAt } from "../lib/claude-code-setup-resources";
import { CodeExampleCard } from "./CodeExampleCard";

export function ClaudeCodeSetupResources() {
  return (
    <section className="instruction-resource-section" aria-labelledby="claude-code-setup-heading">
      <div className="instruction-resource-heading">
        <div>
          <p className="instruction-resource-eyebrow">Verified {claudeCodeSetupVerifiedAt}</p>
          <h2 id="claude-code-setup-heading">Claude Code setup examples</h2>
        </div>
        <p>Hooks handle deterministic lifecycle actions. MCP servers expose external tools. Skills hold reusable playbooks.</p>
      </div>

      <div className="instruction-template-grid">
        {claudeCodeSetupExamples.map((example) => (
          <CodeExampleCard
            key={example.id}
            title={example.title}
            purpose={example.purpose}
            body={example.body}
            cautions={example.cautions}
          />
        ))}
      </div>
    </section>
  );
}
