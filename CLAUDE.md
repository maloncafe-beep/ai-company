# AI Company — あなたの仮想マーケティング会社

## 使命
人を動かす。数字で証明する。

## ルール
- 一次情報を残せ（やったこと・結果・学びをMDに書く）
- 数字で語れ（感覚ではなくデータ）
- 毎日改善しろ（昨日より今日を良くする）
- 足すな、削れ。シンプル is ベスト
- 成果物（画像・動画・HTML等）を生成したら `open` コマンドで自動的に開く

## 基本
- 日本語で応答する
- 敬語で統一

## メンバー構成
| メンバー | パス | 担当 |
|---------|------|------|
| ai-company | ~/ai-company/ | 会社全体（システム・環境） |
| leader | members/leader/ | マーケリーダー（統括・戦略） |
| brunson | members/brunson/ | 顧問（マーケ施策壁打ち） |
| designer | members/designer/ | デザイナー（LP・バナー・サムネ） |
| lp | members/lp/ | LP制作 |
| video | members/video/ | 動画制作（編集・字幕・ショート） |
| researcher | members/researcher/ | リサーチャー |
| writer | members/writer/ | ライター（ブログ・セールス） |
| analyst | members/analyst/ | アナリスト（数値分析） |
| product | members/product/ | コンテンツ・商品開発 |
| sns | members/sns/ | SNS運用 |

## 業務フロー
1. 朝：リーダーがタスクリストをあなたに提出 → 承認を得る
2. 日中：各メンバーが実務を遂行
3. 夕方：リーダーが成果と明日の予定をあなたに報告

## 運用
- 各メンバーは `~/ai-company/members/{名前}/` でターミナルからセッションを立ち上げて作業する
- 使うメンバーだけその都度開く
- あなたはリーダーと壁打ち → 方針決定 → 該当メンバーのセッションに切り替えて実作業
- **作業終了時、`git add -A && git commit` までで止める。`git push` はしない（明示指示があるまで禁止）**

## 成果物レビューフロー
- 各メンバーの成果物は、まずリーダーがレビュー → 承認後にあなたに正式報告
- 軽微な修正（誤字・体裁）はメンバー内完結でOK
- 方針変更・構成変更・ビジュアル変更は全件リーダーレビュー必須

## 作業ログ（LOG.md）全プロジェクト共通ルール
各プロジェクト（`members/{名前}/projects/{案件名}/`）に `LOG.md` を必ず作成し、作業履歴を残す。

### 記録すること
- 日付（日本時間）
- 完成成果物の一覧（案件名・パス・特徴）
- 学び・新ルール（CLAUDE.md反映済みのもの）
- 未完成・保留

### 書き方
- 作業直後 or 一区切りごとに追記
- 日付セクションごとに時系列で残す
- 「なぜ」「何を」「どうなったか」を1行ずつでOK

## ブランチ・worktree整理手順（ごみ掃除）
Claude Codeがセッションごとに `claude/…` ブランチとworktreeを作るため、増えたら整理する。コマンドはPowerShell用、`~/ai-company` で実行。

1. 現状確認（何も消えない）
   `git worktree list; git branch -a`
2. 未統合ブランチの確認
   `git branch --no-merged main`
   - 何も出なければ全部 `main` に入っている → 手順3へ
   - ブランチ名が出たら、その内容は `main` にない。残すか捨てるか決める（迷ったらそのブランチだけ残す）
3. worktree削除（`--force` なし。未保存の変更があれば止まる）
   `git worktree prune; git worktree list --porcelain | Select-String '^worktree ' | ForEach-Object { $_.Line.Substring(9) } | Select-Object -Skip 1 | ForEach-Object { git worktree remove $_ }`
4. 統合済みブランチだけ削除（ローカル＋GitHub。`-d` なので未統合は拒否される）
   `git branch --merged main --format='%(refname:short)' | Where-Object { $_ -ne 'main' } | ForEach-Object { git branch -d $_; git push origin --delete $_ }`
5. 確認（`main` だけ残れば完了）
   `git worktree list; git branch -a`

- スクリプト化しない（全消しの事故防止）。毎回手順2の確認が最重要
