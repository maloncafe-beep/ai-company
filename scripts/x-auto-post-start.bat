@echo off
cd /d "C:\Users\yyasu\ai-company\x-auto-post"
timeout /t 40 /nobreak >nul
node tools/schedule.mjs
