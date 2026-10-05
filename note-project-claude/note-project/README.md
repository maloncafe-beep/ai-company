# Note-AI自動化工場

市場起点で有料note商品を企画・執筆・生成する工場。仕様は [`Note-AI自動化_ClaudeCode実行仕様書.md`](Note-AI自動化_ClaudeCode実行仕様書.md) が正。前提条件は [`config/project-brief.md`](config/project-brief.md) を参照。

## 2026-10-05の経緯（重要）
このフォルダは`.gitignore`対象かつ、別プロジェクト（`note-project-zodiacm`、Codex/Cursor向け）のセッションからも並行して触られることがあり、一度`.claude/skills/phase1〜7`・`products/`が消失した（`SESSION_RECOVERY_2026-10-01_to_05.md`参照）。経営者の判断で、このフォルダは**Claude Code向けの工場（企画〜公開まで一気通貫）として復元・継続**する。`research/`・`archive/`・`research-topic`スキルは別セッションが追加したもので、競合しない範囲でそのまま残している。

## フォルダ構成

```
note-project/
├── README.md
├── config/
│   ├── project-brief.md       ← 前提条件（アカウント・収益モデル・実行境界・一次資料の場所）
│   └── writing-style-guide.md
├── .claude/skills/            ← フェーズ1〜7＋research-topic（他セッション追加分）
├── products/                  ← 1案件=1フォルダ。INDEX.mdで一覧管理
├── research/                  ← 他セッション追加分のリサーチメモ
├── archive/                   ← 旧MALO資産（他セッションが整理）
├── assets/banner_bases/       ← バナー背景画像の置き場（任意）
└── scripts/make_note_banner.py ← バナー生成（Pillow、無料・即時）
```

## フェーズの流れ
1. テーマ決定（市場起点） → 2. 市場調査 → 3. 商品設計図 → 4. コンテンツ生成 → 5. バナー生成 → 6. 人によるレビュー（必須） → 7. 投稿・告知

フェーズ6を経ずにフェーズ7へ進んではならない。経営者の実作業はnote投稿・X投稿のみ。

## 外部連携
- SNS告知：`x-auto-post`（別プロジェクト、`@maloncafe`アカウント共有、手動トリガー）
- バナー：Pillowローカル生成（AI画像生成は使わない）
