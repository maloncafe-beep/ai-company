# note記事量産プロジェクト

わたし/ 会社のnote記事をAIでガシガシ量産するためのプロジェクト。

## プロジェクト構造

```
.
├── .cursor/
│   ├── rules/
│   │   └── note-writing.mdc           ← 全体ルール（常に適用）
│   └── skills/
│       ├── generate-article-idea/      ← 「ネタ考えて」で発動
│       ├── research-note-market/       ← 「キーワード調べて」「市場調査して」で発動（第2層・書く前）
│       ├── research-topic/             ← 「調べて」「情報集めて」で発動（第1層・テーマの中身）
│       ├── analyze-note-account/       ← 「ダッシュボード分析」「PDCAして」で発動（書いた後）
│       ├── write-note-article/         ← 「記事書いて」で発動
│       └── polish-article/             ← 「推敲して」で発動
├── config/
│   ├── author-profile.md              ← プロフィール・文体設定
│   ├── addness-philosophy.md          ← 哲学リファレンス
│   └── writing-style-guide.md         ← ライティングスタイルガイド
├── ideas/
│   └── idea-pool.md                   ← アイデアをストック
├── research/                          ← リサーチメモ置き場
│   ├── CHECKLIST.md                   ← A→B→C の実務チェックリスト
│   ├── _market-sections-template.md   ← 市場リサーチ追記用
│   └── _pdca-template.md              ← 自アカウント分析用
├── templates/
│   ├── experience-review.md           ← TYPE A: 体験レビュー型
│   ├── philosophy.md                  ← TYPE B: 哲学・思想型
│   ├── company-story.md               ← TYPE C: 会社ストーリー型
│   └── vision-product.md              ← TYPE D: ビジョン・プロダクト型
├── articles/
│   ├── drafts/                        ← 下書き
│   ├── review/                        ← レビュー中
│   └── published/                     ← 公開済み
└── README.md
```

## 4つの記事タイプ

| タイプ | テンプレート | 参考記事 | スキ数 |
|--------|------------|---------|--------|
| 体験レビュー型 | `experience-review.md` | ClaudeCoworkでnote書いてみた | 55 |
| 哲学・思想型 | `philosophy.md` | 僕は「愛」を証明してみた | 94 |
| 会社ストーリー型 | `company-story.md` | 2031年3兆円に向けて | 18 |
| ビジョン・プロダクト型 | `vision-product.md` | バズる。"Take it Easy!!" | 175 |

## 使い方

### リサーチの全体像（2層 + PDCA）

```
アイデア → 市場リサーチ(A+B) → トピックリサーチ(第1層) → 執筆 → 公開 → 自アカウント分析(C) → アイデア更新
```

詳細は `research/CHECKLIST.md`。

### 1. 「ネタ考えて」
→ アイデア生成スキルが発動。6つのフレームワークでアイデアを生成。

### 2. 「キーワード調べて」「市場調査して」（書く前）
→ **research-note-market** が発動。note内需要・競合・有料化判断を `research/` に保存。

### 3. 「○○について調べて」「情報集めて」（書く前）
→ **research-topic** が発動。テーマのファクト・哲学接続を同じリサーチメモに追記（市場調査の後が推奨）。

### 4. 「記事書いて」
→ 執筆スキルが発動。リサーチメモ（市場＋第1層）を参照して下書きを生成。

### 5. 「推敲して」
→ 推敲スキルが発動。

### 6. 「ダッシュボード分析して」「PDCAして」（書いた後）
→ **analyze-note-account** が発動。スキ率・次に書くテーマ5本・有料化候補を出力。idea-pool の想定バズ度更新にも使う。

## config ファイルの役割

| ファイル | 役割 |
|---------|------|
| `author-profile.md` | 作者の基本情報、文体、避けたいこと、参考記事 |
| `addness-philosophy.md` | Well-being/LTR/Giver・Taker/価値提供/アドる の定義 |
| `writing-style-guide.md` | 太字の使い方、改行ルール、語尾パターン、構成パターン |
