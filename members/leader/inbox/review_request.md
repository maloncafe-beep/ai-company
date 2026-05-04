# レビュー依頼：Writer — 挿絵プロンプト運用開始

## 依頼元
Writer

## 完了タスク
X投稿への挿絵プロンプト作成（遡及6本）

## 成果物
`members/writer/projects/blog-001/image-prompts/` に以下6ファイルを作成：

| ファイル | 対応投稿 | タイトル | vol |
|---------|---------|---------|-----|
| x-prompt-thread-16.txt | x-thread-16 | 次から気をつける、また。 | vol.16 |
| x-prompt-remix-26.txt  | x-remix-26  | 気をつける、では変わらない。 | vol.16 |
| x-prompt-thread-17.txt | x-thread-17 | 後で読む、が500件。 | vol.17 |
| x-prompt-remix-27.txt  | x-remix-27  | 保存は読書じゃない。 | vol.17 |
| x-prompt-thread-18.txt | x-thread-18 | あと1話、が3話。 | vol.18 |
| x-prompt-remix-28.txt  | x-remix-28  | 終わりは設計する。 | vol.18 |

## ルール変更
CLAUDE.mdに追記：「新規x-*.md作成時は対応する挿絵プロンプトファイルも同時作成する」

## 確認ポイント
- 各プロンプトの [シーン・ポーズ]・[テキスト要素] が投稿内容と合っているか
- vol番号の振り方（スレッドは通し番号、リメイクは対応スレッドと同じvol）が正しいか
- テンプレートの固定部分が変更されていないか

---

## 追加報告：コンテンツ番号ルール確定（SNS担当と調整済み）

SNS担当との協議を経て、Writerのファイル番号（NN）ルールを以下に確定しました。

- **既存ファイル（x-thread-01〜18、x-remix-11〜28）：触らない**
- **新規コンテンツはNN=60からスタート**
- スレッド・リメイク・画像プロンプトは同じNNを使う（例：thread-60、remix-60、x-prompt-60-{slug}.txt）
- CLAUDE.mdに反映済み・コミット済み
