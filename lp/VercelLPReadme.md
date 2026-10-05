# LP制作 → GitHub → Vercel 自動デプロイ フロー

## 概要
移植元：`C:\Users\yyasu\ai-zodiacm\ai-company-kit\logs\lp-packs`

LP（LP担当）が担当するLP制作・公開の標準フロー。
「経営者が参考サイトを共有する」→「LPが公開URLで見られる」までの手順。

---

## 全体の流れ

```
ヒアリング → HTML生成 → GitHub push → Vercel自動デプロイ → 修正→push→自動反映
```

---

## STEP 1：ヒアリング

以下を確認する：

| 項目 | 例 |
|---|---|
| サービス名・屋号 | MasterZ |
| キャッチコピー | AI×Web運用で、集客を仕組み化する。 |
| 参考サイトURL | https://otehon-hp.vercel.app/ |
| 掲載セクション | 標準構成でよければ確認不要 |

---

## STEP 2：HTML生成

- 参考：`https://otehon-hp.vercel.app/` のクオリティを目標
- カラー標準：ネイビー `#061F4A` / ブルー `#0095D9` / アンバー `#F7A800`
- 標準セクション構成：
  1. ナビ
  2. ヒーロー（キャッチ・CTA）
  3. 実績数字
  4. サービス一覧
  5. ご依頼の流れ
  6. ポートフォリオ
  7. お客様の声
  8. CTA
  9. お問い合わせフォーム
  10. フッター
- 保存先：`C:\Users\yyasu\ai-company\members\lp\pages\<プロジェクト名>\index.html`

---

## STEP 3：GitHubへpush

### 初回（リポジトリ新規作成）

**① 経営者がブラウザで実行（1アクション）**
```
https://github.com/new
```
- Repository name：`<プロジェクト名>`（例：`masterz-lp`）
- Public を選択 → 「Create repository」

**② LPがコマンド実行**
```bash
cd C:\Users\yyasu\ai-company\members\lp\pages\<プロジェクト名>
git init
git add index.html
git commit -m "Initial commit: LP生成"
git branch -M main
git remote add origin https://github.com/maloncafe-beep/<リポジトリ名>.git
git push -u origin main
```

---

## STEP 4：Vercelでデプロイ

**社長がブラウザで実行（初回のみ）**
```
https://vercel.com/new
```
1. 「Import Git Repository」でGitHubアカウント（maloncafe-beep）を連携
2. `<リポジトリ名>` を選択
3. 設定はデフォルトのまま「Deploy」をクリック

デプロイ完了後、公開URLが発行される：
```
https://<リポジトリ名>.vercel.app/
```

---

## STEP 5：修正→自動反映

以降の修正は経営者がVercelを触る必要はない。

```
経営者：「〇〇を変えて」
  ↓
LP：HTMLを編集
  ↓
git add index.html
git commit -m "修正内容"
git push origin main
  ↓
Vercelが自動でビルド・反映（約30秒）
```

---

## 制作実績

| プロジェクト | GitHub | Vercel公開URL | 日付 |
|---|---|---|---|
| masterz-lp | [maloncafe-beep/masterz-lp](https://github.com/maloncafe-beep/masterz-lp) | https://masterz-lp.vercel.app/ | 2026-08-20 |

---

## GitHubアカウント情報

- アカウント：`maloncafe-beep`
- リポジトリ公開設定：public
- Vercel連携済み：maloncafe@gmail.com

---

## 注意事項

- `gh` CLI は未インストール。リポジトリ作成は社長がブラウザで行う
- Vercelのデプロイ設定（初回）は社長が行う。2回目以降はpushだけで自動反映
- WordPress連携（`maloncafe.shop`）は別途設定予定
