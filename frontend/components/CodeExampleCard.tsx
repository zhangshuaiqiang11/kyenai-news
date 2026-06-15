import React from "react";

export type CodeExampleCardProps = {
  title: string;
  purpose: string;
  body: string;
  cautions: string[];
  downloadHref?: string;
  downloadName?: string;
};

export function CodeExampleCard({
  title,
  purpose,
  body,
  cautions,
  downloadHref,
  downloadName,
}: CodeExampleCardProps) {
  return (
    <article className="instruction-template-card">
      <div>
        <h3>{title}</h3>
        <p>{purpose}</p>
      </div>

      <pre>
        <code>{body.trim()}</code>
      </pre>

      <div className="instruction-template-caution">
        <strong>Cautions</strong>
        <ul>
          {cautions.map((caution) => (
            <li key={caution}>{caution}</li>
          ))}
        </ul>
      </div>

      {downloadHref && downloadName ? (
        <a className="instruction-download-link" href={downloadHref} download={downloadName}>
          Download {downloadName}
        </a>
      ) : null}
    </article>
  );
}
