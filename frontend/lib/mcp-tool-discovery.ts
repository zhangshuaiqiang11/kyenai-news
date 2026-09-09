export type McpDiscoveryClient = "claude-code" | "cursor" | "github-copilot" | "other";
export type McpDiscoveryTransport = "stdio" | "http";
export type McpDiscoverySymptom =
  | "server-missing"
  | "connected-zero-tools"
  | "tools-listed-not-visible"
  | "tools-visible-not-called"
  | "tools-stale";

export type McpDiscoveryCheck = {
  id: string;
  layer: string;
  symptom: string;
  test: string;
  passCondition: string;
  fix: string;
};

export type McpDiscoveryDiagnosis = {
  title: string;
  firstCheck: string;
  proof: string;
  nextFix: string;
  clientNote: string;
  transportNote: string;
};

export const mcpDiscoveryVerifiedAt = "2026-09-08";

export const mcpDiscoveryChecks: McpDiscoveryCheck[] = [
  {
    id: "config-load",
    layer: "1. Client configuration",
    symptom: "The server is absent from the client's MCP status view.",
    test: "Validate the configuration syntax, scope, server name, command or URL, and whether the client loaded that configuration source.",
    passCondition: "The named server appears in the client status view, even if it is still connecting or failed.",
    fix: "Correct the active config file or scope, avoid reserved or duplicate names, approve project config when required, then reload the client.",
  },
  {
    id: "process-transport",
    layer: "2. Process or transport",
    symptom: "The server is configured but never connects.",
    test: "Run the exact stdio command outside the client, or inspect the HTTP response, authentication status, session headers, and server logs.",
    passCondition: "The process stays alive or the endpoint accepts an MCP connection without an immediate transport error.",
    fix: "Use absolute executable and file paths, provide required environment variables, repair permissions, or correct the HTTP URL and authentication.",
  },
  {
    id: "stdout-framing",
    layer: "3. Stdio framing",
    symptom: "The local process starts but the client reports JSON-RPC parse errors or disconnects.",
    test: "Check that protocol messages are the only content written to stdout; send diagnostics to stderr.",
    passCondition: "The client receives complete JSON-RPC messages without banners, debug text, or other stdout noise.",
    fix: "Move logs from stdout to stderr and remove startup banners or wrappers that alter protocol framing.",
  },
  {
    id: "initialize",
    layer: "4. Initialization handshake",
    symptom: "The transport opens, but capabilities never become available.",
    test: "Inspect the initialize response, negotiated protocol version, declared server capabilities, and the initialized notification.",
    passCondition: "Initialization completes and the server declares the tools capability when it intends to expose tools.",
    fix: "Update the MCP SDK or server implementation so initialize and notifications/initialized complete with compatible capabilities.",
  },
  {
    id: "tools-list",
    layer: "5. Tool discovery",
    symptom: "The client says connected but shows zero tools.",
    test: "Open the server in MCP Inspector and inspect the Tools tab, which exercises tool discovery independently of the target client.",
    passCondition: "The response contains the expected tool names, descriptions, and valid input schemas.",
    fix: "Register the missing tools, implement tools/list, repair invalid schemas, or remove server-side filtering that returns an empty list.",
  },
  {
    id: "client-policy",
    layer: "6. Client policy and filters",
    symptom: "Inspector lists tools, but the target client does not expose them.",
    test: "Check the client's enabled-tool list, allowlist or denylist, custom-agent tool policy, server scope, and authentication state.",
    passCondition: "The expected tool is enabled for the current client, workspace, agent, and session.",
    fix: "Enable the named tool or server in the correct scope, complete authentication, and remove a conflicting deny rule without widening unrelated access.",
  },
  {
    id: "refresh",
    layer: "7. Refresh and list changes",
    symptom: "New or renamed tools do not appear after a server change.",
    test: "Reconnect or reload the server and check whether the server advertises listChanged and emits the list_changed notification.",
    passCondition: "A fresh tools/list response includes the changed tool set and the client refreshes its view.",
    fix: "Emit the list-change notification for dynamic updates, or explicitly reconnect/reload after rebuilding a server that does not emit it.",
  },
  {
    id: "selection",
    layer: "8. Tool selection",
    symptom: "The tool is visible but the model never calls it.",
    test: "Use an explicit request that clearly needs the tool, then review the tool name, description, input schema, permissions, and any on-demand tool-search behavior.",
    passCondition: "The client can select and invoke the tool with valid arguments when the request clearly matches its purpose.",
    fix: "Clarify the tool name and description, fix required schema fields, approve invocation, or load the deferred tool; do not misdiagnose selection as discovery failure.",
  },
];

const clientNotes: Record<McpDiscoveryClient, string> = {
  "claude-code":
    "In Claude Code, use /mcp to inspect status and tool count. A connected server with zero tools is different from Tool Search deferring schemas until needed.",
  cursor:
    "In Cursor, confirm the server and tool state in the MCP settings and logs available in your installed version. Interface labels can change, so use Inspector as the client-independent proof.",
  "github-copilot":
    "In GitHub Copilot CLI, use /mcp or copilot mcp get <name>; also check tool filters because an empty or restricted tool list can hide a working server's tools.",
  other:
    "Use the client's connection status, logs, enabled-tool policy, and refresh controls, then compare them with the client-independent Inspector result.",
};

const transportNotes: Record<McpDiscoveryTransport, string> = {
  stdio:
    "For stdio, reproduce the exact command with the same arguments and environment. Use absolute paths and keep every diagnostic message off stdout.",
  http:
    "For Streamable HTTP, verify URL, authentication, response status, session headers, and server logs. Stderr from a remote server is not normally captured by the client.",
};

const symptomDiagnosis: Record<McpDiscoverySymptom, Omit<McpDiscoveryDiagnosis, "clientNote" | "transportNote">> = {
  "server-missing": {
    title: "Start at configuration loading",
    firstCheck: mcpDiscoveryChecks[0].test,
    proof: mcpDiscoveryChecks[0].passCondition,
    nextFix: mcpDiscoveryChecks[0].fix,
  },
  "connected-zero-tools": {
    title: "Prove tools/list outside the client",
    firstCheck: mcpDiscoveryChecks[4].test,
    proof: mcpDiscoveryChecks[4].passCondition,
    nextFix: `${mcpDiscoveryChecks[4].fix} If Inspector passes, continue to client policy and filters.`,
  },
  "tools-listed-not-visible": {
    title: "Inspect client policy, scope, and filters",
    firstCheck: mcpDiscoveryChecks[5].test,
    proof: mcpDiscoveryChecks[5].passCondition,
    nextFix: mcpDiscoveryChecks[5].fix,
  },
  "tools-visible-not-called": {
    title: "Treat this as selection, not discovery",
    firstCheck: mcpDiscoveryChecks[7].test,
    proof: mcpDiscoveryChecks[7].passCondition,
    nextFix: mcpDiscoveryChecks[7].fix,
  },
  "tools-stale": {
    title: "Refresh the discovered tool list",
    firstCheck: mcpDiscoveryChecks[6].test,
    proof: mcpDiscoveryChecks[6].passCondition,
    nextFix: mcpDiscoveryChecks[6].fix,
  },
};

export function diagnoseMcpDiscovery(
  symptom: McpDiscoverySymptom,
  client: McpDiscoveryClient,
  transport: McpDiscoveryTransport,
): McpDiscoveryDiagnosis {
  return {
    ...symptomDiagnosis[symptom],
    clientNote: clientNotes[client],
    transportNote: transportNotes[transport],
  };
}
