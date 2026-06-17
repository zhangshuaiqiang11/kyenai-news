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
    title: "Repository Instructions",
    intro:
      "Start here when the team needs one reliable way to tell AI coding agents how a repository works. This cluster separates the policy question from the file-format question: AGENTS.md for Codex, CLAUDE.md for Claude Code, .github/copilot-instructions.md for Copilot, and Cursor rules for Cursor. Use it before adding more automation because stale setup commands, unclear ownership, and mismatched instruction files are a common reason agents make noisy diffs. The goal is a small shared policy with tool-specific adapters that are easy to review.",
    beginner: "AGENTS.md vs CLAUDE.md vs Copilot Instructions",
    advanced: "Does GitHub Copilot Read CLAUDE.md?",
    readingOrder: [
      {
        href: INSTRUCTION_COMPARISON_GUIDE_HREF,
        label: "AGENTS.md vs CLAUDE.md vs Copilot instructions",
        note: "Choose the right file before writing more rules.",
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
    title: "Agent Workflows",
    intro:
      "Use this path after repository instructions exist and the question becomes how agents should actually work. These guides cover the move from one prompt to controlled execution: chat mode versus agent mode, hooks for deterministic checks, subagents for delegated work, and loop engineering for repeated plan-act-observe-verify cycles. This is where teams define stop rules, verification commands, retry limits, and handoffs. It is also the cluster most likely to improve page usefulness because readers need practical operating patterns, not only definitions.",
    beginner: "Agent Mode vs Chat Mode",
    advanced: "Loop Engineering for AI Coding Agents",
    readingOrder: [
      {
        href: "/guides/agent-mode-vs-chat-mode-in-ide",
        label: "Agent mode vs chat mode in IDE",
        note: "Decide when the assistant should act instead of only answer.",
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
        href: LOOP_ENGINEERING_GUIDE_HREF,
        label: "Loop engineering for AI coding agents",
        note: "Design durable cycles with stop rules and verification.",
      },
    ],
  },
  {
    title: "MCP and Security",
    intro:
      "Use this cluster before giving an agent network access, credentials, production tools, or write permissions. MCP makes agents more useful, but it also expands the blast radius: prompt injection can steer tool calls, servers can expose risky actions, and weak logging makes incident review difficult. These pages focus on least privilege, authentication, audit logs, approval boundaries, revocation, and governance. The practical aim is boring security: a team should know which tools are allowed, who approved them, how actions are logged, and when access is revoked.",
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
    title: "Tool Comparisons",
    intro:
      "Use comparisons only after the task and risk boundary are clear. This cluster helps readers choose between agent surfaces, execution models, and migration paths without pretending one tool wins every situation. Codex versus Claude Code should be evaluated with the same repository task and measured review effort. Local versus cloud agents should be chosen by data sensitivity, latency, cost, and observability. Migration guides belong here when a tool switch changes commands, authentication, hooks, or team documentation.",
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
            <Link href={LOOP_ENGINEERING_GUIDE_HREF}>
              <strong>Design durable agent loops</strong>
              <span>Move from one-shot prompts to act-observe-reason cycles with verification commands, stop rules, and cost limits.</span>
            </Link>
          </div>
        </section>
        <section className="guide-topic-clusters" aria-labelledby="guide-topic-clusters-heading">
          <div>
            <h2 id="guide-topic-clusters-heading">Topic centers</h2>
            <p>Follow one center when you want Google and readers to understand the site architecture.</p>
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
  };
}
