from __future__ import annotations

from app.models import Article, ArticleBlock, OptimizationJob, OptimizationPatch, PublishResult, SearchMetric
from app.scoring import score_search_opportunity
from app.store import ContentStore, utc_now
from app.validator import validate_patch


def collect_search_metrics(store: ContentStore) -> dict[str, int]:
    article = store.get_article_by_slug("google-antigravity-cli-gemini-cli-transition")
    metrics = [
        SearchMetric(
            page=f"/articles/{article.slug}",
            query="antigravity cli migration",
            clicks=24,
            impressions=2200,
            ctr=0.0109,
            position=12.4,
            device="desktop",
            country="usa",
            date="2026-06-01",
            source="gsc",
        ),
        SearchMetric(
            page=f"/articles/{article.slug}",
            query="gemini cli transition",
            clicks=5,
            impressions=800,
            ctr=0.00625,
            position=18.2,
            device="desktop",
            country="usa",
            date="2026-06-01",
            source="bing",
        ),
    ]
    store.add_metrics(metrics)
    score = score_search_opportunity(metrics)
    created_jobs = 0
    if score.score >= 60:
        store.create_job(article, ",".join(score.reasons))
        created_jobs += 1
    return {"imported_metrics": len(metrics), "created_jobs": created_jobs}


def crawl_sources(store: ContentStore) -> dict[str, int | str]:
    now = utc_now()
    for source in store.sources.values():
        source.last_crawled_at = now
        store.upsert_source(source)
    return {"crawled_sources": len(store.sources), "mode": "whitelist_mock"}


def optimize_article(store: ContentStore, job_id: str) -> OptimizationJob:
    job = store.jobs.get(job_id)
    if job is None and job_id == "forced-invalid":
        job = store.create_forced_invalid_job()
    if job is None:
        raise KeyError(job_id)

    article = store.get_article(job.article_id)
    patch = job.ai_patch or _generate_safe_patch(article)
    validation = validate_patch(article, patch)

    job.ai_patch = patch
    job.validation_result = validation
    job.status = "approved" if validation.passed else "skipped"
    return store.save_job(job)


def publish_approved_patch(store: ContentStore, job_id: str) -> PublishResult:
    job = store.jobs[job_id]
    if job.status != "approved" or not job.ai_patch or not job.validation_result or not job.validation_result.passed:
        job.status = "skipped"
        store.save_job(job)
        article = store.get_article(job.article_id)
        return PublishResult(status="skipped", article_id=article.id, version=article.version)

    article = store.get_article(job.article_id)
    store.save_article_snapshot(article)
    updated = _apply_patch(article, job.ai_patch)
    store.publish_article(updated)
    job.rollback_version = article.version
    job.status = "published"
    store.save_job(job)
    return PublishResult(status="published", article_id=updated.id, version=updated.version)


def _generate_safe_patch(article: Article) -> OptimizationPatch:
    source_id = article.sources[0].id
    return OptimizationPatch(
        title="Antigravity CLI Migration from Gemini CLI in 2026",
        meta_description="Track the Gemini CLI to Antigravity CLI migration with source-backed checks for commands, auth, hooks, plugins, and team docs.",
        block_patches=[
            {
                "block_id": "body-1",
                "operation": "replace",
                "content": "Google's Antigravity CLI migration is an operational workflow change, not just a command rename. Teams should compare Gemini CLI scripts, authentication, hooks, skills, extensions, and multi-agent behavior before moving shared workflows.",
                "source_ids": [source_id],
            },
            {
                "block_id": "body-2",
                "operation": "replace",
                "content": "Start with one repository or automation path, map each Gemini CLI command to Antigravity CLI behavior, and update internal docs only after auth, plugins, hooks, and CI usage are verified against Google's source material.",
                "source_ids": [source_id],
            },
        ],
        faq=[
            {
                "question": "What should teams verify before moving from Gemini CLI to Antigravity CLI?",
                "answer": "Verify commands, authentication, hooks, skills, extensions, CI references, and team documentation before switching shared workflows.",
                "source_ids": [source_id],
            }
        ],
        schema_patch={"@type": "Article", "about": ["Antigravity CLI", "Gemini CLI migration"]},
        sources_used=[source_id],
        date_should_update=True,
    )


def _apply_patch(article: Article, patch: OptimizationPatch) -> Article:
    updated = article.model_copy(deep=True)
    if patch.title:
        updated.title = patch.title
        updated.meta_title = patch.title
    if patch.meta_description:
        updated.meta_description = patch.meta_description
        updated.summary = patch.meta_description

    block_lookup = {block.id: block for block in updated.blocks}
    for block_patch in patch.block_patches:
        block_id = str(block_patch["block_id"])
        if block_id in block_lookup and block_patch.get("operation") == "replace":
            block_lookup[block_id].content = str(block_patch.get("content", ""))
            block_lookup[block_id].source_ids = list(block_patch.get("source_ids", []))

    for index, faq in enumerate(patch.faq):
        updated.blocks.append(
            ArticleBlock(
                id=f"faq-{index + 1}",
                type="faq",
                content=f"{faq.get('question')}\n{faq.get('answer')}",
                source_ids=list(faq.get("source_ids", [])),
            )
        )

    updated.schema_data.update(patch.schema_patch)
    updated.updated_at = utc_now()
    updated.version += 1
    return updated
