@echo off
echo ====================================================
echo Starting DreamLearn LMS Platform...
echo ====================================================

start "DreamLearn Backend (Port 5000)" cmd /k "cd server && npm run dev"
start "DreamLearn Frontend (Port 3000)" cmd /k "cd client && npm run dev"

echo.
echo Both servers are starting!
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
echo.
echo Leave the opened terminal windows running while using the app.
pause
