#!/bin/bash
################################################################################
# AI Prompt Collection - Environment Check
# Mac / Linux 環境判定スクリプト
################################################################################
#
# 使い方：
#   1. このファイルがあるフォルダで、ターミナルを開く
#   2. chmod +x check-environment.sh （初回のみ）
#   3. ./check-environment.sh
#
# 出力：
#   [OK] = インストール済みで使える
#   [MISSING] = 必須だが未導入（インストール必要）
#   [OPTIONAL] = あると便利だが、なくても使える（推奨）
################################################################################

echo
echo "========================================"
echo "AI Prompt Collection - Environment Check"
echo "========================================"
echo

# フラグ
NODE_EXISTS=0
NPM_EXISTS=0
PANDOC_EXISTS=0
ENV_EXISTS=0
PROMPT_EXISTS=0

################################################################################
# Node.js チェック
################################################################################
echo "Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo "[OK] Node.js: $NODE_VERSION"
    NODE_EXISTS=1
else
    echo "[OPTIONAL] Node.js: インストール不要（スクリプト不要な場合）"
    NODE_EXISTS=0
fi

################################################################################
# npm チェック
################################################################################
echo
echo "Checking npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo "[OK] npm: v$NPM_VERSION"
    NPM_EXISTS=1
else
    if [ $NODE_EXISTS -eq 0 ]; then
        echo "[SKIP] npm: Node.js が未導入のためスキップ"
    else
        echo "[MISSING] npm: Node.js は入っていますが npm がありません"
    fi
    NPM_EXISTS=0
fi

################################################################################
# Pandoc チェック
################################################################################
echo
echo "Checking Pandoc..."
if command -v pandoc &> /dev/null; then
    PANDOC_VERSION=$(pandoc -v | head -1)
    echo "[OPTIONAL] Pandoc: $PANDOC_VERSION"
    echo "           （Markdown 高度な変換に推奨。Google Docs 経由なら不要）"
    PANDOC_EXISTS=1
else
    echo "[OPTIONAL] Pandoc: インストール不要（Google Docs/Slides経由で OK）"
    PANDOC_EXISTS=0
fi

################################################################################
# .env ファイルチェック
################################################################################
echo
echo "Checking .env file..."
if [ -f "server/.env" ]; then
    echo "[OK] server/.env: 存在（Google Drive 連携設定済み）"
    ENV_EXISTS=1
else
    echo "[OPTIONAL] server/.env: 不要（Google Docs/Slides経由なら OK）"
    echo "           （スクリプトで Google Drive に直接アップロードしたい場合は必須）"
    ENV_EXISTS=0
fi

################################################################################
# プロンプト集チェック
################################################################################
echo
echo "Checking プロンプト集..."
if [ -f "プロンプト集/企画書_提案書プロンプト集.md" ]; then
    echo "[OK] プロンプト集: 見つかりました"
    PROMPT_EXISTS=1
elif [ -f "企画書_提案書プロンプト集.md" ]; then
    echo "[OK] プロンプト集: 見つかりました（カレントフォルダ）"
    PROMPT_EXISTS=1
else
    echo "[WARNING] プロンプト集: 見つかりません"
    echo "          期待されるパス: プロンプト集/企画書_提案書プロンプト集.md"
    PROMPT_EXISTS=0
fi

################################################################################
# 推奨設定
################################################################################
echo
echo "========================================"
echo "推奨される使い方"
echo "========================================"
echo

if [ $NODE_EXISTS -eq 1 ] && [ $NPM_EXISTS -eq 1 ]; then
    echo "✅ 環境が揃っています！"
    echo
    echo "どちらでも選べます："
    echo
    echo "【道筋A】Google Docs/Slides 経由（推奨・初心者向け）"
    echo "  - ブラウザだけで完遂"
    echo "  - 環境構築不要"
    echo "  - 所要時間：20～30分"
    echo
    echo "【道筋B】ローカルスクリプト使用（上級・時短重視）"
    echo "  - Node.js で自動変換"
    echo "  - 所要時間：5～10分（設定済み場合）"
    echo
else
    echo "ℹ️  【推奨】道筋A（Google Docs/Slides経由）から始めましょう"
    echo
    echo "理由："
    echo "  - ブラウザだけで完遂できる"
    echo "  - 環境構築が不要"
    echo "  - 初心者でも簡単"
    echo
    echo "ステップ："
    echo "  1. セットアップガイドを開く"
    echo "  2. 「【道筋A】ブラウザのみで完遂」セクションに進む"
    echo "  3. Google Docs / Google Slides を使う"
    echo
    if [ $NODE_EXISTS -eq 0 ]; then
        echo "👉 後で「スクリプトを自動化したい」となったら、"
        echo "   https://nodejs.org/ から Node.js をインストールして、"
        echo "   道筋B に進んでください。"
        echo
    fi
fi

################################################################################
# 終了メッセージ
################################################################################
echo "========================================"
echo "設定完了"
echo "========================================"
echo
echo "セットアップガイドを開いて、次のステップに進んでください："
echo "  📖 セットアップガイド_v2_販売版.md"
echo
