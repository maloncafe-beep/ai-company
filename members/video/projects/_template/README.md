# プロジェクトフォルダ テンプレート

## フォルダ名の命名規則
```
{シリーズ略称}-{3桁連番}
例: katsu-001（勝海舟の言葉・第1回）
    katsu-002（勝海舟の言葉・第2回）
    miya-001（宮本武蔵の言葉・第1回）
```

## フォルダ構成
```
projects/{シリーズ}-{番号}/
├── inbox/
│   └── script.txt          ← Writerが納品する台本
├── assets/
│   ├── audio.wav           ← 経営者がVOICEVOXで作成・配置
│   └── bg.png              ← VideoがAI生成した背景画像
├── output/
│   └── {title}_{YYYYMMDD}.mp4  ← 完成動画（Videoが出力）
├── work/
│   └── whisper_segments.json   ← Whisper解析の中間ファイル（自動生成）
├── make_shorts.py          ← 動画生成スクリプト（コピーして使用）
├── SPEC.md                 ← 仕様書（共通・変更時のみ更新）
└── LOG.md                  ← 作業ログ
```

## 各担当の作業場所

| 担当 | 作業フォルダ | 納品物 |
|------|------------|--------|
| Writer | `inbox/` | `script.txt` |
| 経営者 | `assets/` | `audio.wav`（VOICEVOX出力） |
| Video | `assets/`, `output/` | `bg.png`、完成動画 |
| 経営者 | `output/` を参照 | サムネ作成・YouTubeアップ |
