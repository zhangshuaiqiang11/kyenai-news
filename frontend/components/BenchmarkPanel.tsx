import React from "react";

import { benchmarkProtocol } from "../lib/instruction-resources";
import type { BenchmarkRun } from "../lib/types";

const toolNames: Record<BenchmarkRun["toolId"], string> = {
  "openai-codex": "OpenAI Codex",
  "claude-code": "Claude Code",
  "github-copilot": "GitHub Copilot",
  cursor: "Cursor",
};

const formatSuccess = (run: BenchmarkRun) => {
  if (run.verificationPassed === null) {
    return "Not measured";
  }

  return run.verificationPassed ? "Passed" : "Did not pass";
};

const formatElapsed = (seconds: number | null) =>
  seconds === null ? "Not measured" : `${seconds} seconds`;

const formatCost = (cost: number | null) =>
  cost === null ? "Not measured" : `$${cost.toFixed(2)}`;

const formatCount = (count: number | null) =>
  count === null ? "Not measured" : count.toLocaleString("en-US");

export function BenchmarkPanel() {
  return (
    <section className="instruction-resource-section" aria-labelledby="benchmark-heading">
      <div className="instruction-resource-heading">
        <div>
          <p className="instruction-resource-eyebrow">Controlled comparison</p>
          <h2 id="benchmark-heading">Same-repository benchmark</h2>
        </div>
        <p>{benchmarkProtocol.repository}</p>
      </div>

      <div className="instruction-benchmark-protocol">
        <div>
          <h3>Task</h3>
          <p>{benchmarkProtocol.task}</p>
        </div>
        <div>
          <h3>Success criteria</h3>
          <ul>
            {benchmarkProtocol.successCriteria.map((criterion) => (
              <li key={criterion}>{criterion}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="instruction-table-scroll">
        <table aria-label="Benchmark results">
          <thead>
            <tr>
              <th scope="col">Tool</th>
              <th scope="col">Success</th>
              <th scope="col">Elapsed time</th>
              <th scope="col">Measured cost</th>
              <th scope="col">Human interventions</th>
              <th scope="col">Files changed</th>
            </tr>
          </thead>
          <tbody>
            {benchmarkProtocol.runs.map((run) => (
              <tr key={run.id}>
                <th scope="row">{toolNames[run.toolId]}</th>
                <td>{formatSuccess(run)}</td>
                <td>{formatElapsed(run.elapsedSeconds)}</td>
                <td>{formatCost(run.measuredCostUsd)}</td>
                <td>{formatCount(run.humanInterventions)}</td>
                <td>{formatCount(run.filesChanged)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
