import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const frontendRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = resolve(frontendRoot, "..");
const require = createRequire(import.meta.url);

describe("Next build configuration", () => {
  it("keeps production build output separate from the development cache", () => {
    const packageJson = JSON.parse(readFileSync(resolve(frontendRoot, "package.json"), "utf8"));
    const nextConfig = readFileSync(resolve(frontendRoot, "next.config.js"), "utf8");

    expect(nextConfig).toContain("NEXT_DIST_DIR");
    expect(nextConfig).toContain(".next");
    expect(packageJson.scripts.dev).not.toContain("NEXT_DIST_DIR=.next-build");
    expect(packageJson.scripts.build).toContain("NEXT_DIST_DIR=.next-build");
    expect(packageJson.scripts.start).toContain("NEXT_DIST_DIR=.next-build");
  });

  it("embeds one explicitly zoned build timestamp for server and client rendering", () => {
    const nextConfig = require(resolve(frontendRoot, "next.config.js")) as {
      env?: {
        NEXT_PUBLIC_BUILD_TIMESTAMP?: string;
        NEXT_PUBLIC_LATEST_EDITORIAL_UPDATE?: string;
      };
    };
    const buildTimestamp = nextConfig.env?.NEXT_PUBLIC_BUILD_TIMESTAMP;

    expect(buildTimestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    expect(Number.isFinite(Date.parse(buildTimestamp || ""))).toBe(true);
    expect(nextConfig.env?.NEXT_PUBLIC_LATEST_EDITORIAL_UPDATE).toBe("2026-06-26");
  });

  it("derives the latest valid non-future date from authoritative source text", () => {
    const nextConfig = require(resolve(frontendRoot, "next.config.js")) as {
      deriveLatestEditorialUpdate: (buildTimestamp: string, sourceRoot?: string) => string | null;
      extractEditorialDates: (source: string) => string[];
      selectLatestEditorialDate: (values: string[], buildTimestamp: string) => string | null;
    };
    const source = `
      updatedAt: "2026-06-14",
      publishedAt: '2026-02-30',
      updatedAt: "2026-06-15",
      updatedAt: "2026-6-13",
      unrelated: "2026-06-13",
    `;

    expect(nextConfig.extractEditorialDates(source)).toEqual([
      "2026-06-14",
      "2026-02-30",
      "2026-06-15",
    ]);
    expect(
      nextConfig.selectLatestEditorialDate(
        nextConfig.extractEditorialDates(source),
        "2026-06-14T23:59:59.000Z",
      ),
    ).toBe("2026-06-14");
    expect(
      nextConfig.deriveLatestEditorialUpdate("2026-06-18T23:59:59.000Z", frontendRoot),
    ).toBe("2026-06-18");
  });

  it("redirects singular article and guide routes to canonical plural routes", async () => {
    const nextConfig = require(resolve(frontendRoot, "next.config.js")) as {
      redirects?: () => Promise<Array<{
        source: string;
        destination: string;
        permanent: boolean;
      }>>;
    };
    const redirects = await nextConfig.redirects?.();

    expect(redirects).toEqual(
      expect.arrayContaining([
        {
          source: "/article/:slug",
          destination: "/articles/:slug",
          permanent: true,
        },
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
        {
          source: "/llm.txt",
          destination: "/llms.txt",
          permanent: true,
        },
      ]),
    );
  });

  it("routes apex production traffic permanently to the canonical www host", () => {
    const caddyfile = readFileSync(resolve(repoRoot, "Caddyfile"), "utf8");
    const compose = readFileSync(resolve(repoRoot, "docker-compose.prod.yml"), "utf8");
    const envExample = readFileSync(resolve(repoRoot, ".env.production.example"), "utf8");

    expect(caddyfile).toContain("APEX_DOMAIN");
    expect(caddyfile).toContain("redir https://{$FRONTEND_DOMAIN:www.kyenai.com}{uri} permanent");
    expect(compose).toContain("APEX_DOMAIN: ${APEX_DOMAIN:-kyenai.com}");
    expect(envExample).toContain("APEX_DOMAIN=kyenai.com");
  });

  it("sets crawlable document language and mobile viewport defaults", () => {
    const documentSource = readFileSync(resolve(frontendRoot, "pages/_document.tsx"), "utf8");
    const appSource = readFileSync(resolve(frontendRoot, "pages/_app.tsx"), "utf8");

    expect(documentSource).toContain('<Html lang="en">');
    expect(appSource).toContain('name="viewport"');
    expect(appSource).toContain("width=device-width, initial-scale=1");
  });

  it("sends noindex headers for downloadable resource files", async () => {
    const nextConfig = require(resolve(frontendRoot, "next.config.js")) as {
      headers?: () => Promise<Array<{
        source: string;
        headers: Array<{ key: string; value: string }>;
      }>>;
    };
    const headerRules = await nextConfig.headers?.();
    const resourceRule = headerRules?.find((rule) => rule.source === "/resources/:path*");
    const robotsHeader = resourceRule?.headers.find((header) => header.key === "X-Robots-Tag");

    expect(resourceRule).toBeDefined();
    expect(robotsHeader?.value).toContain("noindex");
    expect(robotsHeader?.value).toContain("nofollow");
    expect(robotsHeader?.value).toContain("noarchive");
  });

  it("keeps production service environment maps free of duplicate keys", () => {
    const compose = readFileSync(resolve(repoRoot, "docker-compose.prod.yml"), "utf8");
    const lines = compose.split("\n");
    const duplicates: string[] = [];

    for (let index = 0; index < lines.length; index += 1) {
      if (!lines[index].match(/^ {4}environment:\s*$/)) {
        continue;
      }

      const keys = new Set<string>();
      for (let cursor = index + 1; cursor < lines.length; cursor += 1) {
        const line = lines[cursor];
        if (line.trim() === "") {
          continue;
        }
        if (!line.startsWith("      ")) {
          break;
        }

        const match = line.match(/^ {6}([A-Z0-9_]+):/);
        if (!match) {
          continue;
        }

        const key = match[1];
        if (keys.has(key)) {
          duplicates.push(key);
        }
        keys.add(key);
      }
    }

    expect(duplicates).toEqual([]);
  });

  it("diagnoses and clears stale edge containers before production compose up", () => {
    const deployScript = readFileSync(resolve(repoRoot, "scripts/deploy-on-server.sh"), "utf8");

    expect(deployScript).toContain('COMPOSE_PROJECT_NAME="${COMPOSE_PROJECT_NAME:-kyenai}"');
    expect(deployScript).toContain("report_port_bindings");
    expect(deployScript).toContain("assert_edge_ports_available");
    expect(deployScript).toContain("assert_caddy_ports_published");
    expect(deployScript).toContain("smoke_frontend_container");
    expect(deployScript).toContain("down --remove-orphans");
    expect(deployScript).toContain("up -d --build --force-recreate");
    expect(deployScript).toContain("ports 80 or 443 are still allocated");
    expect(deployScript).toContain("test -f /app/public/llms.txt");
    expect(deployScript).not.toContain("llms.txt HTTP %{http_code}\\n\" http://127.0.0.1/llms.txt || true");
  });
});
