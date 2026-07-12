# Changelog

All notable changes to MergeMind will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [1.0.0] — 2026-07-12

### Added

- GitHub OAuth login with NextAuth.js
- Dashboard with a personalized daily recommendation
- Discover page with search, language filter, and sort (responsive grid)
- Repository detail page with health scores and an AI summary
- Portfolio page with paginated GitHub repositories
- AI-powered issue recommendations using Google Gemini 2.5 Flash
- Recommendation history tracking in PostgreSQL
- Health checks for liveness, readiness, and full service status (`/health/live`, `/health/ready`), Kubernetes-compatible
- Rate limiting (100 requests / 60s per IP) and standard security headers (XSS, clickjacking, MIME sniffing, HSTS)
- JWT session verification via HMAC-SHA256
- Response caching: GitHub API (5-minute TTL), Gemini (10-minute TTL)
- Production Docker image — 215MB, Alpine, multi-stage build, non-root user
- Docker Compose for local development
- Startup validation — refuses to start if required config or secrets are missing
- Structured JSON logging with request tracing
- OpenAPI documentation with examples on all endpoints
- Parallel repo fetching in the recommendation engine (`asyncio.gather`)
- GZip compression for API responses over 500 bytes
- Input sanitization on all path and query parameters, backed by Pydantic request/response models
- CONTRIBUTING.md, ARCHITECTURE.md, DEPLOYMENT.md

### Changed

- Repository health scoring now uses real GitHub data instead of hardcoded values
- AI service only reasons over provided data — never fabricates statistics
- GitHub API client unified into a single service with connection pooling
- Portfolio endpoint supports pagination (`page`, `per_page`, `total_pages`)
- Frontend API URL is now configurable via `NEXT_PUBLIC_API_URL`
- Error responses standardized to JSON with `detail` and `type` fields
- Production mode hides API docs (`/docs`)
- Migrated Pydantic v2 `example` parameters to the `examples` format

### Fixed

- OAuth callback URL mismatch between GitHub and Vercel domains
- Overly permissive CORS config (was allowing all methods/headers in production)
- Hardcoded `localhost:8000` in the frontend, replaced with the environment variable
- Next.js SSR build failures when the API URL was empty
- Authentication bypass via a trusted `X-GitHub-User` header — JWT verification is now required
- Dashboard returning 500 instead of 401 for unauthenticated requests
- Portfolio no longer falls back to a hardcoded demo user
- SQLite permission errors on Railway — switched to PostgreSQL
- Docker build context excluding the Dockerfile; Vercel root directory not set to `frontend/`
- Assorted TypeScript errors across the discover, portfolio, and dashboard pages
- Bare `except` blocks replaced with specific exception types

### Security

- JWT session tokens verified with HMAC-SHA256 on every authenticated request
- `X-GitHub-User` header no longer trusted without a verified session
- No hardcoded secrets in source code; production refuses to start without required secrets
- CORS restricted to the specific production domain

## [0.1.0] — 2026-07-03

### Added

- Initial project scaffold
- FastAPI backend with basic GitHub API integration
- Next.js frontend with Tailwind CSS
- GitHub OAuth login (initial implementation)
- Basic repository search and display
- Docker setup for local development

[1.0.0]: https://github.com/BistaDinesh03/mergemind/releases/tag/v1.0.0
[0.1.0]: https://github.com/BistaDinesh03/mergemind/releases/tag/v0.1.0
