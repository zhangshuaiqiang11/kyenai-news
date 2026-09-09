# MCP security review

Verified: 2026-09-08

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
| OAuth / MCP authorization flow | HTTP-based servers need user or client authorization with audience-bound access tokens and scopes. | Token passthrough, wrong audience, excessive scopes, confused-deputy behavior, and stale refresh paths. | Protected resource metadata exists, token audience is validated, scopes are minimal, and deny-path tests reject wrong-audience tokens. |
| API key or service token | A server wraps a backend service that already uses scoped service credentials or short-lived runtime tokens. | Long-lived secrets in prompts, logs, repo files, local config, screenshots, or broad environment injection. | The key is stored in managed secret storage, injected only at runtime, redacted from logs, scoped narrowly, and revocable by an owner. |
| mTLS or private network identity | A production or internal server needs strong service-to-service identity inside a controlled network boundary. | Certificate lifecycle drift, over-trusted network zones, unclear client identity, and missing emergency disablement. | Client identity is mapped to allowed methods, certificate rotation is documented, network allowlists are tested, and break-glass revocation works. |

## Threat model

- [ ] **Prompt injection** - Untrusted repository, issue, webpage, or tool output can steer an agent toward a dangerous MCP call. Treat this as a general AI agent tool security threat and keep consequential capabilities independently constrained. _KyenAI operational recommendation._
- [ ] **Excessive permissions or scope** - A client, server, or token with broader scopes than the workflow needs increases blast radius. MCP guidance recommends minimal scopes and incremental elevation when more access is required. _Official MCP requirement or guidance._
- [ ] **Secret or token exposure** - Token passthrough, insecure storage, logs, prompts, or server output can disclose credentials. MCP authorization guidance requires audience-bound token validation and rejects accepting tokens not issued for the MCP server. _Official MCP requirement or guidance._
- [ ] **Unsafe writes or deletes** - A valid tool call can still overwrite code, delete data, or mutate production state. Read/write separation and human approval are KyenAI operating controls, not claims that the MCP specification mandates those controls. _KyenAI operational recommendation._
- [ ] **Network reach or SSRF** - An MCP server that retrieves URLs or authorization metadata can become an SSRF path to internal services. Official guidance calls for URL validation, restricted redirects, and controls around private network destinations. _Official MCP requirement or guidance._
- [ ] **Third-party supply chain or local server compromise** - A malicious or compromised local MCP server can execute with the user's privileges and reach local data. Official guidance recommends explicit consent, sandboxing, least privilege, and trusted installation sources. _Official MCP requirement or guidance._

## Control checklist

- [ ] **Validate access-token audience (Critical)** - Verify: Send valid, wrong-audience, expired, and unsigned tokens to each protected endpoint. Pass: Only the valid audience-bound token is accepted; every other token is rejected without reaching a tool. _Official MCP requirement or guidance._
- [ ] **Require per-client consent (Critical)** - Verify: Authorize one client, then initiate the same flow from a new client ID while the original consent cookie remains present. Pass: The new client receives its own consent screen and cannot inherit the first client's approval. _Official MCP requirement or guidance._
- [ ] **Validate redirect URIs, state, and CSRF (Critical)** - Verify: Replay state values and try wildcard, changed, missing, and attacker-controlled redirect URIs. Pass: Every mismatch or replay is rejected and approved redirects use exact registered values. _Official MCP requirement or guidance._
- [ ] **Reject token passthrough (Critical)** - Verify: Present a token issued only for a downstream API and trace whether it can cross the MCP boundary. Pass: The MCP server rejects the token and never forwards it downstream. _Official MCP requirement or guidance._
- [ ] **Minimize scopes and elevate incrementally (High)** - Verify: Map every requested scope to one enabled method and run the workflow with optional scopes removed. Pass: No unused wildcard or admin scope remains and elevation is explicit and operation-specific. _Official MCP requirement or guidance._
- [ ] **Protect and rotate secrets and tokens (Critical)** - Verify: Scan configuration, prompts, logs, errors, screenshots, and source history, then rotate a test credential. Pass: No plaintext credential appears and the old credential stops working after rotation. _KyenAI operational recommendation._
- [ ] **Never use sessions as authentication (Critical)** - Verify: Reuse a captured session ID without valid authorization and attempt calls against another server instance. Pass: The request is rejected and the session ID alone grants no capability. _Official MCP requirement or guidance._
- [ ] **Secure, bind, rotate, and expire session IDs (High)** - Verify: Test predictable IDs, cross-user reuse, cross-instance replay, and expired-session behavior. Pass: IDs are unguessable, user-bound, time-bounded, and rejected outside their authorized context. _Official MCP requirement or guidance._
- [ ] **Allow only safe authorization URL schemes (Critical)** - Verify: Return authorization endpoints using unsafe schemes, encoded variants, and HTTP on non-loopback hosts. Pass: Only HTTPS production URLs and explicitly allowed loopback development URLs open. _Official MCP requirement or guidance._
- [ ] **Open authorization URLs without a shell (Critical)** - Verify: Supply URLs containing shell metacharacters, quotes, spaces, and encoded command separators. Pass: The URL is parsed as data, no shell starts, and suspicious values are rejected and logged. _Official MCP requirement or guidance._
- [ ] **Block SSRF to private and metadata ranges (Critical)** - Verify: Try IPv4, IPv6, encoded, hostname, and cloud-metadata targets through every URL-fetching path. Pass: All private or reserved destinations are blocked before connection and responses are not reflected. _Official MCP requirement or guidance._
- [ ] **Revalidate redirects and DNS results (High)** - Verify: Use redirect chains and a test hostname that changes from a public to a private address. Pass: Every hop is revalidated and a destination change to a blocked address terminates the request. _Official MCP requirement or guidance._
- [ ] **Enforce an outbound network allowlist (High)** - Verify: Attempt direct IP, undeclared domain, private range, redirect, and DNS-rebinding egress from the runtime. Pass: Only reviewed destinations succeed and bypass paths cannot reach undeclared networks. _Official MCP requirement or guidance._
- [ ] **Require consent before local server installation (Critical)** - Verify: Start installation from a deep link or imported configuration and inspect the complete pre-execution consent flow. Pass: No command runs before explicit approval and the user can cancel without side effects. _Official MCP requirement or guidance._
- [ ] **Display full commands and dangerous-pattern warnings (High)** - Verify: Test long, multiline, obfuscated, and destructive commands in the installation dialog. Pass: The entire command is visible and dangerous patterns produce a clear warning before approval. _Official MCP requirement or guidance._
- [ ] **Sandbox local MCP servers (Critical)** - Verify: Attempt to read outside allowed roots, spawn child processes, reach the network, and access system credentials. Pass: Default-denied actions fail and each additional privilege requires a narrow explicit grant. _Official MCP requirement or guidance._
- [ ] **Restrict stdio proxy process spawning (Critical)** - Verify: Use a compromised-client test to request an arbitrary executable, unexpected arguments, and access outside the sandbox. Pass: Unapproved commands and arguments are denied and allowed process creation is attributable and contained. _Official MCP requirement or guidance._
- [ ] **Inventory and scope every exposed tool (High)** - Verify: Enumerate tools with MCP Inspector and compare them with the approved capability inventory. Pass: Every exposed tool has a declared workflow and no undeclared or wildcard capability remains. _KyenAI operational recommendation._
- [ ] **Separate read, write, and delete capabilities (High)** - Verify: Run the read-only workflow and attempt every mutation and deletion method with the same identity. Pass: Reads work within declared roots while all write and delete attempts are denied. _KyenAI operational recommendation._
- [ ] **Contain prompt-injection-triggered tool calls (Critical)** - Verify: Place malicious instructions in each untrusted input source and observe requested tool calls and permission changes. Pass: Untrusted content cannot expand authority, reveal credentials, or execute a consequential call without policy approval. _KyenAI operational recommendation._
- [ ] **Require human approval for consequential actions (Critical)** - Verify: Simulate each consequential action and inspect the approval prompt, actor, target, rollback limits, and timeout behavior. Pass: The action cannot proceed without an informed, current, target-specific approval. _KyenAI operational recommendation._
- [ ] **Keep attributable, secret-redacted audit logs (High)** - Verify: Run allowed and denied calls, then reconstruct them from logs and scan the records for credential patterns. Pass: A reviewer can reconstruct consequential calls and no secret or sensitive payload is exposed. _KyenAI operational recommendation._
- [ ] **Pin and review server supply-chain inputs (High)** - Verify: Rebuild from a clean environment and compare resolved packages, checksums, publisher identity, and startup command with the review record. Pass: The reviewed artifact is reproducible and an unexpected publisher, version, or dependency blocks launch. _KyenAI operational recommendation._
- [ ] **Test revocation and incident response (Critical)** - Verify: Run a tabletop incident, disable the server, revoke a test credential, and attempt the former workflow again. Pass: Old access fails immediately, owners receive evidence, and restoration requires a documented decision. _KyenAI operational recommendation._
- [ ] **Validate allow and deny paths with MCP Inspector (Medium)** - Verify: Run the Inspector against the exact reviewed server version and preserve results for every enabled capability. Pass: The exposed surface matches inventory, allow cases work, deny cases stay denied, and errors reveal no secrets. _KyenAI operational recommendation._

## Permission matrix

| Capability | Default | Data risk | Approval | Logging | Launch gate |
| --- | --- | --- | --- | --- | --- |
| Read repository files | Allow read-only access to declared roots | Source code, internal documentation, and embedded sensitive data | Owner approval at onboarding; no per-call approval for declared roots | Log server, actor, session, method, root, and outcome; avoid file contents | Roots are explicit, symlink escape is tested, and secret-bearing paths are excluded |
| Write repository files | Deny until a bounded write workflow is approved | Code integrity, build behavior, generated files, and policy changes | Per-task approval for bounded paths; review the resulting diff | Log target paths, method, approval, result, and commit or diff reference | Writes are path-scoped, reversible, and separated from delete capability |
| Delete repository files | Deny | Irrecoverable source or configuration loss | Per-action human approval with exact targets | Log target list, approver, timestamp, result, and recovery reference | A recovery path exists and wildcard or root deletion is blocked |
| Outbound network access | Deny except approved destinations | Data exfiltration, SSRF, dependency substitution, and callback abuse | Owner approval for an allowlist; separate review for new destinations | Log destination, resolved address class, method, bytes category, and outcome | Private ranges, metadata services, redirects, and DNS rebinding are tested |
| Secret access | Deny; inject only the minimum runtime credential | Account takeover, lateral movement, and persistent credential disclosure | Security owner approval and per-use approval for high-impact credentials | Log secret identifier and use outcome, never the secret value | Managed storage, audience and scope restrictions, rotation, and revocation are tested |
| Production access | Deny | Customer impact, regulated data exposure, destructive changes, and outages | Per-action human approval by an authorized production owner | Log actor, approver, server version, action, target, change reference, and outcome | Staging validation, rollback, incident contact, and emergency disablement are proven |

## Validation workflow

- [ ] Run the MCP Inspector against the reviewed server and version.
- [ ] Enumerate resources, prompts, tools, notifications, and protocol exchanges.
- [ ] Exercise expected allow and deny cases for every enabled capability.
- [ ] Confirm errors and logs do not expose tokens, secrets, or unnecessary sensitive payloads.
- [ ] Record evidence links and unresolved findings.

## Security config example

```yaml
# Example MCP server security profile

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
  incident_channel: "#security-incidents"
```

## Review cadence and revocation

- Cadence: Review at least quarterly and whenever the server owner, publisher, version, dependencies, scopes, credentials, methods, data classes, network reach, or deployment environment materially changes.
- Revocation / incident response: Disable the server, revoke tokens and secrets, remove client access, preserve attributable records, assess affected systems and data, rotate downstream credentials, and document the decision to restore or retire access.

## Evidence

- [MCP security best practices](https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices) - Official guidance for authorization, token handling, least-privilege scopes, session security, SSRF, and local MCP server compromise.
- [MCP authorization specification](https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization) - Official protocol requirements for HTTP-based authorization, protected resource metadata, access tokens, scopes, and audience validation.
- [MCP authorization security considerations](https://modelcontextprotocol.io/specification/draft/basic/authorization/security-considerations) - Official security considerations for confused-deputy attacks, token passthrough, audience validation, SSRF, session hijacking, and local server compromise.
- [MCP Inspector](https://modelcontextprotocol.io/docs/tools/inspector) - Official interactive validation workflow for inspecting server resources, prompts, tools, notifications, and protocol exchanges.

## Sign-off

- Reviewer:
- Review date:
- Sign-off:
- Findings or exceptions:
