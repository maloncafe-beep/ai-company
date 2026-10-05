---
name: reference_job_scout_flow
description: 案件検索→CSV→スプシ同期の実証済み手順。キーワード管理ルール含む。
metadata:
  type: reference
---

# 案件探索→スプシ同期フロー（2026-08-24 刷新）

## 実行コマンド（通常運用フロー）

```bash
# 1. CW案件検索（スプシ正源として起動時にCSVを最新化してからスクレイピング）
python tools/job-scout/crowdworks_search.py

# 2. 除外KWフィルタリング（ゴミ除去）
python tools/job-scout/filter_csv.py

# 3. スプシに差分追記（通常運用）
node server/scripts/sync-sheet.mjs
```

### 起動時のモード選択

`crowdworks_search.py` を実行すると、スクレイピング前にインタラクティブなメニューが表示される。

```
実行モードを選んでください：
  1. 全キーワード（N件・通常モード）
  2. カテゴリ指定
  3. キーワード指定
```

| モード | 内容 |
|---|---|
| 1. 全キーワード | スプシD列✓の全キーワードで検索（通常運用） |
| 2. カテゴリ指定 | 資料系・ライティング系など、カテゴリ単位で絞り込み |
| 3. キーワード指定 | 任意のキーワードをスペース区切りで手入力（スプシ外のワードも可） |

### スプシ正源化の仕組み

`crowdworks_search.py` の起動時に `download-sheet.mjs` を自動呼び出しし、**スプシの現在の内容でCSVを上書き**してからスクレイピングを開始する。スプシで削除した案件はCSVから除去されるため、再追加されない。

**「新規案件なし（全件重複）」と表示される場合**：スプシにすでに登録済みの案件を再スクレイプしたため、追加件数が0になっている。スクレイピング自体は正常に動作している。新規案件は時間をおいて再実行すれば取得できる。

```
download-sheet.mjs → logs/案件検索結果.csv（スプシ正として再生成）
                              ↓ 差分追記
crowdworks_search.py → 新着案件のみCSVに追記（既存IDはスキップ）
                              ↓
filter_csv.py → 除外フィルタ適用
                              ↓
sync-sheet.mjs → スプシに差分追記
```

### リセット時のみ

```bash
# CSVの全内容でスプシを上書き（初回セットアップ時）
node server/scripts/overwrite-sheet.mjs
```

## キーワード管理ルール（重要）

**スプシの「キーワード設定」シートで一元管理する。スクリプトは触らない。**

| 列 | 内容 |
|---|---|
| A | カテゴリ（資料系・ライティング系・動画・台本系・SNS系 等） |
| B | 検索キーワード |
| C | 除外条件（カンマ区切り。例: テンプレ,サンプル） |
| D | 有効フラグ（✓ = 検索する / 空欄 = スキップ） |

- **D列が ✓ のキーワードだけを検索対象にする**（カテゴリに関係なく全部）
- 動画・台本系・SNS・マーケ系も D列を ✓ にすれば自動的に検索対象になる
- C列に除外条件を追記すれば、そのキーワードでヒットした案件から除外される

### カテゴリ→CrowdWorks検索グループのマッピング

A列のカテゴリ名によって検索先のグループURLが変わる（スクリプト内に定義済み、変更はスクリプト側で対応）。

| カテゴリ（A列） | 検索グループ |
|---|---|
| 資料系 | `/group/business` |
| 文書・業務系 | `/group/business` |
| SNS・マーケ系 | `/group/business` |
| ライティング系 | `/group/writing_beginner` |
| 動画・台本系 | `/group/video_contents` |
| 上記以外 | 全体検索（グループ指定なし） |

## キーワード取得の仕組み

`crowdworks_search.py` 起動時に `node server/scripts/read-keywords.mjs` をサブプロセスで呼び出し、JSONでキーワード一覧と除外条件を受け取る。スプシ接続失敗時はスクリプト内のデフォルト値にフォールバック。

## フィルタリング（filter_csv.py）

`logs/案件検索結果.csv` に対して除外キーワードを適用して上書き。その後、通常運用では `sync-sheet.mjs` でスプシに差分追記する（実行コマンドの手順3）。

スプシ側にも悪い案件が混入していて全件クリーニングしたい場合のみ `overwrite-sheet.mjs` を使う。

## 出力ファイル

| ファイル | 用途 |
|---|---|
| `logs/Case_list_py/crowdworks_*.xlsx` | XLSX形式の案件一覧（確認用） |
| `logs/Case_list_py/crowdworks_cases_latest.md` | Markdown形式の案件一覧（最新20件） |
| `logs/案件検索結果.csv` | スプシ同期の入力元（追記形式） |

## sync-sheet vs overwrite-sheet の使い分け

| コマンド | 用途 |
|---|---|
| `node server/scripts/overwrite-sheet.mjs` | スプシ案件一覧を**全件置換**（初回 or リセット時） |
| `node server/scripts/sync-sheet.mjs` | CSVにあってスプシにない行だけ**差分追記**（通常運用） |

## 除外キーワードの管理

- **粗いフィルタ**：`filter_csv.py` 内の `EXCLUDE_KEYWORDS`（スクリプト内ハードコード）
- **細かい条件**：スプシ「キーワード設定」シートのC列（カンマ区切りで複数可）

両方が独立して動作する。スプシC列で管理するのが基本。

## 初回セットアップ

1. `C:\Users\yyasu\ai-zodiacm\ai-company-kit\server\.env` の内容をコピーして `server/.env` を作成する
2. `logs/` フォルダが存在しない場合は作成する（`logs/案件検索結果.csv` の置き場所）
3. 初回は `logs/案件検索結果.csv` が存在しないため、`crowdworks_search.py` 実行後に `overwrite-sheet.mjs` でスプシを初期化する

## スプシURL

https://docs.google.com/spreadsheets/d/1xa9cVV28mP53P2Vyq2UtTP9piRr5-r_niaPQ2ZiLsNQ/edit?gid=753704806#gid=753704806
