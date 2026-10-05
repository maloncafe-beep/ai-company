@echo off
REM ========================================
REM AI Prompt Collection - Environment Check
REM Windows 環境判定スクリプト
REM ========================================
REM
REM 使い方：
REM  1. このファイルがあるフォルダで、コマンドプロンプトを開く
REM  2. check-environment.bat と入力して Enter
REM
REM 出力：
REM  [OK] = インストール済みで使える
REM  [MISSING] = 必須だが未導入（インストール必要）
REM  [OPTIONAL] = あると便利だが、なくても使える（推奨）
REM ========================================

setlocal enabledelayexpansion

echo.
echo ========================================
echo  AI Prompt Collection - Environment Check
echo ========================================
echo.

REM ========================================
REM  Node.js チェック
REM ========================================
echo Checking Node.js...
where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    for /f "tokens=*" %%i in ('node -v 2^>nul') do set NODE_VERSION=%%i
    echo [OK] Node.js: !NODE_VERSION!
    set NODE_EXISTS=1
) else (
    echo [OPTIONAL] Node.js: インストール不要（スクリプト不要な場合）
    set NODE_EXISTS=0
)

REM ========================================
REM  npm チェック
REM ========================================
echo.
echo Checking npm...
where npm >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    for /f "tokens=*" %%i in ('npm -v 2^>nul') do set NPM_VERSION=%%i
    echo [OK] npm: v!NPM_VERSION!
    set NPM_EXISTS=1
) else (
    echo [SKIP] npm: Node.js が未導入のためスキップ
    set NPM_EXISTS=0
)

REM ========================================
REM  Pandoc チェック
REM ========================================
echo.
echo Checking Pandoc...
where pandoc >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    for /f "tokens=*" %%i in ('pandoc -v 2^>nul ^| findstr /R "pandoc [0-9]"') do set PANDOC_VERSION=%%i
    echo [OPTIONAL] Pandoc: !PANDOC_VERSION!
    echo           （Markdown 高度な変換に推奨。Google Docs 経由なら不要）
    set PANDOC_EXISTS=1
) else (
    echo [OPTIONAL] Pandoc: インストール不要（Google Docs/Slides経由で OK）
    set PANDOC_EXISTS=0
)

REM ========================================
REM  .env ファイルチェック
REM ========================================
echo.
echo Checking .env file...
if exist "server\.env" (
    echo [OK] server\.env: 存在（Google Drive 連携設定済み）
    set ENV_EXISTS=1
) else (
    echo [OPTIONAL] server\.env: 不要（Google Docs/Slides経由なら OK）
    echo           （スクリプトで Google Drive に直接アップロードしたい場合は必須）
    set ENV_EXISTS=0
)

REM ========================================
REM  プロンプト集チェック
REM ========================================
echo.
echo Checking プロンプト集...
if exist "プロンプト集\企画書_提案書プロンプト集.md" (
    echo [OK] プロンプト集: 見つかりました
    set PROMPT_EXISTS=1
) else if exist "企画書_提案書プロンプト集.md" (
    echo [OK] プロンプト集: 見つかりました（カレントフォルダ）
    set PROMPT_EXISTS=1
) else (
    echo [WARNING] プロンプト集: 見つかりません
    echo           期待されるパス: プロンプト集\企画書_提案書プロンプト集.md
    set PROMPT_EXISTS=0
)

REM ========================================
REM  推奨設定
REM ========================================
echo.
echo ========================================
echo  推奨される使い方
echo ========================================
echo.

if %NODE_EXISTS% EQU 1 if %NPM_EXISTS% EQU 1 (
    echo ✅ 環境が揃っています！
    echo.
    echo どちらでも選べます：
    echo.
    echo 【道筋A】Google Docs/Slides 経由（推奨・初心者向け）
    echo   - ブラウザだけで完遂
    echo   - 環境構築不要
    echo   - 所要時間：20～30分
    echo.
    echo 【道筋B】ローカルスクリプト使用（上級・時短重視）
    echo   - Node.js で自動変換
    echo   - 所要時間：5～10分（設定済み場合）
    echo.
) else (
    echo ℹ️ 【推奨】道筋A（Google Docs/Slides経由）から始めましょう
    echo.
    echo 理由：
    echo   - ブラウザだけで完遂できる
    echo   - 環境構築が不要
    echo   - 初心者でも簡単
    echo.
    echo ステップ：
    echo   1. セットアップガイドを開く
    echo   2. 「【道筋A】ブラウザのみで完遂」セクションに進む
    echo   3. Google Docs / Google Slides を使う
    echo.
    if %NODE_EXISTS% EQU 0 (
        echo 👉 後で「スクリプトを自動化したい」となったら、
        echo    https://nodejs.org/ から Node.js をインストールして、
        echo    道筋B に進んでください。
        echo.
    )
)

REM ========================================
REM  終了メッセージ
REM ========================================
echo ========================================
echo  設定完了
echo ========================================
echo.
echo セットアップガイドを開いて、次のステップに進んでください：
echo   📖 セットアップガイド_v2_販売版.md
echo.
pause
