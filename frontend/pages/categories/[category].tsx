import Link from "next/link";
import { GetStaticPaths, GetStaticProps } from "next";

import { ArticleCard } from "../../components/ArticleCard";
import { Layout } from "../../components/Layout";
import { SeoHead } from "../../components/SeoHead";
import { getArticles } from "../../lib/api";
import { buildBreadcrumbJsonLd, buildItemListJsonLd } from "../../lib/seo";
import type { Article } from "../../lib/types";

type CategoryPageProps = {
  category: string;
  articles: Article[];
};

export default function CategoryPage({ category, articles }: CategoryPageProps) {
  const categoryPath = `/categories/${encodeURIComponent(category)}`;
  const description = `Evidence-led ${category} news from official vendor sources. Each article is sourced, dated, and validated before it publishes on KyenAI.`;
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: category, path: categoryPath },
  ]);
  const itemListJsonLd = buildItemListJsonLd(articles, `${category} articles`, categoryPath);

  return (
    <Layout>
      <SeoHead title={category} description={description} path={categoryPath}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      </SeoHead>
      <section className="listing-page">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span>{category}</span>
        </nav>
        <h1>{category}</h1>
        <div className="article-list">
          {articles.map((article, index) => <ArticleCard article={article} index={index} key={article.id} />)}
        </div>
      </section>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const articles = await getArticles();
  const categories = Array.from(new Set(articles.map((article) => article.category)));
  return { paths: categories.map((category) => ({ params: { category } })), fallback: "blocking" };
};

export const getStaticProps: GetStaticProps<CategoryPageProps> = async ({ params }) => {
  const category = decodeURIComponent(String(params?.category || ""));
  const articles = (await getArticles()).filter((article) => article.category === category);
  if (articles.length === 0) {
    return { notFound: true };
  }
  return { props: { category, articles }, revalidate: 300 };
};
