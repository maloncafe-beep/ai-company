# video 担当 作業ログ

## 2026-08-23

### 勝海舟シリーズ（001〜003）完了・パイプライン移行

**完成成果物**
- `backup/katsu/001/output/katsu-001_20260822.mp4`
- `backup/katsu/002/output/katsu-002_20260823.mp4`
- `backup/katsu/003/output/katsu-003_20260823.mp4`（3分弱・163秒）

**パイプライン移行**
- 旧方式（Python + FFmpeg フレーム逐次生成）→ `backup/katsu/` にアーカイブ
- 新方式：`remotion-practice/shorts-pipeline-v3` に移行
  - Whisper不要：VOICEBOX 1行1WAV → WAV長さ自動計測 → lines-data.json → Remotion render
  - `npm run dev` でレンダリング前にスタジオプレビュー可能
  - `npm run go` で一発完成

**学び**
- Python/FFmpegのWhisper文字起こしは「セグメント数 = script行数」が必須条件 → 複数行音声連結後はズレが生じる
- 根本解決は「1行1WAV→WAV長さ計測→タイムスタンプ生成」でWhisperを排除すること
- Remotionはスタジオでスクラブ確認できるため、失敗→修正のロスタイムが大幅削減される

**次回タスク**
- 勝海舟シリーズ004以降は `shorts-pipeline-v3` で制作
- Instagram/Facebook リール用の新規パイプライン設計（別プロジェクト）
