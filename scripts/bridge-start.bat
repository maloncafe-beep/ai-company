@echo off
:: LINE bridge daemon — PC起動時に自動実行されるバックグラウンドプロセス
:: スタートアップフォルダ: %APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\ に
:: このファイルへのショートカットを置く

cd /d "C:\Users\yyasu\ai-company\scripts"
start "line-bridge" /min node bridge.js
