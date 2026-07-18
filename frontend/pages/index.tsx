import Link from "next/link";

import { ArticleExplorer } from "../components/ArticleExplorer";
import { Layout } from "../components/Layout";
import { SeoHead } from "../components/SeoHead";
import { SignalPanel } from "../components/SignalPanel";
import { getArticles } from "../lib/api";
import { getEntityCoverage } from "../lib/entities";
import { toArticleSummary } from "../lib/catalog";
import { toGuideSummary } from "../lib/guide-summary";
import {
  CODEX_COPILOT_GUIDE_HREF,
  INSTRUCTION_ADOPTION_REPORT_HREF,
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
import type { ArticleSummary, GuideSummary } from "../lib/types";
import type { BrandEntity } from "../lib/entities";

type HomeProps = {
  articles: ArticleSummary[];
  guides: GuideSummary[];
  entities?: BrandEntity[];
};

const highImpressionEntries = [
  {
    href: "/tools/instruction-file-checker",
    label: "Audit AGENTS.md, CLAUDE.md, Copilot, or Cursor rules",
    note: "Run deterministic browser-only checks for setup, tests, scope, safety, and file-path compatibility.",
  },
  {
    href: INSTRUCTION_ADOPTION_REPORT_HREF,
    label: "AI instruction-file adoption report: 400 GitHub files",
    note: "Download the dated CSV/JSON and see which test, scope, verification, and security rules samples omit.",
  },
  {
    href: CODEX_COPILOT_GUIDE_HREF,
    label: "Codex vs GitHub Copilot: app, CLI, cloud and team fit",
    note: "Compare current agent surfaces with a six-question workflow decision tool.",
  },
  {
    href: "/guides/agents-md-vs-claude-md-cursorrules-copilot-instructions",
    label: "CLAUDE.md vs Copilot Instructions support matrix",
    note: "Choose the right repo instruction file by tool surface.",
  },
  {
    href: "/guides/loop-engineering-ai-coding-agents",
    label: "Loop Engineering: Addy Osmani, examples, stop rules",
    note: "Learn the workflow, caps, and human checkpoints before scaling agent work.",
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
    href: "/articles/cursor-enterprise-organizations-governance",
    label: "Cursor Enterprise security and Privacy Mode checklist",
    note: "Verify retention caveats, repo controls, MCP allowlists, and agent permissions.",
  },
  {
    href: "/guides/secure-mcp-servers-ai-coding-agents",
    label: "MCP server security checklist",
    note: "Secure MCP connections with authentication, permissions, logs, and revocation.",
  },
];

export default function Home({ articles, guides, entities = [] }: HomeProps) {
  const websiteJsonLd = buildWebsiteJsonLd();
  const organizationJsonLd = buildOrganizationJsonLd();
  const itemListJsonLd = buildItemListJsonLd(articles.slice(0, 12), "Latest AI coding agent articles", "/");
  const guideItemListJsonLd = buildGuideItemListJsonLd(guides, "AI coding agent playbooks", "/guides");
  const pageTitle = `${SITE_NAME} | AI Coding Agent Templates & Security Playbooks`;
  const description =
    "Configure, compare, and secure Codex, Claude Code, Copilot, Cursor, and MCP workflows with source-backed templates, checklists, and browser tools.";

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
              <h1 id="latest-heading">Evidence-Backed Templates and Security Playbooks for AI Coding Agents</h1>
              <p>Configure, compare, and secure Codex, Claude Code, Copilot, Cursor, and MCP workflows with copyable templates, source-backed compatibility guides, downloadable security controls, and browser-based audit tools.</p>
              <div className="home-hero-actions" aria-label="Start with a KyenAI resource">
                <Link href="/guides/agents-md-template-for-ai-coding-agents">Browse templates</Link>
                <Link href="/tools/instruction-file-checker">Run an instruction audit</Link>
                <Link href={MCP_SECURITY_GUIDE_HREF}>Review MCP security</Link>
              </div>
            </div>
            <Link href="/guides">All guides</Link>
          </div>
          <section className="guide-strip" aria-labelledby="priority-guides-heading">
            <div>
              <h2 id="priority-guides-heading">Practical playbooks</h2>
              <p>Start with the guide that matches the decision in front of your team, then continue into setup and security.</p>
            </div>
            <div className="guide-strip-next-steps" aria-label="Guides to read first">
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
  const fullArticles = await getArticles();

  return {
    props: {
      articles: fullArticles.map(toArticleSummary),
      guides: getPriorityGuides().map(toGuideSummary),
      entities: getEntityCoverage(fullArticles),
    },
    revalidate: 300,
  };
}
