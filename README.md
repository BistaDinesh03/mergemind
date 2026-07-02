<!-- PROJECT HEADER -->
<div align="center">

<img src="https://raw.githubusercontent.com/BistaDinesh03/mergemind/main/frontend/public/logo.png" alt="MergeMind Logo" width="120" height="120" />

# 🧠 MergeMind

### The AI-Powered Open Source Intelligence Platform

*Find the right issue. Make the right contribution. Build your career.*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.11+](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![Next.js 14](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green.svg)](https://fastapi.tiangolo.com/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

<p align="center">
  <img src="https://raw.githubusercontent.com/BistaDinesh03/mergemind/main/frontend/public/demo.gif" alt="MergeMind Demo" width="700" />
</p>

</div>

---

## 🤔 The Problem

Every day, millions of developers open GitHub and ask themselves the same questions:

| 😫 Pain Point | 💭 Question |
|---------------|------------|
| **Wasted Time** | "Which issue is actually worth solving?" |
| **Ghosting** | "Will my PR even get reviewed?" |
| **Uncertainty** | "Is the maintainer active anymore?" |
| **Competition** | "Is someone already working on this?" |
| **Career Growth** | "Will this contribution help my resume?" |
| **Trust Issues** | "Is this repository healthy or dead?" |

> **GitHub gives you data. MergeMind gives you intelligence.**

---

## 💡 Our Solution

Imagine opening MergeMind and instantly seeing:
┌────────────────────────────────────────────┐
│ Today's Best Opportunity │
│ │
│ Repository: FastAPI │
│ Health: ████████░░ 97% │
│ Difficulty: 🟢 Easy │
│ Merge Rate: █████████░ 91% │
│ Time: ⏱️ 1.5 hours │
│ Skills: Python • APIs │
│ Verdict: ⭐ Highly Recommended │
│ │
└────────────────────────────────────────────┘

text

**No more guessing. Just clarity.**

---

## ✨ Features

<table>
  <tr>
    <td width="50%">
      <h3>📊 Repository Health Score</h3>
      <p>Every repo gets a 0-100 score analyzing maintainer activity, documentation, tests, and response time.</p>
    </td>
    <td width="50%">
      <h3>🎯 Opportunity Score</h3>
      <p>Every issue ranked by difficulty, maintainer friendliness, competition level, and learning value.</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>🔮 Merge Probability</h3>
      <p>AI predicts your PR's chance of being merged before you write a single line of code.</p>
    </td>
    <td width="50%">
      <h3>📅 Daily Planner</h3>
      <p>Tells you exactly which issues to work on today based on your available time.</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>🤖 AI Assistant</h3>
      <p>Guides you: "Read this file first", "Add tests here", "Keep PR under 200 lines".</p>
    </td>
    <td width="50%">
      <h3>💼 Portfolio Generator</h3>
      <p>Every merged PR becomes part of your professional portfolio automatically.</p>
    </td>
  </tr>
</table>

---

## 🏗️ Architecture
┌─────────────────────────────────────────────────────┐
│ User Browser │
│ (Next.js Frontend) │
└─────────────────────┬───────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────┐
│ FastAPI Backend │
│ ┌──────────┬──────────┬──────────┬──────────────┐ │
│ │ Auth │ GitHub │ Scoring │ AI Engine │ │
│ │ Service │ API │ Engine │ (Ollama) │ │
│ └──────────┴──────────┴──────────┴──────────────┘ │
│ │ │
│ SQLite / PostgreSQL │
└─────────────────────────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────┐
│ External Services │
│ ┌──────────────┬──────────────┬─────────────────┐ │
│ │ GitHub API │ Ollama │ NextAuth.js │ │
│ └──────────────┴──────────────┴─────────────────┘ │
└─────────────────────────────────────────────────────┘

text

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Technology | Why |
|-------|-----------|-----|
| **Frontend** | ![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js) ![React](https://img.shields.io/badge/React-18-blue?logo=react) ![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript) | Modern, fast, type-safe |
| **Backend** | ![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?logo=fastapi) ![Python](https://img.shields.io/badge/Python-3.11+-3776AB?logo=python) ![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-ORM-red) | High performance, easy APIs |
| **AI/ML** | ![Ollama](https://img.shields.io/badge/Ollama-Llama_3-white) ![Qwen](https://img.shields.io/badge/Qwen-2.5-purple) | Local LLM, no API costs |
| **DevOps** | ![Docker](https://img.shields.io/badge/Docker-🐳-2496ED?logo=docker) ![Git](https://img.shields.io/badge/Git-F05032?logo=git) | Consistent environments |
| **Auth** | ![GitHub](https://img.shields.io/badge/GitHub-OAuth-181717?logo=github) | Dev-friendly login |

</div>

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have installed:

- **[Python 3.11+](https://www.python.org/downloads/)**
- **[Node.js 18+](https://nodejs.org/)**
- **[Docker Desktop](https://www.docker.com/products/docker-desktop/)**
- **[Git](https://git-scm.com/downloads)**
- **[Ollama](https://ollama.com/download)**

### One-Command Setup

```bash
# 1️⃣ Clone the repository
git clone https://github.com/BistaDinesh03/mergemind.git
cd mergemind

# 2️⃣ Pull AI models (one-time setup, ~8GB)
ollama pull llama3:8b
ollama pull qwen2.5:7b

# 3️⃣ Start everything with Docker
docker-compose up --build
Manual Setup (Without Docker)
bash
# Terminal 1: Backend
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env      # Fill in your GitHub tokens
uvicorn app.main:app --reload --port 8000

# Terminal 2: Frontend
cd frontend
npm install
cp .env.local.example .env.local
npm run dev

# Terminal 3: Ollama (must be running)
ollama serve
Access the App
Service	URL
🌐 Frontend	http://localhost:3000
🔧 Backend API	http://localhost:8000
📚 API Docs	http://localhost:8000/docs
🤖 Ollama API	http://localhost:11434
🔑 Environment Variables
Backend (backend/.env)
bash
# GitHub API
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
GITHUB_REDIRECT_URI=http://localhost:3000/api/auth/callback/github

# Database
DATABASE_URL=sqlite:///./mergemind.db

# Ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3:8b

# Auth
SECRET_KEY=your_secret_key_here
Frontend (frontend/.env.local)
bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret
📖 API Reference
Key Endpoints
Method	Endpoint	Description
GET	/api/health	Health check
GET	/api/dashboard	User statistics
GET	/api/planner/daily?hours=1	Daily issue recommendations
GET	/api/repositories/{id}/health	Repository health score
GET	/api/issues/{id}/opportunity	Issue opportunity score
GET	/api/issues/{id}/merge-probability	Merge prediction
POST	/api/assistant/chat	AI assistant query
GET	/api/portfolio/{username}	Portfolio generation
Full Swagger docs available at /docs when backend is running.

🗺️ Roadmap
Month 1: Foundation (Git, Docker, Backend, Frontend, GitHub API, Auth)

Month 2: Core Intelligence (Health Score, Opportunity Score, Daily Planner)

Month 3: AI Layer (Merge Prediction, AI Assistant, Recommendations)

Month 4: Polish (Better UI, Testing, Documentation, Launch)

📸 Screenshots
<div align="center">
Dashboard
<img src="https://raw.githubusercontent.com/BistaDinesh03/mergemind/main/frontend/public/screenshots/dashboard.png" width="800" alt="Dashboard" />
Repository Health
<img src="https://raw.githubusercontent.com/BistaDinesh03/mergemind/main/frontend/public/screenshots/health.png" width="800" alt="Health Score" />
AI Assistant
<img src="https://raw.githubusercontent.com/BistaDinesh03/mergemind/main/frontend/public/screenshots/assistant.png" width="800" alt="AI Assistant" /></div>
🤝 Contributing
We love contributions! Here's how to get started:

Fork the repository

Clone your fork: git clone https://github.com/YOUR_USERNAME/mergemind.git

Create a branch: git checkout -b feature/amazing-feature

Commit changes: git commit -m 'Add amazing feature'

Push: git push origin feature/amazing-feature

Open a Pull Request

See CONTRIBUTING.md for detailed guidelines.

👨‍💻 The Developer
<div align="center">
Dinesh Bista
"Building tools that make open source better for everyone."

https://img.shields.io/badge/GitHub-BistaDinesh03-181717?logo=github
https://img.shields.io/badge/LinkedIn-Connect-0A66C2?logo=linkedin
https://img.shields.io/badge/Twitter-Follow-1DA1F2?logo=twitter

</div>
⭐ Support This Project
If MergeMind helped you find your next great contribution:

⭐ Star this repository

🐦 Share on social media

💬 Tell your developer friends

🐛 Report bugs or suggest features

📄 License
This project is licensed under the MIT License — see the LICENSE file for details.

<div align="center">
text
Made with ❤️ by Dinesh Bista
Building the future of open source contributions
</div> ```
