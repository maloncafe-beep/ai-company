"""One-off deep research run: 200+ likes, no news, with X post URLs from citations."""
import json
import re
import requests
import yaml


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
    webhook_url = config["slack"]["webhook_url"]

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

    # Debug: save raw response
    with open("data/deep_research_raw.json", "w") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

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

    # Build Slack message
    from datetime import datetime
    now = datetime.now().strftime("%Y-%m-%d %H:%M")
    sorted_posts = sorted(posts, key=lambda p: p.get("likes", 0), reverse=True)

    lines = [f":mag: AI系 Xリサーチ Deep（{now}）- いいね200以上・ニュース除外"]
    lines.append("━" * 20)

    for post in sorted_posts:
        lines.append("")
        lines.append(f":memo: {post.get('content', 'N/A')}")
        lines.append(f":bust_in_silhouette: {post.get('account', 'N/A')}")
        likes = post.get("likes", 0)
        rts = post.get("retweets", 0)
        lines.append(f":heart: いいね: {likes} | :repeat: RT: {rts}")
        url = post.get("url", "")
        if url and url.startswith("http"):
            lines.append(f":link: {url}")
        lines.append("━" * 20)

    lines.append(f":bar_chart: 本日の収集: {len(sorted_posts)}件（Deep Research）")
    message = "\n".join(lines)

    # Send to Slack
    slack_resp = requests.post(webhook_url, json={"text": message}, timeout=10)
    if slack_resp.status_code == 200:
        print(f"\nSlack送信完了: {len(sorted_posts)}件")
    else:
        print(f"\nSlack送信エラー: {slack_resp.status_code}")


if __name__ == "__main__":
    run()