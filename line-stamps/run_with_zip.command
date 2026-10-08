#!/bin/bash
# Mac用：このファイルをダブルクリックするとスタンプを生成してZIPを作ります
# 初回は「使い方ガイド.md」の「2. 初回だけ：Pythonの準備」「3. ツールの準備」を先に実行してください

cd "$(dirname "$0")"

if [ ! -d ".venv" ]; then
  echo "初回セットアップが必要です。"
  echo "ターミナルでこのフォルダに移動し、以下を実行してください："
  echo "  python3 -m venv .venv"
  echo "  .venv/bin/pip install -r requirements.txt"
  echo ""
  read -p "Enterキーを押すと終了します..."
  exit 1
fi

.venv/bin/python run.py --zip
echo ""
read -p "完了しました。Enterキーを押すと閉じます..."
