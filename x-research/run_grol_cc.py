"""Grok x_search でClaude Code関連のXポストを検索し、ローカルに保存"""
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

    raw_path = save_raw_response("grok_cc_raw.json", data)

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

    json_path, md_path = save_posts_report("Claude Code Xリサーチ - 3月・いいね100以上・日本語", posts)
    url_count = sum(1 for post in posts if "x.com/" in post.get("url", ""))
    print(f"\n保存完了！ {len(posts)}件（URL付き: {url_count}/{len(posts)}件）")
    print(f"Raw: {raw_path}")
    print(f"JSON: {json_path}")
    print(f"Markdown: {md_path}")


if __name__ == "__main__":
    run()
