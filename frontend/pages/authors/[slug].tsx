import Link from "next/link";
import { GetStaticPaths, GetStaticProps } from "next";

import { ArticleCard } from "../../components/ArticleCard";
import { Layout } from "../../components/Layout";
import { SeoHead } from "../../components/SeoHead";
import { getArticles } from "../../lib/api";
import { buildAuthorJsonLd, buildBreadcrumbJsonLd } from "../../lib/seo";
import type { Article } from "../../lib/types";

type AuthorPageProps = {
  articles: Article[];
};

export default function AuthorPage({ articles }: AuthorPageProps) {
  const description =
    "The Editorial Automation Desk at KyenAI covers official AI coding releases. Articles are sourced, validated, and updated only when better evidence is available.";
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Editorial Automation Desk", path: "/authors/editorial-automation-desk" },
  ]);
  const authorJsonLd = buildAuthorJsonLd("Editorial Automation Desk");

  return (
    <Layout>
      <SeoHead title="Editorial Automation Desk" description={description} path="/authors/editorial-automation-desk">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(authorJsonLd) }} />
      </SeoHead>
      <section className="listing-page author-profile">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span>Editorial Automation Desk</span>
        </nav>
        <h1>Editorial Automation Desk</h1>
        <p>
          Content is maintained by a documented editorial workflow that uses trusted sources,
          search performance data, validation checks, and rollback logs.
        </p>
        <div className="article-list">
          {articles.map((article, index) => <ArticleCard article={article} index={index} key={article.id} />)}
        </div>
      </section>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [{ params: { slug: "editorial-automation-desk" } }],
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<AuthorPageProps> = async () => {
  const articles = await getArticles();
  const authorArticles = articles.filter(
    (article) => article.status === "published" && article.authorName === "Editorial Automation Desk"
  );
  return { props: { articles: authorArticles }, revalidate: 300 };
};
