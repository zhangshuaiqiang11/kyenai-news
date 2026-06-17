import { describe, expect, it } from "vitest";

import { resolveGuideTopicHref, resolveIndexableGuideTopicHref } from "../lib/guide-topic-links";

describe("guide topic links", () => {
  it("links related topics to matching indexable guides when available", () => {
    expect(resolveIndexableGuideTopicHref("AI coding agent instruction files", "codex-vs-claude-code")).toBe(
      "/guides/agents-md-vs-claude-md-cursorrules-copilot-instructions",
    );
    expect(resolveIndexableGuideTopicHref("MCP server security")).toBe(
      "/guides/secure-mcp-servers-ai-coding-agents",
    );
    expect(resolveIndexableGuideTopicHref("Gemini CLI migration")).toBe(
      "/guides/antigravity-cli-gemini-cli-migration",
    );
  });

  it("does not create thin tag or category links for unmatched topics", () => {
    expect(resolveIndexableGuideTopicHref("VS Code agent mode", "agent-mode-vs-chat-mode-in-ide")).toBeNull();
    expect(resolveGuideTopicHref("VS Code agent mode", "agent-mode-vs-chat-mode-in-ide")).toBe("/guides");
    expect(resolveGuideTopicHref("VS Code agent mode", "agent-mode-vs-chat-mode-in-ide")).not.toContain("/tags/");
  });

  it("links loop engineering topics to the loop guide", () => {
    expect(resolveIndexableGuideTopicHref("loop engineering", "agent-governance-checklist-for-software-teams")).toBe(
      "/guides/loop-engineering-ai-coding-agents",
    );
    expect(resolveIndexableGuideTopicHref("plan-execute-verify agent loop", "claude-code-subagents-examples")).toBe(
      "/guides/loop-engineering-ai-coding-agents",
    );
    expect(resolveIndexableGuideTopicHref("cursor loop automation", "claude-code-hooks-mcp-setup")).toBe(
      "/guides/loop-engineering-ai-coding-agents",
    );
  });

  it("routes P2 AGENTS.md support topics to the narrow support pages", () => {
    expect(resolveIndexableGuideTopicHref("github copilot claude.md support")).toBe(
      "/guides/does-github-copilot-read-claude-md-support-matrix",
    );
    expect(resolveIndexableGuideTopicHref("does github copilot read claude.md")).toBe(
      "/guides/does-github-copilot-read-claude-md-support-matrix",
    );
    expect(resolveIndexableGuideTopicHref("agents.md examples")).toBe(
      "/guides/agents-md-examples-codex-node-python-monorepos",
    );
    expect(resolveIndexableGuideTopicHref("agents.md python example")).toBe(
      "/guides/agents-md-examples-codex-node-python-monorepos",
    );
  });

  it("does not link P2 support topics back to their current guide", () => {
    expect(
      resolveIndexableGuideTopicHref(
        "github copilot claude.md support",
        "does-github-copilot-read-claude-md-support-matrix",
      ),
    ).toBeNull();
    expect(
      resolveIndexableGuideTopicHref(
        "agents.md examples",
        "agents-md-examples-codex-node-python-monorepos",
      ),
    ).toBeNull();
  });

  it("does not link a topic back to the current guide", () => {
    expect(resolveIndexableGuideTopicHref("Codex alternatives", "codex-vs-claude-code")).toBeNull();
    expect(resolveIndexableGuideTopicHref("Codex alternatives", "some-other-guide")).toBe(
      "/guides/codex-vs-claude-code",
    );
  });
});
