@echo off
:: LINE bridge daemon — 起動・スリープ復帰時に自動実行
:: 二重起動防止: 既存の line-bridge プロセスを終了してから再起動

taskkill /f /fi "WINDOWTITLE eq line-bridge" >nul 2>&1
cd /d "C:\Users\yyasu\ai-company\scripts"
start "line-bridge" /min node bridge.js
