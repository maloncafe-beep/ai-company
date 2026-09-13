# travel-reels 使い方

## 初回セットアップ（初回のみ）

```bash
cd remotion-practice/travel-reels
npm install
```

---

## 新しい旅行動画を作る（毎回の手順）

### 1. プロジェクトフォルダを作る

`projects/sample/` をコピーして日付+場所で命名する。

```
projects/
└── 2026-08-tokyo/        ← 例：日付+場所
    ├── config.json
    └── clips/
        ├── 001.jpg        ← 写真（.jpg / .png）
        ├── 001.txt
        ├── 002.mp4        ← 動画（.mp4 / .mov）
        ├── 002.txt
        └── ...            ← 番号順に並べる（表示順になる）
```

### 2. config.json を書く

```json
{
  "title": "東京 2026年8月",
  "bgm": "common/bgm/upbeat.mp3",
  "duration_per_photo": 4,
  "style": "standard"
}
```

| 項目 | 説明 |
|---|---|
| `title` | 動画タイトル（現状は未表示、将来拡張用） |
| `bgm` | BGMファイルのパス。`common/bgm/` から指定。プロジェクト直下に `bgm.mp3` を置いても可 |
| `duration_per_photo` | 写真1枚あたりの秒数（デフォルト4秒） |
| `style` | 将来のスタイル切り替え用（現在は `"standard"` のみ） |

### 3. 各クリップのメタデータ（XXX.txt）を書く

```
location: 浅草寺
comment: 400年の歴史を感じる朝の空気
ai_generated: false
duration: 5.5
```

| キー | 必須 | 説明 |
|---|---|---|
| `location` | 任意 | 場所名。画面下部に大きく表示 |
| `comment` | 任意 | ひとことコメント。場所名の下に小さく表示 |
| `ai_generated` | 任意 | `true` にすると右上に「AI Generated」バッジ表示 |
| `duration` | 任意 | 秒数。**動画は省略で自動検出**。写真は省略で config 値を使用 |

### 4. スマホ動画のトリミング（必要な場合）

Remotion に渡す前に使いたい部分だけ切り出す。FFmpeg を使う場合：

```bash
ffmpeg -i input.mp4 -ss 00:00:03 -t 00:00:05 -c copy output.mp4
```

- `-ss`: 開始時刻（時:分:秒）
- `-t`: 切り出す長さ（秒）

切り出した mp4 を `clips/` に配置し、txt で `duration` を指定する。

### 5. Higgsfield 連携（AI動画生成）

1. `members/video/` で Higgsfield を使い写真→動画を生成
2. 生成された mp4 を `projects/xxx/clips/` にコピー
3. 対応する `.txt` に `ai_generated: true` を書く

### 6. BGMを追加する

`common/bgm/` にフリー素材の mp3 を入れておくと複数プロジェクトで使い回せる。

```
common/bgm/
├── upbeat.mp3     ← 明るい・テンポいい
├── calm.mp3       ← 落ち着いた・自然系
└── emotional.mp3  ← 感動系
```

### 7. データ生成 & プレビュー確認

```bash
cd remotion-practice/travel-reels
node prepare.js 2026-08-tokyo
npm run dev
```

ブラウザで `http://localhost:3000`（または空きポート）を開く。
スタジオでタイムラインをスクラブしてテキスト・フェード・BGMを確認。

### 8. レンダリング（完成）

```bash
node prepare.js 2026-08-tokyo && npx remotion render TravelVideo --output out/2026-08-tokyo.mp4
```

完成動画は `out/2026-08-tokyo.mp4` に保存される。

---

## フォルダ構成

```
travel-reels/
├── HOW_TO_USE.md          ← この手順書
├── prepare.js             ← データ生成スクリプト
├── projects/              ← 旅行ごとのプロジェクト（ここに追加していく）
│   └── sample/            ← テンプレート（コピーして使う）
├── common/
│   └── bgm/               ← 共通BGMライブラリ
├── src/
│   ├── components/        ← UIパーツ（デザイン変更はここ）
│   │   ├── AiBadge.tsx    ← AI生成バッジ
│   │   ├── KenBurns.tsx   ← 写真のズーム・パン
│   │   └── TextOverlay.tsx← 場所名・コメント表示
│   └── TravelScene.tsx    ← 全体の構成・フェード・BGM
└── out/                   ← 完成動画（プロジェクト名で保存）
```

---

## デザインを変えたい場合

| 変えたい内容 | 触るファイル | 変数名 |
|---|---|---|
| テロップの文字サイズ | src/components/TextOverlay.tsx | `fontSize` |
| テロップの位置（下からの余白） | src/components/TextOverlay.tsx | `padding` |
| AI生成バッジのデザイン | src/components/AiBadge.tsx | — |
| 写真のズーム・パン幅 | src/components/KenBurns.tsx | `PATTERNS` |
| クリップ間のフェード速度 | src/TravelScene.tsx | `FADE_FRAMES` |
| BGMの音量 | src/TravelScene.tsx | `BGM_VOLUME` |
| 写真のデフォルト表示秒数 | projects/xxx/config.json | `duration_per_photo` |

---

## よくある確認事項

- **30秒を超えそう**: クリップ数を減らすか `duration_per_photo` を小さくする
- **動画の尺が自動検出されない**: txt に `duration: XX` を手動で書く
- **BGMが鳴らない**: `config.json` の `bgm` パスを確認、ファイルが存在するか確認
- **AI生成バッジが出ない**: txt に `ai_generated: true` が書かれているか確認
