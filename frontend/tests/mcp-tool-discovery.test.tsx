/** @vitest-environment jsdom */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { McpToolDiscoveryDebugger } from "../components/McpToolDiscoveryDebugger";
import { getGuideEditorialSignals } from "../lib/guide-editorial";
import { getGuide, getInternalLinkedGuides } from "../lib/guides";
import {
  diagnoseMcpDiscovery,
  mcpDiscoveryChecks,
  mcpDiscoveryCompatibilityMatrix,
  mcpDiscoveryCompatibilityUpdatedAt,
  mcpDiscoveryVerifiedAt,
  renderMcpDiscoveryCompatibilityCsv,
  renderMcpDiscoveryCompatibilityJson,
} from "../lib/mcp-tool-discovery";
import { buildGuideGraphJsonLd } from "../lib/seo";
import GuidePage, { loadMcpToolDiscoveryResources } from "../pages/guides/[slug]";

(globalThis as typeof globalThis & { React: typeof React }).React = React;

vi.mock("next/router", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

afterEach(() => cleanup());

describe("MCP tool discovery fault tree", () => {
  it("defines eight ordered checks with observable proof and fixes", () => {
    expect(mcpDiscoveryVerifiedAt).toBe("2026-09-08");
    expect(mcpDiscoveryChecks).toHaveLength(8);
    expect(mcpDiscoveryChecks.map((check) => check.id)).toEqual([
      "config-load",
      "process-transport",
      "stdout-framing",
      "initialize",
      "tools-list",
      "client-policy",
      "refresh",
      "selection",
    ]);
    expect(mcpDiscoveryChecks.every((check) => check.test && check.passCondition && check.fix)).toBe(true);
  });

  it("publishes a multi-client matrix with honest live-test status", () => {
    expect(mcpDiscoveryCompatibilityUpdatedAt).toBe("2026-09-15");
    expect(mcpDiscoveryCompatibilityMatrix.map((row) => row.id)).toEqual([
      "claude-code",
      "cursor",
      "github-copilot",
      "other",
    ]);
    for (const row of mcpDiscoveryCompatibilityMatrix) {
      expect(row.liveBehavior).toBe("not-measured");
      expect(row.testRequired).toBeTruthy();
      expect(row.toolsList).toBe("test-required");
      expect(row.clientPolicy).toBe("test-required");
    }
    expect(mcpDiscoveryCompatibilityMatrix.find((row) => row.id === "claude-code")?.documentedSurface).toMatch(/\/mcp/i);
    expect(mcpDiscoveryCompatibilityMatrix.find((row) => row.id === "github-copilot")?.documentedSurface).toMatch(/copilot mcp/i);
  });

  it("renders deterministic JSON and CSV compatibility resources", () => {
    const json = renderMcpDiscoveryCompatibilityJson();
    const csv = renderMcpDiscoveryCompatibilityCsv();

    expect(JSON.parse(json)).toMatchObject({
      updatedAt: mcpDiscoveryCompatibilityUpdatedAt,
      liveBehavior: "Not measured",
      rows: mcpDiscoveryCompatibilityMatrix,
    });
    expect(csv.split("\n")[0]).toBe(
      "id,client_name,documented_surface,config_scope,stdio,streamable_http,tools_list,client_policy,live_behavior,test_required,source_urls",
    );
    expect(csv).toContain("claude-code");
    expect(csv).toContain("not-measured");
    expect(csv.endsWith("\n")).toBe(true);
  });

  it("keeps public JSON and CSV resources synchronized with the matrix", () => {
    const resourcesDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../public/resources");
    expect(fs.readFileSync(path.join(resourcesDir, "mcp-tool-discovery-compatibility.json"), "utf8")).toBe(
      renderMcpDiscoveryCompatibilityJson(),
    );
    expect(fs.readFileSync(path.join(resourcesDir, "mcp-tool-discovery-compatibility.csv"), "utf8")).toBe(
      renderMcpDiscoveryCompatibilityCsv(),
    );
  });

  it("keeps discovery and selection diagnoses separate", () => {
    const discovery = diagnoseMcpDiscovery("connected-zero-tools", "claude-code", "stdio");
    const selection = diagnoseMcpDiscovery("tools-visible-not-called", "github-copilot", "http");

    expect(discovery.title).toMatch(/tools\/list/i);
    expect(discovery.clientNote).toMatch(/\/mcp/i);
    expect(discovery.transportNote).toMatch(/stdout/i);
    expect(selection.title).toMatch(/selection, not discovery/i);
    expect(selection.clientNote).toMatch(/tool filters/i);
    expect(selection.transportNote).toMatch(/authentication/i);
  });
});

describe("McpToolDiscoveryDebugger", () => {
  it("server-renders the interactive answer and full crawlable matrix", () => {
    const markup = renderToStaticMarkup(<McpToolDiscoveryDebugger />);

    expect(markup).toContain("MCP tool discovery debugger");
    expect(markup).toContain("Prove tools/list outside the client");
    expect(markup).toContain("8 checks from config to invocation");
    expect(markup).toContain('href="/resources/mcp-tool-discovery-debug-checklist.md"');
    expect(markup).toContain("MCP multi-client compatibility matrix");
    expect(markup).toContain('href="/resources/mcp-tool-discovery-compatibility.json"');
    expect(markup).toContain('href="/resources/mcp-tool-discovery-compatibility.csv"');
    expect(markup).toContain("Not measured");
    for (const check of mcpDiscoveryChecks) {
      expect(markup).toContain(check.layer);
    }
  });

  it("updates the recommended first move when the symptom changes", () => {
    render(<McpToolDiscoveryDebugger />);

    fireEvent.change(screen.getByLabelText("Symptom"), { target: { value: "tools-visible-not-called" } });
    expect(screen.getByRole("heading", { name: /treat this as selection, not discovery/i })).toBeTruthy();
  });
});

describe("MCP missing-tools guide integration", () => {
  it("publishes a distinct intent, watchlist, source set, and WebApplication schema", () => {
    const guide = getGuide("mcp-server-not-showing-tools");
    const editorial = getGuideEditorialSignals("mcp-server-not-showing-tools");

    expect(guide).toMatchObject({
      resourceIds: ["mcp-tool-discovery"],
      updatedAt: "2026-09-15",
      metaTitle: "MCP Server Connected but No Tools? 8 Checks for tools/list",
    });
    expect(guide!.sections[0].body[0]).toMatch(/tools\/list in MCP Inspector/i);
    expect(guide!.sections[0].body[0]).toMatch(/selection or permission problem, not a discovery problem/i);
    expect(editorial).toMatchObject({
      primaryKeyword: "MCP server not showing tools",
      priority: "P0",
    });
    expect(guide!.evidence.map((source) => source.publisher)).toEqual([
      "MCP",
      "MCP",
      "MCP",
      "Anthropic",
      "GitHub",
    ]);
    const schema = buildGuideGraphJsonLd(guide!, [], []);
    expect(JSON.stringify(schema)).toContain("MCP Tool Discovery Debugger");
    expect(getInternalLinkedGuides(guide!).map((item) => item.slug)).toEqual(
      expect.arrayContaining([
        "secure-mcp-servers-ai-coding-agents",
        "claude-code-hooks-mcp-setup",
        "agent-governance-checklist-for-software-teams",
        "loop-engineering-ai-coding-agents",
      ]),
    );
  });

  it("SSR-loads the debugger after the visible Quick Answer", async () => {
    const guide = getGuide("mcp-server-not-showing-tools")!;
    const Resource = await loadMcpToolDiscoveryResources();
    expect(renderToStaticMarkup(<Resource />)).toContain("MCP tool discovery debugger");

    render(<GuidePage guide={guide} relatedGuides={getInternalLinkedGuides(guide)} relatedArticles={[]} />);
    const quickAnswer = screen.getByRole("heading", { name: /^quick answer$/i });
    const debuggerHeading = await screen.findByRole("heading", { name: /mcp tool discovery debugger/i });
    expect(quickAnswer.compareDocumentPosition(debuggerHeading) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});
