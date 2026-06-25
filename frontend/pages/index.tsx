import Link from "next/link";

import { ArticleExplorer } from "../components/ArticleExplorer";
import { Layout } from "../components/Layout";
import { SeoHead } from "../components/SeoHead";
import { SignalPanel } from "../components/SignalPanel";
import { getArticles } from "../lib/api";
import { getEntityCoverage } from "../lib/entities";
import {
  INSTRUCTION_COMPARISON_GUIDE_HREF,
  LOOP_ENGINEERING_GUIDE_HREF,
  MCP_SECURITY_GUIDE_HREF,
} from "../lib/guide-routes";
import {
  buildGuideItemListJsonLd,
  buildItemListJsonLd,
  buildOrganizationJsonLd,
  buildWebsiteJsonLd,
  SITE_NAME,
} from "../lib/seo";
import type { Article, Guide } from "../lib/types";

type HomeProps = {
  articles: Article[];
  guides: Guide[];
};

const highImpressionEntries = [
  {
    href: "/guides/agents-md-vs-claude-md-cursorrules-copilot-instructions",
    label: "CLAUDE.md vs Copilot Instructions support matrix",
    note: "Highest-impression guide: choose the right repo instruction file by tool surface.",
  },
  {
    href: "/guides/loop-engineering-ai-coding-agents",
    label: "Loop Engineering: Addy Osmani, examples, stop rules",
    note: "Zero-click page-one opportunity: learn the workflow, caps, and human checkpoints.",
  },
  {
    href: "/guides/agents-md-template-for-ai-coding-agents",
    label: "AGENTS.md template for Codex, Node.js, Python",
    note: "Copy practical repo instructions after choosing the right file.",
  },
  {
    href: "/articles/spacex-cursor-acquisition-2026",
    label: "SpaceX Cursor acquisition deal status and timeline",
    note: "Event page with deal status, Q3 2026 closing window, and developer impact.",
  },
  {
    href: "/guides/secure-mcp-servers-ai-coding-agents",
    label: "MCP server security checklist",
    note: "Move the security page toward top-20 queries with auth, permissions, logs, and revocation.",
  },
];

export default function Home({ articles, guides }: HomeProps) {
  const websiteJsonLd = buildWebsiteJsonLd();
  const organizationJsonLd = buildOrganizationJsonLd();
  const itemListJsonLd = buildItemListJsonLd(articles.slice(0, 12), "Latest AI coding agent articles", "/");
  const guideItemListJsonLd = buildGuideItemListJsonLd(guides, "AI coding agent playbooks", "/guides");
  const entities = getEntityCoverage(articles);
  const pageTitle = `${SITE_NAME} | AI coding agent guides and evidence watch`;
  const description =
    "Source-backed guides for CLAUDE.md vs Copilot Instructions, loop engineering, MCP security, Codex vs Claude Code, and AI coding agent setup.";

  return (
    <Layout>
      <SeoHead title={pageTitle} description={description} path="/">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(guideItemListJsonLd) }} />
      </SeoHead>
      <div className="page-shell">
        <section className="feed-panel" aria-labelledby="latest-heading">
          <div className="section-heading">
            <div>
              <h1 id="latest-heading">AI Coding Agent Playbooks</h1>
              <p>Source-backed guides for configuring, migrating, comparing, and securing AI coding agents.</p>
            </div>
            <Link href="/guides">All guides</Link>
          </div>
          <section className="guide-strip" aria-labelledby="priority-guides-heading">
            <div>
              <h2 id="priority-guides-heading">Practical playbooks</h2>
              <p>Start with the pages that already have Google impressions, then continue into setup and security.</p>
            </div>
            <div className="guide-strip-next-steps" aria-label="High-impression pages to read first">
              {highImpressionEntries.map((entry) => (
                <p key={entry.href}>
                  <Link href={entry.href}>{entry.label}</Link> {entry.note}
                </p>
              ))}
            </div>
            <div className="guide-strip-grid">
              {guides.map((guide) => (
                <Link href={`/guides/${guide.slug}`} key={guide.id}>
                  <strong>{guide.title}</strong>
                  <small>{guide.pageType}</small>
                </Link>
              ))}
            </div>
            <div className="guide-strip-next-steps" aria-label="Recommended guide starting points">
              <p>
                Standardizing repository guidance?{" "}
                <Link href={INSTRUCTION_COMPARISON_GUIDE_HREF}>
                  Compare instruction files by tool and surface
                </Link>{" "}
                before choosing the adapters your team will maintain.
              </p>
              <p>
                Connecting agents to external tools?{" "}
                <Link href={MCP_SECURITY_GUIDE_HREF}>Review the MCP security checklist</Link>{" "}
                before granting credentials, network access, or write permissions.
              </p>
              <p>
                Moving from one-shot prompts to repeatable workflows?{" "}
                <Link href={LOOP_ENGINEERING_GUIDE_HREF}>Design loop engineering for AI coding agents</Link>{" "}
                with stop rules, verification commands, and cost limits before scaling Automations or /loop schedules.
              </p>
            </div>
          </section>
          <div className="section-heading latest-evidence-heading">
            <div>
              <h2>Latest Evidence Updates</h2>
              <p>Official-source updates across Codex, Copilot, Claude Code, Cursor, Antigravity, and governance.</p>
            </div>
            <Link href="/sources">Source ledger</Link>
          </div>
          <ArticleExplorer articles={articles} />
          <section className="signal-table" aria-labelledby="signal-table-heading">
            <h2 id="signal-table-heading">Signal Table <span>Last 7 days</span></h2>
            <table aria-labelledby="signal-table-heading">
              <thead>
                <tr>
                  <th scope="col">Signal</th>
                  <th scope="col">Change</th>
                  <th scope="col">Direction</th>
                  <th scope="col">Confidence</th>
                  <th scope="col">Primary Source</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td data-label="Signal">Agent runtime releases</td>
                  <td data-label="Change">+7 official updates</td>
                  <td data-label="Direction">Up</td>
                  <td data-label="Confidence">High</td>
                  <td data-label="Primary Source">OpenAI, GitHub, Google</td>
                </tr>
                <tr>
                  <td data-label="Signal">Governance surface</td>
                  <td data-label="Change">+3 policy-control updates</td>
                  <td data-label="Direction">Up</td>
                  <td data-label="Confidence">High</td>
                  <td data-label="Primary Source">GitHub, Cursor</td>
                </tr>
                <tr>
                  <td data-label="Signal">Unverified story intake</td>
                  <td data-label="Change">0 auto-published</td>
                  <td data-label="Direction">Down</td>
                  <td data-label="Confidence">High</td>
                  <td data-label="Primary Source">Source guardrails</td>
                </tr>
              </tbody>
            </table>
          </section>
          <section className="entity-summary-panel" aria-labelledby="entity-summary-heading">
            <div>
              <h2 id="entity-summary-heading">Entity Coverage</h2>
              <p>Official brand and product entities are tracked with non-endorsement boundaries.</p>
            </div>
            <div>
              {entities.slice(0, 8).map((entity) => (
                <Link href={`/entities#${entity.slug}`} key={entity.id}>{entity.name}</Link>
              ))}
            </div>
            <Link href="/entities">View entity ledger</Link>
          </section>
        </section>
        <SignalPanel />
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const { getPriorityGuides } = await import("../lib/guide-editorial");

  return {
    props: {
      articles: await getArticles(),
      guides: getPriorityGuides(),
    },
    revalidate: 300,
  };
}
