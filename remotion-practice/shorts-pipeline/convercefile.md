# 素材ファイルの自動作成

## フォルダ構成

```
shorts-pipeline/
  input/
    slides/
      01.wav      ← VOICEBOXで書き出したWAV
      01.txt      ← 字幕テキスト（1行）
      02.wav
      02.txt
      ...
    illustrations/
      *.png       ← Canvaからダウンロードしたイラスト素材
    bgm.mp3       ← BGM（省略可

```

## 残っている素材の退避
illustrations/に前回の作業で残っている.pngをリネームしてBackupに移す。
38は、ショート動画の管理番号

PS
Get-ChildItem *.png | Rename-Item -NewName { "38-" + $_.Name }

## 1.  VOICEBOXで書き出した台本テキストをシーンごとに分解する

台本テキストを繋げて保存されているTXTファイル
\shorts-pipeline\input\temp\voicebox.txt


### 行番号なしのテキストを001.txt,002.txtのように分解して保存する。

1行ごとに nnn.txtを作成する。**カンマ以降のテキストのみ**
[キャラクター名（ノーマル）],[台本テキスト]     → [台本テキスト]の内容を抽出してファイル保存 → 001.txt
[キャラクター名（ノーマル）],[台本テキスト]     → [台本テキスト]の内容を抽出してファイル保存 → 002.txt
[キャラクター名（ノーマル）],[台本テキスト]     → [台本テキスト]の内容を抽出してファイル保存 → 003.txt
・・・

例）青山龍星（ノーマル）,実は、話を聞くのが上手い人ほど「すぐ答えない」
→　実は、話を聞くのが上手い人ほど「すぐ答えない」
**カンマ以降のテキスト分を000.txtにする**

### slidesフォルダに分解したTXTファイルをコピーする。
shorts-pipeline/
  input/
    slides/
      01.txt      ← 字幕テキスト（1行）
      02.txt


## 2. 台本の内容に合うイラストをillustrationsフォルダにコピーする。

C:\Users\yyasu\ai-company\youtube-short-agent\assets\illustration

このフォルダの中から台本の内容に合うイラストをxxx.pngにリネームしてillustrationsフォルダにコピーする。
フォルダ内に適切なイラストがない場合、Canvaからダウンロードする（「いらすとや」の素材）

illustrations/
*.png       ← Canvaからダウンロードしたイラスト素材


