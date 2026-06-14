import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const repoRoot = path.resolve(__dirname, "../..");

describe("production SEO data readiness", () => {
  it("documents the real search data, indexing, and performance setup path", () => {
    const doc = fs.readFileSync(path.join(repoRoot, "docs/production-seo-data-setup.md"), "utf8");

    expect(doc).toContain("Search Console API");
    expect(doc).toContain("GA4 Data API");
    expect(doc).toContain("Bing Webmaster");
    expect(doc).toContain("IndexNow");
    expect(doc).toContain("PageSpeed Insights");
    expect(doc).toContain("Core Web Vitals");
    expect(doc).toContain("backlinks cannot be self-created");
  });

  it("exposes required production environment variables and audit scripts", () => {
    const envExample = fs.readFileSync(path.join(repoRoot, ".env.example"), "utf8");
    const prodEnvExample = fs.readFileSync(path.join(repoRoot, ".env.production.example"), "utf8");
    const prodCompose = fs.readFileSync(path.join(repoRoot, "docker-compose.prod.yml"), "utf8");
    const packageJson = JSON.parse(fs.readFileSync(path.join(repoRoot, "package.json"), "utf8"));

    for (const envName of [
      "NEXT_PUBLIC_SITE_URL",
      "NEXT_PUBLIC_EDITORIAL_EMAIL",
      "NEXT_PUBLIC_GA_ID",
      "GOOGLE_APPLICATION_CREDENTIALS_HOST_PATH",
      "GOOGLE_APPLICATION_CREDENTIALS",
      "GOOGLE_OAUTH_REFRESH_TOKEN",
      "GSC_SITE_URL",
      "GA4_PROPERTY_ID",
      "BING_WEBMASTER_API_KEY",
      "BING_SITE_URL",
      "INDEXNOW_KEY",
      "INDEXNOW_HOST",
      "PAGESPEED_API_KEY",
    ]) {
      expect(envExample).toContain(envName);
      expect(prodEnvExample).toContain(envName);
      expect(prodCompose).toContain(envName);
    }

    expect(prodEnvExample).not.toContain("GOOGLE_SEARCH_CONSOLE_KEY");
    expect(prodCompose).not.toContain("GOOGLE_SEARCH_CONSOLE_KEY");

    expect(packageJson.scripts["audit:pagespeed"]).toBe("bash scripts/run-node-script.sh scripts/pagespeed-audit.mjs");
    expect(packageJson.scripts["audit:gsc"]).toBe("bash scripts/run-node-script.sh scripts/gsc-probe.mjs");
    expect(fs.existsSync(path.join(repoRoot, "scripts/pagespeed-audit.mjs"))).toBe(true);
    expect(fs.existsSync(path.join(repoRoot, "scripts/gsc-probe.mjs"))).toBe(true);
  });

  it("keeps browser tab icon assets and declarations in place", () => {
    const seoHead = fs.readFileSync(path.join(repoRoot, "frontend/components/SeoHead.tsx"), "utf8");

    for (const iconPath of ["favicon.ico", "icon.png", "apple-touch-icon.png"]) {
      expect(fs.existsSync(path.join(repoRoot, "frontend/public", iconPath))).toBe(true);
    }

    expect(seoHead).toContain('rel="icon" href="/favicon.ico"');
    expect(seoHead).toContain('rel="icon" type="image/png" sizes="512x512" href="/icon.png"');
    expect(seoHead).toContain('rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"');
  });
});
