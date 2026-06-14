from app.models import Article, ArticleBlock, EvidenceSource, OptimizationPatch
from app.validator import validate_patch


def _article() -> Article:
    return Article(
        id="article-1",
        title="Antigravity CLI Migration from Gemini CLI",
        slug="google-antigravity-cli-gemini-cli-transition",
        summary="A practical migration guide for Gemini CLI users moving to Antigravity CLI.",
        category="IDE & CLI",
        tags=["google", "antigravity", "gemini-cli"],
        author_name="Editorial Automation Desk",
        status="published",
        keywords=["Antigravity CLI", "Gemini CLI migration"],
        blocks=[
            ArticleBlock(
                id="body-1",
                type="paragraph",
                content="Google is moving Gemini CLI users toward Antigravity CLI, so teams need to verify commands, authentication, hooks, skills, extensions, and CI usage.",
            )
        ],
        sources=[
            EvidenceSource(
                id="src-1",
                title="An important update: Transitioning Gemini CLI to Antigravity CLI",
                url="https://developers.googleblog.com/en/an-important-update-transitioning-gemini-cli-to-antigravity-cli/",
                publisher="Google",
                published_at="2026-05-19",
                credibility=5,
            )
        ],
        published_at="2026-05-01T09:00:00Z",
        updated_at="2026-05-15T09:00:00Z",
        version=1,
    )


def test_valid_patch_requires_cited_evidence_and_safe_style():
    patch = OptimizationPatch(
        title="Antigravity CLI Migration from Gemini CLI in 2026",
        meta_description="Compare source-backed Gemini CLI to Antigravity CLI migration checks for commands, auth, hooks, extensions, and team docs.",
        block_patches=[
            {
                "block_id": "body-1",
                "operation": "replace",
                "content": "Google's transition note makes this a workflow migration rather than a package rename. Teams should audit Gemini CLI commands, auth, hooks, skills, extensions, and CI references before moving shared automation to Antigravity CLI.",
                "source_ids": ["src-1"],
            }
        ],
        faq=[
            {
                "question": "What should teams verify before migrating from Gemini CLI?",
                "answer": "Verify commands, authentication, hooks, skills, extensions, CI references, and team docs against Google's migration source before switching shared workflows.",
                "source_ids": ["src-1"],
            }
        ],
        schema_patch={"@type": "Article"},
        sources_used=["src-1"],
        date_should_update=True,
    )

    result = validate_patch(_article(), patch)

    assert result.passed is True
    assert result.risk_level == "low"
    assert result.failures == []


def test_patch_fails_when_evidence_is_missing_or_text_is_template_like():
    patch = OptimizationPatch(
        title="Antigravity CLI Antigravity CLI Antigravity CLI",
        meta_description="In today's digital era, this comprehensive guide will revolutionize your strategy with unmatched insights.",
        block_patches=[
            {
                "block_id": "body-1",
                "operation": "replace",
                "content": "In today's digital era, every company can unlock limitless success by following these tips.",
                "source_ids": [],
            }
        ],
        faq=[],
        schema_patch={},
        sources_used=[],
        date_should_update=True,
    )

    result = validate_patch(_article(), patch)

    assert result.passed is False
    assert "missing_evidence" in result.failures
    assert "template_language" in result.failures
    assert "keyword_stuffing" in result.failures


def test_patch_fails_for_ai_spam_signals_and_unsupported_experience_claims():
    patch = OptimizationPatch(
        title="The Ultimate Antigravity CLI Migration Playbook",
        meta_description="Unlock the power of Antigravity CLI with a game-changing strategy for every developer team.",
        block_patches=[
            {
                "block_id": "body-1",
                "operation": "replace",
                "content": (
                    "In the rapidly evolving landscape, this article will delve into a robust solution. "
                    "We tested every major AI search tool and guarantee better rankings after these steps."
                ),
                "source_ids": ["src-1"],
            }
        ],
        faq=[
            {
                "question": "Will this guarantee better rankings?",
                "answer": "Yes, this ultimate approach can guarantee visibility across AI answer engines.",
                "source_ids": [],
            }
        ],
        schema_patch={"@type": "Article"},
        sources_used=["src-1"],
        date_should_update=True,
    )

    result = validate_patch(_article(), patch)

    assert result.passed is False
    assert "template_language" in result.failures
    assert "unsupported_superlative" in result.failures
    assert "unsupported_experience_claim" in result.failures
    assert "missing_evidence" in result.failures


def test_patch_fails_when_content_has_too_little_original_information_gain():
    patch = OptimizationPatch(
        title="Antigravity CLI Migration from Gemini CLI",
        meta_description="A sourced update about Antigravity CLI migration.",
        block_patches=[
            {
                "block_id": "body-1",
                "operation": "replace",
                "content": "Antigravity CLI matters.",
                "source_ids": ["src-1"],
            }
        ],
        faq=[],
        schema_patch={"@type": "Article"},
        sources_used=["src-1"],
        date_should_update=True,
    )

    result = validate_patch(_article(), patch)

    assert result.passed is False
    assert "low_information_gain" in result.failures
