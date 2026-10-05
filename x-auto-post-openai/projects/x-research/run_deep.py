"""One-off deep research run: 200+ likes, no news, with local output."""
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

    api_key = config["perplexity"]["api_key"]

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
        "各ポストのX（Twitter）上の直接URLも可能な限り含めてください。\n"
        "以下のJSON配列形式のみで返してください。説明文は不要です:\n"
        "[\n"
        '  {\n'
        '    "account": "@アカウント名",\n'
        '    "content": "ポストの本文をそのまま引用（できるだけ原文に忠実に）",\n'
        '    "likes": いいね数,\n'
        '    "retweets": リツイート数,\n'
        '    "url": "https://x.com/... のポスト直リンク（わかる場合）"\n'
        "  }\n"
        "]\n"
    )

    print("Calling Perplexity sonar-deep-research... (this may take a few minutes)")
    resp = requests.post(
        "https://api.perplexity.ai/chat/completions",
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        json={
            "model": "sonar-deep-research",
            "messages": [{"role": "user", "content": prompt}],
        },
        timeout=300,
    )
    resp.raise_for_status()
    data = resp.json()

    content = data["choices"][0]["message"]["content"]
    citations = data.get("citations", [])

    raw_path = save_raw_response("deep_research_raw.json", data)

    print(f"\nCitations ({len(citations)}):")
    for i, c in enumerate(citations):
        print(f"  [{i}] {c}")

    # Extract posts
    try:
        posts = extract_json(content)
    except Exception:
        print("\n[WARN] Could not parse JSON from response. Raw content:")
        print(content[:3000])
        posts = []

    if not posts:
        print("No posts extracted.")
        return

    # Try to match citations (x.com / twitter.com URLs) to posts
    x_urls = [c for c in citations if "x.com/" in c or "twitter.com/" in c]
    print(f"\nX URLs from citations: {len(x_urls)}")
    for u in x_urls:
        print(f"  {u}")

    json_path, md_path = save_posts_report("AI系 Xリサーチ Deep - いいね200以上・ニュース除外", posts)
    print(f"\n保存完了: {len(posts)}件")
    print(f"Raw: {raw_path}")
    print(f"JSON: {json_path}")
    print(f"Markdown: {md_path}")


if __name__ == "__main__":
    run()
