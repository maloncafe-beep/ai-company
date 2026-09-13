# 案件検索フロー — スプシ正源化プラン（確定版）

## Context（スプシ正源化）

CSVが累積し続ける問題と、スプシ削除済み案件の再追加問題を解決する。

**確定した仕様：**
- 通常運用：スクレイプ前に `download-sheet.mjs` でスプシ → CSV を再生成（実装済み）
- データ不具合で再取り込みが必要な場合：**CSVを手動で空にして再実行**

### 運用フロー（確定）

```
crowdworks_search.py 起動
  └─ download-sheet.mjs   スプシ → logs/案件検索結果.csv を再生成（スプシ正）
  └─ スクレイピング実行
  └─ save_to_csv()        CSVにないIDのみ追記
↓
filter_csv.py             除外フィルタ適用
↓
sync-sheet.mjs            CSVにあってスプシにない行を追記
```

### 再取り込み手順（データ不具合時）

```bash
# 1. CSVを空にする（ヘッダー行も削除）
echo "" > logs/案件検索結果.csv   # またはファイルを削除

# 2. 再実行（スプシ → CSV 再生成 → スクレイプ → 追記）
python tools/job-scout/crowdworks_search.py
```

### 実装済みファイル

| ファイル | 実装内容 |
|---|---|
| `tools/job-scout/crowdworks_search.py` | 起動時に `download-sheet.mjs` を自動呼び出し（実装済み） |

### 追加実装不要

「CSVとスプシ両方のIDを比較する」実装は不要。シンプルな download-first アプローチで要件を満たす。

---

# 案件検索フロー — バグ修正・手順書補完プラン（完了済み）

## Context
`reference_job_scout_flow.md` を読み、関連スクリプト（crowdworks_search.py / read-keywords.mjs / filter_csv.py）を全件調査した結果、**キーワード検索バグの根本原因**と**手順書の不足箇所**を特定した。

---

## バグ：キーワードのURLエンコード欠落

### 場所
`tools/job-scout/crowdworks_search.py` L141-142

```python
# 現状（バグあり）
f"&keyword={keyword}"

# 修正後
f"&keyword={urllib.parse.quote(keyword)}"
```

### 原因
`build_url()` で日本語キーワード（例：`提案書作成`）をURLに直接埋め込んでいる。Seleniumが `driver.get(url)` でそのURLをロードする際、エンコードされていない日本語がCrowdWorksサーバーに届かず、**全件または0件が返る**。

### 修正内容
1. ファイル冒頭の `import` 行に `from urllib.parse import quote` を追加
2. `build_url()` の `&keyword={keyword}` を `&keyword={quote(keyword)}` に変更

---

## 手順書の不足箇所

### 1. 初回セットアップ手順がない
`server/.env` に `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` / `GOOGLE_REFRESH_TOKEN` が必要。手順書に以下を追記する：
- `C:\Users\yyasu\ai-zodiacm\ai-company-kit\server\.env` の内容をコピーして `server/.env` を作成する

### 2. `logs/案件検索結果.csv` の初期ヘッダー行
初回実行時にCSVが存在しない場合、`save_to_csv()` はヘッダー行なしで追記を開始する（`a` モードで書き込み）。ヘッダー行を手動で用意する手順が必要。→ 初回だけ `overwrite-sheet.mjs` を使う手順を明記するか、スクリプト側でヘッダー自動生成を追加する。

### 3. `filter_csv.py` のKEEP/EXCLUDEキーワードがハードコード
手順書では「スプシのC列で除外条件を管理する」とあるが、`filter_csv.py` 内部に別の除外リスト（`EXCLUDE_KEYWORDS`）がハードコードされている。スプシのC列とスクリプト内リストの**二重管理**になっており、混乱の原因になる。→ 手順書に「`filter_csv.py` 内の `EXCLUDE_KEYWORDS` は粗いフィルタ用。細かい条件はスプシC列で管理」と明記する。

### 4. Lancersスクレイパーは手順書から除外
`lancers_scraper.py` は連続実行すると問題があるため、手順書には掲載しない（スキップ）。

### 5. 出力ファイルの場所が2箇所あることが不明
- XLSX/MD → `logs/Case_list_py/`
- CSV → `logs/案件検索結果.csv`（スプシ同期の入力元）← `logs/` フォルダを作成済み・ファイルを移動済み
手順書に両方の出力先を明記する。

### 6. `sync-sheet.mjs` vs `overwrite-sheet.mjs` の使い分けが曖昧
手順書のコメントは「フィルタ後に overwrite」「通常は sync」のみ。判断基準を明確化する。
- `overwrite-sheet.mjs`：スプシの案件一覧シートを**全件置換**（初回 or リセット時）
- `sync-sheet.mjs`：CSVに存在してスプシにない行だけ**差分追記**（通常運用）

---

## 修正ファイル一覧
| ファイル | 変更内容 |
|---|---|
| `tools/job-scout/crowdworks_search.py` | `from urllib.parse import quote` 追加 + `build_url()` 内の keyword をエンコード |
| `working/reference_job_scout_flow.md` | 上記6項目の補足を追記 |

---

## 検証方法
1. `python tools/job-scout/crowdworks_search.py` を実行
2. ログに表示されるURLの `keyword=` パラメータが `%E6%8F%90%E6%A1%88%E6%9B%B8...` のようにエンコードされていることを確認
3. 案件が1件以上取得できれば修正成功
