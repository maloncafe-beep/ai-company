# Xリサーチ運用メモ

目的は、正確な投稿数やいいね数を集計することではなく、X上の反応から「違和感収集家」向けのテーマ候補を見つけ、ローカルに保存し、その中から投稿下書きとしてスプレッドシートに追加することです。

## 基本コマンド

```powershell
npm run iwakan
```

この1回で次を行います。

1. `.env` のX投稿用キーでX API検索を行い、違和感テーマ候補を探す
2. `projects/x-research/iwakan-theme-pool.json` に候補をため込む
3. 未使用候補から3件を投稿文にする
4. IDを指定してGoogleスプレッドシートへ「下書き」として追加する


検索対象は `--days 90` を目安にします。ただし、X API側の契約プランにより、実際に検索できる過去期間は制限される場合があります。

## テーマだけため込む

```powershell
npm run iwakan -- --research-only
```

多めにためる場合:

```powershell
npm run iwakan -- --research-only --days 90 --themes 20
```

## Xリサーチ後のスプシ登録ルール

Xリサーチ後は、抽出された候補を全件Googleスプレッドシートへ登録しない。

まずローカルの以下を確認する。

- `projects/x-research/iwakan-theme-pool.json`
- `projects/x-research/results/*_iwakan_theme_research.md`

そのうえで、投稿する候補だけをGoogleスプレッドシート「投稿管理」へ登録する。

見送り候補はスプシに登録しない。すでに登録済みの場合も、行削除ではなくステータス変更や備考で管理する。


## ため込んだテーマから投稿下書きを作る

```powershell
npm run iwakan -- --draft-only --drafts 3
```

## Note記事用テーマプールを作る

```powershell
npm run iwakan -- --note-pool --research-only
```

既にため込んだXテーマから、Note記事用テーマだけ作る場合:

```powershell
npm run iwakan -- --note-only
```

Note記事を書くときは、次のファイルからテーマを選びます。

```text
projects/x-research/note-theme-pool.json
```

記事作成時の依頼例:

```text
x-auto-post-openai/projects/x-research/note-theme-pool.json から、
note-project-maloncafe向けに刺さりそうなテーマを1つピックアップして、
無料記事の構成案を作ってください。
```

## 探す方向を変える

```powershell
npm run iwakan -- --query "生産性 効率化 人手不足 属人化 評価制度 成果主義 管理職 目標設定 KPI 形だけの会議" --themes 12 --drafts 3
```
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

- テーマプール: `projects/x-research/iwakan-theme-pool.json`
- Note記事用テーマプール: `projects/x-research/note-theme-pool.json`
- リサーチ結果: `projects/x-research/results/*_iwakan_theme_research.md`
- Note記事用テーマ追加レポート: `projects/x-research/results/*_note_theme_pool.md`
- 下書き化レポート: `projects/x-research/results/*_iwakan_drafted_posts.md`
- API生レスポンス: `projects/x-research/data/*_iwakan_raw.json`

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
npm run iwakan -- --provider grok
```

Google認証が切れている場合は、先に以下を実行します。
./x-auto-post-openai/以下で実施

```powershell
node auth-google.mjs
```
それ以外は、
```powershell
npm run auth:google