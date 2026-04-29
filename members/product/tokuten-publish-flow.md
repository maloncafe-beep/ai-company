# 特典ページ 公開フロー（Netlify + UTAGE）

特典ページ（単一HTML・章立て複数HTMLどちらも）を **Netlify にデプロイ → UTAGE に iframe 埋め込み** で公開するまでの標準手順。

**リファレンス実績**：2026-04-15 AI社員×LINE構築マニュアル
公開URL：`https://fantastic-granita-a31f7d.netlify.app/`

---

## なぜこの方式？

| 方式 | 手間 | 制約 |
|---|---|---|
| UTAGE直貼り（HTMLブロック） | 中 | `position:fixed/sticky` が効かない・プログレスバー崩れる・JS再宣言でエラー |
| UTAGE章ごとページ分け | 大（リンク全書換） | ページ数ぶんの編集・メンテ負荷 |
| **Netlify + iframe** | **小** | iframe高さの指定が必要なだけ |

---

## デプロイ手順（Netlify Drop）

### 事前準備
- Netlifyアカウント（無料・ログイン済み）
- 既存チーム：`アドネス株式会社マーケ部`

### ステップ1：新規プロジェクト作成
1. Netlifyダッシュボード右上の **「Add new project」** をクリック
2. **「Deploy manually」** を選択
3. 「Upload your project files」ゾーンが出る

### ステップ2：フォルダまるごとドラッグ
**最重要**：**フォルダ自体をドラッグ**（中身だけを選択してドラッグしない）

1. Finderで `projects/<案件名>` のひとつ上の階層を開く
   ```
   open ~/ai-company/members/product/projects
   ```
2. フォルダ（例：`ai-remote-control`）をクリックして選択
3. そのまま Netlifyの「Upload your project files」ゾーンにドラッグ
4. 9ファイル全部（index.html含む）が一緒にアップロードされる

### ステップ3：「Rename to index.html?」ダイアログ対応
**index.htmlが含まれていれば出ない**。もし出たら：

- 出た場合 = `index.html` が**アップロードされてない**ことを意味する
- **「Deploy without renaming」は押さず、ダイアログを閉じて再ドロップ**
- フォルダ選択を間違えた可能性大

### ステップ4：デプロイ確認
1. 自動生成URLが表示される（例：`https://fantastic-granita-a31f7d.netlify.app`）
2. ターミナルで疎通確認：
   ```
   curl -s -o /dev/null -w "%{http_code}" https://xxxx.netlify.app/
   ```
   → `200` が返ればOK
3. ブラウザで開いて目次→各章遷移を確認

### ステップ5：サイト名を変更（推奨）
自動生成名（`fantastic-granita-xxx`）は覚えづらいので：
1. Site configuration → General → **Change site name**
2. 分かりやすい名前へ：例 `adones-<案件名>` / `adones-tokuten-<番号>`
3. URL即時反映 → iframeのsrcもそれに合わせて差し替え

---

## UTAGE への埋め込み

### iframeコード（標準）
```html
<iframe 
  src="https://xxxxxxxx.netlify.app/" 
  width="100%" 
  height="3500" 
  style="border:none;display:block;max-width:100%"
  loading="lazy">
</iframe>
```

### 貼り先
UTAGE編集画面の以下のブロックに貼る：
- **HTMLブロック**
- **自由HTML**
- **カスタムHTML**
- **コードブロック**

（UTAGEのバージョンで名称が違う。ウィジェット一覧で "html" 検索）

### 高さ（`height`）の目安
| 内容 | 推奨 height |
|---|---|
| 目次ページ（章カード少なめ） | 1500〜2000 |
| 目次＋章6個 | 2500〜3500 |
| 章の中身（サブステップ6本 + タスク） | 4500〜5500 |
| 単一HTML特典（3〜5STEP） | 3000〜4000 |

**運用Tips**：章ごとにUTAGEページを分けるなら、iframeの `src` を各章のURLに変える：
```html
<iframe src="https://xxx.netlify.app/01-setup.html" ...></iframe>
<iframe src="https://xxx.netlify.app/02-line.html" ...></iframe>
```

---

## コンテンツ更新時のフロー

内容を修正したい時：

1. ローカルでHTMLを編集
2. Netlifyプロジェクト画面の **「Drag and drop your project folder here to deploy new changes」** ゾーンにフォルダ再ドロップ
3. 数秒で自動デプロイ → **UTAGE側は何もしなくていい**（URL同じ）

---

## トラブルシューティング

### Q. トップURLで「Page Not Found」
- `index.html` がアップロードされてない
- 対処：フォルダまるごと再ドロップ

### Q. 章間リンクが動かない
- ファイルが一部しかアップロードされてない
- 対処：`curl` で各HTMLのHTTPステータスを確認、200が返らないファイルを再アップロード

### Q. iframeの中が縦スクロールで切れる
- height不足
- 対処：`height` の数値を大きくする（+500ずつ）

### Q. UTAGE管理画面では表示されるが公開ページで表示されない
- iframeのsrcがhttpになってる可能性
- 対処：`https://` で指定されているか確認

### Q. Netlify無料枠を超えそう
- 月100GB転送まで無料
- 特典ページ利用ならほぼ超えない
- 超過しそうになったらNetlifyからメール通知が来る

---

## 今回の失敗ログ（2026-04-15）

### 失敗1：index.html が含まれずアップロードされた
- 原因：ドラッグ対象がフォルダではなく中身ファイルだった（推定）
- 症状：Netlifyが「Rename 01-setup.html to index.html?」と聞いてきた
- 対処：ダイアログ閉じてフォルダごと再ドロップ → 9ファイル全部アップ → 目次表示OK

### 対策
- **フォルダをクリックして選択 → ドラッグ**（中身をCmd+Aで全選択じゃなくフォルダそのもの）
- ダイアログ出た時点で「Deploy without renaming」を押すとフィードバックのない公開になるので、**まずダイアログの意味を理解**

---

## チェックリスト（デプロイ前）

- [ ] `index.html`（目次 or メイン）が存在する
- [ ] 画像ファイル（`fv.png` 等）が含まれている
- [ ] 章間の相対リンク（`href="01-setup.html"` 等）がファイル名と一致
- [ ] **LOG.md などの内部ファイルはデプロイフォルダの外**に置く（公開されるため）
  - 推奨配置：`projects/<案件名>-LOG.md`（フォルダの隣の兄弟ファイル）
- [ ] 個人情報・APIキー・内部accountIdが含まれていないか確認
- [ ] ローカルで `open index.html` して動作確認済み

---

## 関連ドキュメント
- 章立て型パターン：`tokuten-chapter-pattern.md`
- 単一HTML型：`tokuten-structure.md`
- デザインリファレンス：`design-references.md`
