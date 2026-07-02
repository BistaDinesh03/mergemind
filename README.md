<div align="center">

# 🧠 MergeMind

### Find your next open source contribution in 30 seconds, not 3 hours.

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.139-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

<br>

<img src="https://raw.githubusercontent.com/BistaDinesh03/mergemind/main/screenshot.png" alt="MergeMind Dashboard" width="800" style="border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.3);">

<br>
<br>

<h3>
  AI that scans GitHub repositories.<br>
  Scores every issue based on YOUR skills.<br>
  Tells you exactly what to work on today.
</h3>

</div>

---

## The Reality Check

You want to contribute to open source. You open GitHub. You see **millions of issues**.

- Which repo is actually maintained?
- Will anyone even review my PR?
- Is this issue too hard? Too easy?
- Am I wasting my time?

**MergeMind answers all of this before you write a single line of code.**

---

## What You Get

<div align="center">

| | |
|---|---|
| 🔍 **Smart Matching** | Issues filtered by YOUR languages, skill level, and goals |
| 📊 **Health Score** | Know if a repo is alive or abandoned (0-100) |
| 🎯 **Opportunity Score** | Is this issue worth your time? (0-100) |
| 🔮 **Merge Chance** | Will your PR actually get accepted? |
| 🤖 **AI Advisor** | Chat about any repo and get real advice |
| 📅 **Daily Plan** | "I have 45 minutes" → Here's your plan |
| 🏆 **Portfolio** | All your merged PRs in one shareable page |

</div>

---

## See It In Action
You open MergeMind.
You log in with GitHub (one click).

Your dashboard shows:

┌─────────────────────────────────────────────┐
│ │
│ ⭐ TODAY'S TOP PICK │
│ │
│ fastapi/fastapi │
│ "Add type hints to dependencies/utils.py" │
│ │
│ Health: ●●●●●●●●○○ 85/100 │
│ Difficulty: 🟢 Easy │
│ Merge Rate: ●●●●●●●●●○ 92% │
│ Your Skills: Python ● Type Hints ● APIs │
│ Est. Time: 1.5 hours │
│ │
│ AI says: "Active maintainers. Good docs. │
│ Low competition. Start with utils.py." │
│ │
│ [ Start Contributing ] │
│ │
└─────────────────────────────────────────────┘

That's it. Pick it. Code it. Ship it.

text

---

## Tech Behind It

<div align="center">

| Backend | Frontend | AI | Database |
|:---:|:---:|:---:|:---:|
| FastAPI | Next.js 14 | Ollama | SQLite |
| Python 3.11 | React 18 | Llama 3 | PostgreSQL* |
| SQLAlchemy | TypeScript | Qwen 2.5 | |
| Alembic | Tailwind CSS | Local & Free | |

<sub>*SQLite for dev, PostgreSQL ready for production</sub>

</div>

---

## Run It Locally

### You Need
- **Python 3.11+** installed
- **Node.js 20+** installed  
- A **GitHub account**

### 3 Steps

**Step 1: Get your keys**
1. Go to https://github.com/settings/developers
2. Create a new OAuth App
3. Set callback URL to `http://localhost:3000/api/auth/callback/github`
4. Copy the Client ID and Secret

**Step 2: Add your keys**

Create `backend/.env`:
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
DATABASE_URL=sqlite:///./mergemind.db
SECRET_KEY=anything123

text

Create `frontend/.env.local`:
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=anything123

text

**Step 3: Start the app**

Terminal 1 (Backend):
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

text

Terminal 2 (Frontend):
cd frontend
npm install
npm run dev

text

Open **http://localhost:3000** — that's it!

---

## How Scoring Works

### Repository Health

We look at 4 things to tell you if a repo is worth contributing to:

| What We Check | Why It Matters | Weight |
|---|---|---|
| Recent commits & PR merges | Is anyone actually working here? | 40% |
| README, guides, templates | Can you figure out how to contribute? | 25% |
| Tests & CI/CD | Will your code be checked properly? | 20% |
| Response time to issues | Will maintainers answer your questions? | 15% |

### Issue Opportunity

We score every issue on 6 factors:

| What We Check | Why It Matters | Weight |
|---|---|---|
| Matches your skill level | Not too easy, not impossible | 25% |
| No one else assigned | Less competition = higher chance | 20% |
| Active maintainers | You'll get reviews and help | 20% |
| Beginner-friendly labels | "good first issue" = easier start | 15% |
| Time to complete | Fits your available time? | 10% |
| Repo popularity | Good for your resume/portfolio | 10% |

---

## API Endpoints

Everything is documented. When running, open http://localhost:8000/docs

| Quick Reference | |
|---|---|
| `GET /health` | Server status |
| `GET /api/dashboard` | Your stats & top picks |
| `GET /api/dashboard/planner/daily` | Today's plan |
| `GET /api/github/search/issues` | Search across GitHub |
| `GET /api/github/analyze/{repo}` | Full repo analysis |
| `POST /api/assistant/chat` | Chat with AI |
| `GET /api/portfolio/{username}` | Your portfolio |

---

## Project Structure
mergemind/
│
├── backend/ # Python API server
│ ├── app/
│ │ ├── models/ # Database tables
│ │ ├── routers/ # API route handlers
│ │ ├── services/
│ │ │ ├── scoring/ # Health & opportunity engines
│ │ │ ├── github_service.py
│ │ │ ├── ollama_service.py
│ │ │ └── ai_recommendation_service.py
│ │ ├── main.py # App entry point
│ │ └── config.py # Settings management
│ ├── tests/
│ └── requirements.txt
│
├── frontend/ # Next.js web app
│ ├── app/
│ │ ├── dashboard/ # Your stats & plan
│ │ ├── discover/ # Browse scored issues
│ │ ├── assistant/ # AI chat interface
│ │ ├── portfolio/ # Shareable portfolio
│ │ ├── contributions/ # Track your PRs
│ │ ├── settings/ # Preferences
│ │ └── login/ # GitHub sign-in
│ └── components/
│ ├── layout/ # Navbar, Sidebar
│ └── ui/ # Cards, badges, skeletons
│
├── docker-compose.yml
├── ARCHITECTURE.md
├── CONTRIBUTING.md
└── README.md

text

---

## Roadmap

### Working Now
- [x] Sign in with GitHub
- [x] Repository health analysis
- [x] Issue opportunity scoring
- [x] AI chat assistant
- [x] Portfolio generator
- [x] Daily contribution planner
- [x] Dark mode

### Building Next
- [ ] Docker one-command setup
- [ ] PostgreSQL support
- [ ] Contribution streak tracker
- [ ] Email digests

### Future Ideas
- [ ] VS Code extension
- [ ] Slack bot integration
- [ ] Team dashboards
- [ ] Hackathon matchmaker

---

## Want to Contribute?

This project is **perfect for first-time open source contributors**.

**Easy ways to start:**
- Add a new scoring factor in `backend/app/services/scoring/`
- Improve a UI component in `frontend/components/`
- Write better tests in `backend/tests/`
- Fix a typo or improve docs

Check [CONTRIBUTING.md](CONTRIBUTING.md) for the full guide, or just open an issue and say "I want to help!"

---

## One More Thing

If this project helps you find a good issue to work on, **star the repo** ⭐

It helps other developers discover MergeMind too.

---

<div align="center">

<br>

**Built by developers, for developers.**

[BistaDinesh03](https://github.com/BistaDinesh03) • [Report Bug](https://github.com/BistaDinesh03/mergemind/issues) • [Request Feature](https://github.com/BistaDinesh03/mergemind/issues)

<br>

</div>
