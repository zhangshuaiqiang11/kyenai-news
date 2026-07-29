import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  cursorEnterpriseResponsibilityMatrix,
  cursorEnterpriseSecurityControls,
  cursorEnterpriseSecuritySources,
  cursorEnterpriseSecurityVerifiedAt,
  cursorEnterpriseSecurityVersion,
} from "../frontend/lib/cursor-enterprise-security-resource.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const resourcesDir = path.join(root, "frontend", "public", "resources");
fs.mkdirSync(resourcesDir, { recursive: true });

const payload = {
  title: "Cursor Enterprise Security Assessment: 30 Administrator Controls",
  version: cursorEnterpriseSecurityVersion,
  verifiedAt: cursorEnterpriseSecurityVerifiedAt,
  license: "CC BY 4.0",
  canonicalUrl: "https://www.kyenai.com/articles/cursor-enterprise-organizations-governance",
  preferredCitation: `KyenAI. (2026). Cursor Enterprise Security Assessment: 30 Administrator Controls (Version ${cursorEnterpriseSecurityVersion}). https://www.kyenai.com/articles/cursor-enterprise-organizations-governance`,
  scope: "Public vendor claims are separated from KyenAI operational recommendations. Buyers must verify account, plan, region, model, workspace, console, and contract-specific behavior.",
  controlCount: cursorEnterpriseSecurityControls.length,
  responsibilityMatrix: cursorEnterpriseResponsibilityMatrix,
  controls: cursorEnterpriseSecurityControls.map((control, index) => ({ number: index + 1, ...control })),
  sources: cursorEnterpriseSecuritySources,
};

if (payload.controlCount !== 30) throw new Error(`Expected 30 controls, found ${payload.controlCount}`);

fs.writeFileSync(path.join(resourcesDir, "cursor-enterprise-security-controls.json"), `${JSON.stringify(payload, null, 2)}\n`);

const csvHeaders = [
  "number", "id", "domain", "title", "owner", "guidance", "verification_method", "pass_criteria",
  "claim_basis", "contract_or_console_check", "source_urls", "version", "verified_at",
];
const csvRows = payload.controls.map((control) => [
  control.number, control.id, control.domain, control.title, control.owner, control.guidance,
  control.verificationMethod, control.passCriteria, control.claimBasis, control.contractOrConsoleCheck,
  control.sourceUrls.join(" | "), payload.version, payload.verifiedAt,
]);
const csv = [csvHeaders, ...csvRows].map((row) => row.map(escapeCsvCell).join(",")).join("\n");
fs.writeFileSync(path.join(resourcesDir, "cursor-enterprise-security-controls.csv"), `${csv}\n`);

const markdown = [
  `# ${payload.title}`,
  "",
  `Version: ${payload.version}  `,
  `Verified: ${payload.verifiedAt}  `,
  `License: ${payload.license}`,
  "",
  `Preferred citation: ${payload.preferredCitation}`,
  "",
  payload.scope,
  "",
  "## Responsibility matrix",
  "",
  ...payload.responsibilityMatrix.map((item) => `- **${item.role}:** ${item.accountableFor}`),
  "",
  "## Controls",
  "",
  ...payload.controls.flatMap((control) => [
    `### ${String(control.number).padStart(2, "0")}. ${control.title}`,
    "",
    `- Domain: ${control.domain}`,
    `- Owner: ${control.owner}`,
    `- Guidance: ${control.guidance}`,
    `- Verify: ${control.verificationMethod}`,
    `- Pass: ${control.passCriteria}`,
    `- Basis: ${control.claimBasis === "official-public" ? "Official public vendor material" : "KyenAI operational recommendation"}`,
    `- Contract or console check: ${control.contractOrConsoleCheck}`,
    `- Sources: ${control.sourceUrls.join(", ")}`,
    "",
  ]),
];
fs.writeFileSync(path.join(resourcesDir, "cursor-enterprise-security-review.md"), `${markdown.join("\n")}\n`);

console.log("Generated 30 Cursor Enterprise security controls in JSON, CSV, and Markdown.");

function escapeCsvCell(value) {
  const text = String(value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}
