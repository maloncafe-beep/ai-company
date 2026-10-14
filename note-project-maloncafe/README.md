# Maloncafe note記事プロジェクト

Maloncafeのnote記事を、アイデア、リサーチ、下書き、推敲、公開、PDCAまで一貫して扱うためのプロジェクト。

目的は単なる量産ではなく、**まろさん本人の違和感・経験・思想が伝わる記事を再現性高く作ること**。

## プロジェクト構造

```
.
├── .codex/
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
│   ├── article-production-modes.md    ← 記事制作モードと自動化可否
│   ├── company-philosophy.md          ← 哲学リファレンス
│   ├── publishing-and-banner-rules.md ← 投稿頻度・レビュー・バナー運用
│   └── writing-style-guide.md         ← ライティングスタイルガイド
├── ideas/
│   ├── idea-pool.md                   ← アイデアをストック
│   └── _trend-keyword-intake.md       ← 流行キーワード起点のネタ出し
├── research/                          ← リサーチメモ置き場
│   ├── CHECKLIST.md                   ← A→B→C の実務チェックリスト
│   ├── _article-source-routes.md      ← 記事リサーチ起点の分岐ルール
│   ├── _deep-research-method.md       ← 浅い検索記事にしないための深掘りルール
│   ├── _market-sections-template.md   ← 市場リサーチ追記用
│   └── _pdca-template.md              ← 旧PDCAテンプレート
├── analysis/                          ← 公開後分析置き場
│   ├── INDEX.md                       ← 分析ファイル一覧
│   ├── articles/                      ← 記事ごとの公開後分析
│   └── account/                       ← アカウント全体のPDCA
├── templates/
│   ├── experience-review.md           ← TYPE A: 体験レビュー型
│   ├── philosophy.md                  ← TYPE B: 違和感を定義に変える記事
│   ├── company-story.md               ← TYPE C: 経験が思想になる記事
│   └── vision-product.md              ← TYPE D: 小さな変化から未来を読む記事
├── assets/
│   └── banners/                       ← note見出し画像・バナー素材
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
| 違和感を定義に変える記事 | `philosophy.md` | 世の中の言葉に残る違和感を、自分の定義で置き直す | - |
| 経験が思想になる記事 | `company-story.md` | 経験が価値観や発信テーマに変わる過程を書く | - |
| 小さな変化から未来を読む記事 | `vision-product.md` | 小さな実感や違和感から構造変化を読む | - |

## 使い方

### リサーチの全体像（2層 + PDCA）

```
流行キーワード候補 → まろさんの選定 → 起点判定 → 市場リサーチ(A+B) → 深掘りリサーチ → トピックリサーチ(第1層) → 執筆 → 公開 → 公開後分析(C) → アイデア更新
```

詳細は `research/CHECKLIST.md`。

記事化の起点は、主に2種類で判定する。

| 起点 | 内容 | 向いている記事 |
|------|------|----------------|
| Xリサーチ起点 | X上の違和感・言葉・反応から作る | `普通わかるでしょ`、`正論なのに苦しい` 系 |
| 用語・概念リサーチ起点 | 外部記事・ニュース・専門用語から作る | 追認バイアス、ツイニングバイアス、認知バイアス系 |

分岐ルールは `research/_article-source-routes.md`。

検索結果から直接記事を書かない。反応の良かった記事と同じように、用語・状況・読者の日常例・Maloncafeとしての置き直しを `research/_deep-research-method.md` に沿ってMD化してから構成する。

ネタ切れ対策として、最初に流行キーワード・注目用語・SNS上の違和感語を候補出しし、まろさんが「ピッと感じる」ものだけを深掘りする。候補出しのルールは `ideas/_trend-keyword-intake.md`。

また、記事は制作モードで自動化可否を分ける。さらっと流す記事や案内記事は自動化しやすい。一方で、しっかり調べて書く主力記事は、まろさんの判断を必ず挟む。制作モードのルールは `config/article-production-modes.md`。

制作モードは、読み手の反応も分けて考える。軽い記事はコメントや接点、案内記事は行動導線、深い記事は「この人やるな」「この人の考え方いいな」という信頼形成を担う。

投稿頻度・レビュー頻度・バナーの使い分けは `config/publishing-and-banner-rules.md`。現状は月1本程度なので、まずは月2本前後を目安にし、軽い記事と深い記事を混ぜる。バナーは色や雰囲気で「軽い記事」「案内記事」「しっかり記事」の違いが伝わるようにする。

### 1. 「ネタ考えて」
→ アイデア生成スキルが発動。ネタ切れ・流行キーワード起点の場合は、まず候補キーワードを出し、選ばれたものだけ深掘りへ進める。

### 2. 「キーワード調べて」「市場調査して」（書く前）
→ **research-note-market** が発動。note内需要・競合・有料化判断を `research/` に保存。

### 3. 「○○について調べて」「情報集めて」（書く前）
→ **research-topic** が発動。テーマのファクト・哲学接続を同じリサーチメモに追記（市場調査の後が推奨）。

### 4. 「記事書いて」
→ 執筆スキルが発動。リサーチメモ（市場＋第1層）を参照して下書きを生成。

### 5. 「推敲して」
→ 推敲スキルが発動。

### 6. 公開
→ 公開候補を `articles/published/` にコピーし、フロントマターを `status: published` にする。元下書きには `published_copy`、公開済みコピーには `source_draft` を付ける。

### 7. 「ダッシュボード分析して」「PDCAして」（書いた後）
→ **analyze-note-account** が発動。`analysis/` にスキ率・次に書くテーマ5本・有料化候補を保存。idea-pool の想定バズ度更新にも使う。

## 自動化用のファイル規約

### 記事

| フォルダ | 役割 | status |
|---------|------|--------|
| `articles/drafts/` | 執筆中・公開前の下書き | `draft` |
| `articles/review/` | レビュー中・一時確認用 | `review` |
| `articles/published/` | noteに公開済み、または公開用に確定したコピー | `published` |

公開時はファイルを直接上書きせず、下書きから公開用コピーを作る。

推奨メタデータ:

```yaml
status: draft | review | published
version: v1
production_mode: light_note | guide_or_offer | deep_article
automation_level: auto | semi_auto | manual_review_required
source_research:
  - research/YYYYMMDD-テーマ名.md
published_copy: articles/published/YYYYMMDD-タイトル.md
source_draft: articles/drafts/YYYYMMDD-タイトル.md
```

### リサーチ

| 種類 | 保存先 | 備考 |
|------|--------|------|
| 起点判定 | `research/_article-source-routes.md` | `x_research` / `concept_research` を最初に決める |
| 深掘りリサーチ | `research/YYYYMMDD-テーマ名.md` | `research/_deep-research-method.md` に沿ってMD化 |
| 市場リサーチ | `research/YYYYMMDD-テーマ名.md` | `market_research: true` を付ける |
| トピックリサーチ | `research/YYYYMMDD-テーマ名.md` | 市場メモに追記、または同テーマで作成 |

### 公開後分析

| 種類 | 保存先 | 備考 |
|------|--------|------|
| 記事別分析 | `analysis/articles/YYYYMMDD-記事名.md` | PV・スキ率・CTA・改善仮説 |
| アカウントPDCA | `analysis/account/YYYYMMDD-account-pdca.md` | 月次・週次の全体分析 |

公開後分析では、記事本文をすぐ直すより先に「数字」「仮説」「次アクション」を残す。

### テンプレート

`templates/` には、記事生成に直接使うテンプレートだけを置く。調査メモや一回限りの資料は `research/` に置く。

## config ファイルの役割

| ファイル | 役割 |
|---------|------|
| `author-profile.md` | 作者の基本情報、文体、避けたいこと、参考記事 |
| `article-production-modes.md` | さらっと流す記事、案内記事、主力記事の制作モード |
| `company-philosophy.md` | Well-being/LTR/Giver・Taker/価値提供/バズる の定義 |
| `publishing-and-banner-rules.md` | 投稿頻度、レビュー頻度、分析頻度、バナー色の使い分け |
| `writing-style-guide.md` | 太字の使い方、改行ルール、語尾パターン、構成パターン |

## 整理済み

以下は 2026-10-02 に整理済み。

- `.DS_Store`, `articles/.DS_Store` は削除済み
- `templates/20260630-note有料化_構造対立リサーチ.md` は `research/20260630-note有料化_構造対立リサーチ.md` に移動済み
- `Template_Note_for_Claude.md` は削除済み
