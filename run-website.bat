@echo off
title BeeProof Platform Launcher
echo ===================================================
echo   Starting BeeProof Platform (AI + Backend + Frontend)
echo ===================================================

cd /d "%~dp0"

echo [1/3] Starting Python AI Service (Port 8000)...
start "BeeProof AI Service" cmd /k "cd ai-service && python main.py"

echo [2/3] Starting Backend API Server (Port 8080)...
start "BeeProof Backend" cmd /k "cd backend && npm start"

echo [3/3] Starting Frontend App (Port 5173)...
start "BeeProof Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Waiting for servers to initialize...
timeout /t 5 /nobreak >nul

echo Opening BeeProof in your default browser...
start http://localhost:5173

echo.
echo Website running at:  http://localhost:5173
echo Backend API at:     http://localhost:8080/api
echo AI Service at:      http://127.0.0.1:8000
echo ===================================================

