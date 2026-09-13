# Claude-Image — 画像生成プロジェクト

## 概要
`mcp-imagenate` を使って Claude Code から画像を生成する。

## MCP サーバー
- サーバー名: `mcp-imagenate`
- ツール名: `generate_image`

## 出力先
`C:\Users\yyasu\ai-company\Claude-Image\output\`

## デフォルト設定
- モデル: `gemini-2.0-flash-preview-image-generation`（Gemini）
- 解像度: `1K`
- アスペクト比: `1:1`（指定なければ正方形）

## ルール
- 生成後は `start` コマンド（Windows）で自動表示する
  例: `start C:\Users\yyasu\ai-company\Claude-Image\output\generated.png`
- ファイル名は内容を表す英語名にする（例: `red_apple_1k.png`）
- 生成した画像は output/ に保存される（MCP 設定の NANO_BANANA_OUTPUT_DIR）
