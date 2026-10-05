# Catalog Strategy

作成日: 2026-10-01

目的: Sunoで作る音源を、VLOG BGMラインとHealing BGMラインに分けて管理する。

## 1. VLOG BGM Line

用途:

- YouTubeショート動画のBGM
- 受託時のポートフォリオ動画
- 地域紹介
- 旅VLOG
- 神社仏閣
- 花、自然、史跡、街歩き

制作方針:

- 3分前後で作る
- 動画尺に合わせて末尾フェードアウト
- 途中ループは避ける
- 映像やテロップを邪魔しない
- ただし短い旋律は記憶に残る
- タイトルは抽象的で汎用性を持たせる

タイトル例:

- Soft Afterglow 01
- Quiet Reverie 01
- Gentle Resonance 01
- Slow Day Piano 01
- Still Morning 01

登録候補にする条件:

- Pro Plan中に生成
- Pro Plan中に公式ダウンロード
- Style / Exclude / モデル / URL / 生成日を記録済み
- 実際の動画で使って違和感がない
- 似た曲との差別化ができている

## 2. Healing BGM Line

用途:

- 海外向けYouTubeチャンネル
- ヒーリングBGM単体
- meditation / sleep / relaxation / focus 系
- ヘルツ指定の音楽

制作方針:

- VLOG用より長尺展開を意識する
- 必要に応じてループ編集や長時間動画化を行う
- 周波数指定をメモする
- 音楽単体で聴けるように、映像なしでも成立する余韻を作る
- タイトル、説明文、タグは英語前提で管理する

ヘルツ指定の管理項目:

- Target frequency
- Purpose wording
- Audio design
- Length
- Loop / fade setting
- Export format
- YouTube title
- YouTube description
- Registration candidate status

表現ルール:

- 医療効果を断定しない
- 病気の治療、改善、完治を約束しない
- `for relaxation`, `for meditation`, `calming atmosphere`, `sleep ambience` のような表現を使う
- `cures`, `heals disease`, `treats anxiety`, `guaranteed effect` のような表現は避ける

タイトル例:

- 432Hz Calm Piano for Deep Relaxation
- 528Hz Soft Ambient Piano for Meditation
- 396Hz Peaceful Healing Music for Sleep
- 741Hz Gentle Piano Ambience for Focus

登録候補にする条件:

- Pro Plan中に生成
- 公式ダウンロード済み
- ヘルツ指定と制作意図を記録
- 長尺化・ループ・フェード編集を記録
- 海外向けタイトル/説明文を保存
- Content IDや配信事業者に出せる権利状態か確認

## 3. 共通注意

YouTubeに公開することと、音楽権利者として印税・Content ID収益を得ることは別に管理する。

YouTube公式ヘルプ上、Content IDは十分な権利を持つ参照ファイルであることが必要。誤った申し立てや不適切な参照登録は問題になる可能性がある。

YouTubeのチャンネル収益化では、反復的・量産的に見えるコンテンツにも注意する。特にHealing BGMラインは、同じ背景・似た音源の量産に見えないように、音源設計、映像、説明文、シリーズ性を分けて作る。

## 4. Track IDの付け方

| Prefix | Line |
|---|---|
| SUNO-VLOG-001 | VLOG BGM |
| SUNO-HEAL-001 | Healing BGM |

既存の `SUNO-000` から `SUNO-002` は初期管理用として残す。次に正式運用へ入るときから、ライン別IDに切り替える。

