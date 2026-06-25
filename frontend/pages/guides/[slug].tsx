import { GetStaticPaths, GetStaticProps } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";

import { Layout } from "../../components/Layout";
import { SeoHead } from "../../components/SeoHead";
import { getArticles } from "../../lib/api";
import { getGuide, getGuides, getInternalLinkedGuides, getRelatedArticlesForGuide } from "../../lib/guides";
import { EDITORIAL_AUTHOR_NAME, EDITORIAL_AUTHOR_PATH } from "../../lib/editorial";
import { resolveIndexableGuideTopicHref } from "../../lib/guide-topic-links";
import {
  buildBreadcrumbJsonLd,
  buildFaqPageJsonLd,
  buildGuideFaqs,
  buildGuideJsonLd,
  buildOgImageUrl,
  formatDate,
} from "../../lib/seo";
import type { Article, Guide } from "../../lib/types";

type GuidePageProps = {
  guide: Guide;
  relatedGuides: Guide[];
  relatedArticles: Article[];
};

const bestNextStepsByGuideSlug: Record<string, { href: string; label: string; note: string }> = {
  "agents-md-vs-claude-md-cursorrules-copilot-instructions": {
    href: "/guides/agents-md-template-for-ai-coding-agents",
    label: "Copy the AGENTS.md template for Codex, Node.js, Python, and monorepos",
    note: "After choosing the instruction-file surface, turn it into a repo policy the agent can follow.",
  },
  "agents-md-template-for-ai-coding-agents": {
    href: "/guides/agents-md-vs-claude-md-cursorrules-copilot-instructions",
    label: "Check the CLAUDE.md vs Copilot Instructions support matrix",
    note: "Use the template only after you know which file each coding tool actually reads.",
  },
  "loop-engineering-ai-coding-agents": {
    href: "/guides/agents-md-vs-claude-md-cursorrules-copilot-instructions",
    label: "Write loop stop rules into AGENTS.md, CLAUDE.md, or Copilot instructions",
    note: "Agent loops need repository instructions that name verification commands and human checkpoints.",
  },
  "codex-vs-claude-code": {
    href: "/guides/loop-engineering-ai-coding-agents",
    label: "Use loop engineering to compare Codex and Claude Code on the same repo task",
    note: "Measure behavior with a plan-act-observe-verify loop instead of generic feature lists.",
  },
  "secure-mcp-servers-ai-coding-agents": {
    href: "/guides/loop-engineering-ai-coding-agents",
    label: "Scope MCP tools before running unattended agent loops",
    note: "MCP access inside loops needs auth, permissions, logs, revocation, and stop rules.",
  },
};

export const loadInstructionResources = () =>
  import("../../components/InstructionGuideResources").then(
    ({ InstructionGuideResources }) => InstructionGuideResources,
  );

const InstructionResources = dynamic(
  () =>
    import("../../components/InstructionGuideResources").then(
      ({ InstructionGuideResources }) => InstructionGuideResources,
    ),
  { ssr: true },
);

export const loadAgentsMdTemplateResource = () =>
  import("../../components/AgentsMdTemplateResource").then(
    ({ AgentsMdTemplateResource }) => AgentsMdTemplateResource,
  );

const AgentsMdTemplateResources = dynamic(
  () =>
    import("../../components/AgentsMdTemplateResource").then(
      ({ AgentsMdTemplateResource }) => AgentsMdTemplateResource,
    ),
  { ssr: true },
);

export const loadClaudeCodeSetupResources = () =>
  import("../../components/ClaudeCodeSetupResources").then(
    ({ ClaudeCodeSetupResources }) => ClaudeCodeSetupResources,
  );

const ClaudeCodeSetupResourcePanel = dynamic(
  () =>
    import("../../components/ClaudeCodeSetupResources").then(
      ({ ClaudeCodeSetupResources }) => ClaudeCodeSetupResources,
    ),
  { ssr: true },
);

export const loadMcpSecurityResources = () =>
  import("../../components/McpSecurityControls").then(
    ({ McpSecurityControls }) => McpSecurityControls,
  );

const McpSecurityResources = dynamic(
  () =>
    import("../../components/McpSecurityControls").then(
      ({ McpSecurityControls }) => McpSecurityControls,
    ),
  { ssr: true },
);

export const loadLoopEngineeringResources = () =>
  import("../../components/LoopEngineeringResources").then(
    ({ LoopEngineeringResources }) => LoopEngineeringResources,
  );

const LoopEngineeringResourcePanel = dynamic(
  () =>
    import("../../components/LoopEngineeringResources").then(
      ({ LoopEngineeringResources }) => LoopEngineeringResources,
    ),
  { ssr: true },
);

function GuideResources({ guide }: { guide: Guide }) {
  if (guide.resourceIds?.includes("instruction-files")) {
    return <InstructionResources />;
  }

  if (guide.resourceIds?.includes("agents-md-template")) {
    return <AgentsMdTemplateResources />;
  }

  if (guide.resourceIds?.includes("claude-code-setup")) {
    return <ClaudeCodeSetupResourcePanel />;
  }

  if (guide.resourceIds?.includes("mcp-security")) {
    return <McpSecurityResources />;
  }

  if (guide.resourceIds?.includes("loop-engineering")) {
    return <LoopEngineeringResourcePanel />;
  }

  return null;
}

export default function GuidePage({ guide, relatedGuides, relatedArticles }: GuidePageProps) {
  const guidePath = `/guides/${guide.slug}`;
  const internalLinkCopy = new Map(guide.internalLinks.map((link) => [link.slug, link]));
  const isQuickAnswerSection = (heading: string) => heading.trim().toLowerCase() === "quick answer";
  const quickAnswer = guide.sections.find((section) => isQuickAnswerSection(section.heading))?.body[0] || guide.summary;
  const bodySections = guide.sections.filter((section) => !isQuickAnswerSection(section.heading));
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Guides", path: "/guides" },
    { name: guide.title, path: guidePath },
  ]);
  const guideJsonLd = buildGuideJsonLd(guide);
  const faqs = buildGuideFaqs(guide);
  const faqJsonLd = buildFaqPageJsonLd(faqs);
  const bestNextStep = bestNextStepsByGuideSlug[guide.slug];

  return (
    <Layout>
      <SeoHead
        title={guide.metaTitle}
        description={guide.metaDescription}
        path={guidePath}
        ogImage={buildOgImageUrl(guide.metaTitle || guide.title)}
      >
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(guideJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      </SeoHead>
      <article className="article-page guide-page">
        <div className="article-header">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/guides">Guides</Link>
          </nav>
          <div className="guide-meta-row">
            <span>{guide.pageType}</span>
            <span>Updated {formatDate(guide.updatedAt)}</span>
            <span>
              By <Link href={EDITORIAL_AUTHOR_PATH}>{EDITORIAL_AUTHOR_NAME}</Link>
            </span>
          </div>
          <h1>{guide.title}</h1>
          <p>{guide.summary}</p>
          <dl>
            <div>
              <dt>Best for</dt>
              <dd>{guide.audience}</dd>
            </div>
            <div>
              <dt>Use this guide to</dt>
              <dd>{guide.intent}</dd>
            </div>
          </dl>
        </div>
        <section className="answer-panel" aria-labelledby="guide-answer-heading">
          <h2 id="guide-answer-heading">Quick Answer</h2>
          <p>{quickAnswer}</p>
        </section>
        {bestNextStep ? (
          <section className="answer-panel" aria-labelledby="guide-best-next-step-heading">
            <h2 id="guide-best-next-step-heading">Best next step</h2>
            <p>
              <Link href={bestNextStep.href}>{bestNextStep.label}</Link>. {bestNextStep.note}
            </p>
          </section>
        ) : null}
        <GuideResources guide={guide} />
        <div className="article-content-grid">
          <div className="article-body">
            {bodySections.map((section) => (
              <section key={section.heading}>
                <h2>{section.heading}</h2>
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </section>
            ))}
            <section className="guide-play-section">
              <h2>Recommended play</h2>
              <ol className="guide-step-list">
                {guide.recommendedPlay.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            </section>
            <section className="guide-table-section" aria-labelledby="guide-decision-table-heading">
              <h2 id="guide-decision-table-heading">{guide.decisionTable.title}</h2>
              <p>{guide.decisionTable.intro}</p>
              <div className="guide-table-wrap">
                <table aria-labelledby="guide-decision-table-heading">
                  <thead>
                    <tr>
                      <th scope="col">Area</th>
                      {guide.decisionTable.columns.map((column) => (
                        <th key={column} scope="col">
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {guide.decisionTable.rows.map((row) => (
                      <tr key={row.label}>
                        <th scope="row" data-label="Area">
                          {row.label}
                        </th>
                        {row.values.map((value, index) => (
                          <td
                            key={`${row.label}-${guide.decisionTable.columns[index]}`}
                            data-label={guide.decisionTable.columns[index]}
                          >
                            {value}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
            <section>
              <h2>Execution steps</h2>
              <div className="guide-action-list">
                {guide.actionSteps.map((step, index) => (
                  <article key={step.title}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <h3>{step.title}</h3>
                    <p>{step.body}</p>
                  </article>
                ))}
              </div>
            </section>
            <section>
              <h2>Common pitfalls</h2>
              <div className="guide-pitfall-list">
                {guide.pitfalls.map((pitfall) => (
                  <article key={pitfall.title}>
                    <h3>{pitfall.title}</h3>
                    <p>{pitfall.fix}</p>
                  </article>
                ))}
              </div>
            </section>
            <section>
              <h2>Implementation checklist</h2>
              <ul className="guide-checklist">
                {guide.checklist.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
            <section className="article-faqs" aria-labelledby="guide-faq-heading">
              <h2 id="guide-faq-heading">Questions this guide answers</h2>
              {faqs.map((faq) => (
                <section className="faq-block" key={faq.question}>
                  <h3>{faq.question}</h3>
                  <p>{faq.answer}</p>
                </section>
              ))}
            </section>
          </div>
          <aside className="article-aside">
            <section>
              <h2>Related topics</h2>
              <div className="keyword-list">
                {guide.secondaryKeywords.map((keyword) => {
                  const href = resolveIndexableGuideTopicHref(keyword, guide.slug);
                  return href ? (
                    <Link href={href} key={keyword}>{keyword}</Link>
                  ) : (
                    <span key={keyword}>{keyword}</span>
                  );
                })}
              </div>
            </section>
            <section>
              <h2>Evidence sources</h2>
              <div className="guide-source-list">
                {guide.evidence.map((source) => (
                  <a href={source.url} key={source.url} rel="noreferrer" target="_blank">
                    <strong>{source.publisher}</strong>
                    <span>{source.title}</span>
                    <small>{source.note}</small>
                  </a>
                ))}
              </div>
            </section>
          </aside>
        </div>
        {relatedGuides.length > 0 ? (
          <section className="related-guides" aria-labelledby="guide-next-heading">
            <div className="section-heading">
              <div>
                <h2 id="guide-next-heading">Next guides</h2>
                <p>Continue with the setup, security, or workflow decision that follows this guide.</p>
              </div>
              <Link href="/guides">All guides</Link>
            </div>
            <div>
              {relatedGuides.map((relatedGuide) => {
                const linkCopy = internalLinkCopy.get(relatedGuide.slug);

                return (
                  <article key={relatedGuide.id}>
                    <span>{relatedGuide.pageType}</span>
                    <h3>
                      <Link href={`/guides/${relatedGuide.slug}`}>{linkCopy?.anchor || relatedGuide.title}</Link>
                    </h3>
                    <p>{linkCopy?.reason || relatedGuide.summary}</p>
                  </article>
                );
              })}
            </div>
          </section>
        ) : null}
        {relatedArticles.length > 0 ? (
          <section className="related-articles" aria-labelledby="guide-related-heading">
            <h2 id="guide-related-heading">Related evidence updates</h2>
            <div>
              {relatedArticles.map((article) => (
                <article key={article.id}>
                  <span>{article.category}</span>
                  <h3>
                    <Link href={`/articles/${article.slug}`}>{article.title}</Link>
                  </h3>
                  <p>{article.summary}</p>
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </article>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: getGuides().map((guide) => ({ params: { slug: guide.slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<GuidePageProps> = async ({ params }) => {
  const guide = getGuide(String(params?.slug || ""));
  if (!guide) {
    return { notFound: true };
  }
  return {
    props: {
      guide,
      relatedGuides: getInternalLinkedGuides(guide),
      relatedArticles: getRelatedArticlesForGuide(guide, await getArticles()),
    },
  };
};
