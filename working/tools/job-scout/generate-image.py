#!/usr/bin/env python3
"""
Gemini 画像生成スクリプト
Usage: python3 generate-image.py "英語プロンプト" [保存ファイル名] [--model=モデル名] [--ref=画像パス ...]

利用可能モデル:
  - gemini-3-pro-image-preview      (推奨/高品質/テキスト精度◎)
  - gemini-3.1-flash-image-preview  (推奨/高速/テキスト精度◎)
  - nano-banana-pro-preview         (推奨/高品質/テキスト精度◎)
  - gemini-2.5-flash-image          (旧モデル/非推奨)

例:
  python3 generate-image.py "..." chara-robot --model=gemini-3-pro-image-preview
  python3 generate-image.py "..." scene-01 --ref=chara.png --model=nano-banana-pro-preview
"""

import sys
import os
import json
import base64
import requests
from datetime import datetime

API_KEY = os.environ.get("GEMINI_API_KEY")
if not API_KEY:
    print("ERROR: GEMINI_API_KEY が設定されていません")
    print("  export GEMINI_API_KEY='your-key' を実行してください")
    sys.exit(1)

# デフォルトの保存先
SAVE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "shared")

def generate_image(prompt, filename=None, ref_images=None, model="gemini-3-pro-image-preview"):
    """Geminiで画像を生成して保存。ref_imagesで参考画像を添付可能。"""

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={API_KEY}"

    # パーツ構築（テキスト + 参考画像）
    parts = []

    # 参考画像があれば先に添付
    if ref_images:
        for img_path in ref_images:
            img_path = os.path.abspath(img_path)
            if not os.path.exists(img_path):
                print(f"  Warning: 参考画像が見つかりません: {img_path}")
                continue
            with open(img_path, "rb") as f:
                img_data = base64.b64encode(f.read()).decode("utf-8")
            ext = img_path.lower().rsplit(".", 1)[-1]
            mime = {"png": "image/png", "jpg": "image/jpeg", "jpeg": "image/jpeg", "webp": "image/webp"}.get(ext, "image/png")
            parts.append({"inlineData": {"mimeType": mime, "data": img_data}})
            print(f"  📎 参考画像: {os.path.basename(img_path)}")

    parts.append({"text": f"Generate an image: {prompt}"})

    payload = {
        "contents": [{"parts": parts}],
        "generationConfig": {
            "responseModalities": ["TEXT", "IMAGE"]
        }
    }

    headers = {"Content-Type": "application/json"}

    print(f"🎨 生成中: {prompt}")
    print(f"   Model: {model}")

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=120)
        response.raise_for_status()
        result = response.json()
    except requests.exceptions.HTTPError as e:
        print(f"❌ API Error: {e}")
        print(f"   Response: {response.text[:500]}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)

    # レスポンスから画像データを探す
    candidates = result.get("candidates", [])
    if not candidates:
        print("❌ 画像が生成されませんでした")
        print(f"   Response: {json.dumps(result, indent=2)[:500]}")
        sys.exit(1)

    image_saved = False
    for part in candidates[0].get("content", {}).get("parts", []):
        if "inlineData" in part:
            mime_type = part["inlineData"].get("mimeType", "image/png")
            image_data = base64.b64decode(part["inlineData"]["data"])

            # ファイル拡張子
            ext = "png" if "png" in mime_type else "jpg" if "jpeg" in mime_type else "webp"

            # ファイル名決定
            if not filename:
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                filename = f"generated_{timestamp}"

            # プロンプトからカテゴリを推測して保存先を決定
            prompt_lower = prompt.lower()
            if any(w in prompt_lower for w in ["background", "texture", "pattern", "gradient", "abstract"]):
                save_dir = os.path.join(SAVE_DIR, "backgrounds")
            elif any(w in prompt_lower for w in ["character", "mascot", "person", "avatar"]):
                save_dir = os.path.join(SAVE_DIR, "characters")
            elif any(w in prompt_lower for w in ["icon", "symbol", "logo", "badge"]):
                save_dir = os.path.join(SAVE_DIR, "icons")
            else:
                save_dir = SAVE_DIR

            os.makedirs(save_dir, exist_ok=True)
            filepath = os.path.join(save_dir, f"{filename}.{ext}")

            with open(filepath, "wb") as f:
                f.write(image_data)

            size_kb = len(image_data) / 1024
            print(f"✅ 保存完了: {filepath}")
            print(f"   サイズ: {size_kb:.1f} KB")
            print(f"   形式: {mime_type}")
            image_saved = True
            return filepath

        elif "text" in part:
            # テキスト応答があれば表示
            text = part["text"]
            if text.strip():
                print(f"   Gemini: {text[:200]}")

    if not image_saved:
        print("❌ 画像データが含まれていませんでした")
        print("   テキストのみの応答でした。プロンプトを変えて再試行してください。")
        sys.exit(1)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    prompt = sys.argv[1]
    filename = None
    ref_images = []
    model = "gemini-3-pro-image-preview"

    for arg in sys.argv[2:]:
        if arg.startswith("--ref="):
            ref_images.append(arg[6:])
        elif arg.startswith("--model="):
            model = arg[8:]
        elif filename is None:
            filename = arg

    generate_image(prompt, filename, ref_images if ref_images else None, model)
