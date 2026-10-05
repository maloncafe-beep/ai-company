# Royalty Workflow

作成日: 2026-10-01

目的: YouTubeショート/VLOG用BGMを早期から権利収益化の候補として管理する。

## 基本方針

音源を作ってから収益化・印税化まで時間がかかる可能性があるため、制作直後から登録候補として扱える証跡を残す。

運用は2ラインに分ける。

| Line | 目的 |
|---|---|
| VLOG BGM | 自分のYouTubeショート動画や受託ポートフォリオ動画のBGMとして使う |
| Healing BGM | ヘルツ指定のヒーリングBGMを海外向けチャンネルで単体展開する |

## ステータス

| Status | 意味 |
|---|---|
| Reference / Tutorial | 練習、比較、ポートフォリオ内サンプル。本番収益化には原則使わない |
| Production Candidate | Pro Plan中に生成した本番利用候補 |
| Downloaded Candidate | Pro Plan中に公式ダウンロード済み |
| Distribution Candidate | Content ID、音楽配信、権利管理登録の候補 |
| Registered / Released | 登録または配信済み |
| Hold | 権利や品質の理由で保留 |

## 1曲ごとの必須チェック

- Track ID
- Suno URL
- 生成日
- ダウンロード日
- 生成時プラン
- ダウンロード時プラン
- Sunoモデル
- Style全文
- Exclude
- 長さ
- 音源ファイル名
- 使用動画URL
- YouTube公開日
- 登録候補にするか

## YouTube利用時の記録

YouTubeに公開したら `usage_log.csv` に必ず記録する。

記録すること:

- 公開日
- Track ID
- 動画タイトル
- URL
- Monetized
- Content ID / 配信登録候補か
- 備考

## 注意

YouTubeで動画にBGMを使うことと、音楽権利者として印税・Content ID収益を得ることは別の話として管理する。

確認が必要なもの:

- YouTube Partner Program / Shorts収益化条件
- Content IDの参照ファイル要件
- 音楽配信/管理事業者のAI音源・Suno音源の取り扱い
- Sunoの商用利用権
- 著作権登録を行う場合の人間の創作関与

## 当面の運用

`SUNO-000` はチュートリアル曲としてReference扱い。

`SUNO-001` 以降のPro Plan中に生成した曲を本番候補として管理する。

動画BGMとして良かった曲だけを、後からDistribution Candidateに昇格させる。

Healing BGMはVLOG BGMと混ぜず、タイトル、説明文、周波数指定、動画尺、登録候補ステータスを別管理する。

ヘルツ指定の音楽では、医療効果や治療効果を断定しない。海外向けでも、タイトル・説明文では `relaxation`, `meditation`, `sleep`, `focus`, `calm` などの表現を中心にし、病気の治療・改善を保証する表現は避ける。

