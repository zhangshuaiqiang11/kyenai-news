import React from "react";

import { instructionTemplates } from "../lib/instruction-resources";
import { CodeExampleCard } from "./CodeExampleCard";

export function TemplateDownloads() {
  return (
    <section className="instruction-resource-section" aria-labelledby="template-downloads-heading">
      <div className="instruction-resource-heading">
        <div>
          <p className="instruction-resource-eyebrow">Starter files</p>
          <h2 id="template-downloads-heading">Instruction template downloads</h2>
        </div>
      </div>

      <div className="instruction-template-grid">
        {instructionTemplates.map((template) => (
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
    </section>
  );
}

