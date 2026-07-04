# Contributing to MergeMind

## Quick Start
git clone https://github.com/BistaDinesh03/mergemind.git
cd mergemind
docker compose up -d

## Project Structure
mergemind/
  backend/          FastAPI server
    app/routers/    API endpoints
    app/services/   Business logic + scoring
    app/models/     SQLAlchemy models
  frontend/         Next.js app
    app/            Page components
    components/     Reusable UI
    lib/            API client, hooks
  docker-compose.yml

## Good First Issues
- Add a new scoring factor to backend/app/services/issue_scorer.py
- Improve test coverage in backend/tests/
- Add component stories for frontend/components/

## Pull Request Process
1. Fork the repository
2. Create a feature branch
3. Commit with conventional commits (feat:, fix:, docs:)
4. Push and open a Pull Request

## Code Style
Python: PEP 8, type hints required
TypeScript: Strict mode, no any types
Commits: Conventional commits