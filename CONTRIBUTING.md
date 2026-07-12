# Contributing to MergeMind

Thanks for your interest in contributing — MergeMind helps developers find their next open-source contribution, and it's built the same way.

## Quick links

- [Project Overview](01_PROJECT_OVERVIEW.md)
- [Tech Stack](02_TECH_STACK.md)
- [Quick Start](18_QUICK_START.md)
- [API Docs](04_API_DOCUMENTATION.md)

<br>

## Development setup

**Prerequisites:** Node.js 20+, Python 3.11+, Docker Desktop, Git, a GitHub account.

**Quick start (Docker):**

```bash
git clone https://github.com/BistaDinesh03/mergemind.git
cd mergemind
docker compose up -d
```

- Frontend: `http://127.0.0.1:3000`
- Backend: `http://127.0.0.1:8000`
- API docs: `http://127.0.0.1:8000/docs`

**Manual setup:**

```bash
# backend
cd backend
python -m venv venv
source venv/bin/activate  # venv\Scripts\activate on Windows
pip install -r requirements.txt
cp .env.example .env      # fill in your tokens
uvicorn app.main:app --reload

# frontend
cd frontend
npm install
cp .env.local.example .env.local  # fill in your tokens
npm run dev
```

<br>

## Branch naming

```
feature/short-description
fix/short-description
docs/short-description
refactor/short-description
```

Examples: `fix/oauth-callback-url`, `feature/repo-health-score`, `docs/api-endpoints`

<br>

## Commit messages

We follow [Conventional Commits](https://www.conventionalcommits.org):

```
feat: add repository health scoring
fix: handle GitHub rate limit 429
docs: update API documentation
refactor: extract GitHub client into service
security: validate JWT session tokens
perf: add Gemini response caching
test: add portfolio endpoint tests
chore: update dependencies
```

<br>

## Pull request process

1. Fork the repo and create your branch from `main`
2. Make your changes, following the coding standards below
3. Test locally: `npm run build` (frontend) and `python -m pytest` (backend)
4. Confirm there are no TypeScript errors and no linting errors
5. Write a clear PR description — what changed, why, and how you tested it
6. Request review from a maintainer
7. Address feedback and squash commits if requested

<br>

## Coding standards

**Frontend (TypeScript/React)**

- Functional components with hooks
- Type all props with interfaces
- Use the `"use client"` directive for client components
- API calls use `process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"`
- Tailwind CSS, utility-first
- Pages live in `app/`, reusable components in `components/`

**Backend (Python/FastAPI)**

- Follow PEP 8
- Type all function signatures
- Use Pydantic models for request/response bodies
- Services hold business logic; routers only handle HTTP
- Use the unified `github_client` for all GitHub API calls — no ad hoc requests
- Never hardcode usernames or demo data
- Raise `HTTPException` with proper status codes

<br>

## Project structure

```text
mergemind/
├── backend/
│   └── app/
│       ├── main.py          # FastAPI entry point
│       ├── config.py        # Settings + validation
│       ├── routers/         # API endpoints
│       ├── services/        # Business logic
│       ├── models/          # Database models
│       └── monitoring.py    # Health checks, logging
├── frontend/
│   └── app/                 # Next.js App Router pages
│       └── components/      # Reusable React components
└── docker-compose.yml       # Local dev setup
```

<br>

## Testing before submitting

```bash
# frontend — must pass with zero errors
cd frontend
npm run build
npm run lint

# backend — all tests pass
cd backend
python -m pytest
```

**Manual checks:**

- [ ] Sign in with GitHub works
- [ ] Dashboard loads user data
- [ ] Discover page searches and filters
- [ ] Repository detail page opens
- [ ] Portfolio shows repositories
- [ ] No console errors in the browser
- [ ] Health endpoint returns 200

<br>

## Good first issues

Look for issues labeled `good first issue`. These are curated for new contributors and include a clear problem description, expected behavior, files to modify, and testing instructions.

<br>

## Code of conduct

This project follows the [Contributor Covenant](https://www.contributor-covenant.org/). By participating, you agree to uphold it.

<br>

## Questions?

Open an issue on GitHub, check the `docs/` folder, or review the [API Documentation](04_API_DOCUMENTATION.md) for endpoint details.
