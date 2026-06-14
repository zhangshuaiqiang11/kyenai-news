import Link from "next/link";
import { GetStaticPaths, GetStaticProps } from "next";

import { ArticleCard } from "../../components/ArticleCard";
import { Layout } from "../../components/Layout";
import { SeoHead } from "../../components/SeoHead";
import { getArticles } from "../../lib/api";
import { buildBreadcrumbJsonLd, buildItemListJsonLd, slugify } from "../../lib/seo";
import type { Article } from "../../lib/types";

type TagPageProps = {
  tag: string;
  tagSlug: string;
  articles: Article[];
};

export default function TagPage({ tag, tagSlug, articles }: TagPageProps) {
  const tagPath = `/tags/${tagSlug}`;
  const description = `All KyenAI articles tagged '${tag}'. Sourced from official vendor changelogs, technical documentation, and authoritative product announcements.`;
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: tag, path: tagPath },
  ]);
  const itemListJsonLd = buildItemListJsonLd(articles, `${tag} articles`, tagPath);

  return (
    <Layout>
      <SeoHead title={tag} description={description} path={tagPath} robots="noindex,follow">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      </SeoHead>
      <section className="listing-page">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span>{tag}</span>
        </nav>
        <h1>{tag}</h1>
        <div className="article-list">
          {articles.map((article, index) => <ArticleCard article={article} index={index} key={article.id} />)}
        </div>
      </section>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const articles = await getArticles();
  const tags = Array.from(new Set(articles.flatMap((article) => article.tags.concat(article.keywords)).map(slugify)));
  return { paths: tags.map((tag) => ({ params: { tag } })), fallback: "blocking" };
};

export const getStaticProps: GetStaticProps<TagPageProps> = async ({ params }) => {
  const tagSlug = String(params?.tag || "");
  const allArticles = await getArticles();
  const articles = allArticles.filter((article) =>
    article.tags.concat(article.keywords).some((tag) => slugify(tag) === tagSlug)
  );
  if (articles.length === 0) {
    return { notFound: true };
  }
  const tag =
    allArticles
      .flatMap((article) => article.tags.concat(article.keywords))
      .find((candidate) => slugify(candidate) === tagSlug) || tagSlug;
  return { props: { tag, tagSlug, articles }, revalidate: 300 };
};
