<div align="center">
  <img src="docs/assets/logo-dark.svg" alt="MergeMind logo" width="96" />

  # MergeMind

  AI-powered GitHub issue recommendation platform.

  [![License: MIT](https://img.shields.io/badge/license-MIT-purple)](LICENSE)
  [![Build](https://img.shields.io/github/actions/workflow/status/BistaDinesh03/mergemind/ci.yml?label=build)](https://github.com/BistaDinesh03/mergemind/actions)
  [![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org)
  [![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688)](https://fastapi.tiangolo.com)
  [![Python](https://img.shields.io/badge/Python-3.11-3776AB)](https://python.org)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6)](https://www.typescriptlang.org)
  [![Docker](https://img.shields.io/badge/Docker-ready-2496ED)](https://docker.com)
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)](CONTRIBUTING.md)
  [![Stars](https://img.shields.io/github/stars/BistaDinesh03/mergemind?color=yellow)](https://github.com/BistaDinesh03/mergemind/stargazers)

  <img src="docs/assets/banner.svg" alt="MergeMind banner" width="100%" />

  [Live Demo](https://mergemind.dev) &nbsp;·&nbsp; [Documentation](ARCHITECTURE.md)
</div>

<br>

## Why MergeMind Exists

Most developers who want to contribute to open source start the same way: they open GitHub, search for something, and get a wall of issues with no real signal attached.

Search results don't tell you if a maintainer actually responds to pull requests. They don't tell you if an issue has been sitting untouched for a year, or if three other people already tried and gave up in the comments. "Good first issue" labels help a little, but they're applied inconsistently across projects and say nothing about whether the repository itself is healthy.

So people end up doing the filtering by hand — opening a dozen tabs, reading through stale threads, guessing at scope. That's an hour gone before a single line of code gets written.

MergeMind automates that filtering step. It pulls repository and issue data from GitHub, runs it through a scoring model, and gives a ranked recommendation with a plain-language explanation attached.

<br>

## Project Status

- [x] Production Ready
- [x] Actively Maintained
- [x] Open Source
- [x] MIT Licensed
- [x] Docker Ready
- [x] GitHub OAuth
- [x] AI Powered

<br>

## Current Release

**Version:** `v1.0.0`
**Status:** Production Ready

The first stable release includes GitHub OAuth login, repository health analysis, AI-powered issue scoring, portfolio tracking, and full Docker support. See [CHANGELOG.md](CHANGELOG.md) for details.

<br>

## Product Overview

MergeMind connects to your GitHub account, analyzes repositories you're interested in, and scores their open issues on difficulty, clarity, and merge likelihood. You get one dashboard, one ranked list, and a reason for every recommendation.

<div align="center">
  <img src="docs/assets/screenshots/dashboard.png" alt="MergeMind dashboard" width="100%" />
</div>

<br>

## Features

| Feature | Description | Benefit |
|---|---|---|
| Issue scoring | Scores each issue on difficulty, merge probability, and clarity | Skip issues that are dead ends before opening them |
| Repository health analysis | Checks activity, maintenance, and community responsiveness | Avoid contributing to abandoned repos |
| AI-generated explanations | Every recommendation comes with a short reasoning summary | Understand why an issue was picked, not just that it was |
| Portfolio tracking | Builds a record from your merged pull requests | Have proof of contribution without manual tracking |
| GitHub OAuth login | Sign in with your existing GitHub account | No separate account or password to manage |
| Dark mode | Full dark theme across the interface | Comfortable for long sessions |

<br>

## Screenshots

<div align="center">

<img src="docs/assets/screenshots/dashboard.png" width="100%" alt="Dashboard" />

<br><br>

<img src="docs/assets/screenshots/discover.png" width="100%" alt="Discover" />

<br><br>

<img src="docs/assets/screenshots/repository.png" width="100%" alt="Repository Analysis" />

<br><br>

<img src="docs/assets/screenshots/issue-analysis.png" width="100%" alt="Issue Analysis" />

<br><br>

<img src="docs/assets/screenshots/portfolio.png" width="100%" alt="Portfolio" />

</div>

<br>

## Demo

<div align="center">
  <img src="docs/assets/demo.gif" alt="MergeMind demo" width="100%" />

  **Demo Coming Soon**

  A full walkthrough video will be added after the first stable release.
</div>

<br>

## How It Works
GitHub Login
↓
Repository Analysis
↓
AI Scoring
↓
Recommendation
↓
Open GitHub
↓
Submit PR

<br>

## Architecture

```mermaid
flowchart LR

A[Developer]

B[Next.js Frontend]

C[FastAPI Backend]

D[GitHub API]

E[AI Recommendation Engine]

F[(SQLite / PostgreSQL)]

A --> B

B --> C

C --> D

C --> E

E --> F
```

| Layer | Responsibility |
|---|---|
| Frontend | Renders the dashboard, handles the OAuth session, calls the backend API |
| Backend | Coordinates GitHub data fetching, scoring requests, and persistence |
| GitHub API | Source of repository, issue, and pull request data |
| AI Recommendation Engine | Runs Llama 3.2 through Ollama to score issues and generate explanations |
| Database | Stores users, scores, and portfolio history |

<br>

## Tech Stack

| Category | Technology | Purpose |
|---|---|---|
| Frontend | Next.js 14, React 18, TypeScript | Application UI |
| Styling | Tailwind CSS | Layout and theming |
| Backend | FastAPI, Python 3.11 | REST API |
| Data layer | SQLAlchemy | ORM and models |
| AI engine | Ollama, Llama 3.2 | Local issue scoring, no external API cost |
| Auth | NextAuth, GitHub OAuth | Sign-in and session handling |
| Database | SQLite (dev), PostgreSQL (prod) | Persistence |
| Infrastructure | Docker | Local and production deployment |
| CI/CD | GitHub Actions | Automated testing on push |

<br>

## Folder Structure

```text
mergemind/
├── backend/
│   ├── app/
│   │   ├── routers/       # API route handlers
│   │   └── services/      # Scoring and analysis logic
│   └── tests/              # Backend test suite
├── frontend/
│   ├── app/                 # Next.js pages and layouts
│   └── components/          # UI components
├── docs/                     # Documentation and assets
├── docker-compose.yml
└── docker-compose.prod.yml
```

<br>

## Quick Start

**Clone the repository**

```bash
git clone https://github.com/BistaDinesh03/mergemind.git
cd mergemind
```

**Set environment variables**

```bash
cp backend/.env.example backend/.env
```

**Start with Docker**

```bash
docker compose up -d
```

**Open the app**

```bash
open http://localhost:3000
```

<br>

## Environment Variables

| Variable | Required | Description | Example |
|---|---|---|---|
| `GITHUB_CLIENT_ID` | Yes | OAuth client ID from your GitHub App | `Iv1.abc123` |
| `GITHUB_CLIENT_SECRET` | Yes | OAuth client secret | `••••••••` |
| `DATABASE_URL` | Yes | Connection string for SQLite or PostgreSQL | `postgresql://user:pass@localhost/mergemind` |
| `OLLAMA_HOST` | Yes | Address of the local Ollama instance | `http://localhost:11434` |
| `NEXTAUTH_SECRET` | Yes | Secret used to encrypt session tokens | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | No | Base URL of the frontend | `http://localhost:3000` |

<br>

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health check |
| `GET` | `/api/repositories` | List analyzed repositories |
| `POST` | `/api/repositories/analyze` | Run health analysis on a repository |
| `GET` | `/api/issues/{repo_id}` | List scored issues for a repository |
| `GET` | `/api/recommendations` | Fetch the current top recommendation |
| `GET` | `/api/portfolio` | Fetch a user's contribution portfolio |
| `POST` | `/api/auth/callback` | GitHub OAuth callback |

<br>

## Documentation

| Document | Purpose | Link |
|---|---|---|
| Architecture | System design and data flow | [ARCHITECTURE.md](ARCHITECTURE.md) |
| Deployment | Production setup and configuration | [DEPLOYMENT.md](DEPLOYMENT.md) |
| Contributing | How to submit changes | [CONTRIBUTING.md](CONTRIBUTING.md) |
| Changelog | Version history | [CHANGELOG.md](CHANGELOG.md) |
| License | MIT license text | [LICENSE](LICENSE) |

<br>

## Roadmap

**Completed**
- [x] GitHub OAuth login
- [x] Repository health analysis
- [x] Issue scoring engine
- [x] AI-generated recommendation explanations
- [x] Portfolio tracking
- [x] Dark mode

**In Progress**
- [ ] Production deployment
- [ ] PostgreSQL migration for hosted instances

**Future**
- [ ] Demo walkthrough video
- [ ] Browser extension

<br>

## Contributing

1. Fork the repository
2. Create a branch: `git checkout -b feature/your-feature`
3. Make your changes and add tests where relevant
4. Run the test suite: `pytest` (backend) and `npm run test` (frontend)
5. Open a pull request with a clear description

See [CONTRIBUTING.md](CONTRIBUTING.md) for full guidelines. Issues labeled `good first issue` are a good place to start.

<br>

## License

MIT © [BistaDinesh03](https://github.com/BistaDinesh03)

<br>

<div align="center">

**Built for developers who love open source.**

If MergeMind is useful to you, consider giving it a star, forking it, or opening a pull request. Bug reports and feature ideas are always welcome.

[⭐ Star](https://github.com/BistaDinesh03/mergemind/stargazers) &nbsp;·&nbsp; [🍴 Fork](https://github.com/BistaDinesh03/mergemind/fork) &nbsp;·&nbsp; [🤝 Contribute](CONTRIBUTING.md) &nbsp;·&nbsp; [Report an Issue](https://github.com/BistaDinesh03/mergemind/issues)

</div>
