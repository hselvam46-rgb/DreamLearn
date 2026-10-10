@echo off
setlocal
title DreamLearn - Commercial Package Generator
echo ====================================================
echo   DreamLearn - Packaging Commercial Release Archive
echo ====================================================
echo.

set OUTPUT_ZIP=DreamLearn-Commercial-Package-v1.0.0.zip

if exist "%OUTPUT_ZIP%" del /f /q "%OUTPUT_ZIP%"

echo Creating clean production archive (excluding node_modules)...
tar.exe -a -c -f "%OUTPUT_ZIP%" --exclude=node_modules --exclude=dist --exclude=.git --exclude=.env --exclude=release --exclude=*.zip COMMERCIAL_HANDOVER_GUIDE.md README.md package.json docker-compose.yml run.bat start.ps1 dl_logo.png student_hero.jpg client server

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ====================================================
    echo SUCCESS! Handover ZIP created:
    echo   File: %OUTPUT_ZIP%
    echo ====================================================
    echo You can now send this ZIP file directly to your buyer!
) else (
    echo.
    echo An error occurred while creating the archive.
)

echo.
pause
