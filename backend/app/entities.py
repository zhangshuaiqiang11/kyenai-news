from __future__ import annotations

from app.models import Article, BrandEntity


MENTION_POLICY = (
    "Mentioned for factual market context only; not an endorsement, partnership, certification, or sponsorship claim."
)


BASE_ENTITIES: list[BrandEntity] = [
    BrandEntity(
        id="openai",
        name="OpenAI",
        slug="openai",
        kind="Organization",
        official_url="https://openai.com/",
        relationship="AI lab and vendor behind Codex, GPT models, and ChatGPT.",
        mention_policy=MENTION_POLICY,
        coverage_status="covered",
    ),
    BrandEntity(
        id="chatgpt",
        name="ChatGPT",
        slug="chatgpt",
        kind="SoftwareApplication",
        official_url="https://chatgpt.com/",
        relationship="OpenAI conversational product watched as part of the broader AI assistant ecosystem.",
        mention_policy=MENTION_POLICY,
        coverage_status="covered",
    ),
    BrandEntity(
        id="openai-codex",
        name="OpenAI Codex",
        slug="openai-codex",
        kind="SoftwareApplication",
        official_url="https://openai.com/codex/",
        relationship="OpenAI coding-agent product covered when official Codex updates affect engineering workflows.",
        mention_policy=MENTION_POLICY,
        coverage_status="covered",
    ),
    BrandEntity(
        id="anthropic",
        name="Anthropic",
        slug="anthropic",
        kind="Organization",
        official_url="https://www.anthropic.com/",
        relationship="AI lab and vendor behind Claude and Claude Code.",
        mention_policy=MENTION_POLICY,
        coverage_status="covered",
    ),
    BrandEntity(
        id="claude-code",
        name="Claude Code",
        slug="claude-code",
        kind="SoftwareApplication",
        official_url="https://claude.com/product/claude-code",
        relationship="Anthropic coding-agent product monitored for workflow, orchestration, and developer tooling changes.",
        mention_policy=MENTION_POLICY,
        coverage_status="covered",
    ),
    BrandEntity(
        id="microsoft",
        name="Microsoft",
        slug="microsoft",
        kind="Organization",
        official_url="https://www.microsoft.com/",
        relationship="Platform and software company connected to GitHub, Bing, Visual Studio Code, and developer tooling.",
        mention_policy=MENTION_POLICY,
        coverage_status="covered",
    ),
    BrandEntity(
        id="github",
        name="GitHub",
        slug="github",
        kind="Organization",
        official_url="https://github.com/",
        relationship="Developer platform monitored for Copilot, VS Code, CLI, and agentic development updates.",
        mention_policy=MENTION_POLICY,
        coverage_status="covered",
    ),
    BrandEntity(
        id="github-copilot",
        name="GitHub Copilot",
        slug="github-copilot",
        kind="SoftwareApplication",
        official_url="https://github.com/features/copilot",
        relationship="GitHub AI coding product covered when official updates affect IDE, CLI, sandbox, or governance behavior.",
        mention_policy=MENTION_POLICY,
        coverage_status="covered",
    ),
    BrandEntity(
        id="visual-studio-code",
        name="Visual Studio Code",
        slug="visual-studio-code",
        kind="SoftwareApplication",
        official_url="https://code.visualstudio.com/",
        relationship="Microsoft code editor referenced when agent workflows land inside VS Code.",
        mention_policy=MENTION_POLICY,
        coverage_status="covered",
    ),
    BrandEntity(
        id="google",
        name="Google",
        slug="google",
        kind="Organization",
        official_url="https://www.google.com/",
        relationship="Search and AI platform company monitored for Gemini, Antigravity, and search-quality guidance.",
        mention_policy=MENTION_POLICY,
        coverage_status="covered",
    ),
    BrandEntity(
        id="gemini",
        name="Gemini",
        slug="gemini",
        kind="SoftwareApplication",
        official_url="https://gemini.google.com/",
        relationship="Google AI assistant and model family referenced when official developer workflow updates depend on Gemini tooling.",
        mention_policy=MENTION_POLICY,
        coverage_status="covered",
    ),
    BrandEntity(
        id="cursor",
        name="Cursor",
        slug="cursor",
        kind="SoftwareApplication",
        official_url="https://cursor.com/",
        relationship="AI code editor monitored for enterprise controls, agent permissions, and governance features.",
        mention_policy=MENTION_POLICY,
        coverage_status="covered",
    ),
    BrandEntity(
        id="microsoft-bing",
        name="Microsoft Bing",
        slug="microsoft-bing",
        kind="SoftwareApplication",
        official_url="https://www.bing.com/webmasters/",
        relationship="Search platform and webmaster data source used for Bing visibility and indexing workflows.",
        mention_policy=MENTION_POLICY,
        coverage_status="covered",
    ),
    BrandEntity(
        id="xai",
        name="xAI",
        slug="xai",
        kind="Organization",
        official_url="https://x.ai/",
        relationship="AI company behind Grok; watchlisted for future AI coding and search-answer coverage when evidence supports it.",
        mention_policy=MENTION_POLICY,
        coverage_status="watchlisted",
    ),
    BrandEntity(
        id="grok",
        name="Grok",
        slug="grok",
        kind="SoftwareApplication",
        official_url="https://x.ai/grok",
        relationship="xAI assistant watchlisted for AI answer, coding, and search-grounded workflow relevance.",
        mention_policy=MENTION_POLICY,
        coverage_status="watchlisted",
    ),
]


def list_brand_entities(articles: list[Article]) -> list[BrandEntity]:
    return [with_article_coverage(entity, articles) for entity in BASE_ENTITIES]


def with_article_coverage(entity: BrandEntity, articles: list[Article]) -> BrandEntity:
    covered_article_slugs = sorted(
        article.slug for article in articles if entity.id in set(article.entity_ids)
    )
    return entity.model_copy(
        update={
            "covered_article_slugs": covered_article_slugs,
            "coverage_status": "covered" if covered_article_slugs else entity.coverage_status,
        }
    )
