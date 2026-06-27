import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { dirname } from "node:path";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { getVisibleGuideFaqs } from "../lib/guide-faqs";
import { getGuide } from "../lib/guides";
import { buildLlmsTxt } from "../lib/llms";

const testDirectory = dirname(fileURLToPath(import.meta.url));

describe("guide FAQ overrides", () => {
  it("uses search-intent FAQs for high-impression guides", () => {
    const loopGuide = getGuide("loop-engineering-ai-coding-agents");
    const instructionGuide = getGuide("agents-md-vs-claude-md-cursorrules-copilot-instructions");

    expect(loopGuide).toBeDefined();
    expect(instructionGuide).toBeDefined();

    const loopFaqs = getVisibleGuideFaqs(loopGuide!);
    const instructionFaqs = getVisibleGuideFaqs(instructionGuide!);

    expect(loopFaqs[0].question).toMatch(/loop engineering/i);
    expect(loopFaqs.some((faq) => faq.question.includes("workflow checklist"))).toBe(true);
    expect(instructionFaqs[0].question).toMatch(/CLAUDE\.md, Copilot Instructions, or AGENTS\.md/i);
    expect(instructionFaqs.some((faq) => faq.question.includes("Copilot read CLAUDE.md"))).toBe(true);
  });
});

describe("llms.txt", () => {
  it("lists featured guides and citation guidance for AI crawlers", () => {
    const body = buildLlmsTxt();

    expect(body).toContain("# KyenAI");
    expect(body).toContain("https://www.kyenai.com/guides/loop-engineering-ai-coding-agents");
    expect(body).toContain("https://www.kyenai.com/guides/agents-md-vs-claude-md-cursorrules-copilot-instructions");
    expect(body).toContain("[Codex vs Claude Code](https://www.kyenai.com/guides/codex-vs-claude-code):");
    expect(body).toContain("Citation guidance");
    expect(body).not.toContain("gscBaseline");
  });

  it("ships a static public llms.txt fallback for production crawlers", () => {
    const publicBody = readFileSync(resolve(testDirectory, "../public/llms.txt"), "utf8");

    expect(publicBody).toContain("# KyenAI");
    expect(publicBody).toContain("## All guides");
    expect(publicBody).toContain("[What Is Loop Engineering for AI Coding Agents?");
    expect(publicBody).toContain("[Codex vs Claude Code](https://www.kyenai.com/guides/codex-vs-claude-code):");
    expect(publicBody).toContain("Citation guidance");
    expect(publicBody).not.toContain("<!DOCTYPE html>");
  });
});
