/** @vitest-environment jsdom */
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { McpSecurityControls } from "../components/McpSecurityControls";
import { getGuideEditorialSignals } from "../lib/guide-editorial";
import { getGuide, getInternalLinkedGuides } from "../lib/guides";
import {
  mcpSecurityControls,
  mcpSecurityPermissionMatrix,
  mcpSecuritySources,
  mcpSecurityThreats,
  mcpSecurityVerifiedAt,
  renderMcpSecurityReviewMarkdown,
} from "../lib/mcp-security-resource";
import GuidePage, { loadMcpSecurityResources } from "../pages/guides/[slug]";

(globalThis as typeof globalThis & { React: typeof React }).React = React;

vi.mock("next/router", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

afterEach(() => {
  cleanup();
});

describe("MCP security resource records", () => {
  it("defines the exact threat model with current verification and official evidence", () => {
    expect(mcpSecurityVerifiedAt).toBe("2026-06-14");
    expect(mcpSecurityThreats.map((threat) => threat.id)).toEqual([
      "prompt-injection",
      "excessive-permissions-scope",
      "secret-token-exposure",
      "unsafe-writes-deletes",
      "network-reach-ssrf",
      "third-party-supply-chain-local-server-compromise",
    ]);
    expect(mcpSecurityThreats.every((threat) => threat.verifiedAt === mcpSecurityVerifiedAt)).toBe(true);

    expect(mcpSecuritySources.map((source) => source.url)).toEqual([
      "https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices",
      "https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization",
      "https://modelcontextprotocol.io/specification/draft/basic/authorization/security-considerations",
      "https://modelcontextprotocol.io/docs/tools/inspector",
    ]);
  });

  it("covers every required operational control without presenting it as an MCP mandate", () => {
    expect(mcpSecurityControls.map((control) => control.id)).toEqual([
      "authentication-authorization",
      "least-privilege",
      "secure-secret-token-storage-rotation",
      "read-write-separation",
      "human-approval-destructive-production",
      "attributable-audit-logs",
      "isolation-network-allowlists",
      "revocation-incident-response",
    ]);
    expect(mcpSecurityControls.every((control) => control.verifiedAt === mcpSecurityVerifiedAt)).toBe(true);

    const operationalControls = mcpSecurityControls.filter((control) => control.claimType === "kyenai-operational");
    expect(operationalControls.map((control) => control.id)).toEqual(
      expect.arrayContaining([
        "read-write-separation",
        "human-approval-destructive-production",
        "attributable-audit-logs",
        "isolation-network-allowlists",
        "revocation-incident-response",
      ]),
    );
    expect(operationalControls.map((control) => control.guidance).join(" ")).not.toMatch(
      /MCP (?:specification|spec) (?:requires|mandates).*(?:audit|approval)/i,
    );
  });

  it("defines separate permission rows with complete launch decisions", () => {
    expect(mcpSecurityPermissionMatrix.map((row) => row.id)).toEqual([
      "repository-read",
      "repository-write",
      "repository-delete",
      "outbound-network",
      "secret-access",
      "production-access",
    ]);
    expect(mcpSecurityPermissionMatrix).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "repository-read",
          capability: expect.stringMatching(/read repository files/i),
          default: expect.stringMatching(/allow|read-only/i),
          dataRisk: expect.any(String),
          approval: expect.any(String),
          logging: expect.any(String),
          launchGate: expect.any(String),
        }),
      ]),
    );
    for (const row of mcpSecurityPermissionMatrix) {
      expect(row.capability).toBeTruthy();
      expect(row.default).toBeTruthy();
      expect(row.dataRisk).toBeTruthy();
      expect(row.approval).toBeTruthy();
      expect(row.logging).toBeTruthy();
      expect(row.launchGate).toBeTruthy();
    }
  });

  it("labels official MCP claims separately from general operating controls", () => {
    const allRecords = [...mcpSecurityThreats, ...mcpSecurityControls];
    expect(new Set(allRecords.map((record) => record.claimType))).toEqual(
      new Set(["official-mcp", "kyenai-operational"]),
    );
    expect(
      mcpSecurityControls.find((control) => control.id === "authentication-authorization"),
    ).toMatchObject({
      claimType: "official-mcp",
      guidance: expect.stringMatching(/audience|token/i),
    });
    expect(
      mcpSecurityControls.find((control) => control.id === "human-approval-destructive-production"),
    ).toMatchObject({
      claimType: "kyenai-operational",
    });
  });
});

describe("McpSecurityControls", () => {
  it("server-renders an accessible review resource and download link", () => {
    const markup = renderToStaticMarkup(<McpSecurityControls />);

    expect(markup).toContain("MCP security threat model");
    expect(markup).toContain("MCP security control checklist");
    expect(markup).toContain("MCP permission matrix");
    expect(markup).toContain("Review cadence and revocation");
    expect(markup).toContain("<table");
    expect(markup).toContain("<dl");
    expect(markup).toContain("<ul");
    expect(markup).toContain('href="/resources/mcp-security-review.md"');
  });

  it("renders all threats, controls, and permission capabilities", () => {
    render(<McpSecurityControls />);

    for (const threat of mcpSecurityThreats) {
      expect(screen.getByRole("heading", { name: threat.title })).toBeTruthy();
    }
    for (const control of mcpSecurityControls) {
      expect(screen.getByText(control.title, { selector: "li > strong" })).toBeTruthy();
    }
    for (const row of mcpSecurityPermissionMatrix) {
      expect(screen.getByRole("rowheader", { name: row.capability })).toBeTruthy();
    }
    expect(
      screen.getByRole("link", { name: /download mcp security review/i }).getAttribute("href"),
    ).toBe("/resources/mcp-security-review.md");
  });
});

describe("MCP security guide integration", () => {
  it("updates the guide and private query watchlist without leaking internal SEO fields", () => {
    const guide = getGuide("secure-mcp-servers-ai-coding-agents");
    const editorial = getGuideEditorialSignals("secure-mcp-servers-ai-coding-agents");

    expect(guide).toMatchObject({
      resourceIds: ["mcp-security"],
      updatedAt: "2026-06-14",
    });
    expect(guide!.title).toMatch(/MCP security checklist/i);
    expect(guide!.metaTitle).toMatch(/MCP security checklist/i);
    expect(guide!.summary).toMatch(/MCP server security/i);
    expect(JSON.stringify(guide)).toMatch(/how to secure an MCP server/i);
    expect(JSON.stringify(guide)).toMatch(/MCP authentication/i);
    expect(JSON.stringify(guide)).toMatch(/MCP permissions/i);
    expect(JSON.stringify(guide)).toMatch(/AI agent tool security/i);
    expect(editorial).toMatchObject({
      primaryKeyword: "MCP security checklist",
      gscWatchQueries: [
        "mcp security",
        "mcp server security",
        "how to secure an mcp server",
        "mcp authentication",
        "mcp permissions",
        "ai agent tool security",
      ],
    });

    const serializedGuide = JSON.stringify(guide);
    for (const field of [
      "priority",
      "primaryKeyword",
      "demandScore",
      "attackabilityScore",
      "fitScore",
      "gscWatchQueries",
    ]) {
      expect(serializedGuide).not.toContain(`"${field}"`);
    }
  });

  it("SSR-loads MCP controls after Quick Answer only for the MCP guide", async () => {
    const guide = getGuide("secure-mcp-servers-ai-coding-agents");
    expect(guide).toBeDefined();

    const McpResources = await loadMcpSecurityResources();
    expect(renderToStaticMarkup(<McpResources />)).toContain("MCP security threat model");

    render(
      <GuidePage
        guide={guide!}
        relatedGuides={getInternalLinkedGuides(guide!)}
        relatedArticles={[]}
      />,
    );
    const quickAnswer = screen.getByRole("heading", { name: /^quick answer$/i });
    const threatModel = await screen.findByRole("heading", { name: /mcp security threat model/i });
    const firstArticleSection = screen.getByRole("heading", { name: /define the trust boundary/i });
    expect(quickAnswer.compareDocumentPosition(threatModel) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(threatModel.compareDocumentPosition(firstArticleSection) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();

    cleanup();

    const unrelatedGuide = getGuide("codex-vs-claude-code");
    render(
      <GuidePage
        guide={unrelatedGuide!}
        relatedGuides={getInternalLinkedGuides(unrelatedGuide!)}
        relatedArticles={[]}
      />,
    );
    expect(screen.queryByRole("heading", { name: /mcp security threat model/i })).toBeNull();
  });
});

describe("generated MCP security review", () => {
  it("renders all review fields and authoritative records", () => {
    const markdown = renderMcpSecurityReviewMarkdown();

    for (const field of [
      "Server owner",
      "Version / publisher",
      "Data classes",
      "Methods / capabilities",
      "Credentials / authentication",
      "Network reach",
      "Approval gates",
      "Logging",
      "Dependency / supply-chain review",
      "Revocation / incident response",
      "Reviewer",
      "Review date",
      "Sign-off",
    ]) {
      expect(markdown).toContain(field);
    }
    for (const threat of mcpSecurityThreats) {
      expect(markdown).toContain(threat.title);
    }
    for (const row of mcpSecurityPermissionMatrix) {
      expect(markdown).toContain(row.capability);
    }
    for (const source of mcpSecuritySources) {
      expect(markdown).toContain(source.url);
    }
    expect(markdown).toContain("KyenAI operational recommendation");
    expect(markdown).toContain("Official MCP requirement or guidance");
  });

  it("keeps adversarial permission values inside a six-column table row", () => {
    const row = {
      ...mcpSecurityPermissionMatrix[0],
      capability: "Read | inspect\r\nrepository",
      default: "Allow\\read-only",
      dataRisk: "Secrets `or` pipes | exposed",
      approval: "Owner\napproval",
      logging: "Log path C:\\repo\\file",
      launchGate: "No wildcard | root\rdelete",
    };
    const before = structuredClone(row);
    const markdown = renderMcpSecurityReviewMarkdown([row]);
    const renderedRow = markdown
      .split("\n")
      .find((line) => line.includes("Read \\| inspect<br>repository"));

    expect(renderedRow).toBeDefined();
    expect(renderedRow!.match(/(?<!\\)\|/g)).toHaveLength(7);
    expect(renderedRow).toContain("Allow\\\\read-only");
    expect(renderedRow).toContain("Secrets `or` pipes \\| exposed");
    expect(renderedRow).toContain("Owner<br>approval");
    expect(renderedRow).toContain("Log path C:\\\\repo\\\\file");
    expect(renderedRow).toContain("No wildcard \\| root<br>delete");
    expect(row).toEqual(before);
  });
});
