import Link from "next/link";

import { Layout } from "../../components/Layout";
import { SeoHead } from "../../components/SeoHead";
import {
  INSTRUCTION_COMPARISON_GUIDE_HREF,
  MCP_SECURITY_GUIDE_HREF,
} from "../../lib/guide-routes";
import { getGuides } from "../../lib/guides";
import { buildBreadcrumbJsonLd, buildGuideItemListJsonLd } from "../../lib/seo";
import type { Guide } from "../../lib/types";

type GuidesPageProps = {
  guides: Guide[];
};

export default function GuidesPage({ guides }: GuidesPageProps) {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Guides", path: "/guides" },
  ]);
  const itemListJsonLd = buildGuideItemListJsonLd(guides, "AI coding agent guides", "/guides");

  return (
    <Layout>
      <SeoHead
        title="AI Coding Agent Guides"
        description="Evidence-led AI coding agent playbooks for configuration, migration, security, governance, and tool comparisons."
        path="/guides"
      >
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      </SeoHead>
      <section className="listing-page guide-listing">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span>Guides</span>
        </nav>
        <h1>AI Coding Agent Guides</h1>
        <p>
          Source-backed, task-oriented playbooks for comparing, configuring, migrating, governing, and securing AI
          coding agents.
        </p>
        <section className="featured-guide-paths" aria-labelledby="featured-guide-paths-heading">
          <div>
            <h2 id="featured-guide-paths-heading">Featured starting paths</h2>
            <p>Choose the next guide by the decision your team needs to make.</p>
          </div>
          <div className="featured-guide-path-grid">
            <Link href={INSTRUCTION_COMPARISON_GUIDE_HREF}>
              <strong>Choose repository instruction files</strong>
              <span>Compare AGENTS.md, CLAUDE.md, Cursor rules, and Copilot support before standardizing guidance.</span>
            </Link>
            <Link href={MCP_SECURITY_GUIDE_HREF}>
              <strong>Set boundaries for MCP access</strong>
              <span>Review permissions, secrets, authentication, logs, and revocation before enabling an MCP server.</span>
            </Link>
          </div>
        </section>
        <div className="guide-grid">
          {guides.map((guide) => (
            <article className="guide-card" key={guide.id}>
              <div className="guide-card-meta">
                <span>{guide.pageType}</span>
              </div>
              <h2>
                <Link href={`/guides/${guide.slug}`}>{guide.title}</Link>
              </h2>
              <p>{guide.summary}</p>
              <p className="guide-card-audience">
                <strong>Who it helps:</strong> {guide.audience}
              </p>
            </article>
          ))}
        </div>
      </section>
    </Layout>
  );
}

export function getStaticProps() {
  return {
    props: {
      guides: getGuides(),
    },
  };
}
