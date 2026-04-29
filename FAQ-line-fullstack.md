# LINE 連携フルスタック — よくあるエラーと対処法

## 1. LINE webhook が届かない
**症状**: LINEで送ってもサーバーログに何も来ない
- LINE Developer Console の Webhook URL が正しいか
- 「Webhookの利用」が ON になっているか
- ngrok 等でローカル公開している場合、URL が再起動で変わっていないか
- bridge サーバーが起動しているか：`curl http://127.0.0.1:18789/health`

## 2. claude -p が起動しない / すぐ終わる
**症状**: `spawn-member-XXX.log` に「authentication failed」等
- `unset ANTHROPIC_API_KEY` してから bridge を再起動（OAuth にフォールバックさせる）
- 該当メンバーのディレクトリ `~/ai-company/members/XXX/` が存在するか確認
- `claude --version` で claude CLI が PATH に通っているか確認

## 3. メンバーが「同時に複数起動」してしまう
**症状**: 同じメッセージで何度も Claude セッションが立つ
- server.mjs の `spawnLocks` が機能しているか確認
- bridge を再起動してロックをリセット：`pkill -f "node server.mjs" && cd ~/ai-company/line-bridge && node server.mjs &`

## 4. MCPツール（mcp__line-harness__*）が使えない
**症状**: Claude セッション内で「Unknown tool」になる
- `~/.mcp.json` の path が正しいか（実在するファイルか）
- `LINE_HARNESS_API_KEY` が正しい値か
- `claude --debug mcp` でMCPサーバー起動エラーを確認（旧 `--mcp-debug` は deprecated）

## 5. push spawn なのに実作業しちゃう
**症状**: メンバーが headless モードでHTML作成等を始める
- そのメンバーの CLAUDE.md に「push spawn 時は実作業禁止」セクションがあるか確認
- なければ STEP 24 の inject-session-mode.sh を再実行

## 6. friendId が混ざる（leader アカウントから送信されちゃう）
**症状**: member-designer のはずが member-leader から返信される
- bridge spawn prompt に渡している friendId が正しいか確認
- 各メンバーの CLAUDE.md に「friendId は spawn promptで渡されるものを使う。owner-claude-co は使わない」明記

## 7. CLAUDE.md の日次更新Cronが動かない
- `crontab -l` で登録されているか確認
- パス指定が絶対パスか（`~` ではなく `/Users/xxx/`）
- ログ出力先を指定して原因を確認：`crontab -e` で `>> /tmp/cron.log 2>&1` を末尾に追加
