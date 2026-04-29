# 特典ページ カタログ型パターン（template-catalog）

15件以上の独立したテンプレート・チェックリスト集などを「一覧＋1クリックコピー」で提供する用途向け。単一HTML型（insta-pattern）・章立て型（chapter-pattern）に続く3パターン目。

**リファレンス実装**：`projects/claude-md-templates/` （2026-04-15 CLAUDE.mdテンプレート集ビジネス15選）
公開URL：`https://dashing-chimera-1e522b.netlify.app/`

---

## いつ使うか

| 状況 | 推奨パターン |
|---|---|
| ステップバイステップで読み進める学習教材 | 単一HTML（`tokuten-structure.md`） |
| 大規模・章で区切られた構築マニュアル | 章立て型（`tokuten-chapter-pattern.md`） |
| **独立した15件以上のテンプレ・コード集** | **カタログ型（本パターン）** |

目安：読者が**順番に読まない**・**必要なものだけコピペで使う**用途。

---

## ディレクトリ構成

```
projects/<案件名>/
├── index.html
├── fv.png
└── （LOG.mdは外に：projects/<案件名>-LOG.md）
```

---

## ページ構成

### 1. ヘッダー
- ロゴバー
- スクロール背景テキスト
- title-section（BADGE・slash・H1・subtitle）

### 2. イントロカード
- FV画像（または CSS-only ヒーロー）
- 「このテンプレ集について」説明
- **使い方3ステップ**（番号付き）

### 3. カテゴリセクション（複数）
- カテゴリ見出し＋件数バッジ（例：`📣 マーケ系 5`）
- テンプレカードのグリッド

### 4. テンプレカード（本体）
- アイコン（絵文字 or SVG）
- テンプレ番号（`TEMPLATE 01` のようなラベル）
- タイトル＋1行説明
- **展開ボタン**（▼）
- 展開時：`<pre>` ブロックにコード全文＋**コピーボタン**

### 5. Final CTA
- 締めメッセージ
- 次アクション案内

---

## CSSキーポイント

### グリッドレイアウト
```css
.template-grid{
  display:grid;
  gap:16px;
  grid-template-columns:repeat(auto-fit,minmax(280px,1fr))
}
```
- 幅 280px 下限で自動折返し
- デスクトップ3列・タブレット2列・モバイル1列

### カード展開アニメ
```css
.tpl-body{max-height:0;overflow:hidden;transition:max-height .35s ease}
.tpl-card.open .tpl-body{max-height:1200px}
```

### コピーボタン（Clipboard API）
```js
navigator.clipboard.writeText(content).then(() => {
  btn.classList.add('copied');
  btn.textContent = '✅ コピーしました！';
  setTimeout(() => btn.textContent = '📋 コピーする', 2000);
});
```

### コードブロックのスタイル
- 背景：ダーク（`#2d1b1b`）
- 文字：暖色系（`#ffd9c6`）
- 行間：1.75
- 折返し：`white-space:pre-wrap`
- スクロール：`max-height:340px; overflow-y:auto`

---

## コンテンツ設計ルール

### カードあたりの情報量
- **タイトル**：10〜20文字
- **1行説明**：30〜50文字
- **コード本体**：100〜400行（`<pre>` 内）

### 並び順
- カテゴリごとにセクション
- カテゴリ内は**使用頻度順 or アルファベット順**
- 連番（TEMPLATE 01〜15）を視覚的に付けると迷わない

### カテゴリ分け
- 5〜7カテゴリが見やすい上限
- 各カテゴリ2〜5件
- カテゴリ名は短く（漢字2〜5字＋絵文字）

---

## 新規カタログ特典の作り方（手順）

### Phase 1：ラインナップ決定
1. 何を何個集めるか決める（15・20・30 など）
2. カテゴリ分けを仮決め
3. 各項目のタイトル・1行説明を先にリスト化

### Phase 2：コンテンツ書き起こし
- 各項目のコード・テキストを用意
- 一貫したフォーマットで（項目間で構造を揃える）

### Phase 3：HTML生成
- `claude-md-templates/index.html` を雛形にコピー
- 配色（CSS変数）を差し替え
- カテゴリセクション・カードを差し替え

### Phase 4：デプロイ
- Netlify Drop でフォルダごとアップロード
- UTAGE に iframe 埋め込み

---

## 本パターンの限界

- **100件超**になると展開式でもスクロール過多
  → 検索・フィルタUIが必要（別パターン検討）
- **コードの依存関係**がある場合は番号順の章立てが向く
- **インタラクティブな挙動**（プロンプト実行等）は別UIが必要

---

## 今回の学び（2026-04-15）

- STEP型・章立て型とは別軸のUX設計が必要なケースがあると確認
- `navigator.clipboard.writeText()` は公開URLでも問題なく動作
- グリッド `auto-fit, minmax(280px, 1fr)` で全デバイス対応が1行で書ける
- カード数が多い場合、**デフォルト閉じ＋展開式**が圧倒的に読みやすい

---

## 関連ドキュメント
- 単一HTML型：`tokuten-structure.md`
- 章立て型：`tokuten-chapter-pattern.md`
- 公開フロー：`tokuten-publish-flow.md`
- 実装サンプル：`projects/claude-md-templates/`
