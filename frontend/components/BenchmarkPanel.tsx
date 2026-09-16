import React from "react";

import {
  getVisibleBenchmarkColumns,
  hasAnyMeasuredBenchmarkData,
} from "../lib/benchmark-display";
import { benchmarkProtocol } from "../lib/instruction-resources";

const toolNames: Record<(typeof benchmarkProtocol.runs)[number]["toolId"], string> = {
  "openai-codex": "OpenAI Codex",
  "claude-code": "Claude Code",
  "github-copilot": "GitHub Copilot",
  cursor: "Cursor",
};

const benchmarkResultsUrl = "/resources/instruction-files/benchmark-results.json";

export function BenchmarkPanel() {
  const { runs } = benchmarkProtocol;
  const hasMeasuredData = hasAnyMeasuredBenchmarkData(runs);
  const visibleColumns = getVisibleBenchmarkColumns(runs);

  return (
    <section className="instruction-resource-section" aria-labelledby="benchmark-heading">
      <div className="instruction-resource-heading">
        <div>
          <p className="instruction-resource-eyebrow">Controlled comparison</p>
          <h2 id="benchmark-heading">Same-repository benchmark</h2>
        </div>
        <p>{benchmarkProtocol.repository} · {benchmarkProtocol.revision}</p>
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

      {hasMeasuredData ? (
        <div className="instruction-table-scroll">
          <table aria-label="Benchmark results">
            <thead>
              <tr>
                <th scope="col">Tool</th>
                {visibleColumns.map((column) => (
                  <th key={column.key} scope="col">
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {runs.map((run) => (
                <tr key={run.id}>
                  <th scope="row" data-label="Tool">
                    {toolNames[run.toolId]}
                  </th>
                  {visibleColumns.map((column) => (
                    <td key={column.key} data-label={column.label}>
                      {column.format(run)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <aside
          className="instruction-direct-answer instruction-benchmark-pending"
          role="note"
          aria-label="Benchmark status"
        >
          <strong>Benchmark not yet run</strong>
          <p>
            No controlled run has been completed for this protocol. Numeric metrics stay null until
            a run finishes; this panel does not publish placeholder numbers and supports no performance
            conclusion yet. Use the task and success criteria above, then publish measured results in{" "}
            <a href={benchmarkResultsUrl}>benchmark-results.json</a>.
          </p>
        </aside>
      )}
      <div className="mcp-download-links" aria-label="Public benchmark evidence package">
        <a href={benchmarkProtocol.publicEvidence.methodology} download>Methodology</a>
        <a href={benchmarkProtocol.publicEvidence.tasks} download>Task manifest</a>
        <a href={benchmarkProtocol.publicEvidence.results} download>Results JSON</a>
        <a href={benchmarkProtocol.publicEvidence.manifest} download>Manifest</a>
        <a href={benchmarkProtocol.publicEvidence.rawLogs} download>Raw-log schema</a>
        <a href={benchmarkProtocol.publicEvidence.citation} download>Citation</a>
      </div>
    </section>
  );
}
