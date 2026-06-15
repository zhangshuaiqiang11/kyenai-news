import React, { useMemo, useState } from "react";
import { Filter, Search } from "lucide-react";

import { filterArticles, getCategoryCounts, getPublishers, sortArticles, type ArticleSort } from "../lib/catalog";
import type { Article } from "../lib/types";
import { ArticleCard } from "./ArticleCard";

type ArticleExplorerProps = {
  articles: Article[];
};

export function ArticleExplorer({ articles }: ArticleExplorerProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [source, setSource] = useState("");
  const [sort, setSort] = useState<ArticleSort>("newest");
  const categoryCounts = useMemo(() => getCategoryCounts(articles), [articles]);
  const publishers = useMemo(() => getPublishers(articles), [articles]);
  const visibleArticles = useMemo(() => {
    return sortArticles(filterArticles(articles, { query, category, source }), sort);
  }, [articles, category, query, sort, source]);

  return (
    <>
      <div className="explorer-toolbar" aria-label="Article filters">
        <label className="search-control">
          <Search aria-hidden="true" size={18} />
          <span className="visually-hidden">Search articles</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search Codex, Copilot, Claude Code..."
          />
        </label>
        <label className="select-control">
          <Filter aria-hidden="true" size={18} />
          <span className="visually-hidden">Filter by category</span>
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="">All categories</option>
            {Object.keys(categoryCounts).map((item) => (
              <option value={item} key={item}>
                {item} ({categoryCounts[item]})
              </option>
            ))}
          </select>
        </label>
        <label className="select-control">
          <span className="visually-hidden">Filter by source</span>
          <select value={source} onChange={(event) => setSource(event.target.value)}>
            <option value="">All sources</option>
            {publishers.map((publisher) => (
              <option value={publisher} key={publisher}>
                {publisher}
              </option>
            ))}
          </select>
        </label>
        <label className="select-control">
          <span className="visually-hidden">Sort articles</span>
          <select value={sort} onChange={(event) => setSort(event.target.value as ArticleSort)}>
            <option value="newest">Newest update</option>
            <option value="source-credibility">Source credibility</option>
            <option value="title">Title</option>
          </select>
        </label>
      </div>
      <div className="explorer-summary">
        <strong>{visibleArticles.length}</strong>
        <span>of {articles.length} articles visible</span>
      </div>
      <div className="topic-rail" aria-label="Topic counts">
        {Object.entries(categoryCounts).map(([name, count]) => (
          <button
            className={category === name ? "active" : ""}
            key={name}
            onClick={() => setCategory(category === name ? "" : name)}
            type="button"
          >
            {name}
            <span>{count}</span>
          </button>
        ))}
      </div>
      <div className="article-list">
        {visibleArticles.map((article, index) => (
          <ArticleCard article={article} index={index} key={article.id} />
        ))}
        {visibleArticles.length === 0 ? <p className="empty-state">No sourced articles match this filter.</p> : null}
      </div>
    </>
  );
}
