const DEFAULT_BASE_URL = "https://www.kyenai.com";
const DEFAULT_CANONICAL_ORIGIN = "https://www.kyenai.com";

const pageContracts = [
  {
    path: "/",
    titleIncludes: "AI Coding Agent Templates & Security Playbooks",
    h1Includes: "Evidence-Backed Templates and Security Playbooks",
  },
  {
    path: "/guides/agents-md-template-for-ai-coding-agents",
    titleIncludes: "AGENTS.md Template for Codex",
    h1Includes: "AGENTS.md Template for Codex and Monorepos",
  },
  {
    path: "/guides/agents-md-vs-claude-md-cursorrules-copilot-instructions",
    titleIncludes: "AGENTS.md vs CLAUDE.md vs Copilot Instructions",
    h1Includes: "AGENTS.md vs CLAUDE.md vs Copilot Instructions",
  },
  {
    path: "/guides/secure-mcp-servers-ai-coding-agents",
    titleIncludes: "MCP Server Security Checklist: 25 Controls",
    h1Includes: "MCP Server Security Checklist: 25 Controls",
  },
  {
    path: "/guides/mcp-server-not-showing-tools",
    titleIncludes: "MCP Server Not Showing Tools? 8 Checks",
    h1Includes: "MCP Server Not Showing Tools? Diagnose tools/list in 8 Checks",
  },
  {
    path: "/guides/codex-vs-claude-code",
    titleIncludes: "Codex vs Claude Code",
    h1Includes: "Codex vs Claude Code",
  },
  {
    path: "/guides/codex-vs-github-copilot",
    titleIncludes: "Codex vs GitHub Copilot",
    h1Includes: "Codex vs GitHub Copilot",
  },
  {
    path: "/guides/ai-coding-agents-comparison",
    titleIncludes: "AI Coding Agent Comparison",
    h1Includes: "AI Coding Agents Comparison",
  },
  {
    path: "/guides/claude-code-alternatives",
    titleIncludes: "7 Claude Code Alternatives",
    h1Includes: "7 Claude Code Alternatives",
  },
  {
    path: "/guides/loop-engineering-ai-coding-agents",
    titleIncludes: "What Is Loop Engineering?",
    h1Includes: "What Is Loop Engineering for AI Coding Agents?",
  },
  {
    path: "/guides/ai-coding-agent-instruction-file-adoption-report-2026",
    titleIncludes: "AI Agent Instruction File Adoption",
    h1Includes: "AI Coding Agent Instruction File Adoption Report",
  },
  {
    path: "/tools/instruction-file-checker",
    titleIncludes: "Instruction File Checker",
    h1Includes: "AI Coding Agent Instruction File Checker",
  },
  {
    path: "/sources",
    titleIncludes: "Source & Verification Ledger",
    h1Includes: "Source & Verification Ledger",
  },
  {
    path: "/articles/spacex-cursor-acquisition-2026",
    titleIncludes: "Did SpaceX Buy Cursor? $60B Deal Closed",
    h1Includes: "Did SpaceX Buy Cursor? $60B Deal Status and Timeline",
  },
  {
    path: "/articles/cursor-enterprise-organizations-governance",
    titleIncludes: "Cursor Enterprise Security: Privacy Mode, Retention & Admin Controls",
    h1Includes: "Cursor Enterprise Security: Governance, Privacy Mode, and Agent Permissions",
  },
];

function readOption(name, fallback) {
  const index = process.argv.indexOf(name);
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
}

function normalizeOrigin(value, label) {
  const url = new URL(value);
  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error(`${label} must use http or https`);
  }
  return url.origin;
}

function canonicalForPath(path, origin) {
  return path === "/" ? origin : new URL(path, origin).toString();
}

function decodeHtml(value) {
  return value
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function cleanText(value) {
  return decodeHtml(value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim());
}

function getAttribute(tag, name) {
  const quoted = tag.match(new RegExp(`\\b${name}\\s*=\\s*(["'])(.*?)\\1`, "i"));
  if (quoted) return decodeHtml(quoted[2]);
  const unquoted = tag.match(new RegExp(`\\b${name}\\s*=\\s*([^\\s>]+)`, "i"));
  return unquoted ? decodeHtml(unquoted[1]) : "";
}

function findTagByAttribute(html, tagName, attribute, expectedValue) {
  const tags = html.match(new RegExp(`<${tagName}\\b[^>]*>`, "gi")) || [];
  return tags.find((tag) => getAttribute(tag, attribute).toLowerCase() === expectedValue.toLowerCase()) || "";
}

function collectJsonLd(html) {
  const values = [];
  const pattern = /<script\b[^>]*type\s*=\s*(["'])application\/ld\+json\1[^>]*>([\s\S]*?)<\/script>/gi;
  for (const match of html.matchAll(pattern)) {
    try {
      values.push(JSON.parse(match[2]));
    } catch {
      values.push(null);
    }
  }
  return values;
}

function inspectPage(html, contract, canonicalOrigin) {
  const title = cleanText(html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "");
  const h1Values = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((match) => cleanText(match[1]));
  const descriptionTag = findTagByAttribute(html, "meta", "name", "description");
  const robotsTag = findTagByAttribute(html, "meta", "name", "robots");
  const canonicalTag = findTagByAttribute(html, "link", "rel", "canonical");
  const ogTitleTag = findTagByAttribute(html, "meta", "property", "og:title");
  const ogDescriptionTag = findTagByAttribute(html, "meta", "property", "og:description");
  const ogUrlTag = findTagByAttribute(html, "meta", "property", "og:url");
  const ogImageTag = findTagByAttribute(html, "meta", "property", "og:image");
  const jsonLd = collectJsonLd(html);
  const expectedCanonical = canonicalForPath(contract.path, canonicalOrigin);
  const failures = [];

  if (!title.includes(contract.titleIncludes)) failures.push(`title missing expected text: ${contract.titleIncludes}`);
  if (h1Values.length !== 1) failures.push(`expected exactly one H1, found ${h1Values.length}`);
  if (!h1Values[0]?.includes(contract.h1Includes)) failures.push(`H1 missing expected text: ${contract.h1Includes}`);
  if (getAttribute(descriptionTag, "content").trim().length < 70) failures.push("meta description is missing or shorter than 70 characters");
  if (getAttribute(canonicalTag, "href") !== expectedCanonical) failures.push(`canonical mismatch: expected ${expectedCanonical}`);
  if (/\bnoindex\b/i.test(getAttribute(robotsTag, "content"))) failures.push("meta robots contains noindex");
  if (!getAttribute(ogTitleTag, "content")) failures.push("og:title is missing");
  if (!getAttribute(ogDescriptionTag, "content")) failures.push("og:description is missing");
  if (getAttribute(ogUrlTag, "content") !== expectedCanonical) failures.push(`og:url mismatch: expected ${expectedCanonical}`);
  if (!getAttribute(ogImageTag, "content")) failures.push("og:image is missing");
  if (jsonLd.length === 0) failures.push("JSON-LD is missing");
  if (jsonLd.some((value) => value === null)) failures.push("JSON-LD contains invalid JSON");

  return { failures, title, h1: h1Values[0] || "", canonical: getAttribute(canonicalTag, "href"), jsonLdBlocks: jsonLd.length };
}

async function fetchText(url) {
  const response = await fetch(url, {
    redirect: "follow",
    headers: { "user-agent": "KyenAI-SEO-Drift-Monitor/1.0 (+https://www.kyenai.com/)" },
  });
  return { response, body: await response.text() };
}

async function run() {
  const baseUrl = normalizeOrigin(readOption("--base-url", process.env.SEO_DRIFT_BASE_URL || DEFAULT_BASE_URL), "base URL");
  const canonicalOrigin = normalizeOrigin(
    readOption("--canonical-origin", process.env.SEO_DRIFT_CANONICAL_ORIGIN || DEFAULT_CANONICAL_ORIGIN),
    "canonical origin",
  );
  const results = [];

  for (const contract of pageContracts) {
    const url = new URL(contract.path, baseUrl).toString();
    try {
      const { response, body } = await fetchText(url);
      const failures = [];
      if (response.status !== 200) failures.push(`HTTP status ${response.status}`);
      if (!response.headers.get("content-type")?.includes("text/html")) failures.push("content-type is not text/html");
      const inspected = inspectPage(body, contract, canonicalOrigin);
      failures.push(...inspected.failures);
      results.push({ path: contract.path, status: response.status, ...inspected, failures });
    } catch (error) {
      results.push({ path: contract.path, status: 0, failures: [`fetch failed: ${error.message}`] });
    }
  }

  const robotsUrl = new URL("/robots.txt", baseUrl).toString();
  const robots = await fetchText(robotsUrl);
  const robotsFailures = [];
  if (robots.response.status !== 200) robotsFailures.push(`HTTP status ${robots.response.status}`);
  for (const crawler of ["Googlebot", "Bingbot", "OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "Claude-SearchBot"]) {
    if (!robots.body.includes(`User-agent: ${crawler}`)) robotsFailures.push(`missing crawler policy for ${crawler}`);
  }
  if (!robots.body.includes(`Sitemap: ${canonicalOrigin}/sitemap.xml`)) robotsFailures.push("canonical sitemap declaration is missing");
  results.push({ path: "/robots.txt", status: robots.response.status, failures: robotsFailures });

  const sitemapUrl = new URL("/sitemap.xml", baseUrl).toString();
  const sitemap = await fetchText(sitemapUrl);
  const sitemapFailures = [];
  if (sitemap.response.status !== 200) sitemapFailures.push(`HTTP status ${sitemap.response.status}`);
  for (const contract of pageContracts) {
    const location = `<loc>${canonicalForPath(contract.path, canonicalOrigin)}</loc>`;
    if (!sitemap.body.includes(location)) sitemapFailures.push(`missing sitemap URL: ${contract.path}`);
  }
  results.push({ path: "/sitemap.xml", status: sitemap.response.status, failures: sitemapFailures });

  const llmsUrl = new URL("/llms.txt", baseUrl).toString();
  const llms = await fetchText(llmsUrl);
  const llmsFailures = [];
  if (llms.response.status !== 200) llmsFailures.push(`HTTP status ${llms.response.status}`);
  for (const contract of pageContracts.filter(({ path }) => path.startsWith("/guides/"))) {
    if (!llms.body.includes(canonicalForPath(contract.path, canonicalOrigin))) llmsFailures.push(`missing llms.txt URL: ${contract.path}`);
  }
  results.push({ path: "/llms.txt", status: llms.response.status, failures: llmsFailures });

  const failed = results.filter((result) => result.failures.length > 0);
  const report = {
    checkedAt: new Date().toISOString(),
    baseUrl,
    canonicalOrigin,
    pagesChecked: results.length,
    failures: failed.reduce((count, result) => count + result.failures.length, 0),
    results,
  };

  console.log(JSON.stringify(report, null, 2));
  if (failed.length > 0) process.exitCode = 1;
}

await run();
