import React from "react";

import { instructionTemplates } from "../lib/instruction-resources";

const previewLines = (body: string) => body.split("\n").slice(0, 5).join("\n");

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
          <article className="instruction-template-card" key={template.id}>
            <div>
              <h3>{template.title}</h3>
              <p>{template.purpose}</p>
            </div>

            <pre>
              <code>{previewLines(template.body)}</code>
            </pre>

            <div className="instruction-template-caution">
              <strong>Cautions</strong>
              <ul>
                {template.cautions.map((caution) => (
                  <li key={caution}>{caution}</li>
                ))}
              </ul>
            </div>

            <a
              className="instruction-download-link"
              href={`/resources/instruction-files/${template.downloadName}`}
              download={template.downloadName}
            >
              Download {template.downloadName}
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

