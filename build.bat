@echo off
chcp 65001 >nul
REM ============================================
REM 胡说（语伴组局）网页版 - 构建脚本
REM 用法: 双击运行，或在此目录命令行执行 build.bat
REM ============================================
setlocal
set PATH=C:\Users\21757\.workbuddy\binaries\node\versions\22.22.2;%PATH%
cd /d "%~dp0"

echo [1/2] 检查依赖...
if not exist node_modules (
  echo     未检测到 node_modules，正在安装（约 3-5 分钟）...
  call npm install --no-audit --no-fund
)

echo [2/2] 生产构建（next build）...
call npm run build
if errorlevel 1 (
  echo.
  echo 构建失败，请把上方错误信息发给 AI 助手排查。
  pause
  exit /b 1
)
echo.
echo 构建成功！产物位于 .next/
pause
