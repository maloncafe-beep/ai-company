# SUNO Rights Management

作成日: 2026-10-01

このフォルダは、Sunoで生成した楽曲をYouTube・配信・将来の著作権登録検討に使うための管理場所です。

主目的は、YouTubeショート/VLOG系動画に使える自作BGMと、海外向けヒーリングBGMを管理し、将来的な収益化・権利管理につなげることです。

運用ラインは2つに分けます。

| Line | 用途 | 想定 |
|---|---|---|
| VLOG BGM | YouTubeショート、受託ポートフォリオ、地域紹介、旅VLOG、神社仏閣、花や史跡 | 動画に自然に乗る3分前後のBGM |
| Healing BGM | 海外向けYouTubeチャンネル、ヒーリング/リラックスBGM単体 | ヘルツ指定、長尺化、音楽単体での展開 |

寺院・仏像向けBGMはVLOG BGMの用途例の一つであり、曲名や設計はVLOG全般に使える汎用性を優先します。

## 基本方針

1曲ごとに、音源ファイルだけでなく次の情報を残します。

- 生成日
- 使用サービス
- 使用モデル
- 生成時のSunoプラン
- ダウンロード日
- Style / Exclude / Lyricsの入力内容
- 人間が創作・編集した内容
- 商用利用権の根拠
- YouTubeなどでの利用履歴
- 登録や申請を検討した履歴

## なぜ分けて管理するか

Sunoの公式ヘルプでは、商用利用権と著作権保護は別物として説明されています。Paid subscriptionで作った曲に商用利用権が付く場合でも、それがそのまま著作権登録可能であることを保証するわけではありません。

そのため、このフォルダでは次の3つを分けて記録します。

| 区分 | 記録すること |
|---|---|
| 商用利用権 | Sunoのプラン、生成日、ダウンロード日、規約確認日 |
| 創作関与 | メロディ指定、歌詞、構成、編集、ミックス、動画との組み合わせ |
| 登録・申請 | 文化庁などへの登録検討、申請日、受付番号、結果 |

## 公式情報の確認先

2026-10-01時点で確認した主な参照先:

- Suno Rights & Ownership: https://help.suno.com/en/categories/550145-rights-ownership
- Suno paid subscription rights: https://help.suno.com/en/articles/9601665
- Suno free plan rights: https://help.suno.com/en/articles/9601601
- Suno retroactive rights: https://help.suno.com/en/articles/2425729
- Suno ownership / copyright: https://help.suno.com/en/articles/2746945
- 文化庁 著作権登録制度: https://www.bunka.go.jp/seisaku/chosakuken/seidokaisetsu/toroku_seido/index.html

## 注意

このフォルダは実務管理用です。法的判断そのものは、必要に応じて文化庁の公式情報、専門家、利用先プラットフォームの規約を確認してください。

YouTubeで印税・権利収益を得るには、単に動画にBGMを使うだけでなく、YouTube Partner Program、Content ID、音楽配信/管理事業者などの仕組みが関係します。Content IDに登録する場合は、YouTube公式ヘルプ上でも参照ファイルに対する独占的権利などの条件があるため、Sunoの商用利用権、配信事業者の規約、YouTubeのContent ID要件を分けて確認します。

## 早期に組み込む収益化前提

印税・権利収益の発生まで時間がかかる可能性があるため、BGM制作の初期段階から次の前提で管理します。

- 本番候補はPro Plan中に新規生成する
- Suno公式ダウンロードを行ってから外部利用する
- 曲ごとにSuno URL、生成日、ダウンロード日、Style全文、Exclude、モデル、長さを残す
- 生成時プランが不明またはProではない曲は、収益化本番から外す
- YouTube公開時点で、どの動画にどのTrack IDを使ったか記録する
- Content IDや音楽配信登録に回す候補曲を別管理する

運用上の区分:

| 区分 | 用途 |
|---|---|
| Reference / Tutorial | 練習、比較、ポートフォリオ内サンプル |
| Production Candidate | YouTube公開・収益化候補 |
| Distribution Candidate | Content ID、配信、印税化の候補 |
| Registered / Released | 登録または配信済み |

注意:

YouTubeで公開するだけで必ず音楽印税が発生するとは限りません。YouTube Partner Program、Content ID、音楽配信/管理事業者、各規約の条件を確認し、登録経路を分けて管理します。

## ファイル構成

| ファイル | 用途 |
|---|---|
| `track_rights_inventory.csv` | 全曲の権利・商用利用・登録状況の台帳 |
| `usage_log.csv` | YouTubeやSNSなどでの利用履歴 |
| `registration_log.csv` | 著作権登録や申請検討の履歴 |
| `catalog_strategy.md` | VLOG BGMとHealing BGMの2ライン運用方針 |
| `track_record_template.md` | 1曲ごとの詳細記録テンプレート |
| `tracks/` | 曲ごとの詳細メモ置き場 |
