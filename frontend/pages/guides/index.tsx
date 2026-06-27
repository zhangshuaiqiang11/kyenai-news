import Link from "next/link";

import { Layout } from "../../components/Layout";
import { SeoHead } from "../../components/SeoHead";
import {
  INSTRUCTION_COMPARISON_GUIDE_HREF,
  LOOP_ENGINEERING_GUIDE_HREF,
  MCP_SECURITY_GUIDE_HREF,
} from "../../lib/guide-routes";
import { getGuides } from "../../lib/guides";
import { buildBreadcrumbJsonLd, buildCollectionPageJsonLd, buildGuideItemListJsonLd } from "../../lib/seo";
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
    title: "Instruction files",
    intro:
      "Start here when your team needs one clear policy for AGENTS.md, CLAUDE.md, Copilot instructions, and Cursor rules. The support matrix explains which file each tool surface reads, then the template and examples turn that decision into repo-ready guidance.",
    beginner: "CLAUDE.md vs Copilot Instructions vs AGENTS.md",
    advanced: "AGENTS.md Examples for Codex",
    readingOrder: [
      {
        href: INSTRUCTION_COMPARISON_GUIDE_HREF,
        label: "CLAUDE.md vs Copilot Instructions support matrix",
        note: "Decide which instruction file belongs to each tool before writing more rules.",
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
    title: "Agent loops",
    intro:
      "Use this track when a one-shot prompt is no longer enough. The loop engineering guide defines the operating loop, then related guides show how subagents, hooks, agent mode, and cloud execution fit into a controlled workflow.",
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
    title: "MCP and security",
    intro:
      "Use this track before giving an AI coding agent access to tools, credentials, repositories, or production-adjacent systems. Start with MCP security, then connect it to governance rules for permissions, approvals, logs, and revocation.",
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
    title: "Comparisons and migrations",
    intro:
      "Use this track when the team needs to choose a tool, execution model, or migration path. The comparison guides focus on workflow fit, security boundaries, review effort, and same-repo evaluation rather than generic pros and cons.",
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

const startingGuides = [
  {
    href: INSTRUCTION_COMPARISON_GUIDE_HREF,
    label: "CLAUDE.md vs Copilot Instructions support matrix",
    note: "Use this when the team is deciding where shared repository instructions should live.",
  },
  {
    href: LOOP_ENGINEERING_GUIDE_HREF,
    label: "What is loop engineering? Addy Osmani examples and stop rules",
    note: "Use this when agents need verification commands, retry limits, stop rules, and human checkpoints.",
  },
  {
    href: "/articles/spacex-cursor-acquisition-2026",
    label: "SpaceX Cursor acquisition",
    note: "Use this when you need deal status, timeline, and developer-tool impact in one place.",
  },
  {
    href: "/guides/agents-md-template-for-ai-coding-agents",
    label: "AGENTS.md template: copyable Codex examples",
    note: "Use this after choosing AGENTS.md and before writing repo-specific agent instructions.",
  },
];

const comparisonPages = [
  {
    href: INSTRUCTION_COMPARISON_GUIDE_HREF,
    label: "AGENTS.md vs CLAUDE.md vs Copilot Instructions",
    type: "Support matrix",
    verdict:
      "Use this when the team needs to know which repository instruction file each AI coding surface actually reads.",
  },
  {
    href: "/guides/codex-vs-claude-code",
    label: "Codex vs Claude Code",
    type: "Workflow comparison",
    verdict:
      "Use this when the team is choosing between OpenAI-native collaboration and terminal-local agent work.",
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
      "Use this when the team needs the Copilot surface support answer for CLAUDE.md versus Copilot instructions.",
  },
];

const guideOverview =
  "KyenAI guides help software teams make practical decisions about AI coding agents. Start with the instruction-file support matrix when the problem is repository guidance. Use the loop engineering guide when agent work needs verification commands, retry limits, and stop rules. Use the MCP security and governance guides before adding tool access, secrets, logs, approvals, or revocation. Use the comparison guides when the team is choosing between Codex and Claude Code, local and cloud agents, agent mode and chat mode, or hooks and MCP. Each guide gives the answer first, then adds source notes, decision tables, checklists, and next steps for implementation.";

export const guidesPageSeo = {
  title: "AI Coding Agent Decision Guides: AGENTS.md, Codex, MCP",
  description:
    "Choose instruction files, compare Codex and Claude Code, design agent loops, and secure MCP access with decision matrices and launch checklists.",
} as const;

export default function GuidesPage({ guides }: GuidesPageProps) {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Guides", path: "/guides" },
  ]);
  const itemListJsonLd = buildGuideItemListJsonLd(guides, "AI coding agent guides", "/guides");
  const collectionPageJsonLd = buildCollectionPageJsonLd({
    title: guidesPageSeo.title,
    description: guidesPageSeo.description,
    path: "/guides",
  });

  return (
    <Layout>
      <SeoHead
        title={guidesPageSeo.title}
        description={guidesPageSeo.description}
        path="/guides"
      >
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageJsonLd) }} />
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
          Use these guides to choose repository instruction files, compare Codex and Claude Code, design repeatable
          agent loops, and secure MCP access before giving agents more autonomy.
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
            <Link href="/guides/codex-vs-claude-code">
              <strong>Compare Codex and Claude Code</strong>
              <span>Choose by repo workflow, instruction files, review effort, and a same-task test protocol.</span>
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
        <section className="answer-panel citation-panel" aria-labelledby="guides-overview-heading">
          <h2 id="guides-overview-heading">Guide overview</h2>
          <p>{guideOverview}</p>
        </section>
        <section className="featured-guide-paths" aria-labelledby="starting-guides-heading">
          <div>
            <h2 id="starting-guides-heading">Start with these guides</h2>
            <p>These entries answer the most common setup, workflow, and security decisions.</p>
          </div>
          <div className="featured-guide-path-grid">
            {startingGuides.map((page) => (
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
            <p>Use these matrix-style guides when the team needs a choice, alternative, or support verdict.</p>
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
            <h2 id="guide-topic-clusters-heading">Guide tracks</h2>
            <p>Follow one track when you want a focused reading path from first decision to implementation details.</p>
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
