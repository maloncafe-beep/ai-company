"""Grok x_search でClaude Code関連のXポストを検索"""
import json
import re
import requests
import yaml
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


def run():
    with open("config.yaml", "r") as f:
        config = yaml.safe_load(f)

    xai_key = config["xai"]["api_key"]
    webhook_url = config["slack"]["webhook_url"]

    prompt = (
        "2026年3月1日〜3月28日のX（Twitter）で「Claude Code」に関する日本語ポストを探してください。\n"
        "いいね100以上のポストを対象にしてください。\n\n"
        "特に以下のようなポストを重点的に探してください:\n"
        "- Claude Codeの実践的な活用Tips・使い方\n"
        "- Claude Codeを使った開発体験・感想\n"
        "- Claude Codeのプロンプトやワークフローの共有\n"
        "- Claude Codeと他ツール（Cursor等）の比較\n"
        "- Claude Codeの新機能・アップデート情報\n"
        "- CLAUDE.mdやフック機能などの設定ノウハウ\n\n"
        "以下のポストは除外してください:\n"
        "- 英語のポスト\n"
        "- 単なる宣伝・アフィリエイト\n"
        "- ニュース記事のリンクだけのポスト\n\n"
        "できるだけ多く見つけてください（最大20件）。\n"
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

    print("Grok x_search で Claude Code 関連ポスト検索中...")
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

    with open("data/grok_cc_raw.json", "w") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

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

    print(f"レスポンス取得完了（{len(content)}文字）")

    try:
        posts = extract_json(content)
    except Exception as e:
        print(f"JSON解析エラー: {e}")
        print(content[:3000])
        return

    print(f"  → {len(posts)}件取得")

    if not posts:
        print("ポストが取得できませんでした。")
        return

    # Slack送信
    now = datetime.now().strftime("%Y-%m-%d %H:%M")
    sorted_posts = sorted(posts, key=lambda p: p.get("likes", 0), reverse=True)

    lines = [f":robot_face: Claude Code Xリサーチ（{now}）- 3月・いいね100以上・日本語"]
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
        if url and "x.com/" in url:
            lines.append(f":link: {url}")
            url_count += 1
        lines.append("━" * 20)

    lines.append(f":bar_chart: 収集: {len(sorted_posts)}件（URL付き: {url_count}件）")
    message = "\n".join(lines)

    print(f"\nSlack送信中...")
    slack_resp = requests.post(webhook_url, json={"text": message}, timeout=10)
    if slack_resp.status_code == 200:
        print(f"完了！ {len(sorted_posts)}件送信（URL付き: {url_count}/{len(sorted_posts)}件）")
    else:
        print(f"Slack送信エラー: {slack_resp.status_code}")


if __name__ == "__main__":
    run()