# MergeMind Architecture

## System Overview

MergeMind is an AI-powered platform that helps developers find the best GitHub issues to contribute to.

## Technology Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | Next.js 14, React 18, TypeScript, Tailwind CSS | Server components, type safety |
| Backend | FastAPI, Python 3.11, Pydantic, SQLAlchemy | Auto-docs, async, validation |
| AI | Ollama, Llama 3.2 | Local LLM, zero API costs |
| Auth | NextAuth.js, GitHub OAuth | Secure, minimal permissions |
| Database | SQLite (dev), PostgreSQL (prod) | Simple local, scalable cloud |
| DevOps | Docker, Docker Compose | One-command environment |

## Data Flow

User Login -> GitHub OAuth -> JWT Token -> Frontend Session
Dashboard Load -> Portfolio API -> GitHub API -> User Stats
Recommendation Engine -> GitHub Search API -> Issue Scoring -> AI Analysis
Issue Display -> AI Mentor Card -> View Details -> Open on GitHub

## Scoring Algorithms

### Repository Health Score (0-100)
Activity 40% - Recent commits, PR merges, response rate
Documentation 25% - README, CONTRIBUTING.md, Wiki
Community 20% - Stars, forks, watchers, discussions
Maintenance 15% - Issue handling, release frequency

### Issue Opportunity Score (0-100)
Difficulty 25% - Labels, scope, complexity
Merge Probability 20% - Historical merge rate
Beginner Friendliness 20% - Good first issue labels
Time Estimate 15% - Scope, file count
Issue Clarity 10% - Description quality
Repo Health 10% - Overall repository health

## Design Decisions

### Why Ollama over OpenAI?
Zero cost for inference, complete privacy, works offline, full control over model

### Why FastAPI over Express?
Automatic OpenAPI docs, Pydantic validation, async native, better ML ecosystem

### Why SQLite for development?
Zero configuration, single portable file, SQLAlchemy makes PostgreSQL migration easy