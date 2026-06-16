import { describe, expect, it } from "vitest";

import { getGuideEditorialSignals, getPriorityGuides } from "../lib/guide-editorial";
import { getGuide, getGuides, getInternalLinkedGuides } from "../lib/guides";
import { buildGuideFaqs, buildGuideItemListJsonLd, buildGuideJsonLd } from "../lib/seo";

describe("guide SEO data", () => {
  it("keeps every guide meta title within 25 to 65 characters", () => {
    for (const guide of getGuides()) {
      expect.soft(guide.metaTitle.length, guide.slug).toBeGreaterThanOrEqual(25);
      expect.soft(guide.metaTitle.length, guide.slug).toBeLessThanOrEqual(65);
    }
  });

  it("keeps every guide meta description within 90 to 160 characters", () => {
    for (const guide of getGuides()) {
      expect.soft(guide.metaDescription.length, guide.slug).toBeGreaterThanOrEqual(90);
      expect.soft(guide.metaDescription.length, guide.slug).toBeLessThanOrEqual(160);
    }
  });

  it("keeps guide meta descriptions free of unsupported superlative claims", () => {
    for (const guide of getGuides()) {
      expect.soft(guide.metaDescription, guide.slug).not.toMatch(/best|ultimate|guarantee|revolutionary/i);
    }
  });

  it("keeps guide meta titles and descriptions unique", () => {
    const guides = getGuides();
    const metaTitles = guides.map((guide) => guide.metaTitle);
    const metaDescriptions = guides.map((guide) => guide.metaDescription);

    expect(new Set(metaTitles).size).toBe(metaTitles.length);
    expect(new Set(metaDescriptions).size).toBe(metaDescriptions.length);
  });

  it("keeps guide metadata trimmed, single-line, and free of duplicate branding", () => {
    for (const guide of getGuides()) {
      for (const metadata of [guide.metaTitle, guide.metaDescription]) {
        expect.soft(metadata, `${guide.slug}: trimmed`).toBe(metadata.trim());
        expect.soft(metadata, `${guide.slug}: single-line`).not.toMatch(/[\r\n]/);
        expect.soft(metadata, `${guide.slug}: spacing`).not.toContain("  ");
        expect.soft(metadata, `${guide.slug}: branding`).not.toContain("| KyenAI");
      }
    }
  });

  it("ships the validated first cohort of demand-led guides", () => {
    const guides = getGuides();
    const slugs = guides.map((guide) => guide.slug);

    expect(guides).toHaveLength(11);
    expect(slugs).toContain("agents-md-vs-claude-md-cursorrules-copilot-instructions");
    expect(slugs).toContain("claude-code-subagents-examples");
    expect(slugs).toContain("claude-code-hooks-mcp-setup");
    expect(slugs).toContain("secure-mcp-servers-ai-coding-agents");
    expect(slugs).toContain("antigravity-cli-gemini-cli-migration");
    expect(slugs).toContain("codex-vs-claude-code");
    expect(slugs).toContain("agents-md-template-for-ai-coding-agents");
    expect(slugs).toContain("agent-mode-vs-chat-mode-in-ide");
    expect(slugs).toContain("local-vs-cloud-ai-coding-agent");
    expect(slugs).toContain("agent-governance-checklist-for-software-teams");
    expect(slugs).toContain("loop-engineering-ai-coding-agents");
    expect(guides.every((guide) => guide.evidence.length >= 2)).toBe(true);
    expect(guides.every((guide) => guide.checklist.length >= 5)).toBe(true);
  });

  it("keeps guide keywords and slugs unique to avoid search intent cannibalization", () => {
    const guides = getGuides();
    const slugs = guides.map((guide) => guide.slug);
    const primaryKeywords = guides.map(
      (guide) => (getGuideEditorialSignals(guide.slug)?.primaryKeyword || "").trim().toLowerCase()
    );

    expect(new Set(slugs).size).toBe(slugs.length);
    expect(primaryKeywords).toHaveLength(11);
    expect(primaryKeywords.every(Boolean)).toBe(true);
    expect(new Set(primaryKeywords).size).toBe(primaryKeywords.length);
  });

  it("opens every guide with a plain quick answer for snippet-friendly reading", () => {
    for (const guide of getGuides()) {
      expect(guide.sections[0].heading).toBe("Quick answer");
      expect(guide.sections[0].body[0].length).toBeGreaterThan(80);
      expect(guide.sections[0].body[0]).not.toMatch(/in today's fast-paced|unlock|revolutionize|game-changer/i);
    }
  });

  it("publishes the instruction-file guide from current official evidence without global Copilot claims", () => {
    const guide = getGuide("agents-md-vs-claude-md-cursorrules-copilot-instructions");

    expect(guide).toBeDefined();
    expect(guide).toMatchObject({
      slug: "agents-md-vs-claude-md-cursorrules-copilot-instructions",
      updatedAt: "2026-06-14",
      resourceIds: ["instruction-files"],
    });
    expect(guide!.metaTitle.length).toBeGreaterThanOrEqual(25);
    expect(guide!.metaTitle.length).toBeLessThanOrEqual(65);
    expect(guide!.metaDescription.length).toBeGreaterThanOrEqual(90);
    expect(guide!.metaDescription.length).toBeLessThanOrEqual(160);

    const quickAnswer = guide!.sections[0].body[0];
    expect(quickAnswer).toMatch(/Copilot support for CLAUDE\.md depends on the Copilot surface/i);
    expect(quickAnswer).toMatch(/selected cloud-agent surfaces support it/i);
    expect(quickAnswer).toMatch(/many Copilot Chat, code-review, and CLI surfaces do not/i);
    expect(quickAnswer).toContain(".github/copilot-instructions.md");
    expect(quickAnswer).not.toMatch(/Copilot (always|never) (reads|supports) CLAUDE\.md/i);

    const guideCopy = JSON.stringify(guide);
    expect(guideCopy).toContain(".cursor/rules/*.mdc");
    expect(guideCopy).toMatch(/status is unknown in the cited current documentation/i);
    expect(guideCopy).toMatch(/same task/i);
    expect(guideCopy).toMatch(/same repository/i);
    expect(guideCopy).toMatch(/measured success/i);
    expect(guideCopy).toMatch(/elapsed time/i);
    expect(guideCopy).toMatch(/human interventions/i);
    expect(guideCopy).not.toMatch(/\.cursorrules (is|was|has been) (officially )?deprecated/i);

    expect(guide!.evidence.map((source) => source.url)).toEqual([
      "https://developers.openai.com/codex/guides/agents-md",
      "https://docs.anthropic.com/en/docs/claude-code/memory",
      "https://docs.github.com/en/copilot/reference/custom-instructions-support",
      "https://docs.github.com/copilot/customizing-copilot/adding-custom-instructions-for-github-copilot",
      "https://cursor.com/docs/rules",
    ]);

    const internalSlugs = guide!.internalLinks.map((link) => link.slug);
    expect(internalSlugs).toEqual(
      expect.arrayContaining([
        "agents-md-template-for-ai-coding-agents",
        "codex-vs-claude-code",
        "claude-code-hooks-mcp-setup",
        "secure-mcp-servers-ai-coding-agents",
      ]),
    );
    expect(new Set(internalSlugs).size).toBe(internalSlugs.length);

    const unrelatedGuides = getGuides().filter((candidate) => candidate.slug !== guide!.slug);
    expect(unrelatedGuides.every((candidate) => !candidate.resourceIds?.includes("instruction-files"))).toBe(true);
  });

  it("keeps every guide deep enough for the content enhancement SOP", () => {
    const guideSlugs = new Set(getGuides().map((guide) => guide.slug));

    for (const guide of getGuides()) {
      expect(guide.recommendedPlay.length).toBeGreaterThanOrEqual(3);
      expect(guide.actionSteps.length).toBeGreaterThanOrEqual(4);
      expect(guide.pitfalls.length).toBeGreaterThanOrEqual(3);
      expect(guide.internalLinks.length).toBeGreaterThanOrEqual(2);
      expect(guide.decisionTable.rows.length).toBeGreaterThanOrEqual(4);
      expect(guide.decisionTable.rows.every((row) => row.values.length === guide.decisionTable.columns.length)).toBe(
        true
      );
      expect(guide.internalLinks.every((link) => guideSlugs.has(link.slug))).toBe(true);

      const editorialSignals = getGuideEditorialSignals(guide.slug);
      expect(editorialSignals).toBeDefined();
      expect(editorialSignals!.gscWatchQueries.length).toBeGreaterThanOrEqual(4);
    }
  });

  it("resolves guide-to-guide internal links for next-step reading paths", () => {
    const guide = getGuide("claude-code-hooks-mcp-setup");

    expect(guide).toBeDefined();
    expect(guide!.resourceIds).toEqual(["claude-code-setup"]);
    const relatedGuides = getInternalLinkedGuides(guide!);
    const relatedSlugs = relatedGuides.map((relatedGuide) => relatedGuide.slug);

    expect(relatedSlugs).toContain("secure-mcp-servers-ai-coding-agents");
    expect(relatedSlugs).toContain("claude-code-subagents-examples");
  });

  it("attaches template preview resources to the AGENTS.md template guide", () => {
    const guide = getGuide("agents-md-template-for-ai-coding-agents");

    expect(guide).toBeDefined();
    expect(guide!.resourceIds).toEqual(["agents-md-template"]);
  });

  it("attaches loop pattern resources to the loop engineering guide", () => {
    const guide = getGuide("loop-engineering-ai-coding-agents");

    expect(guide).toBeDefined();
    expect(guide!.resourceIds).toEqual(["loop-engineering"]);
    expect(guide!.updatedAt).toBe("2026-06-15");

    const quickAnswer = guide!.sections[0].body[0];
    expect(quickAnswer).toMatch(/act → observe → reason/i);
    expect(quickAnswer).toMatch(/stop rule/i);
    expect(quickAnswer).not.toMatch(/in today's fast-paced|unlock|revolutionize|game-changer/i);

    const unrelatedGuides = getGuides().filter((candidate) => candidate.slug !== guide!.slug);
    expect(unrelatedGuides.every((candidate) => !candidate.resourceIds?.includes("loop-engineering"))).toBe(true);

    const internalSlugs = guide!.internalLinks.map((link) => link.slug);
    expect(internalSlugs).toEqual(
      expect.arrayContaining([
        "agents-md-vs-claude-md-cursorrules-copilot-instructions",
        "codex-vs-claude-code",
        "secure-mcp-servers-ai-coding-agents",
        "claude-code-subagents-examples",
        "agent-governance-checklist-for-software-teams",
      ]),
    );
    expect(new Set(internalSlugs).size).toBe(internalSlugs.length);

    const inboundSlugs = getGuides()
      .filter((candidate) => candidate.slug !== guide!.slug)
      .filter((candidate) => candidate.internalLinks.some((link) => link.slug === guide!.slug))
      .map((candidate) => candidate.slug);
    expect(inboundSlugs).toEqual(
      expect.arrayContaining([
        "agents-md-vs-claude-md-cursorrules-copilot-instructions",
        "codex-vs-claude-code",
        "claude-code-subagents-examples",
        "claude-code-hooks-mcp-setup",
        "secure-mcp-servers-ai-coding-agents",
        "agent-governance-checklist-for-software-teams",
      ]),
    );
  });

  it("keeps private editorial signals available by guide slug", () => {
    const signals = getGuideEditorialSignals("codex-vs-claude-code");

    expect(signals).toEqual({
      priority: "P0",
      primaryKeyword: "Codex vs Claude Code",
      demandScore: 9,
      attackabilityScore: 8,
      fitScore: 9.4,
      gscWatchQueries: [
        "codex vs claude code",
        "openai codex vs claude code",
        "codex alternatives",
        "claude code alternatives",
      ],
    });
  });

  it("preserves editorial ranking while returning public guide objects", () => {
    const priorityGuides = getPriorityGuides();

    expect(priorityGuides.map((guide) => guide.slug)).toEqual([
      "agents-md-template-for-ai-coding-agents",
      "loop-engineering-ai-coding-agents",
      "agents-md-vs-claude-md-cursorrules-copilot-instructions",
      "codex-vs-claude-code",
      "local-vs-cloud-ai-coding-agent",
    ]);
    expect(JSON.stringify(priorityGuides)).not.toContain('"demandScore"');
  });

  it("builds crawlable TechArticle JSON-LD and FAQ content from visible guide facts", () => {
    const guide = getGuide("agents-md-vs-claude-md-cursorrules-copilot-instructions");

    expect(guide).toBeDefined();
    const jsonLd = buildGuideJsonLd(guide!);
    const faqs = buildGuideFaqs(guide!);
    const listJsonLd = buildGuideItemListJsonLd([guide!], "AI coding agent guides", "/guides");

    expect(jsonLd["@type"]).toBe("TechArticle");
    expect(jsonLd.headline).toBe(guide!.title);
    expect(jsonLd.url).toBe(`https://www.kyenai.com/guides/${guide!.slug}`);
    expect(jsonLd.citation).toEqual(expect.arrayContaining(guide!.evidence.map((source) => source.url)));
    expect(faqs.map((faq) => faq.question)).toEqual([
      "What should you do first?",
      "Who is this guide for?",
      "What evidence supports this guide?",
    ]);
    expect(faqs[0].answer).toBe(guide!.recommendedPlay[0]);
    expect(faqs[1].answer).toBe(guide!.audience);
    expect(faqs[2].answer).toContain("listed source material");
    expect(faqs[2].answer).toContain(
      Array.from(new Set(guide!.evidence.map((source) => source.publisher))).join(", "),
    );
    expect(faqs[2].answer).toContain("Source links and scope notes are available on this page.");
    expect(listJsonLd.itemListElement[0].url).toBe(`https://www.kyenai.com/guides/${guide!.slug}`);
  });

  it("deduplicates guide publishers in first-seen order", () => {
    const guide = getGuide("claude-code-subagents-examples");

    expect(guide).toBeDefined();
    const firstSource = guide!.evidence[0];
    const secondSource = {
      ...firstSource,
      title: "Second publisher source",
      publisher: "Second Publisher",
    };

    const faqs = buildGuideFaqs({
      ...guide!,
      evidence: [firstSource, { ...firstSource, title: "Duplicate publisher source" }, secondSource],
    });

    expect(faqs[2].answer).toBe(
      `This guide uses listed source material from ${firstSource.publisher}, ${secondSource.publisher}. Source links and scope notes are available on this page.`
    );
  });

  it("falls back safely when a guide has no recommended play or evidence", () => {
    const guide = getGuide("codex-vs-claude-code");

    expect(guide).toBeDefined();
    const faqs = buildGuideFaqs({
      ...guide!,
      recommendedPlay: [],
      evidence: [],
    });

    expect(faqs[0].answer).toBe(guide!.summary);
    expect(faqs[0].answer).not.toBe("");
    expect(faqs[2].answer).toBe("This guide does not currently list supporting source records.");
    expect(faqs[2].answer).not.toContain("from .");
  });
});
