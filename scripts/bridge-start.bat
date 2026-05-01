@echo off
:: LINE bridge daemon — ログイン時・手動起動時に実行
:: 二重起動防止: 既存の line-bridge プロセスを終了してから再起動

taskkill /f /fi "WINDOWTITLE eq line-bridge" >nul 2>&1

cd /d "C:\Users\yyasu\ai-company\scripts"

:: ネットワーク安定を待つ（ログイン直後の接続失敗対策）
timeout /t 20 /nobreak >nul

start "line-bridge" /min node bridge.js
