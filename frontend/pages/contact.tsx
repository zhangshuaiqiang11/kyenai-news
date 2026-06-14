import Link from "next/link";

import { Layout } from "../components/Layout";
import { SeoHead } from "../components/SeoHead";
import { buildBreadcrumbJsonLd } from "../lib/seo";

const editorialEmail = process.env.NEXT_PUBLIC_EDITORIAL_EMAIL || "";

export default function ContactPage() {
  const description =
    "Contact KyenAI for source corrections, article update requests, citation problems, editorial workflow questions, and feedback on automation decisions.";
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Contact", path: "/contact" },
  ]);

  return (
    <Layout>
      <SeoHead title="Contact and Corrections" description={description} path="/contact">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      </SeoHead>
      <section className="listing-page trust-page">
        <Link href="/">Back to latest</Link>
        <h1>Contact and Corrections</h1>
        <p>
          Use this page for source corrections, outdated article notices, citation problems, duplicate-content concerns,
          and requests to review an automated optimization decision.
        </p>
        <div className="trust-grid">
          <section>
            <h2>Correction Requests</h2>
            <p>
              Include the article URL, the specific claim in question, the stronger source URL, and whether the issue is
              factual accuracy, freshness, attribution, or page structure.
            </p>
          </section>
          <section>
            <h2>Editorial Inbox</h2>
            {editorialEmail ? (
              <p>
                Email <a href={`mailto:${editorialEmail}`}>{editorialEmail}</a>. Production deployments should route
                this inbox to a monitored editorial queue.
              </p>
            ) : (
              <p>
                This local MVP has no public inbox configured. Before launch, set NEXT_PUBLIC_EDITORIAL_EMAIL to a
                monitored address and verify that correction requests create an auditable review item.
              </p>
            )}
          </section>
          <section>
            <h2>Response Standard</h2>
            <p>
              High-risk factual issues should be reviewed before optimization jobs continue. Lower-risk style or
              internal-link suggestions can wait for the next scheduled editorial pass.
            </p>
          </section>
          <section>
            <h2>Automation Review</h2>
            <p>
              The local operations console exposes collect, optimize, publish, and rollback actions for validating the
              self-optimizing workflow before connecting production analytics.
            </p>
          </section>
        </div>
      </section>
    </Layout>
  );
}
