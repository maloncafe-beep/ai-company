# YouTubeショート動画 制作ワークフロー

**最終更新**: 2026-08-23  
**運用頻度**: 1日1本アップ

---

## 全体フロー

```
① Writer   → inbox/script.txt を作成
② 経営者   → VOICEVOXでWAV作成 → assets/audio.wav を配置
③ Video    → python make_shorts.py 実行 → output/ に動画生成
④ 経営者   → サムネ作成 → YouTubeアップ
```

---

## フォルダ構造

```
members/video/projects/
├── _template/               ← 雛形（新シリーズ作成時にコピー）
│   └── series/
│       └── 001/             ← エピソード雛形
│           ├── inbox/
│           ├── assets/
│           ├── output/
│           └── work/
│
├── katsu/                   ← シリーズ：勝海舟の言葉
│   ├── 001/                 ← 第1回（2026-08-23）
│   │   ├── inbox/
│   │   │   └── script.txt
│   │   ├── assets/
│   │   │   ├── audio.wav    ← 経営者がVOICEVOXで作成
│   │   │   └── bg.png       ← VideoがAI生成
│   │   ├── output/
│   │   │   └── katsu-001_20260823.mp4
│   │   └── work/
│   │       └── whisper_segments.json
│   ├── 002/                 ← 第2回
│   └── 003/                 ← 第3回
│
└── sample-001/              ← テスト用（参照のみ）
```

### 命名規則

| 項目 | ルール | 例 |
|------|-------|----|
| シリーズフォルダ | 人物略称（英小文字） | `katsu` `miya` `saigo` |
| エピソードフォルダ | 3桁連番 | `001` `002` `099` |
| 音声ファイル | 固定名 | `audio.wav` |
| 台本ファイル | 固定名 | `script.txt` |
| 完成動画 | `{シリーズ}-{番号}_{YYYYMMDD}.mp4` | `katsu-001_20260823.mp4` |

---

## ① Writer → 台本作成

**納品先**: `projects/{シリーズ}/{番号}/inbox/script.txt`

```
【タイトル】
考えすぎて動けない時に思い出したい勝海舟の言葉

【ハッシュタグ】
#勝海舟 #名言 #自己成長

【台本】
考えすぎて、動けなくなることがあります。

仕事で新しいことを任された時。
...
```

- `【台本】` セクションのみが動画テキストに使われる
- 1段落 = 1〜2文、改行で区切る
- VOICEVOXの読み上げを想定した自然なテンポで書く

---

## ② 経営者 → WAV作成

1. `inbox/script.txt` の `【台本】` をVOICEVOXにコピー
2. イントネーション調整
3. WAVエクスポート → **`assets/audio.wav`** に保存

---

## ③ Video → 動画生成

**スクリプトの場所**: `members/video/projects/{シリーズ}/{番号}/`

```bash
cd members/video/projects/katsu/001
python ../../make_shorts.py
```

### make_shorts.py の動作
1. `inbox/script.txt` から `【台本】` を自動抽出
2. `assets/audio.wav` をWhisperで解析してタイムスタンプ取得
3. テーマに合ったAI背景を生成 → `assets/bg.png`
4. 動画生成 → `output/katsu-001_20260823.mp4`

### 動画構成（固定）
| セクション | 時間 | 内容 |
|-----------|------|------|
| カウントダウン | 3秒 | 3→2→1 |
| 本編 | WAV長さ | テキスト積み上げ＋Ken Burns＋ライズ |
| エンディング | 2秒 | 「チャンネル登録と高評価をお願いします」 |

---

## ④ 経営者 → アップ

- 動画: `output/{シリーズ}-{番号}_{YYYYMMDD}.mp4`
- タイトル: `script.txt` の `【タイトル】`
- ハッシュタグ: `script.txt` の `【ハッシュタグ】`

---

## 新規エピソード作成手順

```
1. _template/series/001/ を新しいパスにコピー
   例: projects/katsu/002/

2. Writer に script.txt 作成を依頼

3. 経営者が audio.wav を assets/ に配置

4. Videoセッションで make_shorts.py を実行
```

---

## シリーズ一覧

| シリーズ | フォルダ | 状態 |
|---------|--------|------|
| 勝海舟の言葉 | `katsu/` | 運用中 |
| （次のシリーズ） | `{略称}/` | 追加時に記載 |
