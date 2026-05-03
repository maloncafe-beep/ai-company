# タスク：スレッド16〜18・リメイク26〜28 をスプシに登録

## 依頼元
Leader（leaderレビュー承認済み）

## 背景
現在の最終登録IDはID46（05/08 12:00）。次の投稿が途切れないよう早急に登録する。

## やること
スプシ（x-auto-post投稿管理シート）に以下6件を登録する。
IDはスプシの現在の最大IDを確認してから採番すること。

### 登録内容

| # | 種別 | ファイル | テーマ | 投稿日時（案） |
|---|------|---------|-------|-------------|
| 1 | スレッド | `members/writer/projects/blog-001/x-thread-16-tsugikara-kiotsukeru.md` | 次から気をつける | ID46直後から順番に |
| 2 | スレッド | `members/writer/projects/blog-001/x-thread-17-atode-yomu.md` | 後で読む | 〃 |
| 3 | スレッド | `members/writer/projects/blog-001/x-thread-18-mousukoshidake.md` | もう少しだけ | 〃 |
| 4 | リメイク | `members/writer/projects/blog-001/x-remix-26-tsugikara-kiotsukeru.md` | 次から気をつける | 対応スレッドの翌日12:00 |
| 5 | リメイク | `members/writer/projects/blog-001/x-remix-27-atode-yomu.md` | 後で読む | 〃 |
| 6 | リメイク | `members/writer/projects/blog-001/x-remix-28-mousukoshidake.md` | もう少しだけ | 〃 |

## 登録ルール（確認）
- スレッドは21:00、リメイクは翌日12:00（既存パターン踏襲）
- リメイクの備考列：`リメイク版（元スレッドID-登録ID）` 形式で記入
- 登録後、**リメイク26〜28のスプシIDをWriterに通知**（Writerがフロントマターの `元スレッドID` を更新するため）

## 完了後
1. `inbox/task.md` を `inbox/task_done.md` にリネーム
2. `projects/x-maloncafe/LOG.md` に追記
3. `git add -A && git commit`
4. `leader/inbox/review_request.md` を作成してレビュー依頼
