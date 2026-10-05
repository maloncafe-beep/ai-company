# shorts-pipeline-v2 使い方

## shorts-pipeline（旧）との違い

| | shorts-pipeline（旧） | shorts-pipeline-v2（新） |
|---|---|---|
| スライド構成 | 1WAV = 1画像切替 | 1画像 × 複数セグメント（WAV） |
| ファイル命名 | `001.wav` / `001.txt` | `001a.wav` / `001a.txt` / `001b.wav` / `001b.txt` |
| イラスト入力 | `input/illustrations/` | `input/illustrations/`（同じ。自動でpublicにコピー） |
| タイトル画面 | なし | 冒頭に独立1枚（`int_*.wav` + `int_000.txt`） |
| テキスト強調 | なし | `[[テキスト]]` で囲むとオレンジ色になる |
| 動画の尺 | 約30秒（12スライド） | 約60〜80秒（5スライド×2セグメント） |

---

## フォルダ構成

```
shorts-pipeline-v2/
  input/
    temp/
      Voicebox.txt  ← 台本一括ファイル（npm run split の入力）
    slides/
      int_青山龍星…….wav ← タイトル画面の音声（VOICEBOX出力名のままOK）
      int_000.txt   ← タイトル画面の字幕（splitが自動生成）
      out_青山龍星…….wav ← アウトロ（コメント誘導）の音声
      out.txt       ← アウトロの字幕（splitが自動生成）
      001a_青山龍星…….wav ← VOICEBOXで書き出したWAV（雑学テーマ）
      001a.txt      ← 字幕テキスト（splitが自動生成）
      001b_青山龍星…….wav ← 詳細説明
      001b.txt
      002a.wav / 002a.txt ...
    illustrations/
      000.png       ← タイトル画面用（省略可。なければ最初の画像）
      999.png       ← アウトロ画面用（省略可。なければ最後の画像）
      001.png       ← 001スライドに使う画像
      002.png
      ...
  public/
    bgm/
      bgm.mp3       ← BGM（省略可）
    ※ illustrations/ と slides/ は npm run go で自動コピー（触らない）
```

---

## 手順

### 0. 台本を分割する（npm run split）

`input/temp/Voicebox.txt` に `プレフィックス,テキスト` を1行1エントリで書く：

```
int,タイトルのテキスト
001a,雑学テーマのテキスト
001b,詳細説明のテキスト
002a,次のテーマ…
out,コメント誘導のテキスト
```

```bash
npm run split
```

→ `input/slides/` に `int_000.txt`、`001a.txt`、`001b.txt` … が自動生成される。
（`int` の行は `int_000.txt` になる。先頭のBOMは自動で除去）

### 1. ファイルを置く

**音声** → `input/slides/` に置く
- タイトル：`int_青山龍星…….wav`（`int_` で始まるWAV）
- アウトロ：`out_青山龍星…….wav`（`out_` で始まるWAV、TXTは `out.txt`。最後に独立1枚）
- 本編：`001a_…….wav`、`001b_…….wav`、`002a_…….wav` … の命名規則
- WAVファイル名が長くても先頭の `001a`（タイトルは `int_000`）部分だけでTXTを検索するので問題なし
- TXTは**1ファイル1行**（改行を入れると後半が別スライドに混入するバグのもと）

**イラスト** → `input/illustrations/` に置く
- `001.png`、`002.png` … のように番号で命名
- スライド番号と画像番号が対応する（001a・001b → `001.png`）
- タイトル画面は `000.png`（なければ最初の画像）
- `npm run go` 実行時に `public/illustrations/` へ自動コピーされる
- `input/illustrations/` がない場合のみ `public/illustrations/` を直接読む

**BGM** → `public/bgm/bgm.mp3` に置く（なくても動く）

### 2. 実行（1コマンド）

```bash
npm run go
```

これだけで：
- `input/slides/` からWAV・TXTを読み込み
- WAVの長さを自動取得
- `public/slides/` にWAVをコピー
- `src/slides-data.json` を自動生成
- MP4をレンダリング → `out/ShortsVideo.mp4`

### 個別実行

```bash
npm run prepare   # slides-data.json 生成のみ
npm run render    # レンダリングのみ（prepare済みの場合）
npm run dev       # Remotion Studio でプレビュー
```

---

## テキストの書き方

### 強調（オレンジ色）

`[[]]` で囲んだ部分がオレンジ色になる：

```
[[雑学テーマのタイトル]]。詳細説明のテキスト。
```

### 行分割

`。` で自動的に行が分かれる。`[[]]` の内側の `。` は分割されない：

```
[[テーマ（句点含む）。]]。詳細説明その1。詳細説明その2。
```

↓ 画面上では

```
行1: テーマ（句点含む）。   ← オレンジ
行2: 詳細説明その1
行3: 詳細説明その2
```

### 注意

- TXTファイルは**1行**で書く（Windowsの改行 `\r\n` も誤動作の原因になる）
- WAVファイル名に日本語・記号が含まれていても動作する（先頭の `001a` だけ参照）

---

## 設定値（SlideScene.tsx）

| 定数 | 値 | 説明 |
|------|-----|------|
| `BGM_VOLUME` | `0.30` | BGM音量（0〜1） |
| `BGM_FADE_FRAMES` | `60` | BGMフェードのフレーム数 |
| 強調色 | `#E53500` | `[[]]` テキストの色 |
| 通常テキスト色 | `#111111` | 黒（アウトラインなし） |
| テキスト影 | `2px 2px 3px rgba(0,0,0,0.25)` | 右下だけの薄い影 |
| イラスト位置 | `top: 33.33%` | 上1/3を空けて下2/3に表示 |

---

## 動画仕様

- 解像度：1080×1920（縦9:16）
- FPS：30
- YouTubeショート・TikTok対応

## 参考：PNGバックアップの際のリネーム
Get-ChildItem *.png | Rename-Item -NewName { "38-" + $_.Name }