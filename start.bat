@echo off
chcp 65001 >nul
REM ============================================
REM 胡说（语伴组局）网页版 - 本地启动脚本
REM 用法: 双击运行，浏览器自动打开 http://localhost:3000
REM       按 Ctrl+C 停止服务
REM ============================================
setlocal
set PATH=C:\Users\21757\.workbuddy\binaries\node\versions\22.22.2;%PATH%
cd /d "%~dp0"

echo 正在启动本地服务 http://localhost:3000 ...
start "" http://localhost:3000
call npm run dev
pause
