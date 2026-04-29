#!/bin/bash
# 停滞検知：各メンバーの inbox/task.md / task_asked.md が一定時間以上残っていたら通知。
# 使い方: bash ~/ai-company/scripts/watchdog.sh
# 推奨: crontab で30分おきに実行

set -euo pipefail

exec >> /tmp/watchdog.log 2>&1
echo "[$(date '+%Y-%m-%d %H:%M:%S')] watchdog started"

ROOT="$HOME/ai-company"
THRESHOLD_MIN=60   # 60分以上残っていたらアラート

MEMBERS=(leader brunson designer lp video researcher writer analyst product sns)
NOW_TS=$(date +%s)

for NAME in "${MEMBERS[@]}"; do
  for STATE in task task_asked; do
    F="$ROOT/members/$NAME/inbox/$STATE.md"
    [ -f "$F" ] || continue
    MTIME=$(stat -f %m "$F" 2>/dev/null || stat -c %Y "$F")
    AGE_MIN=$(( (NOW_TS - MTIME) / 60 ))
    if [ "$AGE_MIN" -ge "$THRESHOLD_MIN" ]; then
      echo "⚠ STALL: $NAME / $STATE.md (${AGE_MIN} min old)"
      # ここに Slack/LINE 通知を入れる場合は curl ... を追加
    fi
  done
done
