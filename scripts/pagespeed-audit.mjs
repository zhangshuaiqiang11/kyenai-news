import fs from "node:fs";
import path from "node:path";

const siteUrl = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "");
const apiKey = process.env.PAGESPEED_API_KEY || "";
const paths = (
  process.env.PAGESPEED_PATHS || "/,/guides,/guides/antigravity-cli-gemini-cli-migration,/sources,/entities"
)
  .split(",")
  .map((item) => item.trim())
  .filter(Boolean);

if (!siteUrl) {
  fail("Set NEXT_PUBLIC_SITE_URL or SITE_URL to a public production URL before running PageSpeed Insights.");
}

if (/^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])/.test(siteUrl) || siteUrl.endsWith(".local")) {
  fail("PageSpeed Insights needs a publicly reachable URL, not localhost or a .local placeholder.");
}

const results = [];

for (const pathname of paths) {
  const targetUrl = new URL(pathname, siteUrl).toString();
  const report = await fetchReport(targetUrl);
  const lighthouse = report.lighthouseResult || {};
  const categories = lighthouse.categories || {};
  const audits = lighthouse.audits || {};
  const field = report.loadingExperience?.metrics || {};

  results.push({
    url: targetUrl,
    fetchedAt: new Date().toISOString(),
    scores: {
      performance: toScore(categories.performance?.score),
      seo: toScore(categories.seo?.score),
      accessibility: toScore(categories.accessibility?.score),
      bestPractices: toScore(categories["best-practices"]?.score),
    },
    lab: {
      lcpMs: audits["largest-contentful-paint"]?.numericValue ?? null,
      cls: audits["cumulative-layout-shift"]?.numericValue ?? null,
      totalBlockingTimeMs: audits["total-blocking-time"]?.numericValue ?? null,
      speedIndexMs: audits["speed-index"]?.numericValue ?? null,
    },
    field: {
      lcp: field.LARGEST_CONTENTFUL_PAINT_MS || null,
      cls: field.CUMULATIVE_LAYOUT_SHIFT_SCORE || null,
      inp: field.INTERACTION_TO_NEXT_PAINT || null,
    },
  });
}

const artifactsDir = path.resolve("artifacts");
fs.mkdirSync(artifactsDir, { recursive: true });
const host = new URL(siteUrl).hostname.replace(/[^a-z0-9.-]/gi, "-");
const date = new Date().toISOString().slice(0, 10);
const outputPath = path.join(artifactsDir, `pagespeed-${host}-${date}.json`);
fs.writeFileSync(outputPath, `${JSON.stringify({ siteUrl, paths, results }, null, 2)}\n`);

console.log(`Saved PageSpeed report to ${outputPath}`);
for (const result of results) {
  console.log(`${result.url} performance=${result.scores.performance ?? "n/a"} seo=${result.scores.seo ?? "n/a"}`);
}

async function fetchReport(targetUrl) {
  const endpoint = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
  endpoint.searchParams.set("url", targetUrl);
  endpoint.searchParams.set("strategy", "mobile");
  endpoint.searchParams.append("category", "performance");
  endpoint.searchParams.append("category", "seo");
  endpoint.searchParams.append("category", "accessibility");
  endpoint.searchParams.append("category", "best-practices");
  if (apiKey) {
    endpoint.searchParams.set("key", apiKey);
  }

  const response = await fetch(endpoint);
  if (!response.ok) {
    const text = await response.text();
    fail(`PageSpeed request failed for ${targetUrl}: ${response.status} ${text}`);
  }
  return response.json();
}

function normalizeSiteUrl(value) {
  return value.replace(/\/+$/, "");
}

function toScore(value) {
  return typeof value === "number" ? Math.round(value * 100) : null;
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
