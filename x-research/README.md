# Xリサーチ運用メモ

目的は、正確な投稿数やいいね数を集計することではなく、X上の反応から「違和感収集家」向けのテーマ候補を見つけ、ローカルに保存し、用途に応じて「Xへの投稿下書き」と「note記事テーマ」に分岐させることです。

このフォルダは `x-auto-post` / `x-auto-post-openai` と同列の独立プロジェクトです。
実行エンジンは `../x-auto-post-openai/tools/iwakan-workflow.mjs` を共用し、成果物はこの `x-research/` 配下に保存します。

## 分岐の考え方

```text
Xリサーチ
  ├─ X投稿へ: テーマプールから投稿文を作り、Googleスプレッドシートに下書き追加
  └─ noteへ: テーマプールからnote記事用テーマプールを作成
```

## 独立プロジェクトとしての基本コマンド

```powershell
cd C:\Users\yyasu\ai-company\x-research
```

まずリサーチだけ行う:

```powershell
npm run research -- --days 90 --themes 12
```

リサーチ済みテーマからX投稿下書きを作る:

```powershell
npm run to:x -- --drafts 3
```

リサーチ済みテーマからnote記事用テーマを作る:

```powershell
npm run to:note -- --themes 12
```

リサーチして、そのままnote記事用テーマまで作る:

```powershell
npm run research:to-note -- --days 90 --themes 12
```

リサーチからX投稿下書きまで一気に進める:

```powershell
npm run all -- --days 90 --themes 12 --drafts 3
```

## 一括実行

```powershell
npm run all
```

この1回で次を行います。

1. `.env` のX投稿用キーでX API検索を行い、違和感テーマ候補を探す
2. `iwakan-theme-pool.json` に候補をため込む
3. 未使用候補から3件を投稿文にする
4. IDを指定してGoogleスプレッドシートへ「下書き」として追加する


検索対象は `--days 90` を目安にします。ただし、X API側の契約プランにより、実際に検索できる過去期間は制限される場合があります。

## テーマだけため込む

```powershell
npm run research
```

多めにためる場合:

```powershell
npm run research -- --days 90 --themes 20
```

## Xリサーチ後のスプシ登録ルール

Xリサーチ後は、抽出された候補を全件Googleスプレッドシートへ登録しない。

まずローカルの以下を確認する。

- `iwakan-theme-pool.json`
- `results/*_iwakan_theme_research.md`

そのうえで、投稿する候補だけをGoogleスプレッドシート「投稿管理」へ登録する。

見送り候補はスプシに登録しない。すでに登録済みの場合も、行削除ではなくステータス変更や備考で管理する。


## ため込んだテーマから投稿下書きを作る

```powershell
npm run to:x -- --drafts 3
```

## Note記事用テーマプールを作る

```powershell
npm run research:to-note
```

既にため込んだXテーマから、Note記事用テーマだけ作る場合:

```powershell
npm run to:note
```

Note記事を書くときは、次のファイルからテーマを選びます。

```text
note-theme-pool.json
```

記事作成時の依頼例:

```text
x-research/note-theme-pool.json から、
note-project-maloncafe向けに刺さりそうなテーマを1つピックアップして、
無料記事の構成案を作ってください。
```

## Note向けキーワード実験を半自動で回す

「見えない仕事」「便利屋化」「できる人ほど損」「何も起きない仕事」など、Maloncafeのnote記事に寄せた検索軸だけを試す場合:

```powershell
npm run keyword:focus
```

これは以下をまとめて行います。

1. `keyword-profiles-invisible-work.json` の検索軸を順番にX API検索する
2. 取れたテーマを `iwakan-theme-pool.json` に追加する
3. `results/*_keyword_lab.md` に検索軸ごとの判定を出す

判定は `残す` / `様子見` / `材料不足` / `外す候補` で確認します。特に `materialPosts` が少ない検索軸は、テーマがよく見えても過剰生成の可能性があるため、記事化前に慎重に扱います。

まず検索計画だけ確認したい場合:

```powershell
npm run keyword:focus -- --dry-run
```

Noteテーマプール化は、レポートを見て採用テーマを決めてから行います。検索直後に自動でnote化すると、過去の未変換テーマも混ざる可能性があるため、現時点では検索と評価レポートまでを半自動化の範囲にします。

## 探す方向を変える

一時的に検索語を変えるだけなら、実行時に `--query` を指定します。

```powershell
npm run all -- --query "生産性 効率化 人手不足 属人化 評価制度 成果主義 管理職 目標設定 KPI 形だけの会議" --themes 12 --drafts 3
```

毎回使う標準キーワードを変える場合は、次のファイルだけを編集します。

```text
search-config.json
```

編集箇所は2つです。

```json
{
  "defaultQuery": "効率化 生産性 評価制度 成果主義 役割 期待 同調圧力 世代間ギャップ 働き方改革 多様性",
  "baseQueries": [
    "働き方改革 現場",
    "多様性 同調圧力",
    "生産性 余白",
    "評価制度 納得感"
  ]
}
```

`defaultQuery` は実行時の基本検索語です。`baseQueries` はX API検索で毎回追加される補助検索語です。検索方向を完全に変える場合は両方を揃えます。`npm run research` と `run_iwakan_themes.py` はどちらもこの設定を読みます。

【キーワード例】
効率化 生産性 評価制度 成果主義 役割 期待 同調圧力 世代間ギャップ 働き方改革 多様性

【仕事・労働構造】
生産性 効率化 人手不足 属人化 評価制度 成果主義 管理職 目標設定 KPI 形だけの会議 業務改善

【制度・常識と現場のズレ】
働き方改革 現場 多様性 同調圧力 心理的安全性 会議 ルール 暗黙の了解 建前

【家族・ケア・役割】
家族だから 親だから 子どものため 介護 ケア 責任 期待 距離感 役割分担

【お金・生活構造】
物価高 節約 老後資金 賃上げ 副業 生活防衛 可処分時間 家計

【成長・キャリアの建前】
学び直し キャリアアップ 市場価値 リスキリング やりたいこと 挑戦 目標設定

【言葉と制度のズレ】
多様性 心理的安全性 働き方改革 人的資本 ウェルビーイング 女性活躍 リスキリング

検索語は、個人の弱音や感情の重さを直接拾う言葉よりも、制度・役割・評価・建前・現場のズレが見える言葉を優先します。

## 出力先

- テーマプール: `iwakan-theme-pool.json`
- Note記事用テーマプール: `note-theme-pool.json`
- リサーチ結果: `results/*_iwakan_theme_research.md`
- Note記事用テーマ追加レポート: `results/*_note_theme_pool.md`
- 下書き化レポート: `results/*_iwakan_drafted_posts.md`
- API生レスポンス: `data/*_iwakan_raw.json`

## プール整理

`iwakan-theme-pool.json` と `note-theme-pool.json` は手動で削除せず、コマンドで整理します。

現在の件数とアーカイブ候補を見る:

```powershell
npm run pool:summary
```

指定日より前の使用済み候補を確認する:

```powershell
npm run pool:archive -- --before 2026-09-01
```

実際にアーカイブする:

```powershell
npm run pool:archive -- --before 2026-09-01 --apply
```

`iwakan-theme-pool.json` は、初期設定では `status` が `new` ではないもの、または `notePoolExportedAt` があるものをアーカイブ候補にします。`note-theme-pool.json` は、初期設定では記事化済みやステータス変更済みのものだけを対象にします。

noteの `status: "idea"` も古いものを退避したい場合:

```powershell
npm run pool:archive -- --pool note --before 2026-09-01 --include-ideas --apply
```

実行時は `archives/` に月別ファイルを作り、同時に `archives/snapshots/` に実行前のプール全体を保存します。

## 必要な設定

`.env` に以下が必要です。

```env
XAI_API_KEY=
OPENAI_API_KEY=
SPREADSHEET_ID=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_TOKENS_PATH=./credentials/tokens.json
```

`XAI_API_KEY` は任意です。通常は `.env` の `X_API_KEY` / `X_API_KEY_SECRET` / `X_ACCESS_TOKEN` / `X_ACCESS_TOKEN_SECRET` を使います。Grokの `x_search` を使いたい場合だけ、別途 `XAI_API_KEY` を設定して次のように実行します。

```powershell
npm run research -- --provider grok
```

Google認証が切れている場合は、先に以下を `x-auto-post-openai/` 以下で実行します。

```powershell
node auth-google.mjs
```
それ以外は、
```powershell
npm run auth:google
```
