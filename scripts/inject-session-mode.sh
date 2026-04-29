#!/bin/bash
# 10メンバー全員の CLAUDE.md に push spawn セッションモード判別セクションを自動追記する。
# 既に同じセクションがあればスキップ。{NAME} と {ID} を各メンバー名で置換。

set -euo pipefail

ROOT="$HOME/ai-company"
TEMPLATE="$ROOT/SESSION-MODE-TEMPLATE.md"

if [ ! -f "$TEMPLATE" ]; then
  echo "ERROR: $TEMPLATE が見つかりません。先にテンプレ本体を配置してください。"
  exit 1
fi

MEMBERS=(leader brunson designer lp video researcher writer analyst product sns)
MARKER="## セッション起動時（push型"

for NAME in "${MEMBERS[@]}"; do
  CLAUDE_MD="$ROOT/members/$NAME/CLAUDE.md"
  if [ ! -f "$CLAUDE_MD" ]; then
    echo "  - $NAME : CLAUDE.md がない → スキップ"
    continue
  fi
  if grep -q "$MARKER" "$CLAUDE_MD"; then
    echo "  - $NAME : 既に追記済み → スキップ"
    continue
  fi
  ID="member-$NAME"
  printf "\n\n" >> "$CLAUDE_MD"
  sed -e "s|{NAME}|$NAME|g" -e "s|{ID}|$ID|g" "$TEMPLATE" >> "$CLAUDE_MD"
  echo "  ✓ $NAME : 追記しました"
done

echo ""
echo "完了。以下で確認できます："
echo "  grep -l 'push型の自動spawn' $ROOT/members/*/CLAUDE.md"
