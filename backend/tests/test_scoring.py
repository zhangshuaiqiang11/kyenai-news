from app.models import SearchMetric
from app.scoring import score_search_opportunity


def test_scores_ctr_gap_and_striking_distance_queries():
    metrics = [
        SearchMetric(
            page="/articles/google-antigravity-cli-gemini-cli-transition",
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
            page="/articles/google-antigravity-cli-gemini-cli-transition",
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

    result = score_search_opportunity(metrics)

    assert result.score >= 80
    assert "high_impressions_low_ctr" in result.reasons
    assert "striking_distance_rank" in result.reasons
    assert "antigravity cli migration" in result.focus_queries


def test_low_signal_pages_do_not_create_optimization_pressure():
    metrics = [
        SearchMetric(
            page="/articles/low-signal",
            query="niche query",
            clicks=2,
            impressions=25,
            ctr=0.08,
            position=4.2,
            device="mobile",
            country="usa",
            date="2026-06-01",
            source="gsc",
        )
    ]

    result = score_search_opportunity(metrics)

    assert result.score < 40
    assert result.reasons == []
