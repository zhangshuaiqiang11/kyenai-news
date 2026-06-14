import json

from app.integrations import integration_statuses


def status_by_name(name: str):
    return next(status for status in integration_statuses() if status.name == name)


def test_search_console_oauth_client_requires_refresh_token(monkeypatch, tmp_path):
    credentials_path = tmp_path / "google-oauth-client.json"
    credentials_path.write_text(
        json.dumps(
            {
                "installed": {
                    "client_id": "client-id",
                    "client_secret": "client-secret",
                    "redirect_uris": ["http://localhost"],
                }
            }
        )
    )
    monkeypatch.setenv("GOOGLE_APPLICATION_CREDENTIALS", str(credentials_path))
    monkeypatch.setenv("GSC_SITE_URL", "https://www.kyenai.com/")
    monkeypatch.delenv("GOOGLE_OAUTH_REFRESH_TOKEN", raising=False)

    status = status_by_name("google_search_console")

    assert status.configured is False
    assert "GOOGLE_OAUTH_REFRESH_TOKEN" in status.required_env


def test_search_console_accepts_oauth_client_with_refresh_token(monkeypatch, tmp_path):
    credentials_path = tmp_path / "google-oauth-client.json"
    credentials_path.write_text(
        json.dumps(
            {
                "installed": {
                    "client_id": "client-id",
                    "client_secret": "client-secret",
                    "redirect_uris": ["http://localhost"],
                }
            }
        )
    )
    monkeypatch.setenv("GOOGLE_APPLICATION_CREDENTIALS", str(credentials_path))
    monkeypatch.setenv("GSC_SITE_URL", "https://www.kyenai.com/")
    monkeypatch.setenv("GOOGLE_OAUTH_REFRESH_TOKEN", "refresh-token")

    assert status_by_name("google_search_console").configured is True


def test_search_console_accepts_service_account_credentials(monkeypatch, tmp_path):
    credentials_path = tmp_path / "google-service-account.json"
    credentials_path.write_text(json.dumps({"client_email": "bot@example.com", "private_key": "key"}))
    monkeypatch.setenv("GOOGLE_APPLICATION_CREDENTIALS", str(credentials_path))
    monkeypatch.setenv("GSC_SITE_URL", "https://www.kyenai.com/")
    monkeypatch.delenv("GOOGLE_OAUTH_REFRESH_TOKEN", raising=False)

    assert status_by_name("google_search_console").configured is True
