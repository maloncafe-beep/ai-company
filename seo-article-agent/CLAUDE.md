# seo-article-agent — SEO記事自動生成ツール

対話だけでSEO記事を作成し、Google ドキュメントに出力するツール。
キーワード選定からAIがサポートする。

## コマンド一覧

```bash
npm install                          # 依存関係インストール
node auth-google.mjs                 # Google OAuth 認証
node tools/init-spreadsheet.mjs      # スプシ接続テスト（--id でID保存）
node tools/create-template-sheet.mjs # テンプレートスプシ新規作成
node tools/build-dist.mjs            # 配布用 ZIP 生成
```

## プロジェクト構成

```
seo-article-agent/
├── CLAUDE.md              ← このファイル（全スキル定義を含む）
├── package.json
├── .env.example           ← 環境変数テンプレート
├── .env                   ← 実際の環境変数（gitignore対象）
├── auth-google.mjs        ← Google OAuth フロー
├── setup/
│   └── SETUP-FOR-CC.md   ← セットアップ手順書
├── tools/
│   ├── lib/sheets.mjs    ← Sheets API ヘルパー
│   ├── lib/docs.mjs      ← Docs API ヘルパー
│   ├── init-spreadsheet.mjs
│   ├── create-template-sheet.mjs
│   └── build-dist.mjs
├── .claude/skills/write-article/
│   └── SKILL.md          ← 記事作成スキル（Claude Code用）
├── .cursor/skills/write-article/
│   └── SKILL.md          ← 記事作成スキル（Cursor用）
└── credentials/tokens.json ← Google OAuth（gitignore対象）
```

## 共通ルール

- ユーザーはプログラミング未経験者の場合がある。1ステップずつ案内する
- ユーザーにファイルを直接編集させない。必要な値はチャットで受け取り、エージェントが設定する
- エラーが起きたら、何が起きたか・次に何をすればいいかを平易に伝える

---

## トリガー

| ユーザーの発話 | 発動するスキル |
|--------------|-------------|
| 「開始」「始める」「スタート」 | セットアップスキル |
| 「セットアップして」「初期設定して」 | セットアップスキル |
| 「記事書いて」「SEO記事作って」「ブログ書いて」 | 記事作成スキル |
| 「履歴見せて」「何書いた？」 | 履歴確認スキル |

---

## セットアップスキル

初回セットアップ専用。`setup/SETUP-FOR-CC.md` を読み、その手順に従って進行する。

### 最初にやること

**必ず `setup/SETUP-FOR-CC.md` を読む。** このファイルを唯一の正本として扱う。

### 進め方

1. `setup/SETUP-FOR-CC.md` を読む
2. 足りないものを1つずつ確認する
3. ユーザーがやる操作は、その都度短く案内する
4. 認証・テンプレートからのスプレッドシートコピーまで完了させる
5. 最後に接続テストが通る状態か確認する

### 重要ルール

- 認証設定は `.env` のみを使う
- 初回は一気に説明せず、次の1アクションだけを伝える
- ユーザーにファイルを直接編集させない。チャットに値を貼り付けてもらい、エージェントが `.env` を自動で生成・更新する
- スプレッドシートはテンプレートからコピーしてもらう。テンプレートURL: `https://docs.google.com/spreadsheets/d/1HEoY3E10mFx3CohCsvEqyS9GDjisQVIeCKcU6FRQyAY/copy`
- コピー後のスプレッドシートIDは `.env` の `SPREADSHEET_ID` に書き込む

### 完了の定義

- `.env` が存在し、`GOOGLE_CLIENT_ID`、`GOOGLE_CLIENT_SECRET`、`SPREADSHEET_ID` が入っている
- `credentials/tokens.json` が存在する
- `node tools/init-spreadsheet.mjs` が正常終了する

### 完了後の案内

```text
セットアップが完了しました！

「記事書いて」と言えば、SEO記事の作成を始められます。
```

---

## 記事作成スキル（メイン）

`.claude/skills/write-article/SKILL.md`（or `.cursor/skills/write-article/SKILL.md`）を読んで実行する。

### 使う場面

- ユーザーが「記事書いて」「SEO記事作って」「ブログ書いて」と言ったとき

### フロー概要

1. ジャンル・テーマをヒアリング
2. AIがキーワード候補を5つ提案 → ユーザーが選ぶ
3. 文体・トーンを確認（ですます / カジュアル / 専門的 等）
4. 構成案（見出し）を提示 → ユーザーが承認
5. 本文を生成（4,000〜6,000字）
6. Google ドキュメントに出力
7. スプシの記事ログに追記（キーワード・title・URL・文字数・作成日）

### 注意

- **構成案の承認なしに本文生成に進まない**
- キーワードをユーザーが直接指定してきた場合は、提案フェーズをスキップしてOK
- 文体指定がなければ「ですます調」をデフォルトにする

---

## 履歴確認スキル

スプシに記録された記事ログを表示する。

### 使う場面

- ユーザーが「履歴見せて」「何書いた？」「記事の一覧」と言ったとき

### 実行手順

```bash
node --input-type=module -e "
import { readSheet } from './tools/lib/sheets.mjs';
const rows = await readSheet('記事ログ');
rows.forEach(r => console.log(JSON.stringify(r)));
"
```

結果を見やすくフォーマットして返す:

```text
これまでに作成した記事:

1. 「SEO対策 やり方」— 5,200字 — 2026/04/03
   → https://docs.google.com/document/d/xxxx/edit

2. 「被リンク 増やし方」— 4,800字 — 2026/04/05
   → https://docs.google.com/document/d/yyyy/edit

合計 2 記事
```

---

## スプレッドシート構成

SSOT: Google スプレッドシート（テンプレートコピー方式）

### 記事ログシート（出力専用）

| 列 | 内容 |
|----|------|
| A: キーワード | 対象キーワード |
| B: title | SEO タイトル |
| C: 記事URL | Google ドキュメントの URL |
| D: 文字数 | 完成記事の文字数 |
| E: 作成日 | yyyy/MM/dd |

スプシはユーザーが編集する場所ではなく、記事生成の履歴が自動的に追記される場所。

---

## 技術スタック

- Node.js (ESM)
- `googleapis` — Sheets API v4 + Docs API v1 + Drive API v3
