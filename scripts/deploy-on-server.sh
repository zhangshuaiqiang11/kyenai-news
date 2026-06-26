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
  if [ -d "$DEPLOY_PATH/.git" ]; then
    cd "$DEPLOY_PATH"
    git fetch origin "$DEPLOY_BRANCH"
    git checkout "$DEPLOY_BRANCH"
    git pull --ff-only origin "$DEPLOY_BRANCH"
    return
  fi

  local env_backup=""
  if [ -f "$DEPLOY_PATH/.env.production" ]; then
    env_backup="$(mktemp)"
    cp "$DEPLOY_PATH/.env.production" "$env_backup"
    echo "==> Preserved existing .env.production"
  fi

  if [ -d "$DEPLOY_PATH" ]; then
    echo "==> Replacing non-git deploy directory at $DEPLOY_PATH"
    rm -rf "$DEPLOY_PATH"
  fi

  mkdir -p "$(dirname "$DEPLOY_PATH")"
  git clone --branch "$DEPLOY_BRANCH" "$DEPLOY_REPO_URL" "$DEPLOY_PATH"

  if [ -n "$env_backup" ] && [ -f "$env_backup" ]; then
    cp "$env_backup" "$DEPLOY_PATH/.env.production"
    rm -f "$env_backup"
  fi
}

echo "==> Deploy path: $DEPLOY_PATH"
echo "==> Deploy branch: $DEPLOY_BRANCH"

clone_or_update
cd "$DEPLOY_PATH"

if [ ! -f .env.production ]; then
  cp .env.production.example .env.production
  echo "WARNING: created .env.production from example. Edit secrets on the server."
fi

export COMPOSE_PROJECT_NAME="${COMPOSE_PROJECT_NAME:-kyenai}"
compose_cmd=(docker compose --env-file .env.production -f docker-compose.prod.yml)

report_port_bindings() {
  echo "==> Current listeners for ports 80 and 443"
  docker ps --format 'table {{.Names}}\t{{.Ports}}' | awk 'NR == 1 || /0\.0\.0\.0:(80|443)->|:::(80|443)->/'

  if command -v ss >/dev/null 2>&1; then
    ss -ltnp '( sport = :80 or sport = :443 )' || true
  elif command -v lsof >/dev/null 2>&1; then
    lsof -nP -iTCP:80 -iTCP:443 -sTCP:LISTEN || true
  fi
}

assert_edge_ports_available() {
  local occupied
  occupied="$(
    docker ps --format '{{.Names}}\t{{.Ports}}' |
      awk '/0\.0\.0\.0:(80|443)->|:::(80|443)->/ { print }'
  )"

  if [ -n "$occupied" ]; then
    echo "ERROR: ports 80 or 443 are still allocated after stopping the current compose project." >&2
    echo "$occupied" >&2
    echo "Stop the stale container or host web server shown above, then rerun the deploy." >&2
    return 1
  fi
}

echo "==> Rebuilding and restarting containers"
echo "==> Compose project: $COMPOSE_PROJECT_NAME"
report_port_bindings
"${compose_cmd[@]}" down --remove-orphans
report_port_bindings
assert_edge_ports_available
"${compose_cmd[@]}" up -d --build
"${compose_cmd[@]}" ps

echo "==> Smoke checks"
curl -fsS -o /dev/null -w "homepage HTTP %{http_code}\n" http://127.0.0.1/ || true
curl -fsS -o /dev/null -w "llms.txt HTTP %{http_code}\n" http://127.0.0.1/llms.txt || true

echo "==> Deploy finished"
