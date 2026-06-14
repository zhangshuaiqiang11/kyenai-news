from fastapi.testclient import TestClient

from app.main import create_app


ARTICLE_PATH = "/api/articles/google-antigravity-cli-gemini-cli-transition"


def test_collect_metrics_creates_optimization_job_and_publish_updates_version():
    client = TestClient(create_app())

    metrics_response = client.post("/api/jobs/collect-search-metrics")
    assert metrics_response.status_code == 200
    assert metrics_response.json()["created_jobs"] >= 1

    jobs_response = client.get("/api/admin/jobs")
    jobs = jobs_response.json()
    pending_job = next(job for job in jobs if job["status"] == "pending")

    optimize_response = client.post(f"/api/jobs/optimize-article?job_id={pending_job['id']}")
    assert optimize_response.status_code == 200
    optimized = optimize_response.json()
    assert optimized["status"] == "approved"
    assert optimized["validation_result"]["passed"] is True

    article_before = client.get(ARTICLE_PATH).json()
    publish_response = client.post(f"/api/jobs/publish-approved-patch?job_id={pending_job['id']}")
    assert publish_response.status_code == 200
    assert publish_response.json()["status"] == "published"

    article_after = client.get(ARTICLE_PATH).json()
    assert article_after["version"] == article_before["version"] + 1
    assert article_after["updated_at"] != article_before["updated_at"]


def test_invalid_optimization_is_skipped_and_does_not_change_article():
    client = TestClient(create_app())
    article_before = client.get(ARTICLE_PATH).json()

    response = client.post("/api/jobs/optimize-article?job_id=forced-invalid")

    assert response.status_code == 200
    assert response.json()["status"] == "skipped"
    article_after = client.get(ARTICLE_PATH).json()
    assert article_after["version"] == article_before["version"]


def test_rollback_restores_previous_version():
    client = TestClient(create_app())
    client.post("/api/jobs/collect-search-metrics")
    job = client.get("/api/admin/jobs").json()[0]
    client.post(f"/api/jobs/optimize-article?job_id={job['id']}")
    client.post(f"/api/jobs/publish-approved-patch?job_id={job['id']}")
    updated = client.get(ARTICLE_PATH).json()

    rollback = client.post(f"/api/jobs/rollback/{updated['id']}")

    assert rollback.status_code == 200
    restored = client.get(ARTICLE_PATH).json()
    assert restored["version"] == 1
