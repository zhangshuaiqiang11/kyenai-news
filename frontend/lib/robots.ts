import { buildCanonicalUrl } from "./seo";

const publicAllowRules = ["/api/og"];
const publicDisallowRules = ["/api/"];

const verifiedSearchAndAiCrawlers = [
  "Googlebot",
  "Googlebot-Image",
  "GoogleOther",
  "Google-Extended",
  "Bingbot",
  "BingPreview",
  "OAI-SearchBot",
  "ChatGPT-User",
  "GPTBot",
  "PerplexityBot",
  "Perplexity-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
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
    "# Unknown or unpublished AI crawlers are covered by the open default group, including Tencent Yuanbao, xAI Grok, Zhipu GLM, MiniMax, and Doubao-specific crawlers.",
    "# Verified crawler groups repeat operational exclusions because specific user-agent groups do not inherit User-agent: * rules.",
    "",
    "User-agent: *",
    "Allow: /",
    ...publicAllowRules.map((rule) => `Allow: ${rule}`),
    ...publicDisallowRules.map((rule) => `Disallow: ${rule}`),
    "",
    ...verifiedSearchAndAiCrawlers.flatMap(buildCrawlerGroup),
    `Sitemap: ${buildCanonicalUrl("/sitemap.xml")}`,
    "",
  ].join("\n");
}
