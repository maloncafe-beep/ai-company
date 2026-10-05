# みかみ note記事量産プロジェクト

三上功太（みかみ）/ アドネス株式会社のnote記事をAIでガシガシ量産するためのプロジェクト。

## プロジェクト構造

```
.
├── .cursor/
│   ├── rules/
│   │   └── note-writing.mdc           ← 全体ルール（常に適用）
│   └── skills/
│       ├── generate-article-idea/      ← 「ネタ考えて」で発動
│       ├── write-note-article/         ← 「記事書いて」で発動
│       ├── research-topic/             ← 「調べて」で発動
│       └── polish-article/             ← 「推敲して」で発動
├── config/
│   ├── author-profile.md              ← みかみのプロフィール・文体設定
│   ├── addness-philosophy.md          ← アドネス哲学リファレンス
│   └── writing-style-guide.md         ← ライティングスタイルガイド
├── ideas/
│   └── idea-pool.md                   ← アイデアをストック
├── research/                          ← リサーチメモ置き場
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
| ビジョン・プロダクト型 | `vision-product.md` | アドる。"Addness it!!" | 175 |

## 使い方

### 1. 「ネタ考えて」
→ アイデア生成スキルが発動。6つのフレームワーク（哲学バズーカ法、体験ファースト法、業界ぶった切り法、アドネスの裏側法、みかみの人生ストーリー法、AI×アドネス哲学法）でアイデアを生成。

### 2. 「○○について調べて」
→ リサーチスキルが発動。Web検索 + アドネス哲学との接続ポイントを含めたリサーチメモを生成。

### 3. 「記事書いて」
→ 執筆スキルが発動。みかみのスタイルガイドに完全準拠した記事を生成。

### 4. 「推敲して」
→ 推敲スキルが発動。みかみスタイル再現度・アドネス哲学接続・バズ度を多角的にチェック。

## config ファイルの役割

| ファイル | 役割 |
|---------|------|
| `author-profile.md` | みかみの基本情報、文体、避けたいこと、参考記事 |
| `addness-philosophy.md` | Well-being/LTR/Giver・Taker/価値提供/アドる の定義 |
| `writing-style-guide.md` | 太字の使い方、改行ルール、語尾パターン、構成パターン |
