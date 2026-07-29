# Cursor Enterprise Security Assessment: 30 Administrator Controls

Version: 1.0.0  
Verified: 2026-07-30  
License: CC BY 4.0

Preferred citation: KyenAI. (2026). Cursor Enterprise Security Assessment: 30 Administrator Controls (Version 1.0.0). https://www.kyenai.com/articles/cursor-enterprise-organizations-governance

Public vendor claims are separated from KyenAI operational recommendations. Buyers must verify account, plan, region, model, workspace, console, and contract-specific behavior.

## Responsibility matrix

- **Cursor workspace owner:** Organization settings, roles, groups, and feature enablement
- **Identity admin:** SSO, SCIM, MFA, lifecycle, and emergency access
- **Security and privacy:** Privacy Mode, data flows, tools, logging, risk acceptance, and incident handling
- **Platform engineering:** Repository, model, MCP, sandbox, hook, and agent policies
- **Legal and procurement:** MSA, DPA, retention, processors, notification, audit, and exit terms

## Controls

### 01. Enforce SSO

- Domain: Identity
- Owner: Identity admin
- Guidance: Require SAML or OIDC SSO and disable local login where the plan permits it.
- Verify: Sign in with an assigned user and attempt a local-login bypass.
- Pass: Assigned users authenticate through the approved IdP and local bypass is blocked.
- Basis: Official public vendor material
- Contract or console check: Verify supported IdP, enforcement scope, break-glass behavior, and domain claim in the admin console.
- Sources: https://cursor.com/enterprise

### 02. Automate SCIM lifecycle

- Domain: Identity
- Owner: Identity admin
- Guidance: Provision and deprovision users and groups from the authoritative directory.
- Verify: Create, update, suspend, and delete a test user through SCIM.
- Pass: Every lifecycle event reaches Cursor within the documented service window.
- Basis: Official public vendor material
- Contract or console check: Verify group mapping, seat removal, token revocation, and plan availability in the contract and console.
- Sources: https://cursor.com/enterprise, https://cursor.com/pricing

### 03. Control break-glass access

- Domain: Identity
- Owner: Security
- Guidance: Keep emergency admin access limited, monitored, and tested.
- Verify: Review named emergency accounts and run a documented access test.
- Pass: Emergency access has MFA, a named owner, an expiry or review date, and an audit trail.
- Basis: KyenAI operational recommendation
- Contract or console check: Cursor's public pages do not define a universal break-glass workflow; verify available controls.
- Sources: https://cursor.com/security

### 04. Minimize admin roles

- Domain: Authorization
- Owner: Cursor workspace owner
- Guidance: Assign organization roles according to least privilege.
- Verify: Export or review every privileged member and business justification.
- Pass: Each privileged account has a current owner and required responsibility.
- Basis: Official public vendor material
- Contract or console check: Verify the exact role catalog and permissions in the active workspace.
- Sources: https://cursor.com/enterprise

### 05. Separate pilot and production groups

- Domain: Authorization
- Owner: Platform engineering
- Guidance: Use identity groups and policies to isolate experimental users from production-facing teams.
- Verify: Compare membership, repository scope, models, MCPs, and agent rules across groups.
- Pass: Pilot permissions cannot silently expand production access.
- Basis: KyenAI operational recommendation
- Contract or console check: Verify whether every required policy can be scoped by group.
- Sources: https://cursor.com/enterprise

### 06. Enforce Privacy Mode org-wide

- Domain: Data governance
- Owner: Security
- Guidance: Enable and enforce Privacy Mode for all covered users.
- Verify: Inspect the organization setting and test inheritance with a new member.
- Pass: New and existing members inherit the enforced setting.
- Basis: Official public vendor material
- Contract or console check: Verify plan, workspace, account, and client-specific behavior in the console and agreement.
- Sources: https://cursor.com/security, https://cursor.com/data-use, https://cursor.com/enterprise

### 07. Verify training exclusion

- Domain: Data governance
- Owner: Legal and security
- Guidance: Confirm that Privacy Mode excludes customer data from Cursor and model-provider training.
- Verify: Map the public claim to the signed DPA or MSA and active workspace setting.
- Pass: Contract language and console configuration support the same exclusion.
- Basis: Official public vendor material
- Contract or console check: Required: public marketing alone is not sufficient for the buyer's legal requirement.
- Sources: https://cursor.com/security, https://cursor.com/data-use, https://cursor.com/enterprise

### 08. Verify model-provider retention

- Domain: Data governance
- Owner: Privacy
- Guidance: Confirm the zero-data-retention arrangement for every enabled provider and model.
- Verify: Request the provider matrix and compare it with the model allowlist.
- Pass: Each enabled model has a documented retention treatment and exception path.
- Basis: Official public vendor material
- Contract or console check: Required: validate provider, model, region, abuse-monitoring exception, and change notification in contract or trust evidence.
- Sources: https://cursor.com/data-use, https://cursor.com/enterprise

### 09. Define Cursor-side retention

- Domain: Data governance
- Owner: Privacy
- Guidance: Document retention for prompts, code context, indexes, logs, analytics, support records, and backups.
- Verify: Build a data-flow and retention table from contract, product settings, and trust evidence.
- Pass: Every data class has a duration, deletion path, and accountable owner.
- Basis: KyenAI operational recommendation
- Contract or console check: Unknown until the active agreement, plan, features, and support process are reviewed.
- Sources: https://cursor.com/data-use, https://cursor.com/security, https://docs.cursor.com/account/privacy

### 10. Review subprocessors

- Domain: Data governance
- Owner: Vendor risk
- Guidance: Review Cursor and model-provider subprocessors before rollout and after changes.
- Verify: Download the current list, record purpose and location, and test change-notice handling.
- Pass: All material processors are approved or have a documented exception.
- Basis: Official public vendor material
- Contract or console check: Verify contract notice period and objection or termination rights.
- Sources: https://cursor.com/security

### 11. Confirm data residency

- Domain: Data governance
- Owner: Legal and security
- Guidance: Map required regions to actual processing, storage, backup, and support locations.
- Verify: Compare architecture and subprocessor evidence with policy requirements.
- Pass: No unapproved region receives protected data.
- Basis: KyenAI operational recommendation
- Contract or console check: Public pages do not establish a universal customer-selectable residency option; verify contractually.
- Sources: https://cursor.com/security

### 12. Verify encryption controls

- Domain: Data protection
- Owner: Security
- Guidance: Confirm TLS in transit and AES-256 at rest claims for covered services.
- Verify: Review trust evidence and, where available, configuration for customer-managed keys.
- Pass: Required data paths meet the organization's encryption standard.
- Basis: Official public vendor material
- Contract or console check: Verify feature scope, exclusions, key ownership, and availability of CMEK in the purchased plan.
- Sources: https://cursor.com/enterprise, https://cursor.com/security

### 13. Apply repository allowlists or blocklists

- Domain: Repository access
- Owner: Platform engineering
- Guidance: Limit which repositories agents and users may access.
- Verify: Attempt access to one approved and one denied repository.
- Pass: Approved access works; denied access fails and is logged.
- Basis: Official public vendor material
- Contract or console check: Verify whether policy is allowlist, blocklist, or both and which agent surfaces it covers.
- Sources: https://cursor.com/enterprise, https://cursor.com/pricing

### 14. Protect sensitive files

- Domain: Repository access
- Owner: Repository owner
- Guidance: Use repository exclusions and product policy to keep secrets and restricted paths out of AI requests.
- Verify: Run a controlled test against denied paths and inspect client behavior.
- Pass: Restricted files are not intentionally included in prompts, indexes, or agent actions.
- Basis: KyenAI operational recommendation
- Contract or console check: Cursor describes best-effort exclusions; verify residual risk and do not treat ignore files as a secret boundary.
- Sources: https://cursor.com/security

### 15. Restrict model access

- Domain: Model governance
- Owner: AI platform owner
- Guidance: Allow only approved models and providers.
- Verify: Compare the console allowlist with procurement and privacy approvals.
- Pass: Only reviewed models are selectable or routable.
- Basis: Official public vendor material
- Contract or console check: Verify new-model defaults, router behavior, provider retention, and change control.
- Sources: https://cursor.com/enterprise, https://cursor.com/pricing

### 16. Restrict MCP servers

- Domain: Tool governance
- Owner: AI platform owner
- Guidance: Allow only reviewed MCP servers and remove stale connections.
- Verify: Attempt to connect an approved and an unapproved MCP server.
- Pass: Unapproved servers are blocked; approved servers have an owner and review date.
- Basis: Official public vendor material
- Contract or console check: Verify policy coverage for desktop, CLI, cloud agents, plugins, and user-defined servers.
- Sources: https://cursor.com/enterprise, https://cursor.com/pricing

### 17. Protect MCP credentials

- Domain: Tool governance
- Owner: Security
- Guidance: Issue scoped credentials per server and avoid long-lived shared secrets.
- Verify: Inspect the credential store, scopes, rotation record, and revocation test.
- Pass: Credentials are least-privileged, non-exported where possible, rotated, and revocable.
- Basis: KyenAI operational recommendation
- Contract or console check: Verify where tokens are stored and which administrators or agents can reveal them.
- Sources: https://cursor.com/security

### 18. Set global agent rules

- Domain: Agent governance
- Owner: Platform engineering
- Guidance: Configure organization-wide agent policies before broad rollout.
- Verify: Inspect required rules and test behavior with a new user.
- Pass: Mandatory rules apply to supported agent surfaces and cannot be silently bypassed.
- Basis: Official public vendor material
- Contract or console check: Verify precedence, supported clients, sync timing, and exception workflow.
- Sources: https://cursor.com/enterprise

### 19. Constrain auto-run, browser, and network access

- Domain: Agent governance
- Owner: Security
- Guidance: Set conservative defaults for autonomous terminal, browser, and network actions.
- Verify: Run controlled allowed and denied actions in each supported agent surface.
- Pass: Denied actions require approval or fail; allowed actions are traceable.
- Basis: Official public vendor material
- Contract or console check: Verify differences among local, CLI, background, and cloud agents.
- Sources: https://cursor.com/pricing, https://cursor.com/security

### 20. Enforce sandbox policy

- Domain: Agent governance
- Owner: Endpoint and platform engineering
- Guidance: Use restricted execution for agent terminal commands where supported.
- Verify: Test workspace boundaries, temporary-file access, network denial, and escape handling.
- Pass: The configured sandbox restricts the expected files and network paths.
- Basis: Official public vendor material
- Contract or console check: Verify team-wide enforcement, bypass permissions, platform differences, and known exclusions.
- Sources: https://cursor.com/blog/enterprise, https://cursor.com/security

### 21. Distribute security hooks

- Domain: Agent governance
- Owner: Platform engineering
- Guidance: Use managed hooks to observe or block sensitive agent actions.
- Verify: Trigger before-prompt and before-command hooks with allowed and denied examples.
- Pass: Required hooks run, fail closed where intended, and generate reviewable evidence.
- Basis: Official public vendor material
- Contract or console check: Verify server-side distribution, tamper resistance, timeout behavior, and plan availability.
- Sources: https://cursor.com/blog/enterprise, https://cursor.com/pricing

### 22. Test prompt-injection resistance

- Domain: Agent governance
- Owner: Product security
- Guidance: Exercise untrusted repository, web, issue, and MCP content against the approved configuration.
- Verify: Run a documented adversarial test with canary secrets and denied tools.
- Pass: The agent does not exfiltrate canaries or cross the configured approval boundary.
- Basis: KyenAI operational recommendation
- Contract or console check: No public vendor page proves safety for the buyer's exact tools and data; validate locally.
- Sources: https://cursor.com/security

### 23. Enable and export audit logs

- Domain: Logging
- Owner: Security operations
- Guidance: Capture access, administrative, rule, and configuration events.
- Verify: Change a test setting and confirm the event appears in dashboard and CSV export.
- Pass: Event identity, timestamp, action, target, and outcome are available for the required period.
- Basis: Official public vendor material
- Contract or console check: Verify event catalog, retention, API or export, latency, and plan limits.
- Sources: https://cursor.com/blog/enterprise, https://cursor.com/pricing

### 24. Govern analytics and API exports

- Domain: Logging
- Owner: Data governance
- Guidance: Review adoption, usage, and AI-code metrics without over-collecting employee data.
- Verify: Inventory dashboard fields, API outputs, recipients, and retention.
- Pass: Metrics have a declared purpose, access control, retention period, and employee notice where required.
- Basis: Official public vendor material
- Contract or console check: Verify exact fields and legal basis before enabling broad reporting.
- Sources: https://cursor.com/enterprise, https://cursor.com/blog/enterprise

### 25. Integrate security monitoring

- Domain: Logging
- Owner: Security operations
- Guidance: Route available audit evidence into the organization's monitoring and incident workflow.
- Verify: Generate a high-risk test event and trace it from Cursor to the response queue.
- Pass: The event is ingested, enriched, assigned, and retained under policy.
- Basis: KyenAI operational recommendation
- Contract or console check: Verify supported export or API paths and compensate for unavailable events.
- Sources: https://cursor.com/blog/enterprise

### 26. Obtain SOC 2 and penetration-test evidence

- Domain: Assurance
- Owner: Vendor risk
- Guidance: Request current SOC 2 Type II and penetration-test materials from the trust portal.
- Verify: Record report period, exceptions, complementary controls, and remediation commitments.
- Pass: Evidence is current and gaps are accepted by accountable owners.
- Basis: Official public vendor material
- Contract or console check: Required: verify report coverage and bridge letters; certification is not a universal guarantee.
- Sources: https://cursor.com/security, https://cursor.com/enterprise

### 27. Confirm incident notification

- Domain: Assurance
- Owner: Legal and security
- Guidance: Set contractual notification, cooperation, evidence-preservation, and post-incident obligations.
- Verify: Map the signed agreement to the incident response plan and contacts.
- Pass: Timeframes and responsibilities meet organizational requirements.
- Basis: KyenAI operational recommendation
- Contract or console check: Public pages do not define every customer's binding incident terms; verify the MSA or DPA.
- Sources: https://cursor.com/security

### 28. Test deletion and offboarding

- Domain: Lifecycle
- Owner: Privacy and identity
- Guidance: Validate account, workspace, index, token, automation, and retained-data cleanup.
- Verify: Offboard a test user and submit a deletion request; record each completion.
- Pass: Access is revoked promptly and deletion follows the documented schedule.
- Basis: KyenAI operational recommendation
- Contract or console check: Verify backups, legal holds, logs, shared artifacts, and contract termination handling.
- Sources: https://cursor.com/security, https://docs.cursor.com/account/privacy

### 29. Monitor material product and policy changes

- Domain: Lifecycle
- Owner: Vendor owner
- Guidance: Track changes to models, subprocessors, retention, security features, and acquisition status.
- Verify: Review vendor notices monthly and compare them with the approved baseline.
- Pass: Material changes create a documented reassessment before policy expansion.
- Basis: KyenAI operational recommendation
- Contract or console check: Verify notification channels and contractual change rights.
- Sources: https://cursor.com/security, https://cursor.com/data-use

### 30. Maintain an exit and portability plan

- Domain: Lifecycle
- Owner: Engineering leadership
- Guidance: Keep repository instructions, workflows, evidence, and critical automations portable to another agent.
- Verify: Run an annual migration exercise on a representative repository.
- Pass: The team can revoke Cursor access and continue critical work within the recovery objective.
- Basis: KyenAI operational recommendation
- Contract or console check: Verify export availability, data return, deletion, license termination, and dependency inventory.
- Sources: https://cursor.com/enterprise

