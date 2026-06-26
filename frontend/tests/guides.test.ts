import { describe, expect, it } from "vitest";

import { getGuideEditorialSignals, getPriorityGuides } from "../lib/guide-editorial";
import { getGuide, getGuides, getInternalLinkedGuides } from "../lib/guides";
import { buildGuideFaqs, buildGuideItemListJsonLd, buildGuideJsonLd } from "../lib/seo";

describe("guide SEO data", () => {
  it("keeps every guide meta title within 25 to 75 characters", () => {
    for (const guide of getGuides()) {
      expect.soft(guide.metaTitle.length, guide.slug).toBeGreaterThanOrEqual(25);
      expect.soft(guide.metaTitle.length, guide.slug).toBeLessThanOrEqual(75);
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

    expect(guides).toHaveLength(13);
    expect(slugs).toContain("agents-md-vs-claude-md-cursorrules-copilot-instructions");
    expect(slugs).toContain("claude-code-subagents-examples");
    expect(slugs).toContain("claude-code-hooks-mcp-setup");
    expect(slugs).toContain("secure-mcp-servers-ai-coding-agents");
    expect(slugs).toContain("antigravity-cli-gemini-cli-migration");
    expect(slugs).toContain("codex-vs-claude-code");
    expect(slugs).toContain("agents-md-template-for-ai-coding-agents");
    expect(slugs).toContain("does-github-copilot-read-claude-md-support-matrix");
    expect(slugs).toContain("agents-md-examples-codex-node-python-monorepos");
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
    expect(primaryKeywords).toHaveLength(13);
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
      updatedAt: "2026-06-25",
      resourceIds: ["instruction-files"],
    });
    expect(guide!.metaTitle.length).toBeGreaterThanOrEqual(25);
    expect(guide!.metaTitle.length).toBeLessThanOrEqual(65);
    expect(guide!.metaDescription.length).toBeGreaterThanOrEqual(90);
    expect(guide!.metaDescription.length).toBeLessThanOrEqual(160);

    const quickAnswer = guide!.sections[0].body[0];
    expect(guide!.title).toMatch(/Which File Should You Use/i);
    expect(quickAnswer).toMatch(/Use AGENTS\.md for Codex/i);
    expect(quickAnswer).toMatch(/CLAUDE\.md for Claude Code/i);
    expect(quickAnswer).toMatch(/\.github\/copilot-instructions\.md for broad GitHub Copilot/i);
    expect(quickAnswer).toMatch(/\.cursor\/rules\/\*\.mdc for current Cursor/i);
    expect(quickAnswer).toMatch(/Copilot support for CLAUDE\.md depends on the Copilot surface/i);
    expect(quickAnswer).toMatch(/selected cloud-agent surfaces support it/i);
    expect(quickAnswer).toMatch(/many Copilot Chat, code-review, and CLI surfaces do not/i);
    expect(quickAnswer).toContain(".github/copilot-instructions.md");
    expect(quickAnswer).not.toMatch(/Copilot (always|never) (reads|supports) CLAUDE\.md/i);
    expect(guide!.sections.map((section) => section.heading)).toEqual(
      expect.arrayContaining([
        "Does GitHub Copilot Read CLAUDE.md?",
        "CLAUDE.md vs AGENTS.md: What Is the Difference?",
        "Does Cursor Support AGENTS.md?",
        "CLAUDE.md vs copilot-instructions.md",
        "How Do Nested AGENTS.md Files Work?",
        "Can One Repository Use All Four Instruction Files?",
        "Which File Should Be the Canonical Source?",
      ]),
    );

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
        "does-github-copilot-read-claude-md-support-matrix",
        "agents-md-examples-codex-node-python-monorepos",
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

  it("publishes P2 AGENTS.md support pages as narrow, internally linked guides", () => {
    const copilotGuide = getGuide("does-github-copilot-read-claude-md-support-matrix");
    const examplesGuide = getGuide("agents-md-examples-codex-node-python-monorepos");

    expect(copilotGuide).toBeDefined();
    expect(examplesGuide).toBeDefined();
    expect(copilotGuide!.title).toMatch(/Does GitHub Copilot Read CLAUDE\.md/i);
    expect(copilotGuide!.sections.map((section) => section.heading)).toEqual(
      expect.arrayContaining([
        "Support is decided by surface",
        "Recommended file policy",
        "How to verify your repository",
      ]),
    );
    expect(copilotGuide!.sections[0].body[0]).toMatch(/surface-specific input/i);
    expect(copilotGuide!.sections[0].body[0]).toMatch(/\.github\/copilot-instructions\.md/i);
    expect(copilotGuide!.sections[0].body[0]).not.toMatch(/always|never/i);
    expect(copilotGuide!.evidence.map((source) => source.publisher)).toEqual(
      expect.arrayContaining(["GitHub", "Anthropic"]),
    );

    expect(examplesGuide!.title).toMatch(/Node\.js, Python and Monorepos/i);
    expect(examplesGuide!.sections.map((section) => section.heading)).toEqual(
      expect.arrayContaining(["Node.js example", "Python service example", "Monorepo example"]),
    );
    expect(examplesGuide!.sections[0].body[0]).toMatch(/root file/i);
    expect(examplesGuide!.sections[0].body[0]).toMatch(/nested AGENTS\.md files/i);

    const mainGuide = getGuide("agents-md-vs-claude-md-cursorrules-copilot-instructions");
    expect(mainGuide!.internalLinks.map((link) => link.slug)).toEqual(
      expect.arrayContaining([
        "does-github-copilot-read-claude-md-support-matrix",
        "agents-md-examples-codex-node-python-monorepos",
      ]),
    );
  });

  it("attaches loop pattern resources to the loop engineering guide", () => {
    const guide = getGuide("loop-engineering-ai-coding-agents");

    expect(guide).toBeDefined();
    expect(guide!.resourceIds).toEqual(["loop-engineering"]);
    expect(guide!.updatedAt).toBe("2026-06-26");

    const quickAnswer = guide!.sections[0].body[0];
    expect(guide!.title).toMatch(/Addy Osmani's Workflow Explained/i);
    expect(quickAnswer).toMatch(/Addy Osmani's loop engineering approach/i);
    expect(quickAnswer).toMatch(/Plan → Act → Observe → Verify → Stop/i);
    expect(quickAnswer).toMatch(/token or cost caps/i);
    expect(quickAnswer).toMatch(/required human checkpoint/i);
    expect(quickAnswer).not.toMatch(/in today's fast-paced|unlock|revolutionize|game-changer/i);
    expect(guide!.sections.map((section) => section.heading)).toEqual(
      expect.arrayContaining([
        "What Is Addy Osmani's Loop Engineering Approach?",
        "How Does Loop Engineering Work for AI Coding Agents?",
        "Loop Engineering vs Prompt Engineering",
        "A Practical Loop Engineering Example",
        "When Should an AI Agent Stop the Loop?",
        "AI coding agent workflow checklist",
      ]),
    );

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

  it("keeps the Codex vs Claude Code P3 comparison evidence-backed without fake benchmark metrics", () => {
    const guide = getGuide("codex-vs-claude-code");

    expect(guide).toBeDefined();
    expect(guide!.updatedAt).toBe("2026-06-26");
    expect(guide!.sections.map((section) => section.heading)).toEqual(
      expect.arrayContaining(["Public example evidence", "Same-task experiment protocol", "Same-repo scoring rubric"]),
    );

    const guideCopy = JSON.stringify(guide);
    expect(guideCopy).toMatch(/Tom's Guide comparison published on May 17, 2026/i);
    expect(guideCopy).toMatch(/not a final verdict for your repository/i);
    expect(guideCopy).toMatch(/fix one failing test/i);
    expect(guideCopy).toMatch(/add one small API endpoint/i);
    expect(guideCopy).toMatch(/refactor one UI component/i);
    expect(guideCopy).toMatch(/elapsed time/i);
    expect(guideCopy).toMatch(/changed files/i);
    expect(guideCopy).toMatch(/human interventions/i);
    expect(guideCopy).toMatch(/Not measured/i);
    expect(guideCopy).not.toMatch(/KyenAI (tested|measured|found)/i);
    expect(guide!.evidence.map((source) => source.publisher)).toEqual(
      expect.arrayContaining(["OpenAI", "Anthropic", "Tom's Guide"]),
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
        "claude code vs codex",
        "openai codex vs claude code",
        "codex alternatives",
        "claude code alternatives",
      ],
      gscBaseline: {
        clicks: 0,
        impressions: 72,
        ctr: 0,
        averagePosition: 39.4,
      },
      emergencyPriority: 55,
    });
  });

  it("preserves editorial ranking while returning public guide objects", () => {
    const priorityGuides = getPriorityGuides();

    expect(priorityGuides.map((guide) => guide.slug)).toEqual([
      "loop-engineering-ai-coding-agents",
      "agents-md-vs-claude-md-cursorrules-copilot-instructions",
      "agents-md-template-for-ai-coding-agents",
      "codex-vs-claude-code",
      "secure-mcp-servers-ai-coding-agents",
    ]);
    expect(JSON.stringify(priorityGuides)).not.toContain('"demandScore"');
    expect(JSON.stringify(priorityGuides)).not.toContain('"gscBaseline"');
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

  it("keeps P1 near-page-one guide titles and content aligned with the execution plan", () => {
    const expected = [
      {
        slug: "local-vs-cloud-ai-coding-agent",
        title: /Security, Cost and Speed Compared/i,
        headings: ["Security, cost, and speed comparison", "Hybrid architecture"],
      },
      {
        slug: "claude-code-hooks-mcp-setup",
        title: /Hooks vs MCP/i,
        headings: ["Hooks vs Skills vs MCP", "Logging and troubleshooting", "Claude Code hooks not working: common fixes"],
        updatedAt: "2026-06-26",
      },
      {
        slug: "agent-governance-checklist-for-software-teams",
        title: /Permissions, Logs and Approvals/i,
        headings: ["Permission levels", "Prohibited actions and approval conditions", "Audit log fields"],
      },
      {
        slug: "agents-md-template-for-ai-coding-agents",
        title: /Practical Examples for Codex and Monorepos/i,
        headings: ["Copyable starter templates", "Root vs nested AGENTS.md inheritance", "What every template must say"],
        updatedAt: "2026-06-26",
      },
      {
        slug: "agent-mode-vs-chat-mode-in-ide",
        title: /Differences, Risks and When to Use Each/i,
        headings: ["Key differences", "High-risk scenarios"],
      },
    ];

    for (const item of expected) {
      const guide = getGuide(item.slug);
      expect(guide, item.slug).toBeDefined();
      expect(guide!.title).toMatch(item.title);
      const headings = guide!.sections.map((section) => section.heading);
      for (const heading of item.headings) {
        expect(headings, `${item.slug}: ${heading}`).toContain(heading);
      }
      expect(guide!.updatedAt).toBe(item.updatedAt ?? "2026-06-18");
    }
  });
});
