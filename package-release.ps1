<#
.SYNOPSIS
    DreamLearn Commercial Release Packager
    Creates a clean, production-ready ZIP archive for buyer handover.
    Excludes node_modules, build caches, and sensitive local files.
#>

$ErrorActionPreference = "Stop"

$ProjectRoot = $PSScriptRoot
if (-not $ProjectRoot) { $ProjectRoot = Get-Location }

$ReleaseDir = Join-Path $ProjectRoot "release"
$ZipFileName = "DreamLearn-Commercial-Package-v1.0.0.zip"
$ZipPath = Join-Path $ProjectRoot $ZipFileName
$TempStaging = Join-Path $ReleaseDir "staging"

Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "  DreamLearn - Packaging Commercial Release" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan

# 1. Clean previous release folders if present
if (Test-Path $TempStaging) {
    Remove-Item -Recurse -Force $TempStaging
}
if (Test-Path $ZipPath) {
    Remove-Item -Force $ZipPath
}

New-Item -ItemType Directory -Force -Path $TempStaging | Out-Null

Write-Host "[1/4] Copying root project files and handover guides..." -ForegroundColor Yellow
$RootFiles = @(
    "COMMERCIAL_HANDOVER_GUIDE.md",
    "README.md",
    "package.json",
    "docker-compose.yml",
    "run.bat",
    "start.ps1",
    "dl_logo.png",
    "student_hero.jpg"
)

foreach ($file in $RootFiles) {
    $sourcePath = Join-Path $ProjectRoot $file
    if (Test-Path $sourcePath) {
        Copy-Item -Path $sourcePath -Destination $TempStaging
    }
}

Write-Host "[2/4] Copying Server (excluding node_modules)..." -ForegroundColor Yellow
$ServerStaging = Join-Path $TempStaging "server"
New-Item -ItemType Directory -Force -Path $ServerStaging | Out-Null

Get-ChildItem -Path (Join-Path $ProjectRoot "server") -Exclude "node_modules", ".git" | ForEach-Object {
    Copy-Item -Path $_.FullName -Destination $ServerStaging -Recurse -Force
}

# Ensure .env is sanitized or .env.example exists
$ServerEnv = Join-Path $ServerStaging ".env"
if (Test-Path $ServerEnv) {
    Remove-Item -Force $ServerEnv
}

Write-Host "[3/4] Copying Client (excluding node_modules & dist)..." -ForegroundColor Yellow
$ClientStaging = Join-Path $TempStaging "client"
New-Item -ItemType Directory -Force -Path $ClientStaging | Out-Null

Get-ChildItem -Path (Join-Path $ProjectRoot "client") -Exclude "node_modules", "dist", ".git" | ForEach-Object {
    Copy-Item -Path $_.FullName -Destination $ClientStaging -Recurse -Force
}

$ClientEnv = Join-Path $ClientStaging ".env"
if (Test-Path $ClientEnv) {
    Remove-Item -Force $ClientEnv
}

Write-Host "[4/4] Creating ZIP archive: $ZipFileName ..." -ForegroundColor Yellow
Compress-Archive -Path "$TempStaging\*" -DestinationPath $ZipPath -Force

# Clean staging directory
Remove-Item -Recurse -Force $ReleaseDir

$ZipSizeMB = [math]::Round((Get-Item $ZipPath).Length / 1MB, 2)

Write-Host ""
Write-Host "====================================================" -ForegroundColor Green
Write-Host "✅ SUCCESS! Commercial Handover Archive Created:" -ForegroundColor Green
Write-Host "   Path: $ZipPath" -ForegroundColor White
Write-Host "   Size: $ZipSizeMB MB (clean, lightweight & no node_modules)" -ForegroundColor White
Write-Host "====================================================" -ForegroundColor Green
Write-Host "You can now send this ZIP file directly to the buyer!" -ForegroundColor Cyan
