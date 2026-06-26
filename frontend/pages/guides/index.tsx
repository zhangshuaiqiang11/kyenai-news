import Link from "next/link";

import { Layout } from "../../components/Layout";
import { SeoHead } from "../../components/SeoHead";
import {
  INSTRUCTION_COMPARISON_GUIDE_HREF,
  LOOP_ENGINEERING_GUIDE_HREF,
  MCP_SECURITY_GUIDE_HREF,
} from "../../lib/guide-routes";
import { getGuides } from "../../lib/guides";
import { buildBreadcrumbJsonLd, buildGuideItemListJsonLd } from "../../lib/seo";
import type { Guide } from "../../lib/types";

type GuidesPageProps = {
  guides: Guide[];
};

type GuideTopicHub = {
  title: string;
  intro: string;
  beginner: string;
  advanced: string;
  readingOrder: Array<{
    href: string;
    label: string;
    note: string;
  }>;
};

const guideTopicHubs: GuideTopicHub[] = [
  {
    title: "Instruction File Opportunity",
    intro:
      "This is the strongest current CTR cluster: the main instruction-file guide already receives impressions and clicks for CLAUDE.md, Copilot instructions, and AGENTS.md queries. Start with the support matrix, then move to templates and examples only after the reader knows which file each tool actually reads. The goal is to make the result promise concrete: compare files, choose the supported surface, then copy the right adapter.",
    beginner: "CLAUDE.md vs Copilot Instructions vs AGENTS.md",
    advanced: "AGENTS.md Examples for Codex",
    readingOrder: [
      {
        href: INSTRUCTION_COMPARISON_GUIDE_HREF,
        label: "CLAUDE.md vs Copilot Instructions support matrix",
        note: "Answer the exact comparison query before asking readers to write more rules.",
      },
      {
        href: "/guides/agents-md-template-for-ai-coding-agents",
        label: "AGENTS.md template for coding agents",
        note: "Turn the decision into a concise repo policy.",
      },
      {
        href: "/guides/agents-md-examples-codex-node-python-monorepos",
        label: "AGENTS.md examples for Node.js, Python, and monorepos",
        note: "Adapt the template to real repo shapes.",
      },
      {
        href: "/guides/does-github-copilot-read-claude-md-support-matrix",
        label: "Does GitHub Copilot read CLAUDE.md?",
        note: "Resolve the Copilot-specific support question by surface.",
      },
    ],
  },
  {
    title: "Loop Engineering Opportunity",
    intro:
      "Loop Engineering is the clearest zero-click near-page-one CTR opportunity. Readers are not only asking for a definition; they need Addy Osmani context, examples, stop rules, token and cost limits, and verification commands. This hub routes them from the high-impression what-is page into subagents, hooks, agent mode, and cloud execution so the result promises an operating system, not a one-off glossary entry.",
    beginner: "Loop Engineering for AI Coding Agents",
    advanced: "Claude Code Subagents Workflow Examples",
    readingOrder: [
      {
        href: LOOP_ENGINEERING_GUIDE_HREF,
        label: "What is loop engineering?",
        note: "Start with Addy Osmani context, coding-agent examples, stop rules, and token caps.",
      },
      {
        href: "/guides/claude-code-hooks-mcp-setup",
        label: "Claude Code hooks and MCP setup",
        note: "Add deterministic checks and tool access safely.",
      },
      {
        href: "/guides/claude-code-subagents-examples",
        label: "Claude Code subagents workflow examples",
        note: "Split research, editing, and review into bounded roles.",
      },
      {
        href: "/guides/agent-mode-vs-chat-mode-in-ide",
        label: "Agent mode vs chat mode in IDE",
        note: "Decide when the assistant should act instead of only answer.",
      },
    ],
  },
  {
    title: "MCP and Security Opportunity",
    intro:
      "MCP security and Cursor enterprise security queries are still lower-ranking, but they are commercially valuable and close to KyenAI's core authority. This hub makes the search-result promise concrete: authentication, permissions, secrets, network limits, audit logs, approvals, and revocation. It should help Secure MCP move from broad security wording toward a page that answers specific operational questions.",
    beginner: "AI Coding Agent Governance Checklist",
    advanced: "Secure MCP Servers for AI Coding Agents",
    readingOrder: [
      {
        href: MCP_SECURITY_GUIDE_HREF,
        label: "Secure MCP servers for AI coding agents",
        note: "Threat-model MCP access, credentials, logs, and revocation.",
      },
      {
        href: "/guides/agent-governance-checklist-for-software-teams",
        label: "AI coding agent governance checklist",
        note: "Define permissions, approvals, audit logs, and owner review.",
      },
    ],
  },
  {
    title: "Comparison and Event Opportunity",
    intro:
      "Comparison and event pages can win clicks only when the search result promises a concrete answer. Codex vs Claude Code needs workflow fit, public examples, and a same-repo checklist rather than generic pros and cons. SpaceX/Cursor event traffic needs deal status, timeline, and developer impact. This hub keeps comparison pages connected to durable guides so short-lived impressions do not become isolated zero-click pages.",
    beginner: "Local vs Cloud AI Coding Agents",
    advanced: "Codex vs Claude Code",
    readingOrder: [
      {
        href: "/guides/local-vs-cloud-ai-coding-agent",
        label: "Local vs cloud AI coding agent",
        note: "Choose an execution model by security, cost, and speed.",
      },
      {
        href: "/guides/codex-vs-claude-code",
        label: "Codex vs Claude Code",
        note: "Compare workflows with a controlled same-task protocol.",
      },
      {
        href: "/guides/antigravity-cli-gemini-cli-migration",
        label: "Antigravity CLI migration from Gemini CLI",
        note: "Handle tool migration as commands, auth, and docs change.",
      },
    ],
  },
];

const highImpressionPages = [
  {
    href: INSTRUCTION_COMPARISON_GUIDE_HREF,
    label: "CLAUDE.md vs Copilot Instructions support matrix",
    note: "379 impressions, 7 clicks, average position around 9.6; keep the exact comparison query at the front of the result.",
  },
  {
    href: LOOP_ENGINEERING_GUIDE_HREF,
    label: "What is loop engineering? Addy Osmani examples and stop rules",
    note: "351 impressions, 0 clicks, average position around 9.5; lead with the definition and concrete loop controls.",
  },
  {
    href: "/articles/spacex-cursor-acquisition-2026",
    label: "SpaceX Cursor acquisition",
    note: "95 impressions, 0 clicks, average position around 9.5; event traffic needs status and timeline clarity.",
  },
  {
    href: "/guides/agents-md-template-for-ai-coding-agents",
    label: "AGENTS.md template: copyable Codex examples",
    note: "61 impressions, 0 clicks, average position around 14; support the comparison page with copyable intent.",
  },
];

const comparisonPages = [
  {
    href: INSTRUCTION_COMPARISON_GUIDE_HREF,
    label: "AGENTS.md vs CLAUDE.md vs Copilot Instructions",
    type: "Support matrix",
    verdict:
      "Use this when the question is which repository instruction file each AI coding surface actually reads.",
  },
  {
    href: "/guides/codex-vs-claude-code",
    label: "Codex vs Claude Code",
    type: "Workflow comparison",
    verdict:
      "Use this when the question is whether OpenAI-native collaboration or terminal-local agent work fits the team better.",
  },
  {
    href: "/guides/local-vs-cloud-ai-coding-agent",
    label: "Local vs Cloud AI Coding Agents",
    type: "Execution model comparison",
    verdict:
      "Use this when the decision turns on security boundaries, cost visibility, speed, and where agent work should run.",
  },
  {
    href: "/guides/agent-mode-vs-chat-mode-in-ide",
    label: "Agent Mode vs Chat Mode",
    type: "Mode decision matrix",
    verdict:
      "Use this when the question is whether the assistant should only answer or make repository changes.",
  },
  {
    href: "/guides/claude-code-hooks-mcp-setup",
    label: "Claude Code Hooks vs MCP",
    type: "Automation control map",
    verdict:
      "Use this when comparing deterministic hooks, reusable skills, external MCP tools, and manual review gates.",
  },
  {
    href: "/guides/does-github-copilot-read-claude-md-support-matrix",
    label: "Does GitHub Copilot Read CLAUDE.md?",
    type: "Surface support matrix",
    verdict:
      "Use this when the question is specifically Copilot surface support for CLAUDE.md versus Copilot instructions.",
  },
];

const guideCitationOverview =
  "KyenAI guides help software teams decide how to use AI coding agents without relying on vague tool claims. Start with the AGENTS.md, CLAUDE.md, Copilot, and Cursor instruction-file comparison when the problem is repository guidance. Use the loop engineering guide when the problem is repeated agent work, verification commands, retry limits, and stop rules. Use the MCP security and governance guides when the problem is tool access, secrets, logs, approvals, or revocation. Use the comparison hub when the query asks for Codex vs Claude Code, local vs cloud agents, agent mode vs chat mode, or hooks vs MCP. Each guide exposes sources, update dates, decision tables, checklists, and related next steps so AI answer engines can cite a stable page instead of stitching together disconnected vendor docs. The index is a routing page for durable decisions, not a generic blog archive.";

export const guidesPageSeo = {
  title: "AI Coding Agent Guides: AGENTS.md, Loop Engineering, MCP",
  description:
    "Find KyenAI guides for AGENTS.md vs CLAUDE.md, Copilot instructions, AGENTS.md templates, loop engineering, MCP security, and Codex vs Claude Code.",
} as const;

export default function GuidesPage({ guides }: GuidesPageProps) {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Guides", path: "/guides" },
  ]);
  const itemListJsonLd = buildGuideItemListJsonLd(guides, "AI coding agent guides", "/guides");

  return (
    <Layout>
      <SeoHead
        title={guidesPageSeo.title}
        description={guidesPageSeo.description}
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
        <h1>AI Coding Agent Guides for AGENTS.md, Loop Engineering, and MCP</h1>
        <p>
          Source-backed playbooks for choosing repository instruction files, understanding loop engineering, comparing
          Codex and Claude Code, and securing MCP access.
        </p>
        <section className="answer-panel citation-panel" aria-labelledby="guides-citation-heading">
          <h2 id="guides-citation-heading">AI citation summary</h2>
          <p>{guideCitationOverview}</p>
        </section>
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
            <Link href={LOOP_ENGINEERING_GUIDE_HREF}>
              <strong>Design durable agent loops: what is loop engineering?</strong>
              <span>Move from one-shot prompts to act-observe-reason cycles with verification commands, stop rules, and cost limits.</span>
            </Link>
          </div>
        </section>
        <section className="featured-guide-paths" aria-labelledby="high-impression-pages-heading">
          <div>
            <h2 id="high-impression-pages-heading">High-impression pages to read first</h2>
            <p>These pages already have Google visibility, so they receive the strongest internal links.</p>
          </div>
          <div className="featured-guide-path-grid">
            {highImpressionPages.map((page) => (
              <Link href={page.href} key={page.href}>
                <strong>{page.label}</strong>
                <span>{page.note}</span>
              </Link>
            ))}
          </div>
        </section>
        <section className="featured-guide-paths" aria-labelledby="comparison-pages-heading">
          <div>
            <h2 id="comparison-pages-heading">Comparison pages</h2>
            <p>Use these matrix-style guides when the query asks for a choice, alternative, or support verdict.</p>
          </div>
          <div className="comparison-page-grid">
            {comparisonPages.map((page) => (
              <Link href={page.href} key={page.href}>
                <span>{page.type}</span>
                <strong>{page.label}</strong>
                <small>{page.verdict}</small>
              </Link>
            ))}
          </div>
        </section>
        <section className="guide-topic-clusters" aria-labelledby="guide-topic-clusters-heading">
          <div>
            <h2 id="guide-topic-clusters-heading">GSC Opportunity Hubs</h2>
            <p>Follow one hub when you want readers and Google to see which page owns each active query cluster.</p>
          </div>
          <div className="guide-topic-cluster-grid">
            {guideTopicHubs.map((hub) => (
              <article className="guide-topic-cluster-card" key={hub.title}>
                <h3>{hub.title}</h3>
                <p>{hub.intro}</p>
                <div className="guide-topic-entry-points">
                  <span>
                    <strong>Beginner entry:</strong> {hub.beginner}
                  </span>
                  <span>
                    <strong>Advanced page:</strong> {hub.advanced}
                  </span>
                </div>
                <div className="guide-topic-reading-order">
                  <strong>Recommended reading order</strong>
                  <ol>
                    {hub.readingOrder.map((item) => (
                      <li key={item.href}>
                        <Link href={item.href}>{item.label}</Link>
                        <span>{item.note}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </article>
            ))}
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
    revalidate: 300,
  };
}
