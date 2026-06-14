# MCP security review

Verified: 2026-06-14

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

- [ ] **Prompt injection** - Untrusted repository, issue, webpage, or tool output can steer an agent toward a dangerous MCP call. Treat this as a general AI agent tool security threat and keep consequential capabilities independently constrained. _KyenAI operational recommendation._
- [ ] **Excessive permissions or scope** - A client, server, or token with broader scopes than the workflow needs increases blast radius. MCP guidance recommends minimal scopes and incremental elevation when more access is required. _Official MCP requirement or guidance._
- [ ] **Secret or token exposure** - Token passthrough, insecure storage, logs, prompts, or server output can disclose credentials. MCP authorization guidance requires audience-bound token validation and rejects accepting tokens not issued for the MCP server. _Official MCP requirement or guidance._
- [ ] **Unsafe writes or deletes** - A valid tool call can still overwrite code, delete data, or mutate production state. Read/write separation and human approval are KyenAI operating controls, not claims that the MCP specification mandates those controls. _KyenAI operational recommendation._
- [ ] **Network reach or SSRF** - An MCP server that retrieves URLs or authorization metadata can become an SSRF path to internal services. Official guidance calls for URL validation, restricted redirects, and controls around private network destinations. _Official MCP requirement or guidance._
- [ ] **Third-party supply chain or local server compromise** - A malicious or compromised local MCP server can execute with the user's privileges and reach local data. Official guidance recommends explicit consent, sandboxing, least privilege, and trusted installation sources. _Official MCP requirement or guidance._

## Control checklist

- [ ] **Authentication and authorization** - Document the authorization server, protected resource metadata, token audience, scopes, and deny-path tests. _Official MCP requirement or guidance._
- [ ] **Least privilege** - Every enabled method, filesystem root, API scope, and environment has a documented use case. _Official MCP requirement or guidance._
- [ ] **Secure secret and token storage with rotation** - Record storage location, redaction behavior, token lifetime, rotation owner, and emergency revocation procedure. _Official MCP requirement or guidance._
- [ ] **Read and write separation** - A read-only profile can be enabled without write, delete, secret, or production permissions. _KyenAI operational recommendation._
- [ ] **Human approval for destructive or production actions** - Approval prompts identify the actor, target, action, data, environment, and rollback limits. _KyenAI operational recommendation._
- [ ] **Attributable audit logs** - A reviewer can reconstruct a consequential call and its approval without exposing credentials. _KyenAI operational recommendation._
- [ ] **Isolation and network allowlists** - The server cannot reach undeclared private addresses, metadata endpoints, filesystem roots, or child processes. _KyenAI operational recommendation._
- [ ] **Revocation and incident response** - The owner has tested disablement and credential revocation, with named incident and escalation contacts. _KyenAI operational recommendation._

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
