@echo off
:: LINE bridge daemon — ログイン時・手動起動時に実行
:: ※ クラッシュ時の再起動は Windows タスクスケジューラ側で設定する

cd /d "C:\Users\yyasu\ai-company\scripts"

:: ネットワーク安定を待つ（ログイン直後の接続失敗対策）
timeout /t 20 /nobreak >nul

node bridge.js
