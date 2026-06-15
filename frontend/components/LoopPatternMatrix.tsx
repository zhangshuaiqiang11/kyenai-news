import React from "react";

import { loopEngineeringVerifiedAt, loopPatterns } from "../lib/loop-engineering-resource";

export function LoopPatternMatrix() {
  return (
    <section className="instruction-resource-section" aria-labelledby="loop-pattern-matrix-heading">
      <div className="instruction-resource-heading">
        <div>
          <p className="instruction-resource-eyebrow">Pattern catalog</p>
          <h2 id="loop-pattern-matrix-heading">Loop engineering pattern matrix</h2>
        </div>
        <p>Verified from practitioner and vendor guidance on {loopEngineeringVerifiedAt}.</p>
      </div>

      <aside className="instruction-direct-answer" role="note" aria-label="Direct answer">
        <strong>Direct answer</strong>
        <p>
          Loop engineering is not one cron script. It is a repeating <strong>act → observe → reason</strong> cycle
          with explicit stop rules. Pick the pattern by task shape, then add termination before you add parallelism.
        </p>
      </aside>

      <div className="instruction-table-scroll">
        <table aria-label="Loop engineering patterns">
          <thead>
            <tr>
              <th scope="col">Pattern</th>
              <th scope="col">Best for</th>
              <th scope="col">Termination</th>
              <th scope="col">Tool examples</th>
              <th scope="col">Risk to control</th>
            </tr>
          </thead>
          <tbody>
            {loopPatterns.map((record) => (
              <tr key={record.id}>
                <th scope="row" data-label="Pattern">
                  {record.pattern}
                </th>
                <td data-label="Best for">{record.bestFor}</td>
                <td data-label="Termination">{record.termination}</td>
                <td data-label="Tool examples">{record.toolExamples}</td>
                <td data-label="Risk to control">{record.risk}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
