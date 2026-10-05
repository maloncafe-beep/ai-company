# phase7-publish-promote スキル

## 発動トリガー
「投稿の準備して」「告知の手順教えて」

## 目的
note.comへの投稿とSNS告知の実行事項を整理する。**note.comへの投稿自体はClaude Codeが自動化しない。**

## 前提条件
- `phase6-review` で承認済みであること（`products/YYYYMMDD-案件スラッグ/06-review-checklist.md` の承認状況を確認する）

## note.comに実際に貼り付けるもの（重要）

note.comには本文と別立ての「販売ページ」は存在しない。貼り付けるのは **`04-content/article-body.md` 1本のみ**。

- `article-body.md`には、フェーズ4の時点で以下を組み込んでおく（フェーズ4のskillにも反映済み）
  - 冒頭のHTMLコメントに「note投稿手順メモ」（貼り付け方・有料エリア設定の位置・タグ・概要欄の使い回し先）
  - 本文末尾に`#タグ1, #タグ2, #タグ3`形式のハッシュタグ（公開時のタグ候補に自動で入る）
  - 本文中に `◆ここから先は有料◆` の区切り行（全体像=地図までは無料、具体的な中身から有料にするのが基本）
  - 特典（`bonus-content.md`）の内容は有料部分に直接統合済み。`bonus-content.md`自体は控え・将来の低価格スピンオフ素材として残すだけで、note本文には別途貼らない。本文中で「特典」「付属」という別物扱いの言葉は使わない
  - プロンプト例は必ずコードブロック（\`\`\`）形式にする
- `04-content/sales-page.md` は note本文には使わない。note投稿画面の「概要」欄と、SNS告知の元ネタとして使う

## 実行事項（ユーザーが実行）

1. note.comに `article-body.md` を貼り付け、`◆ここから先は有料◆` の直後で有料エリア設定を行う
   - タグ：`article-body.md`のフロントマターの`tags`欄、または本文末尾の`#`タグから設定
   - 概要欄：`sales-page.md`を要約して入力
   - 価格：`03-product-design.md`の価格欄
   - サムネ：`05-thumbnail/`から選択
2. 最終確認後、公開する
3. `x-auto-post`（別プロジェクト、Python／Codexで手動トリガー）を実行し、SNS告知を行う
   - SNS告知アカウントは`config/project-brief.md`の方針に従う（デフォルトは`@maloncafe`アカウント共有。note.comアカウント自体との分離とは別問題）
   - 告知文は`04-content/sns-announcement.md`から採用パターンを選び、記事URLを差し込んでから該当スプレッドシートに記入し、トリガーする

## Claude Codeが行うこと
- 上記の実行事項をチェックリストとして提示する
- 記事URLが確定したら、`products/YYYYMMDD-案件スラッグ/07-publish-log.md` に公開日・URL・価格を記録する
- SNS告知URLが確定したら、同ファイルに追記する
- `products/INDEX.md` のステータスを「公開済み」に更新する

## LOG更新
`products/YYYYMMDD-案件スラッグ/LOG.md` に公開日・結果（初速の閲覧数・購入数など分かる範囲の数字）を追記する。数字が出揃うタイミングで振り返りを追記してよい。
