# MCP tool discovery debug worksheet

Verified: 2026-07-19

Use this worksheet when an MCP server is configured but its tools are missing, stale, or never called. Redact credentials, tokens, private URLs, and sensitive payloads before sharing the result.

## Reproduction profile

- Client and version:
- MCP server and version:
- Transport: stdio / Streamable HTTP
- Operating system:
- Active configuration scope and file:
- Exact symptom:
- Expected tool names:
- First observed date:

## Eight checks

1. Client configuration
   - Does the named server appear in the client's MCP status view?
   - Record the config scope, server name, command or URL, and load result.

2. Process or transport
   - For stdio, run the exact command with the same arguments and environment.
   - For HTTP, record the response status, authentication state, session headers, and server log result.

3. Stdio framing
   - Confirm protocol messages are the only stdout content.
   - Confirm diagnostics go to stderr.

4. Initialization handshake
   - Record the negotiated protocol version.
   - Confirm the server declares the tools capability and completes initialization.

5. Tool discovery
   - Open the server in MCP Inspector.
   - Record the tools shown in the Tools tab and any invalid schema or protocol error.

6. Client policy and filters
   - Record enabled tools, allowlists, denylists, authentication, custom-agent tool policy, and current workspace scope.

7. Refresh and list changes
   - Reconnect or reload the server.
   - Record whether a fresh tools/list response contains the expected tools.
   - If the server updates tools dynamically, verify listChanged and the list_changed notification.

8. Tool selection
   - Use an explicit request that clearly requires one expected tool.
   - Record whether the tool was loaded, approved, selected, and called with valid arguments.

## Evidence to attach

- Sanitized client status output
- Sanitized client and server logs
- MCP Inspector Tools tab result
- initialize result and protocol version
- tools/list result
- Active tool filter or policy
- Exact reproduction steps
- Expected result and actual result

Sources: Model Context Protocol Inspector and debugging documentation, MCP tools specification, Claude Code MCP documentation, and GitHub Copilot MCP debugging documentation.
