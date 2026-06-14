import React from "react";

import { repositoryTree } from "../lib/instruction-resources";

export function RepositoryTree() {
  return (
    <section className="instruction-resource-section" aria-labelledby="repository-tree-heading">
      <div className="instruction-resource-heading">
        <div>
          <p className="instruction-resource-eyebrow">Example layout</p>
          <h2 id="repository-tree-heading">Repository instruction tree</h2>
        </div>
      </div>

      <pre className="instruction-repository-tree">
        <code>{repositoryTree}</code>
      </pre>
    </section>
  );
}

