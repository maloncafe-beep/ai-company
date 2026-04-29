#!/bin/bash
# SessionStart hook: inject startup directive as system-reminder.
# Usage: session-start-hook.sh <lineAccountId>  (e.g., member-designer)

ID="${1:-unknown}"
NAME="${ID#member-}"

if [ "$NAME" = "leader" ]; then
  DIRECTIVE=$(cat <<'EOF'
【leader：セッション起動ルーチン（確認不要で即実行）】
1. CronCreateで5分おき監視Cronを起動する。cron="*/5 * * * *"、prompt は以下：
   「(A) mcp__line-harness__get_ai_conversations (lineAccountId: member-leader, limit: 20) で新着確認。大方針メッセージがあれば：①自分で戦略立案＋タスク分解、②各メンバーの ~/ai-company/members/{name}/inbox/task.md を作成（依頼元／目的／やること／成果物パス／完了条件）、③mcp__line-harness__send_message (accountId: member-leader, friendId: owner-claude-co) で経営者に方針報告＋該当セッション起動依頼。
   (B) 各メンバーの進捗（完了・質問・報告）は各メンバー自身が自分のLINEから経営者に直接送る。リーダーはper-memberの進捗報告をしない。
   (C) 各メンバーの inbox/task_done.md は cleanup として削除のみ（報告不要）。inbox/task.md が長時間残っていればセッション起動を経営者にリマインドしてよい。」

2. 直後に一度同じチェックを実行。
3. CLAUDE.md の役割仕様に完全準拠。
EOF
)
else
  DIRECTIVE=$(cat <<EOF
【${NAME}：セッション起動ルーチン（確認不要で即実行）】
1. CronCreateで5分おき監視Cronを起動する。cron="*/5 * * * *"、prompt は以下：
   「(A) inbox/task.md があれば：内容を読み、作業方針の不明点を3〜5個リストアップ（番号選択式で明確に）。mcp__line-harness__send_message (accountId: ${ID}, friendId: owner-claude-co) で経営者に質問送信 → task.md を task_asked.md にリネーム。
   (B) inbox/task_asked.md があれば：mcp__line-harness__get_ai_conversations (lineAccountId: ${ID}, limit: 20) で自分のLINEを確認。経営者の回答があれば、回答を加味して作業開始。完了時は成果物パスを自分のLINEで経営者に報告 → task_asked.md を task_done.md にリネーム。
   (C) task.md がタスク内容完全明快で質問不要と判断できる場合のみ、質問スキップして即作業 → 完了時LINE報告＋task_done.md化。迷ったら質問する。」

2. 直後に一度同じチェックを実行。
3. 経営者への質問・進捗・完了報告は必ず自分のLINE（${ID}）から送信。リーダー経由にしない。
4. CLAUDE.md の役割仕様に完全準拠。
EOF
)
fi

jq -n --arg ctx "$DIRECTIVE" '{
  hookSpecificOutput: {
    hookEventName: "SessionStart",
    additionalContext: $ctx
  }
}'
