# MergeMind - AI-Powered Open Source Intelligence Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.139-009688)](https://fastapi.tiangolo.com/)
[![Docker](https://img.shields.io/badge/Docker-ready-2496ED)](https://docker.com)
[![Tests](https://img.shields.io/badge/tests-16%20passed-green)]()

**Stop searching. Start contributing.** AI finds the best GitHub issues, scores every opportunity, and builds your portfolio.

## Features
- AI Mentor - Explains WHY each issue is recommended
- Health Scoring - 4-factor repository analysis (0-100)
- Opportunity Score - 6-factor issue evaluation
- Portfolio - Auto-generated from your GitHub
- Command Palette - Cmd+K search like Raycast

## Quick Start
git clone https://github.com/BistaDinesh03/mergemind.git
cd mergemind
docker compose up -d
Open http://localhost:3000

## Documentation
- Architecture: ARCHITECTURE.md
- Deployment: DEPLOYMENT.md
- Contributing: CONTRIBUTING.md
- API Reference: http://localhost:8000/docs

## Tech Stack
Frontend: Next.js 14, TypeScript, Tailwind CSS
Backend: FastAPI, Python, SQLAlchemy
AI: Ollama + Llama 3.2
Auth: NextAuth.js + GitHub OAuth
Testing: pytest (16 tests), Vitest, GitHub Actions CI

## License
MIT