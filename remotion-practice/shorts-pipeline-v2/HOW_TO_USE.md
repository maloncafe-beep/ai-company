# shorts-pipeline-v2 使い方

## shorts-pipeline（旧）との違い

| | shorts-pipeline（旧） | shorts-pipeline-v2（新） |
|---|---|---|
| スライド構成 | 1WAV = 1画像切替 | 1画像 × 複数セグメント（WAV） |
| ファイル命名 | `001.wav` / `001.txt` | `001a.wav` / `001a.txt` / `001b.wav` / `001b.txt` |
| イラスト入力 | `input/illustrations/` | `public/illustrations/` に直接置く |
| テキスト強調 | なし | `[[テキスト]]` で囲むとオレンジ色になる |
| 動画の尺 | 約30秒（12スライド） | 約60〜80秒（5スライド×2セグメント） |

---

## フォルダ構成

```
shorts-pipeline-v2/
  input/
    slides/
      001a.wav      ← VOICEBOXで書き出したWAV（雑学テーマ）
      001a.txt      ← 字幕テキスト（雑学テーマ）
      001b.wav      ← VOICEBOXで書き出したWAV（詳細説明）
      001b.txt      ← 字幕テキスト（詳細説明）
      002a.wav
      002a.txt
      ...
  public/
    illustrations/
      001.png       ← 001スライドに使う画像（直接ここに置く）
      002.png
      ...
    bgm/
      bgm.mp3       ← BGM（省略可）
```

---

## 手順

### 1. ファイルを置く

**音声・テキスト** → `input/slides/` に置く
- WAVファイル：`001a.wav`、`001b.wav`、`002a.wav`、`002b.wav` … の命名規則
- TXTファイル：対応するWAVと同じプレフィックス（`001a.txt`、`001b.txt` …）
- TXTは**1ファイル1行**（改行を入れると後半が別スライドに混入するバグのもと）
- WAVファイル名が長くても先頭の `001a` 部分だけでTXTを検索するので問題なし

**イラスト** → `public/illustrations/` に直接置く
- `001.png`、`002.png` … のように番号で命名
- スライド番号と画像番号が対応する（001a・001b → `001.png`）

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
| イラスト位置 | `top: 33.33%` | 上1/3を空けて下2/3に表示 |

---

## 動画仕様

- 解像度：1080×1920（縦9:16）
- FPS：30
- YouTubeショート・TikTok対応

## 参考：PNGバックアップの際のリネーム
Get-ChildItem *.png | Rename-Item -NewName { "38-" + $_.Name }