import Link from "next/link";

import { Layout } from "../components/Layout";
import { SeoHead } from "../components/SeoHead";
import { buildBreadcrumbJsonLd } from "../lib/seo";

export default function EditorialPolicyPage() {
  const description =
    "KyenAI's editorial policy for source selection, AI-assisted optimization, anti-spam validation, corrections, updates, and rollback.";
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Editorial Policy", path: "/editorial-policy" },
  ]);

  return (
    <Layout>
      <SeoHead title="Editorial Policy" description={description} path="/editorial-policy">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      </SeoHead>
      <section className="listing-page trust-page">
        <Link href="/">Back to latest</Link>
        <h1>Editorial Policy</h1>
        <p>
          KyenAI uses automation to speed up monitoring and page maintenance, but publication depends on evidence.
          A patch can improve structure, clarity, links, summaries, and schema only when the underlying claim is
          supported by a listed source or search-performance record.
        </p>
        <div className="policy-list">
          <section>
            <h2>Source Standard</h2>
            <p>
              Priority goes to official changelogs, vendor blogs, product documentation, standards pages, and webmaster
              guidance. Open-web claims and social chatter are not enough for automatic publication.
            </p>
          </section>
          <section>
            <h2>AI-Assisted Writing Boundary</h2>
            <p>
              AI may propose a structured JSON patch, but it cannot directly publish free-form HTML. Validation checks
              cited evidence, duplicate risk, visible-source alignment, keyword density, style, and update-date honesty.
            </p>
          </section>
          <section>
            <h2>Blocked Patterns</h2>
            <ul>
              <li>Template language, vague marketing claims, or filler introductions.</li>
              <li>Unsupported superlatives, ranking guarantees, or invented hands-on experience.</li>
              <li>Keyword stuffing, thin rewrites, uncited FAQ answers, and fake freshness.</li>
              <li>Schema that does not match visible page content.</li>
            </ul>
          </section>
          <section>
            <h2>Corrections and Updates</h2>
            <p>
              Updates must change visible content or structured evidence. If a source is withdrawn, contradicted, or
              blocked by robots policy, the related optimization job is skipped until a stronger source is available.
            </p>
          </section>
          <section>
            <h2>Rollback</h2>
            <p>
              Approved patches create a versioned snapshot before publication. If a validation rule misses a problem,
              the previous article version can be restored from the operations workflow.
            </p>
          </section>
        </div>
      </section>
    </Layout>
  );
}
