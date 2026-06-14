from __future__ import annotations

import json
import os
from dataclasses import dataclass


@dataclass(frozen=True)
class IntegrationStatus:
    name: str
    configured: bool
    required_env: list[str]
    note: str = ""


def integration_statuses() -> list[IntegrationStatus]:
    integrations = {
        "google_search_console": google_integration_status("google_search_console", "GSC_SITE_URL"),
        "ga4": google_integration_status("ga4", "GA4_PROPERTY_ID"),
        "bing_webmaster": ["BING_WEBMASTER_API_KEY", "BING_SITE_URL"],
        "indexnow": ["INDEXNOW_KEY", "INDEXNOW_HOST"],
        "pagespeed_insights": ["PAGESPEED_API_KEY", "NEXT_PUBLIC_SITE_URL"],
        "openai": ["OPENAI_API_KEY"],
    }
    statuses: list[IntegrationStatus] = []
    for name, value in integrations.items():
        if isinstance(value, IntegrationStatus):
            statuses.append(value)
        else:
            statuses.append(
                IntegrationStatus(
                    name=name,
                    configured=all(os.getenv(env_name) for env_name in value),
                    required_env=value,
                )
            )
    return statuses


def google_integration_status(name: str, product_env: str) -> IntegrationStatus:
    required_env = ["GOOGLE_APPLICATION_CREDENTIALS", product_env]
    has_base_env = all(os.getenv(env_name) for env_name in required_env)
    credential_type = google_credential_type(os.getenv("GOOGLE_APPLICATION_CREDENTIALS", ""))

    if credential_type == "oauth_client":
        required_env.append("GOOGLE_OAUTH_REFRESH_TOKEN")
        return IntegrationStatus(
            name=name,
            configured=has_base_env and bool(os.getenv("GOOGLE_OAUTH_REFRESH_TOKEN")),
            required_env=required_env,
            note="OAuth client credentials need a refresh token after one-time Google consent.",
        )
    if credential_type == "service_account":
        return IntegrationStatus(name=name, configured=has_base_env, required_env=required_env)
    return IntegrationStatus(
        name=name,
        configured=False,
        required_env=required_env,
        note="Google credentials file is missing or not a supported service account/OAuth client JSON.",
    )


def google_credential_type(credentials_path: str) -> str:
    if not credentials_path or not os.path.exists(credentials_path):
        return "missing"
    try:
        with open(credentials_path, encoding="utf-8") as handle:
            credentials = json.load(handle)
    except (OSError, json.JSONDecodeError):
        return "invalid"

    if credentials.get("client_email") and credentials.get("private_key"):
        return "service_account"
    oauth_client = credentials.get("installed") or credentials.get("web") or {}
    if oauth_client.get("client_id") and oauth_client.get("client_secret"):
        return "oauth_client"
    return "invalid"
