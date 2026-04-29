# 特典ページ 章立て型パターン（multi-chapter）

長大な構築マニュアル・ステップ数無限に増える教材向けの**章立て複数HTML構成**。
単一HTML型（`tokuten-structure.md` / `insta-pattern-a.html`）で足りない規模のときに使う。

**リファレンス実装**：`projects/ai-remote-control/` （2026-04-15 AI社員×LINE構築マニュアル）

---

## いつ使うか

| 状況 | 推奨パターン |
|---|---|
| 1テーマ・3〜6ステップで完結 | 単一HTML（`insta-pattern-a.html`ベース） |
| 複数フェーズ・30+サブステップ規模 | **章立て型（本パターン）** |
| 読者が途中離脱してもOKな長編 | **章立て型** |
| 1セッションで読み切り想定 | 単一HTML |

目安：サブステップ総数 **15超えたら章立て型**推奨。

---

## ディレクトリ構成

```
projects/<案件名>/
├── index.html              ← 目次ページ（章カードUI）
├── 01-<topic>.html         ← 章1
├── 02-<topic>.html         ← 章2
├── ...
├── 06-<topic>.html         ← 章6
├── fv.png                  ← 共通FV（全章共通）
└── LOG.md
```

### ファイル名規則
- `NN-<topic>.html`（NN=連番2桁、topicは内容名）
- 例：`01-setup.html` / `02-line.html` / `03-deploy.html`
- 目次は `index.html` 固定

---

## ベーステンプレ

**`projects/ai-remote-control/01-setup.html` をコピーして使う**。

含まれる要素：
- ロゴバー
- パンくずナビ（目次 / 前章 / 現在章）
- スクロール背景テキスト（8行）
- 章タイトルヒーロー（CHAPTER番号 + メインタイトル）
- ゴールカード（インスタ風ヘッダー + FV画像 + 達成できることリスト）
- 「章Xを始める」スタートボタン
- **STEPカード群**（STEP hero + タスクチェックリスト）
- 章末 finish-section
- ページネーション（目次 / 前章 / 次章）

### CSS変数（配色テーマ）
`:root` で以下を変えれば全体の配色が一発で変わる：
```css
--green:#06C755;         /* LINE緑（メイン） */
--green-dark:#0A6D3B;    /* 濃い緑 */
--mint:#7ED957;          /* 明るい緑 */
--bg:linear-gradient(...);/* 本体背景 */
```

他テーマの場合は、この4つを差し替えるだけ（ピンク系、青系など）。

---

## STEP hero ブロック（CSS-only）

従来の動画プレースホルダを**画像不要のヒーローブロック**に差し替え。
画像生成不要でカッコよく見える。

### HTML構造
```html
<div class="video-placeholder">
  <div class="step-hero-text">
    <div class="step-hero-tag">
      <span class="step-hero-label">STEP</span>
      <span class="step-hero-no">X-Y</span>
    </div>
    <div class="step-hero-title">短タイトル1行目<br>短タイトル2行目</div>
  </div>
  <div class="step-hero-icon">絵文字</div>
</div>
```

### 必須要素
- **STEP ラベル + 番号**（左上、タグ風角丸ピル）
- **短タイトル**（左、最大48px、2行まで、&lt;br&gt;で改行）
- **テーマ絵文字**（右、最大112px、ふわふわアニメ）
- **背景**：グリーン系グラデ + ドットパターン + 放射ハイライト

### タイトル作成ルール
- STEP titleの**短縮版**（8〜14文字程度）
- 2行に改行（バランス重視）
- 例：「Node.js と pnpm をインストールする」 → `Node.js ＆<br>pnpm を入れる`

### 絵文字選定ルール
- STEPテーマを1文字で象徴
- 章内で被らない（同章で ⚙️ が2回出ないように）
- 章をまたぐ被りはOK（⚙️が章1と章2で出ても問題なし）

---

## 章の標準構成

### 1章あたり
- サブステップ **5〜6本**
- 各サブステップにタスク **3〜5個**
- 章全体のタスク数目安：**20〜30**

### サブステップ構造（STEPカード）
```
1. インスタ風ヘッダー（STEP X-Y）
2. ステップタイトル（バッジ + タイトル）
3. STEP hero ブロック（上述）
4. action-block（タスクチェックリスト）
5. 完了ボタン
```

### タスク構造
- **タスクラベル**：1行で何をするか
- **トグル詳細**：折りたたみで具体的手順・コマンド・Note
- **OS別対応**：必要なら `<span class="os-label">Mac</span>` 等を使う
- **注意書き**：`<div class="note">💡 ...</div>` で黄色の注意ボックス

---

## 新規章立て特典の作り方（手順）

### Phase 1：構成決定（ヒアリング）
1. テーマ・章数を決める
2. 各章のタイトル・サブステップ数を仮決め
3. 配色（LINE緑など）・FV画像の方針を決める

### Phase 2：テンプレ複製
```bash
cp -r projects/ai-remote-control projects/<新案件名>
cd projects/<新案件名>
rm -rf ai-remote-control.html   # 旧版が残っていたら削除
```

### Phase 3：章1を型として先行制作
- 配色変更（CSS変数）
- FV画像差し替え
- 章1の内容を差し替え（サブステップ・タスク）
- STEP heroの絵文字・短タイトル決定
- ブラウザで確認 → OKもらうまで繰り返し

### Phase 4：章2〜Nを並列エージェントで量産
型が固まったら、章2以降は**並列エージェント**で一気に作る。

### Phase 5：index.html（目次）作成
- 章カードを章数ぶん並べる
- 各章の所要時間目安を添える
- FV画像＋introを再掲載

---

## 並列エージェント 定型プロンプト

5章同時生成用。1エージェント＝1章担当。

```
`/.../NN-<topic>.html` を編集してください。

## タスク1：CSS差し替え
01-setup.html の `/* Step hero (CSS-only) */` ブロック（〜@mediaまで）を Read。
対象ファイルの同ブロックを丸ごと置換。

## タスク2：各STEPのvideo-placeholderを差し替え
`<div class="video-placeholder"><div class="play-btn"></div></div>` を以下に置換：

<div class="video-placeholder">
  <div class="step-hero-text">
    <div class="step-hero-tag">
      <span class="step-hero-label">STEP</span>
      <span class="step-hero-no">X-Y</span>
    </div>
    <div class="step-hero-title">短タイトル<br>短タイトル</div>
  </div>
  <div class="step-hero-icon">絵文字</div>
</div>

### 各STEPの指定
- STEP X-1：絵文字 🔹、タイトル `...<br>...`
- STEP X-2：絵文字 🔹、タイトル `...<br>...`
- （以下略）

step-title 行ごと old_string に含めてユニーク化すること。
完了したら「NN-<topic>.html ヒーロー差し替え完了」と報告。
```

---

## ナビゲーション規則

### パンくず（各章の上部）
```
📚 目次 / 章N-1 / 章N <現在章タイトル>（全M章）
```
- 章1：前の章リンクなし
- 最終章：次の章リンクなし

### chapter-footer（各章の下部）
- 目次に戻る（全章共通）
- 前の章（章1は非表示 or disabled）
- 次の章（最終章は非表示）

### index.html の章カード
- CHAPTER番号（2桁、00表記）
- 章タイトル
- 章サマリ（1〜2行）
- メタ情報（Nステップ・所要時間目安）

---

## 本セッションで得た学び（2026-04-15）

### 1. 実リポジトリを見てから書く
- 当初、想像で `bun` / `ngrok` / ローカルサーバ構成で章1を書いた
- 実機確認したら line-harness は **pnpm + Cloudflare Workers** だった
- 章1承認後に判明 → 修正で手戻り発生
- **学び**：技術系コンテンツは**必ず実物確認してから執筆**

### 2. 画像生成は最小限に
- 30STEPぶんのAI画像生成はコスパ悪い
- **CSS-only ヒーロー**（STEP番号 + 絵文字 + グラデ）で十分カッコいい
- API利用料0円・生成待ち0秒・差し替え自在
- スクショが本当に必要な箇所だけトグル内に後から追加

### 3. 型を固めてから並列化
- 章1を型として確定 → 章2〜6を並列エージェントで量産
- 先に並列で進めると章ごとにテイストがブレる
- **型確定 → 量産** の順が鉄則

### 4. ヒアリングは最小限に
- 「何章にする」「粒度」「絵文字」等は番号選択式でサクッと決める
- 粒度が細かく確認不要なものは即実装＆調整
- 経営者は即レス型なので「まず作って見せる → 修正」の方が速い

### 5. 文字入れ画像 vs CSS+HTMLテキスト
- 画像に文字を焼き込むとタイトル変更のたびに画像を作り直し → 劣化する
- **CSSでテキスト＋装飾**にすれば保守性◎
- マニュアル系は特に効く

---

## セッション履歴（2026-04-15）

1. 経営者：「新しい特典作りたい」
2. 「AIカンパニー × LINE ハーネスの使い方まとめ」として着手（insta-pattern-a.html 型）
3. 方針転換：「別の人間が0から構築する」マニュアルに変更
4. 非エンジニア向け・ゼロから・5ステップで初版作成
5. 細分化要望：章立て・各章内にSTEP X-Y 階層・ページ分割 OK
6. 6章構成で確定 → 章1を型として制作
7. 実機確認で line-harness が Cloudflare Workers 前提と判明 → 章1修正
8. 章2〜6を並列エージェントで量産
9. index.html（目次ページ）追加
10. 画像：API高コストを回避して CSS-only ヒーローを試作 → 採用
11. タイトル追加 → フォントバランス調整
12. 全6章にヒーロー展開完了 → **本パターンとして確定**

---

## 関連ドキュメント
- 単一HTML型：`tokuten-structure.md`
- デザインリファレンス：`design-references.md`
- 実装サンプル：`projects/ai-remote-control/`
