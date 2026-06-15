import { describe, expect, it } from "vitest";

import {
  buildArticleJsonLd,
  buildArticleFaqs,
  buildAuthorJsonLd,
  buildBreadcrumbJsonLd,
  buildCanonicalUrl,
  buildFaqPageJsonLd,
  buildGuideItemListJsonLd,
  buildGuideFaqs,
  buildGuideJsonLd,
  buildItemListJsonLd,
  buildMetaDescription,
  buildOrganizationJsonLd,
  buildPageSeo,
  buildWebsiteJsonLd,
  countArticleWords,
  formatDate,
  formatPageTitle,
} from "../lib/seo";
import { seedArticles } from "../lib/seed";
import { getGuides } from "../lib/guides";

describe("SEO helpers", () => {
  const targetGuideSlugs = [
    "agents-md-vs-claude-md-cursorrules-copilot-instructions",
    "secure-mcp-servers-ai-coding-agents",
    "loop-engineering-ai-coding-agents",
  ] as const;

  it("formats date-only editorial values in UTC", () => {
    expect(formatDate("2026-06-06")).toBe("Jun 6, 2026");
  });

  it("builds stable canonical article URLs without query noise", () => {
    expect(buildCanonicalUrl("/articles/google-antigravity-cli-gemini-cli-transition?utm_source=x")).toBe(
      "https://www.kyenai.com/articles/google-antigravity-cli-gemini-cli-transition"
    );
  });

  it.each(targetGuideSlugs)("keeps the %s guide canonical path stable and strips query and fragment noise", (slug) => {
    const path = `/guides/${slug}`;

    expect(buildCanonicalUrl(path)).toBe(`https://www.kyenai.com${path}`);
    expect(buildCanonicalUrl(`${path}?utm_source=regression#benchmark`)).toBe(`https://www.kyenai.com${path}`);
  });

  it("keeps generated meta descriptions readable and page-specific", () => {
    const article = seedArticles.find((item) => item.slug === "google-antigravity-cli-gemini-cli-transition") || seedArticles[0];
    const description = buildMetaDescription(article);

    expect(description.length).toBeLessThanOrEqual(160);
    expect(description).toContain("Antigravity CLI");
    expect(description).not.toContain("In today's digital era");
  });

  it("keeps the seed article set focused on AI coding agent evidence", () => {
    const slugs = seedArticles.map((article) => article.slug);
    const categories = new Set(seedArticles.map((article) => article.category));

    expect(slugs).not.toContain("ai-search-visibility-tools");
    expect(categories).not.toContain("SEO Systems");
  });

  it("outputs Article JSON-LD that matches visible content and sources", () => {
    const article = seedArticles[0];
    const jsonLd = buildArticleJsonLd(article);

    expect(jsonLd["@type"]).toBe("NewsArticle");
    expect(jsonLd.headline).toBe(article.title);
    expect(jsonLd.articleSection).toBe(article.category);
    expect(jsonLd.dateModified).toBe(article.updatedAt);
    expect(jsonLd.citation[0]).toBe(article.sources[0].url);
    expect(jsonLd.isBasedOn[0].url).toBe(article.sources[0].url);
    expect(jsonLd.wordCount).toBe(countArticleWords(article));
    expect(jsonLd.about).toEqual(expect.arrayContaining([{ "@type": "Thing", name: article.keywords[0] }]));
    expect(jsonLd.image).toEqual({ "@type": "ImageObject", url: expect.stringContaining("og-image") });
    expect(jsonLd.author).toEqual({
      "@type": "Person",
      name: article.authorName,
      url: "https://www.kyenai.com/authors/editorial-automation-desk",
      worksFor: {
        "@type": "Organization",
        name: "KyenAI",
        url: "https://www.kyenai.com",
      },
    });
    expect(jsonLd.publisher).toEqual({
      "@type": "Organization",
      name: "KyenAI",
      url: "https://www.kyenai.com",
      logo: { "@type": "ImageObject", url: expect.stringContaining("og-image") },
    });
    expect(jsonLd).not.toHaveProperty("aggregateRating");
    expect(jsonLd).not.toHaveProperty("review");
    expect(jsonLd).not.toHaveProperty("speakable");
  });

  it("builds guide topics from the public title and deduplicated related topics", () => {
    const guide = getGuides()[0];
    const relatedTopic = guide.secondaryKeywords[0];
    const jsonLd = buildGuideJsonLd({
      ...guide,
      secondaryKeywords: [guide.title, relatedTopic, relatedTopic],
    });

    expect(jsonLd.keywords).toEqual([guide.title, relatedTopic]);
    expect(jsonLd.about).toEqual([
      { "@type": "Thing", name: guide.title },
      { "@type": "Thing", name: relatedTopic },
    ]);
  });

  it.each(targetGuideSlugs)("keeps %s TechArticle schema aligned with visible guide evidence", (slug) => {
    const guide = getGuides().find((item) => item.slug === slug);

    expect(guide).toBeDefined();
    const jsonLd = buildGuideJsonLd(guide!);
    const serializedJsonLd = JSON.stringify(jsonLd);

    expect(jsonLd["@type"]).toBe("TechArticle");
    expect(jsonLd.headline).toBe(guide!.title);
    expect(jsonLd.url).toBe(`https://www.kyenai.com/guides/${slug}`);
    expect(jsonLd.dateModified).toBe(guide!.updatedAt);
    expect(jsonLd.citation).toEqual(guide!.evidence.map((source) => source.url));
    expect(jsonLd.isBasedOn.map((source) => source.url)).toEqual(guide!.evidence.map((source) => source.url));
    expect(jsonLd).not.toHaveProperty("aggregateRating");
    expect(jsonLd).not.toHaveProperty("review");
    expect(serializedJsonLd).not.toMatch(
      /"@(type|id)":"(?:Dataset|DataDownload|ClaimReview|Review|AggregateRating|SoftwareApplication)"/,
    );
    expect(serializedJsonLd).not.toContain("/resources/");
    expect(serializedJsonLd).not.toMatch(
      /verificationPassed|elapsedSeconds|measuredCostUsd|humanInterventions|filesChanged/,
    );
  });

  it.each(targetGuideSlugs)("derives %s FAQ schema only from visible guide recommendations, audience, and evidence", (slug) => {
    const guide = getGuides().find((item) => item.slug === slug);

    expect(guide).toBeDefined();
    const faqs = buildGuideFaqs(guide!);
    const jsonLd = buildFaqPageJsonLd(faqs);
    const serializedFaqs = JSON.stringify(jsonLd);

    expect(faqs).toHaveLength(3);
    expect(faqs[0].answer).toBe(guide!.recommendedPlay[0]);
    expect(faqs[1].answer).toBe(guide!.audience);
    for (const publisher of Array.from(new Set(guide!.evidence.map((source) => source.publisher)))) {
      expect(faqs[2].answer).toContain(publisher);
    }
    expect(jsonLd.mainEntity.map((entity) => entity.acceptedAnswer.text)).toEqual(
      faqs.map((faq) => faq.answer),
    );
    expect(serializedFaqs).not.toMatch(
      /(?:\bbenchmark (?:passed|succeeded)|\b\d+(?:\.\d+)?%\s+(?:success|pass(?:ed| rate)?)|\b\d+\s+(?:benchmark\s+)?runs?\b|\b\d+\s+files?\s+changed\b|\b\d+\s+(?:human\s+)?interventions?\b|\b\d+(?:\.\d+)?\s+seconds?\b|\$\d|\bmeasured cost\b)/i,
    );
  });

  it("builds visible FAQ-derived FAQPage JSON-LD without inventing answers", () => {
    const article = seedArticles[0];
    const faqs = buildArticleFaqs(article);
    const jsonLd = buildFaqPageJsonLd(faqs);

    expect(faqs).toHaveLength(3);
    expect(faqs.map((faq) => faq.question)).toEqual([
      "What changed in this update?",
      "Why does this matter for AI coding agent teams?",
      "What sources support this article?",
    ]);
    expect(faqs[0].answer).toBe(article.summary);
    expect(faqs[1].answer).toBe(article.blocks.find((block) => block.id === "depth-implications")?.content);
    expect(faqs[2].answer).toContain("source records");
    expect(faqs[2].answer).toContain("links and publication dates");
    expect(faqs[2].answer).toContain("Sources section");
    expect(jsonLd["@type"]).toBe("FAQPage");
    expect(jsonLd.mainEntity).toEqual(
      faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      }))
    );
  });

  it("prefers the implications paragraph before the first paragraph or summary", () => {
    const article = seedArticles[0];
    const faqs = buildArticleFaqs({
      ...article,
      blocks: [
        { id: "first-context", type: "paragraph", content: "First paragraph fallback.", sourceIds: [] },
        { id: "depth-implications", type: "paragraph", content: "Implications paragraph.", sourceIds: [] },
      ],
    });

    expect(faqs[1].answer).toBe("Implications paragraph.");
  });

  it("falls back from the first paragraph to the summary for article implications", () => {
    const article = seedArticles[0];
    const paragraphFaqs = buildArticleFaqs({
      ...article,
      blocks: [{ id: "first-context", type: "paragraph", content: "First paragraph fallback.", sourceIds: [] }],
    });
    const summaryFaqs = buildArticleFaqs({ ...article, blocks: [] });

    expect(paragraphFaqs[1].answer).toBe("First paragraph fallback.");
    expect(summaryFaqs[1].answer).toBe(article.summary);
  });

  it.each([
    ["AI Coding Agents", "AI coding agent"],
    ["IDE & CLI", "IDE and CLI"],
    ["Agent Workflows", "agent workflow"],
    ["Security & Governance", "security and governance"],
    ["Research Operations", "research operations"],
  ])("uses a natural team label for the %s category", (category, label) => {
    const faqs = buildArticleFaqs({ ...seedArticles[0], category });

    expect(faqs[1].question).toBe(`Why does this matter for ${label} teams?`);
  });

  it("deduplicates article source publishers in first-seen order", () => {
    const article = seedArticles[0];
    const firstSource = article.sources[0];
    const secondSource = seedArticles.find((item) => item.sources[0].publisher !== firstSource.publisher)!.sources[0];
    const faqs = buildArticleFaqs({
      ...article,
      sources: [firstSource, { ...firstSource, id: "duplicate-publisher" }, secondSource],
    });

    expect(faqs[2].answer).toBe(
      `The article is based on source records from ${firstSource.publisher}, ${secondSource.publisher}, with links and publication dates listed in the Sources section.`
    );
  });

  it("does not invent a Sources section claim when an article has no sources", () => {
    const faqs = buildArticleFaqs({ ...seedArticles[0], sources: [] });

    expect(faqs[2].answer).toBe("This page does not currently list supporting source records.");
    expect(faqs[2].answer).not.toContain("links and publication dates");
  });

  it("builds author Person JSON-LD from the visible editorial byline only", () => {
    const jsonLd = buildAuthorJsonLd(seedArticles[0].authorName);

    expect(jsonLd).toEqual({
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Editorial Automation Desk",
      url: "https://www.kyenai.com/authors/editorial-automation-desk",
      worksFor: {
        "@type": "Organization",
        name: "KyenAI",
        url: "https://www.kyenai.com",
      },
    });
  });

  it("keeps every article deep enough for snippet and AI answer extraction", () => {
    const bannedPhrases = ["in today's digital era", "comprehensive guide", "unlock the power", "game-changing"];

    for (const article of seedArticles) {
      const text = article.blocks.map((block) => block.content).join(" ").toLowerCase();

      expect(countArticleWords(article)).toBeGreaterThanOrEqual(340);
      expect(article.blocks.some((block) => block.type === "fact_table")).toBe(true);
      expect(article.blocks.some((block) => block.type === "source_note")).toBe(true);
      expect(text).toContain("limits and open questions");
      expect(text).toContain(article.sources[0].publisher.toLowerCase());
      expect(bannedPhrases.some((phrase) => text.includes(phrase))).toBe(false);
    }
  });

  it("builds breadcrumb JSON-LD for pages that need a clear hierarchy", () => {
    const article = seedArticles[0];
    const jsonLd = buildBreadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: article.category, path: `/categories/${encodeURIComponent(article.category)}` },
      { name: article.title, path: `/articles/${article.slug}` },
    ]);

    expect(jsonLd["@type"]).toBe("BreadcrumbList");
    expect(jsonLd.itemListElement[0].item).toBe("https://www.kyenai.com");
    expect(jsonLd.itemListElement[2].name).toBe(article.title);
  });

  it("builds list and website JSON-LD for the news front page", () => {
    const listJsonLd = buildItemListJsonLd(seedArticles.slice(0, 3), "Latest AI coding articles", "/");
    const guideListJsonLd = buildGuideItemListJsonLd(getGuides().slice(0, 2), "AI coding agent playbooks", "/guides");
    const websiteJsonLd = buildWebsiteJsonLd();

    expect(listJsonLd["@type"]).toBe("ItemList");
    expect(listJsonLd.numberOfItems).toBe(3);
    expect(listJsonLd.itemListElement[0].url).toBe(`https://www.kyenai.com/articles/${seedArticles[0].slug}`);
    expect(guideListJsonLd.itemListElement[0].url).toContain("https://www.kyenai.com/guides/");
    expect(websiteJsonLd["@type"]).toBe("WebSite");
    expect(websiteJsonLd.name).toBe("KyenAI");
    expect(websiteJsonLd.publisher.name).toBe("KyenAI");
  });

  it("builds top-level organization JSON-LD for brand identity", () => {
    const organizationJsonLd = buildOrganizationJsonLd();

    expect(organizationJsonLd["@type"]).toBe("Organization");
    expect(organizationJsonLd.name).toBe("KyenAI");
    expect(organizationJsonLd.url).toBe("https://www.kyenai.com");
    expect(organizationJsonLd.logo).toEqual({ "@type": "ImageObject", url: expect.stringContaining("og-image") });
  });

  it("formats page titles as one plain string for Next head rendering", () => {
    expect(formatPageTitle("Sources")).toBe("Sources | KyenAI");
    expect(formatPageTitle("KyenAI | AI coding agent news and evidence watch")).toBe(
      "KyenAI | AI coding agent news and evidence watch"
    );
    expect(formatPageTitle("Sources")).not.toContain("EXTERNAL_UNTRUSTED_CONTENT");
  });

  it("builds canonical, Open Graph, and Twitter metadata for major pages", () => {
    const seo = buildPageSeo({
      title: "IDE & CLI",
      description: "Evidence-led IDE and CLI updates for AI coding agent workflows.",
      path: "/categories/IDE%20%26%20CLI",
    });

    expect(seo.title).toBe("IDE & CLI | KyenAI");
    expect(seo.description).toBe("Evidence-led IDE and CLI updates for AI coding agent workflows.");
    expect(seo.canonical).toBe("https://www.kyenai.com/categories/IDE%20%26%20CLI");
    expect(seo.openGraph).toEqual({
      title: "IDE & CLI",
      description: "Evidence-led IDE and CLI updates for AI coding agent workflows.",
      type: "website",
      url: "https://www.kyenai.com/categories/IDE%20%26%20CLI",
      siteName: "KyenAI",
    });
    expect(seo.twitter).toEqual({
      card: "summary_large_image",
      title: "IDE & CLI",
      description: "Evidence-led IDE and CLI updates for AI coding agent workflows.",
    });
  });
});
