from __future__ import annotations

from copy import deepcopy
from datetime import UTC, datetime
from uuid import uuid4

from app.entities import list_brand_entities
from app.models import Article, OptimizationJob, OptimizationPatch, SearchMetric, Source
from app.seed import seed_articles, seed_sources


def utc_now() -> str:
    return datetime.now(UTC).replace(microsecond=0).isoformat().replace("+00:00", "Z")


class ContentStore:
    def __init__(self) -> None:
        self.articles: dict[str, Article] = {}
        self.sources: dict[str, Source] = {}
        self.metrics: list[SearchMetric] = []
        self.jobs: dict[str, OptimizationJob] = {}
        self.article_history: dict[str, list[Article]] = {}
        self._seed()

    def list_articles(self) -> list[Article]:
        return sorted(self.articles.values(), key=lambda article: article.updated_at, reverse=True)

    def get_article_by_slug(self, slug: str) -> Article:
        for article in self.articles.values():
            if article.slug == slug:
                return article
        raise KeyError(slug)

    def get_article(self, article_id: str) -> Article:
        return self.articles[article_id]

    def upsert_source(self, source: Source) -> Source:
        self.sources[source.id] = source
        return source

    def create_job(self, article: Article, trigger_reason: str) -> OptimizationJob:
        now = utc_now()
        job = OptimizationJob(
            id=f"job-{uuid4().hex[:10]}",
            trigger_reason=trigger_reason,
            article_id=article.id,
            article_slug=article.slug,
            evidence_package=article.sources,
            status="pending",
            created_at=now,
            updated_at=now,
        )
        self.jobs[job.id] = job
        return job

    def create_forced_invalid_job(self) -> OptimizationJob:
        article = self.get_article_by_slug("google-antigravity-cli-gemini-cli-transition")
        now = utc_now()
        job = OptimizationJob(
            id="forced-invalid",
            trigger_reason="forced_invalid_patch_for_guardrail_test",
            article_id=article.id,
            article_slug=article.slug,
            evidence_package=[],
            ai_patch=OptimizationPatch(
                title="Antigravity CLI Antigravity CLI Antigravity CLI",
                meta_description="In today's digital era, this comprehensive guide will revolutionize your strategy.",
                block_patches=[
                    {
                        "block_id": "body-1",
                        "operation": "replace",
                        "content": "In today's digital era, every company can unlock limitless success.",
                        "source_ids": [],
                    }
                ],
                sources_used=[],
                date_should_update=True,
            ),
            status="pending",
            created_at=now,
            updated_at=now,
        )
        self.jobs[job.id] = job
        return job

    def save_job(self, job: OptimizationJob) -> OptimizationJob:
        job.updated_at = utc_now()
        self.jobs[job.id] = job
        return job

    def list_jobs(self) -> list[OptimizationJob]:
        return sorted(self.jobs.values(), key=lambda job: job.created_at, reverse=True)

    def save_article_snapshot(self, article: Article) -> None:
        self.article_history.setdefault(article.id, []).append(deepcopy(article))

    def publish_article(self, article: Article) -> Article:
        self.articles[article.id] = article
        return article

    def rollback_article(self, article_id: str) -> Article:
        snapshots = self.article_history.get(article_id, [])
        if not snapshots:
            raise KeyError(article_id)
        restored = snapshots[0]
        self.article_history[article_id] = []
        self.articles[article_id] = restored
        return restored

    def add_metrics(self, metrics: list[SearchMetric]) -> None:
        self.metrics.extend(metrics)

    def metrics_for_page(self, page: str) -> list[SearchMetric]:
        return [metric for metric in self.metrics if metric.page == page]

    def list_evidence_sources(self) -> list:
        sources = {}
        for article in self.articles.values():
            for source in article.sources:
                sources[source.url] = source
        return sorted(sources.values(), key=lambda source: source.published_at, reverse=True)

    def list_entities(self) -> list:
        return list_brand_entities(list(self.articles.values()))

    def overview(self) -> dict:
        categories = sorted({article.category for article in self.articles.values()})
        return {
            "article_count": len(self.articles),
            "source_count": len(self.list_evidence_sources()),
            "entity_count": len(self.list_entities()),
            "job_count": len(self.jobs),
            "categories": categories,
            "latest_updated_at": max(article.updated_at for article in self.articles.values()),
            "production_data_requirements": [
                "google_search_console",
                "ga4",
                "bing_webmaster",
                "indexnow",
                "pagespeed_insights",
            ],
            "guardrails": {
                "failed_validation_policy": "skip_and_alert",
                "source_policy": "authoritative_whitelist",
                "ai_output_shape": "structured_json_patch",
                "ai_spam_policy": "evidence_first_human_style",
                "blocked_patterns": [
                    "template_language",
                    "unsupported_superlative",
                    "unsupported_experience_claim",
                    "keyword_stuffing",
                    "fake_freshness",
                    "low_information_gain",
                ],
            },
        }

    def _seed(self) -> None:
        for article_item in seed_articles():
            self.articles[article_item.id] = article_item
        for source_item in seed_sources():
            self.sources[source_item.id] = source_item
