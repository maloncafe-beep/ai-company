# shorts-pipeline

台本MD → VOICEBOX録音 → 自動レンダリング → YouTubeショート動画

---

## 事前準備（初回のみ）

```bash
cd shorts-pipeline
npm install
$env:ANTHROPIC_API_KEY = "sk-ant-..."
```

---

## 毎回の手順

### 1. 台本MDを解析する

```bash
npm run parse "C:\Users\yyasu\ai-company\youtube-short-agent\articles\drats\台本ファイル名.md"
```

- `input/slides/` に `01.txt` 〜 `XX.txt` が生成される
- イラスト素材・BGM が自動で同期される
- VOICEBOXで録音すべき一覧がターミナルに表示される

---

### 2. VOICEBOXで録音する

ターミナルに表示されたチェックリストを上から順に録音する。

- ファイル名は VOICEBOX のデフォルト出力（`001-声優名-テキスト.wav`）のままでOK
- 書き出し先： `input/slides/`

---

### 3. 動画をレンダリングする

```bash
npm run go
```
shorts-pipeline-v2 の長尺バージョンの場合
npm run render

- Claude がテキストとイラストを自動マッチング（初回のみ少し時間がかかる）
- 完成動画： `out/ShortsVideo.mp4`（1080×1920 縦動画）

---

## フォルダ構成

```
shorts-pipeline/
  input/
    slides/     ← WAV + TXT をここに置く
    illustrations/  ← イラスト素材（自動同期）
    bgm.mp3         ← BGM（自動同期）
  out/
    ShortsVideo.mp4 ← 完成動画
```

## イラスト素材を追加するには

`C:\Users\yyasu\ai-company\youtube-short-agent\assets\illustration\` に PNG を追加して
`npm run parse` を再実行するだけで自動同期される。

## テキスト台本の仕様
- テキスト台本（001.txt）状の記載ルール：「。」で改行される　[[]]で強調文字
- 全スライド終了後に3秒間のアウトロシーンが自動付加されます
白背景に「チャンネル登録・高評価よろしくお願いします！」＋ 👍 ❤️ をフェードイン・アウトで表示
入力ファイル（WAV/TXT/PNG）の追加不要 — 仕様変更なし
BGMのフェードアウトもアウトロ末尾に合わせて自動調整