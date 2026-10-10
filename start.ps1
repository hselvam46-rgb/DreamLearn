Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "Starting DreamLearn LMS Platform..." -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd server; npm run dev"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd client; npm run dev"

Write-Host ""
Write-Host "Both servers are starting in separate windows!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Yellow
Write-Host "Backend:  http://localhost:5000" -ForegroundColor Yellow
