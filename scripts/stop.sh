#!/bin/bash
# ai-company 停止スクリプト

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Stopping ai-company services..."

if [ -f /tmp/ai-company-webhook.pid ]; then
  kill $(cat /tmp/ai-company-webhook.pid) 2>/dev/null && echo "Webhook server stopped."
  rm /tmp/ai-company-webhook.pid
fi

if [ -f /tmp/ai-company-ngrok.pid ]; then
  kill $(cat /tmp/ai-company-ngrok.pid) 2>/dev/null && echo "ngrok stopped."
  rm /tmp/ai-company-ngrok.pid
fi

if [ -f /tmp/ai-company-serve.pid ]; then
  kill $(cat /tmp/ai-company-serve.pid) 2>/dev/null && echo "Static server stopped."
  rm /tmp/ai-company-serve.pid
fi

echo "[$(date '+%Y-%m-%d %H:%M:%S')] All services stopped."
