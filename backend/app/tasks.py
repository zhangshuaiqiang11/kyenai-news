from __future__ import annotations

import os

from celery import Celery


celery_app = Celery(
    "geo_portal",
    broker=os.getenv("REDIS_URL", "redis://localhost:6379/0"),
    backend=os.getenv("REDIS_URL", "redis://localhost:6379/0"),
)


@celery_app.task(name="geo_portal.daily_search_metric_collection")
def daily_search_metric_collection() -> str:
    return "Use POST /api/jobs/collect-search-metrics for the local MVP, or wire this task to a persistent store in production."

