from fastapi.testclient import TestClient
import re

from app.main import create_app


def test_articles_are_filled_with_current_ai_coding_news():
    client = TestClient(create_app())

    response = client.get("/api/articles")

    assert response.status_code == 200
    articles = response.json()
    assert len(articles) >= 8
    assert any(article["category"] == "AI Coding Agents" for article in articles)
    assert any("Codex" in article["title"] for article in articles)
    assert any("Claude Code" in article["title"] for article in articles)
    assert any("Copilot" in article["title"] for article in articles)
    slugs = {article["slug"] for article in articles}
    assert {
        "github-copilot-sdk-general-availability",
        "visual-studio-agent-mode-mcp-general-availability",
        "jetbrains-acp-agent-registry",
    } <= slugs
    assert all(article["sources"] for article in articles)
    for article in articles:
        body = " ".join(block["content"] for block in article["blocks"])
        words = re.findall(r"[A-Za-z0-9]+(?:[-'][A-Za-z0-9]+)?", f"{article['title']} {article['summary']} {body}")
        assert len(words) >= 340
        assert any(block["type"] == "fact_table" for block in article["blocks"])
        assert any(block["type"] == "source_note" for block in article["blocks"])
        assert "Limits and open questions" in body


def test_sources_route_lists_unique_authoritative_sources():
    client = TestClient(create_app())

    response = client.get("/api/sources")

    assert response.status_code == 200
    sources = response.json()
    publishers = {source["publisher"] for source in sources}
    assert {"OpenAI", "GitHub", "Google", "Anthropic", "Cursor"} <= publishers
    assert len({source["url"] for source in sources}) == len(sources)


def test_admin_overview_exposes_content_and_automation_state():
    client = TestClient(create_app())

    response = client.get("/api/admin/overview")

    assert response.status_code == 200
    overview = response.json()
    assert overview["article_count"] >= 8
    assert overview["source_count"] >= 8
    assert "AI Coding Agents" in overview["categories"]
    assert overview["guardrails"]["failed_validation_policy"] == "skip_and_alert"
    assert overview["guardrails"]["ai_spam_policy"] == "evidence_first_human_style"
    assert "template_language" in overview["guardrails"]["blocked_patterns"]


def test_cors_allow_origins_can_be_configured_from_env(monkeypatch):
    monkeypatch.setenv("CORS_ALLOW_ORIGINS", "https://www.kyenai.com, https://api.kyenai.com")
    client = TestClient(create_app())

    allowed = client.options(
        "/api/articles",
        headers={
            "Origin": "https://www.kyenai.com",
            "Access-Control-Request-Method": "GET",
        },
    )
    blocked = client.options(
        "/api/articles",
        headers={
            "Origin": "https://not-allowed.example",
            "Access-Control-Request-Method": "GET",
        },
    )

    assert allowed.headers["access-control-allow-origin"] == "https://www.kyenai.com"
    assert "access-control-allow-origin" not in blocked.headers
