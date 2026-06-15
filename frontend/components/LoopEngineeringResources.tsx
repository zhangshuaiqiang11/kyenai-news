import React from "react";

import { loopBuildingBlocks } from "../lib/loop-engineering-resource";
import { LoopPatternMatrix } from "./LoopPatternMatrix";

export function LoopEngineeringResources() {
  return (
    <div className="guide-resource-sections">
      <LoopPatternMatrix />
      <section className="instruction-resource-section" aria-labelledby="loop-building-blocks-heading">
        <div className="instruction-resource-heading">
          <div>
            <p className="instruction-resource-eyebrow">Anatomy</p>
            <h2 id="loop-building-blocks-heading">Five loop building blocks</h2>
          </div>
          <p>Every durable coding-agent loop needs these controls before you scale parallelism or schedules.</p>
        </div>
        <div className="guide-action-list">
          {loopBuildingBlocks.map((block) => (
            <article key={block.id}>
              <h3>{block.title}</h3>
              <p>{block.detail}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
