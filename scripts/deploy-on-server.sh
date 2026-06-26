#!/usr/bin/env bash
set -euo pipefail

# Run on the production server (manually or via GitHub Actions SSH).
#
# Environment overrides:
#   DEPLOY_PATH          default /opt/seo/kyenai
#   DEPLOY_BRANCH        default main
#   DEPLOY_REPO_URL      default public GitHub URL
#   DEPLOY_GITHUB_TOKEN  optional token for private repo clone/pull

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEPLOY_PATH="${DEPLOY_PATH:-$ROOT_DIR}"
DEPLOY_BRANCH="${DEPLOY_BRANCH:-main}"
DEFAULT_REPO_URL="https://github.com/zhangshuaiqiang11/kyenai-news.git"

if [ -n "${DEPLOY_GITHUB_TOKEN:-}" ]; then
  DEPLOY_REPO_URL="${DEPLOY_REPO_URL:-https://x-access-token:${DEPLOY_GITHUB_TOKEN}@github.com/zhangshuaiqiang11/kyenai-news.git}"
else
  DEPLOY_REPO_URL="${DEPLOY_REPO_URL:-$DEFAULT_REPO_URL}"
fi

clone_or_update() {
  if [ ! -d "$DEPLOY_PATH/.git" ]; then
    mkdir -p "$(dirname "$DEPLOY_PATH")"
    git clone --branch "$DEPLOY_BRANCH" "$DEPLOY_REPO_URL" "$DEPLOY_PATH"
    return
  fi

  cd "$DEPLOY_PATH"
  git fetch origin "$DEPLOY_BRANCH"
  git checkout "$DEPLOY_BRANCH"
  git pull --ff-only origin "$DEPLOY_BRANCH"
}

echo "==> Deploy path: $DEPLOY_PATH"
echo "==> Deploy branch: $DEPLOY_BRANCH"

clone_or_update
cd "$DEPLOY_PATH"

if [ ! -f .env.production ]; then
  cp .env.production.example .env.production
  echo "WARNING: created .env.production from example. Edit secrets on the server."
fi

echo "==> Rebuilding and restarting containers"
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build
docker compose --env-file .env.production -f docker-compose.prod.yml ps

echo "==> Smoke checks"
curl -fsS -o /dev/null -w "homepage HTTP %{http_code}\n" http://127.0.0.1/ || true
curl -fsS -o /dev/null -w "llms.txt HTTP %{http_code}\n" http://127.0.0.1/llms.txt || true

echo "==> Deploy finished"
