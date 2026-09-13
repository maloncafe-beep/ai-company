# shorts-pipeline 使い方

## フォルダ構成

```
shorts-pipeline/
  input/
    slides/
      01.wav      ← VOICEBOXで書き出したWAV
      01.txt      ← 字幕テキスト（1行）
      02.wav
      02.txt
      ...
    illustrations/
      *.png       ← Canvaからダウンロードしたイラスト素材
    bgm.mp3       ← BGM（省略可）
```

## 手順

### 1. ファイルを置く
- `input/slides/` に `01.wav` + `01.txt` のペアを連番で置く
- `input/illustrations/` にCanvaのPNG素材を置く（何枚でもOK）
- BGMがあれば `input/bgm.mp3` に置く

- voicebox.txtを分解する npm run split
split-voicebox.js — input/temp/voicebox.txt を1行ずつ input/slides/001.txt〜NNN.txt に分解。
package.json に npm run split を追加

### 2. 環境変数をセット（初回のみ）
```
$env:ANTHROPIC_API_KEY = "sk-ant-..."
```

### 3. 実行（1コマンド）
```
npm run go
```

これだけで：
- WAVの長さを自動取得
- Claudeがイラストとテキストを自動マッチング（初回のみ画像解析、以降はキャッシュ）
- MP4をレンダリング → `out/ShortsVideo.mp4`

### 個別実行
```
npm run prepare   # スライドデータ生成のみ
npm run render    # レンダリングのみ（prepare済みの場合）
```

## ポイント
- イラストは**多いほどマッチング精度が上がる**（10〜30枚推奨）
- イラストの解析結果は `illustrations-cache.json` に保存。素材を追加したときだけ再解析
- 字幕の改行は `.txt` に `\n` を入れるか、`。` で自動分割
- 動画は 1080×1920（縦9:16）YouTubeショート/TikTok対応


| コマンド | 内容 |
|---|---|
| `npm run parse <台本.md>` | 台本MDを解析してTXTを生成、VOICEBOXチェックリスト表示 |
| `npm run prepare` | WAV/TXT/イラストを読み込んで `slides-data.json` を生成（レンダリングなし） |
| `npm run render` | `slides-data.json` をもとに動画をレンダリング（prepareなし） |
| `npm run go` | `prepare` → `render` を一括実行（通常はこれ） |
| `npm run dev` | Remotion Studio を起動してブラウザでプレビュー |
| `npm run build` | バンドルをビルド |
| `npm run upgrade` | Remotion を最新版にアップグレード |
| `npm run lint` | ESLint + TypeScript型チェック |

## 参考：PNGバックアップの際のリネーム
Get-ChildItem *.png | Rename-Item -NewName { "38-" + $_.Name }