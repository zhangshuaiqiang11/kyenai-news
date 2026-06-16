import { describe, expect, it } from "vitest";

import { resolveGuideTopicHref } from "../lib/guide-topic-links";

describe("guide topic links", () => {
  it("links related topics to matching guides when available", () => {
    expect(resolveGuideTopicHref("Codex alternatives", "codex-vs-claude-code")).toBe("/tags/codex-alternatives");
    expect(resolveGuideTopicHref("AI coding agent instruction files", "codex-vs-claude-code")).toBe(
      "/guides/agents-md-vs-claude-md-cursorrules-copilot-instructions",
    );
  });

  it("falls back to tag pages for unmatched topics", () => {
    expect(resolveGuideTopicHref("VS Code agent mode", "agent-mode-vs-chat-mode-in-ide")).toBe("/tags/vs-code-agent-mode");
  });

  it("does not link a guide topic back to the current guide slug", () => {
    expect(resolveGuideTopicHref("Codex alternatives", "some-other-guide")).toBe("/guides/codex-vs-claude-code");
  });
});
