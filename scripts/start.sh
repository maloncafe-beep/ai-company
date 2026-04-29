#!/bin/bash
# ai-company 起動スクリプト

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Starting ai-company services..."

# Webhookサーバー起動（バックグラウンド）
node ~/line-harness/packages/webhook-server/dist/index.js &
WEBHOOK_PID=$!
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Webhook server started (PID: $WEBHOOK_PID)"

# ngrok起動（バックグラウンド）
ngrok http 18789 --log=false &
NGROK_PID=$!
echo "[$(date '+%Y-%m-%d %H:%M:%S')] ngrok started (PID: $NGROK_PID)"

# static fileサーバー起動（バックグラウンド）
npx serve /c/users/yyasu -p 8080 &
SERVE_PID=$!
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Static server started (PID: $SERVE_PID)"

# PIDを保存（停止用）
echo $WEBHOOK_PID > /tmp/ai-company-webhook.pid
echo $NGROK_PID > /tmp/ai-company-ngrok.pid
echo $SERVE_PID > /tmp/ai-company-serve.pid

echo "[$(date '+%Y-%m-%d %H:%M:%S')] All services started."
echo "  Webhook: http://localhost:18789"
echo "  ngrok:   http://localhost:4040"
echo "  Static:  http://localhost:8080"
echo ""
echo "Stop with: bash ~/ai-company/scripts/stop.sh"

# ログを表示し続ける
wait
