# HealthAI — Full Stack Demo Launcher
# Run this before viva: Right-click → Run with PowerShell

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  HealthAI Demo Stack Starting..." -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

Set-Location $PSScriptRoot

# Start all services
Write-Host "[1/3] Starting all containers (MySQL, Backend, Frontend, Prometheus, Grafana)..." -ForegroundColor Yellow
docker compose up -d --build

Write-Host ""
Write-Host "[2/3] Waiting 20 seconds for services to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 20

# Check status
Write-Host ""
Write-Host "[3/3] Container Status:" -ForegroundColor Yellow
docker compose ps

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "  ALL SERVICES RUNNING!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "  Frontend   : http://localhost" -ForegroundColor White
Write-Host "  Backend API: http://localhost:5000/api" -ForegroundColor White
Write-Host "  Prometheus : http://localhost:9090" -ForegroundColor White
Write-Host "  Grafana    : http://localhost:3001" -ForegroundColor White
Write-Host "               Login: admin / admin123" -ForegroundColor Gray
Write-Host ""
Write-Host "  Opening browsers..." -ForegroundColor Yellow
Start-Sleep -Seconds 2

# Open all tabs
Start-Process "http://localhost"
Start-Sleep -Seconds 1
Start-Process "http://localhost:3001"
Start-Sleep -Seconds 1
Start-Process "http://localhost:9090"

Write-Host ""
Write-Host "  Press any key to view live logs (Ctrl+C to exit logs)..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

docker compose logs -f backend
