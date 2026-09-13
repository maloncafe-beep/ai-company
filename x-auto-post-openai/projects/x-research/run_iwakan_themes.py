"""X上の反応から「違和感収集家」向けの投稿テーマ候補を探す。"""
from __future__ import annotations

import argparse
import json
import re
from datetime import date, timedelta

import requests
import yaml

from local_output import save_raw_response, save_theme_report


def extract_json(content: str) -> list[dict]:
    try:
        return json.loads(content)
    except json.JSONDecodeError:
        pass
    match = re.search(r"```(?:json)?\s*(\[.*?\])\s*```", content, re.DOTALL)
    if match:
        return json.loads(match.group(1))
    match = re.search(r"\[.*\]", content, re.DOTALL)
    if match:
        return json.loads(match.group(0))
    raise json.JSONDecodeError("No JSON array found", content, 0)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Xの投稿傾向から、違和感収集家向けのテーマ候補をローカル保存します。"
    )
    parser.add_argument("--days", type=int, default=14, help="直近何日分を見るか。初期値: 14")
    parser.add_argument(
        "--query",
        default="効率化 生産性 評価制度 成果主義 役割 期待 同調圧力 世代間ギャップ 働き方改革 多様性",
        help="X検索で重視するキーワード。",
    )
    parser.add_argument("--count", type=int, default=10, help="テーマ候補数。初期値: 10")
    return parser.parse_args()


def build_prompt(query: str, count: int, from_date: str, to_date: str) -> str:
    return f"""X（Twitter）上の日本語投稿から、「違和感収集家」アカウントの投稿テーマになりそうなネタを探してください。

# 期間
{from_date} から {to_date}

# 見たいもの
{query}

# 目的
正確な投稿数、いいね数、RT数、ランキングは不要です。
伸びている投稿そのものを集めるのではなく、複数の投稿に共通する「言語化されていない違和感」「日常のズレ」「読者が自分のことだと思いやすい悩み」を抽出してください。
個人の落ち込みや弱音そのものではなく、社会・職場・家族・制度・評価・常識の中にある構造的なズレを優先してください。

# 優先するテーマ
- 仕事や生活の中で、制度や期待と実態が噛み合っていない場面
- 人間関係でよくある言葉と本音のズレ
- 制度や仕組みの言葉と、現場で起きていることのズレ
- 「よいこと」とされる施策が、別の負担や沈黙を生む場面
- 誰かを責めず、自分の内側に戻せる問いになるもの

# 避ける方向
- 感情の重さを直接テーマにするもの
- ネガティブな体験談だけで終わるもの
- 個人のメンタル不調だけに寄ったもの

# 除外
- 炎上、政治、芸能、事件、ニュース紹介
- 特定個人や会社を攻撃するもの
- AIツール紹介、稼げる系、ノウハウ販売に直結するもの
- 投稿本文の長い引用
- いいね数やRT数を根拠にした順位付け

# 出力
{count}件。
以下のJSON配列のみで返してください。説明文は不要です。

[
  {{
    "theme": "短いテーマ名",
    "observed_pattern": "X上で見えた反応や会話の傾向を要約",
    "iwakan": "このテーマの中心にある違和感",
    "reader_voice": "読者が内心で言いそうな一言",
    "structure_hypothesis": "なぜそのズレが起きているかの仮説",
    "post_angle": "X投稿にするならどの角度で切り出すか",
    "generate_theme": "node tools/generate-posts.mjs --theme に渡せる具体的なテーマ文",
    "search_keywords": ["追加で深掘りする検索語"],
    "notes": "扱うときの注意点"
  }}
]
"""


def run() -> None:
    args = parse_args()
    today = date.today()
    from_day = today - timedelta(days=args.days)
    from_date = from_day.isoformat()
    to_date = today.isoformat()

    with open("config.yaml", "r", encoding="utf-8") as f:
        config = yaml.safe_load(f)

    xai_key = config["xai"]["api_key"]
    prompt = build_prompt(args.query, args.count, from_date, to_date)

    print(f"Grok x_search で違和感テーマを検索中... ({from_date} - {to_date})")
    resp = requests.post(
        "https://api.x.ai/v1/responses",
        headers={
            "Authorization": f"Bearer {xai_key}",
            "Content-Type": "application/json",
        },
        json={
            "model": "grok-4-1-fast",
            "input": [{"role": "user", "content": prompt}],
            "tools": [
                {
                    "type": "x_search",
                    "from_date": from_date,
                    "to_date": to_date,
                }
            ],
        },
        timeout=180,
    )
    if resp.status_code != 200:
        print(f"Error {resp.status_code}: {resp.text[:1000]}")
        return

    data = resp.json()
    raw_path = save_raw_response("iwakan_themes_raw.json", data)

    content = ""
    for item in data.get("output", []):
        if item.get("type") == "message":
            for part in item.get("content", []):
                if part.get("type") == "output_text":
                    content += part.get("text", "")

    if not content:
        print("レスポンスからテキストを取得できませんでした。")
        print(json.dumps(data, ensure_ascii=False, indent=2)[:3000])
        return

    try:
        themes = extract_json(content)
    except Exception as e:
        print(f"JSON解析エラー: {e}")
        print(content[:3000])
        return

    json_path, md_path = save_theme_report("違和感収集家 Xテーマリサーチ", themes)
    print(f"保存完了！ {len(themes)}件")
    print(f"Raw: {raw_path}")
    print(f"JSON: {json_path}")
    print(f"Markdown: {md_path}")
    print("")
    print("生成に使う例:")
    if themes:
        print(f'node tools/generate-posts.mjs --count 1 --type thread --theme "{themes[0].get("generate_theme", themes[0].get("theme", ""))}"')


if __name__ == "__main__":
    run()
