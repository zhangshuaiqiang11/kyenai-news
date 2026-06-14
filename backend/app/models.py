from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, Field, HttpUrl


ArticleStatus = Literal["draft", "published", "archived"]
JobStatus = Literal["pending", "approved", "published", "skipped", "failed"]
RiskLevel = Literal["low", "medium", "high"]
EntityKind = Literal["Organization", "SoftwareApplication"]
CoverageStatus = Literal["covered", "watchlisted"]


class ArticleBlock(BaseModel):
    id: str
    type: Literal["paragraph", "heading", "fact_table", "faq", "source_note"]
    content: str
    source_ids: list[str] = Field(default_factory=list)


class EvidenceSource(BaseModel):
    id: str
    title: str
    url: str
    publisher: str
    published_at: str
    credibility: int = Field(ge=1, le=5)


class Article(BaseModel):
    id: str
    title: str
    slug: str
    summary: str
    category: str
    tags: list[str]
    author_name: str
    status: ArticleStatus
    keywords: list[str]
    entity_ids: list[str] = Field(default_factory=list)
    blocks: list[ArticleBlock]
    sources: list[EvidenceSource]
    published_at: str
    updated_at: str
    version: int = 1
    meta_title: str | None = None
    meta_description: str | None = None
    schema_data: dict[str, Any] = Field(default_factory=dict)


class Source(BaseModel):
    id: str
    name: str
    url: HttpUrl | str
    type: Literal["rss", "api", "web"]
    credibility: int = Field(ge=1, le=5)
    crawl_frequency: Literal["hourly", "daily", "weekly"]
    robots_policy: Literal["respect", "blocked"] = "respect"
    last_crawled_at: str | None = None


class BrandEntity(BaseModel):
    id: str
    name: str
    slug: str
    kind: EntityKind
    official_url: str
    source_type: Literal["official"] = "official"
    relationship: str
    mention_policy: str
    coverage_status: CoverageStatus
    covered_article_slugs: list[str] = Field(default_factory=list)


class SearchMetric(BaseModel):
    page: str
    query: str
    clicks: int
    impressions: int
    ctr: float
    position: float
    device: str
    country: str
    date: str
    source: Literal["gsc", "ga4", "bing"]


class OpportunityScore(BaseModel):
    score: int
    reasons: list[str]
    focus_queries: list[str]


class OptimizationPatch(BaseModel):
    title: str | None = None
    meta_description: str | None = None
    block_patches: list[dict[str, Any]] = Field(default_factory=list)
    faq: list[dict[str, Any]] = Field(default_factory=list)
    schema_patch: dict[str, Any] = Field(default_factory=dict)
    sources_used: list[str] = Field(default_factory=list)
    date_should_update: bool = False


class ValidationResult(BaseModel):
    passed: bool
    failures: list[str] = Field(default_factory=list)
    warnings: list[str] = Field(default_factory=list)
    risk_level: RiskLevel = "low"


class OptimizationJob(BaseModel):
    id: str
    trigger_reason: str
    article_id: str
    article_slug: str
    evidence_package: list[EvidenceSource] = Field(default_factory=list)
    ai_patch: OptimizationPatch | None = None
    validation_result: ValidationResult | None = None
    status: JobStatus = "pending"
    rollback_version: int | None = None
    created_at: str
    updated_at: str


class PublishResult(BaseModel):
    status: JobStatus
    article_id: str
    version: int
