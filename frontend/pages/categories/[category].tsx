import Link from "next/link";
import { GetStaticPaths, GetStaticProps } from "next";

import { ArticleCard } from "../../components/ArticleCard";
import { Layout } from "../../components/Layout";
import { SeoHead } from "../../components/SeoHead";
import { getArticles } from "../../lib/api";
import { getCategoryGuides, getCategoryHub, shouldIndexCategoryHub } from "../../lib/category-hubs";
import { buildCategoryPath, buildCategorySlug, isCanonicalCategoryParam, resolveCategoryFromParam } from "../../lib/categories";
import { buildBreadcrumbJsonLd, buildItemListJsonLd } from "../../lib/seo";
import type { Article, Guide } from "../../lib/types";

type CategoryPageProps = {
  category: string;
  articles: Article[];
  guides: Guide[];
  indexable: boolean;
  overview: string[];
};

export default function CategoryPage({ category, articles, guides, indexable, overview }: CategoryPageProps) {
  const categoryPath = buildCategoryPath(category);
  const description = overview[0] || `Evidence-led ${category} updates and implementation guides from KyenAI.`;
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: category, path: categoryPath },
  ]);
  const itemListJsonLd = buildItemListJsonLd(articles, `${category} articles`, categoryPath);

  return (
    <Layout>
      <SeoHead title={category} description={description} path={categoryPath} robots={indexable ? undefined : "noindex,follow"}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      </SeoHead>
      <section className="listing-page">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link><span aria-hidden="true">/</span><span>{category}</span>
        </nav>
        <h1>{category}</h1>
        <div className="category-overview">
          {overview.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
        {guides.length > 0 ? (
          <section className="related-guides" aria-labelledby="category-guides-heading">
            <div className="section-heading">
              <div><h2 id="category-guides-heading">Core guides</h2><p>Start with durable decision pages before individual updates.</p></div>
              <Link href="/guides">All guides</Link>
            </div>
            <div>
              {guides.map((guide) => (
                <article key={guide.id}>
                  <span>{guide.pageType}</span>
                  <h3><Link href={`/guides/${guide.slug}`}>{guide.title}</Link></h3>
                  <p>{guide.summary}</p>
                </article>
              ))}
            </div>
          </section>
        ) : null}
        <section aria-labelledby="category-updates-heading">
          <div className="section-heading"><div><h2 id="category-updates-heading">Evidence updates</h2><p>Dated vendor changes and implementation implications.</p></div></div>
          <div className="article-list">
            {articles.map((article, index) => <ArticleCard article={article} index={index} key={article.id} />)}
          </div>
        </section>
      </section>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const articles = await getArticles();
  const categories = Array.from(new Set(articles.filter((article) => article.status === "published").map((article) => article.category)));
  return { paths: categories.map((category) => ({ params: { category: buildCategorySlug(category) } })), fallback: "blocking" };
};

export const getStaticProps: GetStaticProps<CategoryPageProps> = async ({ params }) => {
  const param = String(params?.category || "");
  const allArticles = await getArticles();
  const publishedArticles = allArticles.filter((article) => article.status === "published");
  const categories = Array.from(new Set(publishedArticles.map((article) => article.category)));
  const category = resolveCategoryFromParam(param, categories);

  if (!category) return { notFound: true };
  if (!isCanonicalCategoryParam(param, category)) {
    return { redirect: { destination: buildCategoryPath(category), permanent: true } };
  }

  const categoryArticles = publishedArticles.filter((article) => article.category === category);
  const hub = getCategoryHub(category);
  if (categoryArticles.length === 0 || !hub) return { notFound: true };

  return {
    props: {
      category,
      articles: categoryArticles,
      guides: getCategoryGuides(category),
      indexable: shouldIndexCategoryHub(category, publishedArticles),
      overview: hub.overview,
    },
    revalidate: 300,
  };
};
