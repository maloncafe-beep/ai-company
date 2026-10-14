"""Grok x_search でAI系Xポストを検索し、ローカルに保存"""
import json
import re
import requests
import yaml

from local_output import save_posts_report, save_raw_response


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


def run():
    with open("config.yaml", "r") as f:
        config = yaml.safe_load(f)

    xai_key = config["xai"]["api_key"]

    prompt = (
        "2026年3月1日〜3月28日のX（Twitter）で話題のAI関連の日本語ポストを探してください。\n"
        "いいね200以上のポストを対象にしてください。\n\n"
        "特に以下のようなポストを重点的に探してください:\n"
        "- AIツール（Claude Code、Cursor、v0、ChatGPT、Grok、Gemini等）の実践的な活用Tips\n"
        "- 効果的なプロンプトの書き方・テンプレート共有\n"
        "- 「〇〇選」「まとめ」系のノウハウ投稿\n"
        "- AI×ビジネス活用の具体的なノウハウや事例\n"
        "- AI関連のプレゼント企画・無料配布系\n\n"
        "以下のポストは除外してください:\n"
        "- 単なる宣伝・アフィリエイト\n"
        "- ニュース記事の紹介・共有（個人の実体験や考察ベースのポストのみ対象）\n\n"
        "10件見つけてください。\n"
        "各ポストのX上の直接URL（https://x.com/ユーザー名/status/数字）を必ず含めてください。\n"
        "以下のJSON配列形式のみで返してください。説明文は不要です:\n"
        "[\n"
        '  {\n'
        '    "account": "@アカウント名",\n'
        '    "content": "ポストの本文をそのまま引用",\n'
        '    "likes": いいね数,\n'
        '    "retweets": リツイート数,\n'
        '    "url": "https://x.com/.../status/..."\n'
        "  }\n"
        "]\n"
    )

    print("Grok x_search でポスト検索中...")
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
                    "from_date": "2026-03-01",
                    "to_date": "2026-03-28",
                }
            ],
        },
        timeout=180,
    )
    if resp.status_code != 200:
        print(f"Error {resp.status_code}: {resp.text[:1000]}")
        return
    data = resp.json()

    raw_path = save_raw_response("grok_raw.json", data)

    # Extract text content from response
    content = ""
    for item in data.get("output", []):
        if item.get("type") == "message":
            for part in item.get("content", []):
                if part.get("type") == "output_text":
                    content += part.get("text", "")

    if not content:
        print("レスポンスからテキストを取得できませんでした。")
        print("Raw response:")
        print(json.dumps(data, ensure_ascii=False, indent=2)[:3000])
        return

    print(f"レスポンス取得完了（{len(content)}文字）")

    # Extract posts
    try:
        posts = extract_json(content)
    except Exception as e:
        print(f"JSON解析エラー: {e}")
        print("Raw content:")
        print(content[:3000])
        return

    print(f"  → {len(posts)}件取得")

    if not posts:
        print("ポストが取得できませんでした。")
        return

    json_path, md_path = save_posts_report("AI系 Xリサーチ - いいね200以上・ニュース除外", posts)
    url_count = sum(1 for post in posts if "x.com/" in post.get("url", ""))
    print(f"\n保存完了！ {len(posts)}件（URL付き: {url_count}/{len(posts)}件）")
    print(f"Raw: {raw_path}")
    print(f"JSON: {json_path}")
    print(f"Markdown: {md_path}")


if __name__ == "__main__":
    run()
