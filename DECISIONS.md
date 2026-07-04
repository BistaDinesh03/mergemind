# Technology Decision Records

## TDR-001: Ollama over OpenAI API
Date: 2026-07-01 | Status: Accepted
Decision: Use Ollama with Llama 3.2 instead of OpenAI API.
Rationale: Zero cost, complete privacy, works offline, full model control.
Trade-offs: Slower inference (5-10s vs 1-2s), requires local GPU/RAM.

## TDR-002: SQLite for Development, PostgreSQL for Production
Date: 2026-07-01 | Status: Accepted
Decision: Use SQLite locally, PostgreSQL in production.
Rationale: Zero configuration for dev, SQLAlchemy makes migration trivial.

## TDR-003: FastAPI over Express.js
Date: 2026-07-01 | Status: Accepted
Decision: Use FastAPI (Python) instead of Express (Node.js).
Rationale: Auto OpenAPI docs, Pydantic validation, better ML ecosystem.