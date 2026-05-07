@echo off
title Sarvi Creation - Dev Environment Launcher
color 0b

echo ========================================================
echo       Starting Sarvi Creation Development Servers       
echo ========================================================
echo.

echo [*] Checking for existing processes on Port 5151...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5151 ^| findstr LISTENING') do (
    echo [!] Found existing process %%a on Port 5151. Terminating...
    taskkill /PID %%a /F
)

echo [*] Starting Backend Server on Port 5151...
start "Sarvi Backend" cmd /k "cd backend && title Sarvi Backend && echo Starting Backend on Port 5151... && npm run dev"

:: Give the backend a quick moment to start before hitting it with frontend connections
timeout /t 2 /nobreak > nul

echo [*] Checking for existing processes on Port 5173...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173 ^| findstr LISTENING') do (
    echo [!] Found existing process %%a on Port 5173. Terminating...
    taskkill /PID %%a /F
)

echo [*] Starting Unified Store (Frontend + Admin)...
start "Sarvi Frontend" cmd /k "cd frontend && title Sarvi Frontend && echo Starting Unified Store... && npm run dev"

echo.
echo ========================================================
echo   All servers have been launched in separate windows!
echo   
echo   Backend: http://localhost:5151
echo   Frontend: http://localhost:5173
echo ========================================================
echo.
pause
