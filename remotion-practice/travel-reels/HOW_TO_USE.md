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
| `text_layout` | `"horizontal"`＝横書き中央（場所特定VLOG向け）。省略時は縦書き（詩的・ストーリー向け） |

### 3. 各クリップのメタデータ（XXX.txt）を書く

```
location: 浅草寺
comment: 400年の歴史を感じる朝の空気
ai_generated: false
duration: 5.5
```

| キー | 必須 | 説明 |
|---|---|---|
| `location` | 任意 | 縦書き時：画面下部右寄りに小さく表示。横書き時：中央の2段目（英語表記など）に小さく表示 |
| `comment` | 任意 | 縦書き時：画面中央に縦書きで大きく表示。横書き時：中央の1段目に大きく表示（冒頭は日本語の場所名） |
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

## 横向き画像を縦向き画像にする際に、ドリフトで切り抜く（遠景のパノラマ様の動き）

**使い方**
```bash
node render-drift.js <プロジェクト名> <NNN> <横向き元写真のパス> [秒数=5] [方向=left-to-right]
```
- 出力は `projects/<プロジェクト名>/clips/<NNN>.mp4` に直接できます。
- あとは `NNN.txt`（location/comment）を今までどおり作って、`node prepare.js <プロジェクト名>` → `npx remotion render` を通せば、他のクリップと全く同じ扱いで組み込まれます。
- 方向は `left-to-right` か `right-to-left` の2択です。連続するショットで違和感が出ないよう、隣り合うクリップでは方向を変えてお使いください。
- **向く被写体**：遠景・一面に広がる景色（花畑、パノラマ的な景色）。**向かない被写体**：鳥居・巨岩など近距離で構図が重要なもの（見せたい部分から外れて動く）。その場合は Canva で手動作成する。
- 元写真は**横向き（4:3等）のみ**有効。すでに縦向きの写真では動く余地がなく、ほぼ静止画になる。
- 実行場所は `travel-reels` フォルダ直下（`node_modules` がここにあるため）。

---

## 制作ノウハウ（実績から得たルール）

### 尺と構成
- 合計30秒を基本に、写真の枚数で割る（10枚＝3秒、9枚＝3.33秒）。
- 1カット2秒は短すぎる（フェード分を除くと文字を読める時間が約0.7秒）。4〜5秒は間延びする。2〜3.3秒が目安。
- 冒頭1秒に最も目を惹く画像を置く（巨岩の見上げ、花畑の全景など）。

### 冒頭とサムネ（必須）
- **フェードインから始めない。** 実装済み：画像のフェードインは廃止、1カット目のテロップも最初のフレームから表示。クリップ末尾のフェードアウトのみ残している。
- 理由：Instagram は先頭フレームをサムネに使う。フェードインだと frame 0 が真っ黒になり、サムネが黒くなる（アップすると必ず起きる）。
- レンダリング後の確認：
  ```bash
  npx remotion still src/index.ts TravelVideo out/check.png --frame=0
  ```

### テロップ
- 背景ボックスは使わない。**4層のテキストシャドウ**で視認性を確保する（背景に馴染み、リールとして自然）。
- 場所を特定した VLOG は**横書き中央**（`text_layout: horizontal`）。1カット目は「日本語の場所名＋英語表記」の明朝2段。
  - 例：`comment: 三重・花の窟神社` ／ `location: Hananoiwaya Shrine`
- ストーリー仕立て・イメージ展開は**縦書き**（既定）。
- 文言は短く詩的に。横書きは1行約12文字まで（超えると2行に折り返す）。
- 位置は画面上から約42%のまま変えない（経営者判断）。
- 今後試す案：場所名と英語表記の間に、細く短い白線（約2px・白70%）を入れる。

### 公開用キャプション
- プロジェクト直下に `caption.txt` を置く。Instagram と Facebook で共通に使える。
- 1行目＝場所名＋ひとこと（「…続きを読む」の手前に出る）。本文は動画にない情報（豆知識・日程・所在地）。末尾にハッシュタグ10〜12個。
- 事実情報は公式サイトや境内の看板で確認する。確認できなかった点は報告時に明示する。

### つまずきやすい点
- 公式サイトの文字化け（Shift_JIS）：`curl` で取得して `iconv -f SHIFT_JIS -t UTF-8` で変換すると読める。
- PowerShell の `Get-Content` はUTF-8のtxtを文字化けして表示することがある。ファイル自体は正常なので、確認は Read / Grep を使う。
- 動画内のテロップ表示は `src/clips-data.json` で確認できる（`prepare.js` が毎回上書きするので、レンダリング前に必ず対象プロジェクトで `node prepare.js` を実行する）。

### 1本作る流れ（約5分）
1. 写真を `clips/001.jpg…` に連番で並べる（遠景の横写真は `render-drift.js` で縦MP4に）。
2. `001.txt…` にテロップ、`config.json` に尺・`text_layout` を書く。
3. `node prepare.js <名前>` → `npx remotion render src/index.ts TravelVideo out/<名前>.mp4`。
4. frame 0 を確認（黒くないこと、冒頭テロップが出ていること）。
5. `caption.txt` を作る。


---

## よくある確認事項

- **30秒を超えそう**: クリップ数を減らすか `duration_per_photo` を小さくする
- **動画の尺が自動検出されない**: txt に `duration: XX` を手動で書く
- **BGMが鳴らない**: `config.json` の `bgm` パスを確認、ファイルが存在するか確認
- **AI生成バッジが出ない**: txt に `ai_generated: true` が書かれているか確認
