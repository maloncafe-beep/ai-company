@echo off
REM Windows用：このファイルをダブルクリックするとスタンプを生成してZIPを作ります
REM 初回は「使い方ガイド.md」の「2. 初回だけ：Pythonの準備」「3. ツールの準備」を先に実行してください

cd /d "%~dp0"

if not exist ".venv" (
  echo 初回セットアップが必要です。
  echo コマンドプロンプトでこのフォルダに移動し、以下を実行してください：
  echo   python -m venv .venv
  echo   .venv\Scripts\pip install -r requirements.txt
  echo.
  pause
  exit /b 1
)

.venv\Scripts\python run.py --zip
echo.
pause
