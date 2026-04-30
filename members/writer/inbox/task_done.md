# タスク依頼 from Leader

依頼日: 2026-04-30
案件名: blog-001（Xスレッド形式リフォーマット＋日次3本制作開始）

## 概要
①既存6本をXスレッド形式にリフォーマット（一回限り）
②今後は毎日3本、Xスレッド形式で新規作成（継続）

---

## ① リフォーマット（今日中に完了）

既存6本のブログ記事をX投稿（スレッド形式）に変換する。

### フォーマット仕様
1投稿 = 4ツイートのスレッド

```
【ツイート1】現象
【ツイート2】ズレ
【ツイート3】構造仮説
【ツイート4】次の実験
```

### 各ツイートのルール
- 1ツイート：最大140字（日本語）
- セクション見出し（【現象】等）は冒頭に入れてよい
- 次のツイートを読みたくなる引きを意識する
- 口語寄り・体言止め活用でテンポよく

### 成果物（リフォーマット分）
- `projects/blog-001/x-thread-01-honne-tatemae.md`
- `projects/blog-001/x-thread-02-wakai-ne.md`
- `projects/blog-001/x-thread-03-winker.md`
- `projects/blog-001/x-thread-04-mata-kondo.md`
- `projects/blog-001/x-thread-05-deadline-idea.md`
- `projects/blog-001/x-thread-06-nantona-tsukare.md`

各ファイルにツイート番号と文字数を明記すること。

---

## ② 本日分の新規3本（日次ルーティン初回）

リフォーマット完了後、新規記事3本を同フォーマットで作成する。

### 成果物（新規分）
- `projects/blog-001/x-thread-07-*.md`
- `projects/blog-001/x-thread-08-*.md`
- `projects/blog-001/x-thread-09-*.md`

---

## 完了条件
- ①②すべて完了 → LOG.md に作業記録を追記
- `inbox/task_done.md` にリネームし leader に報告
