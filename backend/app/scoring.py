from __future__ import annotations

from collections import Counter

from app.models import OpportunityScore, SearchMetric


def score_search_opportunity(metrics: list[SearchMetric]) -> OpportunityScore:
    if not metrics:
        return OpportunityScore(score=0, reasons=[], focus_queries=[])

    impressions = sum(metric.impressions for metric in metrics)
    clicks = sum(metric.clicks for metric in metrics)
    weighted_position = sum(metric.position * metric.impressions for metric in metrics) / max(impressions, 1)
    aggregate_ctr = clicks / max(impressions, 1)

    reasons: list[str] = []
    score = 0

    if impressions >= 500 and aggregate_ctr < 0.025:
        score += 45
        reasons.append("high_impressions_low_ctr")

    if 8 <= weighted_position <= 30:
        score += 35
        reasons.append("striking_distance_rank")

    if len({metric.query for metric in metrics}) >= 2:
        score += 10
        reasons.append("long_tail_cluster")

    if any(metric.source == "bing" for metric in metrics):
        score += 5
        reasons.append("bing_visibility_signal")

    query_weights = Counter[str]()
    for metric in metrics:
        query_weights[metric.query] += int(metric.impressions * max(0.1, 1 / max(metric.position, 1)))

    focus_queries = [query for query, _ in query_weights.most_common(3)]
    return OpportunityScore(score=min(score, 100), reasons=reasons, focus_queries=focus_queries)

