import React from "react";

import {
  mcpSecurityAuthenticationMatrix,
  mcpSecurityConfigExample,
  mcpSecurityControls,
  mcpSecurityPermissionMatrix,
  mcpSecurityReviewPolicy,
  mcpSecurityReviewPreview,
  mcpSecurityThreats,
  mcpSecurityVerifiedAt,
} from "../lib/mcp-security-resource";
import { CodeExampleCard } from "./CodeExampleCard";

const claimLabels = {
  "official-mcp": "Official MCP requirement or guidance",
  "kyenai-operational": "KyenAI operational recommendation",
} as const;

export function McpSecurityControls() {
  return (
    <div className="guide-resource-sections">
      <section className="instruction-resource-section" aria-labelledby="mcp-threat-model-heading">
        <div className="instruction-resource-heading">
          <div>
            <p className="instruction-resource-eyebrow">Verified {mcpSecurityVerifiedAt}</p>
            <h2 id="mcp-threat-model-heading">MCP security threat model</h2>
          </div>
          <p>Review the server, client, credentials, data, network, and deployment as one trust boundary.</p>
        </div>
        <div className="guide-action-list">
          {mcpSecurityThreats.map((threat) => (
            <article key={threat.id}>
              <h3>{threat.title}</h3>
              <p>{threat.description}</p>
              <p>
                <strong>Claim basis:</strong> {claimLabels[threat.claimType]}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="instruction-resource-section" aria-labelledby="mcp-controls-heading">
        <div className="instruction-resource-heading">
          <div>
            <p className="instruction-resource-eyebrow">Launch controls</p>
            <h2 id="mcp-controls-heading">MCP security control checklist</h2>
          </div>
        </div>
        <ul className="guide-checklist">
          {mcpSecurityControls.map((control) => (
            <li key={control.id}>
              <strong>{control.title}</strong>
              <p>{control.guidance}</p>
              <p>
                <strong>Launch check:</strong> {control.launchCheck}
              </p>
              <small>{claimLabels[control.claimType]}</small>
            </li>
          ))}
        </ul>
      </section>

      <section className="instruction-resource-section" aria-labelledby="mcp-permission-matrix-heading">
        <div className="instruction-resource-heading">
          <div>
            <p className="instruction-resource-eyebrow">Capability decisions</p>
            <h2 id="mcp-permission-matrix-heading">MCP permission matrix</h2>
          </div>
        </div>
        <div className="instruction-table-scroll">
          <table aria-label="MCP permission matrix">
            <thead>
              <tr>
                <th scope="col">Capability</th>
                <th scope="col">Default</th>
                <th scope="col">Data risk</th>
                <th scope="col">Approval</th>
                <th scope="col">Logging</th>
                <th scope="col">Launch gate</th>
              </tr>
            </thead>
            <tbody>
              {mcpSecurityPermissionMatrix.map((row) => (
                <tr key={row.id}>
                  <th scope="row" data-label="Capability">
                    {row.capability}
                  </th>
                  <td data-label="Default">{row.default}</td>
                  <td data-label="Data risk">{row.dataRisk}</td>
                  <td data-label="Approval">{row.approval}</td>
                  <td data-label="Logging">{row.logging}</td>
                  <td data-label="Launch gate">{row.launchGate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="instruction-resource-section" aria-labelledby="mcp-authentication-matrix-heading">
        <div className="instruction-resource-heading">
          <div>
            <p className="instruction-resource-eyebrow">Authentication choices</p>
            <h2 id="mcp-authentication-matrix-heading">OAuth, API key, and mTLS comparison</h2>
          </div>
        </div>
        <div className="instruction-table-scroll">
          <table aria-label="MCP authentication comparison">
            <thead>
              <tr>
                <th scope="col">Option</th>
                <th scope="col">Use when</th>
                <th scope="col">Main risk</th>
                <th scope="col">Launch gate</th>
              </tr>
            </thead>
            <tbody>
              {mcpSecurityAuthenticationMatrix.map((row) => (
                <tr key={row.id}>
                  <th scope="row" data-label="Option">
                    {row.option}
                  </th>
                  <td data-label="Use when">{row.useWhen}</td>
                  <td data-label="Main risk">{row.mainRisk}</td>
                  <td data-label="Launch gate">{row.launchGate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="instruction-resource-section" aria-labelledby="mcp-review-heading">
        <div className="instruction-resource-heading">
          <div>
            <p className="instruction-resource-eyebrow">Starter files</p>
            <h2 id="mcp-review-heading">MCP security review template</h2>
          </div>
          <p>Use this structure to record server profile, threats, controls, permissions, validation, and sign-off.</p>
        </div>
        <div className="instruction-template-grid instruction-template-grid-single">
          <CodeExampleCard
            title="MCP security review"
            purpose="Document one named server, its capabilities, launch gates, and evidence before production use."
            body={mcpSecurityReviewPreview}
            cautions={[
              "Label KyenAI operational recommendations separately from official MCP requirements.",
              "Complete every permission row before enabling write, delete, network, secret, or production access.",
            ]}
            downloadHref="/resources/mcp-security-review.md"
            downloadName="mcp-security-review.md"
          />
        </div>
      </section>

      <section className="instruction-resource-section" aria-labelledby="mcp-config-example-heading">
        <div className="instruction-resource-heading">
          <div>
            <p className="instruction-resource-eyebrow">Configuration example</p>
            <h2 id="mcp-config-example-heading">MCP security config example</h2>
          </div>
          <p>Copy the shape, not the literal values. Replace commands, domains, scopes, paths, and owners.</p>
        </div>
        <div className="instruction-template-grid instruction-template-grid-single">
          <CodeExampleCard
            title="Read-only MCP security profile"
            purpose="Show one conservative launch profile with token audience, blocked paths, network allowlist, approvals, audit fields, and revocation."
            body={mcpSecurityConfigExample}
            cautions={[
              "Do not copy example domains, commands, owners, or paths into production without review.",
              "Keep write, delete, secret, and production capabilities disabled until a separate approval path exists.",
            ]}
          />
        </div>
      </section>

      <section className="instruction-resource-section" aria-labelledby="mcp-review-cadence-heading">
        <div className="instruction-resource-heading">
          <div>
            <p className="instruction-resource-eyebrow">Ongoing ownership</p>
            <h2 id="mcp-review-cadence-heading">Review cadence and revocation</h2>
          </div>
        </div>
        <dl className="instruction-scope-list">
          <div>
            <dt>Review cadence</dt>
            <dd>{mcpSecurityReviewPolicy.cadence}</dd>
          </div>
          <div>
            <dt>Revocation and incident response</dt>
            <dd>{mcpSecurityReviewPolicy.revocation}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
