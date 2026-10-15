# ai-company
# line-harness

## サブフォルダ構成一覧

`ai-company/` 直下の各フォルダで「何を作って保存しているか」と「担当Claudeメンバー」の対応表。
メンバーの詳細な役割は [CLAUDE.md](./CLAUDE.md) のメンバー構成表を参照。

| フォルダ | 内容 | 担当 |
|---|---|---|
| `members/` | 各メンバーの作業ディレクトリ本体（`members/{名前}/projects/` にLOG.md付きで案件を格納） | 全メンバー |
| `x-auto-post` | X（旧Twitter）自動投稿ツール本体（Node.js／プロフィール・CSV下書き管理） | sns |
| `x-auto-post-openai` | `x-auto-post` のOpenAI版（投稿文生成をOpenAI APIで実行） | sns |
| `x-research` | Xの反応から違和感テーマを収集→テーマプール化→X投稿/note記事へ分岐させる独立プロジェクト | sns / researcher |
| `note-project-maloncafe` | note記事プロジェクト（@maloncafe名義。articles・ideas・research・templates） | writer |
| `note-project-zodiacm` | note記事プロジェクト（別名義アカウント） | writer |
| `note-project-sample` | note記事プロジェクトのひな型（新規名義立ち上げ用サンプル） | writer |
| `note-project-claude` | note記事プロジェクト＋Claudeとのチャットログ保管 | writer |
| `seo-article-agent` | SEO記事自動生成エージェント（Google連携・記事生成パイプライン） | writer |
| `lp` | LP（ランディングページ）制作一式（自動作成プロンプト・テンプレ・納品パック） | lp |
| `lp-gpt-public` | LP自動生成を公開GPT化したプラグイン一式 | lp | Codex
| `Design` | デザイン成果物（アイコン・バナー・サムネ・アニメーション・商品画像） | designer |
| `Claude-Image` | Claude Codeから画像生成するためのMCP環境構築検証（mcp-imagenate） | 経営者（検証中） |
| `line-stumps` | LINEスタンプ画像の自動生成・書き出しツール | designer |
| `line-bridge` | LINE Harness用ブリッジサーバー（旧構成、server.mjs） | ai-company |
| `remotion-practice` | Remotionによる動画自動レンダリング検証（shorts-pipeline・travel-reels等） | video |
| `youtube-short-agent` | YouTubeショート動画パイプライン（台本→VOICEVOX→Remotion、勝海舟シリーズ等） | video |
| `script-claude` | YouTube文字起こし・台本テーマ抽出スクリプト | researcher |
| `working` | クラウドワークス案件スカウト・スプレッドシート同期ツール | researcher |
| `scripts` | 会社全体の運用スクリプト（bridge.js＝LINE⇔Claude連携デーモン、セッションフック等） | ai-company |
| `skill` | 共通スキル定義の置き場 | ai-company |
| `inbox` | 経営者からの指示の仮置き場（セッション開始時に確認） | 経営者 |
