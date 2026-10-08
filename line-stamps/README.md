# LINEスタンプ自動生成

LINE Creators Market に提出できるスタンプを、設定ファイルと画像生成で自動作成するためのプロジェクトです。  
**セミナー参加者特典**としてお渡ししている場合は、まず **[使い方ガイド.md](./使い方ガイド.md)** をご覧ください。

## クイックスタート（ガイドを見た人向け）

1. `config.example.yaml` をコピーして `config.yaml` にリネームし、編集する  
2. スタンプを生成する  
   - **Mac**: ターミナルでフォルダに移動して `.venv/bin/python run.py --zip`  
   - **Windows**: コマンドプロンプトでフォルダに移動して `.venv\Scripts\python run.py --zip`  
   - または **run_with_zip.command**（Mac）／**run_with_zip.bat**（Windows）をダブルクリック  
3. `output/line_stamp_submit.zip` が LINE 提出用です

## LINEスタンプの仕様（要約）

- **メイン画像**: 1枚・240×240px
- **スタンプ画像**: 8 / 16 / 24 / 32 / 40 枚のいずれか・最大 370×320px
- **チャットサムネイル**: 1枚・96×74px
- 形式: PNG・透過可・1枚あたり最大 1MB・ZIP 最大 60MB  
- 詳細: [LINE Creators Market - Stickers](https://creator.line.me/en/guideline/sticker/)

## セットアップ

```bash
cd "LINEスタンプ自動生成"
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

## 使い方

1. **設定ファイルを用意する**  
   `config.example.yaml` をコピーして `config.yaml` を作成し、編集する。

   - `stamp`: タイトル・説明・作者名・著作権表記
   - `sticker_count`: 8 / 16 / 24 / 32 / 40 のいずれか
   - `character`: キャラの名前・説明（今はプレースホルダー用のメモ）
   - `expressions`: スタンプの文言・表情のリスト（`sticker_count` と同じ数以上）

2. **プレースホルダーで試す（API不要）**

   ```bash
   python run.py
   ```

   `output/` に、仕様どおりのサイズの PNG が生成されます。

3. **提出用ZIPまで作る**

   ```bash
   python run.py --zip
   ```

   `output/line_stamp_submit.zip` ができます。中身はそのまま Creators Market の「画像をZIPでアップロード」用です。

## 画像生成の種類

- **placeholder**（初期値）  
  API不要。テスト用の単色＋テキスト画像を生成します。

- **openai**（今後対応）  
  `OPENAI_API_KEY` を設定し、DALL-E などでキャラ・表情を描画するモード。  
  `generators/openai_gen.py` を実装すると利用可能になります。

## ディレクトリ構成

```
LINEスタンプ自動生成/
├── config.example.yaml   # 設定例
├── config.yaml           # 本番用設定（自分で作成）
├── line_specs.py         # LINE公式仕様の定数
├── image_utils.py       # リサイズ・PNG保存など
├── pack_stamp.py        # ZIPパッケージ作成
├── run.py               # メイン実行スクリプト
├── generators/
│   ├── base.py          # 生成器の基底クラス
│   └── placeholder.py  # プレースホルダー生成
├── output/              # 生成結果（run.py で作成）
└── requirements.txt
```

## 注意

- 実際に販売するスタンプは、LINEの[審査ガイドライン](https://creator.line.me/en/review_guideline/)に従ってください。
- プレースホルダー画像は「テスト用」です。本番用はイラストや写真を用意するか、AI画像生成（OpenAI 等）を組み込んでください。
