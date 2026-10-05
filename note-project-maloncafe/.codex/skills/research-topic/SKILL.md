---
name: research-topic
description: note記事のためのトピックリサーチを行う。Web検索でテーマの中身・ファクト・哲学接続を収集しresearch/に保存する。市場・キーワード・競合は research-note-market を先に。「リサーチして」「調べて」「情報集めて」で使用。
---

# トピックリサーチ

需要・競合・有料化は [research-note-market](../research-note-market/SKILL.md)（市場リサーチ・執筆前）。
公開後のPDCAは [analyze-note-account](../analyze-note-account/SKILL.md)。

**推奨順**: `research-note-market`（A+B）→ **本スキル** → `write-note-article`

## ワークフロー

### Step 0: 市場リサーチの確認
- 同テーマの `research/*.md` に `## キーワード需要` があるか確認
- なければ先に research-note-market を実行するか、ユーザーに市場調査を提案する
- 市場セクションの「切り口候補」を `## 記事の切り口候補` に統合してよい

### Step 1: リサーチ目的の明確化
- 何についてリサーチするか
- どの記事タイプで使うか（4タイプのどれ）
- 哲学とどう接続するか

### Step 2: `config/company-philosophy.md` を読む
立ち位置・哲学を把握した上でリサーチする。

### Step 3: Web検索で情報収集
WebSearchツールで以下を収集:
1. **基本情報**: テーマの概要・背景
2. **データ・統計**: 数字で示せるファクト
3. **業界の現状**: 主要プレイヤー、トレンド
4. **ぶった切りポイント**: 既存の常識・定説で「実は間違っている」もの
5. **接続**: Well-being/LTR/価値提供/バズる との接点
6. **歴史**: 哲学・思想型記事用の歴史的背景（必要な場合）

### Step 4: リサーチメモ保存
`research/YYYYMMDD-テーマ名.md` で保存。

## リサーチメモフォーマット

```markdown
---
topic: リサーチテーマ
date: YYYY-MM-DD
article_type: experience-review / philosophy / company-story / vision-product
related_idea: アイデアプールの該当番号（あれば）
market_research: true  # research-note-market 実行済みの場合
---

# ○○に関するリサーチメモ

<!-- 市場リサーチ（research-note-market）: research/_market-sections-template.md を参照 -->
## キーワード需要
（未実施なら research-note-market を実行）

## 競合サンプル
（上位5記事・価格帯・差別化）

## 自アカウント指標
（あれば。なければ analyze-note-account で後追い）

## 有料化判断
（候補/見送り/価格帯）

## 概要
（テーマの基本情報を3〜5行）

## キーデータ
| データ | 数値 | 出典 |
|--------|------|------|
| | | |

## 業界の「常識」（ぶった切り候補）
- 常識1:（→ 実はこれが間違っている理由）
- 常識2:（→ わたしならこう切る）

## 歴史的背景（哲学型記事用）
- 時代1: ○○の主張 → 限界
- 時代2: △△の主張 → 限界
- 時代3: □□の主張 → 限界
→ **全部使えない。だから僕の答えは〜**

## 哲学との接続ポイント
- **Well-being**: このテーマと幸福の関係
- **LTR**: このテーマと長期関係の関係
- **Giver/Taker**: このテーマにおけるGive/Takeの構造
- **価値提供**: このテーマで価値提供はどう変わるか
- **バズる**: このテーマで「知る→できる」の変換はどうなるか

## 体験談で使えそうなもの
（config/author-profile.mdの「ストーリー素材」から関連するものをピックアップ）

## 記事の切り口候補
1. （切り口1）
2. （切り口2）
3. （切り口3）

## 参考リンク
- [タイトル](URL)
```

## 補足ルール

- 出典は必ず記録する
- ファクトと意見は明確に区別する
- 「わたしならどう斬るか」の視点を必ず入れる
- 哲学型記事の場合は歴史的な定義を幅広く調査する
- リサーチ後、最適な記事タイプとテンプレートを提案する
