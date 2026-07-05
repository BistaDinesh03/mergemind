# MergeMind - AI-Powered Open Source Intelligence Platform

[![License: MIT](https://img.shields.io/badge/license-MIT-purple)](LICENSE)
[![Next.js 14](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.139-009688)](https://fastapi.tiangolo.com)
[![Python 3.11](https://img.shields.io/badge/Python-3.11+-blue)](https://python.org)
[![Docker](https://img.shields.io/badge/Docker-ready-2496ED)](https://docker.com)
[![Tests](https://img.shields.io/badge/tests-16%20passed-green)]()

## Why MergeMind exists

Most developers want to contribute to open source but do not know where to start. MergeMind scans repositories, scores every open issue, and gives you one clear recommendation.

## Key Features

- Issue scoring (0-100) across difficulty, merge chance, and clarity
- Repository health analysis
- Explainable AI recommendations
- Portfolio builder from merged PRs
- Command palette (Cmd+K)
- WCAG 2.2 AA accessible

## Quick Start

git clone https://github.com/BistaDinesh03/mergemind.git
cd mergemind
docker compose up -d
open http://localhost:3000

## Tech Stack

Frontend: Next.js 14, TypeScript, Tailwind CSS
Backend: FastAPI, Python, SQLAlchemy
AI: Ollama + Llama 3.2
Auth: NextAuth.js + GitHub OAuth
Testing: pytest (16 tests), Vitest, GitHub Actions CI

## Documentation

- Architecture: ARCHITECTURE.md
- Deployment: DEPLOYMENT.md
- Contributing: CONTRIBUTING.md
- API Reference: http://localhost:8000/docs

## License

MIT