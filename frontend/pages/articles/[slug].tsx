import { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";

import { Layout } from "../../components/Layout";
import { SeoHead } from "../../components/SeoHead";
import { SourceList } from "../../components/SourceList";
import { getArticle, getArticles } from "../../lib/api";
import { getVisibleArticleFaqs } from "../../lib/article-faqs";
import { getRelatedGuidesForArticle } from "../../lib/article-guide-links";
import { buildCategoryPath } from "../../lib/categories";
import { getArticleEntities } from "../../lib/entities";
import { resolveIndexableGuideTopicHref } from "../../lib/guide-topic-links";
import { getPublishedArticles, isPublishedArticle } from "../../lib/publication";
import {
  buildArticleGraphJsonLd,
  buildMetaDescription,
  formatDate,
  slugify,
} from "../../lib/seo";
import { EDITORIAL_AUTHOR_PATH } from "../../lib/editorial";
import type { Article, ArticleBlock, Guide } from "../../lib/types";

type ArticlePageProps = {
  article: Article;
  relatedArticles: Article[];
  relatedGuides: Guide[];
};

export default function ArticlePage({ article, relatedArticles, relatedGuides }: ArticlePageProps) {
  const metaDescription = buildMetaDescription(article);
  const categoryPath = buildCategoryPath(article.category);
  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: article.category, path: categoryPath },
    { name: article.title, path: `/articles/${article.slug}` },
  ];
  const primarySource = article.sources[0];
  const faqs = getVisibleArticleFaqs(article);
  const articleGraphJsonLd = buildArticleGraphJsonLd(article, breadcrumbItems, faqs);
  const entities = getArticleEntities(article);

  return (
    <Layout>
      <SeoHead title={article.metaTitle || article.title} description={metaDescription} path={`/articles/${article.slug}`} type="article">
        <meta property="article:published_time" content={article.publishedAt} />
        <meta property="article:modified_time" content={article.updatedAt} />
        <meta property="article:section" content={article.category} />
        {article.tags.slice(0, 5).map((tag) => (
          <meta property="article:tag" content={tag} key={tag} />
        ))}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleGraphJsonLd) }} />
      </SeoHead>
      <article className="article-page">
        <div className="article-header">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href={categoryPath}>{article.category}</Link>
          </nav>
          <h1>{article.title}</h1>
          <p>{article.summary}</p>
          <dl>
            <div><dt>Published</dt><dd>{formatDate(article.publishedAt)}</dd></div>
            <div><dt>Updated</dt><dd>{formatDate(article.updatedAt)}</dd></div>
            <div><dt>Author</dt><dd><Link href={EDITORIAL_AUTHOR_PATH}>{article.authorName}</Link></dd></div>
            <div><dt>Version</dt><dd>{article.version}</dd></div>
          </dl>
        </div>
        <section className="answer-panel" aria-labelledby="quick-answer-heading">
          <h2 id="quick-answer-heading">Quick Answer</h2>
          <p>{article.summary}</p>
          <dl>
            <div><dt>Topic</dt><dd>{article.category}</dd></div>
            <div><dt>Primary Source</dt><dd>{primarySource ? primarySource.publisher : "Source listed below"}</dd></div>
            <div><dt>Source Date</dt><dd>{primarySource ? formatDate(primarySource.publishedAt) : "Not available"}</dd></div>
          </dl>
        </section>
        <div className="article-content-grid">
          <div className="article-body">
            {article.blocks.map((block) => <ArticleBlockView block={block} key={block.id} />)}
            <section className="article-faqs" aria-labelledby="article-faq-heading">
              <h2 id="article-faq-heading">Questions This Update Answers</h2>
              {faqs.map((faq) => (
                <section className="faq-block" key={faq.question}>
                  <h3>{faq.question}</h3><p>{faq.answer}</p>
                </section>
              ))}
            </section>
          </div>
          <aside className="article-aside">
            <section>
              <h2>Optimization Guardrails</h2>
              <p>Updates publish only when evidence, style, duplicate-content, and freshness checks pass.</p>
            </section>
            <section>
              <h2>Topics</h2>
              <div className="keyword-list">
                {article.keywords.map((keyword) => {
                  const href = resolveIndexableGuideTopicHref(keyword);
                  return href ? <Link href={href} key={keyword}>{keyword}</Link> : <span key={keyword}>{keyword}</span>;
                })}
              </div>
            </section>
            <section>
              <h2>Evidence sources</h2>
              <div className="guide-source-list">
                {article.sources.map((source) => (
                  <a href={source.url} key={source.id} rel="noreferrer" target="_blank">
                    <strong>{source.publisher}</strong>
                    <span>{source.title}</span>
                    <small>Published {formatDate(source.publishedAt)}</small>
                  </a>
                ))}
              </div>
            </section>
            {entities.length > 0 ? (
              <section>
                <h2>Mentioned Entities</h2>
                <div className="entity-chip-list">
                  {entities.map((entity) => (
                    <a href={entity.officialUrl} key={entity.id} rel="noreferrer" target="_blank">
                      <span>{entity.name}</span><small>{entity.kind === "Organization" ? "Organization" : "Product"}</small>
                    </a>
                  ))}
                </div>
                <p className="entity-disclosure">Factual context only; no endorsement or partnership implied.</p>
              </section>
            ) : null}
          </aside>
        </div>
        {relatedGuides.length > 0 ? (
          <section className="related-guides" aria-labelledby="related-guides-heading">
            <div className="section-heading">
              <div><h2 id="related-guides-heading">Practical Guides</h2><p>Use these evergreen playbooks to apply, migrate, or secure the update covered above.</p></div>
              <Link href="/guides">All guides</Link>
            </div>
            <div>
              {relatedGuides.map((guide) => (
                <article key={guide.id}>
                  <span>{guide.pageType}</span>
                  <h3><Link href={`/guides/${guide.slug}`}>{guide.title}</Link></h3>
                  <p>{guide.summary}</p>
                </article>
              ))}
            </div>
          </section>
        ) : null}
        {relatedArticles.length > 0 ? (
          <section className="related-articles" aria-labelledby="related-articles-heading">
            <h2 id="related-articles-heading">Related Coverage</h2>
            <div>
              {relatedArticles.map((related) => (
                <article key={related.id}>
                  <span>{related.category}</span>
                  <h3><Link href={`/articles/${related.slug}`}>{related.title}</Link></h3>
                  <p>{related.summary}</p>
                </article>
              ))}
            </div>
          </section>
        ) : null}
        <SourceList sources={article.sources} />
      </article>
    </Layout>
  );
}

function ArticleBlockView({ block }: { block: ArticleBlock }) {
  if (block.type === "faq") return null;
  if (block.type === "fact_table") {
    const [header, ...rows] = block.content.split("\n").map((row) => row.split("|").map((cell) => cell.trim()));
    return (
      <table className="fact-table">
        <thead><tr>{header.map((cell) => <th key={cell} scope="col">{cell}</th>)}</tr></thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.join("-")}>
              {row.map((cell, index) => index === 0 ? (
                <th key={`${row.join("-")}-${header[index]}`} scope="row" data-label={header[index]}>{cell}</th>
              ) : (
                <td key={`${row.join("-")}-${header[index]}`} data-label={header[index]}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
  if (block.type === "source_note") return <p className="source-note-block">{block.content}</p>;
  if (block.type === "heading") return <h2>{block.content}</h2>;
  return <p>{block.content}</p>;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const articles = getPublishedArticles(await getArticles());
  return { paths: articles.map((article) => ({ params: { slug: article.slug } })), fallback: "blocking" };
};

export const getStaticProps: GetStaticProps<ArticlePageProps> = async ({ params }) => {
  const slug = String(params?.slug || "");
  const article = await getArticle(slug);
  if (!article || !isPublishedArticle(article)) return { notFound: true };
  const articles = getPublishedArticles(await getArticles());
  return {
    props: {
      article,
      relatedArticles: getRelatedArticles(article, articles),
      relatedGuides: getRelatedGuidesForArticle(article),
    },
    revalidate: 300,
  };
};

function getRelatedArticles(article: Article, articles: Article[]): Article[] {
  const articleTags = new Set(article.tags.concat(article.keywords).map(slugify));
  return articles
    .filter((candidate) => candidate.id !== article.id)
    .map((candidate) => ({
      article: candidate,
      score: (candidate.category === article.category ? 4 : 0) +
        candidate.tags.concat(candidate.keywords).filter((tag) => articleTags.has(slugify(tag))).length,
    }))
    .filter((candidate) => candidate.score > 0)
    .sort((a, b) => b.score - a.score || new Date(b.article.updatedAt).getTime() - new Date(a.article.updatedAt).getTime())
    .slice(0, 3)
    .map((candidate) => candidate.article);
}
