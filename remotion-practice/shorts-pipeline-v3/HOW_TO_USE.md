# shorts-pipeline-v3 使い方

v2（`shorts-pipeline/`）とはファイル配置・運用が異なるので注意。
- v2: `001a, 001b, 002a, 002b...` のように1画面につき複数パターンのtxt/wavを揃える運用
- v3: 1行＝1wav固定、`project_folder`も`katsu-001`固定でシンプルに運用（バリエーション分けはしない）

v3は「勝海舟スタイル」専用：セピア背景＋台本テキストのみ（イラスト差し込みなし）。

## フォルダ構成

```
shorts-pipeline-v3/
  scripts/
    YYYY-MM-DD_タイトル.md          ← 台本MD（Claude Code/ChatGPTで作成）
  input/
    meta.json                      ← プロジェクト情報（person, project_folder, title, displayName）
    bg.png                         ← 背景画像（全体共通のフォールバック）
    temp/
      voicevox-paste.txt           ← VOICEVOX貼り付け用プレーンテキスト（script-to-voicevox.jsが自動生成）
      Voicebox.txt                 ← （旧方式）VOICEBOXの台本テキスト。「キャラ名（スタイル）,テキスト」形式、1行=1シーン
    lines/
      {project_folder}/            ← meta.jsonのproject_folderと同名フォルダ
        {project_folder}.txt       ← タブ区切り「001\tテキスト」（script-to-voicevox.js / split-voicebox.jsが自動生成）
        001_*.wav                  ← VOICEVOX/VOICEBOX書き出しのWAV（001始まり連番）
        002_*.wav
        ...
        bg.png                    ← このプロジェクト専用の背景（省略可、無ければinput/bg.pngを使用）
  public/
    bgm.mp3                        ← BGM（省略可、直接ここに置く）
```

## ワークフロー概要

```
scripts/*.md（台本）
  → npm run script    … VOICEVOX貼り付け用テキストを生成（クリップボードにも自動コピー）
  → （VOICEVOXに貼り付け・確認・書き出し／手動）
  → npm run build-data … WAVの長さを読んでRemotion用データを生成
  → npm run render      … 動画を書き出し
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
- **`project_folder` は `katsu-001` に固定し、動画ごとに変えない。** `title`／`displayName` だけを毎回の動画内容に合わせて書き換える。
  （フォルダ名を動画ごとに変えると、`src/lines-data.json` のパスがその回だけ違うものになり、次の `npm run render` で参照するファイルが食い違う）

### 2. 台本MDを書く
`scripts/` 配下に `YYYY-MM-DD_タイトル.md` 形式で台本を保存する。`【台本】`セクション内の、空行以外の各行が1行＝1画面（1WAV）として扱われる。

```markdown
【台本】（1文＝1画面、30文字前後／60文字限度。長い文のみ2画面に分割）

頑張っているのに、何をやっても空回りする時期があります。

昨日までうまくいっていたことが、急に、思い通りに動かなくなる。
```

### 3. `npm run script` でVOICEVOX貼り付け用テキストを生成する
```bash
npm run script
```
`scripts/`内でファイル名が最も新しい（日付が最新の）`.md`を自動的に使う。ファイルを指定する場合は `--` の後にパスまたはファイル名を渡す（`scripts/`省略可）。

```bash
npm run script -- "2026-10-04_13焔の時と灰の時.md"
npm run script -- "scripts/2026-10-04_13焔の時と灰の時.md"
```

生成されるもの：
- `input/lines/{project_folder}/{project_folder}.txt` — `001\tテキスト` 形式
- `input/temp/voicevox-paste.txt` — VOICEVOX貼り付け用プレーンテキスト（番号なし・1行1文）
- クリップボードへの自動コピー（そのままVOICEVOXに `Ctrl+V` で貼り付け可能）

### 4. VOICEVOXで確認・書き出し（手動）
1. VOICEVOXにペースト（`Ctrl+V`）
2. 1行ずつ読みを確認・修正、速度を90%に設定
3. 「テキストを繋げて書き出し」で `input/lines/{project_folder}/` にWAVを書き出す（ファイル名の先頭3桁の数字がテキストの行番号と対応していればOK。VOICEVOXのデフォルト出力名でよい）
4. 強調したい箇所があれば `input/lines/{project_folder}/{project_folder}.txt` を直接編集して `[[ ]]` で囲む

> 旧方式（VOICEVOXの台本テキストを手動整形する場合）は [旧方式：Voicebox.txtからの分解](#旧方式voicebox.txtからの分解) を参照。

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

## 旧方式：Voicebox.txtからの分解

MDを使わず、VOICEVOXの台本テキストを直接手入力・手動整形する場合の手順（互換性のため残してある）。

1. VOICEBOXの台本（`キャラ名（スタイル）,テキスト` を改行区切り）を `input/temp/Voicebox.txt` に保存
2. `npm run split` を実行
   - `input/temp/Voicebox.txt` の各行からカンマ以降のテキストだけを抽出し、`input/lines/{project_folder}/{project_folder}.txt`（タブ区切り `001\tテキスト`）を自動生成
   - 既存のwavファイル数と行数が一致するかも警告表示
3. 以降は通常手順の「4. VOICEVOXで確認・書き出し（手動）」以降と同じ

## VOICEVOX API全自動（オプション・通常は未使用）

読み間違いの確認を省略して、WAV書き出しまで完全自動化したい場合は `npm run voice` が使える。事前にVOICEVOXアプリ（エンジン）を起動しておくこと（`http://127.0.0.1:50021`）。

話者・速度は `input/meta.json` の `voice` フィールドで変更可能（省略時は青山龍星／ノーマル／0.9）：
```json
"voice": { "speakerName": "青山龍星", "styleName": "ノーマル", "speedScale": 0.9 }
```

`npm run auto` で `split → voice → build-data → render` を一括実行できる（旧方式のVoicebox.txtが前提）。

MD台本から確認なしで最後まで通す場合は `npm run auto-script`（`script-to-voicevox → voice → build-data → render`）。

**⚠️ このプロジェクト（v3）は朗読系で漢字の読み間違いのダメージが大きいため、`npm run voice` / `npm run auto` / `npm run auto-script` は基本的に使わない。** 必ず「3. `npm run script` でVOICEVOX貼り付け用テキストを生成する」→「4. VOICEVOXで確認・書き出し（手動）」の通常フローで、1行ずつ読みを確認すること。

## コマンド一覧

| コマンド | 内容 |
|---|---|
| `npm run script` | 台本MD → VOICEVOX貼り付け用テキスト生成（メイン） |
| `npm run split` | （旧方式）`input/temp/Voicebox.txt` を分解して `{project_folder}.txt` を生成 |
| `npm run voice` | VOICEVOXのローカルAPIを直接叩いてWAVまで全自動生成（通常は未使用） |
| `npm run build-data` | WAV/TXT/背景を読み込んで `lines-data.json` を生成（レンダリングなし） |
| `npm run render` | `lines-data.json` をもとに動画をレンダリング |
| `npm run go` | `build-data` → `render` を一括実行 |
| `npm run auto` | `split` → `voice` → `build-data` → `render` を一括実行（旧方式の全自動フロー用） |
| `npm run auto-script` | `script-to-voicevox` → `voice` → `build-data` → `render` を一括実行（MD台本からの全自動フロー用） |
| `npm run dev` | Remotion Studio を起動してブラウザでプレビュー |
| `npm run build` | バンドルをビルド |
| `npm run lint` | ESLint + TypeScript型チェック |
