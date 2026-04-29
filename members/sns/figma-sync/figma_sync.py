#!/usr/bin/env python3
"""Figma テンプレートにテキスト・カラーを流し込むための補助スクリプト（最小雛形）。

Figma REST API は read のみ（書き込みは Plugin が必要）なので、
ここでは「投稿原稿（JSON）を整形して pbcopy → Figma プラグインで貼り付け」フローを支援する。

使い方:
  1. ~/ai-company/.env に FIGMA_ACCESS_TOKEN / FIGMA_FILE_KEY をセット
  2. 投稿原稿 JSON を引数で渡す:
     python3 figma_sync.py posts.json
  3. クリップボードに整形済みJSONがコピーされるので、Figma の対応プラグイン
     （例: "Content Reel", "JSON to Figma" 等）に貼り付け
"""
import json
import os
import subprocess
import sys
from pathlib import Path


def load_env(env_path: Path) -> dict[str, str]:
    """簡易 .env パーサ。"""
    env = {}
    if not env_path.exists():
        return env
    for line in env_path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        k, _, v = line.partition("=")
        env[k.strip()] = v.strip().strip('"').strip("'")
    return env


def fetch_template_metadata(file_key: str, token: str) -> dict:
    """Figma の対象ファイルからフレーム名一覧を取得（参考用）。"""
    import urllib.request
    req = urllib.request.Request(
        f"https://api.figma.com/v1/files/{file_key}",
        headers={"X-Figma-Token": token},
    )
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read().decode("utf-8"))


def to_clipboard(text: str) -> None:
    if sys.platform == "win32":
        p = subprocess.Popen(["clip"], stdin=subprocess.PIPE)
        p.communicate(text.encode("utf-16-le"))
    else:
        p = subprocess.Popen(["pbcopy"], stdin=subprocess.PIPE)
        p.communicate(text.encode("utf-8"))


def main() -> None:
    if len(sys.argv) != 2:
        print("Usage: python3 figma_sync.py <posts.json>")
        sys.exit(1)

    env = load_env(Path.home() / "ai-company" / ".env")
    token = env.get("FIGMA_ACCESS_TOKEN") or os.environ.get("FIGMA_ACCESS_TOKEN")
    file_key = env.get("FIGMA_FILE_KEY") or os.environ.get("FIGMA_FILE_KEY")

    posts_json = Path(sys.argv[1]).read_text(encoding="utf-8")
    posts = json.loads(posts_json)

    # 整形（Figmaプラグインが期待する形に必要に応じて加工）
    payload = json.dumps(posts, ensure_ascii=False, indent=2)
    to_clipboard(payload)
    print(f"✓ {len(posts) if isinstance(posts, list) else 1} 件をクリップボードにコピーしました")
    print("  Figma で「Content Reel」等のプラグインを開いて貼り付けてください")

    if token and file_key:
        try:
            meta = fetch_template_metadata(file_key, token)
            page_count = len(meta.get("document", {}).get("children", []))
            print(f"  対象 Figma ファイル: {meta.get('name', '?')} ({page_count} ページ)")
        except Exception as e:
            print(f"  (Figma メタ取得スキップ: {e})")


if __name__ == "__main__":
    main()
