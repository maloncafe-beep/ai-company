# LP軽量ひな型プロジェクト

この構成は、`HTML + CSS + 画像 + SKILL.md` だけでスマホ最適化LPを量産するための軽量テンプレートです。

## 目的

- ChatGPT / Codex に渡す素材を1フォルダにまとめる
- Pinterest などで集めた参考デザインを画像として同梱する
- サイズ、色、雰囲気、構成ルールを `SKILL.md` に保存する
- フォルダをコピーして、文言と画像を差し替えるだけで新しいLPを作る

## 基本構成

```text
lp-packs/
  starter-mobile-first/
    index.html
    style.css
    SKILL.md
    images/
      inspiration-board.svg
      hero-reference.svg
      logo-placeholder.svg
```

## 使い方

1. `lp-packs/starter-mobile-first` を複製する
2. フォルダ名を案件名に変更する
3. `images/` に Pinterest などから作った参考画像やロゴ素材を入れる
4. `SKILL.md` のテーマ、サイズ、ターゲット、構成ルールを更新する
5. `index.html` の文言を実案件に差し替える
6. `style.css` で色や余白を微調整する

## SKILL.md に入れるべき情報

- LPの目的
- 想定デバイスと優先サイズ
- デザインテーマ
- 色設計
- 参考画像の役割
- セクション構成
- コピーのトーン
- 禁止事項

## 運用のコツ

- `1案件 = 1フォルダ` にすると管理しやすいです
- 画像ファイル名は役割ベースで統一すると再利用しやすいです
- 参考画像は `images/` にまとめ、`SKILL.md` から参照できるようにします
- 最初はスマホ幅で完成させてからPC幅を整えると早いです

