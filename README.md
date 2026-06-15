# KyenAI AI Coding Agent Playbooks + GSC Iteration MVP

KyenAI is a single-site MVP for evidence-led AI coding agent playbooks. It includes a Next.js SSR/ISR frontend and a FastAPI automation backend for search-metric collection, source crawling, optimization jobs, validation, publishing, and rollback.

## What Is Implemented

- Next.js pages for homepage, articles, categories, tags, author profile, `sitemap.xml`, and `robots.txt`.
- Source ledger route at `/sources`.
- Entity ledger route at `/entities` for official brand/product mentions, watchlist status, and non-endorsement boundaries.
- Five demand-led guide pages covering AI coding agent instruction files, Claude Code subagents, Claude Code hooks and MCP, MCP security, and Antigravity CLI migration.
- Current AI coding article inventory covering OpenAI Codex, GitHub Copilot, Claude Code, Cursor Enterprise, and Google's Antigravity CLI transition.
- Homepage search, category filters, source filters, topic counts, and sort controls.
- Server-rendered article SEO metadata, canonical URLs, OpenGraph tags, source lists, visible update dates, and Article JSON-LD.
- GA4 bootstrap and Web Vitals event reporting when `NEXT_PUBLIC_GA_ID` is configured.
- FastAPI endpoints matching the plan:
  - `GET /api/articles`
  - `GET /api/articles/{slug}`
  - `POST /api/admin/sources`
  - `POST /api/jobs/collect-search-metrics`
  - `POST /api/jobs/crawl-sources`
  - `POST /api/jobs/optimize-article`
  - `POST /api/jobs/publish-approved-patch`
  - `POST /api/jobs/rollback/{article_id}`
- Guardrails for evidence requirements, template-like language, keyword stuffing, and fake freshness.
- Deterministic local automation flow with seed data, plus environment hooks for OpenAI, GSC, GA4, Bing Webmaster, IndexNow, Postgres, Redis, and Celery.

## Run Locally

Install dependencies:

```bash
python3 -m pip install -r backend/requirements.txt
npm install --prefix frontend
```

Start the backend:

```bash
npm run dev:api
```

Start the frontend in another terminal:

```bash
npm run dev:web
```

Open:

```text
http://localhost:3000
```

## Verify

```bash
npm run test
npm run build
```

## Production Deployment

The production stack is defined in `docker-compose.prod.yml` and uses Caddy as the public reverse proxy. Only Caddy publishes ports `80` and `443`; frontend, backend, Postgres, and Redis stay on the private Docker network.

### DNS

Create these DNS records before enabling the domain deployment:

```text
www.kyenai.com  A  <server-ip>
api.kyenai.com  A  <server-ip>
```

Caddy will request HTTPS certificates automatically after the records resolve to the server. The `Caddyfile` also keeps a plain HTTP fallback for temporary IP access: `http://<server-ip>` proxies to the frontend, and `http://<server-ip>/api/*` proxies to the backend.

### Server Setup

Install Docker Engine and the Docker Compose plugin on the server, then copy or pull this repository onto the server. From the repository root:

```bash
cp .env.production.example .env.production
```

Edit `.env.production` and replace placeholder values. The default production domains are:

```env
FRONTEND_DOMAIN=www.kyenai.com
API_DOMAIN=api.kyenai.com
NEXT_PUBLIC_SITE_URL=https://www.kyenai.com
NEXT_PUBLIC_API_BASE_URL=https://api.kyenai.com
API_BASE_URL=http://backend:8000
```

For temporary IP-only testing before DNS is ready, set `NEXT_PUBLIC_SITE_URL=http://<server-ip>` and `NEXT_PUBLIC_API_BASE_URL=/api`, then rebuild the frontend image.

### Start Production

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build
```

Check service status and logs:

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml ps
docker compose --env-file .env.production -f docker-compose.prod.yml logs -f caddy
docker compose --env-file .env.production -f docker-compose.prod.yml logs -f frontend backend
```

### Update Deployment

After pulling new code on the server, rebuild and restart:

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build
docker compose --env-file .env.production -f docker-compose.prod.yml logs -f frontend backend caddy
```

To stop the app without deleting database volumes:

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml down
```

### Production Notes

- The MVP defaults to an in-memory content store so it can run immediately.
- Use `docs/production-seo-data-setup.md` before launch to connect GSC, GA4, Bing Webmaster, IndexNow, and PageSpeed Insights with real credentials.
- Run `npm run audit:pagespeed` after deployment to collect public PageSpeed lab and field data into `artifacts/`.
- Use the existing `docker-compose.yml` only for local Postgres/Redis infrastructure; production uses `docker-compose.prod.yml`.
- Replace `ContentStore` with a SQLAlchemy repository backed by `DATABASE_URL` before relying on persisted production content.
- The Celery file is included as the background-task boundary; persistent production jobs should call the same service functions with a database-backed store.
- The external integrations are intentionally env-gated. If a credential is missing, the local MVP keeps using deterministic seed data instead of pretending to have live search-platform access.
- Article facts should keep using official or high-confidence source pages; unverified rumor-style AI coding news should remain out of the auto-publish path.
