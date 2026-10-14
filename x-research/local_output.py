"""Local file output helpers for X research scripts."""
from __future__ import annotations

import json
from datetime import datetime
from pathlib import Path
from typing import Any


BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
RESULTS_DIR = BASE_DIR / "results"


def save_raw_response(name: str, data: dict[str, Any]) -> Path:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    path = DATA_DIR / name
    with path.open("w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    return path


def save_posts_report(title: str, posts: list[dict[str, Any]]) -> tuple[Path, Path]:
    RESULTS_DIR.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    sorted_posts = sorted(posts, key=lambda p: p.get("likes", 0), reverse=True)

    json_path = RESULTS_DIR / f"{timestamp}_posts.json"
    md_path = RESULTS_DIR / f"{timestamp}_posts.md"

    with json_path.open("w", encoding="utf-8") as f:
        json.dump(sorted_posts, f, ensure_ascii=False, indent=2)

    lines = [f"# {title}", ""]
    lines.append(f"- generated_at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    lines.append(f"- count: {len(sorted_posts)}")
    lines.append("")

    for i, post in enumerate(sorted_posts, start=1):
        lines.append(f"## {i}. {post.get('account', 'N/A')}")
        lines.append("")
        lines.append(str(post.get("content", "N/A")).strip())
        lines.append("")
        lines.append(f"- likes: {post.get('likes', 0)}")
        lines.append(f"- retweets: {post.get('retweets', 0)}")
        url = post.get("url", "")
        if url:
            lines.append(f"- url: {url}")
        lines.append("")

    md_path.write_text("\n".join(lines), encoding="utf-8")
    return json_path, md_path


def save_theme_report(title: str, themes: list[dict[str, Any]]) -> tuple[Path, Path]:
    RESULTS_DIR.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

    json_path = RESULTS_DIR / f"{timestamp}_themes.json"
    md_path = RESULTS_DIR / f"{timestamp}_themes.md"

    with json_path.open("w", encoding="utf-8") as f:
        json.dump(themes, f, ensure_ascii=False, indent=2)

    lines = [f"# {title}", ""]
    lines.append(f"- generated_at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    lines.append(f"- count: {len(themes)}")
    lines.append("")

    for i, theme in enumerate(themes, start=1):
        lines.append(f"## {i}. {theme.get('theme', 'N/A')}")
        lines.append("")
        for key, label in [
            ("observed_pattern", "Xで見えた反応"),
            ("iwakan", "違和感"),
            ("reader_voice", "読者の内心"),
            ("structure_hypothesis", "構造仮説"),
            ("post_angle", "投稿化の角度"),
            ("generate_theme", "generate-posts用テーマ"),
            ("search_keywords", "追加検索キーワード"),
            ("notes", "メモ"),
        ]:
            value = theme.get(key)
            if not value:
                continue
            lines.append(f"### {label}")
            if isinstance(value, list):
                for item in value:
                    lines.append(f"- {item}")
            else:
                lines.append(str(value).strip())
            lines.append("")

    md_path.write_text("\n".join(lines), encoding="utf-8")
    return json_path, md_path
