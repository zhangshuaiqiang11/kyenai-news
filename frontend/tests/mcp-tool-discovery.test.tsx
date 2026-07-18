/** @vitest-environment jsdom */
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
  mcpDiscoveryVerifiedAt,
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
    expect(mcpDiscoveryVerifiedAt).toBe("2026-07-19");
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
      updatedAt: "2026-07-19",
      metaTitle: "MCP Server Not Showing Tools? 8 Checks That Fix It",
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
