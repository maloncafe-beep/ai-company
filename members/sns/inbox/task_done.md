# タスク：スプシに「画像プロンプト」列を追加

## 背景
X投稿に漫画風挿絵を追加する運用を開始。Writerが投稿ごとに画像生成用プロンプトファイルを作成するため、
スプシ（Google Sheets x-auto-post）にローカルファイルパスを管理する列を追加する。
オーナーがスプシを見てパスを開き、コピーして手動で画像生成する運用。

## やること

### 1. スプシに「画像プロンプト」列を追加
本文列の右隣に「画像プロンプト」列を追加する。
記入内容：Writerが作成したプロンプトファイルのフルパス（Windowsパス）

### 2. 既存スケジュール済み投稿（ID47〜52）のパスを記入
**Writerのファイル作成完了後**に以下のパスを記入する。

| スプシID | 投稿種別 | ファイルパス |
|---------|---------|------------|
| 47 | スレッド16 | `C:\Users\yyasu\ai-company\members\writer\projects\blog-001\image-prompts\x-prompt-thread-16.txt` |
| 48 | リメイク26 | `C:\Users\yyasu\ai-company\members\writer\projects\blog-001\image-prompts\x-prompt-remix-26.txt` |
| 49 | スレッド17 | `C:\Users\yyasu\ai-company\members\writer\projects\blog-001\image-prompts\x-prompt-thread-17.txt` |
| 50 | リメイク27 | `C:\Users\yyasu\ai-company\members\writer\projects\blog-001\image-prompts\x-prompt-remix-27.txt` |
| 51 | スレッド18 | `C:\Users\yyasu\ai-company\members\writer\projects\blog-001\image-prompts\x-prompt-thread-18.txt` |
| 52 | リメイク28 | `C:\Users\yyasu\ai-company\members\writer\projects\blog-001\image-prompts\x-prompt-remix-28.txt` |

### 3. CLAUDE.md にルールを追記
スプシ登録手順に「画像プロンプト列にファイルパスを記入する」を追加する。

---

## 完了条件
- スプシに「画像プロンプト」列が追加されている
- ID47〜52の画像プロンプトパスが記入されている
- CLAUDE.md にルールが追記されている
- `inbox/task.md` を `inbox/task_done.md` にリネームして完了報告

## 補足
Writerのファイル作成が先行タスク。Writerの task_done.md を確認してからパス記入に進むこと。
