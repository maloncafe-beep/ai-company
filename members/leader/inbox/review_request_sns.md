# レビュー依頼：SNS — スプシ「画像プロンプト」列追加

## 依頼元
SNS

## 完了タスク
スプシ（x-auto-post投稿管理）にI列「画像プロンプト」を追加、ID47〜52にパスを記入

## 変更内容

### スプシ
- I1 ヘッダー：「画像プロンプト」
- ID47〜52 に対応プロンプトファイルのフルパスを記入済み

### コード
- `x-auto-post/tools/add-image-prompt-column.mjs`：新規作成（列追加・パス記入スクリプト）
- `x-auto-post/tools/lib/sheets.mjs`：範囲 A:H → A:I 拡張、addPost に imagePrompt フィールド追加
- `x-auto-post/package.json`：`add-image-col` スクリプト追加

### CLAUDE.md
スプシ登録ルールに画像プロンプト列ルールを追記

## 確認ポイント
- スプシI列にパスが正しく入っているか（ID47〜52）
- バリデーターは既存データ（ID1〜19）にエラーがあるが今回スコープ外として扱った点を承認いただけるか
