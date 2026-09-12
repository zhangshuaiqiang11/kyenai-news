export const cursorEnterpriseSecurityVerifiedAt = "2026-09-12";
export const cursorEnterpriseSecurityVersion = "1.2.0";

const urls = {
  enterprise: "https://cursor.com/enterprise",
  security: "https://cursor.com/security",
  dataUse: "https://cursor.com/data-use",
  enterpriseLaunch: "https://cursor.com/blog/enterprise",
  pricing: "https://cursor.com/pricing",
  docs: "https://prod.cursor.com/docs/enterprise/privacy-and-data-governance",
} as const;

export const cursorEnterpriseSecuritySources = [
  {
    title: "Cursor for Enterprise",
    url: urls.enterprise,
    scope: "Identity, SCIM, admin, repository, model, MCP, agent, analytics, and encryption claims",
    verifiedAt: cursorEnterpriseSecurityVerifiedAt,
    verificationConclusion: "Public enterprise materials support organization, identity, repository, model, MCP, agent, analytics, and encryption control questions; exact availability remains plan-specific.",
    verificationChangeNote: "Rechecked September 12, 2026 and retained account, plan, workspace, and contract qualification for every control.",
  },
  {
    title: "Cursor Security",
    url: urls.security,
    scope: "Certifications, infrastructure, Privacy Mode, client and agent security, and trust evidence",
    verifiedAt: cursorEnterpriseSecurityVerifiedAt,
    verificationConclusion: "The current security page supports Privacy Mode, enterprise administration, client and agent security, and trust-evidence claims as of its August 25 update.",
    verificationChangeNote: "Rechecked September 12, 2026 and preserved the page's scope and exception language.",
  },
  {
    title: "Data Use & Privacy Overview",
    url: urls.dataUse,
    scope: "Privacy Mode, model-provider handling, training, storage, and policy exceptions",
    verifiedAt: cursorEnterpriseSecurityVerifiedAt,
    verificationConclusion: "Privacy Mode excludes customer data from training and provider ZDR arrangements have documented exceptions for abuse detection, non-ZDR models, and feature-specific storage.",
    verificationChangeNote: "Rechecked September 12, 2026 against the September 3 data-use revision and updated the retention boundary.",
  },
  {
    title: "Introducing Cursor for Enterprise",
    url: urls.enterpriseLaunch,
    scope: "Hooks, team rules, analytics, audit log, and sandbox behavior",
    verifiedAt: cursorEnterpriseSecurityVerifiedAt,
    verificationConclusion: "The enterprise launch material supports questions about managed rules, hooks, analytics, audit evidence, and sandbox-related controls.",
    verificationChangeNote: "Rechecked September 12, 2026 and labeled operational recommendations separately from public vendor claims.",
  },
  {
    title: "Cursor Pricing",
    url: urls.pricing,
    scope: "Current plan-level enterprise controls and availability",
    verifiedAt: cursorEnterpriseSecurityVerifiedAt,
    verificationConclusion: "Pricing and plan materials are used only to flag availability questions; they do not establish a universal control for every contract.",
    verificationChangeNote: "Rechecked September 12, 2026 and retained the requirement to verify purchased-plan behavior in the console and agreement.",
  },
] as const;

export type CursorSecurityControl = {
  id: string;
  domain: string;
  title: string;
  owner: string;
  guidance: string;
  verificationMethod: string;
  passCriteria: string;
  claimBasis: "official-public" | "kyenai-recommendation";
  contractOrConsoleCheck: string;
  sourceUrls: string[];
};

const official = (
  id: string,
  domain: string,
  title: string,
  owner: string,
  guidance: string,
  verificationMethod: string,
  passCriteria: string,
  contractOrConsoleCheck: string,
  sourceUrls: string[],
): CursorSecurityControl => ({
  id, domain, title, owner, guidance, verificationMethod, passCriteria,
  claimBasis: "official-public", contractOrConsoleCheck, sourceUrls,
});

const recommended = (
  id: string,
  domain: string,
  title: string,
  owner: string,
  guidance: string,
  verificationMethod: string,
  passCriteria: string,
  contractOrConsoleCheck: string,
  sourceUrls: string[],
): CursorSecurityControl => ({
  id, domain, title, owner, guidance, verificationMethod, passCriteria,
  claimBasis: "kyenai-recommendation", contractOrConsoleCheck, sourceUrls,
});

export const cursorEnterpriseSecurityControls: CursorSecurityControl[] = [
  official("identity-sso", "Identity", "Enforce SSO", "Identity admin", "Require SAML or OIDC SSO and disable local login where the plan permits it.", "Sign in with an assigned user and attempt a local-login bypass.", "Assigned users authenticate through the approved IdP and local bypass is blocked.", "Verify supported IdP, enforcement scope, break-glass behavior, and domain claim in the admin console.", [urls.enterprise]),
  official("identity-scim", "Identity", "Automate SCIM lifecycle", "Identity admin", "Provision and deprovision users and groups from the authoritative directory.", "Create, update, suspend, and delete a test user through SCIM.", "Every lifecycle event reaches Cursor within the documented service window.", "Verify group mapping, seat removal, token revocation, and plan availability in the contract and console.", [urls.enterprise, urls.pricing]),
  recommended("identity-break-glass", "Identity", "Control break-glass access", "Security", "Keep emergency admin access limited, monitored, and tested.", "Review named emergency accounts and run a documented access test.", "Emergency access has MFA, a named owner, an expiry or review date, and an audit trail.", "Cursor's public pages do not define a universal break-glass workflow; verify available controls.", [urls.security]),
  official("roles-admin", "Authorization", "Minimize admin roles", "Cursor workspace owner", "Assign organization roles according to least privilege.", "Export or review every privileged member and business justification.", "Each privileged account has a current owner and required responsibility.", "Verify the exact role catalog and permissions in the active workspace.", [urls.enterprise]),
  recommended("groups-separation", "Authorization", "Separate pilot and production groups", "Platform engineering", "Use identity groups and policies to isolate experimental users from production-facing teams.", "Compare membership, repository scope, models, MCPs, and agent rules across groups.", "Pilot permissions cannot silently expand production access.", "Verify whether every required policy can be scoped by group.", [urls.enterprise]),
  official("privacy-enforcement", "Data governance", "Enforce Privacy Mode org-wide", "Security", "Enable and enforce Privacy Mode for all covered users.", "Inspect the organization setting and test inheritance with a new member.", "New and existing members inherit the enforced setting.", "Verify plan, workspace, account, and client-specific behavior in the console and agreement.", [urls.security, urls.dataUse, urls.enterprise]),
  official("training-exclusion", "Data governance", "Verify training exclusion", "Legal and security", "Confirm that Privacy Mode excludes customer data from Cursor and model-provider training.", "Map the public claim to the signed DPA or MSA and active workspace setting.", "Contract language and console configuration support the same exclusion.", "Required: public marketing alone is not sufficient for the buyer's legal requirement.", [urls.security, urls.dataUse, urls.enterprise]),
  official("provider-retention", "Data governance", "Verify model-provider retention", "Privacy", "Confirm the zero-data-retention arrangement for every enabled provider and model.", "Request the provider matrix and compare it with the model allowlist.", "Each enabled model has a documented retention treatment and exception path.", "Required: validate provider, model, region, abuse-monitoring exception, and change notification in contract or trust evidence.", [urls.dataUse, urls.enterprise]),
  recommended("cursor-retention", "Data governance", "Define Cursor-side retention", "Privacy", "Document retention for prompts, code context, indexes, logs, analytics, support records, and backups.", "Build a data-flow and retention table from contract, product settings, and trust evidence.", "Every data class has a duration, deletion path, and accountable owner.", "Unknown until the active agreement, plan, features, and support process are reviewed.", [urls.dataUse, urls.security, urls.docs]),
  official("subprocessors", "Data governance", "Review subprocessors", "Vendor risk", "Review Cursor and model-provider subprocessors before rollout and after changes.", "Download the current list, record purpose and location, and test change-notice handling.", "All material processors are approved or have a documented exception.", "Verify contract notice period and objection or termination rights.", [urls.security]),
  recommended("data-residency", "Data governance", "Confirm data residency", "Legal and security", "Map required regions to actual processing, storage, backup, and support locations.", "Compare architecture and subprocessor evidence with policy requirements.", "No unapproved region receives protected data.", "Public pages do not establish a universal customer-selectable residency option; verify contractually.", [urls.security]),
  official("encryption", "Data protection", "Verify encryption controls", "Security", "Confirm TLS in transit and AES-256 at rest claims for covered services.", "Review trust evidence and, where available, configuration for customer-managed keys.", "Required data paths meet the organization's encryption standard.", "Verify feature scope, exclusions, key ownership, and availability of CMEK in the purchased plan.", [urls.enterprise, urls.security]),
  official("repo-policy", "Repository access", "Apply repository allowlists or blocklists", "Platform engineering", "Limit which repositories agents and users may access.", "Attempt access to one approved and one denied repository.", "Approved access works; denied access fails and is logged.", "Verify whether policy is allowlist, blocklist, or both and which agent surfaces it covers.", [urls.enterprise, urls.pricing]),
  recommended("sensitive-files", "Repository access", "Protect sensitive files", "Repository owner", "Use repository exclusions and product policy to keep secrets and restricted paths out of AI requests.", "Run a controlled test against denied paths and inspect client behavior.", "Restricted files are not intentionally included in prompts, indexes, or agent actions.", "Cursor describes best-effort exclusions; verify residual risk and do not treat ignore files as a secret boundary.", [urls.security]),
  official("model-policy", "Model governance", "Restrict model access", "AI platform owner", "Allow only approved models and providers.", "Compare the console allowlist with procurement and privacy approvals.", "Only reviewed models are selectable or routable.", "Verify new-model defaults, router behavior, provider retention, and change control.", [urls.enterprise, urls.pricing]),
  official("mcp-policy", "Tool governance", "Restrict MCP servers", "AI platform owner", "Allow only reviewed MCP servers and remove stale connections.", "Attempt to connect an approved and an unapproved MCP server.", "Unapproved servers are blocked; approved servers have an owner and review date.", "Verify policy coverage for desktop, CLI, cloud agents, plugins, and user-defined servers.", [urls.enterprise, urls.pricing]),
  recommended("mcp-secrets", "Tool governance", "Protect MCP credentials", "Security", "Issue scoped credentials per server and avoid long-lived shared secrets.", "Inspect the credential store, scopes, rotation record, and revocation test.", "Credentials are least-privileged, non-exported where possible, rotated, and revocable.", "Verify where tokens are stored and which administrators or agents can reveal them.", [urls.security]),
  official("agent-global-rules", "Agent governance", "Set global agent rules", "Platform engineering", "Configure organization-wide agent policies before broad rollout.", "Inspect required rules and test behavior with a new user.", "Mandatory rules apply to supported agent surfaces and cannot be silently bypassed.", "Verify precedence, supported clients, sync timing, and exception workflow.", [urls.enterprise]),
  official("auto-run-controls", "Agent governance", "Constrain auto-run, browser, and network access", "Security", "Set conservative defaults for autonomous terminal, browser, and network actions.", "Run controlled allowed and denied actions in each supported agent surface.", "Denied actions require approval or fail; allowed actions are traceable.", "Verify differences among local, CLI, background, and cloud agents.", [urls.pricing, urls.security]),
  official("sandbox", "Agent governance", "Enforce sandbox policy", "Endpoint and platform engineering", "Use restricted execution for agent terminal commands where supported.", "Test workspace boundaries, temporary-file access, network denial, and escape handling.", "The configured sandbox restricts the expected files and network paths.", "Verify team-wide enforcement, bypass permissions, platform differences, and known exclusions.", [urls.enterpriseLaunch, urls.security]),
  official("hooks", "Agent governance", "Distribute security hooks", "Platform engineering", "Use managed hooks to observe or block sensitive agent actions.", "Trigger before-prompt and before-command hooks with allowed and denied examples.", "Required hooks run, fail closed where intended, and generate reviewable evidence.", "Verify server-side distribution, tamper resistance, timeout behavior, and plan availability.", [urls.enterpriseLaunch, urls.pricing]),
  recommended("prompt-injection", "Agent governance", "Test prompt-injection resistance", "Product security", "Exercise untrusted repository, web, issue, and MCP content against the approved configuration.", "Run a documented adversarial test with canary secrets and denied tools.", "The agent does not exfiltrate canaries or cross the configured approval boundary.", "No public vendor page proves safety for the buyer's exact tools and data; validate locally.", [urls.security]),
  official("audit-log", "Logging", "Enable and export audit logs", "Security operations", "Capture access, administrative, rule, and configuration events.", "Change a test setting and confirm the event appears in dashboard and CSV export.", "Event identity, timestamp, action, target, and outcome are available for the required period.", "Verify event catalog, retention, API or export, latency, and plan limits.", [urls.enterpriseLaunch, urls.pricing]),
  official("analytics-export", "Logging", "Govern analytics and API exports", "Data governance", "Review adoption, usage, and AI-code metrics without over-collecting employee data.", "Inventory dashboard fields, API outputs, recipients, and retention.", "Metrics have a declared purpose, access control, retention period, and employee notice where required.", "Verify exact fields and legal basis before enabling broad reporting.", [urls.enterprise, urls.enterpriseLaunch]),
  recommended("siem-monitoring", "Logging", "Integrate security monitoring", "Security operations", "Route available audit evidence into the organization's monitoring and incident workflow.", "Generate a high-risk test event and trace it from Cursor to the response queue.", "The event is ingested, enriched, assigned, and retained under policy.", "Verify supported export or API paths and compensate for unavailable events.", [urls.enterpriseLaunch]),
  official("trust-evidence", "Assurance", "Obtain SOC 2 and penetration-test evidence", "Vendor risk", "Request current SOC 2 Type II and penetration-test materials from the trust portal.", "Record report period, exceptions, complementary controls, and remediation commitments.", "Evidence is current and gaps are accepted by accountable owners.", "Required: verify report coverage and bridge letters; certification is not a universal guarantee.", [urls.security, urls.enterprise]),
  recommended("incident-notice", "Assurance", "Confirm incident notification", "Legal and security", "Set contractual notification, cooperation, evidence-preservation, and post-incident obligations.", "Map the signed agreement to the incident response plan and contacts.", "Timeframes and responsibilities meet organizational requirements.", "Public pages do not define every customer's binding incident terms; verify the MSA or DPA.", [urls.security]),
  recommended("deletion", "Lifecycle", "Test deletion and offboarding", "Privacy and identity", "Validate account, workspace, index, token, automation, and retained-data cleanup.", "Offboard a test user and submit a deletion request; record each completion.", "Access is revoked promptly and deletion follows the documented schedule.", "Verify backups, legal holds, logs, shared artifacts, and contract termination handling.", [urls.security, urls.docs]),
  recommended("change-management", "Lifecycle", "Monitor material product and policy changes", "Vendor owner", "Track changes to models, subprocessors, retention, security features, and acquisition status.", "Review vendor notices monthly and compare them with the approved baseline.", "Material changes create a documented reassessment before policy expansion.", "Verify notification channels and contractual change rights.", [urls.security, urls.dataUse]),
  recommended("exit-portability", "Lifecycle", "Maintain an exit and portability plan", "Engineering leadership", "Keep repository instructions, workflows, evidence, and critical automations portable to another agent.", "Run an annual migration exercise on a representative repository.", "The team can revoke Cursor access and continue critical work within the recovery objective.", "Verify export availability, data return, deletion, license termination, and dependency inventory.", [urls.enterprise]),
];

if (cursorEnterpriseSecurityControls.length !== 30) {
  throw new Error(`Expected 30 Cursor enterprise security controls, found ${cursorEnterpriseSecurityControls.length}`);
}

export const cursorEnterpriseResponsibilityMatrix = [
  { role: "Cursor workspace owner", accountableFor: "Organization settings, roles, groups, and feature enablement" },
  { role: "Identity admin", accountableFor: "SSO, SCIM, MFA, lifecycle, and emergency access" },
  { role: "Security and privacy", accountableFor: "Privacy Mode, data flows, tools, logging, risk acceptance, and incident handling" },
  { role: "Platform engineering", accountableFor: "Repository, model, MCP, sandbox, hook, and agent policies" },
  { role: "Legal and procurement", accountableFor: "MSA, DPA, retention, processors, notification, audit, and exit terms" },
] as const;

export const cursorEnterpriseSecurityDownloads = {
  pdf: "/resources/cursor-enterprise-security-controls.pdf",
  csv: "/resources/cursor-enterprise-security-controls.csv",
  json: "/resources/cursor-enterprise-security-controls.json",
  review: "/resources/cursor-enterprise-security-review.md",
} as const;
