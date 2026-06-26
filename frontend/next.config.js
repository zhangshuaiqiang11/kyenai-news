const { readFileSync } = require("node:fs");
const { resolve } = require("node:path");

const EDITORIAL_SOURCE_FILES = [
  "lib/guides.ts",
  "lib/guide-expansion.ts",
  "lib/seed.ts",
  "lib/articles/spacex-cursor-acquisition.ts",
];
const EDITORIAL_DATE_PATTERN =
  /\b(?:updatedAt|publishedAt)\s*:\s*["'](\d{4}-\d{2}-\d{2})["']/g;

function parseCalendarDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const timestamp = Date.UTC(year, month - 1, day);
  const date = new Date(timestamp);

  return date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
    ? timestamp
    : null;
}

function extractEditorialDates(source) {
  return Array.from(
    source.matchAll(EDITORIAL_DATE_PATTERN),
    (match) => match[1],
  );
}

function selectLatestEditorialDate(values, buildTimestamp) {
  const cutoff = Date.parse(buildTimestamp);
  if (!Number.isFinite(cutoff)) {
    return null;
  }

  let latest = null;
  for (const value of values) {
    const timestamp = parseCalendarDate(value);
    if (
      timestamp !== null &&
      timestamp <= cutoff &&
      (latest === null || timestamp > latest.timestamp)
    ) {
      latest = { value, timestamp };
    }
  }
  return latest?.value || null;
}

function deriveLatestEditorialUpdate(buildTimestamp, sourceRoot = __dirname) {
  const values = EDITORIAL_SOURCE_FILES.flatMap((pathname) =>
    extractEditorialDates(readFileSync(resolve(sourceRoot, pathname), "utf8")),
  );
  return selectLatestEditorialDate(values, buildTimestamp);
}

/** @type {import('next').NextConfig} */
const buildTimestamp = new Date().toISOString();
const latestEditorialUpdate = deriveLatestEditorialUpdate(buildTimestamp);

const categoryRedirects = [
  ["AI Coding Agents", "ai-coding-agents"],
  ["IDE & CLI", "ide-cli"],
  ["Agent Workflows", "agent-workflows"],
  ["Security & Governance", "security-governance"],
].map(([category, slug]) => ({
  source: `/categories/${encodeURIComponent(category)}`,
  destination: `/categories/${slug}`,
  permanent: true,
}));

const articleRedirects = [
  {
    source: "/article/:slug",
    destination: "/articles/:slug",
    permanent: true,
  },
];

const guideRedirects = [
  {
    source: "/guide",
    destination: "/guides",
    permanent: true,
  },
  {
    source: "/guide/:slug",
    destination: "/guides/:slug",
    permanent: true,
  },
];

const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || ".next",
  env: {
    NEXT_PUBLIC_BUILD_TIMESTAMP: buildTimestamp,
    NEXT_PUBLIC_LATEST_EDITORIAL_UPDATE: latestEditorialUpdate,
  },
  async redirects() {
    return [...categoryRedirects, ...articleRedirects, ...guideRedirects];
  },
  async headers() {
    return [
      {
        source: "/resources/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, noarchive",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
Object.defineProperties(module.exports, {
  deriveLatestEditorialUpdate: { value: deriveLatestEditorialUpdate },
  extractEditorialDates: { value: extractEditorialDates },
  selectLatestEditorialDate: { value: selectLatestEditorialDate },
});
