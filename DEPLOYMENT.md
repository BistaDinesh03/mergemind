# MergeMind Production Deployment Guide

## Pre-Deployment Checklist

### Security
- [ ] Change all default passwords
- [ ] Generate strong SECRET_KEY (min 32 chars): openssl rand -hex 32
- [ ] Enable HTTPS with valid SSL certificate
- [ ] Configure firewall rules
- [ ] Review CORS origins
- [ ] Set up rate limiting

### Database
- [ ] Set up PostgreSQL for production (not SQLite)
- [ ] Run database migrations
- [ ] Configure automated backups

### GitHub
- [ ] Create production OAuth app with correct callback URL
- [ ] Generate new token with minimal scopes (repo, read:user)
- [ ] Set token as environment variable

### Monitoring
- [ ] Set up application logging
- [ ] Configure health check alerts
- [ ] Set up error tracking

---

## Deployment Options

### Option 1: Vercel + Railway (Easiest, Free)

**Frontend (Vercel):**
1. Connect GitHub repo to Vercel
2. Set environment variables:
   - NEXT_PUBLIC_API_URL=https://your-backend-url
   - NEXTAUTH_URL=https://your-frontend-url
   - GITHUB_CLIENT_ID=xxx
   - GITHUB_CLIENT_SECRET=xxx
   - NEXTAUTH_SECRET=xxx
3. Deploy

**Backend (Railway):**
1. Connect GitHub repo to Railway
2. Set all environment variables from .env.example
3. Set ENVIRONMENT=production
4. Deploy

### Option 2: Docker on VPS

docker compose -f docker-compose.prod.yml up -d

### Option 3: Manual

**Backend:**
cd backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4

**Frontend:**
cd frontend
npm run build
npm start

---

## Environment Variables

| Variable | Required | Example |
|----------|----------|---------|
| GITHUB_TOKEN | Yes | ghp_xxx |
| GITHUB_CLIENT_ID | Yes | Ov23xxx |
| GITHUB_CLIENT_SECRET | Yes | xxx |
| SECRET_KEY | Yes | 32+ random chars |
| DATABASE_URL | Yes | postgresql://... |
| OLLAMA_HOST | No | http://localhost:11434 |
| ENVIRONMENT | Yes | production |

---

## Health Check

GET /health returns:
{
  "status": "healthy",
  "version": "1.0.0",
  "environment": "production"
}

---

## Security Notes

1. Never commit .env files
2. Rotate tokens every 90 days
3. Use HTTPS in production
4. Set up firewall rules
5. Use non-root Docker user