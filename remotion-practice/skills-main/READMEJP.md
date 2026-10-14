<!-- このファイルは README.md (英語版) を日本語に翻訳したものです。 -->

# Remotion Agent Skills（日本語訳）

Remotionは、Remotionプロジェクトで作業する際のベストプラクティスを定義した[Agent Skills](https://agentskills.io/home)の一覧を公式に提供・管理しています。

これらのスキルは、Claude Code、Codex、Kimi Code、Cursorなどの AI エージェントで役立ちます。

以下のコマンドでインストールできます。

```bash
npx skills add remotion-dev/skills
```

また、新規Remotionプロジェクト作成時にもスキルを追加するか選択できます。

```bash
bun create video
```

詳しくは[Remotion Agent Skills ドキュメント](https://www.remotion.dev/docs/ai/skills)を参照してください。

## 利用可能なスキル一覧

### `/remotion-best-practices`

すべてのスキルを統括する（他のスキル全体を包含する）ルーター役のスキルです。

どのスキルを使えばよいか分からない場合は、まずこれを使ってください。

### `/remotion-create`

新しいRemotionプロジェクトまたはコンポジションを作成します。

> 使用例プロンプト：`/remotion-create レコードショップのプロモーション動画を作って`

### `/remotion-markup`

Remotionの React マークアップを書く際のベストプラクティスです。

コンポジション、アニメーション、レイアウト、タイポグラフィ、メディア要素、エフェクト、音声、フォント、タイミングに関する知識が必要な場合に使用します。

> 使用例プロンプト：`/remotion-markup Interterを使ったアニメーション付きタイトルカードを作って`

### `/remotion-studio`

Studioを起動して動画のプレビューを表示します。

> 使用例プロンプト：`/remotion-studio`

### `/remotion-render`

動画または静止画（スチル）のレンダリングを実行します。

> 使用例プロンプト：`/remotion-render`

### `/remotion-maps`

Remotionで地図アニメーションを作成する際のベストプラクティスです。

静的な地図、アニメーション付きのルート・マーカー、地理的な説明動画、Mapbox、MapLibre、MapTiler、GeoJSON、CesiumJSによる3D地理フライオーバーなどに使用します。

> 使用例プロンプト：`/remotion-maps ロサンゼルスからニューヨークまでのルートをアニメーションさせて、カメラがそれを追従するようにして`

### `/remotion-captions`

キャプション・字幕に関するガイダンスです。

### `/remotion-saas`

Remotionを利用したアプリケーション・プロダクト統合のためのアーキテクチャガイダンスです。

> 使用例プロンプト：`/remotion-saas 自分の動画をSaaS化して`

### `/remotion-interactivity`

Remotionのコードを Studio 上で[編集可能](https://www.remotion.dev/docs/studio/interactivity)にするためのガイダンスです。

要素がStudio上で思うように選択・編集できない場合に使用します。

### `/remotion-docs`

Remotionの公式ドキュメントを検索し、任意のページをMarkdownとして取得します。

実装前に最新のAPIリファレンス、コンポーネントのprops、パッケージのガイドを確認する際に使用します。

> 使用例プロンプト：`/remotion-docs Remotion Lambdaのセットアップ方法は？`

### `/remotion-upgrade`

Remotion本体、関連パッケージ、互換性のあるMediabunnyパッケージ、およびインストール済みのRemotion Agent Skillsをアップグレードします。

> 使用例プロンプト：`/remotion-upgrade`

### `/remotion-multimedia`

Mediabunnyを使ったブラウザベースのマルチメディア処理に関するガイダンスです。

動画・音声のメタデータ取得方法などのアドバイスが必要な場合に使用します。
