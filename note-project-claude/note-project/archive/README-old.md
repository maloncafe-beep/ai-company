# note記事量産プロジェクト（Claude版）

Maloncafe / AI-Companyとしてのnote記事をAIで量産するプロジェクト。
Cursorプロジェクト（note-project-sample）からの引き継ぎ版。

## プロジェクト構造

```
.
├── .claude/
│   └── skills/
│       ├── generate-article-idea/  ← ネタ生成
│       ├── write-note-article/     ← 記事執筆
│       ├── research-topic/         ← リサーチ
│       └── polish-article/         ← 推敲
├── config/
│   ├── author-profile.md           ← プロフィール・文体設定
│   ├── company-philosophy.md       ← 哲学リファレンス
│   └── writing-style-guide.md      ← ライティングスタイルガイド
├── ideas/
│   └── idea-pool.md                ← アイデアストック
├── research/                       ← リサーチメモ
├── templates/
│   ├── experience-review.md        ← TYPE A: 体験レビュー型
│   ├── philosophy.md               ← TYPE B: 哲学・思想型
│   ├── company-story.md            ← TYPE C: 会社ストーリー型
│   └── vision-product.md           ← TYPE D: ビジョン・プロダクト型
├── articles/
│   ├── drafts/                     ← 下書き
│   ├── review/                     ← レビュー中
│   └── published/                  ← 公開済み
└── README.md
```

## 4つの記事タイプ

| タイプ | テンプレート | スキ数目安 |
|--------|------------|-----------|
| 体験レビュー型 | experience-review.md | 55スキ参考 |
| 哲学・思想型 | philosophy.md | 94スキ参考 |
| 会社ストーリー型 | company-story.md | 18スキ参考 |
| ビジョン・プロダクト型 | vision-product.md | 175スキ参考 |

## 使い方

### 「ネタ考えて」
→ generate-article-ideaスキルで6フレームワーク（哲学バズーカ法、体験ファースト法、業界ぶった切り法、会社の裏側法、人生ストーリー法、AI×哲学法）でアイデア生成。

### 「○○について調べて」
→ research-topicスキルでWeb検索＋哲学との接続ポイントを含めたリサーチメモ生成。

### 「記事書いて」
→ write-note-articleスキルでスタイルガイド準拠の記事生成。

### 「推敲して」
→ polish-articleスキルでスタイル再現度・哲学接続・バズ度を多角的にチェック。

## ファイル管理ルール

- 下書き: `articles/drafts/YYYYMMDD-タイトル.md`
- レビュー中: `articles/review/`
- 公開済み: `articles/published/`
- リサーチメモ: `research/YYYYMMDD-テーマ名.md`
- アイデア: `ideas/idea-pool.md`

## 絶対に禁止する操作

- ファイル・フォルダの削除
- ユーザーへの確認なしに既存ファイルを大幅に変更すること
