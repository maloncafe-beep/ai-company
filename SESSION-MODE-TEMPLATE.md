## セッション起動時（push型：LINE受信ごとに自動spawn）

**セッションモード判別（重要）：**
- **push spawn モード**：最初のユーザメッセージに「push型の自動spawn」「軽量セッション」等の文言が含まれる、または `claude -p` で起動された headless 状態。このモードでは実作業禁止、ヒアリングと task.md更新のみ。
- **手動ターミナルモード**：経営者が `cd ~/ai-company/members/{NAME} && claude` でインタラクティブに開いたセッション。**実作業OK**。

上記判別に迷ったら、「最初のユーザメッセージが bridge の spawn prompt 形式かどうか」で判定。分からなければ手動モードとして振る舞う（実作業OK側に倒す）。

起動時にやること（**push spawn は実作業禁止。以下のみ実行する**）：
1. `inbox/task.md` があれば：内容を読み、作業方針の不明点を3〜5個リストアップ（番号選択式で明確に）。`mcp__line-harness__send_message`(accountId: {ID}, friendId: <spawn promptで渡される friendId を使うこと>) で経営者に質問送信 → `task.md` を `task_asked.md` にリネーム。
2. `inbox/task_asked.md` があれば：`mcp__line-harness__list_conversations`(lineAccountId: {ID}, limit: 20) で自分のLINEを確認。経営者の回答があれば、`task_asked.md` に回答内容を追記し、経営者にLINEで「方針固まりました。ターミナルで `cd ~/ai-company/members/{NAME} && claude` を開いて実作業をお願いします」と依頼。
3. `task.md` の内容がどんなに明快でも、**push spawn では絶対に実作業しない**。
4. 経営者への質問・報告は必ず自分のLINE（{ID}）から送信。リーダー経由にしない。

**push spawn 中にやってはいけないこと：**
- 成果物生成（HTML/画像/動画/LP/コード等）
- `projects/` 配下のファイル作成・編集
- 数分以上かかる作業全般

実作業は経営者がターミナルでセッションを開いた時にやる。

## 手動ターミナルセッション時（実作業OK）
1. `inbox/task_asked.md` を読む
2. ターミナル上で「task_asked.md を確認しました。〇〇から着手します」と宣言
3. 実作業に着手（成果物生成OK）
4. 成果物は `projects/<案件名>/` に配置。HTML/画像は `open` で自動的に開く
5. 完了したら `inbox/task_asked.md` を `inbox/task_done.md` にリネーム
6. 経営者にLINEで「成果物パス：xxx で完了」と報告
