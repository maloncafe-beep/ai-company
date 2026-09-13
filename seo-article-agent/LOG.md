# LOG

## 2026-07-12

- 完成成果物: `articles/drafts/backoffice-ai-automation-intro.md` / 対象キーワード「バックオフィス 自動化 AI」で、導入理由・対象業務・注意点・小さく始める手順まで含むSEO記事ドラフトを作成。
- 学び・新ルール: このリポジトリのSEO記事ドラフトは `articles/drafts/` を正本の保存先として扱うと、公開対象と手元のドラフト管理を揃えやすいです。
- 完了処理: Googleドキュメント出力とスプレッドシートの「記事ログ」追記まで実施しました。公開用実行は `npm run publish-draft -- --file articles/drafts/backoffice-ai-automation-intro.md --keyword "バックオフィス 自動化 AI"` で再実行できます。
- 進行メモ: `tools/publish-draft.mjs` を追加し、`articles/drafts/` 配下のMarkdownドラフトから Googleドキュメント作成と記事ログ追記を一括実行できるようにしました。
