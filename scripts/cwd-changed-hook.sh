#!/bin/bash
# CwdChanged hook: inject startup directive when entering a member directory.

input=$(cat)
new_cwd=$(node -e "
try {
  const d = JSON.parse(process.argv[1]);
  const v = d.cwd || d.newCwd || d.new_cwd || (d.data && d.data.cwd) || '';
  process.stdout.write(v);
} catch(e) { process.stdout.write(''); }
" "$input" 2>/dev/null)

if [ -z "$new_cwd" ] || [ "$new_cwd" = "null" ]; then
  new_cwd="$PWD"
fi

NAME=$(printf '%s' "$new_cwd" | sed -n 's|.*ai-company/members/\([^/]*\)\(/.*\)\{0,1\}$|\1|p')

case "$NAME" in
  leader|brunson|designer|lp|video|researcher|writer|analyst|product|sns) ;;
  *) exit 0 ;;
esac

# accountId and Yyasu's friendId per member account
case "$NAME" in
  leader)
    ACCOUNT_ID="32d65756-37d7-420c-9c66-aeb87d571e1b"
    FRIEND_ID="c24b0d7c-e87d-4cd1-b675-3708d467daeb"
    ;;
  designer)
    ACCOUNT_ID="81454d2d-768a-46b5-b0f1-06cb665a48f0"
    FRIEND_ID="9c603c72-7e8b-45cb-a14d-ada31ad325ff"
    ;;
  writer)
    ACCOUNT_ID="163f14c1-135d-4385-8e9f-63f6c802302c"
    FRIEND_ID="584f0b9f-3dc5-44c7-8b16-33d312a0bed1"
    ;;
  brunson)
    ACCOUNT_ID="a1d98ade-771d-47d9-a3cd-534f9395e7ca"
    FRIEND_ID="a7d16bc8-0df9-4b4d-8fd2-a7dbf98e752d"
    ;;
  lp)
    ACCOUNT_ID="010801fd-c4b1-4509-b311-27810e6e3ac4"
    FRIEND_ID="c913028d-4fba-4098-86b6-0f409602bc00"
    ;;
  video)
    ACCOUNT_ID="5f972742-5c99-4c50-aebb-899725f9250c"
    FRIEND_ID="d338065d-1154-4c3a-a599-f7f6f8e5a444"
    ;;
  researcher)
    ACCOUNT_ID="67bb214d-8551-4b57-a43e-d7ef1c42cf69"
    FRIEND_ID="06cb3417-f8c9-4152-baaf-92ff943a06c2"
    ;;
  analyst)
    ACCOUNT_ID="626cb869-8b53-4320-bd47-56216a327bd7"
    FRIEND_ID="33ad6c53-8a19-4de2-97cd-9e2180dbeb34"
    ;;
  product)
    ACCOUNT_ID="8e93bbf1-015c-4eb3-9c35-a119ca347251"
    FRIEND_ID="25f3d29f-7fe0-42a4-b777-8c0be6718080"
    ;;
  sns)
    ACCOUNT_ID="b9ca6664-56c8-41f2-bb03-3e0e43e0054d"
    FRIEND_ID="cf7a3aa6-c25a-4d60-a304-b5028d256b72"
    ;;
esac

if [ "$NAME" = "leader" ]; then
  DIRECTIVE="【leaderディレクトリに入りました：セッション起動ルーチン（確認不要で即実行）】
1. CronCreateで5分おき監視Cronを起動する。cron=\"*/5 * * * *\"、prompt は以下：
   「(A) mcp__line-harness__list_conversations (lineAccountId: ${ACCOUNT_ID}, limit: 20) で新着確認。大方針メッセージがあれば：①自分で戦略立案＋タスク分解、②各メンバーの ~/ai-company/members/{name}/inbox/task.md を作成（依頼元／目的／やること／成果物パス／完了条件）、③mcp__line-harness__send_message (accountId: ${ACCOUNT_ID}, friendId: ${FRIEND_ID}) で経営者に方針報告＋該当セッション起動依頼。
   (B) 各メンバーの進捗（完了・質問・報告）は各メンバー自身が自分のLINEから経営者に直接送る。リーダーはper-memberの進捗報告をしない。
   (C) 各メンバーの inbox/task_done.md は cleanup として削除のみ（報告不要）。inbox/task.md が長時間残っていればセッション起動を経営者にリマインドしてよい。」
2. 直後に一度同じチェックを実行。
3. CLAUDE.md の役割仕様に完全準拠。"
else
  DIRECTIVE="【${NAME}ディレクトリに入りました：セッション起動ルーチン（確認不要で即実行）】
1. CronCreateで5分おき監視Cronを起動する。cron=\"*/5 * * * *\"、prompt は以下：
   「(A) inbox/task.md があれば：内容を読み、作業方針の不明点を3〜5個リストアップ（番号選択式で明確に）。mcp__line-harness__send_message (accountId: ${ACCOUNT_ID}, friendId: ${FRIEND_ID}) で経営者に質問送信 → task.md を task_asked.md にリネーム。
   (B) inbox/task_asked.md があれば：mcp__line-harness__list_conversations (lineAccountId: ${ACCOUNT_ID}, limit: 20) で自分のLINEを確認。経営者の回答があれば、回答を加味して作業開始。完了時は成果物パスを自分のLINEで経営者に報告 → task_asked.md を task_done.md にリネーム。
   (C) task.md がタスク内容完全明快で質問不要と判断できる場合のみ、質問スキップして即作業 → 完了時LINE報告＋task_done.md化。迷ったら質問する。」
2. 直後に一度同じチェックを実行。
3. 経営者への質問・進捗・完了報告は必ず自分のLINE（accountId: ${ACCOUNT_ID}）から送信。リーダー経由にしない。
4. CLAUDE.md の役割仕様に完全準拠。"
fi

node -e "
const ctx = process.argv[1];
console.log(JSON.stringify({
  hookSpecificOutput: {
    hookEventName: 'CwdChanged',
    additionalContext: ctx
  }
}));
" "$DIRECTIVE"
