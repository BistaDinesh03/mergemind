#!/bin/bash
echo "============================================"
echo "   MergeMind - Setup Wizard"
echo "============================================"
echo ""

echo "[1/4] Checking for Docker..."
if ! command -v docker &> /dev/null; then
    echo "ERROR: Docker is not installed!"
    exit 1
fi
echo "Docker found!"

echo ""
echo "[2/4] Creating .env files..."
if [ ! -f "backend/.env" ]; then
    cp backend/.env.example backend/.env
    echo "Created backend/.env - PLEASE EDIT WITH YOUR GITHUB KEYS!"
fi
if [ ! -f "frontend/.env.local" ]; then
    echo "GITHUB_CLIENT_ID=your_client_id" > frontend/.env.local
    echo "GITHUB_CLIENT_SECRET=your_client_secret" >> frontend/.env.local
    echo "NEXTAUTH_URL=http://localhost:3000" >> frontend/.env.local
    echo "NEXTAUTH_SECRET=any-random-string" >> frontend/.env.local
    echo "Created frontend/.env.local - PLEASE EDIT WITH YOUR GITHUB KEYS!"
fi

echo ""
echo "[3/4] Pulling AI model..."
docker compose run --rm ollama ollama pull llama3:8b

echo ""
echo "[4/4] Starting MergeMind..."
docker compose up -d

echo ""
echo "============================================"
echo "   MergeMind is starting!"
echo ""
echo "   Frontend:  http://localhost:3000"
echo "   API Docs:  http://localhost:8000/docs"
echo ""
echo "============================================"