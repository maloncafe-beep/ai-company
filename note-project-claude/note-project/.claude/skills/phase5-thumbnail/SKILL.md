# phase5-thumbnail スキル

## 発動トリガー
「サムネ作って」「表紙画像作って」

## 目的
確定したタイトル・記事内容から、note販売ページ用のサムネ（表紙）画像を生成する。
**通常運用はローカル合成（無料）。Higgsfield（Nano Banana）での新規背景生成はクレジットを消費するため、新しい背景パターンが必要な時だけ行う。**

## 前提条件
- `products/YYYYMMDD-案件スラッグ/04-content/article-body.md` または `sales-page.md` でタイトル・内容が確定していること

## 使用ツール
- 通常：`scripts/make_note_banner.py`（Python/Pillow、ローカル・無料）
- 例外（新規背景が必要な時のみ）：Higgsfieldコネクタ（Nano Banana Pro／Nano Banana 2）

## 実行手順

### Step 1: 背景の有無を確認
`assets/banner_bases/` に記事テーマに合う文字なし背景があるか確認する（`config/banner-style.json` の `themes` も参照）。

- **ある場合** → Step 2へ（ローカル合成のみ、クレジット消費なし）
- **ない場合** → ユーザーに確認の上、Higgsfieldで文字なし背景を1枚だけ生成し `assets/banner_bases/` に保存、`config/banner-style.json` の `themes` に登録してから Step 2へ

### Step 2: ローカル合成で生成
```powershell
python scripts/make_note_banner.py `
  --title "確定タイトル" `
  --subtitle "サブタイトル（任意）" `
  --theme テーマキー1,テーマキー2 `
  --out products/YYYYMMDD-案件スラッグ/05-thumbnail/thumbnail-local-01.png
```
タイトル・サブタイトルの文言違いでA/B案を複数出す場合も、このスクリプトを複数回呼ぶだけでよい（追加コストなし）。

### Step 3: 保存
生成した画像は `products/YYYYMMDD-案件スラッグ/05-thumbnail/` に保存する（Step 2で直接出力先指定済みならそのまま）。

### Step 4: 開いて確認
CLAUDE.mdの全社ルールに従い、生成した画像は自動的に開いてユーザーに見せる。

### Step 5: LOG更新
`products/YYYYMMDD-案件スラッグ/LOG.md` に「ローカル合成」か「Higgsfield新規生成」か、使用した背景ファイル名を追記する。

## 次のフェーズへ
フェーズ4・5の全生成物が揃ったら `phase6-review` に進む。
