export const mcpSecurityVerifiedAt = "2026-06-14" as const;

export const mcpSecuritySourceUrls = {
  bestPractices:
    "https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices",
  authorization:
    "https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization",
  authorizationSecurity:
    "https://modelcontextprotocol.io/specification/draft/basic/authorization/security-considerations",
  inspector: "https://modelcontextprotocol.io/docs/tools/inspector",
} as const;

export type McpClaimType = "official-mcp" | "kyenai-operational";

export type McpSecuritySource = {
  id: string;
  title: string;
  url: string;
  scope: string;
  verifiedAt: typeof mcpSecurityVerifiedAt;
};

export type McpSecurityThreat = {
  id:
    | "prompt-injection"
    | "excessive-permissions-scope"
    | "secret-token-exposure"
    | "unsafe-writes-deletes"
    | "network-reach-ssrf"
    | "third-party-supply-chain-local-server-compromise";
  title: string;
  description: string;
  claimType: McpClaimType;
  sourceUrls: string[];
  verifiedAt: typeof mcpSecurityVerifiedAt;
};

export type McpSecurityControl = {
  id:
    | "authentication-authorization"
    | "least-privilege"
    | "secure-secret-token-storage-rotation"
    | "read-write-separation"
    | "human-approval-destructive-production"
    | "attributable-audit-logs"
    | "isolation-network-allowlists"
    | "revocation-incident-response";
  title: string;
  guidance: string;
  launchCheck: string;
  claimType: McpClaimType;
  sourceUrls: string[];
  verifiedAt: typeof mcpSecurityVerifiedAt;
};

export type McpPermissionRow = {
  id:
    | "repository-read"
    | "repository-write"
    | "repository-delete"
    | "outbound-network"
    | "secret-access"
    | "production-access";
  capability: string;
  default: string;
  dataRisk: string;
  approval: string;
  logging: string;
  launchGate: string;
};

export const mcpSecuritySources: McpSecuritySource[] = [
  {
    id: "mcp-security-best-practices",
    title: "MCP security best practices",
    url: mcpSecuritySourceUrls.bestPractices,
    scope:
      "Official guidance for authorization, token handling, least-privilege scopes, session security, SSRF, and local MCP server compromise.",
    verifiedAt: mcpSecurityVerifiedAt,
  },
  {
    id: "mcp-authorization",
    title: "MCP authorization specification",
    url: mcpSecuritySourceUrls.authorization,
    scope:
      "Official protocol requirements for HTTP-based authorization, protected resource metadata, access tokens, scopes, and audience validation.",
    verifiedAt: mcpSecurityVerifiedAt,
  },
  {
    id: "mcp-authorization-security",
    title: "MCP authorization security considerations",
    url: mcpSecuritySourceUrls.authorizationSecurity,
    scope:
      "Official security considerations for confused-deputy attacks, token passthrough, audience validation, SSRF, session hijacking, and local server compromise.",
    verifiedAt: mcpSecurityVerifiedAt,
  },
  {
    id: "mcp-inspector",
    title: "MCP Inspector",
    url: mcpSecuritySourceUrls.inspector,
    scope:
      "Official interactive validation workflow for inspecting server resources, prompts, tools, notifications, and protocol exchanges.",
    verifiedAt: mcpSecurityVerifiedAt,
  },
];

export const mcpSecurityThreats: McpSecurityThreat[] = [
  {
    id: "prompt-injection",
    title: "Prompt injection",
    description:
      "Untrusted repository, issue, webpage, or tool output can steer an agent toward a dangerous MCP call. Treat this as a general AI agent tool security threat and keep consequential capabilities independently constrained.",
    claimType: "kyenai-operational",
    sourceUrls: [mcpSecuritySourceUrls.bestPractices],
    verifiedAt: mcpSecurityVerifiedAt,
  },
  {
    id: "excessive-permissions-scope",
    title: "Excessive permissions or scope",
    description:
      "A client, server, or token with broader scopes than the workflow needs increases blast radius. MCP guidance recommends minimal scopes and incremental elevation when more access is required.",
    claimType: "official-mcp",
    sourceUrls: [
      mcpSecuritySourceUrls.bestPractices,
      mcpSecuritySourceUrls.authorization,
    ],
    verifiedAt: mcpSecurityVerifiedAt,
  },
  {
    id: "secret-token-exposure",
    title: "Secret or token exposure",
    description:
      "Token passthrough, insecure storage, logs, prompts, or server output can disclose credentials. MCP authorization guidance requires audience-bound token validation and rejects accepting tokens not issued for the MCP server.",
    claimType: "official-mcp",
    sourceUrls: [
      mcpSecuritySourceUrls.authorization,
      mcpSecuritySourceUrls.authorizationSecurity,
    ],
    verifiedAt: mcpSecurityVerifiedAt,
  },
  {
    id: "unsafe-writes-deletes",
    title: "Unsafe writes or deletes",
    description:
      "A valid tool call can still overwrite code, delete data, or mutate production state. Read/write separation and human approval are KyenAI operating controls, not claims that the MCP specification mandates those controls.",
    claimType: "kyenai-operational",
    sourceUrls: [mcpSecuritySourceUrls.inspector],
    verifiedAt: mcpSecurityVerifiedAt,
  },
  {
    id: "network-reach-ssrf",
    title: "Network reach or SSRF",
    description:
      "An MCP server that retrieves URLs or authorization metadata can become an SSRF path to internal services. Official guidance calls for URL validation, restricted redirects, and controls around private network destinations.",
    claimType: "official-mcp",
    sourceUrls: [
      mcpSecuritySourceUrls.bestPractices,
      mcpSecuritySourceUrls.authorizationSecurity,
    ],
    verifiedAt: mcpSecurityVerifiedAt,
  },
  {
    id: "third-party-supply-chain-local-server-compromise",
    title: "Third-party supply chain or local server compromise",
    description:
      "A malicious or compromised local MCP server can execute with the user's privileges and reach local data. Official guidance recommends explicit consent, sandboxing, least privilege, and trusted installation sources.",
    claimType: "official-mcp",
    sourceUrls: [
      mcpSecuritySourceUrls.bestPractices,
      mcpSecuritySourceUrls.authorizationSecurity,
    ],
    verifiedAt: mcpSecurityVerifiedAt,
  },
];

export const mcpSecurityControls: McpSecurityControl[] = [
  {
    id: "authentication-authorization",
    title: "Authentication and authorization",
    guidance:
      "For HTTP transports, implement the MCP authorization flow, validate access-token audience, reject token passthrough, and return scope challenges without silently widening access.",
    launchCheck:
      "Document the authorization server, protected resource metadata, token audience, scopes, and deny-path tests.",
    claimType: "official-mcp",
    sourceUrls: [
      mcpSecuritySourceUrls.authorization,
      mcpSecuritySourceUrls.authorizationSecurity,
    ],
    verifiedAt: mcpSecurityVerifiedAt,
  },
  {
    id: "least-privilege",
    title: "Least privilege",
    guidance:
      "Request the minimum initial scopes and capabilities needed for the declared workflow, then elevate incrementally only when a specific operation requires it.",
    launchCheck:
      "Every enabled method, filesystem root, API scope, and environment has a documented use case.",
    claimType: "official-mcp",
    sourceUrls: [
      mcpSecuritySourceUrls.bestPractices,
      mcpSecuritySourceUrls.authorization,
    ],
    verifiedAt: mcpSecurityVerifiedAt,
  },
  {
    id: "secure-secret-token-storage-rotation",
    title: "Secure secret and token storage with rotation",
    guidance:
      "Keep credentials out of prompts, configuration committed to source control, tool output, and ordinary logs. Use managed secret storage, short-lived credentials where practical, and a tested rotation path.",
    launchCheck:
      "Record storage location, redaction behavior, token lifetime, rotation owner, and emergency revocation procedure.",
    claimType: "official-mcp",
    sourceUrls: [
      mcpSecuritySourceUrls.bestPractices,
      mcpSecuritySourceUrls.authorizationSecurity,
    ],
    verifiedAt: mcpSecurityVerifiedAt,
  },
  {
    id: "read-write-separation",
    title: "Read and write separation",
    guidance:
      "Expose read-only methods separately from mutation and deletion methods so teams can grant useful access without bundling consequential capabilities. This is a KyenAI operational recommendation.",
    launchCheck:
      "A read-only profile can be enabled without write, delete, secret, or production permissions.",
    claimType: "kyenai-operational",
    sourceUrls: [mcpSecuritySourceUrls.inspector],
    verifiedAt: mcpSecurityVerifiedAt,
  },
  {
    id: "human-approval-destructive-production",
    title: "Human approval for destructive or production actions",
    guidance:
      "Require an informed human decision immediately before delete, irreversible write, secret use, or production execution. This is a KyenAI operational recommendation, not an MCP specification mandate.",
    launchCheck:
      "Approval prompts identify the actor, target, action, data, environment, and rollback limits.",
    claimType: "kyenai-operational",
    sourceUrls: [mcpSecuritySourceUrls.inspector],
    verifiedAt: mcpSecurityVerifiedAt,
  },
  {
    id: "attributable-audit-logs",
    title: "Attributable audit logs",
    guidance:
      "Record actor, session, server and version, method, target, approval, timestamp, and outcome while redacting secrets and minimizing sensitive payloads. This is a KyenAI operational recommendation, not an MCP specification mandate.",
    launchCheck:
      "A reviewer can reconstruct a consequential call and its approval without exposing credentials.",
    claimType: "kyenai-operational",
    sourceUrls: [mcpSecuritySourceUrls.inspector],
    verifiedAt: mcpSecurityVerifiedAt,
  },
  {
    id: "isolation-network-allowlists",
    title: "Isolation and network allowlists",
    guidance:
      "Sandbox local servers and restrict filesystem roots, processes, and outbound destinations. Validate URLs and redirects to reduce SSRF exposure. The isolation profile is a KyenAI operational control informed by official MCP security guidance.",
    launchCheck:
      "The server cannot reach undeclared private addresses, metadata endpoints, filesystem roots, or child processes.",
    claimType: "kyenai-operational",
    sourceUrls: [
      mcpSecuritySourceUrls.bestPractices,
      mcpSecuritySourceUrls.authorizationSecurity,
    ],
    verifiedAt: mcpSecurityVerifiedAt,
  },
  {
    id: "revocation-incident-response",
    title: "Revocation and incident response",
    guidance:
      "Maintain a fast way to disable the server, revoke credentials, remove client registration, preserve relevant logs, notify owners, and reassess affected data. This is a KyenAI operational recommendation.",
    launchCheck:
      "The owner has tested disablement and credential revocation, with named incident and escalation contacts.",
    claimType: "kyenai-operational",
    sourceUrls: [mcpSecuritySourceUrls.bestPractices],
    verifiedAt: mcpSecurityVerifiedAt,
  },
];

export const mcpSecurityPermissionMatrix: McpPermissionRow[] = [
  {
    id: "repository-read",
    capability: "Read repository files",
    default: "Allow read-only access to declared roots",
    dataRisk: "Source code, internal documentation, and embedded sensitive data",
    approval: "Owner approval at onboarding; no per-call approval for declared roots",
    logging: "Log server, actor, session, method, root, and outcome; avoid file contents",
    launchGate: "Roots are explicit, symlink escape is tested, and secret-bearing paths are excluded",
  },
  {
    id: "repository-write",
    capability: "Write repository files",
    default: "Deny until a bounded write workflow is approved",
    dataRisk: "Code integrity, build behavior, generated files, and policy changes",
    approval: "Per-task approval for bounded paths; review the resulting diff",
    logging: "Log target paths, method, approval, result, and commit or diff reference",
    launchGate: "Writes are path-scoped, reversible, and separated from delete capability",
  },
  {
    id: "repository-delete",
    capability: "Delete repository files",
    default: "Deny",
    dataRisk: "Irrecoverable source or configuration loss",
    approval: "Per-action human approval with exact targets",
    logging: "Log target list, approver, timestamp, result, and recovery reference",
    launchGate: "A recovery path exists and wildcard or root deletion is blocked",
  },
  {
    id: "outbound-network",
    capability: "Outbound network access",
    default: "Deny except approved destinations",
    dataRisk: "Data exfiltration, SSRF, dependency substitution, and callback abuse",
    approval: "Owner approval for an allowlist; separate review for new destinations",
    logging: "Log destination, resolved address class, method, bytes category, and outcome",
    launchGate: "Private ranges, metadata services, redirects, and DNS rebinding are tested",
  },
  {
    id: "secret-access",
    capability: "Secret access",
    default: "Deny; inject only the minimum runtime credential",
    dataRisk: "Account takeover, lateral movement, and persistent credential disclosure",
    approval: "Security owner approval and per-use approval for high-impact credentials",
    logging: "Log secret identifier and use outcome, never the secret value",
    launchGate: "Managed storage, audience and scope restrictions, rotation, and revocation are tested",
  },
  {
    id: "production-access",
    capability: "Production access",
    default: "Deny",
    dataRisk: "Customer impact, regulated data exposure, destructive changes, and outages",
    approval: "Per-action human approval by an authorized production owner",
    logging: "Log actor, approver, server version, action, target, change reference, and outcome",
    launchGate: "Staging validation, rollback, incident contact, and emergency disablement are proven",
  },
];

export const mcpSecurityReviewPolicy = {
  cadence:
    "Review at least quarterly and whenever the server owner, publisher, version, dependencies, scopes, credentials, methods, data classes, network reach, or deployment environment materially changes.",
  revocation:
    "Disable the server, revoke tokens and secrets, remove client access, preserve attributable records, assess affected systems and data, rotate downstream credentials, and document the decision to restore or retire access.",
} as const;

const claimTypeLabel: Record<McpClaimType, string> = {
  "official-mcp": "Official MCP requirement or guidance",
  "kyenai-operational": "KyenAI operational recommendation",
};

function escapeMarkdownTableCell(value: string): string {
  return value
    .replace(/\r\n?|\n/g, "<br>")
    .replace(/\\/g, "\\\\")
    .replace(/\|/g, "\\|");
}

export const mcpSecurityReviewPreview = `# MCP security review

Verified: ${mcpSecurityVerifiedAt}

Use this template for one named server and deployment context.

## Server profile

- Server owner:
- Version / publisher:
- Distribution source:
- Deployment environment:
- Data classes:
- Methods / capabilities:
- Credentials / authentication:
- Network reach:
- Approval gates:
- Logging:
- Dependency / supply-chain review:
- Revocation / incident response:

## Threat model

- [ ] **Prompt injection** - Untrusted input can steer an agent toward a dangerous MCP call.
- [ ] **Excessive permissions or scope** - Broader scopes than the workflow needs increase blast radius.
- [ ] **Secret or token exposure** - Token passthrough, logs, or prompts can disclose credentials.
- [ ] **Unsafe writes or deletes** - A valid tool call can still overwrite code or mutate production state.
- [ ] **Network reach or SSRF** - URL retrieval can become a path to internal services.
- [ ] **Third-party supply chain or local server compromise** - A compromised local server runs with user privileges.

## Control checklist

- [ ] **Authentication and authorization** - Document token audience, scopes, and deny-path tests.
- [ ] **Least privilege** - Every enabled method, root, scope, and environment has a documented use case.
- [ ] **Secure secret and token storage with rotation** - Record storage, redaction, lifetime, and revocation.
- [ ] **Read and write separation** - A read-only profile works without write, delete, or production access.
- [ ] **Human approval for destructive or production actions** - Approval identifies actor, target, and rollback limits.
- [ ] **Attributable audit logs** - A reviewer can reconstruct a consequential call without exposing credentials.
- [ ] **Isolation and network allowlists** - The server cannot reach undeclared private or metadata endpoints.
- [ ] **Revocation and incident response** - Disablement and credential revocation are tested.

## Permission matrix

| Capability | Default | Data risk | Approval | Logging | Launch gate |
| --- | --- | --- | --- | --- | --- |
| Read repository files | Allow read-only access to declared roots | Source code and embedded sensitive data | Owner approval at onboarding | Log actor, method, root, and outcome | Roots are explicit and secret paths excluded |
| Write repository files | Deny until a bounded write workflow is approved | Code integrity and policy changes | Per-task approval for bounded paths | Log target paths, approval, and result | Writes are path-scoped and reversible |
| Delete repository files | Deny | Irrecoverable source or configuration loss | Per-action human approval with exact targets | Log target list, approver, and recovery reference | Wildcard or root deletion is blocked |
| Outbound network access | Deny except approved destinations | Data exfiltration and SSRF | Owner approval for an allowlist | Log destination, method, and outcome | Private ranges and metadata services are tested |
| Secret access | Deny; inject only the minimum runtime credential | Account takeover and credential disclosure | Security owner approval | Log secret identifier, never the value | Rotation and revocation are tested |
| Production access | Deny | Customer impact and destructive changes | Per-action approval by production owner | Log actor, approver, action, and outcome | Rollback and emergency disablement are proven |

## Validation workflow

- [ ] Run the MCP Inspector against the reviewed server and version.
- [ ] Enumerate resources, prompts, tools, notifications, and protocol exchanges.
- [ ] Exercise expected allow and deny cases for every enabled capability.
- [ ] Confirm errors and logs do not expose tokens or unnecessary sensitive payloads.
- [ ] Record evidence links and unresolved findings.

## Sign-off

- Reviewer:
- Review date:
- Sign-off:
- Findings or exceptions:`;

export function renderMcpSecurityReviewMarkdown(
  permissionMatrix: McpPermissionRow[] = mcpSecurityPermissionMatrix,
): string {
  const threatChecklist = mcpSecurityThreats
    .map(
      (threat) =>
        `- [ ] **${threat.title}** - ${threat.description} _${claimTypeLabel[threat.claimType]}._`,
    )
    .join("\n");
  const controlChecklist = mcpSecurityControls
    .map(
      (control) =>
        `- [ ] **${control.title}** - ${control.launchCheck} _${claimTypeLabel[control.claimType]}._`,
    )
    .join("\n");
  const permissionRows = permissionMatrix
    .map(
      (row) =>
        `| ${escapeMarkdownTableCell(row.capability)} | ${escapeMarkdownTableCell(row.default)} | ${escapeMarkdownTableCell(row.dataRisk)} | ${escapeMarkdownTableCell(row.approval)} | ${escapeMarkdownTableCell(row.logging)} | ${escapeMarkdownTableCell(row.launchGate)} |`,
    )
    .join("\n");
  const sourceList = mcpSecuritySources
    .map((source) => `- [${source.title}](${source.url}) - ${source.scope}`)
    .join("\n");

  return `# MCP security review

Verified: ${mcpSecurityVerifiedAt}

Use this template for one named server and deployment context. It combines official MCP security requirements and guidance with clearly labeled KyenAI operational recommendations.

## Server profile

- Server owner:
- Version / publisher:
- Distribution source:
- Deployment environment:
- Data classes:
- Methods / capabilities:
- Credentials / authentication:
- Network reach:
- Approval gates:
- Logging:
- Dependency / supply-chain review:
- Revocation / incident response:

## Threat model

${threatChecklist}

## Control checklist

${controlChecklist}

## Permission matrix

| Capability | Default | Data risk | Approval | Logging | Launch gate |
| --- | --- | --- | --- | --- | --- |
${permissionRows}

## Validation workflow

- [ ] Run the MCP Inspector against the reviewed server and version.
- [ ] Enumerate resources, prompts, tools, notifications, and protocol exchanges.
- [ ] Exercise expected allow and deny cases for every enabled capability.
- [ ] Confirm errors and logs do not expose tokens, secrets, or unnecessary sensitive payloads.
- [ ] Record evidence links and unresolved findings.

## Review cadence and revocation

- Cadence: ${mcpSecurityReviewPolicy.cadence}
- Revocation / incident response: ${mcpSecurityReviewPolicy.revocation}

## Evidence

${sourceList}

## Sign-off

- Reviewer:
- Review date:
- Sign-off:
- Findings or exceptions:
`;
}
