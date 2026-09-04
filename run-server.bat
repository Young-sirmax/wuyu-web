@echo off
chcp 65001 >nul
set PATH=C:\Users\21757\.workbuddy\binaries\node\versions\22.22.2;%PATH%
cd /d "%~dp0"
npm run start > server.log 2>&1
