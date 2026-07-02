@echo off
echo ============================================
echo    MergeMind - Setup Wizard
echo ============================================
echo.

echo [1/4] Checking for Docker...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not installed!
    echo Please install Docker Desktop from https://www.docker.com/
    pause
    exit /b 1
)
echo Docker found!

echo.
echo [2/4] Creating .env files...
if not exist "backend\.env" (
    copy "backend\.env.example" "backend\.env"
    echo Created backend\.env - PLEASE EDIT WITH YOUR GITHUB KEYS!
)
if not exist "frontend\.env.local" (
    echo GITHUB_CLIENT_ID=your_client_id > "frontend\.env.local"
    echo GITHUB_CLIENT_SECRET=your_client_secret >> "frontend\.env.local"
    echo NEXTAUTH_URL=http://localhost:3000 >> "frontend\.env.local"
    echo NEXTAUTH_SECRET=any-random-string >> "frontend\.env.local"
    echo Created frontend\.env.local - PLEASE EDIT WITH YOUR GITHUB KEYS!
)

echo.
echo [3/4] Pulling AI model (this may take a few minutes)...
docker compose run --rm ollama ollama pull llama3:8b

echo.
echo [4/4] Starting MergeMind...
docker compose up -d

echo.
echo ============================================
echo    MergeMind is starting!
echo.
echo    Frontend:  http://localhost:3000
echo    API Docs:  http://localhost:8000/docs
echo    AI Model:  Llama 3 (8B)
echo.
echo    IMPORTANT: Edit backend/.env and
echo    frontend/.env.local with your GitHub keys!
echo ============================================
echo.
pause