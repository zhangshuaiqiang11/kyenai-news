import { buildCanonicalUrl } from "./seo";

const publicAllowRules = ["/api/og"];
const publicDisallowRules = ["/api/"];

const publicSearchAndAnswerCrawlers = [
  "Googlebot",
  "Googlebot-Image",
  "Googlebot-Video",
  "GoogleOther",
  "GoogleOther-Image",
  "GoogleOther-Video",
  "Google-CloudVertexBot",
  "Bingbot",
  "BingPreview",
  "OAI-SearchBot",
  "ChatGPT-User",
  "PerplexityBot",
  "Perplexity-User",
  "Claude-SearchBot",
  "Claude-User",
];

const trainingOrResearchCrawlers = [
  "GPTBot",
  "ClaudeBot",
  "Google-Extended",
  "Bytespider",
];

function buildCrawlerGroup(userAgent: string): string[] {
  return [
    `User-agent: ${userAgent}`,
    "Allow: /",
    ...publicAllowRules.map((rule) => `Allow: ${rule}`),
    ...publicDisallowRules.map((rule) => `Disallow: ${rule}`),
    "",
  ];
}

export function buildRobotsTxt(): string {
  return [
    "# KyenAI is open to search engines and AI answer crawlers that respect robots.txt.",
    "# Search, answer, and user-triggered agents may crawl public guides; training/research crawlers are named separately for explicit policy review.",
    "# Unknown or unpublished AI crawlers are covered by the open default group, including Tencent Yuanbao, xAI Grok, Zhipu GLM, MiniMax, and Doubao-specific crawlers.",
    "# Verified crawler groups repeat operational exclusions because specific user-agent groups do not inherit User-agent: * rules.",
    "",
    "User-agent: *",
    "Allow: /",
    ...publicAllowRules.map((rule) => `Allow: ${rule}`),
    ...publicDisallowRules.map((rule) => `Disallow: ${rule}`),
    "",
    "# Search and answer retrieval crawlers",
    ...publicSearchAndAnswerCrawlers.flatMap(buildCrawlerGroup),
    "# Training or research crawlers currently allowed for public content discovery",
    ...trainingOrResearchCrawlers.flatMap(buildCrawlerGroup),
    `Sitemap: ${buildCanonicalUrl("/sitemap.xml")}`,
    "",
  ].join("\n");
}
