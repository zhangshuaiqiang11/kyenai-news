import { useMemo, useState } from "react";

import {
  diagnoseMcpDiscovery,
  mcpDiscoveryChecks,
  mcpDiscoveryVerifiedAt,
  type McpDiscoveryClient,
  type McpDiscoverySymptom,
  type McpDiscoveryTransport,
} from "../lib/mcp-tool-discovery";

export function McpToolDiscoveryDebugger() {
  const [symptom, setSymptom] = useState<McpDiscoverySymptom>("connected-zero-tools");
  const [client, setClient] = useState<McpDiscoveryClient>("claude-code");
  const [transport, setTransport] = useState<McpDiscoveryTransport>("stdio");
  const diagnosis = useMemo(
    () => diagnoseMcpDiscovery(symptom, client, transport),
    [client, symptom, transport],
  );

  return (
    <div className="guide-resource-sections">
      <section className="instruction-resource-section" aria-labelledby="mcp-debugger-heading">
        <div className="instruction-resource-heading">
          <div>
            <p className="instruction-resource-eyebrow">Verified {mcpDiscoveryVerifiedAt}</p>
            <h2 id="mcp-debugger-heading">MCP tool discovery debugger</h2>
          </div>
          <p>Choose the exact symptom. The result starts at the first layer that can prove or disprove the failure.</p>
        </div>

        <div className="mcp-debugger-fields">
          <label>
            Symptom
            <select value={symptom} onChange={(event) => setSymptom(event.target.value as McpDiscoverySymptom)}>
              <option value="server-missing">Server is missing from the client</option>
              <option value="connected-zero-tools">Server is connected but shows 0 tools</option>
              <option value="tools-listed-not-visible">Inspector lists tools, client does not</option>
              <option value="tools-visible-not-called">Tool is visible but never called</option>
              <option value="tools-stale">Changed tools are stale</option>
            </select>
          </label>
          <label>
            Client
            <select value={client} onChange={(event) => setClient(event.target.value as McpDiscoveryClient)}>
              <option value="claude-code">Claude Code</option>
              <option value="cursor">Cursor</option>
              <option value="github-copilot">GitHub Copilot</option>
              <option value="other">Another MCP client</option>
            </select>
          </label>
          <label>
            Transport
            <select value={transport} onChange={(event) => setTransport(event.target.value as McpDiscoveryTransport)}>
              <option value="stdio">Local stdio</option>
              <option value="http">Streamable HTTP</option>
            </select>
          </label>
        </div>

        <section className="mcp-debugger-result" aria-live="polite" aria-labelledby="mcp-debugger-result-heading">
          <p className="instruction-resource-eyebrow">Recommended first move</p>
          <h3 id="mcp-debugger-result-heading">{diagnosis.title}</h3>
          <dl>
            <div><dt>Check</dt><dd>{diagnosis.firstCheck}</dd></div>
            <div><dt>Proof</dt><dd>{diagnosis.proof}</dd></div>
            <div><dt>Fix</dt><dd>{diagnosis.nextFix}</dd></div>
            <div><dt>Client note</dt><dd>{diagnosis.clientNote}</dd></div>
            <div><dt>Transport note</dt><dd>{diagnosis.transportNote}</dd></div>
          </dl>
        </section>

        <div className="mcp-download-links">
          <a href="/resources/mcp-tool-discovery-debug-checklist.md" download>
            Download debug worksheet
          </a>
          <a href="https://modelcontextprotocol.io/docs/tools/inspector">
            Open official MCP Inspector guide
          </a>
        </div>
      </section>

      <section className="instruction-resource-section" aria-labelledby="mcp-debug-matrix-heading">
        <div className="instruction-resource-heading">
          <div>
            <p className="instruction-resource-eyebrow">Crawlable fault tree</p>
            <h2 id="mcp-debug-matrix-heading">8 checks from config to invocation</h2>
          </div>
          <p>Run the checks in order unless your symptom already proves an earlier layer passed.</p>
        </div>
        <div className="instruction-table-scroll">
          <table aria-label="MCP tool discovery troubleshooting matrix">
            <thead>
              <tr>
                <th scope="col">Layer</th>
                <th scope="col">Symptom</th>
                <th scope="col">Test</th>
                <th scope="col">Pass condition</th>
                <th scope="col">Fix</th>
              </tr>
            </thead>
            <tbody>
              {mcpDiscoveryChecks.map((check) => (
                <tr key={check.id}>
                  <th scope="row" data-label="Layer">{check.layer}</th>
                  <td data-label="Symptom">{check.symptom}</td>
                  <td data-label="Test">{check.test}</td>
                  <td data-label="Pass condition">{check.passCondition}</td>
                  <td data-label="Fix">{check.fix}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
