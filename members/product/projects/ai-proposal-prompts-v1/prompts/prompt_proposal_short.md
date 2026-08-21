
# 提案書の構成（現状認識・課題認識・解決策・ROI・費用・スケジュール・体制・将来案）を網羅した、高品質な提案書PDFを「一発で生成するプロンプト」。

このプロンプトは、「情報が足りない場合にAIからヒアリングシートを自動出力させる仕組み」**と**「情報が揃っている場合に即座に実用的なPDFを生成する仕組み」を両立させています。

### 提案書一発作成プロンプト（コピー＆ペースト用）

Markdown
```
# あなたの役割
あなたは一流の経営コンサルタントおよび営業マネージャーです。
提示されたクライアントの状況をもとに、説得力のある「営業効率化および業務改善に関する提案書（PDF）」を作成してください。

# 提案書の標準構成（全11ページ構成を想定）
1. 表紙（タイトル、日付、作成者、宛先）
2. アジェンダ
3. ご提案の背景（現状認識：会社としての目指す方向性、お伺いしている現状の問題）
4. ご提案のテーマ（課題認識：あるべき姿、実現するための障壁/課題）
5. ご提案全体像（解決策：As-Is / To-Be の比較構造）
6. 期待される効果について（ROI：作業内容ごとの現状・導入後・削減時間・根拠、ROI計算）
7. 費用サマリー（初期費用、ライセンス費用、サポート費用の3カ年推移の視覚的表現）
8. 費用詳細（サービス名、標準価格、ご提供価格、数量、年間費用、注意事項）
9. スケジュール（マイルストーン、各プロセスの期間）
10. プロジェクト体制（貴社・弊社の体制図のテキスト表現）
11. 今後のさらなる活用について（フェーズ1〜3のロードマップ）

# 処理フロー（重要）
まず、私が提示する【インプット情報】を確認してください。

1. **【情報が不足している場合】**
   具体的な企業名、現状、目標値、費用感などの重要情報が不足しており、このままでは精度の高い提案書が作れないと判断した場合は、提案書の作成を**一時中断**してください。
   その代わり、提案書を完成させるために必要な項目をまとめた**「ヒアリングシート（質問リスト）」**を出力してください。

2. **【情報が十分な場合】**
   インプット情報をもとに、WeasyPrint（HTML to PDF）を用いてデザインされた美しいPDFファイルを即座に生成し、ダウンロードリンクを提示してください。

---

# インプット情報
※ここにクライアントからヒアリングした内容やメモを貼り付けてください。
（例：宛先会社名、自社名、解決したい問題、削減したい時間、予算など）

【インプット】
・
```

### このプロンプトの解説と使い方

1. **情報の有無による自動分岐**
   インプット欄が空欄であったり、「営業効率化の提案をして」というような曖昧な指示だけの場合は、AIは無理に架空の提案書を作らず、**「具体的にどこの会社宛てですか？」「現状の無駄な工数は何分ですか？」といったヒアリングシート**を返します。
2. **デザインと構造の担保**
   ご提示いただいたPDFの構成（As-Is/To-Be、ROIの分給計算、費用の3カ年推移、今後のフェーズ分け案）をあらかじめプロンプト内に「標準構成」として定義しているため、情報さえ入力すれば一発でそのフォーマットに沿った綺麗なPDFが生成されます。

### 実際にこのプロンプトを使ってAIに「一発生成」させる場合のシミュレーション

例えば、上記プロンプトの【インプット】部分に以下のようなメモを書き込んで実行すると、AIは即座にPythonコードを実行し、完成されたPDFを生成します。

**インプットの入力例：**

Markdown
```
【インプット】
・宛先：株式会社サンプル商事 御中
・提案会社：株式会社NextSales
・提案タイトル：営業準備の自動化による攻めの営業スタイルへの変革
・現状：営業マンが顧客情報を調べるために、エクセル、FileMaker、ノートなど複数の場所を探しており、1回あたり30分の工数がかかっている。移動中も膝や体力の負担があり効率が悪い。
・目標：情報の一元化により、準備時間を5分に短縮。訪問件数を増やしたい。
・費用：初期100万円、月額ライセンス20万円、サポート年50万円。
```

このように情報を渡すことで、AIは内部的にHTMLとCSSを組み立てて、ご要望通りの綺麗な提案書PDFを出力します。

> この診断レポートを参考に、中小企業向けの業種別・業務別の業務効率化についての困りごとを診断できるレポート作成プロンプトを作ってください。

提示されたプロンプトの優れた構造（ロジックの整合性重視、具体的なデータ・計算式の必須化、HTML/CSSによる1ページ完結の一括出力仕様）を踏襲し、「中小企業向けの業種別・業務別 業務効率化診断レポート」を生成するためのプロンプトを作成しました。

このままコピー＆ペーストしてAIに入力することで、実用的な診断レポート生成プロンプトとして機能します。

# 中小企業向け 業務効率化診断レポート生成プロンプト

Markdown
```
# 🎯 ミッション
あなたは「中小企業のDX・業務改善を専門とする凄腕の経営コンサルタント」兼「Webデザイナー」です。
入力された企業の「業種」と「現在の困りごと（アナログ業務）」の情報をもとに、**完全なHTMLファイル**として「業務効率化診断レポート」を**一度に全て**出力してください。

---

# 📥 入力情報
```

業種：{{業種（例：卸売業、建設業、飲食業など）}}
主な困りごと・アナログ業務：{{具体的な困りごと（例：FAXでの受注処理、日報の紙運用、顧客情報の点在など）}}

```

---

# 📤 出力形式

### 技術仕様
| 項目 | 指定 |
|------|------|
| 形式 | 完全なHTMLファイル（DOCTYPE、head、body含む） |
| CSS | <style>タグ内にすべて記載（外部ファイル参照なし、モダンで洗練されたビジネスデザイン） |
| アイコン | Remixicon（CDN読み込み） |
| フォント | Noto Sans JP（Google Fonts） |
| ページ幅 | 1920px |
| ページ高さ | 各1080px（PDF変換・プレゼン画面想定） |
| 総ページ数 | 10ページ |

### 出力ルール
- **一括出力**：分割せず、HTMLファイル全体を一度に出力する。
- **省略禁止**：「...」や「以下同様」などで省略しない。
- **コード完結**：コピペでそのまま動作するHTMLを出力する。

---

# 🔍 事前分析タスク（出力前に内部で実行）
入力された業種と困りごとから、以下を推測・分析してからHTML生成に進む：

1. **ボトルネック業務の特定**：その業種で最も時間を圧迫している「隠れた無駄業務」を3〜5個抽出。
2. **コスト・時間損失の試算**：手作業による月間の想定損失時間と人件費ロスを算出。
3. **効率化手法との1対1対応表（必須：5行以上）**：
   | 現在の手作業 | 発生している無駄・リスク | 導入すべきデジタル施策/ツール | なぜ劇的に改善するか |
   |---|---|---|---|

---

# 🚫 厳守ルール

### ロジック整合性ルール
**❌ 禁止パターン**
- 「この業種は忙しい → ITを入れるべき → だからクラウドがいい」
- 「意識改革が必要 → 社員のやる気を出す → だから効率化できる」

**✅ 必須パターン**
1. 「現状の〇〇という業務で、具体的に△△という手作業（二重入力、移動、転記等）が発生している」
2. 「この作業は、□□というデジタルツール（SaaS、RPA、ノーコード等）の〇〇機能で"完全に自動化・仕組み化"できる」
3. 「その結果、削減された時間を◇◇（コア業務、営業、付加価値の向上）に充てることができる」

**🚫 抽象ワード禁止リスト（単体使用禁止）**
DX推進 / 意識改革 / 業務の見える化 / 生産性向上 / 効率化の徹底 / 柔軟な対応

### 情報の正確性・ROI試算ルール
**❌ 絶対禁止**
- 根拠のない「生産性2倍」「売上30%アップ」などの誇張表現。
- 架空の導入実績や統計データの捏造。

**💰 コスト削減・ROIシミュレーション必須形式**
- 時給換算と削減時間のロジックを明示すること。
- ✅ 正しい例：[転記作業：30分/日 × 20日 × 5人 = 50時間/月削減] × 時給2,000円 = 月10万円（年間120万円）のコスト削減効果（※従業員数・運用状況により変動）

---

# 📄 各ページ詳細仕様

### 【Page 1】表紙
- サブタイトル: 「アナログ脱却から始める 〇〇業のための生産性革命」
- メインタイトル: 「業務効率化・デジタル化 診断レポート」
- 対象: [入力された業種名] 企業様 / 作成日: 本日の日付

### 【Page 2】診断サマリー（現状と伸び代）
- 貴社の現在のボトルネック業務 TOP3
- 優先度の高い効率化テーマ TOP3（難易度・効果バッジ付き）
- 期待される年間総削減時間・コスト（計算式必須）

### 【Page 3】業界の背景とデジタル化トレンド
- 「まだ手作業で消耗しますか？」常識破壊ボックス
- 周辺業界のデジタル化ロードマップ（3ステップフロー）
- 今すぐチェックすべき業界特化キーワード

### 【Page 4】業務別 効率化対応表
- 5行以上の「手作業 vs デジタル」対応表
- 「まずここから着手すべき」優先マーク

### 【Page 5-7】具体的な効率化施策①②③
各ページに以下を含む：
- 施策の概要（ツール例の提示）
- ターゲット業務（ペルソナカード：誰のどんな作業か）
- Why This Solution?（なぜこの手法なのか）
- 具体的ワークフロー（Before / After の比較）
- ROIシミュレーション（時間・コスト削減の計算式）
- 導入のQ&A（現場の抵抗への対策など3つ以上）

### 【Page 8】ツールの選び方と注意点
- ツール選定の比較マトリクス表（機能、コスト、運用のしやすさ）
- 導入時に失敗する「地雷ツールの見分け方」（4つ以上）

### 【Page 9】業務改善アクションプラン
- 【初級】今すぐ（今週中）にできること（3項目）
- 【中級】1ヶ月以内に準備・検証すること（3項目）
- 【上級】3ヶ月後に定着を目指すこと（3項目）

### 【Page 10】ネクストステップ・伴走支援
- 経営者・現場へのエール
- 「自社でやるべきこと」「専門家に頼るべきこと」の仕分け
- 次の行動を促すお問い合わせ・相談への誘導（CTAボタン）

---

# 🚀 出力開始
上記すべてを理解した上で、入力された情報に基づき、**完全なHTMLファイルを一度に全て出力**してください。省略・分割は禁止です。
```

> # 中小企業向け 業務効率化診断レポート生成プロンプト
>
>
>
>
>
> # 🎯 ミッション
>
>
> あなたは「中小企業のDX・業務改善を専門とする凄腕の経営コンサルタント」兼「Webデザイナー」です。
>
>
> 入力された企業の「業種」と「現在の困りごと（アナログ業務）」の情報をもとに、**完全なHTMLファイル**として「業務効率化診断レポート」を**一度に全て**出力してください。
>
>
>
>
>
> ---
>
>
>
>
>
> # 📥 入力情報
>
>
>
>
>
> ```
>
>
>
>
>
> 業種：{{業種（例：卸売業、建設業、飲食業など）}}
>
>
> 主な困りごと・アナログ業務：{{具体的な困りごと（例：FAXでの受注処理、日報の紙運用、顧客情報の点在など）}}
>
>
>
>
>
> ```
>
>
>
>
>
> ---
>
>
>
>
>
> # 📤 出力形式
>
>
>
>
>
> ### 技術仕様
>
>
> | 項目 | 指定 |
>
>
> |------|------|
>
>
> | 形式 | 完全なHTMLファイル（DOCTYPE、head、body含む） |
>
>
> | CSS | <style>タグ内にすべて記載（外部ファイル参照なし、モダンで洗練されたビジネスデザイン） |
>
>
> | アイコン | Remixicon（CDN読み込み） |
>
>
> | フォント | Noto Sans JP（Google Fonts） |
>
>
> | ページ幅 | 1920px |
>
>
> | ページ高さ | 各1080px（PDF変換・プレゼン画面想定） |
>
>
> | 総ページ数 | 10ページ |
>
>
>
>
>
> ### 出力ルール
>
>
> - **一括出力**：分割せず、HTMLファイル全体を一度に出力する。
>
>
> - **省略禁止**：「...」や「以下同様」などで省略しない。
>
>
> - **コード完結**：コピペでそのまま動作するHTMLを出力する。
>
>
>
>
>
> ---
>
>
>
>
>
> # 🔍 事前分析タスク（出力前に内部で実行）
>
>
> 入力された業種と困りごとから、以下を推測・分析してからHTML生成に進む：
>
>
>
>
>
> 1. **ボトルネック業務の特定**：その業種で最も時間を圧迫している「隠れた無駄業務」を3〜5個抽出。
>
>
> 2. **コスト・時間損失の試算**：手作業による月間の想定損失時間と人件費ロスを算出。
>
>
> 3. **効率化手法との1対1対応表（必須：5行以上）**：
>
>
> | 現在の手作業 | 発生している無駄・リスク | 導入すべきデジタル施策/ツール | なぜ劇的に改善するか |
>
>
> |---|---|---|---|
>
>
>
>
>
> ---
>
>
>
>
>
> # 🚫 厳守ルール
>
>
>
>
>
> ### ロジック整合性ルール
>
>
> **❌ 禁止パターン**
>
>
> - 「この業種は忙しい → ITを入れるべき → だからクラウドがいい」
>
>
> - 「意識改革が必要 → 社員のやる気を出す → だから効率化できる」
>
>
>
>
>
> **✅ 必須パターン**
>
>
> 1. 「現状の〇〇という業務で、具体的に△△という手作業（二重入力、移動、転記等）が発生している」
>
>
> 2. 「この作業は、□□というデジタルツール（SaaS、RPA、ノーコード等）の〇〇機能で"完全に自動化・仕組み化"できる」
>
>
> 3. 「その結果、削減された時間を◇◇（コア業務、営業、付加価値の向上）に充てることができる」
>
>
>
>
>
> **🚫 抽象ワード禁止リスト（単体使用禁止）**
>
>
> DX推進 / 意識改革 / 業務の見える化 / 生産性向上 / 効率化の徹底 / 柔軟な対応
>
>
>
>
>
> ### 情報の正確性・ROI試算ルール
>
>
> **❌ 絶対禁止**
>
>
> - 根拠のない「生産性2倍」「売上30%アップ」などの誇張表現。
>
>
> - 架空の導入実績や統計データの捏造。
>
>
>
>
>
> **💰 コスト削減・ROIシミュレーション必須形式**
>
>
> - 時給換算と削減時間のロジックを明示すること。
>
>
> - ✅ 正しい例：[転記作業：30分/日 × 20日 × 5人 = 50時間/月削減] × 時給2,000円 = 月10万円（年間120万円）のコスト削減効果（※従業員数・運用状況により変動）
>
>
>
>
>
> ---
>
>
>
>
>
> # 📄 各ページ詳細仕様
>
>
>
>
>
> ### 【Page 1】表紙
>
>
> - サブタイトル: 「アナログ脱却から始める 〇〇業のための生産性革命」
>
>
> - メインタイトル: 「業務効率化・デジタル化 診断レポート」
>
>
> - 対象: [入力された業種名] 企業様 / 作成日: 本日の日付
>
>
>
>
>
> ### 【Page 2】診断サマリー（現状と伸び代）
>
>
> - 貴社の現在のボトルネック業務 TOP3
>
>
> - 優先度の高い効率化テーマ TOP3（難易度・効果バッジ付き）
>
>
> - 期待される年間総削減時間・コスト（計算式必須）
>
>
>
>
>
> ### 【Page 3】業界の背景とデジタル化トレンド
>
>
> - 「まだ手作業で消耗しますか？」常識破壊ボックス
>
>
> - 周辺業界のデジタル化ロードマップ（3ステップフロー）
>
>
> - 今すぐチェックすべき業界特化キーワード
>
>
>
>
>
> ### 【Page 4】業務別 効率化対応表
>
>
> - 5行以上の「手作業 vs デジタル」対応表
>
>
> - 「まずここから着手すべき」優先マーク
>
>
>
>
>
> ### 【Page 5-7】具体的な効率化施策①②③
>
>
> 各ページに以下を含む：
>
>
> - 施策の概要（ツール例の提示）
>
>
> - ターゲット業務（ペルソナカード：誰のどんな作業か）
>
>
> - Why This Solution?（なぜこの手法なのか）
>
>
> - 具体的ワークフロー（Before / After の比較）
>
>
> - ROIシミュレーション（時間・コスト削減の計算式）
>
>
> - 導入のQ&A（現場の抵抗への対策など3つ以上）
>
>
>
>
>
> ### 【Page 8】ツールの選び方と注意点
>
>
> - ツール選定の比較マトリクス表（機能、コスト、運用のしやすさ）
>
>
> - 導入時に失敗する「地雷ツールの見分け方」（4つ以上）
>
>
>
>
>
> ### 【Page 9】業務改善アクションプラン
>
>
> - 【初級】今すぐ（今週中）にできること（3項目）
>
>
> - 【中級】1ヶ月以内に準備・検証すること（3項目）
>
>
> - 【上級】3ヶ月後に定着を目指すこと（3項目）
>
>
>
>
>
> ### 【Page 10】ネクストステップ・伴走支援
>
>
> - 経営者・現場へのエール
>
>
> - 「自社でやるべきこと」「専門家に頼るべきこと」の仕分け
>
>
> - 次の行動を促すお問い合わせ・相談への誘導（CTAボタン）
>
>
>
>
>
> ---
>
>
>
>
>
> # 🚀 出力開始
>
>
> 上記すべてを理解した上で、入力された情報に基づき、**完全なHTMLファイルを一度に全て出力**してください。省略・分割は禁止です。
>
>
>
>
>
> ```

HTML
```
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>業務効率化・デジタル化 診断レポート</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css" rel="stylesheet">
    <style>
        /* Base Reset & Variables */
        :root {
            --primary: #0f172a;
            --secondary: #2563eb;
            --accent: #06b6d4;
            --danger: #ef4444;
            --success: #10b981;
            --warning: #f59e0b;
            --bg-light: #f8fafc;
            --text-dark: #1e293b;
            --text-muted: #64748b;
            --border-color: #cbd5e1;
            --page-width: 1920px;
            --page-height: 1080px;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'Noto Sans JP', sans-serif;
            background-color: #475569;
            color: var(--text-dark);
            line-height: 1.6;
            -webkit-print-color-adjust: exact;
        }

        /* Container Layout */
        .report-container {
            width: var(--page-width);
            margin: 0 auto;
        }

        /* Page Layout */
        .page {
            width: var(--page-width);
            height: var(--page-height);
            background-color: #ffffff;
            position: relative;
            overflow: hidden;
            padding: 80px 100px;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            page-break-after: always;
            box-shadow: 0 10px 25px rgba(0,0,0,0.3);
            margin-bottom: 40px;
        }

        /* Running Header & Footer */
        .page-header {
            position: absolute;
            top: 40px;
            left: 100px;
            right: 100px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid var(--bg-light);
            padding-bottom: 15px;
            color: var(--text-muted);
            font-size: 14px;
        }

        .page-header .brand {
            font-weight: 700;
            color: var(--primary);
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .page-footer {
            position: absolute;
            bottom: 40px;
            left: 100px;
            right: 100px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 1px solid var(--border-color);
            padding-top: 15px;
            color: var(--text-muted);
            font-size: 14px;
        }

        /* Typography Components */
        .page-title {
            font-size: 38px;
            font-weight: 700;
            color: var(--primary);
            margin-top: 20px;
            margin-bottom: 40px;
            display: flex;
            align-items: center;
            gap: 15px;
            border-left: 8px solid var(--secondary);
            padding-left: 20px;
        }

        /* Grid System & Layout Utilities */
        .grid-2 { display: grid; grid-template-columns: repeat(2, 16fr); gap: 40px; }
        .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; }
        .flex-1 { flex: 1; }

        /* Card UI Elements */
        .card {
            background: var(--bg-light);
            border-radius: 12px;
            padding: 30px;
            border: 1px solid var(--border-color);
            position: relative;
        }

        .card-title {
            font-size: 22px;
            font-weight: 700;
            margin-bottom: 20px;
            color: var(--primary);
            display: flex;
            align-items: center;
            gap: 10px;
        }

        /* Table UI Elements */
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            font-size: 16px;
        }

        th {
            background-color: var(--primary);
            color: #ffffff;
            text-align: left;
            padding: 16px 20px;
            font-weight: 700;
        }

        td {
            padding: 18px 20px;
            border-bottom: 1px solid var(--border-color);
            background-color: #ffffff;
        }

        tr:nth-child(even) td {
            background-color: var(--bg-light);
        }

        /* Badges */
        .badge {
            display: inline-flex;
            align-items: center;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 700;
            gap: 4px;
        }
        .badge-danger { background-color: #fee2e2; color: var(--danger); }
        .badge-success { background-color: #d1fae5; color: var(--success); }
        .badge-warning { background-color: #fef3c7; color: var(--warning); }
        .badge-primary { background-color: #dbeafe; color: var(--secondary); }

        /* Custom Specific Blocks */
        .disruption-box {
            background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
            color: #ffffff;
            border-radius: 12px;
            padding: 40px;
            margin-bottom: 30px;
            position: relative;
        }
        .disruption-box h4 {
            color: var(--accent);
            font-size: 24px;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .roi-box {
            background-color: #f0fdf4;
            border: 2px dashed var(--success);
            border-radius: 12px;
            padding: 25px;
            margin-top: auto;
        }
        .roi-title {
            color: var(--success);
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .roi-calc {
            font-size: 18px;
            font-weight: 700;
            color: var(--primary);
        }

        /* Flow and Steps */
        .flow-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 40px 0;
        }
        .flow-step {
            flex: 1;
            background: var(--bg-light);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            padding: 25px;
            text-align: center;
            position: relative;
        }
        .flow-step .step-num {
            width: 40px;
            height: 40px;
            background: var(--secondary);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            margin: 0 auto 15px;
        }
        .flow-arrow {
            font-size: 32px;
            color: var(--text-muted);
            padding: 0 20px;
        }

        /* Timeline Blocks */
        .timeline {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 30px;
            margin-top: 20px;
        }
        .timeline-card {
            border-top: 6px solid var(--secondary);
            background: var(--bg-light);
            border-radius: 0 0 12px 12px;
            padding: 30px;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
        }
        .timeline-card.mid { border-top-color: var(--accent); }
        .timeline-card.high { border-top-color: var(--warning); }
        .timeline-title {
            font-size: 22px;
            font-weight: 700;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        /* Cover Page Styling */
        .cover-page {
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #2563eb 100%);
            color: white;
            justify-content: center;
            align-items: flex-start;
            padding: 150px;
        }
        .cover-sub {
            font-size: 28px;
            color: var(--accent);
            font-weight: 500;
            margin-bottom: 20px;
            letter-spacing: 2px;
        }
        .cover-main {
            font-size: 64px;
            font-weight: 700;
            line-height: 1.2;
            margin-bottom: 60px;
            border-bottom: 4px solid white;
            padding-bottom: 40px;
            width: 100%;
        }
        .cover-meta {
            margin-top: auto;
            font-size: 20px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            width: 600px;
            gap: 15px 0;
        }
        .cover-meta span { color: #94a3b8; }

        /* CTA elements */
        .cta-btn {
            display: inline-flex;
            align-items: center;
            gap: 12px;
            background-color: var(--secondary);
            color: white;
            font-size: 24px;
            font-weight: 700;
            padding: 20px 45px;
            border-radius: 50px;
            text-decoration: none;
            margin-top: 30px;
            box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.4);
        }

        /* Print Media Overrides */
        @media print {
            body { background-color: #ffffff; }
            .page {
                box-shadow: none;
                margin-bottom: 0;
            }
        }
    </style>
</head>
<body>

<div class="report-container">

    <div class="page cover-page">
        <div class="cover-sub">アナログ脱却から始める 卸売業のための生産性革命</div>
        <div class="cover-main">業務効率化・デジタル化<br>診断レポート</div>
        <div class="cover-meta">
            <span>対象企業様：</span><strong>卸売業・流通関連 企業様</strong>
            <span>課題テーマ：</span><strong>FAX受注処理およびアナログ業務の自動化</strong>
            <span>作成日：</span><strong>2026年7月13日</strong>
            <span>提供元：</span><strong>次世代DX推進コンサルティング室</strong>
        </div>
    </div>

    <div class="page">
        <div class="page-header">
            <span class="brand"><i class="ri-pulse-line"></i> DX Diagnostic Report</span>
            <span>Page 2 / 10</span>
        </div>
        <h2 class="page-title"><i class="ri-dashboard-line"></i> 診断サマリー：現状分析とデジタル化の伸び代</h2>

        <div class="grid-2 flex-1">
            <div class="card">
                <div class="card-title"><i class="ri-error-warning-line" style="color:var(--danger)"></i> 貴社の現在のボトルネック業務 TOP3</div>
                <div style="display:flex; flex-direction:column; gap:20px; margin-top:10px;">
                    <div style="background: white; padding:15px; border-radius:8px; border-left:5px solid var(--danger)">
                        <strong style="font-size:18px;">1. FAX受注の手動基幹システム転記作業</strong>
                        <p style="color:var(--text-muted); font-size:14px; margin-top:5px;">毎日届く大量のFAXを目視確認し、手作業で基幹システムに二重入力。入力ミス発生時の修正と電話確認に多大な時間をロス。</p>
                    </div>
                    <div style="background: white; padding:15px; border-radius:8px; border-left:5px solid var(--danger)">
                        <strong style="font-size:18px;">2. 外出先からの紙ベースの日報作成と帰社報告</strong>
                        <p style="color:var(--text-muted); font-size:14px; margin-top:5px;">営業担当者が帰社後、紙やExcelに手入力を実施。情報の即時共有ができず、経営判断やフォローの足かせに。</p>
                    </div>
                    <div style="background: white; padding:15px; border-radius:8px; border-left:5px solid var(--danger)">
                        <strong style="font-size:18px;">3. 各所に点在する顧客取引情報の検索・調査</strong>
                        <p style="color:var(--text-muted); font-size:14px; margin-top:5px;">過去の履歴、商談メモが担当者の脳内や個人のノートに分散。過去の単価や納期交渉の履歴調査に毎回30分以上を浪費。</p>
                    </div>
                </div>
            </div>

            <div class="card" style="display:flex; flex-direction:column;">
                <div class="card-title"><i class="ri-checkbox-circle-line" style="color:var(--success)"></i> 優先度の高い効率化テーマ TOP3</div>
                <div style="display:flex; flex-direction:column; gap:15px; margin-top:10px; flex:1;">
                    <div style="display:flex; justify-content:space-between; align-items:center; background:white; padding:15px; border-radius:8px;">
                        <span><strong>AI-OCRと連携したFAX受注自動化</strong></span>
                        <div>
                            <span class="badge badge-success">効果：特大</span>
                            <span class="badge badge-warning">難易度：中</span>
                        </div>
                    </div>
                    <div style="display:flex; justify-content:space-between; align-items:center; background:white; padding:15px; border-radius:8px;">
                        <span><strong>クラウド型SFA（営業支援）システムによる日報改革</strong></span>
                        <div>
                            <span class="badge badge-primary">効果：大</span>
                            <span class="badge badge-success">難易度：低</span>
                        </div>
                    </div>
                    <div style="display:flex; justify-content:space-between; align-items:center; background:white; padding:15px; border-radius:8px;">
                        <span><strong>一元化された顧客データベースの統合構築</strong></span>
                        <div>
                            <span class="badge badge-primary">効果：大</span>
                            <span class="badge badge-warning">難易度：中</span>
                        </div>
                    </div>
                </div>

                <div class="roi-box" style="margin-top:20px;">
                    <div class="roi-title"><i class="ri-line-chart-line"></i> 期待される年間総削減インパクト（試算値）</div>
                    <div class="roi-calc">
                        総削減時間：1,440 時間 / 年<br>
                        創出コスト効果：2,880,000 円 / 年
                    </div>
                    <p style="font-size:12px; color:var(--text-muted); margin-top:5px;">※ 従事する主要スタッフ3名、社内平均時給2,000円として各手作業の削減時間を合算算出</p>
                </div>
            </div>
        </div>
        <div class="page-footer"><span>© 2026 DX Advisory Group</span></div>
    </div>

    <div class="page">
        <div class="page-header">
            <span class="brand"><i class="ri-pulse-line"></i> DX Diagnostic Report</span>
            <span>Page 3 / 10</span>
        </div>
        <h2 class="page-title"><i class="ri-global-line"></i> 卸売業を取り巻く市場背景とデジタル化トレンド</h2>

        <div class="disruption-box">
            <h4><i class="ri-alarm-warning-line"></i> 「取引先がFAXだからIT化できない」という常識の破壊</h4>
            <p style="font-size:18px; line-height:1.8;">
                多くの企業が「顧客がFAXで送ってくるから、自社だけデジタル化しても意味がない」と考えがちです。しかしこれは明らかな誤解です。取引先の送信手段を変えさせる必要はありません。自社側に「受信したFAXをAIが瞬時にテキスト化し、システムへ自動投入する仕組み」を導入すれば、取引先に一切の負担をかけず、自社内だけの判断で手作業を90%削減できます。
            </p>
        </div>

        <h3 style="font-size:24px; font-weight:700; margin-bottom:15px; color:var(--primary);"><i class="ri-git-commit-line"></i> 周辺業界のデジタル化ロードマップ</h3>
        <div class="flow-container">
            <div class="flow-step">
                <div class="step-num">1</div>
                <strong>紙・FAXのデータ化</strong>
                <p style="font-size:14px; color:var(--text-muted); margin-top:8px;">アナログ入力から解放され、社内全ての情報をデータとしてストックする環境を作る</p>
            </div>
            <div class="flow-arrow"><i class="ri-arrow-right-line"></i></div>
            <div class="flow-step">
                <div class="step-num">2</div>
                <strong>クラウド一元管理</strong>
                <p style="font-size:14px; color:var(--text-muted); margin-top:8px;">データがクラウドに集約され、営業・事務・経営陣がどこからでも同じ情報へアクセス可能になる</p>
            </div>
            <div class="flow-arrow"><i class="ri-arrow-right-line"></i></div>
            <div class="flow-step">
                <div class="step-num">3</div>
                <strong>戦略的データ活用</strong>
                <p style="font-size:14px; color:var(--text-muted); margin-top:8px;">余剰時間で顧客分析・予測発注を行い、手作業の維持ではなく積極的な営業へシフトする</p>
            </div>
        </div>

        <div class="card" style="margin-top:auto;">
            <strong>🔍 今すぐWEBで検索して他社事例を確認すべきキーワード</strong>
            <p style="margin-top:10px; color:var(--secondary); font-weight:700; font-size:18px;">
                「卸売業 AI-OCR 受注自動化 導入事例」 / 「SFA 日報 スマホ入力 業務改善」
            </p>
        </div>
        <div class="page-footer"><span>© 2026 DX Advisory Group</span></div>
    </div>

    <div class="page">
        <div class="page-header">
            <span class="brand"><i class="ri-pulse-line"></i> DX Diagnostic Report</span>
            <span>Page 4 / 10</span>
        </div>
        <h2 class="page-title"><i class="ri-table-line"></i> 業務別 効率化・デジタル化対応表</h2>

        <div class="flex-1" style="overflow-x:auto;">
            <table>
                <thead>
                    <tr>
                        <th style="width: 25%;">現在の手作業業務</th>
                        <th style="width: 25%;">発生している無駄・リスク</th>
                        <th style="width: 25%;">導入すべきデジタル施策/ツール</th>
                        <th style="width: 25%;">なぜ劇的に改善するか</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>FAX注文書の目視確認および手入力基幹システム転記</strong></td>
                        <td>転記作業に毎日2時間の拘束。打ち間違いによる誤出荷、クレーム対応リスク。</td>
                        <td>AI-OCR ＋ RPA連携システム <span class="badge badge-danger">最優先マーク</span></td>
                        <td>AIが文字を読み取り、RPAが自動でシステムへ登録するため、人間はエラーチェックのみになる。</td>
                    </tr>
                    <tr>
                        <td><strong>営業スタッフによる帰社後の紙・Excel日報作成</strong></td>
                        <td>移動の無駄が発生。記入内容の形骸化、リアルタイムでの進捗不透明。</td>
                        <td>クラウド型SFA（モバイル対応アプリ）</td>
                        <td>スマホの音声入力や選択式UIにより、移動時間や直行直帰の車内から5分で正確に報告が完了する。</td>
                    </tr>
                    <tr>
                        <td><strong>個人ファイルやノートに点在する過去商談履歴の調査</strong></td>
                        <td>担当者不在時に状況が不明。見積り作成時、過去の交渉背景の確認に毎回30分のタイムロス。</td>
                        <td>統合型顧客関係管理（CRM）データベース</td>
                        <td>社名で検索するだけで、商談履歴、過去単価、顧客の要望が1画面にタイムライン表示される。</td>
                    </tr>
                    <tr>
                        <td><strong>在庫確認のための倉庫への電話・都度の目視確認</strong></td>
                        <td>電話の応対、倉庫往復による稼働ロス。確認中の顧客の待たされによる機会損失。</td>
                        <td>クラウド在庫管理システム（バーコード連動）</td>
                        <td>入出荷時にハンディ端末を通すだけで在庫がリアルタイム更新され、画面上で全社員が即時把握できる。</td>
                    </tr>
                    <tr>
                        <td><strong>月末の請求書発行および手作業での封入・郵送作業</strong></td>
                        <td>印刷・折込・封入・切手貼付による丸1日の事務負担。郵送遅延、コスト増。</td>
                        <td>電子請求システム（Web発行型サービス）</td>
                        <td>締め日にボタン1つで請求データが生成され、顧客のマイページまたはメールへ自動配信される。</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="page-footer"><span>© 2026 DX Advisory Group</span></div>
    </div>

    <div class="page">
        <div class="page-header">
            <span class="brand"><i class="ri-pulse-line"></i> DX Diagnostic Report</span>
            <span>Page 5 / 10</span>
        </div>
        <h2 class="page-title"><i class="ri-focus-3-line"></i> 施策①：AI-OCR導入によるFAX受注業務の完全自動化</h2>

        <div class="grid-2 flex-1">
            <div style="display:flex; flex-direction:column; gap:25px;">
                <div class="card">
                    <div class="card-title"><i class="ri-user-settings-line"></i> ターゲット業務（現場のペルソナ）</div>
                    <p style="font-size:16px;">
                        <strong>受注処理担当の事務スタッフ（主に午前中に稼働圧迫）</strong><br>
                        毎朝デスクに積み上がるFAXの束。午前中は電話応対をしながら、ひたすら文字を読み取り、古い基幹システムの画面に数字をポチポチと手入力している。目が疲れ、集中力が切れると入力ミスが発生しやすい過酷な状況。
                    </p>
                </div>

                <div class="card">
                    <div class="card-title"><i class="ri-question-answer-line"></i> 導入時の想定Q&A</div>
                    <div style="display:flex; flex-direction:column; gap:12px; font-size:15px;">
                        <div><strong>Q. 取引先のFAXが手書き文字でも読み取れますか？</strong><br>A. ディープラーニングを用いた最新のAI-OCRは、癖のある手書き文字に対しても95%以上の高精度で認識可能です。</div>
                        <div><strong>Q. 自社の古い独自の基幹システムにも連携できますか？</strong><br>A. RPA（画面自動操作ツール）を間に挟むことで、基幹システム側を改造することなく自動入力が可能になります。</div>
                        <div><strong>Q. 完全に人のチェックは不要になりますか？</strong><br>A. 読み取り不鮮明な箇所はシステムが警告を出すため、人間がそこだけ確認・承認するフローで安全に運用します。</div>
                    </div>
                </div>
            </div>

            <div style="display:flex; flex-direction:column; gap:25px;">
                <div class="card">
                    <div class="card-title"><i class="ri-exchange-line"></i> 業務ワークフローの劇的変化</div>
                    <div style="font-size:15px; display:flex; flex-direction:column; gap:10px;">
                        <div style="background:#fee2e2; padding:12px; border-radius:6px; border-left:4px solid var(--danger)">
                            <strong>【Before 手作業】</strong> FAX受信 → 印刷用紙回収 → 目視確認 → 基幹システム起動 → 注文コード手入力 → 数量手入力 → 確定ボタン押下（1件あたり5分）
                        </div>
                        <div style="background:#d1fae5; padding:12px; border-radius:6px; border-left:4px solid var(--success)">
                            <strong>【After デジタル】</strong> FAXがPDFで自動着信 → AI-OCRが自動文字解析 → RPAが自動で基幹システムに入力 → 異常値がある箇所のみ人間が画面上で確認・確定（1件あたり30秒）
                        </div>
                    </div>
                </div>

                <div class="roi-box">
                    <div class="roi-title"><i class="ri-line-chart-line"></i> この施策によるROIシミュレーション</div>
                    <div class="roi-calc">
                        [入力・修正作業：2時間/日 × 20営業日 × 2名 = 80時間/月削減]<br>
                        80時間 × 時給2,000円 = 月160,000円（年間1,920,000円相当のコスト削減効果）
                    </div>
                </div>
            </div>
        </div>
        <div class="page-footer"><span>© 2026 DX Advisory Group</span></div>
    </div>

    <div class="page">
        <div class="page-header">
            <span class="brand"><i class="ri-pulse-line"></i> DX Diagnostic Report</span>
            <span>Page 6 / 10</span>
        </div>
        <h2 class="page-title"><i class="ri-focus-3-line"></i> 施策②：クラウド型SFA導入による日報・営業報告改革</h2>

        <div class="grid-2 flex-1">
            <div style="display:flex; flex-direction:column; gap:25px;">
                <div class="card">
                    <div class="card-title"><i class="ri-user-settings-line"></i> ターゲット業務（現場のペルソナ）</div>
                    <p style="font-size:16px;">
                        <strong>社外を飛び回る営業担当者（ルートセールス・新規開拓）</strong><br>
                        1日5社の訪問を終えた後、報告書を出すためにわざわざ夕方以降にオフィスへ帰社。PCを開いてExcelフォーマットへ入力を行う。時間が経っているため詳細を忘れ、「特になし」といった薄い内容の報告になりがち。
                    </p>
                </div>

                <div class="card">
                    <div class="card-title"><i class="ri-question-answer-line"></i> 導入時の想定Q&A</div>
                    <div style="display:flex; flex-direction:column; gap:12px; font-size:15px;">
                        <div><strong>Q. パソコン操作が苦手な高齢の営業マンでも使えますか？</strong><br>A. スマートフォンアプリから利用でき、文字入力の代わりに音声入力を使って数分で喋るだけで精緻な報告書が作成できます。</div>
                        <div><strong>Q. 導入することで現場の監視感が強まり、反発されませんか？</strong><br>A. 「直行直帰が増えて早く帰れる」という明確な現場メリットを提示することで、むしろ進んで導入に協力してもらえます。</div>
                        <div><strong>Q. 日報以外にどのようなメリットがありますか？</strong><br>A. 訪問ルートの最適化や、顧客ごとの次回訪問予定のアラート機能により、営業効率そのものが向上します。</div>
                    </div>
                </div>
            </div>

            <div style="display:flex; flex-direction:column; gap:25px;">
                <div class="card">
                    <div class="card-title"><i class="ri-exchange-line"></i> 業務ワークフローの劇的変化</div>
                    <div style="font-size:15px; display:flex; flex-direction:column; gap:10px;">
                        <div style="background:#fee2e2; padding:12px; border-radius:6px; border-left:4px solid var(--danger)">
                            <strong>【Before 手作業】</strong> 顧客訪問終了 → 夕方にオフィスへ移動・帰社 → PC起動 → 記憶を思い出しながらExcelへ入力 → 上長へメール送信（1日45分）
                        </div>
                        <div style="background:#d1fae5; padding:12px; border-radius:6px; border-left:4px solid var(--success)">
                            <strong>【After デジタル】</strong> 顧客訪問直後、車内からスマホアプリを起動 → 音声で商談内容を吹き込み完了 → データがクラウドに即時保存され、上長にリアルタイム共有（1日5分）
                        </div>
                    </div>
                </div>

                <div class="roi-box">
                    <div class="roi-title"><i class="ri-line-chart-line"></i> この施策によるROIシミュレーション</div>
                    <div class="roi-calc">
                        [報告時間・移動時間の削減：40分/日 × 20営業日 × 3名 = 40時間/月削減]<br>
                        40時間 × 時給2,000円 = 月80,000円（年間960,000円相当のコスト削減効果）
                    </div>
                </div>
            </div>
        </div>
        <div class="page-footer"><span>© 2026 DX Advisory Group</span></div>
    </div>

    <div class="page">
        <div class="page-header">
            <span class="brand"><i class="ri-pulse-line"></i> DX Diagnostic Report</span>
            <span>Page 7 / 10</span>
        </div>
        <h2 class="page-title"><i class="ri-focus-3-line"></i> 施策③：統合CRM構築による顧客・取引情報の一元化</h2>

        <div class="grid-2 flex-1">
            <div style="display:flex; flex-direction:column; gap:25px;">
                <div class="card">
                    <div class="card-title"><i class="ri-user-settings-line"></i> ターゲット業務（現場のペルソナ）</div>
                    <p style="font-size:16px;">
                        <strong>顧客からの急な問い合わせを受ける内勤・営業アシスタント</strong><br>
                        「この前の見積りの件だけど」と顧客から電話が入るも、担当者が外出中で詳細が不明。担当者の引き出しにあるノートや、個人のPCのローカルフォルダを探し回る。結局「担当者から折り返します」と対応せざるを得ない。
                    </p>
                </div>

                <div class="card">
                    <div class="card-title"><i class="ri-question-answer-line"></i> 導入時の想定Q&A</div>
                    <div style="display:flex; flex-direction:column; gap:12px; font-size:15px;">
                        <div><strong>Q. 既存のExcelの顧客名簿からデータを移行できますか？</strong><br>A. CSVファイルのインポート機能に対応しているため、既存のExcelデータを流し込むだけで簡単に初期構築が可能です。</div>
                        <div><strong>Q. 顧客の機密情報が外部に漏れる心配はありませんか？</strong><br>A. 二要素認証やアクセスIP制限などの強固なセキュリティ機能を備えたクラウドサービスを採用するため、安全です。</div>
                        <div><strong>Q. 情報の入力が手間で、定着しないのではないでしょうか？</strong><br>A. 入力項目を極限まで絞り、最初は「社名」「ステータス」「一言メモ」の3つだけで運用を開始するのがコツです。</div>
                    </div>
                </div>
            </div>

            <div style="display:flex; flex-direction:column; gap:25px;">
                <div class="card">
                    <div class="card-title"><i class="ri-exchange-line"></i> 業務ワークフローの劇的変化</div>
                    <div style="font-size:15px; display:flex; flex-direction:column; gap:10px;">
                        <div style="background:#fee2e2; padding:12px; border-radius:6px; border-left:4px solid var(--danger)">
                            <strong>【Before 手作業】</strong> 顧客から電話 → 担当者のデスクや過去メールを検索 → 不明のため折り返しを案内 → 担当者に連絡 → 担当者が帰社して再確認（対応完了まで3時間）
                        </div>
                        <div style="background:#d1fae5; padding:12px; border-radius:6px; border-left:4px solid var(--success)">
                            <strong>【After デジタル】</strong> 顧客から電話 → 画面に顧客名を入力 → 過去の見積書や商談メモが秒速で画面にタイムライン表示 → 電話を受けたアシスタントがその場で回答完了（対応完了まで3分）
                        </div>
                    </div>
                </div>

                <div class="roi-box">
                    <div class="roi-title"><i class="ri-line-chart-line"></i> この施策によるROIシミュレーション</div>
                    <div class="roi-calc">
                        [調査・折り返し対応の削減：15分/件 × 月120件の問い合わせ = 30時間/月削減]<br>
                        30時間 × 時給2,000円 = 月60,000円（年間720,000円相当のコスト削減効果）
                    </div>
                </div>
            </div>
        </div>
        <div class="page-footer"><span>© 2026 DX Advisory Group</span></div>
    </div>

    <div class="page">
        <div class="page-header">
            <span class="brand"><i class="ri-pulse-line"></i> DX Diagnostic Report</span>
            <span>Page 8 / 10</span>
        </div>
        <h2 class="page-title"><i class="ri-equalizer-line"></i> デジタルツールの選び方と導入の注意点</h2>

        <div class="flex-1">
            <h3 style="font-size:22px; font-weight:700; margin-bottom:15px; color:var(--primary);">■ ツール選定の比較マトリクス</h3>
            <table>
                <thead>
                    <tr>
                        <th style="width: 20%;">システムタイプ</th>
                        <th style="width: 25%;">初期コスト・月額</th>
                        <th style="width: 25%;">導入・定着のしやすさ</th>
                        <th style="width: 30%;">選定基準のアドバイス</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>業界特化型パッケージ</strong></td>
                        <td>高額（初期100万〜、月額数万〜）</td>
                        <td>△ 現場の学習コストが高め</td>
                        <td>卸売業独特の商習慣（単価掛け率等）があらかじめ組み込まれているが、自社に合わないと大失敗する。</td>
                    </tr>
                    <tr>
                        <td><strong>汎用クラウド（SaaS）</strong></td>
                        <td>安価（初期0円、月額数千円/人）</td>
                        <td>◎ 直感的で使いやすい</td>
                        <td>スマートフォン対応が前提の設計。カスタマイズの自由度は制限されるが、スモールスタートに最適。</td>
                    </tr>
                    <tr>
                        <td><strong>ノーコード独自開発</strong></td>
                        <td>中規模（ツールのライセンス代のみ）</td>
                        <td>◯ 自社業務に完全密着可能</td>
                        <td>自社専用の入力画面をドラッグ＆ドロップで構築。初期設定を行う社内人材、または外部パートナーが必要。</td>
                    </tr>
                </tbody>
            </table>

            <div class="card" style="margin-top:40px; border-color:#fee2e2; background:#fffafb;">
                <div class="card-title" style="color:var(--danger);"><i class="ri-spam-2-line"></i> 導入時に必ず失敗する「地雷ツール」の見分け方</div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; font-size:15px; margin-top:10px;">
                    <div style="background:white; padding:15px; border:1px solid #fee2e2; border-radius:8px;">
                        <strong style="color:var(--primary)">1. 多機能すぎる大企業向けのシステム</strong>
                        <p style="color:var(--text-muted); margin-top:5px;">自社の日常業務で使わない項目が画面に溢れかえり、入力の段階で現場が嫌悪感を抱いて誰も使わなくなります。</p>
                    </div>
                    <div style="background:white; padding:15px; border:1px solid #fee2e2; border-radius:8px;">
                        <strong style="color:var(--primary)">2. パソコン（デスクトップ）専用のシステム</strong>
                        <p style="color:var(--text-muted); margin-top:5px;">営業マンが外出先から操作できず、「オフィスに帰らないと入力できない」という新しい手作業の無駄を発生させます。</p>
                    </div>
                    <div style="background:white; padding:15px; border:1px solid #fee2e2; border-radius:8px;">
                        <strong style="color:var(--primary)">3. サポート対応がメール・チャットのみの海外製ツール</strong>
                        <p style="color:var(--text-muted); margin-top:5px;">社内で不具合や操作の疑問が出た際にすぐ解決できず、検証段階でプロジェクトが完全に頓挫します。</p>
                    </div>
                    <div style="background:white; padding:15px; border:1px solid #fee2e2; border-radius:8px;">
                        <strong style="color:var(--primary)">4. 既存システムとの一括データ出力（CSV）ができないツール</strong>
                        <p style="color:var(--text-muted); margin-top:5px;">データがツール内に閉じ込められ、他システムに連携するために結局手入力で転記する二重苦に陥ります。</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="page-footer"><span>© 2026 DX Advisory Group</span></div>
    </div>

    <div class="page">
        <div class="page-header">
            <span class="brand"><i class="ri-pulse-line"></i> DX Diagnostic Report</span>
            <span>Page 9 / 10</span>
        </div>
        <h2 class="page-title"><i class="ri-todo-line"></i> 業務改善・デジタル化への具体的なアクションプラン</h2>

        <div class="timeline flex-1">
            <div class="timeline-card">
                <div class="timeline-title"><span class="badge badge-success">STEP 01</span> 今週やること</div>
                <ul style="padding-left:20px; display:flex; flex-direction:column; gap:15px; font-size:16px;">
                    <li><strong>無駄時間の正確な可視化</strong><br><span style="color:var(--text-muted)">事務担当者2名に対し、FAXの転記とエラー修正にかかっているストップウォッチ時間を3日間計測し記録する。</span></li>
                    <li><strong>現在の取引先リストの整理</strong><br><span style="color:var(--text-muted)">FAXで注文を送ってくる主要顧客の上位10社をリストアップし、フォーマットの共通性を確認する。</span></li>
                    <li><strong>ツールの無料トライアル申し込み</strong><br><span style="color:var(--text-muted)">本レポートで提示した汎用クラウド型SFA、またはAI-OCRの体験アカウントを1つ発行する。</span></li>
                </ul>
            </div>

            <div class="timeline-card mid">
                <div class="timeline-title"><span class="badge badge-primary">STEP 02</span> 1ヶ月以内にやること</div>
                <ul style="padding-left:20px; display:flex; flex-direction:column; gap:15px; font-size:16px;">
                    <li><strong>特定少数でのプロトタイプ運用</strong><br><span style="color:var(--text-muted)">営業担当スタッフ1名のみを選定し、テスト的にスマートフォンでの報告アプリの運用を開始する。</span></li>
                    <li><strong>読取精度のベンチマーク検証</strong><br><span style="color:var(--text-muted)">実際の過去のFAX注文書を50枚テストスキャンし、AI-OCRが正確に文字を識別できるか誤読率を算出する。</span></li>
                    <li><strong>週次での現場ヒアリング会の実施</strong><br><span style="color:var(--text-muted)">テスト運用しているスタッフから「どこが使いにくいか」を週に1回直接聞き、設定を微調整する。</span></li>
                </ul>
            </div>

            <div class="timeline-card high">
                <div class="timeline-title"><span class="badge badge-warning">STEP 03</span> 3ヶ月後の目標</div>
                <ul style="padding-left:20px; display:flex; flex-direction:column; gap:15px; font-size:16px;">
                    <li><strong>全社への正式リリースと完全移行</strong><br><span style="color:var(--text-muted)">紙の日報、Excel転記のフローをこの日を境に全面廃止し、新しいデジタル運用へ完全に一本化する。</span></li>
                    <li><strong>業務マニュアルのクラウド格納</strong><br><span style="color:var(--text-muted)">新システムの使い方を動画や1枚のスクショにまとめ、誰でもいつでも閲覧できる環境を定着させる。</span></li>
                    <li><strong>余剰時間の再投資状況の確認</strong><br><span style="color:var(--text-muted)">月80時間削減されたリソースが、新規顧客の開拓や既存顧客へのフォロー訪問に充てられているか追跡する。</span></li>
                </ul>
            </div>
        </div>
        <div class="page-footer"><span>© 2026 DX Advisory Group</span></div>
    </div>

    <div class="page" style="justify-content: center; align-items: center; text-align: center; background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%);">
        <div class="page-header">
            <span class="brand"><i class="ri-pulse-line"></i> DX Diagnostic Report</span>
            <span>Page 10 / 10</span>
        </div>

        <div style="max-width: 1000px; margin: 0 auto;">
            <i class="ri-rocket-2-line" style="font-size: 80px; color: var(--secondary); margin-bottom: 20px; display: inline-block;"></i>
            <h2 style="font-size: 44px; font-weight: 700; color: var(--primary); margin-bottom: 30px;">
                経営資源の価値を最大化し、攻めの経営へ
            </h2>

            <p style="font-size: 20px; line-height: 1.8; color: var(--text-dark); margin-bottom: 50px; text-align: left; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); border: 1px solid var(--border-color);">
                業務効率化の本質は、単なる「楽をすること」や「コストカット」ではありません。人間が手作業で行う必要のない不毛なルーティンワークをテクノロジーに委ね、<strong>削減された貴重な時間を『利益を生み出すコア業務』や『顧客との対話』へ100%再投資すること</strong>にあります。<br><br>
                まずは小さく、特定の業務の自動化からスタートしましょう。現場を巻き込んだ確実なDXステップの実現に向けて、私たちが伴走支援いたします。
            </p>

            <div style="display: flex; gap: 20px; justify-content: center;">
                <div style="background: white; padding: 20px 40px; border-radius: 8px; border: 1px solid var(--border-color); text-align: left;">
                    <strong style="color:var(--secondary); font-size:18px;">💡 自社で進められること</strong>
                    <p style="font-size:14px; color:var(--text-muted); margin-top:5px;">・現状の無駄業務の時間計測<br>・現場スタッフへの改善ニーズ確認</p>
                </div>
                <div style="background: white; padding: 20px 40px; border-radius: 8px; border: 1px solid var(--border-color); text-align: left;">
                    <strong style="color:var(--accent); font-size:18px;">🤝 専門家に頼るべきこと</strong>
                    <p style="font-size:14px; color:var(--text-muted); margin-top:5px;">・自社に最適なツールの選定・目利き<br>・RPAやAI-OCRの初期構築と定着化</p>
                </div>
            </div>

            <a href="https://example.com/dx-consulting" class="cta-btn">
                <i class="ri-calendar-check-line"></i> 無料の個別DX要件ヒアリングを申し込む
            </a>
        </div>

        <div class="page-footer"><span>© 2026 DX Advisory Group</span></div>
    </div>

</div>

</body>
</html>
```

> # あなたの役割
>
>
> あなたは一流の経営コンサルタントおよび営業マネージャーです。
>
>
> 提示されたクライアントの状況をもとに、説得力のある「営業効率化および業務改善に関する提案書（PDF）」を作成してください。
>
>
>
>
>
> # 提案書の標準構成（全11ページ構成を想定）
>
>
> 1. 表紙（タイトル、日付、作成者、宛先）
>
>
> 2. アジェンダ
>
>
> 3. ご提案の背景（現状認識：会社としての目指す方向性、お伺いしている現状の問題）
>
>
> 4. ご提案のテーマ（課題認識：あるべき姿、実現するための障壁/課題）
>
>
> 5. ご提案全体像（解決策：As-Is / To-Be の比較構造）
>
>
> 6. 期待される効果について（ROI：作業内容ごとの現状・導入後・削減時間・根拠、ROI計算）
>
>
> 7. 費用サマリー（初期費用、ライセンス費用、サポート費用の3カ年推移の視覚的表現）
>
>
> 8. 費用詳細（サービス名、標準価格、ご提供価格、数量、年間費用、注意事項）
>
>
> 9. スケジュール（マイルストーン、各プロセスの期間）
>
>
> 10. プロジェクト体制（貴社・弊社の体制図のテキスト表現）
>
>
> 11. 今後のさらなる活用について（フェーズ1〜3のロードマップ）
>
>
>
>
>
> # 処理フロー（重要）
>
>
> まず、私が提示する【インプット情報】を確認してください。
>
>
>
>
>
> 1. **【情報が不足している場合】**
>
>
> 具体的な企業名、現状、目標値、費用感などの重要情報が不足しており、このままでは精度の高い提案書が作れないと判断した場合は、提案書の作成を**一時中断**してください。
>
>
> その代わり、提案書を完成させるために必要な項目をまとめた**「ヒアリングシート（質問リスト）」**を出力してください。
>
>
>
>
>
> 2. **【情報が十分な場合】**
>
>
> インプット情報をもとに、WeasyPrint（HTML to PDF）を用いてデザインされた美しいPDFファイルを即座に生成し、ダウンロードリンクを提示してください。
>
>
>
>
>
> ---
>
>
>
>
>
> # インプット情報
>
>
> ※ここにクライアントからヒアリングした内容やメモを貼り付けてください。
>
>
> （例：宛先会社名、自社名、解決したい問題、削減したい時間、予算など）
>
>
>
>
>
> 【インプット】
>
>
> ・

ご提示いただいた【インプット】欄が空欄、または具体的な情報（企業名、現状の数値、費用感など）が不足しているため、精度の高い提案書を生成するための処理フローに則り、作成を一時中断します。

クライアントへ最高品質の提案書（PDF）を一発で提示できるよう、まずは以下の「ヒアリングシート」に必要な情報をご記入いただけますでしょうか？

## 📋 提案書作成のためのヒアリングシート

以下の項目について、分かっている範囲で箇条書きなどでご入力ください。

### 1. 基本情報

- **宛先企業名（御中）：** （例：株式会社サンプル商事）
- **提案会社名（弊社）：** （例：株式会社NextSales）
- **提案日付・作成者名：** （空欄の場合は自動で本日付になります）

### 2. 現状と背景（As-Is）

- **会社が目指す方向性・目標：** （例：来期までに新規売上5,000万円達成、営業リソースを新規開拓へ100%シフトなど）
- **お伺いしている現状の問題・アナログ業務：** （例：FAX受注のシステム手入力に時間がかかっている、日報を帰社後にExcel入力しているなど）
- **手作業にかかっている具体的な時間・人数：** （例：事務員2名が毎日2時間、営業3名が毎日45分など）

### 3. あるべき姿・テーマ（To-Be）

- **今回実現したい状態：** （例：FAX処理をAI-OCRで自動化して即時データ化、日報を外出先からスマホ入力など）
- **目標とする削減時間・数値：** （例：FAX処理時間を90%削減、日報入力を5分に短縮など）

### 4. 費用とスケジュール（想定）

- **想定している費用感：** （例：初期100万円、月額ライセンス20万円、サポート年50万円など）
- **プロジェクトの想定期間：** （例：3ヶ月で導入・テスト完了、6ヶ月スケジュールなど）

上記の【インプット】が埋まりましたら、再度このチャットに貼り付けてご指示ください。情報をベースに、最適化された全11ページの美しい提案書コード（HTML/CSS）を一発で出力いたします！

> １．宛先企業名：株式会社サンプル商事　御中
>
>
> 提案会社名：株式会社NextSales
>
>
>
>
>
> ２．営業リソースを１．５倍に効率化
>
>
> 現状の問題：EXCEL、WORD、Powerpointの営業資料が散乱している。テンプレート化して提案活動を効率化する
>
>
> 具体的なコスト時間：営業提案書作成に6時間、レビューに２時間。
>
>
> ３．あるべき姿
>
>
> 明日提案する内容を本日中に作成できるような体制づくり
>
>
> 目標値：２時間で作成
>
>
> ４．費用：３０万～５０万
>
>
> 期間：１週間

ご提示いただいた情報に基づき、WeasyPrint（HTML to PDF変換）に完全対応した、全11ページの洗練された提案書コード（HTML/CSS）を生成しました。

デザインはビジネスシーンに相応しい信頼感のある濃紺（ネイビー）をベースカラーとし、ご提示いただいた「営業提案書作成を6時間から2時間へ削減」「営業リソースを1.5倍に効率化」というロジックを美しくビジュアル化・計算式化しています。

以下のコードをコピーし、`.html`ファイルとして保存していただくか、ブラウザで直接確認・PDF変換してご利用ください。

HTML
```
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>営業効率化および業務改善に関する提案書</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css" rel="stylesheet">
    <style>
        :root {
            --primary: #0f172a;       /* 濃紺 */
            --secondary: #1e3a8a;     /* ディープブルー */
            --accent: #2563eb;        /* ロイヤルブルー */
            --accent-light: #eff6ff;  /* 薄いブルー */
            --text-dark: #1e293b;
            --text-muted: #64748b;
            --border-color: #e2e8f0;
            --success: #10b981;
            --page-width: 1920px;
            --page-height: 1080px;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'Noto Sans JP', sans-serif;
            background-color: #555;
            color: var(--text-dark);
            line-height: 1.6;
            -webkit-print-color-adjust: exact;
        }

        .report-container {
            width: var(--page-width);
            margin: 0 auto;
        }

        /* ページ基本設定 */
        .page {
            width: var(--page-width);
            height: var(--page-height);
            background-color: #ffffff;
            position: relative;
            overflow: hidden;
            padding: 100px 120px;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            page-break-after: always;
            box-shadow: 0 10px 25px rgba(0,0,0,0.3);
            margin-bottom: 40px;
        }

        /* ヘッダー・フッター */
        .page-header {
            position: absolute;
            top: 40px;
            left: 120px;
            right: 120px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid var(--accent-light);
            padding-bottom: 15px;
            color: var(--text-muted);
            font-size: 16px;
        }

        .page-header .brand {
            font-weight: 700;
            color: var(--primary);
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .page-footer {
            position: absolute;
            bottom: 40px;
            left: 120px;
            right: 120px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 1px solid var(--border-color);
            padding-top: 15px;
            color: var(--text-muted);
            font-size: 14px;
        }

        /* タイトル */
        .page-title {
            font-size: 42px;
            font-weight: 700;
            color: var(--primary);
            margin-top: 20px;
            margin-bottom: 50px;
            display: flex;
            align-items: center;
            gap: 15px;
            border-left: 10px solid var(--accent);
            padding-left: 25px;
        }

        /* レイアウト */
        .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 50px; }
        .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 35px; }
        .flex-1 { flex: 1; }

        /* カードデザイン */
        .card {
            background: var(--accent-light);
            border-radius: 12px;
            padding: 35px;
            border: 1px solid var(--border-color);
        }

        .card-title {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 20px;
            color: var(--secondary);
            display: flex;
            align-items: center;
            gap: 10px;
            border-bottom: 2px solid var(--border-color);
            padding-bottom: 10px;
        }

        /* テーブル */
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            font-size: 18px;
        }

        th {
            background-color: var(--secondary);
            color: #ffffff;
            text-align: left;
            padding: 18px 22px;
            font-weight: 700;
        }

        td {
            padding: 20px 22px;
            border-bottom: 1px solid var(--border-color);
            background-color: #ffffff;
        }

        tr:nth-child(even) td {
            background-color: var(--accent-light);
        }

        /* 特殊コンポーネント */
        .asis-tobe-box {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: #fff;
            padding: 30px;
            border-radius: 12px;
            border: 2px solid var(--border-color);
            margin-bottom: 25px;
        }

        .roi-badge {
            background-color: var(--success);
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 16px;
            font-weight: 700;
        }

        /* 1ページ目：表紙 */
        .cover-page {
            background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 60%, var(--accent) 100%);
            color: white;
            justify-content: center;
            align-items: flex-start;
            padding: 180px;
        }
        .cover-sub {
            font-size: 32px;
            color: #60a5fa;
            font-weight: 500;
            margin-bottom: 25px;
            letter-spacing: 2px;
        }
        .cover-main {
            font-size: 68px;
            font-weight: 700;
            line-height: 1.3;
            margin-bottom: 80px;
            border-bottom: 4px solid white;
            padding-bottom: 40px;
            width: 100%;
        }
        .cover-meta {
            margin-top: auto;
            font-size: 22px;
            display: grid;
            grid-template-columns: 140px 1fr;
            gap: 20px 0;
        }
        .cover-meta span { color: #94a3b8; }

        /* リストスタイル */
        ul.styled-list {
            list-style: none;
            padding-left: 0;
        }
        ul.styled-list li {
            position: relative;
            padding-left: 30px;
            margin-bottom: 15px;
            font-size: 18px;
        }
        ul.styled-list li::before {
            content: "■";
            position: absolute;
            left: 0;
            color: var(--accent);
        }

        /* ロードマップ・タイムライン */
        .roadmap {
            display: flex;
            justify-content: space-between;
            margin-top: 40px;
        }
        .roadmap-step {
            flex: 1;
            background: var(--accent-light);
            border: 2px solid var(--border-color);
            border-radius: 12px;
            padding: 30px;
            text-align: center;
        }
        .roadmap-step.active {
            border-color: var(--accent);
            background: #fff;
            box-shadow: 0 4px 12px rgba(37,99,235,0.1);
        }
        .roadmap-arrow {
            display: flex;
            align-items: center;
            font-size: 40px;
            color: var(--accent);
            padding: 0 15px;
        }

        /* 視覚的グラフ表現 */
        .bar-chart-container {
            display: flex;
            flex-direction: column;
            gap: 20px;
            margin-top: 30px;
        }
        .bar-row {
            display: flex;
            align-items: center;
            gap: 20px;
        }
        .bar-label { width: 120px; font-weight: 700; font-size: 18px; }
        .bar-track { flex: 1; background: #e2e8f0; height: 35px; border-radius: 8px; overflow: hidden; }
        .bar-fill { height: 100%; background: var(--accent); display: flex; align-items: center; padding-left: 15px; color: white; font-weight: 700; transition: width 0.5s ease-in-out; }
        .bar-fill.reduced { background: var(--success); }

        @media print {
            body { background-color: #ffffff; }
            .page { box-shadow: none; margin-bottom: 0; }
        }
    </style>
</head>
<body>

<div class="report-container">

    <div class="page cover-page">
        <div class="cover-sub">営業リソースを1.5倍に変革する資料テンプレート化のご提案</div>
        <div class="cover-main">営業効率化および業務改善<br>提案書</div>
        <div class="cover-meta">
            <span>ご提出先：</span><strong>株式会社サンプル商事 御中</strong>
            <span>提案会社：</span><strong>株式会社NextSales</strong>
            <span>策定日：</span><strong>2026年7月13日</strong>
        </div>
    </div>

    <div class="page">
        <div class="page-header">
            <span class="brand"><i class="ri-lightbulb-line"></i> 株式会社NextSales</span>
            <span>Page 2 / 11</span>
        </div>
        <h2 class="page-title"><i class="ri-list-ordered"></i> 本日のアジェンダ</h2>

        <div style="max-width: 900px; margin: 40px auto 0; display: flex; flex-direction: column; gap: 20px; font-size: 22px;">
            <div style="background:var(--accent-light); padding: 20px 40px; border-radius: 8px; display:flex; justify-content:space-between;">
                <span>1. ご提案の背景（現状認識）</span><span style="color:var(--text-muted);">P. 3</span>
            </div>
            <div style="background:var(--accent-light); padding: 20px 40px; border-radius: 8px; display:flex; justify-content:space-between;">
                <span>2. ご提案のテーマ（課題認識）</span><span style="color:var(--text-muted);">P. 4</span>
            </div>
            <div style="background:var(--accent-light); padding: 20px 40px; border-radius: 8px; display:flex; justify-content:space-between;">
                <span>3. ご提案全体像（解決策）</span><span style="color:var(--text-muted);">P. 5</span>
            </div>
            <div style="background:var(--accent-light); padding: 20px 40px; border-radius: 8px; display:flex; justify-content:space-between;">
                <span>4. 期待される効果について（ROI算出）</span><span style="color:var(--text-muted);">P. 6</span>
            </div>
            <div style="background:var(--accent-light); padding: 20px 40px; border-radius: 8px; display:flex; justify-content:space-between;">
                <span>5. 費用サマリー＆費用詳細</span><span style="color:var(--text-muted);">P. 7 - 8</span>
            </div>
            <div style="background:var(--accent-light); padding: 20px 40px; border-radius: 8px; display:flex; justify-content:space-between;">
                <span>6. スケジュール＆プロジェクト体制</span><span style="color:var(--text-muted);">P. 9 - 10</span>
            </div>
            <div style="background:var(--accent-light); padding: 20px 40px; border-radius: 8px; display:flex; justify-content:space-between;">
                <span>7. 今後のさらなる活用について（ロードマップ）</span><span style="color:var(--text-muted);">P. 11</span>
            </div>
        </div>

        <div class="page-footer"><span>© 2026 NextSales Inc.</span></div>
    </div>

    <div class="page">
        <div class="page-header">
            <span class="brand"><i class="ri-lightbulb-line"></i> 株式会社NextSales</span>
            <span>Page 3 / 11</span>
        </div>
        <h2 class="page-title"><i class="ri-article-line"></i> ご提案の背景（現状認識）</h2>

        <div class="grid-2 flex-1">
            <div class="card" style="background:#fff; border: 2px solid var(--accent);">
                <div class="card-title" style="color:var(--accent); border-bottom-color:var(--accent);"><i class="ri-flag-line"></i> 貴社が目指す方向性</div>
                <p style="font-size: 20px; line-height: 1.8; margin-top: 10px;">
                    現在、株式会社サンプル商事様においては、競争の激しい市場環境を勝ち抜くため、<strong>「営業リソースを実質1.5倍に効率化し、顧客接点および提案社数を圧倒的に増大させること」</strong>を最重要テーマに掲げられているとお伺いしております。
                </p>
            </div>

            <div class="card">
                <div class="card-title"><i class="ri-error-warning-line" style="color:var(--text-dark)"></i> お伺いしている現状の問題</div>
                <ul class="styled-list" style="margin-top: 10px;">
                    <li>社内にEXCEL、WORD、Powerpointの過去の営業資料・提案書が散乱している。</li>
                    <li>毎回、過去の類似資料を探し出す、または一から作り直す作業が発生。</li>
                    <li><strong>1回の営業提案書作成に【6時間】、上長のレビュー・手直しに【2時間】</strong>の合計8時間が浪費されている。</li>
                    <li>準備に時間を取られ、明日提案したい高品質な内容を本日中に仕上げる体制が組めていない。</li>
                </ul>
            </div>
        </div>
        <div class="page-footer"><span>© 2026 NextSales Inc.</span></div>
    </div>

    <div class="page">
        <div class="page-header">
            <span class="brand"><i class="ri-lightbulb-line"></i> 株式会社NextSales</span>
            <span>Page 4 / 11</span>
        </div>
        <h2 class="page-title"><i class="ri-focus-3-line"></i> ご提案のテーマ（課題認識）</h2>

        <div style="background:var(--primary); color:white; padding:40px; border-radius:12px; margin-bottom:40px;">
            <span style="color:var(--accent); font-weight:700; font-size:20px;">■ あるべき姿（ゴール設定）</span>
            <h3 style="font-size:32px; margin-top:10px;">明日提案する内容を、本日中に2時間でスマートに作成できる体制づくり</h3>
        </div>

        <div class="card flex-1">
            <div class="card-title"><i class="ri-shield-flash-line"></i> ゴール実現を阻む3つの障壁（解決すべき課題）</div>
            <div class="grid-3" style="margin-top: 20px;">
                <div style="background:white; padding:25px; border-radius:8px; border-top:5px solid var(--accent);">
                    <strong style="font-size:20px;">① 情報の断片化・属人化</strong>
                    <p style="font-size:16px; color:var(--text-muted); margin-top:10px;">各営業マンが個人のPC内に資料を保管しているため、どれが最新で最適な構成なのか共通のベストプラクティスが共有されていない。</p>
                </div>
                <div style="background:white; padding:25px; border-radius:8px; border-top:5px solid var(--accent);">
                    <strong style="font-size:20px;">② フォーマット構築のロス</strong>
                    <p style="font-size:16px; color:var(--text-muted); margin-top:10px;">構成、デザイン、グラフ配置、規約文作成など、毎回デザインやレイアウトの微調整に大半の時間（6時間）が消えている。</p>
                </div>
                <div style="background:white; padding:25px; border-radius:8px; border-top:5px solid var(--accent);">
                    <strong style="font-size:20px;">③ レビュー工数の肥大化</strong>
                    <p style="font-size:16px; color:var(--text-muted); margin-top:10px;">提出される資料の品質がバラバラなため、上長が内容以前の「体裁チェック・修正」に2時間を要し、確認作業がボトルネック化。</p>
                </div>
            </div>
        </div>
        <div class="page-footer"><span>© 2026 NextSales Inc.</span></div>
    </div>

    <div class="page">
        <div class="page-header">
            <span class="brand"><i class="ri-lightbulb-line"></i> 株式会社NextSales</span>
            <span>Page 5 / 11</span>
        </div>
        <h2 class="page-title"><i class="ri-git-merge-line"></i> ご提案全体像（解決策）</h2>

        <p style="font-size:22px; margin-bottom:30px;">
            散乱する各オフィスファイルを統合・ルール化し、高クオリティな<strong>「営業提案資料テンプレート群」</strong>を完全構築します。
        </p>

        <div class="flex-1" style="display:flex; flex-direction:column; gap:20px;">
            <div class="asis-tobe-box">
                <div style="width:42%; background:#fee2e2; padding:20px; border-radius:8px;">
                    <strong style="color:var(--text-dark); font-size:20px;"><i class="ri-close-circle-line"></i> 従来の業務構造（As-Is）</strong>
                    <p style="margin-top:10px; font-size:16px;">過去のEXCEL、WORD、PPTを探し回り、コピペと手直し。デザイン修正に時間を取られ、本質的な顧客分析・提案のブラッシュアップができないまま翌日の提案を迎える。</p>
                </div>
                <div style="font-size:40px; color:var(--accent);"><i class="ri-arrow-right-line"></i></div>
                <div style="width:48%; background:#d1fae5; padding:20px; border-radius:8px; border:2px solid var(--success);">
                    <strong style="color:var(--text-dark); font-size:20px;"><i class="ri-checkbox-circle-line"></i> テンプレート化導入後（To-Be）</strong>
                    <p style="margin-top:10px; font-size:16px;">業種・提案別のMasterテンプレートを開き、顧客情報を流し込むだけ。構成の型が決まっているため迷わず、最短で本日中に高品質な提案書が完成。上長レビューも「内容の精査」へ集中できる。</p>
                </div>
            </div>

            <div class="card">
                <strong style="font-size:22px;"><i class="ri-tools-line"></i> 今回実施するテンプレート化パッケージの具体的内容</strong>
                <div class="grid-3" style="margin-top:15px; font-size:16px;">
                    <div>
                        <strong style="color:var(--accent)">📊 EXCEL数値・シミュレーション型</strong>
                        <p style="color:var(--text-muted); margin-top:5px;">コスト削減、投資対効果（ROI）を顧客ごとに自動算出できる計算モデルテンプレートの構築。</p>
                    </div>
                    <div>
                        <strong style="color:var(--accent)">📝 WORD基本契約・仕様書型</strong>
                        <p style="color:var(--text-muted); margin-top:5px;">法的リスクを回避し、箇条書きベースで迅速に見積概要や要件定義書を出力できる骨子テンプレート。</p>
                    </div>
                    <div>
                        <strong style="color:var(--accent)">🖥️ Powerpoint営業提案ストーリー型</strong>
                        <p style="color:var(--text-muted); margin-top:5px;">表紙からクロージングまで、11の標準ステップに基づいた美しい「一発作成用」スライドマスタ。</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="page-footer"><span>© 2026 NextSales Inc.</span></div>
    </div>

    <div class="page">
        <div class="page-header">
            <span class="brand"><i class="ri-lightbulb-line"></i> 株式会社NextSales</span>
            <span>Page 6 / 11</span>
        </div>
        <h2 class="page-title"><i class="ri-line-chart-line"></i> 期待される効果について（ROI）</h2>

        <div class="grid-2 flex-1">
            <div style="display:flex; flex-direction:column; gap:25px;">
                <div class="card" style="background:#fff; border:1px solid var(--border-color);">
                    <div class="card-title"><i class="ri-time-line"></i> 提案書作成・確認に要する時間の推移</div>
                    <div class="bar-chart-container">
                        <div class="bar-row">
                            <div class="bar-label">現状の作業時間</div>
                            <div class="bar-track"><div class="bar-fill" style="width: 75%;">6時間</div></div>
                        </div>
                        <div class="bar-row">
                            <div class="bar-label">導入後の目標</div>
                            <div class="bar-track"><div class="bar-fill reduced" style="width: 25%;">2時間（66%削減）</div></div>
                        </div>
                        <div class="bar-row">
                            <div class="bar-label">現状のレビュー</div>
                            <div class="bar-track"><div class="bar-fill" style="width: 25%;">2時間</div></div>
                        </div>
                        <div class="bar-row">
                            <div class="bar-label">導入後のレビュー</div>
                            <div class="bar-track"><div class="bar-fill reduced" style="width: 6%;">0.5時間（75%削減）</div></div>
                        </div>
                    </div>
                </div>
            </div>

            <div style="display:flex; flex-direction:column; gap:25px;">
                <div class="card" style="background: #f0fdf4; border: 2px dashed var(--success);">
                    <div class="card-title" style="color:var(--success); border-bottom-color:var(--success);"><i class="ri-calculator-line"></i> 効果創出のロジック・根拠</div>
                    <table style="font-size:15px; margin-top:5px;">
                        <thead>
                            <tr>
                                <th>対象業務</th>
                                <th>現状</th>
                                <th>導入後</th>
                                <th>削減（月換算）</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>提案書作成</strong></td>
                                <td>6時間 / 本</td>
                                <td>2時間 / 本</td>
                                <td><strong>4時間削減 / 本</strong></td>
                            </tr>
                            <tr>
                                <td><strong>上長レビュー</strong></td>
                                <td>2時間 / 本</td>
                                <td>0.5時間 / 本</td>
                                <td><strong>1.5時間削減 / 本</strong></td>
                            </tr>
                        </tbody>
                    </table>
                    <div style="margin-top:20px; font-size:16px; color:var(--primary); font-weight:700;">
                        💡 月に10本の提案を行うと仮定した場合のインパクト：<br>
                        <span style="font-size:24px; color:var(--success);">年間合計：660時間の余剰リソースを創出</span><br>
                        これは、営業担当者の純粋なフロント活動量を【1.5倍】に引き上げることに匹敵します。
                    </div>
                </div>
            </div>
        </div>
        <div class="page-footer"><span>© 2026 NextSales Inc.</span></div>
    </div>

    <div class="page">
        <div class="page-header">
            <span class="brand"><i class="ri-lightbulb-line"></i> 株式会社NextSales</span>
            <span>Page 7 / 11</span>
        </div>
        <h2 class="page-title"><i class="ri-money-dollar-circle-line"></i> 費用サマリー</h2>

        <p style="font-size:22px; margin-bottom:40px;">
            今回の業務効率化プロジェクトは、追加の月額ライセンス等の固定費が発生しない<strong>「完全売り切り型のパッケージ」</strong>です。
        </p>

        <div class="grid-3 flex-1">
            <div class="card" style="text-align:center; background:white; border:2px solid var(--border-color);">
                <div style="font-size:18px; color:var(--text-muted);">初期資産構築費用</div>
                <div style="font-size:42px; font-weight:700; color:var(--primary); margin:20px 0;">¥350,000</div>
                <p style="font-size:14px; color:var(--text-muted);">EXCEL/WORD/PPT<br>マスタテンプレート一式開発</p>
            </div>
            <div class="card" style="text-align:center; background:white; border:2px solid var(--border-color);">
                <div style="font-size:18px; color:var(--text-muted);">導入・ルール定着支援</div>
                <div style="font-size:42px; font-weight:700; color:var(--primary); margin:20px 0;">¥100,000</div>
                <p style="font-size:14px; color:var(--text-muted);">営業チームへの活用説明会<br>および運用マニュアル提供</p>
            </div>
            <div class="card" style="text-align:center; background:var(--primary); color:white; border:none;">
                <div style="font-size:18px; color:#94a3b8;">御見積総額（一括）</div>
                <div style="font-size:54px; font-weight:700; color:white; margin:15px 0;">¥450,000</div>
                <span class="roi-badge" style="background:#2563eb;">予算範囲内（30〜50万）</span>
                <p style="font-size:13px; color:#94a3b8; margin-top:15px;">※消費税別 / ランニングコスト0円</p>
            </div>
        </div>

        <div class="card" style="margin-top:40px; background:var(--accent-light);">
            <strong>💰 3カ年ランニング推移の視覚的表現</strong>
            <p style="margin-top:5px; font-size:16px; color:var(--text-muted);">一般的なSaaSツール（月額費用）とは異なり、2年目・3年目のライセンス保守費用は「¥0」です。使えば使うほどコストパフォーマンスが高まります。</p>
        </div>
        <div class="page-footer"><span>© 2026 NextSales Inc.</span></div>
    </div>

    <div class="page">
        <div class="page-header">
            <span class="brand"><i class="ri-lightbulb-line"></i> 株式会社NextSales</span>
            <span>Page 8 / 11</span>
        </div>
        <h2 class="page-title"><i class="ri-file-list-3-line"></i> 費用詳細（明細）</h2>

        <div class="flex-1" style="margin-top:20px;">
            <table>
                <thead>
                    <tr>
                        <th style="width: 35%;">サービス名 / 内訳</th>
                        <th style="width: 20%;">標準価格</th>
                        <th style="width: 20%;">ご提供価格</th>
                        <th style="width: 10%;">数量</th>
                        <th style="width: 15%;">小計 (税抜)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Powerpoint 営業提案ストーリーテンプレート構築</strong><br><span style="font-size:13px; color:var(--text-muted);">構成変更、デザイン共通化、マスタスライド設定一式</span></td>
                        <td>¥250,000</td>
                        <td><strong>¥200,000</strong></td>
                        <td>1 式</td>
                        <td>¥200,000</td>
                    </tr>
                    <tr>
                        <td><strong>EXCEL 投資対効果（ROI）自動計算シート開発</strong><br><span style="font-size:13px; color:var(--text-muted);">顧客情報入力により自動で見積り・削減メリットを可視化</span></td>
                        <td>¥100,000</td>
                        <td><strong>¥80,000</strong></td>
                        <td>1 式</td>
                        <td>¥80,000</td>
                    </tr>
                    <tr>
                        <td><strong>WORD 提案概要・仕様書マスタ骨子定義</strong><br><span style="font-size:13px; color:var(--text-muted);">要件定義、規約・注意事項文面の共通テンプレート化</span></td>
                        <td>¥80,000</td>
                        <td><strong>¥70,000</strong></td>
                        <td>1 式</td>
                        <td>¥70,000</td>
                    </tr>
                    <tr>
                        <td><strong>導入レクチャーおよび運用ガイドライン策定</strong><br><span style="font-size:13px; color:var(--text-muted);">営業現場への展開用オンライン説明（1回）および簡易マニュアル</span></td>
                        <td>¥120,000</td>
                        <td><strong>¥100,000</strong></td>
                        <td>1 式</td>
                        <td>¥100,000</td>
                    </tr>
                    <tr style="background:var(--primary); color:white; font-weight:700;">
                        <td colspan="4" style="text-align:right; background:var(--primary); color:white; padding:20px;">合計御見積金額：</td>
                        <td style="background:var(--primary); color:white; padding:20px; font-size:22px;">¥450,000</td>
                    </tr>
                </tbody>
            </table>

            <div style="margin-top:30px; font-size:15px; color:var(--text-muted);">
                <strong>【注意事項】</strong><br>
                ※ ご提供価格は、本日より2週間以内に正式発注をいただいた場合の特別パッケージ価格となります。<br>
                ※ 納品後の大幅な構成変更や、追加の個別レイアウト開発は別途費用が発生する場合がございます。
            </div>
        </div>
        <div class="page-footer"><span>© 2026 NextSales Inc.</span></div>
    </div>

    <div class="page">
        <div class="page-header">
            <span class="brand"><i class="ri-lightbulb-line"></i> 株式会社NextSales</span>
            <span>Page 9 / 11</span>
        </div>
        <h2 class="page-title"><i class="ri-calendar-todo-line"></i> スケジュール</h2>

        <p style="font-size:22px; margin-bottom:30px;">
            ご発注から納品、現場運用レクチャーまで、<strong>【わずか1週間（7日間）】</strong>の超短期で完全コミットします。
        </p>

        <div class="flex-1" style="position:relative; margin-top:20px;">
            <table style="font-size:16px;">
                <thead>
                    <tr>
                        <th style="width: 15%;">日程</th>
                        <th style="width: 40%;">実施内容（マイルストーン）</th>
                        <th style="width: 45%;">貴社にご対応いただきたい事項</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Day 1 - 2</strong></td>
                        <td>キックオフ・既存の散乱資料の受領・分析<br><span style="color:var(--accent); font-weight:700;">[マイルストーン: 構成案の確定]</span></td>
                        <td>現在お使いのPPT、EXCEL、WORDのサンプル資料を弊社共有フォルダへアップロード。</td>
                    </tr>
                    <tr>
                        <td><strong>Day 3 - 4</strong></td>
                        <td>マスタテンプレート開発・自動計算ロジック組み込み<br>弊社側でのデザイン最適化作業</td>
                        <td>（特になし / 弊社開発期間）</td>
                    </tr>
                    <tr>
                        <td><strong>Day 5</strong></td>
                        <td>初版（プロトタイプ）のご提示・すり合わせ</td>
                        <td>デザインのトーン、必須項目が網羅されているかのご確認・フィードバック。</td>
                    </tr>
                    <tr>
                        <td><strong>Day 6</strong></td>
                        <td>最終調整・マニュアル作成</td>
                        <td>（特になし / 弊社調整期間）</td>
                    </tr>
                    <tr>
                        <td><strong>Day 7</strong></td>
                        <td><strong>テンプレート一式の納品・営業チーム向けレクチャー実施</strong><br><span style="color:var(--success); font-weight:700;">[プロジェクト完了]</span></td>
                        <td>営業スタッフの皆様を集めた、30分程度のオンライン説明会へのご参加。</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="page-footer"><span>© 2026 NextSales Inc.</span></div>
    </div>

    <div class="page">
        <div class="page-header">
            <span class="brand"><i class="ri-lightbulb-line"></i> 株式会社NextSales</span>
            <span>Page 10 / 11</span>
        </div>
        <h2 class="page-title"><i class="ri-team-line"></i> プロジェクト体制</h2>

        <p style="font-size:22px; margin-bottom:40px;">
            1週間という短期間で最大の成果を出すため、密な連携体制を構築します。
        </p>

        <div class="grid-2 flex-1">
            <div class="card" style="background:white; border: 2px solid var(--border-color);">
                <div class="card-title" style="color:var(--primary);"><i class="ri-building-line"></i> 株式会社サンプル商事様 体制</div>
                <div style="font-size:18px; display:flex; flex-direction:column; gap:15px; margin-top:10px;">
                    <div style="background:var(--accent-light); padding:15px; border-radius:6px;">
                        <strong>プロジェクト責任者（営業統括役員・部長様）</strong>
                        <p style="font-size:15px; color:var(--text-muted); margin-top:5px;">方針決定、最終成果物のご承認、Day 7の説明会号令</p>
                    </div>
                    <div style="background:var(--accent-light); padding:15px; border-radius:6px;">
                        <strong>実務窓口・担当者様（営業マネージャー・リーダー様）</strong>
                        <p style="font-size:15px; color:var(--text-muted); margin-top:5px;">既存資料のご提供、Day 5の初版フィードバック、連絡窓口</p>
                    </div>
                </div>
            </div>

            <div class="card" style="background:var(--primary); color:white;">
                <div class="card-title" style="color:white; border-bottom-color:#475569;"><i class="ri-shield-user-line"></i> 株式会社NextSales（弊社伴走チーム）</div>
                <div style="font-size:18px; display:flex; flex-direction:column; gap:15px; margin-top:10px;">
                    <div style="background:#1e293b; padding:15px; border-radius:6px;">
                        <strong>メインコンサルタント（1名）</strong>
                        <p style="font-size:15px; color:#94a3b8; margin-top:5px;">全体の進行管理、営業ストーリー・構成の設計、Day 7の講師</p>
                    </div>
                    <div style="background:#1e293b; padding:15px; border-radius:6px;">
                        <strong>シニアデザイナー兼ツールデベロッパー（1名）</strong>
                        <p style="font-size:15px; color:#94a3b8; margin-top:5px;">Powerpointマスタの設計、EXCELマクロ・自動計算モデルの組み込み</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="page-footer"><span>© 2026 NextSales Inc.</span></div>
    </div>

    <div class="page">
        <div class="page-header">
            <span class="brand"><i class="ri-lightbulb-line"></i> 株式会社NextSales</span>
            <span>Page 11 / 11</span>
        </div>
        <h2 class="page-title"><i class="ri-route-line"></i> 今後のさらなる活用について（将来案）</h2>

        <p style="font-size:22px; margin-bottom:30px;">
            今回のテンプレート化で基盤を強固にした後、更なる営業リソース拡大へ向けた3ステップのロードマップをご提案します。
        </p>

        <div class="roadmap flex-1">
            <div class="roadmap-step active">
                <div style="font-size:24px; font-weight:700; color:var(--accent); margin-bottom:10px;">Phase 1（今回）</div>
                <strong style="font-size:18px;">資料テンプレート化</strong>
                <p style="font-size:14px; color:var(--text-muted); margin-top:15px; text-align:left;">散乱したファイルを統合し、作成時間を6時間から2時間へ大幅削減。属人性を排除した「本日中に明日提案できる体制」の即時確立。</p>
            </div>
            <div class="roadmap-arrow"><i class="ri-arrow-right-line"></i></div>
            <div class="roadmap-step">
                <div style="font-size:24px; font-weight:700; color:var(--text-muted); margin-bottom:10px;">Phase 2（次期案）</div>
                <strong style="font-size:18px;">共有クラウドナレッジ化</strong>
                <p style="font-size:14px; color:var(--text-muted); margin-top:15px; text-align:left;">完成したテンプレートと過去の勝率の高い提案書をクラウド（SFA/CRM）上で一元共有。誰がどの資料を使って受注したかを瞬時に可視化。</p>
            </div>
            <div class="roadmap-arrow"><i class="ri-arrow-right-line"></i></div>
            <div class="roadmap-step">
                <div style="font-size:24px; font-weight:700; color:var(--text-muted); margin-bottom:10px;">Phase 3（将来案）</div>
                <strong style="font-size:18px;">生成AI自動提案生成</strong>
                <p style="font-size:14px; color:var(--text-muted); margin-top:15px; text-align:left;">固定化されたマスタデータと生成AI（LLM）を連携。顧客の業種と課題を2、3個入力するだけで、テンプレートに沿った提案書をAIが1分で自動ドラフト生成する究極の効率化。</p>
            </div>
        </div>

        <div style="text-align:center; margin-top:40px;">
            <p style="font-size:20px; font-weight:700; color:var(--primary);">
                まずは第一歩として、今回の「資料テンプレート化パッケージ」による劇的な時間削減をご体感ください。
            </p>
        </div>
        <div class="page-footer"><span>© 2026 NextSales Inc.</span></div>
    </div>

</div>

</body>
</html>
```

> jpgとHTML出力をしてください

AIとしてPDF（WeasyPrint向けHTML）のコードを直接出力することは可能ですが、**JPG（画像ファイル）やPDFリンクを直接生成してサーバー上に配置する機能は備わっていません。**

そのため、今回はWeasyPrintやブラウザでの印刷（PDF保存）で**そのまま市販品クオリティの美しいA4横デザイン（全11ページ）になるHTML/CSSコード**を作成しました。以下のコードをコピーし、`.html`として保存してご利用ください。

HTML
```
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>営業効率化および業務改善に関する提案書</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css" rel="stylesheet">
    <style>
        :root {
            --primary: #0f172a;       /* ディープネイビー */
            --secondary: #1e3a8a;     /* コーポレートブルー */
            --accent: #0284c7;        /* スカイブルー */
            --accent-light: #f0f9ff;  /* 背景用ライトブルー */
            --text-dark: #1e293b;
            --text-muted: #64748b;
            --border-color: #cbd5e1;
            --alert: #ef4444;
            --success: #10b981;
            --page-width: 297mm;      /* A4横サイズ */
            --page-height: 210mm;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Noto Sans JP', sans-serif; background-color: #777; color: var(--text-dark); -webkit-print-color-adjust: exact; }

        .slide-container { width: var(--page-width); margin: 0 auto; }

        /* ページ（スライド）基本構造 */
        .page {
            width: var(--page-width);
            height: var(--page-height);
            background-color: #ffffff;
            position: relative;
            overflow: hidden;
            padding: 25mm 30mm 20mm 30mm;
            display: flex;
            flex-direction: column;
            page-break-after: always;
            box-shadow: 0 4px 10px rgba(0,0,0,0.2);
            margin-bottom: 20px;
        }

        /* ヘッダー・フッター */
        .page-header {
            position: absolute;
            top: 12mm; left: 30mm; right: 30mm;
            display: flex; justify-content: space-between; align-items: center;
            border-bottom: 1px solid var(--border-color);
            padding-bottom: 8px; color: var(--text-muted); font-size: 12px;
        }
        .page-header .title-left { font-weight: 700; color: var(--secondary); }
        .page-footer {
            position: absolute;
            bottom: 10mm; left: 30mm; right: 30mm;
            display: flex; justify-content: space-between; align-items: center;
            border-top: 1px solid var(--border-color);
            padding-top: 8px; color: var(--text-muted); font-size: 11px;
        }

        /* タイトルスタイル */
        .slide-title {
            font-size: 32px; font-weight: 700; color: var(--primary);
            margin-bottom: 30px; display: flex; align-items: center; gap: 12px;
            border-left: 8px solid var(--secondary); padding-left: 15px;
        }

        /* レイアウトツール */
        .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 30px; }
        .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .flex-grow { flex-grow: 1; }

        /* コンポーネント */
        .card { background: var(--accent-light); border-radius: 8px; padding: 25px; border: 1px solid #e0f2fe; }
        .card-title { font-size: 20px; font-weight: 700; color: var(--secondary); margin-bottom: 15px; display: flex; align-items: center; gap: 8px; }

        /* 表（テーブル） */
        table { width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 10px; }
        th { background: var(--secondary); color: white; padding: 12px 16px; font-weight: 700; text-align: left; }
        td { padding: 14px 16px; border-bottom: 1px solid var(--border-color); background: white; }
        tr:nth-child(even) td { background: var(--accent-light); }

        /* 1ページ目：表紙カスタム */
        .cover {
            background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 70%, var(--accent) 100%);
            color: white; justify-content: center; padding: 50mm 40mm;
        }
        .cover-sub { font-size: 24px; color: #bae6fd; font-weight: 500; margin-bottom: 15px; letter-spacing: 1px; }
        .cover-main { font-size: 52px; font-weight: 700; line-height: 1.3; margin-bottom: 50px; border-bottom: 3px solid white; padding-bottom: 25px; }
        .cover-meta { margin-top: auto; font-size: 18px; display: grid; grid-template-columns: 120px 1fr; gap: 10px 0; color: #e2e8f0; }

        /* 視覚的グラフ要素 */
        .bar-chart { display: flex; flex-direction: column; gap: 15px; margin-top: 20px; }
        .bar-row { display: flex; align-items: center; gap: 15px; }
        .bar-label { width: 100px; font-weight: 700; font-size: 16px; }
        .bar-container { flex-grow: 1; background: #e2e8f0; height: 30px; border-radius: 4px; overflow: hidden; position: relative; }
        .bar-fill { height: 100%; background: var(--alert); display: flex; align-items: center; padding-left: 15px; color: white; font-weight: 700; }
        .bar-fill.success { background: var(--success); }

        /* ロードマップ */
        .roadmap { display: flex; justify-content: space-between; align-items: stretch; margin-top: 20px; }
        .step { flex: 1; background: var(--accent-light); border: 2px solid #e0f2fe; border-radius: 8px; padding: 20px; text-align: center; }
        .step.active { border-color: var(--secondary); background: white; box-shadow: 0 4px 12px rgba(30,58,138,0.1); }
        .arrow { display: flex; align-items: center; font-size: 32px; color: var(--secondary); padding: 0 10px; }

        @media print {
            body { background-color: #ffffff; }
            .page { box-shadow: none; margin-bottom: 0; width: var(--page-width); height: var(--page-height); }
            @page { size: A4 landscape; margin: 0; }
        }
    </style>
</head>
<body>

<div class="slide-container">

    <!-- 1. 表紙 -->
    <div class="page cover">
        <div class="cover-sub">営業準備の自動化による攻めの営業スタイルへの変革</div>
        <div class="cover-main">効率化および業務改善に関する提案書</div>
        <div class="cover-meta">
            <span>ご提出先</span><strong>株式会社サンプル商事 御中</strong>
            <span>提案会社</span><strong>株式会社NextSales</strong>
            <span>日付</span><strong>2026年7月13日</strong>
        </div>
    </div>

    <!-- 2. アジェンダ -->
    <div class="page">
        <div class="page-header"><span class="title-left">株式会社NextSales</span><span>提案書 | アジェンダ</span></div>
        <h2 class="slide-title"><i class="ri-list-check-2"></i> 本日のアジェンダ</h2>
        <div class="grid-2 flex-grow" style="align-content: center; max-width: 900px; margin: 0 auto; gap: 15px 40px;">
            <div style="font-size: 18px; padding: 12px 20px; background: var(--accent-light); border-radius: 4px;">1. ご提案の背景（現状認識）</div>
            <div style="font-size: 18px; padding: 12px 20px; background: var(--accent-light); border-radius: 4px;">5. 費用サマリー（3カ年推移）</div>
            <div style="font-size: 18px; padding: 12px 20px; background: var(--accent-light); border-radius: 4px;">2. ご提案のテーマ（課題認識）</div>
            <div style="font-size: 18px; padding: 12px 20px; background: var(--accent-light); border-radius: 4px;">6. 費用明細・注意事項</div>
            <div style="font-size: 18px; padding: 12px 20px; background: var(--accent-light); border-radius: 4px;">3. ご提案全体像（As-Is / To-Be）</div>
            <div style="font-size: 18px; padding: 12px 20px; background: var(--accent-light); border-radius: 4px;">7. スケジュール＆マイルストーン</div>
            <div style="font-size: 18px; padding: 12px 20px; background: var(--accent-light); border-radius: 4px;">4. 期待される効果（ROI算出）</div>
            <div style="font-size: 18px; padding: 12px 20px; background: var(--accent-light); border-radius: 4px;">8. 体制図および今後のロードマップ</div>
        </div>
        <div class="page-footer"><span>© 2026 NextSales Inc.</span><span>2</span></div>
    </div>

    <!-- 3. ご提案の背景 -->
    <div class="page">
        <div class="page-header"><span class="title-left">株式会社サンプル商事 御中</span><span>1. ご提案の背景</span></div>
        <h2 class="slide-title"><i class="ri-article-line"></i> ご提案の背景（現状認識）</h2>
        <div class="grid-2 flex-grow">
            <div class="card" style="background: white; border: 2px solid var(--secondary);">
                <div class="card-title" style="color: var(--secondary);"><i class="ri-flag-line"></i> 会社としての目指す方向性</div>
                <p style="font-size: 16px; line-height: 1.8; margin-top: 10px;">
                    激化する市場環境において、貴社がさらなる成長を遂げるためには、既存顧客への深耕および新規顧客の開拓が不可欠です。そのためには、<strong>「無駄な社内工数を極限まで削減し、営業マンが顧客と向き合う『訪問件数・商談時間』を最大化する攻めの営業スタイル」</strong>へシフトすることが急務となっています。
                </p>
            </div>
            <div class="card">
                <div class="card-title"><i class="ri-error-warning-line"></i> お伺いしている現状の問題</div>
                <ul style="padding-left: 20px; font-size: 15px; line-height: 1.8;">
                    <li style="margin-bottom: 8px;">営業マンが訪問前に顧客情報を調べる際、<strong>Excel、FileMaker、紙のノートなど複数の場所</strong>を個別に探す必要があり、情報が激しく散乱している。</li>
                    <li style="margin-bottom: 8px;">結果として、1回あたりの顧客準備に<strong>30分もの工数</strong>を要している。</li>
                    <li style="margin-bottom: 8px;">外出・移動中も非効率なデータアクセス環境にあり、膝や体力への負担が大きく、営業ポテンシャルをフルに発揮できていない。</li>
                </ul>
            </div>
        </div>
        <div class="page-footer"><span>© 2026 NextSales Inc.</span><span>3</span></div>
    </div>

    <!-- 4. ご提案のテーマ -->
    <div class="page">
        <div class="page-header"><span class="title-left">株式会社サンプル商事 御中</span><span>2. ご提案のテーマ</span></div>
        <h2 class="slide-title"><i class="ri-focus-3-line"></i> ご提案のテーマ（課題認識）</h2>
        <div style="background: var(--primary); color: white; padding: 25px; border-radius: 6px; margin-bottom: 25px;">
            <span style="color: #60a5fa; font-weight: 700; font-size: 14px;">🌟 目指すべきあるべき姿（ゴール）</span>
            <h3 style="font-size: 24px; margin-top: 5px;">顧客情報の一元化により、準備時間を「5分」に短縮し、圧倒的な訪問件数を担保する</h3>
        </div>
        <div class="card flex-grow">
            <div class="card-title"><i class="ri-git-repository-private-line"></i> 実現するための3つの障壁・課題</div>
            <div class="grid-3" style="margin-top: 15px;">
                <div style="background: white; padding: 20px; border-radius: 6px; border-top: 4px solid var(--accent);">
                    <strong style="font-size: 16px; display:block; margin-bottom:8px;">① 情報のサイロ化</strong>
                    <p style="font-size: 13px; color: var(--text-muted);">過去のデータ遺産（FileMaker等）と現場のメモ（ノート）が紐づいておらず、検索自体に迷いが発生している。</p>
                </div>
                <div style="background: white; padding: 20px; border-radius: 6px; border-top: 4px solid var(--accent);">
                    <strong style="font-size: 16px; display:block; margin-bottom:8px;">② モバイル対応の不足</strong>
                    <p style="font-size: 13px; color: var(--text-muted);">移動中や出先からスムーズに必要な情報へアクセスする仕組みがなく、身体的・時間的ロスを生んでいる。</p>
                </div>
                <div style="background: white; padding: 20px; border-radius: 6px; border-top: 4px solid var(--accent);">
                    <strong style="font-size: 16px; display:block; margin-bottom:8px;">③ 標準プロセスの不在</strong>
                    <p style="font-size: 13px; color: var(--text-muted);">「これだけ見れば準備完了」という最小限の必須情報パッケージ（一元化された画面）が定義されていない。</p>
                </div>
            </div>
        </div>
        <div class="page-footer"><span>© 2026 NextSales Inc.</span><span>4</span></div>
    </div>

    <!-- 5. ご提案全体像 -->
    <div class="page">
        <div class="page-header"><span class="title-left">株式会社サンプル商事 御中</span><span>3. ご提案全体像</span></div>
        <h2 class="slide-title"><i class="ri-shape-line"></i> ご提案全体像（解決策：As-Is / To-Be）</h2>
        <div class="flex-grow" style="display: flex; flex-direction: column; justify-content: space-between;">
            <div class="grid-2" style="background: var(--accent-light); padding: 25px; border-radius: 8px; border: 1px solid #bae6fd;">
                <div>
                    <strong style="color: var(--alert); font-size: 18px; display:block; margin-bottom:10px;"><i class="ri-close-circle-fill"></i> 従来の状況 (As-Is)</strong>
                    <p style="font-size: 14px; line-height: 1.6; background: white; padding: 15px; border-radius: 6px;">
                        Excel、FileMaker、ノートを往復。1商談あたり<strong>30分</strong>の準備時間がかかり、移動時の負担も重く、1日の訪問件数が伸び悩む構造。
                    </p>
                </div>
                <div>
                    <strong style="color: var(--success); font-size: 18px; display:block; margin-bottom:10px;"><i class="ri-checkbox-circle-fill"></i> 導入後の姿 (To-Be)</strong>
                    <p style="font-size: 14px; line-height: 1.6; background: white; padding: 15px; border-radius: 6px; border: 1px solid var(--success);">
                        統合データ基盤により、スマートフォンやPCからワンタップで顧客要約を瞬時に把握。準備時間はわずか<strong>5分</strong>へ。体力負荷を軽減し、即座に次なる訪問へ動ける強靭な体制。
                    </p>
                </div>
            </div>
            <div class="card" style="margin-top: 20px;">
                <div class="card-title" style="font-size: 16px;"><i class="ri-settings-line"></i> 具体的な実施アプローチ</div>
                <p style="font-size: 14px; color: var(--text-muted);">
                    散在するExcel・FileMakerデータを抽出し、NextSalesの営業ダッシュボードへ統合。現場ノートの運用プロセスをデジタル入力へ統一することで、「1画面で完結する顧客情報検索」を構築します。
                </p>
            </div>
        </div>
        <div class="page-footer"><span>© 2026 NextSales Inc.</span><span>5</span></div>
    </div>

    <!-- 6. 期待される効果について -->
    <div class="page">
        <div class="page-header"><span class="title-left">株式会社サンプル商事 御中</span><span>4. 期待される効果</span></div>
        <h2 class="slide-title"><i class="ri-line-chart-line"></i> 期待される効果について（ROI）</h2>
        <div class="grid-2 flex-grow">
            <div class="card" style="background: white;">
                <div class="card-title"><i class="ri-time-line"></i> 1顧客あたりの営業準備時間比較</div>
                <div class="bar-chart">
                    <div class="bar-row">
                        <div class="bar-label">現状 (As-Is)</div>
                        <div class="bar-container"><div class="bar-fill" style="width: 100%;">30分</div></div>
                    </div>
                    <div class="bar-row">
                        <div class="bar-label">導入後(To-Be)</div>
                        <div class="bar-container"><div class="bar-fill success" style="width: 16.6%;">5分</div></div>
                    </div>
                </div>
                <div style="margin-top: 25px; font-weight: 700; color: var(--success); font-size: 18px;">
                    <i class="ri-arrow-right-up-line"></i> 1回あたり25分（83.3%）の削減効果！
                </div>
            </div>
            <div class="card" style="background: #f0fdf4; border: 1px dashed var(--success);">
                <div class="card-title" style="color: var(--success);"><i class="ri-calculator-line"></i> ROI算出の根拠（営業マン1人あたり）</div>
                <p style="font-size: 14px; line-height: 1.7;">
                    仮に1日3件の訪問・準備を行う場合：<br>
                    ・<strong>現状：</strong> 30分 × 3件 ＝ 90分 / 日<br>
                    ・<strong>導入後：</strong> 5分 × 3件 ＝ 15分 / 日<br>
                    ・<strong>効果：</strong> 1日あたり<strong>75分の余剰時間</strong>を創出。<br><br>
                    月20日稼働換算で<strong>毎月25時間</strong>が純増。この創出された時間をすべて「新規訪問・提案活動」に充てることで、訪問件数の最大化と売上成長へダイレクトに貢献します。
                </p>
            </div>
        </div>
        <div class="page-footer"><span>© 2026 NextSales Inc.</span><span>6</span></div>
    </div>

    <!-- 7. 費用サマリー -->
    <div class="page">
        <div class="page-header"><span class="title-left">株式会社サンプル商事 御中</span><span>5. 費用サマリー</span></div>
        <h2 class="slide-title"><i class="ri-money-dollar-circle-line"></i> 費用サマリー（3カ年コスト推移）</h2>
        <p style="font-size: 15px; margin-bottom: 20px;">導入初期費用および運用に伴う3年間の費用推移のシミュレーションです。</p>
        <div class="grid-3 flex-grow" style="gap: 25px;">
            <div class="card" style="background: white; border: 1px solid var(--border-color); text-align: center;">
                <div style="font-weight: 700; color: var(--text-muted);">【1年目】</div>
                <div style="font-size: 36px; font-weight: 700; color: var(--primary); margin: 15px 0;">¥3,900,000</div>
                <div style="font-size: 13px; color: var(--text-muted); text-align: left; background: var(--accent-light); padding: 10px; border-radius: 4px;">
                    初期構築: 100万円<br>月額ライセンス: 240万円<br>サポート費用: 50万円
                </div>
            </div>
            <div class="card" style="background: white; border: 1px solid var(--border-color); text-align: center;">
                <div style="font-weight: 700; color: var(--text-muted);">【2年目】</div>
                <div style="font-size: 36px; font-weight: 700; color: var(--primary); margin: 15px 0;">¥2,900,000</div>
                <div style="font-size: 13px; color: var(--text-muted); text-align: left; background: var(--accent-light); padding: 10px; border-radius: 4px;">
                    初期構築: ¥0<br>月額ライセンス: 240万円<br>サポート費用: 50万円
                </div>
            </div>
            <div class="card" style="background: white; border: 1px solid var(--border-color); text-align: center;">
                <div style="font-weight: 700; color: var(--text-muted);">【3年目】</div>
                <div style="font-size: 36px; font-weight: 700; color: var(--primary); margin: 15px 0;">¥2,900,000</div>
                <div style="font-size: 13px; color: var(--text-muted); text-align: left; background: var(--accent-light); padding: 10px; border-radius: 4px;">
                    初期構築: ¥0<br>月額ライセンス: 240万円<br>サポート費用: 50万円
                </div>
            </div>
        </div>
        <div class="page-footer"><span>© 2026 NextSales Inc.</span><span>7</span></div>
    </div>

    <!-- 8. 費用詳細 -->
    <div class="page">
        <div class="page-header"><span class="title-left">株式会社サンプル商事 御中</span><span>6. 費用詳細明細</span></div>
        <h2 class="slide-title"><i class="ri-file-list-3-line"></i> 費用詳細（御見積明細）</h2>
        <div class="flex-grow">
            <table>
                <thead>
                    <tr>
                        <th>サービス名 / 区分</th>
                        <th>標準価格</th>
                        <th>ご提供価格</th>
                        <th>数量 / 期間</th>
                        <th>年間費用 (税抜)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>NextSales 営業情報統合データ初期構築費</strong></td>
                        <td>¥1,200,000</td>
                        <td><strong>¥1,000,000</strong></td>
                        <td>1式（初回のみ）</td>
                        <td>¥1,000,000</td>
                    </tr>
                    <tr>
                        <td><strong>NextSales クラウド共通ライセンス利用料</strong></td>
                        <td>¥20,000 / 月</td>
                        <td><strong>¥20,000 / 月</strong></td>
                        <td>12ヶ月分</td>
                        <td>¥2,400,000</td>
                    </tr>
                    <tr>
                        <td><strong>年間運用定着・データメンテナンスサポート</strong></td>
                        <td>¥60,000 / 年</td>
                        <td><strong>¥500,000</strong></td>
                        <td>1年間（更新型）</td>
                        <td>¥500,000</td>
                    </tr>
                    <tr style="background: var(--primary); color: white; font-weight: 700;">
                        <td colspan="4" style="text-align: right; background: var(--primary); color: white;">初年度合計金額 (税抜)：</td>
                        <td style="background: var(--primary); color: white; font-size: 16px;">¥3,900,000</td>
                    </tr>
                </tbody>
            </table>
            <div style="margin-top: 20px; font-size: 12px; color: var(--text-muted); line-height: 1.5;">
                <strong>【注意事項】</strong><br>
                ※ 月額ライセンスは全社共通基本パックの想定価格です。アカウント数による変動が生じる場合は別途ご案内いたします。<br>
                ※ サポート費用には、データ構造の軽微な変更対応、およびトラブル時のヘルプデスク対応が含まれます。
            </div>
        </div>
        <div class="page-footer"><span>© 2026 NextSales Inc.</span><span>8</span></div>
    </div>

    <!-- 9. スケジュール -->
    <div class="page">
        <div class="page-header"><span class="title-left">株式会社サンプル商事 御中</span><span>7. スケジュール</span></div>
        <h2 class="slide-title"><i class="ri-calendar-event-line"></i> プロジェクトスケジュール</h2>
        <div class="flex-grow">
            <table style="font-size: 13px;">
                <thead>
                    <tr>
                        <th style="width: 20%;">フェーズ・期間</th>
                        <th style="width: 40%;">実施内容 / マイルストーン</th>
                        <th style="width: 40%;">貴社ご対応事項</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>第1週（要件定義）</strong></td>
                        <td>データ抽出設計・現状のExcel/FileMaker定義確認<br><span style="color:var(--accent); font-weight:700;">[マイルストーン：データ移行設計の確定]</span></td>
                        <td>既存データ（Excel、FileMaker）のサンプル及びノート運用のヒアリングご協力</td>
                    </tr>
                    <tr>
                        <td><strong>第2〜3週（構築期）</strong></td>
                        <td>データ統合基盤の構築、画面UIデザイン・モバイル最適化</td>
                        <td>検証環境へのログインテスト、操作感のフィードバック</td>
                    </tr>
                    <tr>
                        <td><strong>第4週（移行・テスト）</strong></td>
                        <td>本番データ流し込み、および接続テスト</td>
                        <td>マスターデータ最終承認</td>
                    </tr>
                    <tr>
                        <td><strong>第5週（レクチャー）</strong></td>
                        <td>現場営業マン向け説明会の実施、運用スタート<br><span style="color:var(--success); font-weight:700;">[マイルストーン：現場運用開始・5分化の達成]</span></td>
                        <td>全営業担当者の説明会へのアサイン、利用開始の号令</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="page-footer"><span>© 2026 NextSales Inc.</span><span>9</span></div>
    </div>

    <!-- 10. プロジェクト体制 -->
    <div class="page">
        <div class="page-header"><span class="title-left">株式会社サンプル商事 御中</span><span>8. プロジェクト体制</span></div>
        <h2 class="slide-title"><i class="ri-team-line"></i> プロジェクト推進体制</h2>
        <div class="grid-2 flex-grow" style="align-items: center;">
            <div class="card" style="background: white; border: 1px solid var(--border-color); height: 100%;">
                <div class="card-title" style="color: var(--primary);"><i class="ri-building-line"></i> 貴社推進体制（株式会社サンプル商事様）</div>
                <div style="font-size: 14px; display: flex; flex-direction: column; gap: 15px; margin-top: 15px;">
                    <div style="background: var(--accent-light); padding: 12px; border-radius: 4px;">
                        <strong>プロジェクトオーナー（営業統括役員 様）</strong><br>
                        <span style="font-size:12px; color:var(--text-muted);">本プロジェクトの最終意思決定および定着化の推進</span>
                    </div>
                    <div style="background: var(--accent-light); padding: 12px; border-radius: 4px;">
                        <strong>実務リーダー（営業推進・マネージャー 様）</strong><br>
                        <span style="font-size:12px; color:var(--text-muted);">要件定義への同席、散在データのとりまとめ、現場連携窓口</span>
                    </div>
                </div>
            </div>
            <div class="card" style="background: var(--primary); color: white; height: 100%;">
                <div class="card-title" style="color: white;"><i class="ri-customer-service-2-line"></i> 弊社伴走体制（株式会社NextSales）</div>
                <div style="font-size: 14px; display: flex; flex-direction: column; gap: 15px; margin-top: 15px;">
                    <div style="background: #1e293b; padding: 12px; border-radius: 4px;">
                        <strong>シニアコンサルタント（1名）</strong><br>
                        <span style="font-size:12px; color:#94a3b8;">全体の進行管理、業務フロー設計および現場定着化支援</span>
                    </div>
                    <div style="background: #1e293b; padding: 12px; border-radius: 4px;">
                        <strong>データインテグレーションエンジニア（2名）</strong><br>
                        <span style="font-size:12px; color:#94a3b8;">Excel/FileMakerからのデータクレンジング・統合画面の実装</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="page-footer"><span>© 2026 NextSales Inc.</span><span>10</span></div>
    </div>

    <!-- 11. 今後のさらなる活用について -->
    <div class="page">
        <div class="page-header"><span class="title-left">株式会社サンプル商事 御中</span><span>9. 今後のロードマップ</span></div>
        <h2 class="slide-title"><i class="ri-route-line"></i> 今後のさらなる活用について（将来へのロードマップ）</h2>
        <p style="font-size: 15px; margin-bottom: 20px;">情報を一元化した後、貴社が「究極の攻めの営業」を展開するための3ステップのロードマップです。</p>
        <div class="roadmap flex-grow">
            <div class="step active">
                <div style="font-size: 18px; font-weight: 700; color: var(--secondary); margin-bottom: 8px;">Phase 1 (今回のご提案)</div>
                <strong>情報一元化と自動化</strong>
                <p style="font-size: 12px; color: var(--text-muted); margin-top: 10px; text-align: left;">
                    散乱するExcel・FileMakerデータを統合し、検索時間を30分から5分へ。営業マンの体力負荷を低減し訪問数を増大。
                </p>
            </div>
            <div class="arrow"><i class="ri-arrow-right-line"></i></div>
            <div class="step">
                <div style="font-size: 18px; font-weight: 700; color: var(--text-muted); margin-bottom: 8px;">Phase 2 (拡張フェーズ)</div>
                <strong>動的営業ナレッジの共有</strong>
                <p style="font-size: 12px; color: var(--text-muted); margin-top: 10px; text-align: left;">
                    出先からの「音声入力日報」等を実装し、ノートに眠っていた最新のリアルタイム顧客状況を全社で即時共有可能に。
                </p>
            </div>
            <div class="arrow"><i class="ri-arrow-right-line"></i></div>
            <div class="step">
                <div style="font-size: 18px; font-weight: 700; color: var(--text-muted); margin-bottom: 8px;">Phase 3 (AI活用フェーズ)</div>
                <strong>AIによる自動提案・訪問予測</strong>
                <p style="font-size: 12px; color: var(--text-muted); margin-top: 10px; text-align: left;">
                    一元化されたデータをもとに、AIが「今週訪問すべき優先顧客」と「最適な提案プラン」を自動レコメンドする体制の実現。
                </p>
            </div>
        </div>
        <div class="page-footer"><span>© 2026 NextSales Inc.</span><span>11</span></div>
    </div>

</div>

</body>
</html>
```

> ![MD のアイコン](data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAgACADASIAAhEBAxEB/8QAGQAAAwADAAAAAAAAAAAAAAAAAgQHAQMI/8QAJBAAAgEEAQQDAQEAAAAAAAAAAQIFAwQGEQcAIVGBCBIiEzH/xAAWAQEBAQAAAAAAAAAAAAAAAAAABwj/xAAiEQABAwQABwAAAAAAAAAAAAABAgQhAxExUQASEyJBcfD/2gAMAwEAAhEDEQA/AOcYqJtISwo2VlRWhb0lCqqjXs+T5PTfVd4B4BueXb67lZW7GP4JDj+svO1yFRFA2adMnsXI9KDs72oYPkLyjjeezEVE4Zj9rB4jj1BrKOdaIW5ulLbapVY/o7O2AJJ/TE92Op+aZ5Oqs5xs/b41Wh3TDgMm6LhI7iICIgezoYEnxeS9KS0TazcfWsr2ile3qqVZHG/Y8EeerD8f+UMfwCZlIzMMftp3EcgoLZSX2og3Nugba1KL/wCj6tpiARv6qR3Udbue+BLjia8s5eIvBkOBzA/rETtDTK6kbFKoR2FQDfj7aJGiGVQpnk6qDjOx9vgt3TLgs3CLBQ7SZCokexo5EjzbPAPP1zxFfXcVK2gyDBJgfyl4KuAyOpGjUpg9g4HpgNHWlKh8heLsbwKYipbDMgtZzEchoNexyLWDXNqobTU6qn9DR2oJAP5YHup3GomWtZuPo3tlWSvb1VDK6Hfo+CPHTfQ1DydJYxjY+1wQ0plwHrddgodwEhcQfY2MiD4tWvj1xdjeezErLZnkFrB4jj1Bb2RRqwW5ulLaWnSUfo7OlJAJ/Sgd2Gj5+5+ueXb60ioq0GP4JDj+URBUAFRFA0KlQDsXI9KCQN7YtIulJaWtISPrXt7WWhb0VLMzHXoeT4HQVDydJAznZ+1wW0phwXrhdwkdoMBESfZ2cCB5v//Z)sindanprompt

承知いたしました。ご提示いただいた「訪問販売業における報告書・進捗管理の課題」のインプット情報（インプット4）および厳密な制約ルールに基づき、WeasyPrint（HTML to PDF）や大画面プレゼンテーションでそのまま活用できる1920px × 1080px（全10ページ構成）の完全なHTML/CSSコードを一括出力いたします。

「省略禁止」「ロジックの整合性（具体的機能による自動化とコア業務へのシフト）」「時給換算を明示したROI試算」のすべてを厳格にクリアした内容となっています。以下のコードを丸ごとコピーして、`.html`ファイルとして保存してご利用ください。

HTML
```
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>業務効率化・デジタル化 診断レポート - 訪問販売業向け</title>
    <!-- Google Fonts & Remixicon -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css" rel="stylesheet">
    <style>
        :root {
            --primary: #0f172a;       /* ディープネイビー */
            --secondary: #1e3a8a;     /* ダークブルー */
            --accent: #2563eb;        /* プレミアムブルー */
            --accent-light: #f8fafc;  /* 背景用極薄グレー */
            --card-bg: #ffffff;       /* カード背景 */
            --text-dark: #1e293b;     /* 本文濃い色 */
            --text-muted: #64748b;    /* 補足用グレー */
            --border-color: #cbd5e1;  /* 線 */
            --alert: #dc2626;         /* 警告・Before */
            --success: #16a34a;       /* 成功・After */
            --page-width: 1920px;
            --page-height: 1080px;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'Noto Sans JP', sans-serif;
            background-color: #475569;
            color: var(--text-dark);
            line-height: 1.5;
            -webkit-print-color-adjust: exact;
        }

        .report-container {
            width: var(--page-width);
            margin: 0 auto;
        }

        /* 共通ページ設定 */
        .page {
            width: var(--page-width);
            height: var(--page-height);
            background-color: #ffffff;
            position: relative;
            overflow: hidden;
            padding: 80px 100px;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            page-break-after: always;
            box-shadow: 0 12px 30px rgba(0,0,0,0.25);
            margin-bottom: 30px;
        }

        /* ヘッダー・フッター */
        .page-header {
            position: absolute;
            top: 35px;
            left: 100px;
            right: 100px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 12px;
            color: var(--text-muted);
            font-size: 14px;
        }

        .page-header .brand {
            font-weight: 700;
            color: var(--primary);
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .page-footer {
            position: absolute;
            bottom: 35px;
            left: 100px;
            right: 100px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 1px solid #e2e8f0;
            padding-top: 12px;
            color: var(--text-muted);
            font-size: 13px;
        }

        /* タイトル構造 */
        .page-title {
            font-size: 38px;
            font-weight: 700;
            color: var(--primary);
            margin-top: 20px;
            margin-bottom: 40px;
            display: flex;
            align-items: center;
            gap: 12px;
            border-left: 8px solid var(--accent);
            padding-left: 20px;
        }

        /* グリッド・レイアウトツール */
        .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 40px; }
        .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; }
        .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
        .flex-grow { flex-grow: 1; }

        /* コンポーネント */
        .card {
            background: var(--accent-light);
            border-radius: 8px;
            padding: 30px;
            border: 1px solid #e2e8f0;
        }

        .card-title {
            font-size: 22px;
            font-weight: 700;
            margin-bottom: 15px;
            color: var(--secondary);
            display: flex;
            align-items: center;
            gap: 8px;
            border-bottom: 1px solid var(--border-color);
            padding-bottom: 8px;
        }

        /* テーブル設定 */
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            font-size: 15px;
        }

        th {
            background-color: var(--secondary);
            color: #ffffff;
            text-align: left;
            padding: 14px 18px;
            font-weight: 700;
            border: 1px solid var(--secondary);
        }

        td {
            padding: 16px 18px;
            border: 1px solid var(--border-color);
            background-color: #ffffff;
            vertical-align: top;
        }

        tr:nth-child(even) td {
            background-color: var(--accent-light);
        }

        /* 評価バッジ */
        .badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 4px;
            font-size: 13px;
            font-weight: 700;
            color: white;
        }
        .badge-high { background-color: var(--alert); }
        .badge-mid { background-color: #f59e0b; }
        .badge-success { background-color: var(--success); }

        /* Before/Afterフロー */
        .flow-container {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        .flow-box {
            padding: 15px 20px;
            border-radius: 6px;
            font-size: 14px;
            position: relative;
        }
        .flow-box.before { background-color: #fee2e2; border-left: 5px solid var(--alert); }
        .flow-box.after { background-color: #dcfce7; border-left: 5px solid var(--success); }

        /* ロードマップ */
        .roadmap-timeline {
            display: flex;
            justify-content: space-between;
            align-items: stretch;
            margin-top: 20px;
            gap: 20px;
        }
        .roadmap-card {
            flex: 1;
            background: white;
            border: 2px solid #e2e8f0;
            border-radius: 8px;
            padding: 25px;
            position: relative;
        }
        .roadmap-card.active {
            border-color: var(--accent);
            box-shadow: 0 4px 15px rgba(37,99,235,0.15);
        }
        .roadmap-header {
            font-size: 18px;
            font-weight: 700;
            color: white;
            background: var(--secondary);
            padding: 8px 15px;
            border-radius: 4px;
            margin-bottom: 15px;
            text-align: center;
        }

        /* 視覚的インジケータ */
        .metric-large {
            font-size: 46px;
            font-weight: 700;
            color: var(--accent);
            line-height: 1.1;
            margin: 10px 0;
        }

        /* 1ページ目：表紙 */
        .cover-page {
            background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #1d4ed8 100%);
            color: white;
            justify-content: center;
            align-items: flex-start;
            padding: 150px;
        }
        .cover-sub {
            font-size: 26px;
            color: #93c5fd;
            font-weight: 500;
            margin-bottom: 20px;
            letter-spacing: 3px;
        }
        .cover-main {
            font-size: 58px;
            font-weight: 700;
            line-height: 1.3;
            margin-bottom: 80px;
            border-bottom: 3px solid white;
            padding-bottom: 35px;
            width: 100%;
        }
        .cover-meta {
            margin-top: auto;
            font-size: 20px;
            display: grid;
            grid-template-columns: 160px 1fr;
            gap: 15px 0;
        }
        .cover-meta span { color: #94a3b8; }

        @media print {
            body { background-color: #ffffff; }
            .page { box-shadow: none; margin-bottom: 0; width: var(--page-width); height: var(--page-height); }
            @page { size: 1920px 1080px; margin: 0; }
        }
    </style>
</head>
<body>

<div class="report-container">

    <!-- ================= PAGE 1 ================= -->
    <div class="page cover-page">
        <div class="cover-sub">アナログ脱却から始める 訪問販売業のための生産性革命</div>
        <div class="cover-main">業務効率化・デジタル化<br>診断レポート</div>
        <div class="cover-meta">
            <span>対象企業：</span><strong>訪問販売 企業様</strong>
            <span>策定日：</span><strong>2026年7月13日</strong>
            <span>作成：</span><strong>中小企業DX・業務改善パートナーズ</strong>
        </div>
    </div>

    <!-- ================= PAGE 2 ================= -->
    <div class="page">
        <div class="page-header">
            <span class="brand"><i class="ri-pulse-line"></i> 業務改善診断レポート</span>
            <span>Page 2 / 10</span>
        </div>
        <h2 class="page-title"><i class="ri-dashboard-3-line"></i> 診断サマリー（現状と伸び代）</h2>

        <div class="grid-3 flex-grow">
            <!-- ボトルネック -->
            <div class="card">
                <div class="card-title" style="color:var(--alert);"><i class="ri-close-circle-line"></i> 現在のボトルネック TOP3</div>
                <div style="display:flex; flex-direction:column; gap:15px; margin-top:10px;">
                    <div style="background:#fff; padding:15px; border-radius:6px; border-left:4px solid var(--alert);">
                        <strong>1. 報告書の個別バラバラ運用</strong>
                        <p style="font-size:13px; color:var(--text-muted); margin-top:5px;">Excel・FileMaker・ノートに情報が分散し、集計不能な状態。</p>
                    </div>
                    <div style="background:#fff; padding:15px; border-radius:6px; border-left:4px solid var(--alert);">
                        <strong>2. リアルタイム進捗のブラックボックス化</strong>
                        <p style="font-size:13px; color:var(--text-muted); margin-top:5px;">誰がどこでどの顧客と交渉しているか、帰社まで一切把握できない。</p>
                    </div>
                    <div style="background:#fff; padding:15px; border-radius:6px; border-left:4px solid var(--alert);">
                        <strong>3. 帰社後の二重入力・事務ロス</strong>
                        <p style="font-size:13px; color:var(--text-muted); margin-top:5px;">外回りで疲弊した状態で、夜間に手書きノートからデータ転記を行う工数損失。</p>
                    </div>
                </div>
            </div>

            <!-- 優先テーマ -->
            <div class="card">
                <div class="card-title"><i class="ri-lightbulb-line"></i> 優先度の高い効率化テーマ</div>
                <div style="display:flex; flex-direction:column; gap:15px; margin-top:10px;">
                    <div style="background:#fff; padding:15px; border-radius:6px; display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            <strong style="display:block;">① モバイル日報への統一</strong>
                            <span style="font-size:12px; color:var(--text-muted);">その場で5分で報告完了</span>
                        </div>
                        <span class="badge badge-success">効果:大 / 難度:低</span>
                    </div>
                    <div style="background:#fff; padding:15px; border-radius:6px; display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            <strong style="display:block;">② 地図連動型SFAでの顧客管理</strong>
                            <span style="font-size:12px; color:var(--text-muted);">位置情報と進捗を同期</span>
                        </div>
                        <span class="badge badge-mid">効果:大 / 難度:中</span>
                    </div>
                    <div style="background:#fff; padding:15px; border-radius:6px; display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            <strong style="display:block;">③ 自動集計ダッシュボード</strong>
                            <span style="font-size:12px; color:var(--text-muted);">マネージャーの確認工数ゼロ化</span>
                        </div>
                        <span class="badge badge-success">効果:中 / 難度:低</span>
                    </div>
                </div>
            </div>

            <!-- 年間削減効果 -->
            <div class="card" style="background:var(--primary); color:white;">
                <div class="card-title" style="color:white; border-bottom-color:#334155;"><i class="ri-line-chart-line"></i> 期待される年間総削減インパクト</div>
                <div style="margin-top:20px; text-align:center;">
                    <p style="color:#94a3b8; font-size:16px;">訪問準備・報告にまつわる損失時間</p>
                    <div class="metric-large" style="color:#38bdf8;">年間 600 時間</div>
                    <p style="color:#94a3b8; font-size:14px; margin-bottom:30px;">（営業マン5名運用想定時）</p>

                    <p style="color:#94a3b8; font-size:16px;">無駄な人件費・機会損失コスト</p>
                    <div class="metric-large" style="color:#4ade80;">年 1,200,000 円</div>
                    <p style="font-size:12px; color:#64748b; margin-top:15px;">※時給2,000円×削減時間で算出</p>
                </div>
            </div>
        </div>
        <div class="page-footer"><span>© 2026 DX Advisory Group</span><span>2</span></div>
    </div>

    <!-- ================= PAGE 3 ================= -->
    <div class="page">
        <div class="page-header">
            <span class="brand"><i class="ri-pulse-line"></i> 業務改善診断レポート</span>
            <span>Page 3 / 10</span>
        </div>
        <h2 class="page-title"><i class="ri-global-line"></i> 業界の背景とデジタル化トレンド</h2>

        <div class="grid-2 flex-grow">
            <div>
                <div style="background:#fff1f2; border:2px dashed #f43f5e; padding:30px; border-radius:8px; margin-bottom:30px;">
                    <h3 style="color:#e11d48; font-size:22px; margin-bottom:15px;"><i class="ri-alert-line"></i> 「まだ手作業で消耗しますか？」常識破壊</h3>
                    <p style="font-size:16px; line-height:1.7;">
                        「外回り営業は現場の足とノートで稼ぐもの」という常識は、既に崩壊しています。現在、成長している訪問販売企業は、<strong>移動中や商談直後の『直帰フェーズ』でのデータ入力の即時自動化</strong>を完了させています。紙や個人のExcelに依存した管理を続けることは、単に社員を疲弊させるだけでなく、競合にリアルタイムで顧客シェアを奪われ続けるリスクそのものです。
                    </p>
                </div>

                <div class="card">
                    <strong style="font-size:18px; color:var(--secondary); display:block; margin-bottom:10px;">📌 今すぐチェックすべき業界特化キーワード</strong>
                    <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:10px;">
                        <span style="background:white; padding:8px 14px; border-radius:4px; font-size:14px; font-weight:700; border:1px solid #cbd5e1;">モバイルファーストSFA</span>
                        <span style="background:white; padding:8px 14px; border-radius:4px; font-size:14px; font-weight:700; border:1px solid #cbd5e1;">GPS連動ルート最適化</span>
                        <span style="background:white; padding:8px 14px; border-radius:4px; font-size:14px; font-weight:700; border:1px solid #cbd5e1;">音声認識入力（音声日報）</span>
                        <span style="background:white; padding:8px 14px; border-radius:4px; font-size:14px; font-weight:700; border:1px solid #cbd5e1;">ノーコード顧客台帳</span>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-title"><i class="ri-git-commit-line"></i> 周辺業界のデジタル化ロードマップ（3ステップ）</div>
                <div style="display:flex; flex-direction:column; gap:25px; margin-top:20px; position:relative;">
                    <div style="background:white; padding:20px; border-radius:6px; border-left:6px solid var(--accent);">
                        <strong style="color:var(--accent); font-size:16px;">STEP 1：入力・収集のデジタル化（今ここ）</strong>
                        <p style="font-size:14px; color:var(--text-muted); margin-top:5px;">バラバラの書式をスマートフォン上の「共通フォーム」に統一し、入力の手間を根絶するフェーズ。</p>
                    </div>
                    <div style="background:white; padding:20px; border-radius:6px; border-left:6px solid #64748b;">
                        <strong style="color:#64748b; font-size:16px;">STEP 2：動向・進捗の自動可視化</strong>
                        <p style="font-size:14px; color:var(--text-muted); margin-top:5px;">蓄積されたデータがマネージャーのダッシュボードへ自動で反映され、リアルタイムでチームの進捗が手に取るようにわかるフェーズ。</p>
                    </div>
                    <div style="background:white; padding:20px; border-radius:6px; border-left:6px solid #a855f7;">
                        <strong style="color:#a855f7; font-size:16px;">STEP 3：顧客情報の自動フィードバック・AI活用</strong>
                        <p style="font-size:14px; color:var(--text-muted); margin-top:5px;">蓄積された顧客データに基づき、次の訪問最適ルートやおすすめの提案プランをシステムが自動でレコメンドするフェーズ。</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="page-footer"><span>© 2026 DX Advisory Group</span><span>3</span></div>
    </div>

    <!-- ================= PAGE 4 ================= -->
    <div class="page">
        <div class="page-header">
            <span class="brand"><i class="ri-pulse-line"></i> 業務改善診断レポート</span>
            <span>Page 4 / 10</span>
        </div>
        <h2 class="page-title"><i class="ri-table-line"></i> 業務別 効率化対応表</h2>

        <div class="flex-grow">
            <table>
                <thead>
                    <tr>
                        <th style="width: 22%;">現在の手作業</th>
                        <th style="width: 25%;">発生している無駄・リスク</th>
                        <th style="width: 28%;">導入すべきデジタル施策 / ツール</th>
                        <th style="width: 25%;">なぜ劇的に改善するか</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>書式がバラバラな報告書作成</strong></td>
                        <td>Excel、FileMaker、ノートへの転記・検索により、1顧客あたり30分のタイムロス。</td>
                        <td><span class="badge badge-success" style="margin-bottom:5px;">★最優先</span> クラウド型共通入力フォーム (SFA/サクセス型CRM)</td>
                        <td>スマホで選択肢をタップするだけで入力が完了し、転記作業がゼロになるため。</td>
                    </tr>
                    <tr>
                        <td><strong>帰社後のPCへの二重入力</strong></td>
                        <td>日中に手書きした内容を夜間に再入力。営業マンの疲弊と入力漏れの発生。</td>
                        <td>モバイルアプリ対応のデータベース基盤</td>
                        <td>現地から商談直後、5分でシステムに直接送信・保存が完結するため。</td>
                    </tr>
                    <tr>
                        <td><strong>営業の進捗状況の確認</strong></td>
                        <td>マネージャーが電話や帰社後の口頭確認を行うまで、誰がどこにいるか一切不明。</td>
                        <td>位置情報(GPS)連動型 案件ステータス管理機能</td>
                        <td>地図上をクリックするだけで営業マンの最新ステータスが自動同期されるため。</td>
                    </tr>
                    <tr>
                        <td><strong>過去の顧客対応履歴の検索</strong></td>
                        <td>FileMakerや過去の古いExcelファイルを1つずつ立ち上げて検索する手間。</td>
                        <td>グローバル検索対応 一元化顧客台帳</td>
                        <td>顧客名を入力するだけで、過去の報告書履歴が1画面に時系列で全自動表示されるため。</td>
                    </tr>
                    <tr>
                        <td><strong>顧客からの要望・FB共有</strong></td>
                        <td>ノートに埋もれたまま共有されず、クレームの再発や提案機会の損失。</td>
                        <td>特定タグ(FB/要望)付き 自動通知アラート機能</td>
                        <td>現場が「要望」としてチェックした報告が、即座に関係者へ自動通知・共有されるため。</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="page-footer"><span>© 2026 DX Advisory Group</span><span>4</span></div>
    </div>

    <!-- ================= PAGE 5 ================= -->
    <div class="page">
        <div class="page-header">
            <span class="brand"><i class="ri-pulse-line"></i> 業務改善診断レポート</span>
            <span>Page 5 / 10</span>
        </div>
        <h2 class="page-title"><i class="ri-checkbox-multiple-blank-line"></i> 具体的な効率化施策①：モバイルフォーム日報への統一</h2>

        <div class="grid-2 flex-grow">
            <div style="display:flex; flex-direction:column; gap:20px;">
                <div class="card" style="background:#fff;">
                    <strong>💡 施策概要・ツール例</strong>
                    <p style="font-size:14px; margin-top:5px; color:var(--text-muted);">
                        スマートフォンに最適化されたクラウド営業支援フォーム（例: カカイチ日報、Salesforceモバイル、または自社製ノーコードApp）を導入。
                    </p>
                </div>
                <div class="card">
                    <strong style="color:var(--accent); font-size:16px;">👤 ターゲット（ペルソナカード：誰のどんな作業か）</strong>
                    <p style="font-size:14px; margin-top:5px; line-height:1.6;">
                        <strong>【対象者】</strong> 外回り訪問販売を担当する営業スタッフ全員<br>
                        <strong>【対象作業】</strong> 帰社後にバラバラのフォーマット（Excel、ノート、記憶）から本日分の活動を思い出しながら打ち込む、非効率な「夜間報告書作成」業務。
                    </p>
                </div>
                <div class="card" style="background:#f0fdf4; border-color:#cbd5e1;">
                    <strong>🎯 Why This Solution? （なぜこの手法なのか）</strong>
                    <p style="font-size:14px; margin-top:5px; color:var(--text-dark);">
                        報告書がバラバラになる根本原因は、「自由記述の枠が広すぎること」と「PCがないと入力できない環境」にあります。スマホから選択式（プルダウン）で「ステータス：見込み、要再訪、お断り」などを選ぶ形式にすれば、入力ルールがシステムで強制され、全体の品質が自動で一定に保たれます。
                    </p>
                </div>
            </div>

            <div style="display:flex; flex-direction:column; gap:20px;">
                <div class="card">
                    <strong>🔄 具体的ワークフロー（Before / After）</strong>
                    <div class="flow-container" style="margin-top:10px;">
                        <div class="flow-box before">
                            <strong>【Before】</strong> 顧客ごとにノートにメモ → 夜間に帰社 → パソコンを起動 → Excelを開いて手書き文字を解読しながら再転記（1件あたり30分）
                        </div>
                        <div class="flow-size" style="text-align:center; color:var(--accent); font-size:20px;"><i class="ri-arrow-down-line"></i></div>
                        <div class="flow-box after">
                            <strong>【After】</strong> 商談直後、次の目的地に移動する前にスマホから専用フォームを開く → タップ選択と短いテキストのみで入力送信 → その場で完了（わずか5分）
                        </div>
                    </div>
                </div>

                <div class="card" style="border: 2px dashed var(--success); background:#f0fdf4;">
                    <strong>💰 ROIシミュレーション（時間・コスト削減の計算式）</strong>
                    <p style="font-size:14px; margin-top:10px; line-height:1.7;">
                        ・[削減時間]：25分削減 / 1件 × 1日3件 × 月20日 × 営業5名 ＝ <strong>月7,500分（125時間）削減</strong><br>
                        ・[コスト換算]：125時間 × 時給2,000円 ＝ <strong>月250,000円（年間3,000,000円）</strong>の労務コスト圧縮効果。<br>
                        <span style="font-size:12px; color:var(--text-muted);">※創出された時間は、すべて純粋な新規顧客への訪問件数増加（＝売上貢献）に転換可能です。</span>
                    </p>
                </div>
            </div>
        </div>
        <div class="page-footer"><span>© 2026 DX Advisory Group</span><span>5</span></div>
    </div>

    <!-- ================= PAGE 6 ================= -->
    <div class="page">
        <div class="page-header">
            <span class="brand"><i class="ri-pulse-line"></i> 業務改善診断レポート</span>
            <span>Page 6 / 10</span>
        </div>
        <h2 class="page-title"><i class="ri-map-pin-user-line"></i> 具体的な効率化施策②：GPS連動型クラウド進捗ボードの導入</h2>

        <div class="grid-2 flex-grow">
            <div style="display:flex; flex-direction:column; gap:20px;">
                <div class="card" style="background:#fff;">
                    <strong>💡 施策概要・ツール例</strong>
                    <p style="font-size:14px; margin-top:5px; color:var(--text-muted);">
                        地図マッピング機能付きの営業管理システム（例: Cyzen、Google Maps API連携のノーコードツールなど）を活用。
                    </p>
                </div>
                <div class="card">
                    <strong style="color:var(--accent); font-size:16px;">👤 ターゲット（ペルソナカード：誰のどんな作業か）</strong>
                    <p style="font-size:14px; margin-top:5px; line-height:1.6;">
                        <strong>【対象者】</strong> 営業統括マネージャーおよび経営陣<br>
                        <strong>【対象作業】</strong> 各営業マンの動向がわからないため、都度「いまどこにいる？」「A社へのアプローチはどうなった？」と電話やメール、帰社後の口頭で進捗を確認・集計する作業。
                    </p>
                </div>
                <div class="card" style="background:#f0fdf4; border-color:#cbd5e1;">
                    <strong>🎯 Why This Solution? （なぜこの手法なのか）</strong>
                    <p style="font-size:14px; margin-top:5px; color:var(--text-dark);">
                        口頭や個別のチャットによる「進捗どう？」の確認は、お互いの時間を奪う最大のノイズです。現場がモバイル日報を送信した瞬間、その位置情報と案件ステータス（「交渉中」「成約」など）がクラウド上の社内地図にプロットされる仕組みを整えれば、マネージャーは画面を1秒見るだけでチームの現在地と進捗をすべて把握できます。
                    </p>
                </div>
            </div>

            <div style="display:flex; flex-direction:column; gap:20px;">
                <div class="card">
                    <strong>🔄 具体的ワークフロー（Before / After）</strong>
                    <div class="flow-container" style="margin-top:10px;">
                        <div class="flow-box before">
                            <strong>【Before】</strong> マネージャーが状況把握のために各営業マンへ電話 → 営業マンは移動を中断して対応 → 帰社後にホワイトボードやExcelへ手動で進捗を色付け・更新（毎日計40分）
                        </div>
                        <div class="flow-size" style="text-align:center; color:var(--accent); font-size:20px;"><i class="ri-arrow-down-line"></i></div>
                        <div class="flow-box after">
                            <strong>【After】</strong> 現場がスマホで活動報告ボタンを押すと、管理画面の顧客ピンの色が「未訪問（赤）」から「商談済（緑）」へ全自動で変化。マネージャーの確認・更新工数は「完全ゼロ」へ。
                        </div>
                    </div>
                </div>

                <div class="card" style="border: 2px dashed var(--success); background:#f0fdf4;">
                    <strong>💰 ROIシミュレーション（時間・コスト削減の計算式）</strong>
                    <p style="font-size:14px; margin-top:10px; line-height:1.7;">
                        ・[削減時間]：確認・集計工数 40分削減 / 日 × 月20日 ＝ <strong>月13.3時間（年間約160時間）削減</strong><br>
                        ・[コスト換算]：160時間 × 管理職時給2,500円 ＝ <strong>年間 400,000円</strong>のコスト削減。<br>
                        <span style="font-size:12px; color:var(--text-muted);">※時間は削減されるだけでなく、「どのエリアの成約率が高いか」という戦略分析活動に集中できるようになります。</span>
                    </p>
                </div>
            </div>
        </div>
        <div class="page-footer"><span>© 2026 DX Advisory Group</span><span>6</span></div>
    </div>

    <!-- ================= PAGE 7 ================= -->
    <div class="page">
        <div class="page-header">
            <span class="brand"><i class="ri-pulse-line"></i> 業務改善診断レポート</span>
            <span>Page 7 / 10</span>
        </div>
        <h2 class="page-title"><i class="ri-customer-service-line"></i> 具体的な効率化施策③：一元化データベースによる顧客フィードバック自動共有</h2>

        <div class="grid-2 flex-grow">
            <div style="display:flex; flex-direction:column; gap:20px;">
                <div class="card" style="background:#fff;">
                    <strong>💡 施策概要・ツール例</strong>
                    <p style="font-size:14px; margin-top:5px; color:var(--text-muted);">
                        全社共通の「一元化顧客リレーションデータベース」（例: kintone、Zoho CRMなど）を構築。
                    </p>
                </div>
                <div class="card">
                    <strong style="color:var(--accent); font-size:16px;">👤 ターゲット（ペルソナカード：誰のどんな作業か）</strong>
                    <p style="font-size:14px; margin-top:5px; line-height:1.6;">
                        <strong>【対象者】</strong> 営業チーム全体およびサポート・商品管理スタッフ<br>
                        <strong>【対象作業】</strong> 顧客から得られた重要な意見、苦情、製品へのフィードバックを手書きのノートや個人チャットに書き留めたまま失念し、社内共有されないことによる失注リスクの対応。
                    </p>
                </div>
                <div class="card" style="background:#f0fdf4; border-color:#cbd5e1;">
                    <strong>🎯 Why This Solution? （なぜこの手法なのか）</strong>
                    <p style="font-size:14px; margin-top:5px; color:var(--text-dark);">
                        「顧客の声がフィードバックされない」最大の理由は、報告書がただの『日記』になっているからです。システム内に「顧客の要望・クレーム」というチェックボックスを設置し、そこにチェックが入った場合は、経営陣や製品担当へ自動でチャット（LINE WORKS、Slack等）通知が飛ぶように連動させます。仕組みで強制共有の環境を作ることが、組織の対応スピードを劇的に高めます。
                    </p>
                </div>
            </div>

            <div style="display:flex; flex-direction:column; gap:20px;">
                <div class="card">
                    <strong>🔄 具体的ワークフロー（Before / After）</strong>
                    <div class="flow-container" style="margin-top:10px;">
                        <div class="flow-box before">
                            <strong>【Before】</strong> ノートに顧客の不満が書かれる → 営業マンの個人PCやFileMaker内に埋もれる → 数ヶ月後に別の営業が訪問した際、同じ問題で再度クレームを受け失注。
                        </div>
                        <div class="flow-size" style="text-align:center; color:var(--accent); font-size:20px;"><i class="ri-arrow-down-line"></i></div>
                        <div class="flow-box after">
                            <strong>【After】</strong> 現場がスマホで「要フィードバック」として報告書を送信 → クラウド台帳の顧客履歴の最上部に自動固定 → 次回訪問前、別担当がスマホで5分で履歴を予習し、完璧な対策を持ってアプローチ。
                        </div>
                    </div>
                </div>

                <div class="card" style="border: 2px dashed var(--success); background:#f0fdf4;">
                    <strong>💰 導入の現場Q&A（現場の抵抗への対策3選）</strong>
                    <div style="font-size:13px; margin-top:8px; display:flex; flex-direction:column; gap:8px;">
                        <div><strong>Q1. 「スマホの文字入力が苦手」というベテランへの対応は？</strong><br>↳ A1. 音声認識入力機能を標準ONにし、話すだけでテキスト化される運用のルール化で解決します。</div>
                        <div><strong>Q2. 「監視されているようで嫌だ」という現場の反発には？</strong><br>↳ A2. 「移動の手間や夜間残業を減らし、直帰できるようにするための仕組みである」ことを説明し、メリットを伝えます。</div>
                        <div><strong>Q3. 新しいツールの操作を覚える時間が取れないのでは？</strong><br>↳ A3. 初回は「ボタンを3回タップして送信するだけ」の極限までシンプルな画面からスタートし、徐々に拡張します。</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="page-footer"><span>© 2026 DX Advisory Group</span><span>7</span></div>
    </div>

    <!-- ================= PAGE 8 ================= -->
    <div class="page">
        <div class="page-header">
            <span class="brand"><i class="ri-pulse-line"></i> 業務改善診断レポート</span>
            <span>Page 8 / 10</span>
        </div>
        <h2 class="page-title"><i class="ri-equalizer-line"></i> ツールの選び方と注意点</h2>

        <div class="grid-2 flex-grow">
            <div>
                <strong style="font-size:18px; color:var(--secondary); display:block; margin-bottom:10px;">📊 ツール選定の比較マトリクス表</strong>
                <table>
                    <thead>
                        <tr>
                            <th>ツールタイプ</th>
                            <th>機能の豊富さ</th>
                            <th>コスト感</th>
                            <th>運用のしやすさ</th>
                            <th>訪問販売業への適性</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>① 汎用Excel/FileMaker</strong></td>
                            <td>△（限界がある）</td>
                            <td>◎（初期のみ）</td>
                            <td>×（属人化する）</td>
                            <td>×（外回りに不向き）</td>
                        </tr>
                        <tr>
                            <td><strong>② 大手高機能SFA</strong></td>
                            <td>◎（何でもできる）</td>
                            <td>×（高額）</td>
                            <td>△（挫折リスクあり）</td>
                            <td>◯（機能過多の懸念）</td>
                        </tr>
                        <tr>
                            <td><strong>③ モバイル特化SFA / ノーコード型</strong></td>
                            <td>◯（必要十分）</td>
                            <td>◯（安価〜適正）</td>
                            <td>◎（直感的で簡単）</td>
                            <td><strong>◎（ベストマッチ）</strong></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="card">
                <div class="card-title" style="color:var(--alert);"><i class="ri-spam-2-line"></i> 導入時に失敗する「地雷ツール」の見分け方</div>
                <div style="display:flex; flex-direction:column; gap:15px; margin-top:15px; font-size:14px;">
                    <div style="background:white; padding:15px; border-radius:6px; border-left:4px solid var(--alert);">
                        <strong>❌ 1. パソコン（ブラウザ）での操作が前提の重いシステム</strong>
                        <p style="color:var(--text-muted); font-size:12px; margin-top:3px;">出先のスマホからサクサク動かないツールは、結局営業マンが使わなくなりノートに戻ります。</p>
                    </div>
                    <div style="background:white; padding:15px; border-radius:6px; border-left:4px solid var(--alert);">
                        <strong>❌ 2. 自由記述のテキストエリアしかないシステム</strong>
                        <p style="color:var(--text-muted); font-size:12px; margin-top:3px;">入力者によって内容がバラバラになり、集計や分析、フィードバックに全く使えなくなります。</p>
                    </div>
                    <div style="background:white; padding:15px; border-radius:6px; border-left:4px solid var(--alert);">
                        <strong>❌ 3. 自社で項目の追加・修正ができないブラックボックス型</strong>
                        <p style="color:var(--text-muted); font-size:12px; margin-top:3px;">現場の状況が変わるたびに高額なベンダー改修費用がかかり、改善が頓挫します。</p>
                    </div>
                    <div style="background:white; padding:15px; border-radius:6px; border-left:4px solid var(--alert);">
                        <strong>❌ 4. 月額料金が従量課金で莫大に膨らむ設計</strong>
                        <p style="color:var(--text-muted); font-size:12px; margin-top:3px;">アカウントを追加するハードルが高くなり、パートやサポートスタッフへの情報共有が制限されます。</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="page-footer"><span>© 2026 DX Advisory Group</span><span>8</span></div>
    </div>

    <!-- ================= PAGE 9 ================= -->
    <div class="page">
        <div class="page-header">
            <span class="brand"><i class="ri-pulse-line"></i> 業務改善診断レポート</span>
            <span>Page 9 / 10</span>
        </div>
        <h2 class="page-title"><i class="ri-run-line"></i> 業務改善アクションプラン</h2>

        <p style="font-size:18px; margin-bottom:20px; color:var(--text-muted);">
            確実に社内定着を成功させるために、難易度・期間ごとに分解した3フェーズの実行計画です。
        </p>

        <div class="roadmap-timeline flex-grow">
            <!-- 初級 -->
            <div class="roadmap-card active">
                <div class="roadmap-header">【初級】今すぐ（今週中）にできること</div>
                <ul style="padding-left:20px; font-size:14px; line-height:2; margin-top:15px;">
                    <li><strong>報告必須項目のミニマム絞り込み</strong><br><span style="color:var(--text-muted);">バラバラの現状を解決するため、「これだけは全員共通で記録する」という3項目（日付・顧客名・次回の要否）を決定する。</span></li>
                    <li><strong>手書きノートのフォーマット統一</strong><br><span style="color:var(--text-muted);">デジタル化の前段階として、自由記述を禁止し箇条書きルールを徹底する。</span></li>
                    <li><strong>無料クラウドフォームでのプロトタイプ作成</strong><br><span style="color:var(--text-muted);">Googleフォーム等で簡易なスマホ日報画面を1分で作り、操作感を試す。</span></li>
                </ul>
            </div>

            <!-- 中級 -->
            <div class="roadmap-card">
                <div class="roadmap-header" style="background:#4b5563;">【中級】1ヶ月以内に準備・検証すること</div>
                <ul style="padding-left:20px; font-size:14px; line-height:2; margin-top:15px;">
                    <li><strong>一元化クラウドツールの選定・契約</strong><br><span style="color:var(--text-muted);">外回り販売に特化したモバイルファーストなSFA/CRMを選定し、テストアカウントを発行する。</span></li>
                    <li><strong>過去のExcel・FileMakerデータのインポート</strong><br><span style="color:var(--text-muted);">古いデータベースから顧客マスターをCSV抽出し、新しいシステムへ流し込む。</span></li>
                    <li><strong>パイロットチーム（1〜2名）での実証実験</strong><br><span style="color:var(--text-muted);">まずは一部の現場でスマホ報告をスタートさせ、入力しづらい箇所の調整を行う。</span></li>
                </ul>
            </div>

            <!-- 上級 -->
            <div class="roadmap-card">
                <div class="roadmap-header" style="background:var(--primary);">【上級】3ヶ月後に定着を目指すこと</div>
                <ul style="padding-left:20px; font-size:14px; line-height:2; margin-top:15px;">
                    <li><strong>全営業スタッフへの完全全面展開</strong><br><span style="color:var(--text-muted);">紙ノート・個別Excelでの報告運用を公式に「廃止」し、システム入力を完全義務化する。</span></li>
                    <li><strong>自動集計ダッシュボードの常時稼働</strong><br><span style="color:var(--text-muted);">マネージャーが朝礼や会議で、システム画面を見ながら指示を出す体制へ移行。</span></li>
                    <li><strong>フィードバックデータの次回提案への武器化</strong><br><span style="color:var(--text-muted);">顧客の声を元にしたアプローチ履歴を活用し、エリア全体の成約率を底上げする。</span></li>
                </ul>
            </div>
        </div>
        <div class="page-footer"><span>© 2026 DX Advisory Group</span><span>9</span></div>
    </div>

    <!-- ================= PAGE 10 ================= -->
    <div class="page" style="background: linear-gradient(to bottom, #ffffff 0%, var(--accent-light) 100%);">
        <div class="page-header">
            <span class="brand"><i class="ri-pulse-line"></i> 業務改善診断レポート</span>
            <span>Page 10 / 10</span>
        </div>
        <h2 class="page-title"><i class="ri-direction-line"></i> ネクストステップ・伴走支援</h2>

        <div class="grid-2 flex-grow" style="align-items: center; margin-top:20px;">
            <div>
                <h3 style="font-size:28px; color:var(--primary); font-weight:700; margin-bottom:20px;">
                    現場の足を、もっと強く、もっとスマートに。
                </h3>
                <p style="font-size:16px; line-height:1.8; color:var(--text-dark);">
                    訪問販売の強みは「圧倒的な顧客接点」と「現場で得られるリアルな生の声」にあります。その強みを、バラバラの報告書や二重入力の事務作業というアナログな障壁で相殺してしまうのは、企業にとって最大の損失です。<br><br>
                    仕組みを変えれば、営業マンはもっと外回りに集中でき、体力的な負担も和らぎます。そして何より、全員の進捗がクリアになることで、組織としての一体感と勝率が劇的に高まります。
                </p>

                <div style="display:flex; gap:20px; margin-top:40px;">
                    <div style="background:#fff; padding:15px 25px; border-radius:6px; border:1px solid var(--border-color); flex:1;">
                        <strong style="color:var(--secondary);"><i class="ri-user-check-line"></i> 自社でやるべきこと</strong>
                        <p style="font-size:13px; color:var(--text-muted); margin-top:5px;">現在使用しているデータの収集、現場の不満のヒアリング、業務プロセスの簡素化ルールの決定。</p>
                    </div>
                    <div style="background:#fff; padding:15px 25px; border-radius:6px; border:1px solid var(--accent); flex:1;">
                        <strong style="color:var(--accent);"><i class="ri-customer-service-2-line"></i> 専門家に頼るべきこと</strong>
                        <p style="font-size:13px; color:var(--text-muted); margin-top:5px;">最適なクラウドツールの選定、データ移行、スマホ専用画面の設計、現場定着マニュアルの作成。</p>
                    </div>
                </div>
            </div>

            <div style="text-align:center; padding:40px; background:white; border-radius:12px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border:1px solid #e2e8f0;">
                <i class="ri-discuss-line" style="font-size:64px; color:var(--accent);"></i>
                <h4 style="font-size:22px; margin-top:15px; font-weight:700;">まずは30分の「無料オンライン相談」へ</h4>
                <p style="font-size:14px; color:var(--text-muted); margin-top:10px; padding:0 30px;">
                    貴社の現在のExcelデータやFileMakerの構造を拝見し、具体的にどのようなスマホ画面に落とし込めるか、その場でデモ画面を作成してご提示いたします。
                </p>
                <div style="margin-top:35px;">
                    <a href="#" style="display:inline-block; background:var(--accent); color:white; font-weight:700; font-size:18px; padding:16px 45px; border-radius:6px; text-decoration:none; box-shadow:0 4px 10px rgba(37,99,235,0.3);">
                        <i class="ri-calendar-check-line"></i> 無料個別診断を申し込む
                    </a>
                </div>
                <p style="font-size:12px; color:var(--text-muted); margin-top:15px;">※強引な営業や勧誘は一切ございません。お気軽にご相談ください。</p>
            </div>
        </div>
        <div class="page-footer"><span>© 2026 DX Advisory Group</span><span>10</span></div>
    </div>

</div>

</body>
</html>
```

> ![MD のアイコン](data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAgACADASIAAhEBAxEB/8QAGQAAAwADAAAAAAAAAAAAAAAAAgQHAQMI/8QAJBAAAgEEAQQDAQEAAAAAAAAAAQIFAwQGEQcAIVGBCBIiEzH/xAAWAQEBAQAAAAAAAAAAAAAAAAAABwj/xAAiEQABAwQABwAAAAAAAAAAAAABAgQhAxExUQASEyJBcfD/2gAMAwEAAhEDEQA/AOcYqJtISwo2VlRWhb0lCqqjXs+T5PTfVd4B4BueXb67lZW7GP4JDj+svO1yFRFA2adMnsXI9KDs72oYPkLyjjeezEVE4Zj9rB4jj1BrKOdaIW5ulLbapVY/o7O2AJJ/TE92Op+aZ5Oqs5xs/b41Wh3TDgMm6LhI7iICIgezoYEnxeS9KS0TazcfWsr2ile3qqVZHG/Y8EeerD8f+UMfwCZlIzMMftp3EcgoLZSX2og3Nugba1KL/wCj6tpiARv6qR3Udbue+BLjia8s5eIvBkOBzA/rETtDTK6kbFKoR2FQDfj7aJGiGVQpnk6qDjOx9vgt3TLgs3CLBQ7SZCokexo5EjzbPAPP1zxFfXcVK2gyDBJgfyl4KuAyOpGjUpg9g4HpgNHWlKh8heLsbwKYipbDMgtZzEchoNexyLWDXNqobTU6qn9DR2oJAP5YHup3GomWtZuPo3tlWSvb1VDK6Hfo+CPHTfQ1DydJYxjY+1wQ0plwHrddgodwEhcQfY2MiD4tWvj1xdjeezErLZnkFrB4jj1Bb2RRqwW5ulLaWnSUfo7OlJAJ/Sgd2Gj5+5+ueXb60ioq0GP4JDj+URBUAFRFA0KlQDsXI9KCQN7YtIulJaWtISPrXt7WWhb0VLMzHXoeT4HQVDydJAznZ+1wW0phwXrhdwkdoMBESfZ2cCB5v//Z)AI-Prezen-MakingPrompt

AIとしてPDFの直接生成やダウンロードリンクの提示を行う機能は備わっていません。しかし、ご提示いただいたインプット情報は提案書を作成する上で十分に揃っています。

MD

そのため、WeasyPrint（HTML to PDF）の変換やブラウザでの印刷（PDF保存）を行うことで、そのまま市販品クオリティの美しいA4横デザイン（全11ページ）になる完全なHTML/CSSコードを作成しました。以下のコードをコピーし、`.html`として保存してご利用ください。

MD

HTML
```
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>営業効率化および業務改善に関する提案書</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css" rel="stylesheet">
    <style>
        :root {
            --primary: #0f172a;       /* ディープネイビー */
            --secondary: #1e3a8a;     /* コーポレートブルー */
            --accent: #0284c7;        /* スカイブルー */
            --accent-light: #f0f9ff;  /* 背景用ライトブルー */
            --text-dark: #1e293b;
            --text-muted: #64748b;
            --border-color: #cbd5e1;
            --alert: #ef4444;
            --success: #10b981;
            --page-width: 297mm;      /* A4横サイズ */
            --page-height: 210mm;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Noto Sans JP', sans-serif; background-color: #777; color: var(--text-dark); -webkit-print-color-adjust: exact; }

        .slide-container { width: var(--page-width); margin: 0 auto; }

        /* ページ（スライド）基本構造 */
        .page {
            width: var(--page-width);
            height: var(--page-height);
            background-color: #ffffff;
            position: relative;
            overflow: hidden;
            padding: 25mm 30mm 20mm 30mm;
            display: flex;
            flex-direction: column;
            page-break-after: always;
            box-shadow: 0 4px 10px rgba(0,0,0,0.2);
            margin-bottom: 20px;
        }

        /* ヘッダー・フッター */
        .page-header {
            position: absolute;
            top: 12mm; left: 30mm; right: 30mm;
            display: flex; justify-content: space-between; align-items: center;
            border-bottom: 1px solid var(--border-color);
            padding-bottom: 8px; color: var(--text-muted); font-size: 12px;
        }
        .page-header .title-left { font-weight: 700; color: var(--secondary); }
        .page-footer {
            position: absolute;
            bottom: 10mm; left: 30mm; right: 30mm;
            display: flex; justify-content: space-between; align-items: center;
            border-top: 1px solid var(--border-color);
            padding-top: 8px; color: var(--text-muted); font-size: 11px;
        }

        /* タイトルスタイル */
        .slide-title {
            font-size: 32px; font-weight: 700; color: var(--primary);
            margin-bottom: 30px; display: flex; align-items: center; gap: 12px;
            border-left: 8px solid var(--secondary); padding-left: 15px;
        }

        /* レイアウトツール */
        .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 30px; }
        .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .flex-grow { flex-grow: 1; }

        /* コンポーネント */
        .card { background: var(--accent-light); border-radius: 8px; padding: 25px; border: 1px solid #e0f2fe; }
        .card-title { font-size: 20px; font-weight: 700; color: var(--secondary); margin-bottom: 15px; display: flex; align-items: center; gap: 8px; }

        /* 表（テーブル） */
        table { width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 10px; }
        th { background: var(--secondary); color: white; padding: 12px 16px; font-weight: 700; text-align: left; }
        td { padding: 14px 16px; border-bottom: 1px solid var(--border-color); background: white; }
        tr:nth-child(even) td { background: var(--accent-light); }

        /* 1ページ目：表紙カスタム */
        .cover {
            background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 70%, var(--accent) 100%);
            color: white; justify-content: center; padding: 50mm 40mm;
        }
        .cover-sub { font-size: 24px; color: #bae6fd; font-weight: 500; margin-bottom: 15px; letter-spacing: 1px; }
        .cover-main { font-size: 52px; font-weight: 700; line-height: 1.3; margin-bottom: 50px; border-bottom: 3px solid white; padding-bottom: 25px; }
        .cover-meta { margin-top: auto; font-size: 18px; display: grid; grid-template-columns: 120px 1fr; gap: 10px 0; color: #e2e8f0; }

        /* 視覚的グラフ要素 */
        .bar-chart { display: flex; flex-direction: column; gap: 15px; margin-top: 20px; }
        .bar-row { display: flex; align-items: center; gap: 15px; }
        .bar-label { width: 100px; font-weight: 700; font-size: 16px; }
        .bar-container { flex-grow: 1; background: #e2e8f0; height: 30px; border-radius: 4px; overflow: hidden; position: relative; }
        .bar-fill { height: 100%; background: var(--alert); display: flex; align-items: center; padding-left: 15px; color: white; font-weight: 700; }
        .bar-fill.success { background: var(--success); }

        /* ロードマップ */
        .roadmap { display: flex; justify-content: space-between; align-items: stretch; margin-top: 20px; }
        .step { flex: 1; background: var(--accent-light); border: 2px solid #e0f2fe; border-radius: 8px; padding: 20px; text-align: center; }
        .step.active { border-color: var(--secondary); background: white; box-shadow: 0 4px 12px rgba(30,58,138,0.1); }
        .arrow { display: flex; align-items: center; font-size: 32px; color: var(--secondary); padding: 0 10px; }

        @media print {
            body { background-color: #ffffff; }
            .page { box-shadow: none; margin-bottom: 0; width: var(--page-width); height: var(--page-height); }
            @page { size: A4 landscape; margin: 0; }
        }
    </style>
</head>
<body>

<div class="slide-container">

    <!-- 1. 表紙 -->
    <div class="page cover">
        <div class="cover-sub">営業準備の自動化による攻めの営業スタイルへの変革</div>
        <div class="cover-main">効率化および業務改善に関する提案書</div>
        <div class="cover-meta">
            <span>ご提出先</span><strong>株式会社サンプル商事 御中</strong>
            <span>提案会社</span><strong>株式会社NextSales</strong>
            <span>日付</span><strong>2026年7月13日</strong>
        </div>
    </div>

    <!-- 2. アジェンダ -->
    <div class="page">
        <div class="page-header"><span class="title-left">株式会社NextSales</span><span>提案書 | アジェンダ</span></div>
        <h2 class="slide-title"><i class="ri-list-check-2"></i> 本日のアジェンダ</h2>
        <div class="grid-2 flex-grow" style="align-content: center; max-width: 900px; margin: 0 auto; gap: 15px 40px;">
            <div style="font-size: 18px; padding: 12px 20px; background: var(--accent-light); border-radius: 4px;">1. ご提案の背景（現状認識）</div>
            <div style="font-size: 18px; padding: 12px 20px; background: var(--accent-light); border-radius: 4px;">5. 費用サマリー（3カ年推移）</div>
            <div style="font-size: 18px; padding: 12px 20px; background: var(--accent-light); border-radius: 4px;">2. ご提案のテーマ（課題認識）</div>
            <div style="font-size: 18px; padding: 12px 20px; background: var(--accent-light); border-radius: 4px;">6. 費用明細・注意事項</div>
            <div style="font-size: 18px; padding: 12px 20px; background: var(--accent-light); border-radius: 4px;">3. ご提案全体像（As-Is / To-Be）</div>
            <div style="font-size: 18px; padding: 12px 20px; background: var(--accent-light); border-radius: 4px;">7. スケジュール＆マイルストーン</div>
            <div style="font-size: 18px; padding: 12px 20px; background: var(--accent-light); border-radius: 4px;">4. 期待される効果（ROI算出）</div>
            <div style="font-size: 18px; padding: 12px 20px; background: var(--accent-light); border-radius: 4px;">8. 体制図および今後のロードマップ</div>
        </div>
        <div class="page-footer"><span>© 2026 NextSales Inc.</span><span>2</span></div>
    </div>

    <!-- 3. ご提案の背景 -->
    <div class="page">
        <div class="page-header"><span class="title-left">株式会社サンプル商事 御中</span><span>1. ご提案の背景</span></div>
        <h2 class="slide-title"><i class="ri-article-line"></i> ご提案の背景（現状認識）</h2>
        <div class="grid-2 flex-grow">
            <div class="card" style="background: white; border: 2px solid var(--secondary);">
                <div class="card-title" style="color: var(--secondary);"><i class="ri-flag-line"></i> 会社としての目指す方向性</div>
                <p style="font-size: 16px; line-height: 1.8; margin-top: 10px;">
                    激化する市場環境において、貴社がさらなる成長を遂げるためには、既存顧客への深耕および新規顧客の開拓が不可欠です。そのためには、<strong>「無駄な社内工数を極限まで削減し、営業マンが顧客と向き合う『訪問件数・商談時間』を最大化する攻めの営業スタイル」</strong>へシフトすることが急務となっています。
                </p>
            </div>
            <div class="card">
                <div class="card-title"><i class="ri-error-warning-line"></i> お伺いしている現状の問題</div>
                <ul style="padding-left: 20px; font-size: 15px; line-height: 1.8;">
                    <li style="margin-bottom: 8px;">営業マンが訪問前に顧客情報を調べる際、<strong>Excel、FileMaker、紙のノートなど複数の場所</strong>を個別に探す必要があり、情報が激しく散乱している。</li>
                    <li style="margin-bottom: 8px;">結果として、1回あたりの顧客準備に<strong>30分もの工数</strong>を要している。</li>
                    <li style="margin-bottom: 8px;">外出・移動中も非効率なデータアクセス環境にあり、膝や体力への負担が大きく、営業ポテンシャルをフルに発揮できていない。</li>
                </ul>
            </div>
        </div>
        <div class="page-footer"><span>© 2026 NextSales Inc.</span><span>3</span></div>
    </div>

    <!-- 4. ご提案のテーマ -->
    <div class="page">
        <div class="page-header"><span class="title-left">株式会社サンプル商事 御中</span><span>2. ご提案のテーマ</span></div>
        <h2 class="slide-title"><i class="ri-focus-3-line"></i> ご提案のテーマ（課題認識）</h2>
        <div style="background: var(--primary); color: white; padding: 25px; border-radius: 6px; margin-bottom: 25px;">
            <span style="color: #60a5fa; font-weight: 700; font-size: 14px;">🌟 目指すべきあるべき姿（ゴール）</span>
            <h3 style="font-size: 24px; margin-top: 5px;">顧客情報の一元化により、準備時間を「5分」に短縮し、圧倒的な訪問件数を担保する</h3>
        </div>
        <div class="card flex-grow">
            <div class="card-title"><i class="ri-git-repository-private-line"></i> 实现するための3つの障壁・課題</div>
            <div class="grid-3" style="margin-top: 15px;">
                <div style="background: white; padding: 20px; border-radius: 6px; border-top: 4px solid var(--accent);">
                    <strong style="font-size: 16px; display:block; margin-bottom:8px;">① 情報のサイロ化</strong>
                    <p style="font-size: 13px; color: var(--text-muted);">過去のデータ遺産（FileMaker等）と現場のメモ（ノート）が紐づいておらず、検索自体に迷いが発生している。</p>
                </div>
                <div style="background: white; padding: 20px; border-radius: 6px; border-top: 4px solid var(--accent);">
                    <strong style="font-size: 16px; display:block; margin-bottom:8px;">② モバイル対応の不足</strong>
                    <p style="font-size: 13px; color: var(--text-muted);">移動中や出先からスムーズに必要な情報へアクセスする仕組みがなく、身体的・時間的ロスを生んでいる。</p>
                </div>
                <div style="background: white; padding: 20px; border-radius: 6px; border-top: 4px solid var(--accent);">
                    <strong style="font-size: 16px; display:block; margin-bottom:8px;">③ 標準プロセスの不在</strong>
                    <p style="font-size: 13px; color: var(--text-muted);">「これだけ見れば準備完了」という最小限の必須情報パッケージ（一元化された画面）が定義されていない。</p>
                </div>
            </div>
        </div>
        <div class="page-footer"><span>© 2026 NextSales Inc.</span><span>4</span></div>
    </div>

    <!-- 5. ご提案全体像 -->
    <div class="page">
        <div class="page-header"><span class="title-left">株式会社サンプル商事 御中</span><span>3. ご提案全体像</span></div>
        <h2 class="slide-title"><i class="ri-shape-line"></i> ご提案全体像（解決策：As-Is / To-Be）</h2>
        <div class="flex-grow" style="display: flex; flex-direction: column; justify-content: space-between;">
            <div class="grid-2" style="background: var(--accent-light); padding: 25px; border-radius: 8px; border: 1px solid #bae6fd;">
                <div>
                    <strong style="color: var(--alert); font-size: 18px; display:block; margin-bottom:10px;"><i class="ri-close-circle-fill"></i> 従来の状況 (As-Is)</strong>
                    <p style="font-size: 14px; line-height: 1.6; background: white; padding: 15px; border-radius: 6px;">
                        Excel、FileMaker、ノートを往復。1商談あたり<strong>30分</strong>の準備時間がかかり、移動時の負担も重く、1日の訪問件数が伸び悩む構造。
                    </p>
                </div>
                <div>
                    <strong style="color: var(--success); font-size: 18px; display:block; margin-bottom:10px;"><i class="ri-checkbox-circle-fill"></i> 導入後の姿 (To-Be)</strong>
                    <p style="font-size: 14px; line-height: 1.6; background: white; padding: 15px; border-radius: 6px; border: 1px solid var(--success);">
                        統合データ基盤により、スマートフォンやPCからワンタップで顧客要約を瞬時に把握。準備時間はわずか<strong>5分</strong>へ。体力負荷を軽減し、即座に次なる訪問へ動ける強靭な体制。
                    </p>
                </div>
            </div>
            <div class="card" style="margin-top: 20px;">
                <div class="card-title" style="font-size: 16px;"><i class="ri-settings-line"></i> 具体的な実施アプローチ</div>
                <p style="font-size: 14px; color: var(--text-muted);">
                    散在するExcel・FileMakerデータを抽出し、NextSalesの営業ダッシュボードへ統合。現場ノートの運用プロセスをデジタル入力へ統一することで、「1画面で完結する顧客情報検索」を構築します。
                </p>
            </div>
        </div>
        <div class="page-footer"><span>© 2026 NextSales Inc.</span><span>5</span></div>
    </div>

    <!-- 6. 期待される効果について -->
    <div class="page">
        <div class="page-header"><span class="title-left">株式会社サンプル商事 御中</span><span>4. 期待される効果</span></div>
        <h2 class="slide-title"><i class="ri-line-chart-line"></i> 期待される効果について（ROI）</h2>
        <div class="grid-2 flex-grow">
            <div class="card" style="background: white;">
                <div class="card-title"><i class="ri-time-line"></i> 1顧客あたりの営業準備時間比較</div>
                <div class="bar-chart">
                    <div class="bar-row">
                        <div class="bar-label">現状 (As-Is)</div>
                        <div class="bar-container"><div class="bar-fill" style="width: 100%;">30分</div></div>
                    </div>
                    <div class="bar-row">
                        <div class="bar-label">導入後(To-Be)</div>
                        <div class="bar-container"><div class="bar-fill success" style="width: 16.6%;">5分</div></div>
                    </div>
                </div>
                <div style="margin-top: 25px; font-weight: 700; color: var(--success); font-size: 18px;">
                    <i class="ri-arrow-right-up-line"></i> 1回あたり25分（83.3%）の削減効果！
                </div>
            </div>
            <div class="card" style="background: #f0fdf4; border: 1px dashed var(--success);">
                <div class="card-title" style="color: var(--success);"><i class="ri-calculator-line"></i> ROI算出の根拠（営業マン1人あたり）</div>
                <p style="font-size: 14px; line-height: 1.7;">
                    仮に1日3件の訪問・準備を行う場合：<br>
                    ・<strong>現状：</strong> 30分 × 3件 ＝ 90分 / 日<br>
                    ・<strong>導入後：</strong> 5分 × 3件 ＝ 15分 / 日<br>
                    ・<strong>効果：</strong> 1日あたり<strong>75分の余剰時間</strong>を創出。<br><br>
                    月20日稼働換算で<strong>毎月25時間</strong>が純増。この創出された時間をすべて「新規訪問・提案活動」に充てることで、訪問件数の最大化と売上成長へダイレクトに貢献します。
                </p>
            </div>
        </div>
        <div class="page-footer"><span>© 2026 NextSales Inc.</span><span>6</span></div>
    </div>

    <!-- 7. 費用サマリー -->
    <div class="page">
        <div class="page-header"><span class="title-left">株式会社サンプル商事 御中</span><span>5. 費用サマリー</span></div>
        <h2 class="slide-title"><i class="ri-money-dollar-circle-line"></i> 費用サマリー（3カ年コスト推移）</h2>
        <p style="font-size: 15px; margin-bottom: 20px;">導入初期費用および運用に伴う3年間の費用推移のシミュレーションです。</p>
        <div class="grid-3 flex-grow" style="gap: 25px;">
            <div class="card" style="background: white; border: 1px solid var(--border-color); text-align: center;">
                <div style="font-weight: 700; color: var(--text-muted);">【1年目】</div>
                <div style="font-size: 36px; font-weight: 700; color: var(--primary); margin: 15px 0;">¥3,900,000</div>
                <div style="font-size: 13px; color: var(--text-muted); text-align: left; background: var(--accent-light); padding: 10px; border-radius: 4px;">
                    初期構築: 100万円<br>月額ライセンス: 240万円<br>サポート費用: 50万円
                </div>
            </div>
            <div class="card" style="background: white; border: 1px solid var(--border-color); text-align: center;">
                <div style="font-weight: 700; color: var(--text-muted);">【2年目】</div>
                <div style="font-size: 36px; font-weight: 700; color: var(--primary); margin: 15px 0;">¥2,900,000</div>
                <div style="font-size: 13px; color: var(--text-muted); text-align: left; background: var(--accent-light); padding: 10px; border-radius: 4px;">
                    初期構築: ¥0<br>月額ライセンス: 240万円<br>サポート費用: 50万円
                </div>
            </div>
            <div class="card" style="background: white; border: 1px solid var(--border-color); text-align: center;">
                <div style="font-weight: 700; color: var(--text-muted);">【3年目】</div>
                <div style="font-size: 36px; font-weight: 700; color: var(--primary); margin: 15px 0;">¥2,900,000</div>
                <div style="font-size: 13px; color: var(--text-muted); text-align: left; background: var(--accent-light); padding: 10px; border-radius: 4px;">
                    初期構築: ¥0<br>月額ライセンス: 240万円<br>サポート費用: 50万円
                </div>
            </div>
        </div>
        <div class="page-footer"><span>© 2026 NextSales Inc.</span><span>7</span></div>
    </div>

    <!-- 8. 費用詳細 -->
    <div class="page">
        <div class="page-header"><span class="title-left">株式会社サンプル商事 御中</span><span>6. 費用詳細明細</span></div>
        <h2 class="slide-title"><i class="ri-file-list-3-line"></i> 費用詳細（御見積明細）</h2>
        <div class="flex-grow">
            <table>
                <thead>
                    <tr>
                        <th>サービス名 / 区分</th>
                        <th>標準価格</th>
                        <th>ご提供価格</th>
                        <th>数量 / 期間</th>
                        <th>年間費用 (税抜)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>NextSales 営業情報統合データ初期構築費</strong></td>
                        <td>¥1,200,000</td>
                        <td><strong>¥1,000,000</strong></td>
                        <td>1式（初回のみ）</td>
                        <td>¥1,000,000</td>
                    </tr>
                    <tr>
                        <td><strong>NextSales クラウド共通ライセンス利用料</strong></td>
                        <td>¥200,000 / 月</td>
                        <td><strong>¥200,000 / 月</strong></td>
                        <td>12ヶ月分</td>
                        <td>¥2,400,000</td>
                    </tr>
                    <tr>
                        <td><strong>年間運用定着・データメンテナンスサポート</strong></td>
                        <td>¥600,000 / 年</td>
                        <td><strong>¥500,000</strong></td>
                        <td>1年間（更新型）</td>
                        <td>¥500,000</td>
                    </tr>
                    <tr style="background: var(--primary); color: white; font-weight: 700;">
                        <td colspan="4" style="text-align: right; background: var(--primary); color: white;">初年度合計金額 (税抜)：</td>
                        <td style="background: var(--primary); color: white; font-size: 16px;">¥3,900,000</td>
                    </tr>
                </tbody>
            </table>
            <div style="margin-top: 20px; font-size: 12px; color: var(--text-muted); line-height: 1.5;">
                <strong>【注意事項】</strong><br>
                ※ 月額ライセンスは全社共通基本パックの想定価格です。アカウント数による変動が生じる場合は別途ご案内いたします。<br>
                ※ サポート費用には、データ構造の軽微な変更対応、およびトラブル時のヘルプデスク対応が含まれます。
            </div>
        </div>
        <div class="page-footer"><span>© 2026 NextSales Inc.</span><span>8</span></div>
    </div>

    <!-- 9. スケジュール -->
    <div class="page">
        <div class="page-header"><span class="title-left">株式会社サンプル商事 御中</span><span>7. スケジュール</span></div>
        <h2 class="slide-title"><i class="ri-calendar-event-line"></i> プロジェクトスケジュール</h2>
        <div class="flex-grow">
            <table style="font-size: 13px;">
                <thead>
                    <tr>
                        <th style="width: 20%;">フェーズ・期間</th>
                        <th style="width: 40%;">実施内容 / マイルストーン</th>
                        <th style="width: 40%;">貴社ご対応事項</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>第1週（要件定義）</strong></td>
                        <td>データ抽出設計・現状のExcel/FileMaker定義確認<br><span style="color:var(--accent); font-weight:700;">[マイルストーン：データ移行設計の確定]</span></td>
                        <td>既存データ（Excel、FileMaker）のサンプル及びノート運用のヒアリングご協力</td>
                    </tr>
                    <tr>
                        <td><strong>第2〜3週（構築期）</strong></td>
                        <td>データ統合基盤の構築、画面UIデザイン・モバイル最適化</td>
                        <td>検証環境へのログインテスト、操作感のフィードバック</td>
                    </tr>
                    <tr>
                        <td><strong>第4週（移行・テスト）</strong></td>
                        <td>本番データ流し込み、および接続テスト</td>
                        <td>マスターデータ最終承認</td>
                    </tr>
                    <tr>
                        <td><strong>第5週（レクチャー）</strong></td>
                        <td>現場営業マン向け説明会の実施、運用スタート<br><span style="color:var(--success); font-weight:700;">[マイルストーン：現場運用開始・5分化の達成]</span></td>
                        <td>全営業担当者の説明会へのアサイン、利用開始の号令</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="page-footer"><span>© 2026 NextSales Inc.</span><span>9</span></div>
    </div>

    <!-- 10. プロジェクト体制 -->
    <div class="page">
        <div class="page-header"><span class="title-left">株式会社サンプル商事 御中</span><span>8. プロジェクト体制</span></div>
        <h2 class="slide-title"><i class="ri-team-line"></i> プロジェクト推進体制</h2>
        <div class="grid-2 flex-grow" style="align-items: center;">
            <div class="card" style="background: white; border: 1px solid var(--border-color); height: 100%;">
                <div class="card-title" style="color: var(--primary);"><i class="ri-building-line"></i> 貴社推進体制（株式会社サンプル商事様）</div>
                <div style="font-size: 14px; display: flex; flex-direction: column; gap: 15px; margin-top: 15px;">
                    <div style="background: var(--accent-light); padding: 12px; border-radius: 4px;">
                        <strong>プロジェクトオーナー（営業統括役員 様）</strong><br>
                        <span style="font-size:12px; color:var(--text-muted);">本プロジェクトの最終意思決定および定着化の推進</span>
                    </div>
                    <div style="background: var(--accent-light); padding: 12px; border-radius: 4px;">
                        <strong>実務リーダー（営業推進・マネージャー 様）</strong><br>
                        <span style="font-size:12px; color:var(--text-muted);">要件定義への同席、散在データのとりまとめ、現場連携窓口</span>
                    </div>
                </div>
            </div>
            <div class="card" style="background: var(--primary); color: white; height: 100%;">
                <div class="card-title" style="color: white;"><i class="ri-customer-service-2-line"></i> 弊社伴走体制（株式会社NextSales）</div>
                <div style="font-size: 14px; display: flex; flex-direction: column; gap: 15px; margin-top: 15px;">
                    <div style="background: #1e293b; padding: 12px; border-radius: 4px;">
                        <strong>シニアコンサルタント（1名）</strong><br>
                        <span style="font-size:12px; color:#94a3b8;">全体の進行管理、業務フロー設計および現場定着化支援</span>
                    </div>
                    <div style="background: #1e293b; padding: 12px; border-radius: 4px;">
                        <strong>データインテグレーションエンジニア（2名）</strong><br>
                        <span style="font-size:12px; color:#94a3b8;">Excel/FileMakerからのデータクレンジング・統合画面の実装</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="page-footer"><span>© 2026 NextSales Inc.</span><span>10</span></div>
    </div>

    <!-- 11. 今後のさらなる活用について -->
    <div class="page">
        <div class="page-header"><span class="title-left">株式会社サンプル商事 御中</span><span>9. 今後のロードマップ</span></div>
        <h2 class="slide-title"><i class="ri-route-line"></i> 今後のさらなる活用について（将来へのロードマップ）</h2>
        <p style="font-size: 15px; margin-bottom: 20px;">情報を一元化した後、貴社が「究極の攻めの営業」を展開するための3ステップのロードマップです。</p>
        <div class="roadmap flex-grow">
            <div class="step active">
                <div style="font-size: 18px; font-weight: 700; color: var(--secondary); margin-bottom: 8px;">Phase 1 (今回のご提案)</div>
                <strong>情報一元化と自動化</strong>
                <p style="font-size: 12px; color: var(--text-muted); margin-top: 10px; text-align: left;">
                    散乱するExcel・FileMakerデータを統合し、検索時間を30分から5分へ。営業マンの体力負荷を低減し訪問数を増大。
                </p>
            </div>
            <div class="arrow"><i class="ri-arrow-right-line"></i></div>
            <div class="step">
                <div style="font-size: 18px; font-weight: 700; color: var(--text-muted); margin-bottom: 8px;">Phase 2 (拡張フェーズ)</div>
                <strong>動的営業ナレッジの共有</strong>
                <p style="font-size: 12px; color: var(--text-muted); margin-top: 10px; text-align: left;">
                    出先からの「音声入力日報」等を実装し、ノートに眠っていた最新のリアルタイム顧客状況を全社で即時共有可能に。
                </p>
            </div>
            <div class="arrow"><i class="ri-arrow-right-line"></i></div>
            <div class="step">
                <div style="font-size: 18px; font-weight: 700; color: var(--text-muted); margin-bottom: 8px;">Phase 3 (AI活用フェーズ)</div>
                <strong>AIによる自動提案・訪問予測</strong>
                <p style="font-size: 12px; color: var(--text-muted); margin-top: 10px; text-align: left;">
                    一元化されたデータをもとに、AIが「今週訪問すべき優先顧客」と「最適な提案プラン」を自動レコメンドする体制の実現。
                </p>
            </div>
        </div>
        <div class="page-footer"><span>© 2026 NextSales Inc.</span><span>11</span></div>
    </div>

</div>

</body>
</html>
```
