# YouTube 文字起こしスクリプト

YouTubeの動画URLを入力するだけで、日本語字幕を自動的に取得して、テキスト形式で保存するPowerShellスクリプトです。

## 機能

- ✅ YouTubeのURL 1つで完全自動化
- ✅ 日本語字幕を自動取得
- ✅ TXT / MD 形式で出力選択可能
- ✅ 重複行を自動削除（読みやすさ重視）
- ✅ 取得日時・動画IDを記録
- ✅ 処理進捗をリアルタイム表示

## 必要な環境

### 前提条件
- Windows PC（PowerShell 5.0以上）
- Python がインストール済み
- `yt-dlp` がインストール済み

### インストール確認

```powershell
# yt-dlpのバージョン確認
yt-dlp --version

# Pythonのバージョン確認
python --version
```

> **yt-dlpがない場合**
> 
> ```powershell
> pip install yt-dlp
> ```

## 使い方

### 基本的な使用方法

PowerShellを開いて、以下のコマンドを実行してください。

```powershell
.\youtube-transcriber.ps1 "https://www.youtube.com/watch?v=XXXXXX"
```

### 例

#### 例1: TXT形式で保存（デフォルト）

```powershell
.\youtube-transcriber.ps1 "https://www.youtube.com/watch?v=S0RHNQg5SD4"
```

**結果**: カレントディレクトリに `S0RHNQg5SD4_2026-08-28_153045.txt` が作成されます

---

#### 例2: MD形式で保存

```powershell
.\youtube-transcriber.ps1 "https://www.youtube.com/watch?v=S0RHNQg5SD4" -Format md
```

**結果**: カレントディレクトリに `S0RHNQg5SD4_2026-08-28_153045.md` が作成されます

---

#### 例3: 指定フォルダに保存

```powershell
.\youtube-transcriber.ps1 "https://www.youtube.com/watch?v=S0RHNQg5SD4" -OutputDir "C:\Users\yyasu\script-claude\clients\test2\references"
```

**結果**: 指定フォルダに保存されます

---

#### 例4: MD形式 + 指定フォルダ

```powershell
.\youtube-transcriber.ps1 "https://www.youtube.com/watch?v=S0RHNQg5SD4" -Format md -OutputDir "C:\Users\yyasu\script-claude\clients\test2\references"
```

## パラメーター一覧

| パラメーター | 説明 | 必須 | デフォルト | 値 |
|:---|:---|:---:|:---:|:---|
| `Url` | YouTubeのURL | ✅ | — | YouTube URL |
| `Format` | 出力形式 | — | `txt` | `txt` または `md` |
| `OutputDir` | 出力ディレクトリ | — | カレントディレクトリ | フルパス |

## 出力形式

### TXT形式

シンプなテキストファイルです。行ごとに文字起こし内容が記載されます。

```
最後に1番大切なことを伝えます。
60代
になっては勝った体が動くうちにあって
おくべき5つのこと。
...
```

### MD形式（Markdown）

メタデータ付きのMarkdownファイルです。動画情報が見出しで記載されます。

```markdown
# YouTube文字起こし

**動画ID**: S0RHNQg5SD4
**取得日時**: 2026-08-28 15:30:45
**URL**: https://www.youtube.com/watch?v=S0RHNQg5SD4

---

最後に1番大切なことを伝えます。
60代
になっては勝った体が動くうちにあって
おくべき5つのこと。
...
```

## 対応するYouTube URLの形式

以下の形式に対応しています：

- ✅ `https://www.youtube.com/watch?v=XXXXXX`
- ✅ `https://youtu.be/XXXXXX`
- ✅ `https://youtube.com/watch?v=XXXXXX`
- ✅ `https://m.youtube.com/watch?v=XXXXXX`（モバイル）

## トラブルシューティング

### エラー: "yt-dlp は認識されていません"

**原因**: yt-dlpがインストールされていないか、パスが通っていない

**解決方法**:
```powershell
# インストール
pip install yt-dlp

# 確認
yt-dlp --version
```

---

### エラー: "字幕の取得に失敗しました"

**原因**: 
- 動画が非公開 or 削除されている
- 日本語字幕が存在しない
- ネットワーク接続エラー

**対処方法**:
1. URLが正しいか確認
2. YouTubeで動画を開いて、日本語字幕が存在するか確認
3. インターネット接続を確認

---

### エラー: "出力ディレクトリが存在しません"

**原因**: 指定したフォルダが存在しない

**解決方法**:
```powershell
# フォルダを先に作成
mkdir "C:\Users\yyasu\script-claude\clients\test2\references"

# その後スクリプトを実行
.\youtube-transcriber.ps1 "URL" -OutputDir "C:\Users\yyasu\script-claude\clients\test2\references"
```

---

### 実行時に "実行ポリシーエラー" が出た

**原因**: PowerShellの実行ポリシーが厳しく設定されている

**解決方法**:
```powershell
# 現在のポリシー確認
Get-ExecutionPolicy

# 一時的に許可（その後元に戻す）
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\youtube-transcriber.ps1 "URL"

# 元に戻す
Set-ExecutionPolicy -ExecutionPolicy Restricted -Scope CurrentUser
```

## よくある質問（FAQ）

### Q: 複数の動画を一括処理できますか？

A: スクリプト自体は1動画ずつですが、以下のようにループで複数実行できます：

```powershell
$urls = @(
    "https://www.youtube.com/watch?v=XXX1",
    "https://www.youtube.com/watch?v=XXX2",
    "https://www.youtube.com/watch?v=XXX3"
)

foreach ($url in $urls) {
    .\youtube-transcriber.ps1 $url -OutputDir "C:\path\to\output"
    Start-Sleep -Seconds 5  # 各処理間に5秒待機
}
```

---

### Q: 英語の字幕も取得できますか？

A: スクリプトを以下のように修正すれば可能です（`--sub-langs ja` → `--sub-langs en`）。

---

### Q: 出力ファイルの名前を変更できますか？

A: 出力ファイルは `{動画ID}_{タイムスタンプ}.{拡張子}` の形式です。必要に応じてファイルをリネームしてください。

---

### Q: 古い一時ファイル（SRT）を削除したくありません

A: スクリプトの最後の行をコメントアウトしてください：

```powershell
# 以下の2行をコメントアウト
# if (Test-Path $srtFile) { Remove-Item $srtFile -Force }
# if (Test-Path $vttFile) { Remove-Item $vttFile -Force }
```

## 動作確認

以下のコマンドでテスト実行できます：

```powershell
# テスト用（短いショート動画）
.\youtube-transcriber.ps1 "https://www.youtube.com/shorts/aTpKaqDdc5c"

# テスト用（通常動画）
.\youtube-transcriber.ps1 "https://www.youtube.com/watch?v=YcAWHRDCClE"
```

## スクリプトのカスタマイズ

### 言語の変更

`--sub-langs ja` の部分を変更してください：

- `en` = 英語
- `ja` = 日本語
- `ko` = 韓国語
- `zh` = 中国語（簡体字）

### ファイル名形式の変更

以下の部分でファイル名形式を調整できます：

```powershell
# 例: 年月日形式に変更
$timestamp = Get-Date -Format "yyyyMMdd"
$outputFile = Join-Path $OutputDir "${videoId}_${timestamp}.${Format}"
```

---

## 技術詳細

### 処理の流れ

1. **入力検証**: URLが正しい形式か確認
2. **動画ID抽出**: URLから動画IDを抽出
3. **字幕ダウンロード**: yt-dlpを使って日本語字幕をSRT形式で取得
4. **テキスト抽出**: SRTファイルからテキスト部分のみを抽出（タイムコード除外）
5. **重複削除**: 連続する重複行を削除
6. **ファイル保存**: TXTまたはMD形式で保存
7. **クリーンアップ**: 一時ファイル（SRT, VTT）を削除

### 制限事項

- 日本語字幕が存在しない動画は処理できません
- 自動生成字幕がない動画も処理できません
- ネットワーク環境に依存します
- 大型動画（1時間以上）は処理時間がかかる場合があります

## ライセンス

自由に使用・改変・配布できます。

## トラブル時の連絡先

スクリプトがエラーを出力した際は、エラーメッセージをコピーして参照ください。
