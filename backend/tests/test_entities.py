from fastapi.testclient import TestClient

from app.main import create_app


def test_entities_route_lists_brand_mentions_with_boundaries():
    client = TestClient(create_app())

    response = client.get("/api/entities")

    assert response.status_code == 200
    entities = response.json()
    names = {entity["name"] for entity in entities}
    assert {"OpenAI", "ChatGPT", "Anthropic", "Microsoft", "GitHub", "Google", "Grok", "xAI"} <= names
    assert all(entity["official_url"].startswith("https://") for entity in entities)
    assert all(entity["source_type"] == "official" for entity in entities)
    assert all("not an endorsement" in entity["mention_policy"].lower() for entity in entities)


def test_grok_is_watchlisted_without_uncited_article_coverage():
    client = TestClient(create_app())

    response = client.get("/api/entities")

    assert response.status_code == 200
    grok = next(entity for entity in response.json() if entity["name"] == "Grok")
    assert grok["coverage_status"] == "watchlisted"
    assert grok["covered_article_slugs"] == []


def test_admin_overview_exposes_entity_count_and_live_data_requirements():
    client = TestClient(create_app())

    response = client.get("/api/admin/overview")

    assert response.status_code == 200
    overview = response.json()
    assert overview["entity_count"] >= 10
    assert overview["production_data_requirements"] == [
        "google_search_console",
        "ga4",
        "bing_webmaster",
        "indexnow",
        "pagespeed_insights",
    ]
