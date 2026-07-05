<div align="center">

<img src="docs/assets/logo-dark.svg" alt="MergeMind" width="80" />

<br />
<br />

# MergeMind

### Find your next contribution in 30 seconds — not 3 hours

AI analyzes thousands of repositories and scores every issue by difficulty, merge probability, and career value.

<img src="docs/assets/banner.svg" alt="MergeMind Banner" width="100%" style="border-radius: 12px;" />

<br />

[![License: MIT](https://img.shields.io/badge/license-MIT-purple)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/BistaDinesh03/mergemind?style=flat&color=yellow)](https://github.com/BistaDinesh03/mergemind/stargazers)
[![Next.js 14](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.139-009688)](https://fastapi.tiangolo.com)
[![Python 3.11](https://img.shields.io/badge/Python-3.11+-blue)](https://python.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6)](https://typescriptlang.org)
[![Docker](https://img.shields.io/badge/Docker-ready-2496ED)](https://docker.com)
[![Tests](https://img.shields.io/badge/tests-16%20passed-green)]()
[![WCAG](https://img.shields.io/badge/WCAG-2.2%20AA-22c55e)]()

</div>

---

## The Problem

Every developer wants to contribute to open source. But the experience is broken.

You open GitHub. You see millions of open issues. You spend hours reading through them. You guess which one to pick. You submit a PR. It gets rejected. You start over.

Most developers never ship their first contribution. Not because they cannot code. Because finding the right issue is harder than writing the code.

---

## The Solution

MergeMind scans thousands of repositories, scores every open issue across 6 dimensions, and tells you exactly which one to work on. Each recommendation comes with a full AI breakdown explaining why that issue was chosen, how difficult it is, how long it will take, and whether your PR is likely to be accepted.

No more guessing. No more wasted hours. One clear recommendation. One click to start.

---

## Features

| Feature | Description |
|---------|-------------|
| **Issue Scoring** | Every open issue gets a 0–100 score based on difficulty, merge probability, time estimate, beginner friendliness, repository health, and issue clarity |
| **Repository Health Analysis** | Know if a repo is actively maintained before you invest time — scored on activity, documentation, community, and maintenance |
| **Explainable AI Recommendations** | Each recommendation explains why it was selected — no black box, no mystery scores |
| **AI Mentor** | Personalized advice for every issue — what to read, what to check, and what to expect |
| **Portfolio Builder** | Your merged PRs automatically become a shareable developer portfolio |
| **Command Palette** | Press Cmd+K to search repositories instantly — works like Raycast or Spotlight |
| **Dark Mode** | Premium dark theme designed for long coding sessions |
| **Accessible** | WCAG 2.2 AA compliant — works with keyboard navigation and screen readers |

---

## Screenshots

| Dashboard | Discover |
|:---:|:---:|
| <img src="docs/assets/screenshots/dashboard.png" alt="Dashboard" width="400" /> | <img src="docs/assets/screenshots/discover.png" alt="Discover" width="400" /> |

| Repository Analysis | Issue Analysis |
|:---:|:---:|
| <img src="docs/assets/screenshots/repository.png" alt="Repository" width="400" /> | <img src="docs/assets/screenshots/issue-analysis.png" alt="Issue Analysis" width="400" /> |

| Portfolio |
|:---:|
| <img src="docs/assets/screenshots/portfolio.png" alt="Portfolio" width="400" /> |

---

## Architecture

```mermaid
graph LR
    A[Browser] --> B[Next.js 14 Frontend]
    B --> C[FastAPI Backend]
    C --> D[GitHub REST API]
    C --> E[Ollama + Llama 3.2]
    C --> F[(SQLite / PostgreSQL)]
    B --> G[NextAuth.js]
    G --> H[GitHub OAuth]
Layer	Technology	Purpose
Frontend	Next.js 14, React 18, TypeScript, Tailwind CSS	Server components, type safety, zero-runtime CSS
Backend	FastAPI, Python 3.11, SQLAlchemy, Pydantic	Auto-generated API docs, async I/O, request validation
AI Engine	Ollama, Llama 3.2	Local LLM inference — zero API costs, complete privacy
Authentication	NextAuth.js, GitHub OAuth 2.0	Secure sign-in with minimal permissions
Database	SQLite (development), PostgreSQL (production)	Zero-config local, scalable cloud
Testing	pytest, Vitest, GitHub Actions CI	16 backend tests, frontend unit tests, CI on every push
DevOps	Docker, Docker Compose	One command to start the entire stack
Tech Stack
Category	Technology
Frontend	Next.js 14 · React 18 · TypeScript · Tailwind CSS
Backend	FastAPI · Python 3.11 · SQLAlchemy · Pydantic
AI / ML	Ollama · Llama 3.2
Authentication	NextAuth.js · GitHub OAuth 2.0
Database	SQLite · PostgreSQL
Testing	pytest (16 tests) · Vitest · GitHub Actions
DevOps	Docker · Docker Compose
Accessibility	WCAG 2.2 AA · ARIA labels · Keyboard navigation
Quick Start
Prerequisites
Docker Desktop installed

GitHub account for OAuth

1. Clone
bash
git clone https://github.com/BistaDinesh03/mergemind.git
cd mergemind
2. Configure GitHub OAuth
Go to GitHub Developer Settings

Create a new OAuth App

Set the callback URL to http://localhost:3000/api/auth/callback/github

Copy your Client ID and Client Secret

3. Set Environment Variables
Create backend/.env:

env
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
GITHUB_TOKEN=your_personal_access_token
SECRET_KEY=any-random-string-at-least-32-characters
DATABASE_URL=sqlite:///./mergemind.db
OLLAMA_HOST=http://ollama:11434
OLLAMA_MODEL=llama3.2:3b
4. Start
bash
docker compose up -d
5. Open
text
http://localhost:3000
Project Structure
text
mergemind/
├── backend/                  # FastAPI server
│   ├── app/
│   │   ├── routers/          # API endpoints
│   │   ├── services/         # Business logic + AI scoring
│   │   └── models/           # SQLAlchemy models
│   ├── tests/                # pytest (16 tests)
│   └── requirements.txt
├── frontend/                 # Next.js 14 app
│   ├── app/                  # Page components
│   ├── components/           # Reusable UI components
│   ├── lib/                  # API client and design system
│   └── __tests__/            # Vitest unit tests
├── docs/                     # Decision records and assets
├── .github/workflows/        # CI pipeline
├── ARCHITECTURE.md
├── CONTRIBUTING.md
├── DEPLOYMENT.md
├── LICENSE
├── docker-compose.yml
└── docker-compose.prod.yml
Documentation
Document	Description
Architecture	System design, data flow, scoring algorithms
Deployment Guide	Production deployment to Vercel, Railway, or Docker
Contributing Guide	Setup instructions and good first issues
Tech Decisions	Why we chose Ollama, FastAPI, and SQLite
Testing
bash
# Backend tests (16 tests, 100% passing)
cd backend
pip install pytest
pytest -v

# Frontend tests
cd frontend
npm test
Tests run automatically on every push via GitHub Actions.

Roadmap
Completed
GitHub OAuth authentication

Repository health scoring (4 factors)

Issue opportunity scoring (6 factors)

Personalized AI recommendations

AI Mentor with explainable advice

Portfolio generator

Command palette (Cmd+K)

Comprehensive test suite

WCAG 2.2 AA accessibility

Dark mode

Docker support

Planned
Production deployment

PostgreSQL migration

Contribution streak tracking

Weekly email digests

VS Code extension

Contributing
Contributions are welcome. See CONTRIBUTING.md for setup instructions and good first issues.

Good places to start:

Add a new scoring factor to the engine

Improve test coverage

Polish a UI component

Write clearer documentation

License
MIT © BistaDinesh03

<div align="center">
If this project helped you find a contribution, give it a ⭐

<br /> <br />
Built with ❤️ for the open source community

</div>
