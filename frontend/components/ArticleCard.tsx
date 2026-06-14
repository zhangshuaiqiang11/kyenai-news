import Link from "next/link";
import React from "react";
import { ArrowUpRight, FileText } from "lucide-react";

import { formatDate } from "../lib/seo";
import type { Article } from "../lib/types";

type ArticleCardProps = {
  article: Article;
  index: number;
};

export function ArticleCard({ article, index }: ArticleCardProps) {
  return (
    <article className="article-row">
      <div className={`article-visual visual-${index % 3}`} aria-hidden="true">
        <span />
      </div>
      <div className="article-row-body">
        <div className="article-kicker">{article.category}</div>
        <h2>
          <Link href={`/articles/${article.slug}`}>{article.title}</Link>
        </h2>
        <p>{article.summary}</p>
        <div className="article-meta">
          <FileText aria-hidden="true" size={16} />
          <span>{article.sources[0]?.publisher}</span>
          <span>{formatDate(article.updatedAt)}</span>
          <span className="evidence-label">Evidence level: high</span>
          <ArrowUpRight aria-hidden="true" size={16} />
        </div>
      </div>
    </article>
  );
}
