# タスク：ai-proposal-prompts-v1 パッケージ整備

依頼元：leader  
優先度：高（note先行販売中のため速攻で対応）  
対象：`members/product/projects/ai-proposal-prompts-v1/`

---

## 修正内容（3点）

### 1. メールアドレスを本番に差し替え

`LICENSE.txt` の連絡先（日英両方）を変更：
- 変更前：`support@example.com` / `https://example.com`
- 変更後：`zodiacm369@gmail.com`（Website行は削除 or 空欄）

### 2. ライセンス文の矛盾を解消

現在のLICENSE.txtに「ココナラなどで販売禁止」と書いてあるが、これは購入者が転売する場合の話。**販売元（自分）がnote・Boothで販売することは問題ない**。

以下を明記して混乱を防ぐ：
- 「禁止される利用」セクションの冒頭に注釈を追加：
  > ※ 本製品をご購入いただいたユーザーへの制限です。販売元による公式販売チャネル（note・Booth等）での提供はこの限りではありません。
- README.mdのライセンス簡潔版も同様に整合させる

### 3. プロンプト数の表記を実数に合わせる

現在 `prompts/` フォルダに実在するファイルは7本：
- prompt_proposal_11p.md
- prompt_diagnosis_10p.md
- prompt_efficiency_diagnosis.md
- prompt_proposal_short.md
- prompt_a4_flyer_corporate.md
- prompt_a4_flyer_freelancer.md
- prompt_presentation_gemini.md

「全14種類」と書いてある箇所を修正する。下記の2択のどちらかで対応：

**選択肢A（推奨）**：実在する7本に合わせて表記を「全7種類」に修正
- README.md：`... (全 14 種類)` → `... (全 7 種類)`
- INDEX：`## 📂 プロンプト一覧（全14種類）` → `全7種類`
- INDEX内の #4〜#14 で実ファイルが存在しないものは「準備中」と明記 or 削除

**選択肢B**：不足している #4〜#14 のプロンプトを新規作成して14本に揃える
- ただし品質担保が必要なため、leaderレビュー必須

→ **まず選択肢Aで整備し、leader確認後にBへ移行する方針を推奨**

---

## 完了条件

- [ ] メアド差し替え完了（LICENSE.txt 日英両方）
- [ ] ライセンス矛盾の注釈追加完了
- [ ] README / INDEX のプロンプト数が実数と一致
- [ ] 完了したら成果物のファイルパスを経営者にリンクで通知して終了（task_done.mdリネーム・レビュー依頼は不要）

---

## 注意

- note先行販売中のため、品質を最優先。確認できない箇所は勝手に進めずleaderに質問する
- **git操作は一切不要（commit・push ともに禁止）**
