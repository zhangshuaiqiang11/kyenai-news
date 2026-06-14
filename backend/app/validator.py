from __future__ import annotations

import re
from collections import Counter

from app.models import Article, OptimizationPatch, ValidationResult


TEMPLATE_PHRASES = (
    "in today's digital era",
    "in the rapidly evolving landscape",
    "comprehensive guide",
    "this article will delve",
    "delve into",
    "revolutionize",
    "unlock limitless",
    "unlock the power",
    "unmatched insights",
    "game-changing",
    "cutting-edge",
    "robust solution",
)

UNSUPPORTED_SUPERLATIVES = (
    "best",
    "ultimate",
    "guarantee",
    "guaranteed",
    "revolutionary",
    "unmatched",
    "number one",
    "#1",
)

EXPERIENCE_CLAIMS = (
    "we tested",
    "we reviewed",
    "our benchmark",
    "our hands-on",
    "hands-on review",
    "after using",
)

MIN_SUBSTANTIVE_PATCH_WORDS = 24


def validate_patch(article: Article, patch: OptimizationPatch) -> ValidationResult:
    failures: list[str] = []
    warnings: list[str] = []
    allowed_sources = {source.id for source in article.sources}
    used_sources = set(patch.sources_used)

    if not used_sources or not used_sources.issubset(allowed_sources):
        failures.append("missing_evidence")

    for block_patch in patch.block_patches:
        source_ids = set(block_patch.get("source_ids", []))
        if not source_ids or not source_ids.issubset(allowed_sources):
            if "missing_evidence" not in failures:
                failures.append("missing_evidence")

    for item in patch.faq:
        source_ids = set(item.get("source_ids", []))
        if not source_ids or not source_ids.issubset(allowed_sources):
            if "missing_evidence" not in failures:
                failures.append("missing_evidence")

    all_text = " ".join(
        [
            patch.title or "",
            patch.meta_description or "",
            " ".join(str(block.get("content", "")) for block in patch.block_patches),
            " ".join(str(item.get("answer", "")) for item in patch.faq),
        ]
    ).lower()

    if any(phrase in all_text for phrase in TEMPLATE_PHRASES):
        failures.append("template_language")

    if any(phrase in all_text for phrase in UNSUPPORTED_SUPERLATIVES):
        failures.append("unsupported_superlative")

    if any(phrase in all_text for phrase in EXPERIENCE_CLAIMS):
        failures.append("unsupported_experience_claim")

    if patch.title and _has_keyword_stuffing(patch.title):
        failures.append("keyword_stuffing")

    if _has_keyword_density_risk(article, all_text):
        failures.append("keyword_stuffing")

    if patch.block_patches and _patch_word_count(patch) < MIN_SUBSTANTIVE_PATCH_WORDS:
        failures.append("low_information_gain")

    if patch.meta_description and len(patch.meta_description) > 165:
        warnings.append("long_meta_description")

    if patch.date_should_update and not patch.block_patches and not patch.faq:
        failures.append("fake_freshness")

    risk_level = "low"
    if failures:
        risk_level = "high" if {"missing_evidence", "keyword_stuffing"} & set(failures) else "medium"

    return ValidationResult(
        passed=not failures,
        failures=failures,
        warnings=warnings,
        risk_level=risk_level,
    )


def _has_keyword_stuffing(title: str) -> bool:
    words = re.findall(r"[a-zA-Z0-9]+", title.lower())
    if len(words) < 4:
        return False
    counts = Counter(words)
    repeated_meaningful_words = [
        word for word, count in counts.items() if len(word) > 3 and count >= 3
    ]
    return bool(repeated_meaningful_words)


def _has_keyword_density_risk(article: Article, all_text: str) -> bool:
    words = re.findall(r"[a-zA-Z0-9]+", all_text)
    if len(words) < 40:
        return False

    for keyword in article.keywords:
        normalized = keyword.lower()
        if len(normalized) < 5:
            continue
        occurrences = all_text.count(normalized)
        if occurrences >= 7 and occurrences / max(len(words), 1) > 0.045:
            return True
    return False


def _patch_word_count(patch: OptimizationPatch) -> int:
    text = " ".join(
        [
            " ".join(str(block.get("content", "")) for block in patch.block_patches),
            " ".join(str(item.get("answer", "")) for item in patch.faq),
        ]
    )
    return len(re.findall(r"[a-zA-Z0-9]+(?:[-'][a-zA-Z0-9]+)?", text))
