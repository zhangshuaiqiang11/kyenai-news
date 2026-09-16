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

const riskByDomain = {
  Identity: "Account takeover, orphaned access, or local-login bypass.",
  Authorization: "Privilege creep or an unreviewed user gaining administrative scope.",
  "Data governance": "Unapproved retention, training, provider, subprocessor, or residency exposure.",
  "Data protection": "Protected code or prompts exposed without the required encryption boundary.",
  "Repository access": "Sensitive repositories or files become available to an agent unexpectedly.",
  "Model governance": "An unapproved model or provider receives company code or prompts.",
  "Tool governance": "An unreviewed MCP server or credential can perform an external action.",
  "Agent governance": "Autonomous commands, network access, or prompt injection cross the approval boundary.",
  Logging: "The organization cannot attribute, investigate, or prove a high-risk action.",
  Assurance: "Contractual or control gaps remain invisible until an incident or assessment.",
  Lifecycle: "Stale access, data, or configuration survives offboarding or a material change.",
};

const procurementMatrix = payload.controls.map((control) => ({
  number: control.number,
  id: control.id,
  domain: control.domain,
  control: control.title,
  cursorBehavior: control.guidance,
  enterpriseSetting: control.contractOrConsoleCheck,
  risk: riskByDomain[control.domain] || "The control gap creates an unassessed enterprise risk.",
  evidence: control.sourceUrls,
  verified: payload.verifiedAt,
  claimBasis: control.claimBasis,
  owner: control.owner,
  verificationMethod: control.verificationMethod,
  passCriteria: control.passCriteria,
}));

fs.writeFileSync(path.join(resourcesDir, "cursor-enterprise-procurement-matrix.json"), `${JSON.stringify({
  title: "Cursor Enterprise procurement review matrix",
  version: payload.version,
  verifiedAt: payload.verifiedAt,
  status: "Evidence-backed control questions; buyer-specific behavior remains contract/console test-required.",
  columns: ["Control", "Cursor behavior", "Enterprise setting / check", "Risk", "Evidence", "Verified"],
  rows: procurementMatrix,
}, null, 2)}\n`);

const procurementCsvHeaders = [
  "number", "id", "domain", "control", "cursor_behavior", "enterprise_setting", "risk", "evidence", "verified", "claim_basis", "owner", "verification_method", "pass_criteria",
];
const procurementCsv = [procurementCsvHeaders, ...procurementMatrix.map((row) => [
  row.number, row.id, row.domain, row.control, row.cursorBehavior, row.enterpriseSetting, row.risk,
  row.evidence.join(" | "), row.verified, row.claimBasis, row.owner, row.verificationMethod, row.passCriteria,
])].map((row) => row.map(escapeCsvCell).join(",")).join("\n");
fs.writeFileSync(path.join(resourcesDir, "cursor-enterprise-procurement-matrix.csv"), `${procurementCsv}\n`);

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
  `Version: ${payload.version}`,
  "",
  `Verified: ${payload.verifiedAt}`,
  "",
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
