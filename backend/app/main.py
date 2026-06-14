from __future__ import annotations

import os

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.integrations import integration_statuses
from app.models import Article, BrandEntity, EvidenceSource, OptimizationJob, PublishResult, Source
from app.services import collect_search_metrics, crawl_sources, optimize_article, publish_approved_patch
from app.store import ContentStore


DEFAULT_CORS_ALLOW_ORIGINS = ["http://localhost:3000", "http://127.0.0.1:3000"]


def cors_allow_origins() -> list[str]:
    configured = os.getenv("CORS_ALLOW_ORIGINS")
    if not configured:
        return DEFAULT_CORS_ALLOW_ORIGINS
    return [origin.strip() for origin in configured.split(",") if origin.strip()]


def create_app(store: ContentStore | None = None) -> FastAPI:
    app = FastAPI(
        title="AI Coding Agent Playbooks API",
        version="0.1.0",
        description="Evidence-led content automation for AI coding agent guides, source updates, and GSC iteration.",
    )
    app.state.store = store or ContentStore()
    app.add_middleware(
        CORSMiddleware,
        allow_origins=cors_allow_origins(),
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/api/articles", response_model=list[Article])
    def list_articles() -> list[Article]:
        return app.state.store.list_articles()

    @app.get("/api/articles/{slug}", response_model=Article)
    def get_article(slug: str) -> Article:
        try:
            return app.state.store.get_article_by_slug(slug)
        except KeyError as exc:
            raise HTTPException(status_code=404, detail="Article not found") from exc

    @app.get("/api/sources", response_model=list[EvidenceSource])
    def list_sources() -> list[EvidenceSource]:
        return app.state.store.list_evidence_sources()

    @app.get("/api/entities", response_model=list[BrandEntity])
    def list_entities() -> list[BrandEntity]:
        return app.state.store.list_entities()

    @app.post("/api/admin/sources", response_model=Source)
    def create_source(source: Source) -> Source:
        return app.state.store.upsert_source(source)

    @app.get("/api/admin/jobs", response_model=list[OptimizationJob])
    def list_jobs() -> list[OptimizationJob]:
        return app.state.store.list_jobs()

    @app.get("/api/admin/overview")
    def admin_overview() -> dict:
        return app.state.store.overview()

    @app.get("/api/admin/integrations")
    def admin_integrations() -> list[dict]:
        return [status.__dict__ for status in integration_statuses()]

    @app.post("/api/jobs/collect-search-metrics")
    def run_collect_search_metrics() -> dict[str, int]:
        return collect_search_metrics(app.state.store)

    @app.post("/api/jobs/crawl-sources")
    def run_crawl_sources() -> dict[str, int | str]:
        return crawl_sources(app.state.store)

    @app.post("/api/jobs/optimize-article", response_model=OptimizationJob)
    def run_optimize_article(job_id: str) -> OptimizationJob:
        try:
            return optimize_article(app.state.store, job_id)
        except KeyError as exc:
            raise HTTPException(status_code=404, detail="Optimization job not found") from exc

    @app.post("/api/jobs/publish-approved-patch", response_model=PublishResult)
    def run_publish_approved_patch(job_id: str) -> PublishResult:
        try:
            return publish_approved_patch(app.state.store, job_id)
        except KeyError as exc:
            raise HTTPException(status_code=404, detail="Optimization job not found") from exc

    @app.post("/api/jobs/rollback/{article_id}", response_model=Article)
    def rollback(article_id: str) -> Article:
        try:
            return app.state.store.rollback_article(article_id)
        except KeyError as exc:
            raise HTTPException(status_code=404, detail="Rollback version not found") from exc

    return app


app = create_app()
