# 🧠 MergeMind

### AI-Powered Open Source Intelligence Platform

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.11+-blue?logo=python" alt="Python">
  <img src="https://img.shields.io/badge/Next.js-14-black?logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/FastAPI-latest-green?logo=fastapi" alt="FastAPI">
  <img src="https://img.shields.io/badge/license-MIT-blue" alt="License">
</p>

<p align="center">
  <b>Stop searching. Start contributing. Let AI find your perfect GitHub issue.</b>
</p>

---

## 🤔 The Problem

Thousands of developers want to contribute to open source but struggle with:

- ❌ **Analysis Paralysis** — Millions of issues. Which one to pick?
- ❌ **Wasted Time** — Hours spent on issues that never get merged
- ❌ **No Guidance** — Is this repo maintained? Will anyone respond?
- ❌ **Missed Opportunities** — Can't find issues matching your skills

## 💡 Our Solution

Open MergeMind and instantly see your best match:
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

**No more guessing. Open, pick, contribute, grow.**

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔍 **Smart Discovery** | AI finds issues matching your skills and goals |
| 📊 **Health Scoring** | 4-factor repository analysis (0-100) |
| 🎯 **Opportunity Scoring** | 6-factor evaluation of contribution potential |
| 🔮 **Merge Predictor** | Predicts if your PR will get accepted |
| 🤖 **AI Assistant** | Real-time advice powered by Ollama + Llama 3 |
| 📈 **Portfolio Builder** | Auto-generate portfolio from merged PRs |
| 📅 **Daily Planner** | Personalized plan based on your time |

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

## 🚀 Quick Start

### What You Need
- **Python 3.11+** → [Download](https://www.python.org/downloads/)
- **Node.js 20+** → [Download](https://nodejs.org/)
- **GitHub Account** → For OAuth login

### Step 1: Clone

```bash
git clone https://github.com/BistaDinesh03/mergemind.git
cd mergemind
Step 2: Setup GitHub OAuth
Go to https://github.com/settings/developers

Click New OAuth App

Fill in:

Name: MergeMind

Homepage: http://localhost:3000

Callback: http://localhost:3000/api/auth/callback/github

Copy Client ID and generate Client Secret

Step 3: Configure Environment
Create backend/.env:

env
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
DATABASE_URL=sqlite:///./mergemind.db
SECRET_KEY=any-random-string
Create frontend/.env.local:

env
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=any-random-string
Step 4: Start Backend
bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
Step 5: Start Frontend
Open a new terminal:

bash
cd frontend
npm install
npm run dev
Step 6: Open
🌐 App → http://localhost:3000

📚 API Docs → http://localhost:8000/docs

❤️ Health → http://localhost:8000/health

🧪 How Scoring Works
Repository Health Score (0-100)
Factor	Weight	What It Checks
Maintainer Activity	40%	Recent commits, PR merges, responses
Documentation	25%	README, CONTRIBUTING.md, templates
Test Coverage	20%	CI/CD setup, test files found
Response Time	15%	Average hours to first response
Opportunity Score (0-100)
Factor	Weight	What It Checks
Difficulty Match	25%	Fits your skill level?
Maintainer Help	20%	Will you get support?
Competition	20%	Others working on it?
Beginner Friendly	15%	Good first issue labels?
Time Required	10%	Hours to complete?
Career Value	10%	Popular repo? Good tech?
📁 Project Structure
text
mergemind/
├── backend/
│   ├── app/
│   │   ├── models/          # User, Repository, Issue, Contribution
│   │   ├── routers/         # auth, github, dashboard, assistant, portfolio
│   │   ├── services/
│   │   │   └── scoring/     # Health, Opportunity, Merge Predictors
│   │   ├── main.py          # FastAPI app
│   │   └── database.py      # SQLAlchemy setup
│   └── requirements.txt
├── frontend/
│   ├── app/
│   │   ├── dashboard/       # User dashboard
│   │   ├── discover/        # Find issues
│   │   ├── assistant/       # AI chat
│   │   └── login/           # GitHub OAuth
│   └── components/          # Reusable UI
└── README.md
🔌 API Endpoints
Method	Endpoint	What It Does
GET	/health	Health check
GET	/auth/github/login	GitHub login
GET	/api/github/repositories	Your repos
GET	/api/github/search/issues	Search issues
GET	/api/github/analyze/{repo}	Analyze repo
GET	/api/dashboard/	Your stats
GET	/api/dashboard/planner/daily	Daily plan
POST	/api/assistant/chat	AI chat
GET	/api/portfolio/{username}	Portfolio
🛠️ Tech Stack
Layer	Technology
Frontend	Next.js 14, React 18, TypeScript, Tailwind CSS
Backend	FastAPI, Python 3.11, SQLAlchemy
Database	SQLite (dev) / PostgreSQL (prod)
AI	Ollama + Llama 3
Auth	NextAuth.js + GitHub OAuth
🗺️ Roadmap
✅ Done
GitHub OAuth login

Repository health scoring

Opportunity scoring engine

Merge probability predictor

AI assistant chat

Portfolio generator

Daily planner

Dark mode UI

🚧 Next
Docker one-command setup

PostgreSQL support

Email notifications

🔮 Future
VS Code extension

Slack bot

Team features

🤝 Contributing
We love contributors! See CONTRIBUTING.md

Great first issues:

Add more scoring factors

Improve test coverage

Add component stories

Translate docs

⭐ Support the Project
⭐ Star this repo

🐛 Report bugs

💡 Suggest features

🔀 Submit PRs

📄 License
MIT © BistaDinesh03

<p align="center"> <b>Built with ❤️ for open source</b><br> <i>Stop searching. Start contributing.</i> </p> ```
