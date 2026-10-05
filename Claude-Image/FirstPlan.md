# 計画: Claude-Image — mcp-imagenate でClaudeCodeから画像生成

## Context
`C:\Users\yyasu\ai-company\Claude-Image` は現在空ディレクトリ。
Zennの記事（https://zenn.dev/forward/articles/11a680c4b530ab）を参考に、`mcp-imagenate` パッケージを使ってClaudeCodeから画像生成できる環境を構築する。

## 方針
`mcp-imagenate`（npm公開済み）を Claude Code の MCP サーバーとして登録し、`generate_image` ツールをClaudeCodeから呼び出せるようにする。

## 実装手順

### 1. APIキーの確認・取得
以下のうち少なくとも1つを用意（既存キーがあれば流用）:
- `GEMINI_API_KEY`（Google AI Studio で無料取得可能）
- `OPENAI_API_KEY`（gpt-image-2 対応）
- `BFL_API_KEY`（FLUX モデル）

→ **Gemini を使用**（`GEMINI_API_KEY`）

### 2. プロジェクト初期化（Claude-Image/ 内）
```
Claude-Image/
├── CLAUDE.md        # 画像生成ルール・出力先
└── output/          # 生成画像の保存先
```

### 3. MCP設定（Claude Code の settings.json に追記）
`~/.claude/settings.json` の `mcpServers` セクションに追加:

```json
{
  "mcpServers": {
    "mcp-imagenate": {
      "command": "npx",
      "args": ["mcp-imagenate"],
      "env": {
        "GEMINI_API_KEY": "${GEMINI_API_KEY}",  // 実行時にユーザーが入力
        "NANO_BANANA_OUTPUT_DIR": "C:/Users/yyasu/ai-company/Claude-Image/output"
      }
    }
  }
}
```

### 4. CLAUDE.md 作成（Claude-Image/）
- 出力先ディレクトリのパス
- デフォルトモデル・解像度の指定
- 生成後に `open` コマンドで自動表示するルール

### 5. 動作確認
- Claude Code セッションを再起動
- 「画像を生成して」などのプロンプトで `generate_image` ツールが呼ばれることを確認
- output/ に PNG が生成されることを確認

## 変更ファイル
- `~/.claude/settings.json` — MCP サーバー追加
- `Claude-Image/CLAUDE.md` — 新規作成
- `Claude-Image/output/` — ディレクトリ作成

## 要確認事項
**GEMINI_API_KEY の値**: 実装時にユーザーに入力いただく（設定ファイルには直接書かず、セキュアに扱う）

## 検証方法
1. `npx mcp-imagenate` が正常起動するか確認
2. Claude Code から「赤いりんごの画像を生成して」と指示 → output/ にファイルが生成される