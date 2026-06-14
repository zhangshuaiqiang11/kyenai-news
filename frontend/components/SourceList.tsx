import type { EvidenceSource } from "../lib/types";
import { formatDate } from "../lib/seo";

type SourceListProps = {
  sources: EvidenceSource[];
};

export function SourceList({ sources }: SourceListProps) {
  return (
    <section className="source-list" aria-labelledby="sources-heading">
      <h2 id="sources-heading">Sources</h2>
      <ul>
        {sources.map((source) => (
          <li key={source.id}>
            <a href={source.url} rel="noreferrer" target="_blank">
              {source.title}
            </a>
            <span>
              {source.publisher} · {formatDate(source.publishedAt)} · Credibility {source.credibility}/5
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

