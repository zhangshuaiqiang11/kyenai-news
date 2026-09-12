import { useMemo, useState } from "react";

import {
  diagnoseMcpDiscovery,
  mcpDiscoveryChecks,
  mcpDiscoveryVerifiedAt,
  type McpDiscoveryClient,
  type McpDiscoverySymptom,
  type McpDiscoveryTransport,
} from "../lib/mcp-tool-discovery";
import { getCurrentPagePath, trackGrowthEvent } from "../lib/analytics";

export function McpToolDiscoveryDebugger() {
  const [symptom, setSymptom] = useState<McpDiscoverySymptom>("connected-zero-tools");
  const [client, setClient] = useState<McpDiscoveryClient>("claude-code");
  const [transport, setTransport] = useState<McpDiscoveryTransport>("stdio");
  const diagnosis = useMemo(
    () => diagnoseMcpDiscovery(symptom, client, transport),
    [client, symptom, transport],
  );
  const recordUse = (actionId: string) => trackGrowthEvent("tool_use", {
    page_path: getCurrentPagePath(),
    tool_id: "mcp_tool_discovery_debugger",
    action_id: actionId,
  });

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
            <select value={symptom} onChange={(event) => {
              setSymptom(event.target.value as McpDiscoverySymptom);
              recordUse("change_symptom");
            }}>
              <option value="server-missing">Server is missing from the client</option>
              <option value="connected-zero-tools">Server is connected but shows 0 tools</option>
              <option value="tools-listed-not-visible">Inspector lists tools, client does not</option>
              <option value="tools-visible-not-called">Tool is visible but never called</option>
              <option value="tools-stale">Changed tools are stale</option>
            </select>
          </label>
          <label>
            Client
            <select value={client} onChange={(event) => {
              setClient(event.target.value as McpDiscoveryClient);
              recordUse("change_client");
            }}>
              <option value="claude-code">Claude Code</option>
              <option value="cursor">Cursor</option>
              <option value="github-copilot">GitHub Copilot</option>
              <option value="other">Another MCP client</option>
            </select>
          </label>
          <label>
            Transport
            <select value={transport} onChange={(event) => {
              setTransport(event.target.value as McpDiscoveryTransport);
              recordUse("change_transport");
            }}>
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

      <section className="instruction-resource-section" aria-labelledby="mcp-minimal-repro-heading">
        <div className="instruction-resource-heading">
          <div>
            <p className="instruction-resource-eyebrow">Reproducible diagnosis</p>
            <h2 id="mcp-minimal-repro-heading">Minimal tools/list reproduction</h2>
          </div>
          <p>This is a diagnostic protocol, not a measured vendor benchmark.</p>
        </div>
        <ol className="guide-step-list">
          <li>Start one named server with the exact command or URL used by the client, with secrets redacted from captured output.</li>
          <li>Connect with MCP Inspector and record whether initialize declares the tools capability.</li>
          <li>Call tools/list. A passing run returns the expected names and valid input schemas; an empty list is valid only when the server intentionally exposes no tools for the presented authorization.</li>
          <li>Connect the target client with the same server and authorization. If Inspector passes but the client fails, inspect client scope, policy, cache, and tool filters.</li>
          <li>Change one tool, reconnect or emit list_changed when supported, and confirm the refreshed set before testing invocation.</li>
        </ol>
        <p className="instruction-checker-privacy">Record server and client versions, transport, expected tool names, actual result, and the first failing layer. Never publish tokens, private URLs, prompts, or tool payloads.</p>
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
