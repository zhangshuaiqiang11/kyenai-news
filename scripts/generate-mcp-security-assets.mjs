import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  mcpSecurityControls,
  mcpSecuritySources,
  mcpSecurityVerifiedAt,
  renderMcpSecurityReviewMarkdown,
} from "../frontend/lib/mcp-security-resource.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const resourcesDir = path.join(root, "frontend", "public", "resources");
fs.mkdirSync(resourcesDir, { recursive: true });

const claimLabels = {
  "official-mcp": "Official MCP requirement or guidance",
  "kyenai-operational": "KyenAI operational recommendation",
};

const payload = {
  title: "MCP Server Security Checklist: 25 Controls for AI Agents",
  verifiedAt: mcpSecurityVerifiedAt,
  controlCount: mcpSecurityControls.length,
  scope:
    "Official MCP requirements and guidance are labeled separately from KyenAI operational recommendations. Validate each control against the named server, client, version, and deployment context.",
  controls: mcpSecurityControls.map((control, index) => ({
    number: index + 1,
    id: control.id,
    title: control.title,
    risk: control.risk,
    guidance: control.guidance,
    verificationMethod: control.verificationMethod,
    passCriteria: control.passCriteria,
    claimBasis: claimLabels[control.claimType],
    sourceUrls: control.sourceUrls,
  })),
  sources: mcpSecuritySources,
};

if (payload.controlCount !== 25) {
  throw new Error(`Expected 25 MCP security controls, found ${payload.controlCount}`);
}

fs.writeFileSync(
  path.join(resourcesDir, "mcp-security-controls.json"),
  `${JSON.stringify(payload, null, 2)}\n`,
);

const csvHeaders = [
  "number",
  "id",
  "title",
  "risk",
  "guidance",
  "verification_method",
  "pass_criteria",
  "claim_basis",
  "source_urls",
];
const csvRows = payload.controls.map((control) => [
  control.number,
  control.id,
  control.title,
  control.risk,
  control.guidance,
  control.verificationMethod,
  control.passCriteria,
  control.claimBasis,
  control.sourceUrls.join(" | "),
]);
const csv = [csvHeaders, ...csvRows]
  .map((row) => row.map(escapeCsvCell).join(","))
  .join("\n");
fs.writeFileSync(path.join(resourcesDir, "mcp-security-controls.csv"), `${csv}\n`);
fs.writeFileSync(
  path.join(resourcesDir, "mcp-security-review.md"),
  renderMcpSecurityReviewMarkdown(),
);

console.log(`Generated ${payload.controlCount} MCP security controls in JSON, CSV, and Markdown.`);

function escapeCsvCell(value) {
  const text = String(value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}
