import { EDITORIAL_AUTHOR_NAME } from "./editorial";
import type { Article, Guide } from "./types";
import { getArticleEntities } from "./entities";

export const SITE_NAME = "KyenAI";
export const SITE_URL = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL || "https://www.kyenai.com");
export const OG_IMAGE_URL = `${SITE_URL}/og-image.svg`;

type PageSeoInput = {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
};

type BreadcrumbItem = {
  name: string;
  path: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export function formatPageTitle(pageTitle: string): string {
  const clean = pageTitle.replace(/\s+/g, " ").trim();
  if (clean === SITE_NAME || clean.startsWith(`${SITE_NAME} |`) || clean.endsWith(`| ${SITE_NAME}`)) {
    return clean;
  }
  return `${clean} | ${SITE_NAME}`;
}

export function buildOgImageUrl(title: string): string {
  const params = new URLSearchParams({ title: title.trim().slice(0, 120) || SITE_NAME });
  return `${SITE_URL}/api/og?${params.toString()}`;
}

export function buildPageSeo({ title, description, path, type = "website" }: PageSeoInput) {
  const canonical = buildCanonicalUrl(path);

  return {
    title: formatPageTitle(title),
    description,
    canonical,
    ogImage: buildOgImageUrl(title),
    openGraph: {
      title,
      description,
      type,
      url: canonical,
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function buildCanonicalUrl(path: string): string {
  const url = new URL(path, SITE_URL);
  url.search = "";
  url.hash = "";
  return url.toString().replace(/\/$/, "");
}

export function buildMetaDescription(article: Article): string {
  const raw = article.metaDescription || article.summary;
  const clean = raw.replace(/\s+/g, " ").trim();
  if (clean.length <= 160) {
    return clean;
  }
  return `${clean.slice(0, 157).trim()}...`;
}

export function buildArticleJsonLd(article: Article) {
  const canonical = buildCanonicalUrl(`/articles/${article.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: buildMetaDescription(article),
    url: canonical,
    image: {
      "@type": "ImageObject",
      url: OG_IMAGE_URL,
    },
    inLanguage: "en",
    articleSection: article.category,
    wordCount: countArticleWords(article),
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: buildAuthorJsonLd(article.authorName, false),
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: buildCanonicalUrl("/"),
      logo: {
        "@type": "ImageObject",
        url: OG_IMAGE_URL,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonical,
    },
    keywords: article.keywords,
    about: article.keywords.map((keyword) => ({
      "@type": "Thing",
      name: keyword,
    })),
    mentions: getArticleEntities(article).map((entity) => ({
      "@type": entity.kind,
      name: entity.name,
      sameAs: entity.officialUrl,
    })),
    citation: article.sources.map((source) => source.url),
    isBasedOn: article.sources.map((source) => ({
      "@type": "CreativeWork",
      name: source.title,
      url: source.url,
      datePublished: source.publishedAt,
      publisher: {
        "@type": "Organization",
        name: source.publisher,
      },
    })),
  };
}

export function buildGuideJsonLd(guide: Guide) {
  const canonical = buildCanonicalUrl(`/guides/${guide.slug}`);
  const topics = Array.from(new Set([guide.title, ...guide.secondaryKeywords]));

  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: guide.title,
    description: guide.metaDescription,
    url: canonical,
    image: {
      "@type": "ImageObject",
      url: buildOgImageUrl(guide.metaTitle || guide.title),
    },
    inLanguage: "en",
    dateModified: guide.updatedAt,
    author: buildAuthorJsonLd(EDITORIAL_AUTHOR_NAME, false),
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: buildCanonicalUrl("/"),
      logo: {
        "@type": "ImageObject",
        url: OG_IMAGE_URL,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonical,
    },
    keywords: topics,
    about: topics.map((keyword) => ({
      "@type": "Thing",
      name: keyword,
    })),
    citation: guide.evidence.map((source) => source.url),
    isBasedOn: guide.evidence.map((source) => ({
      "@type": "CreativeWork",
      name: source.title,
      url: source.url,
      publisher: {
        "@type": "Organization",
        name: source.publisher,
      },
    })),
  };
}

export function buildGuideFaqs(guide: Guide): FaqItem[] {
  const sourcePublishers = getUniquePublishers(guide.evidence);

  return [
    {
      question: "What should you do first?",
      answer: guide.recommendedPlay[0] ?? guide.summary,
    },
    {
      question: "Who is this guide for?",
      answer: guide.audience,
    },
    {
      question: "What evidence supports this guide?",
      answer:
        sourcePublishers.length > 0
          ? `This guide uses listed source material from ${sourcePublishers.join(", ")}. Source links and scope notes are available on this page.`
          : "This guide does not currently list supporting source records.",
    },
  ];
}

export function buildArticleFaqs(article: Article): FaqItem[] {
  const contextParagraph =
    article.blocks.find((block) => block.id === "depth-implications" && block.type === "paragraph")?.content ||
    article.blocks.find((block) => block.type === "paragraph")?.content ||
    article.summary;
  const sourcePublishers = getUniquePublishers(article.sources);

  return [
    {
      question: "What changed in this update?",
      answer: article.summary,
    },
    {
      question: `Why does this matter for ${getArticleTeamLabel(article.category)} teams?`,
      answer: contextParagraph,
    },
    {
      question: "What sources support this article?",
      answer:
        sourcePublishers.length > 0
          ? `The article is based on source records from ${sourcePublishers.join(", ")}, with links and publication dates listed in the Sources section.`
          : "This page does not currently list supporting source records.",
    },
  ];
}

function getUniquePublishers(sources: Array<{ publisher: string }>): string[] {
  return Array.from(new Set(sources.map((source) => source.publisher)));
}

function getArticleTeamLabel(category: string): string {
  const labels: Record<string, string> = {
    "AI Coding Agents": "AI coding agent",
    "IDE & CLI": "IDE and CLI",
    "Agent Workflows": "agent workflow",
    "Security & Governance": "security and governance",
  };

  return labels[category] ?? category.toLowerCase();
}

export function buildFaqPageJsonLd(faqs: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function buildAuthorJsonLd(name: string, includeContext = true) {
  return {
    ...(includeContext ? { "@context": "https://schema.org" } : {}),
    "@type": "Organization",
    name,
    url: buildCanonicalUrl("/authors/editorial-automation-desk"),
    parentOrganization: {
      "@type": "Organization",
      name: SITE_NAME,
      url: buildCanonicalUrl("/"),
    },
  };
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: buildCanonicalUrl(item.path),
    })),
  };
}

export function buildItemListJsonLd(articles: Article[], name: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    url: buildCanonicalUrl(path),
    numberOfItems: articles.length,
    itemListElement: articles.map((article, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: article.title,
      url: buildCanonicalUrl(`/articles/${article.slug}`),
    })),
  };
}

export function buildGuideItemListJsonLd(guides: Guide[], name: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    url: buildCanonicalUrl(path),
    numberOfItems: guides.length,
    itemListElement: guides.map((guide, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: guide.title,
      url: buildCanonicalUrl(`/guides/${guide.slug}`),
    })),
  };
}

export function buildWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: buildCanonicalUrl("/"),
    inLanguage: "en",
    description:
      "Evidence-led AI coding agent playbooks for instruction files, loop engineering, MCP security, and tool comparisons.",
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: buildCanonicalUrl("/"),
    },
  };
}

export function buildOrganizationJsonLd() {
  const editorialEmail = process.env.NEXT_PUBLIC_EDITORIAL_EMAIL;

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: buildCanonicalUrl("/"),
    logo: {
      "@type": "ImageObject",
      url: OG_IMAGE_URL,
    },
    ...(editorialEmail
      ? {
          contactPoint: {
            "@type": "ContactPoint",
            email: editorialEmail,
            contactType: "editorial corrections",
          },
        }
      : {}),
  };
}

export function countArticleWords(article: Article): number {
  const visibleText = [article.title, article.summary, ...article.blocks.map((block) => block.content)].join(" ");
  return visibleText.match(/[A-Za-z0-9]+(?:[-'][A-Za-z0-9]+)?/g)?.length || 0;
}

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeSiteUrl(value: string): string {
  return value.replace(/\/+$/, "");
}
