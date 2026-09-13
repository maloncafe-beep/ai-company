# shorts-pipeline-v3 使い方

v2（`shorts-pipeline/`）とはファイル配置が異なるので注意。
v3は「勝海舟スタイル」専用：セピア背景＋台本テキストのみ（イラスト差し込みなし）。

## フォルダ構成

```
shorts-pipeline-v3/
  input/
    meta.json                      ← プロジェクト情報（person, project_folder, title, displayName）
    bg.png                         ← 背景画像（全体共通のフォールバック）
    temp/
      Voicebox.txt                 ← VOICEBOXの台本テキスト（「キャラ名（スタイル）,テキスト」形式、1行=1シーン）
    lines/
      {project_folder}/            ← meta.jsonのproject_folderと同名フォルダ
        {project_folder}.txt       ← タブ区切り「001\tテキスト」（split-voicebox.jsが自動生成）
        001_*.wav                  ← VOICEVOX/VOICEBOX書き出しのWAV（001始まり連番）
        002_*.wav
        ...
        bg.png                    ← このプロジェクト専用の背景（省略可、無ければinput/bg.pngを使用）
  public/
    bgm.mp3                        ← BGM（省略可、直接ここに置く）
```

## 手順

### 1. `input/meta.json` を用意する
```json
{
  "person": "katsu",
  "project_folder": "katsu-001",
  "title": "勝海舟の言葉",
  "displayName": "勝海舟"
}
```
- `project_folder` が `input/lines/` 配下のフォルダ名になる

### 2. 台本テキストを置く
- VOICEBOXの台本（`キャラ名（スタイル）,テキスト` を改行区切り）を `input/temp/Voicebox.txt` に保存

### 3. 台本を分解する
```
npm run split
```
- `input/temp/Voicebox.txt` の各行からカンマ以降のテキストだけを抽出し、`input/lines/{project_folder}/{project_folder}.txt`（タブ区切り `001\tテキスト`）を自動生成
- 既存のwavファイル数と行数が一致するかも警告表示

### 4. WAVを置く
- VOICEBOXで1行ずつ読み上げて書き出し、`input/lines/{project_folder}/` に `001_*.wav`, `002_*.wav`... の連番で配置
- ファイル名の先頭3桁の数字がテキストの行番号と対応していればOK（VOICEBOXのデフォルト出力名でよい）

### 5. 背景・BGMを置く（任意）
- 背景: `input/bg.png`（共通）または `input/lines/{project_folder}/bg.png`（このプロジェクト専用、優先される）
- BGM: `public/bgm.mp3` に直接配置（無ければBGMなしで生成）

### 6. 実行
```
npm run build-data   # WAV長さ取得＋src/lines-data.json を生成
npm run render       # レンダリング（out/{person}_{日付}.mp4）
```
まとめて実行する場合：
```
npm run go
```

### 7. プレビュー確認（任意）
```
npm run dev
```
Remotion Studioがブラウザで開き、`KatsuVideo` コンポジションを再生確認できる

## ポイント
- 1行目＝タイトルカード、最終行＝エンディングカード、それ以外＝本文カード（自動判定）
- 本文テキストは左寄せ、タイトル・エンディングは中央揃え
- 文中の `[[強調したい部分]]` は金色の強調表示になる
- 動画は 1080×1920（縦9:16）YouTubeショート対応

## コマンド一覧

| コマンド | 内容 |
|---|---|
| `npm run split` | `input/temp/Voicebox.txt` を分解して `{project_folder}.txt` を生成 |
| `npm run build-data` | WAV/TXT/背景を読み込んで `lines-data.json` を生成（レンダリングなし） |
| `npm run render` | `lines-data.json` をもとに動画をレンダリング |
| `npm run go` | `build-data` → `render` を一括実行 |
| `npm run dev` | Remotion Studio を起動してブラウザでプレビュー |
| `npm run build` | バンドルをビルド |
| `npm run lint` | ESLint + TypeScript型チェック |
