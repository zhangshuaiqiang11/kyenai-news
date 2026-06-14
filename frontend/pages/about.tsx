import Link from "next/link";

import { Layout } from "../components/Layout";
import { SeoHead } from "../components/SeoHead";
import { buildBreadcrumbJsonLd, SITE_NAME } from "../lib/seo";

export default function AboutPage() {
  const description =
    "KyenAI explains its evidence-led AI coding agent playbooks, source standards, editorial automation workflow, and ranking-safe publication boundaries.";
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
  ]);

  return (
    <Layout>
      <SeoHead title="About KyenAI" description={description} path="/about">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      </SeoHead>
      <section className="listing-page trust-page">
        <Link href="/">Back to latest</Link>
        <h1>About KyenAI</h1>
        <p>
          {SITE_NAME} is an evidence-led guide hub for AI coding agent configuration, migration, security, and
          workflow decisions. The site is designed to make source-backed playbooks easy to read, easy to verify,
          and easy for search and AI answer systems to understand.
        </p>
        <div className="trust-grid">
          <section>
            <h2>Coverage Scope</h2>
            <p>
              We cover official updates from AI coding agent vendors, IDE and CLI tooling, enterprise governance,
              agent security, and operational workflows that affect software teams.
            </p>
          </section>
          <section>
            <h2>Editorial Owner</h2>
            <p>
              Articles are maintained by the Editorial Automation Desk, a documented workflow that combines
              whitelisted sources, search-performance signals, structured patch review, validation, and rollback.
            </p>
          </section>
          <section>
            <h2>What We Avoid</h2>
            <p>
              We do not promise ranking outcomes, scrape search result pages for claims, invent hands-on testing,
              refresh dates without evidence, or publish near-duplicate pages for keyword coverage.
            </p>
          </section>
          <section>
            <h2>Verification Trail</h2>
            <p>
              Every article exposes its sources, publication dates, update date, author entity, keywords, related
              coverage, and a visible source note so readers can separate facts from interpretation.
            </p>
          </section>
        </div>
        <div className="trust-actions">
          <Link href="/sources">Review source ledger</Link>
          <Link href="/editorial-policy">Read editorial policy</Link>
          <Link href="/contact">Send a correction</Link>
        </div>
      </section>
    </Layout>
  );
}
