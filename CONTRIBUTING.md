# Contributing to MergeMind

Thank you for your interest in contributing to MergeMind.

MergeMind helps developers find beginner-friendly open source issues and make their first contribution. Everyone is welcome, whether this is your first pull request or you've contributed before.

---

## First Time Contributing?

If you're new to open source, start with issues labeled:

- `good first issue` – Best place to start
- `help wanted` – The project needs community help
- `bug` – Fix an existing problem
- `enhancement` – Improve an existing feature
- `documentation` – Improve documentation

Most beginner issues take less than 30 minutes.

---

## Contribution Workflow

```text
Fork Repository
      ↓
Clone Repository
      ↓
Create Branch
      ↓
Make Changes
      ↓
Test
      ↓
Commit
      ↓
Push
      ↓
Open Pull Request
```

---

## Quick Start

```bash
git clone https://github.com/BistaDinesh03/mergemind.git

cd mergemind

docker compose up -d
```

Frontend: http://localhost:3000

Backend: http://localhost:8000

Need more setup instructions?

See `DEPLOYMENT.md`.

---

## Branch Naming

```text
feature/short-description
fix/short-description
docs/short-description
```

Example:

```text
feature/dashboard-redesign
fix/github-login
docs/update-readme
```

---

## Commit Messages

We use Conventional Commits.

```text
feat: add issue filters

fix: resolve GitHub OAuth bug

docs: improve README

refactor: simplify API service

test: add repository tests

chore: update dependencies
```

---

## Before Opening a Pull Request

Please make sure:

- [ ] Your code builds successfully
- [ ] Tests pass
- [ ] Your change is focused on one feature or fix
- [ ] Commit messages are clear
- [ ] The PR description explains what changed

---

## Coding Guidelines

### Frontend

- Use functional React components
- Use TypeScript
- Use Tailwind CSS
- Keep components reusable

### Backend

- Follow PEP 8
- Type public functions
- Keep business logic in services
- Do not hardcode data

---

## Running Tests

Frontend

```bash
cd frontend
npm run build
```

Backend

```bash
cd backend
python -m pytest
```

---

## Need Help?

If you have questions:

- Comment on the issue
- Open a GitHub Discussion
- Open a new Issue

We're happy to help.

---

## Thank You

Every contribution helps improve MergeMind.

Whether you fix a typo, improve the design, or build a new feature, your work makes the project better for everyone.

Happy contributing!
