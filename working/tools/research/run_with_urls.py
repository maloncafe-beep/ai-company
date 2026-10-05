"""Perplexity (sonar) でポスト取得 → SerpAPI で X ポスト URL を検索 → Slack 送信"""
import json
import re
import time
import requests
import yaml
from serpapi import GoogleSearch
from datetime import datetime


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


def search_x_url(serpapi_key: str, account: str, content: str) -> str | None:
    """SerpAPI Google検索でXポストのURLを探す"""
    # アカウント名からクエリ構築
    account_clean = account.lstrip("@")
    # 内容の先頭30文字をキーワードに
    keywords = content[:50].replace("\n", " ").strip()
    query = f"site:x.com {account_clean} {keywords}"

    try:
        params = {
            "engine": "google",
            "q": query,
            "api_key": serpapi_key,
            "num": 3,
            "hl": "ja",
        }
        result = GoogleSearch(params).get_dict()
        organic = result.get("organic_results", [])
        for r in organic:
            link = r.get("link", "")
            if ("x.com/" in link or "twitter.com/" in link) and "/status/" in link:
                return link
    except Exception as e:
        print(f"  [SerpAPI error for {account}] {e}")
    return None


def run():
    with open("config.yaml", "r") as f:
        config = yaml.safe_load(f)

    pplx_key = config["perplexity"]["api_key"]
    serpapi_key = config["serpapi"]["api_key"]
    webhook_url = config["slack"]["webhook_url"]

    # Step 1: Perplexity でポスト取得
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
        "URLは不要です。ポストの内容をそのまま正確に引用してください。\n"
        "以下のJSON配列形式のみで返してください。説明文は不要です:\n"
        "[\n"
        '  {\n'
        '    "account": "@アカウント名",\n'
        '    "content": "ポストの本文をそのまま引用（できるだけ原文に忠実に）",\n'
        '    "likes": いいね数,\n'
        '    "retweets": リツイート数\n'
        "  }\n"
        "]\n"
    )

    print("Step 1: Perplexity でポスト検索中...")
    resp = requests.post(
        "https://api.perplexity.ai/chat/completions",
        headers={
            "Authorization": f"Bearer {pplx_key}",
            "Content-Type": "application/json",
        },
        json={
            "model": "sonar",
            "messages": [{"role": "user", "content": prompt}],
        },
        timeout=120,
    )
    resp.raise_for_status()
    data = resp.json()
    content = data["choices"][0]["message"]["content"]
    posts = extract_json(content)
    print(f"  → {len(posts)}件取得")

    if not posts:
        print("ポストが取得できませんでした。")
        return

    # Step 2: SerpAPI で URL 検索
    print("\nStep 2: SerpAPI でXポストURL検索中...")
    for i, post in enumerate(posts):
        account = post.get("account", "")
        post_content = post.get("content", "")
        print(f"  [{i+1}/{len(posts)}] {account} ...")
        url = search_x_url(serpapi_key, account, post_content)
        post["url"] = url or ""
        if url:
            print(f"    → {url}")
        else:
            print(f"    → URL見つからず")
        time.sleep(1)  # rate limit対策

    # Step 3: Slack 送信
    now = datetime.now().strftime("%Y-%m-%d %H:%M")
    sorted_posts = sorted(posts, key=lambda p: p.get("likes", 0), reverse=True)

    lines = [f":mag: AI系 Xリサーチ（{now}）- いいね200以上・ニュース除外"]
    lines.append("━" * 20)

    url_count = 0
    for post in sorted_posts:
        lines.append("")
        lines.append(f":memo: {post.get('content', 'N/A')}")
        lines.append(f":bust_in_silhouette: {post.get('account', 'N/A')}")
        likes = post.get("likes", 0)
        rts = post.get("retweets", 0)
        lines.append(f":heart: いいね: {likes} | :repeat: RT: {rts}")
        url = post.get("url", "")
        if url:
            lines.append(f":link: {url}")
            url_count += 1
        lines.append("━" * 20)

    lines.append(f":bar_chart: 収集: {len(sorted_posts)}件（URL取得: {url_count}件）")
    message = "\n".join(lines)

    print(f"\nStep 3: Slack送信中...")
    slack_resp = requests.post(webhook_url, json={"text": message}, timeout=10)
    if slack_resp.status_code == 200:
        print(f"完了！ {len(sorted_posts)}件送信（URL取得: {url_count}/{len(sorted_posts)}件）")
    else:
        print(f"Slack送信エラー: {slack_resp.status_code}")


if __name__ == "__main__":
    run()