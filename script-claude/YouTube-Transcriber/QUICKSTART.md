# YouTube 文字起こしスクリプト クイックスタート

## 30秒で始める

### 1️⃣ PowerShellを開く

`Win + X` → `I` キー（Windows PowerShellを選択）

### 2️⃣ スクリプトのあるフォルダに移動

```powershell
cd C:\Users\yyasu\script-claude
```

### 3️⃣ スクリプトを実行

```powershell
.\youtube-transcriber.ps1 "https://www.youtube.com/watch?v=XXXXX"
```

**`XXXXX` の部分はコピーしたいYouTubeの動画IDに置き換え**

---

## よく使うパターン

### パターン1: TXT形式で保存（カレントディレクトリ）

```powershell
.\youtube-transcriber.ps1 "https://www.youtube.com/watch?v=S0RHNQg5SD4"
```

💾 **出力**: `S0RHNQg5SD4_2026-08-28_153045.txt`

---

### パターン2: MD形式で保存（クライアント参考動画フォルダ）

```powershell
.\youtube-transcriber.ps1 "https://www.youtube.com/watch?v=S0RHNQg5SD4" -Format md -OutputDir "C:\Users\yyasu\script-claude\clients\test2\references"
```

💾 **出力**: `C:\Users\yyasu\script-claude\clients\test2\references\S0RHNQg5SD4_2026-08-28_153045.md`

---

### パターン3: ショート動画（短くて速い）

```powershell
.\youtube-transcriber.ps1 "https://www.youtube.com/shorts/aTpKaqDdc5c"
```

---

## 実行エラーが出たら

### ❌ "実行ポリシーエラー"

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

その後もう一度スクリプトを実行

---

### ❌ "yt-dlpが認識されない"

```powershell
pip install yt-dlp
```

---

## 出力ファイルの確認

実行後、以下の場所に `.txt` または `.md` ファイルが出来ます：

```
C:\Users\yyasu\script-claude\
├── S0RHNQg5SD4_2026-08-28_153045.txt  ← このファイル
```

ダブルクリックで開いて確認できます。

---

## パラメーター一覧

| 名前 | 説明 | 例 |
|:---|:---|:---|
| `Url` | 処理するYouTubeのURL（必須） | `"https://www.youtube.com/watch?v=XXX"` |
| `-Format` | 出力形式（txt or md） | `-Format md` |
| `-OutputDir` | 保存先フォルダ | `-OutputDir "C:\path"` |

---

## 詳しい使い方は

📖 **[README_YouTube_Transcriber.md](README_YouTube_Transcriber.md)** を参照してください。

---

## 次のステップ

1. ✅ スクリプトで文字起こし取得
2. ✅ `clients/{client-name}/references/` に配置
3. ✅ `style-guide.md` 更新
4. ✅ 台本生成パイプライン実行

Good luck! 🚀
