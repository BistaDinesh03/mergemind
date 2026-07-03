<div align="center">

# 🧠 MergeMind

### AI-Powered Open Source Intelligence Platform

*Discover GitHub issues. Score them with AI. Build your portfolio.*

[![Stars](https://img.shields.io/github/stars/BistaDinesh03/mergemind?style=for-the-badge&color=yellow)](https://github.com/BistaDinesh03/mergemind/stargazers)
[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=for-the-badge)](CONTRIBUTING.md)

<br>

</div>

---

## 🤔 The Problem

Every developer wants to contribute to open source. But:

- 😫 **Millions of issues** — which one to pick?
- 🤷 **No idea if PR will merge** — wasting hours
- 😕 **Is this repo alive?** — dead projects everywhere
- 📉 **Can't track progress** — no portfolio to show

**MergeMind fixes all of this in one place.**

---

## ✨ What MergeMind Does

<table>
<tr>
<td width="33%" align="center">
<h3>🔍 Discover</h3>
<p>Browse real GitHub issues from trending repos with one click</p>
</td>
<td width="33%" align="center">
<h3>🤖 AI Score</h3>
<p>AI analyzes every issue — difficulty, time needed, merge chance</p>
</td>
<td width="33%" align="center">
<h3>📈 Portfolio</h3>
<p>Auto-generate your contribution portfolio from merged PRs</p>
</td>
</tr>
</table>

---

## 🎯 How It Works
Login with GitHub
↓

See trending repos (real data from GitHub API)
↓

Click any repo → See open issues
↓

AI scores each issue out of 100
↓

Contribute → Portfolio updates automatically

text

---

## 🚀 Quick Start

### What You Need
- **Python 3.11+** → [Download](https://www.python.org/downloads/)
- **Node.js 20+** → [Download](https://nodejs.org/)

### Run in 2 Minutes

```bash
# 1. Clone
git clone https://github.com/BistaDinesh03/mergemind.git
cd mergemind

# 2. Setup GitHub OAuth (2 min)
# Go to https://github.com/settings/developers
# Create OAuth App → Callback: http://localhost:3000/api/auth/callback/github
# Copy Client ID and Secret

# 3. Add keys to backend/.env
# GITHUB_CLIENT_ID=your_id
# GITHUB_CLIENT_SECRET=your_secret
# GITHUB_TOKEN=your_token

# 4. Start Backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# 5. Start Frontend (new terminal)
cd frontend
npm install
npm run dev
Or With Docker (One Command)
bash
docker compose up
Open http://localhost:3000

🛠️ Tech Stack
Layer	Technology
Frontend	Next.js 14 • TypeScript • Tailwind CSS
Backend	FastAPI • Python • SQLAlchemy
AI	Ollama • Llama 3.2
Database	SQLite
Auth	NextAuth.js • GitHub OAuth
DevOps	Docker • Docker Compose
🔌 API Endpoints
Method	Endpoint	What It Does
GET	/api/github/trending?language=python	Trending repos with issues
GET	/api/github/user/{username}	GitHub profile data
POST	/api/assistant/score-issue	AI scores an issue
GET	/api/portfolio/{username}	User portfolio
GET	/health	Server status
Full docs: http://localhost:8000/docs when running

📁 Project Structure
text
mergemind/
├── backend/                # FastAPI server
│   ├── app/
│   │   ├── routers/        # API endpoints
│   │   ├── services/       # GitHub, AI, scoring
│   │   └── models/         # Database tables
│   └── requirements.txt
│
├── frontend/               # Next.js app
│   ├── app/
│   │   ├── dashboard/      # Your stats
│   │   ├── discover/       # Find issues
│   │   └── portfolio/      # Your contributions
│   └── components/         # Reusable UI
│
└── docker-compose.yml      # One-command start
🗺️ Roadmap
✅ Done
GitHub OAuth login

Real GitHub API data

AI issue scoring (Ollama)

Portfolio generator

Docker support

Dark mode UI

🚧 Next
Deploy to Vercel + Railway

PostgreSQL support

Contribution streaks

🔮 Future
VS Code extension

Slack bot

Team dashboards

🤝 Contributing
We love contributors!

Great first issues:

🐛 Fix a bug

✨ Add new scoring factors

🎨 Improve UI components

📝 Write better docs

⭐ Support
Give a ⭐️ if this project helped you find your next contribution!

📄 License
MIT © BistaDinesh03


<div align="center"> <b>Built with ❤️ for open source developers</b> </div> ```
