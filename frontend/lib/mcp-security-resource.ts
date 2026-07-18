export const mcpSecurityVerifiedAt = "2026-07-19" as const;

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
  id: string;
  title: string;
  risk: "Critical" | "High" | "Medium";
  guidance: string;
  verificationMethod: string;
  passCriteria: string;
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

export type McpAuthenticationRow = {
  id: "oauth" | "api-key" | "mtls";
  option: string;
  useWhen: string;
  mainRisk: string;
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
    id: "token-audience-validation",
    title: "Validate access-token audience",
    risk: "Critical",
    guidance:
      "For HTTP transports, accept only access tokens explicitly issued for the MCP server and validate their audience before every protected request.",
    verificationMethod: "Send valid, wrong-audience, expired, and unsigned tokens to each protected endpoint.",
    passCriteria: "Only the valid audience-bound token is accepted; every other token is rejected without reaching a tool.",
    claimType: "official-mcp",
    sourceUrls: [
      mcpSecuritySourceUrls.authorization,
      mcpSecuritySourceUrls.authorizationSecurity,
    ],
    verifiedAt: mcpSecurityVerifiedAt,
  },
  {
    id: "per-client-consent",
    title: "Require per-client consent",
    risk: "Critical",
    guidance:
      "MCP proxy servers that reuse a third-party OAuth client must record consent per user and MCP client before forwarding authorization.",
    verificationMethod: "Authorize one client, then initiate the same flow from a new client ID while the original consent cookie remains present.",
    passCriteria: "The new client receives its own consent screen and cannot inherit the first client's approval.",
    claimType: "official-mcp",
    sourceUrls: [
      mcpSecuritySourceUrls.bestPractices,
    ],
    verifiedAt: mcpSecurityVerifiedAt,
  },
  {
    id: "redirect-state-csrf",
    title: "Validate redirect URIs, state, and CSRF",
    risk: "Critical",
    guidance:
      "Use exact redirect URI matching, single-use short-lived state values, CSRF protection, and secure consent cookies in OAuth flows.",
    verificationMethod: "Replay state values and try wildcard, changed, missing, and attacker-controlled redirect URIs.",
    passCriteria: "Every mismatch or replay is rejected and approved redirects use exact registered values.",
    claimType: "official-mcp",
    sourceUrls: [mcpSecuritySourceUrls.bestPractices],
    verifiedAt: mcpSecurityVerifiedAt,
  },
  {
    id: "reject-token-passthrough",
    title: "Reject token passthrough",
    risk: "Critical",
    guidance:
      "Do not accept an upstream token and forward it to another service without verifying that it was issued for the MCP server.",
    verificationMethod: "Present a token issued only for a downstream API and trace whether it can cross the MCP boundary.",
    passCriteria: "The MCP server rejects the token and never forwards it downstream.",
    claimType: "official-mcp",
    sourceUrls: [mcpSecuritySourceUrls.authorization, mcpSecuritySourceUrls.bestPractices],
    verifiedAt: mcpSecurityVerifiedAt,
  },
  {
    id: "scope-minimization",
    title: "Minimize scopes and elevate incrementally",
    risk: "High",
    guidance:
      "Request the smallest initial scope set and add access only when a specific operation requires it.",
    verificationMethod: "Map every requested scope to one enabled method and run the workflow with optional scopes removed.",
    passCriteria: "No unused wildcard or admin scope remains and elevation is explicit and operation-specific.",
    claimType: "official-mcp",
    sourceUrls: [mcpSecuritySourceUrls.bestPractices, mcpSecuritySourceUrls.authorization],
    verifiedAt: mcpSecurityVerifiedAt,
  },
  {
    id: "secret-storage-rotation",
    title: "Protect and rotate secrets and tokens",
    risk: "Critical",
    guidance:
      "Keep credentials out of prompts, source control, tool output, screenshots, and ordinary logs; use managed storage and short-lived credentials where practical.",
    verificationMethod: "Scan configuration, prompts, logs, errors, screenshots, and source history, then rotate a test credential.",
    passCriteria: "No plaintext credential appears and the old credential stops working after rotation.",
    claimType: "kyenai-operational",
    sourceUrls: [mcpSecuritySourceUrls.bestPractices, mcpSecuritySourceUrls.authorizationSecurity],
    verifiedAt: mcpSecurityVerifiedAt,
  },
  {
    id: "session-auth-separation",
    title: "Never use sessions as authentication",
    risk: "Critical",
    guidance:
      "Authorize every inbound request independently; a session identifier must not substitute for an access token or user identity.",
    verificationMethod: "Reuse a captured session ID without valid authorization and attempt calls against another server instance.",
    passCriteria: "The request is rejected and the session ID alone grants no capability.",
    claimType: "official-mcp",
    sourceUrls: [mcpSecuritySourceUrls.bestPractices],
    verifiedAt: mcpSecurityVerifiedAt,
  },
  {
    id: "session-id-security",
    title: "Secure, bind, rotate, and expire session IDs",
    risk: "High",
    guidance:
      "Generate non-deterministic session IDs, bind them to authorized user context, and rotate or expire them to limit hijacking.",
    verificationMethod: "Test predictable IDs, cross-user reuse, cross-instance replay, and expired-session behavior.",
    passCriteria: "IDs are unguessable, user-bound, time-bounded, and rejected outside their authorized context.",
    claimType: "official-mcp",
    sourceUrls: [mcpSecuritySourceUrls.bestPractices],
    verifiedAt: mcpSecurityVerifiedAt,
  },
  {
    id: "authorization-url-schemes",
    title: "Allow only safe authorization URL schemes",
    risk: "Critical",
    guidance: "Accept HTTPS authorization URLs in production and reject javascript:, data:, file:, vbscript:, and other executable schemes.",
    verificationMethod: "Return authorization endpoints using unsafe schemes, encoded variants, and HTTP on non-loopback hosts.",
    passCriteria: "Only HTTPS production URLs and explicitly allowed loopback development URLs open.",
    claimType: "official-mcp",
    sourceUrls: [mcpSecuritySourceUrls.bestPractices],
    verifiedAt: mcpSecurityVerifiedAt,
  },
  {
    id: "safe-url-opening",
    title: "Open authorization URLs without a shell",
    risk: "Critical",
    guidance: "Use platform URL APIs rather than cmd, sh, PowerShell, or interpolated shell commands when opening authorization links.",
    verificationMethod: "Supply URLs containing shell metacharacters, quotes, spaces, and encoded command separators.",
    passCriteria: "The URL is parsed as data, no shell starts, and suspicious values are rejected and logged.",
    claimType: "official-mcp",
    sourceUrls: [mcpSecuritySourceUrls.bestPractices],
    verifiedAt: mcpSecurityVerifiedAt,
  },
  {
    id: "ssrf-private-ranges",
    title: "Block SSRF to private and metadata ranges",
    risk: "Critical",
    guidance: "Validate OAuth discovery URLs and block loopback, private, link-local, reserved, and cloud metadata destinations outside explicit development exceptions.",
    verificationMethod: "Try IPv4, IPv6, encoded, hostname, and cloud-metadata targets through every URL-fetching path.",
    passCriteria: "All private or reserved destinations are blocked before connection and responses are not reflected.",
    claimType: "official-mcp",
    sourceUrls: [mcpSecuritySourceUrls.bestPractices, mcpSecuritySourceUrls.authorizationSecurity],
    verifiedAt: mcpSecurityVerifiedAt,
  },
  {
    id: "redirect-dns-validation",
    title: "Revalidate redirects and DNS results",
    risk: "High",
    guidance: "Apply URL and IP validation to every redirect hop and defend against DNS rebinding or time-of-check/time-of-use changes.",
    verificationMethod: "Use redirect chains and a test hostname that changes from a public to a private address.",
    passCriteria: "Every hop is revalidated and a destination change to a blocked address terminates the request.",
    claimType: "official-mcp",
    sourceUrls: [mcpSecuritySourceUrls.bestPractices],
    verifiedAt: mcpSecurityVerifiedAt,
  },
  {
    id: "egress-allowlist",
    title: "Enforce an outbound network allowlist",
    risk: "High",
    guidance: "Route server-side discovery and tool traffic through network policy or an egress proxy that permits only declared destinations.",
    verificationMethod: "Attempt direct IP, undeclared domain, private range, redirect, and DNS-rebinding egress from the runtime.",
    passCriteria: "Only reviewed destinations succeed and bypass paths cannot reach undeclared networks.",
    claimType: "official-mcp",
    sourceUrls: [mcpSecuritySourceUrls.bestPractices],
    verifiedAt: mcpSecurityVerifiedAt,
  },
  {
    id: "local-install-consent",
    title: "Require consent before local server installation",
    risk: "Critical",
    guidance: "Before one-click local setup, show the exact command and explain that it executes with the client's local privileges.",
    verificationMethod: "Start installation from a deep link or imported configuration and inspect the complete pre-execution consent flow.",
    passCriteria: "No command runs before explicit approval and the user can cancel without side effects.",
    claimType: "official-mcp",
    sourceUrls: [mcpSecuritySourceUrls.bestPractices],
    verifiedAt: mcpSecurityVerifiedAt,
  },
  {
    id: "command-visibility-warnings",
    title: "Display full commands and dangerous-pattern warnings",
    risk: "High",
    guidance: "Do not truncate local startup commands; highlight sudo, destructive deletion, network calls, and access to sensitive paths.",
    verificationMethod: "Test long, multiline, obfuscated, and destructive commands in the installation dialog.",
    passCriteria: "The entire command is visible and dangerous patterns produce a clear warning before approval.",
    claimType: "official-mcp",
    sourceUrls: [mcpSecuritySourceUrls.bestPractices],
    verifiedAt: mcpSecurityVerifiedAt,
  },
  {
    id: "local-server-sandbox",
    title: "Sandbox local MCP servers",
    risk: "Critical",
    guidance: "Run local servers with minimal filesystem, process, and network privileges and require explicit grants for additional access.",
    verificationMethod: "Attempt to read outside allowed roots, spawn child processes, reach the network, and access system credentials.",
    passCriteria: "Default-denied actions fail and each additional privilege requires a narrow explicit grant.",
    claimType: "official-mcp",
    sourceUrls: [mcpSecuritySourceUrls.bestPractices, mcpSecuritySourceUrls.authorizationSecurity],
    verifiedAt: mcpSecurityVerifiedAt,
  },
  {
    id: "stdio-proxy-restrictions",
    title: "Restrict stdio proxy process spawning",
    risk: "Critical",
    guidance: "When a proxy can spawn stdio servers, isolate the proxy, authorize dangerous commands separately, and log process creation.",
    verificationMethod: "Use a compromised-client test to request an arbitrary executable, unexpected arguments, and access outside the sandbox.",
    passCriteria: "Unapproved commands and arguments are denied and allowed process creation is attributable and contained.",
    claimType: "official-mcp",
    sourceUrls: [mcpSecuritySourceUrls.bestPractices],
    verifiedAt: mcpSecurityVerifiedAt,
  },
  {
    id: "tool-level-permissions",
    title: "Inventory and scope every exposed tool",
    risk: "High",
    guidance: "Decide visibility, callability, target scope, owner, rollback path, and approval policy for each tool rather than trusting one server-wide grant.",
    verificationMethod: "Enumerate tools with MCP Inspector and compare them with the approved capability inventory.",
    passCriteria: "Every exposed tool has a declared workflow and no undeclared or wildcard capability remains.",
    claimType: "kyenai-operational",
    sourceUrls: [mcpSecuritySourceUrls.inspector],
    verifiedAt: mcpSecurityVerifiedAt,
  },
  {
    id: "read-write-delete-separation",
    title: "Separate read, write, and delete capabilities",
    risk: "High",
    guidance: "Offer a useful read-only profile without bundling mutation, deletion, secret, network, or production permissions.",
    verificationMethod: "Run the read-only workflow and attempt every mutation and deletion method with the same identity.",
    passCriteria: "Reads work within declared roots while all write and delete attempts are denied.",
    claimType: "kyenai-operational",
    sourceUrls: [mcpSecuritySourceUrls.inspector],
    verifiedAt: mcpSecurityVerifiedAt,
  },
  {
    id: "prompt-injection-containment",
    title: "Contain prompt-injection-triggered tool calls",
    risk: "Critical",
    guidance: "Treat repository text, webpages, issues, and tool output as untrusted data that cannot widen tool permissions or bypass approval gates.",
    verificationMethod: "Place malicious instructions in each untrusted input source and observe requested tool calls and permission changes.",
    passCriteria: "Untrusted content cannot expand authority, reveal credentials, or execute a consequential call without policy approval.",
    claimType: "kyenai-operational",
    sourceUrls: [mcpSecuritySourceUrls.bestPractices],
    verifiedAt: mcpSecurityVerifiedAt,
  },
  {
    id: "human-approval",
    title: "Require human approval for consequential actions",
    risk: "Critical",
    guidance: "Pause immediately before destructive writes, secret use, production access, irreversible external messages, or permission expansion.",
    verificationMethod: "Simulate each consequential action and inspect the approval prompt, actor, target, rollback limits, and timeout behavior.",
    passCriteria: "The action cannot proceed without an informed, current, target-specific approval.",
    claimType: "kyenai-operational",
    sourceUrls: [mcpSecuritySourceUrls.inspector],
    verifiedAt: mcpSecurityVerifiedAt,
  },
  {
    id: "attributable-redacted-logs",
    title: "Keep attributable, secret-redacted audit logs",
    risk: "High",
    guidance: "Record actor, session, server version, method, target, approval, timestamp, and outcome while excluding tokens and unnecessary payloads.",
    verificationMethod: "Run allowed and denied calls, then reconstruct them from logs and scan the records for credential patterns.",
    passCriteria: "A reviewer can reconstruct consequential calls and no secret or sensitive payload is exposed.",
    claimType: "kyenai-operational",
    sourceUrls: [mcpSecuritySourceUrls.bestPractices, mcpSecuritySourceUrls.inspector],
    verifiedAt: mcpSecurityVerifiedAt,
  },
  {
    id: "supply-chain-pinning",
    title: "Pin and review server supply-chain inputs",
    risk: "High",
    guidance: "Use trusted distribution sources, pin reviewed versions or integrity records, inventory dependencies, and avoid unattended latest-version execution.",
    verificationMethod: "Rebuild from a clean environment and compare resolved packages, checksums, publisher identity, and startup command with the review record.",
    passCriteria: "The reviewed artifact is reproducible and an unexpected publisher, version, or dependency blocks launch.",
    claimType: "kyenai-operational",
    sourceUrls: [mcpSecuritySourceUrls.bestPractices, mcpSecuritySourceUrls.authorizationSecurity],
    verifiedAt: mcpSecurityVerifiedAt,
  },
  {
    id: "revocation-incident-response",
    title: "Test revocation and incident response",
    risk: "Critical",
    guidance: "Maintain a fast path to disable the server, revoke credentials and client access, preserve relevant records, and assess affected systems.",
    verificationMethod: "Run a tabletop incident, disable the server, revoke a test credential, and attempt the former workflow again.",
    passCriteria: "Old access fails immediately, owners receive evidence, and restoration requires a documented decision.",
    claimType: "kyenai-operational",
    sourceUrls: [mcpSecuritySourceUrls.bestPractices],
    verifiedAt: mcpSecurityVerifiedAt,
  },
  {
    id: "inspector-allow-deny-validation",
    title: "Validate allow and deny paths with MCP Inspector",
    risk: "Medium",
    guidance: "Enumerate resources, prompts, tools, notifications, and protocol exchanges, then test both expected success and expected failure behavior.",
    verificationMethod: "Run the Inspector against the exact reviewed server version and preserve results for every enabled capability.",
    passCriteria: "The exposed surface matches inventory, allow cases work, deny cases stay denied, and errors reveal no secrets.",
    claimType: "kyenai-operational",
    sourceUrls: [mcpSecuritySourceUrls.inspector],
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

export const mcpSecurityAuthenticationMatrix: McpAuthenticationRow[] = [
  {
    id: "oauth",
    option: "OAuth / MCP authorization flow",
    useWhen: "HTTP-based servers need user or client authorization with audience-bound access tokens and scopes.",
    mainRisk: "Token passthrough, wrong audience, excessive scopes, confused-deputy behavior, and stale refresh paths.",
    launchGate:
      "Protected resource metadata exists, token audience is validated, scopes are minimal, and deny-path tests reject wrong-audience tokens.",
  },
  {
    id: "api-key",
    option: "API key or service token",
    useWhen: "A server wraps a backend service that already uses scoped service credentials or short-lived runtime tokens.",
    mainRisk: "Long-lived secrets in prompts, logs, repo files, local config, screenshots, or broad environment injection.",
    launchGate:
      "The key is stored in managed secret storage, injected only at runtime, redacted from logs, scoped narrowly, and revocable by an owner.",
  },
  {
    id: "mtls",
    option: "mTLS or private network identity",
    useWhen: "A production or internal server needs strong service-to-service identity inside a controlled network boundary.",
    mainRisk: "Certificate lifecycle drift, over-trusted network zones, unclear client identity, and missing emergency disablement.",
    launchGate:
      "Client identity is mapped to allowed methods, certificate rotation is documented, network allowlists are tested, and break-glass revocation works.",
  },
];

export const mcpSecurityReviewPolicy = {
  cadence:
    "Review at least quarterly and whenever the server owner, publisher, version, dependencies, scopes, credentials, methods, data classes, network reach, or deployment environment materially changes.",
  revocation:
    "Disable the server, revoke tokens and secrets, remove client access, preserve attributable records, assess affected systems and data, rotate downstream credentials, and document the decision to restore or retire access.",
} as const;

export const mcpSecurityConfigExample = `# Example MCP server security profile

server:
  name: repo-inspector
  owner: platform-security
  transport: http
  default_capability: read-only

authorization:
  mode: oauth
  token_audience: https://mcp.example.com/repo-inspector
  required_scopes:
    - repo.read
  reject_token_passthrough: true

permissions:
  filesystem_roots:
    - /workspace/repo
  blocked_paths:
    - .env
    - secrets/
    - production/
  outbound_network_allowlist:
    - https://api.github.com
  write_methods: []
  destructive_methods: []

approvals:
  require_human_for:
    - secret_access
    - production_access
    - write_methods
    - delete_methods

audit:
  log_fields:
    - actor
    - session_id
    - server_version
    - method
    - target
    - approval_id
    - outcome
  redact:
    - tokens
    - secrets
    - file_contents

revocation:
  disable_server_command: platformctl mcp disable repo-inspector
  rotate_credentials_owner: platform-security
  incident_channel: "#security-incidents"`;

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

## Authentication choice

| Option | Use when | Main risk | Launch gate |
| --- | --- | --- | --- |
| OAuth / MCP authorization flow | HTTP-based servers need user or client authorization with audience-bound tokens and scopes | Token passthrough, wrong audience, excessive scopes, and confused-deputy behavior | Protected resource metadata exists, token audience is validated, scopes are minimal, and deny-path tests reject wrong-audience tokens |
| API key or service token | A server wraps a backend service that already uses scoped service credentials | Long-lived secrets in prompts, logs, repo files, local config, screenshots, or broad environment injection | The key is in managed storage, injected only at runtime, redacted from logs, scoped narrowly, and revocable |
| mTLS or private network identity | A production or internal server needs strong service-to-service identity | Certificate lifecycle drift, over-trusted network zones, unclear client identity, and missing emergency disablement | Client identity maps to allowed methods, certificate rotation is documented, and break-glass revocation works |

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

## Security config example

\`\`\`yaml
${mcpSecurityConfigExample}
\`\`\`

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
        `- [ ] **${control.title} (${control.risk})** - Verify: ${control.verificationMethod} Pass: ${control.passCriteria} _${claimTypeLabel[control.claimType]}._`,
    )
    .join("\n");
  const permissionRows = permissionMatrix
    .map(
      (row) =>
        `| ${escapeMarkdownTableCell(row.capability)} | ${escapeMarkdownTableCell(row.default)} | ${escapeMarkdownTableCell(row.dataRisk)} | ${escapeMarkdownTableCell(row.approval)} | ${escapeMarkdownTableCell(row.logging)} | ${escapeMarkdownTableCell(row.launchGate)} |`,
    )
    .join("\n");
  const authenticationRows = mcpSecurityAuthenticationMatrix
    .map(
      (row) =>
        `| ${escapeMarkdownTableCell(row.option)} | ${escapeMarkdownTableCell(row.useWhen)} | ${escapeMarkdownTableCell(row.mainRisk)} | ${escapeMarkdownTableCell(row.launchGate)} |`,
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

## Authentication choice

| Option | Use when | Main risk | Launch gate |
| --- | --- | --- | --- |
${authenticationRows}

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

## Security config example

\`\`\`yaml
${mcpSecurityConfigExample}
\`\`\`

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
