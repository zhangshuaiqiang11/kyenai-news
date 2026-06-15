/** @vitest-environment jsdom */
import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { AgentsMdTemplateResource } from "../components/AgentsMdTemplateResource";
import { ClaudeCodeSetupResources } from "../components/ClaudeCodeSetupResources";
import { claudeCodeSetupExamples } from "../lib/claude-code-setup-resources";
import { instructionTemplates } from "../lib/instruction-resources";
import { mcpSecurityReviewPreview } from "../lib/mcp-security-resource";

(globalThis as typeof globalThis & { React: typeof React }).React = React;

afterEach(cleanup);

describe("guide code example resources", () => {
  it("renders full AGENTS.md template previews for the template guide", () => {
    render(<AgentsMdTemplateResource />);

    const rootTemplate = instructionTemplates.find((template) => template.id === "agents-md-template");
    expect(rootTemplate).toBeDefined();

    expect(screen.getByRole("heading", { name: /agents\.md template previews/i })).toBeTruthy();
    expect(screen.getByRole("heading", { name: rootTemplate!.title })).toBeTruthy();
    expect(screen.getByRole("heading", { name: /nested agents\.md for monorepo packages/i })).toBeTruthy();
    expect(document.body.textContent).toContain("## Verification");
    expect(document.body.textContent).toContain("apps/web/");
  });

  it("renders complete Claude Code setup examples", () => {
    render(<ClaudeCodeSetupResources />);

    expect(screen.getByRole("heading", { name: /claude code setup examples/i })).toBeTruthy();
    for (const example of claudeCodeSetupExamples) {
      expect(screen.getByRole("heading", { name: example.title })).toBeTruthy();
      expect(document.body.textContent).toContain(example.body.trim().split("\n")[0]);
    }
    expect(document.body.textContent).toContain('"hooks"');
    expect(document.body.textContent).toContain('"mcpServers"');
    expect(document.body.textContent).toContain("Release checklist");
  });

  it("keeps the MCP security review preview structurally complete", () => {
    expect(mcpSecurityReviewPreview).toContain("## Server profile");
    expect(mcpSecurityReviewPreview).toContain("## Threat model");
    expect(mcpSecurityReviewPreview).toContain("## Permission matrix");
    expect(mcpSecurityReviewPreview).toContain("## Sign-off");
    expect(mcpSecurityReviewPreview.length).toBeGreaterThan(1200);
  });
});
