#!/usr/bin/env python3
"""
スタンプ一覧1枚PNGを、LINE仕様のスタンプ画像に分割する。

使い方:
  python split_sheet.py input/sheet.png            # 40枚（5列×8行）
  python split_sheet.py input/sheet.png -n 16      # 16枚（4列×4行）
  python split_sheet.py input/sheet_transparent.png  # Canvaで透過済みの場合（アルファをそのまま使う）
  python split_sheet.py input/a.png --grid 5x4 -o output/set   # 任意の列x行（20枚）
  python split_sheet.py input/b.png --grid 5x4 -o output/set --start 21  # 続き（21〜40）

入力が背景透過済み(RGBA)ならアルファを使い、背景が不透明なら
セル四辺とつながっている背景色だけを透過にする（体の内側の明るい色は抜けない）。
前提: 一覧は均等な5列×8行で、各スタンプが区画内に余白つきで収まっている
（絵が区画の境界に触れていれば検査で警告する。位置を調整するのではなく一覧を作り直す）。
出力: output/<入力名>/01.png ... （370x320固定・中央配置・左右30px/上下25px余白・最低20px）
検査: 全ファイルのサイズ・透過・余白・1MBを自動検査。--zip で01〜40.pngのZIPも作成。
"""

import argparse
import sys
import zipfile
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter

from image_utils import save_png_constrained
from line_specs import STICKER_MAX_SIZE, MAX_ZIP_SIZE_MB

# 枚数 -> (列, 行)
GRIDS = {8: (2, 4), 16: (4, 4), 24: (4, 6), 32: (4, 8), 40: (5, 8)}

MARGIN_X, MARGIN_Y = 30, 25  # 推奨の透明余白（左右・上下）
MIN_MARGIN = 20              # 最低限の透明余白（検査の合格ライン）
BG_TOLERANCE = 8  # 背景色との許容差（大きいと明るい毛並みまで抜ける）


def has_real_alpha(img: Image.Image) -> bool:
    if img.mode != "RGBA":
        return False
    lo, _ = img.getchannel("A").getextrema()
    return lo < 250


def estimate_bg(img: Image.Image) -> tuple:
    """シート四隅の色の中央値を背景色とする"""
    rgb = img.convert("RGB")
    w, h = rgb.size
    pts = [(2, 2), (w - 3, 2), (2, h - 3), (w - 3, h - 3)]
    px = [rgb.getpixel(p) for p in pts]
    return tuple(sorted(c[i] for c in px)[len(px) // 2] for i in range(3))


def remove_bg(cell: Image.Image, bg: tuple) -> Image.Image:
    """セル外周とつながる背景色だけを透過にする"""
    rgb = cell.convert("RGB")
    w, h = rgb.size
    diff = ImageChops.difference(rgb, Image.new("RGB", (w, h), bg))
    dmax = ImageChops.lighter(ImageChops.lighter(*[diff.getchannel(i) for i in (0, 1)]), diff.getchannel(2))
    # 背景候補=255, それ以外=0。1px白枠を足して外周から一括flood fill
    cand = dmax.point(lambda v: 255 if v <= BG_TOLERANCE else 0)
    padded = Image.new("L", (w + 2, h + 2), 255)
    padded.paste(cand, (1, 1))
    ImageDraw.floodfill(padded, (0, 0), 128)
    flooded = padded.crop((1, 1, w + 1, h + 1)).point(lambda v: 0 if v == 128 else 255)
    alpha = flooded.filter(ImageFilter.GaussianBlur(0.8))
    out = cell.convert("RGBA")
    out.putalpha(alpha)
    return out


def add_outline(img: Image.Image, px: int) -> Image.Image:
    """外周に白フチを付ける（暗いトーク背景で黒文字が読めるように）"""
    pad = px + 2
    big = Image.new("RGBA", (img.width + 2 * pad, img.height + 2 * pad), (0, 0, 0, 0))
    big.paste(img, (pad, pad))
    mask = big.getchannel("A").point(lambda v: 255 if v > 16 else 0)
    mask = mask.filter(ImageFilter.MaxFilter(2 * px + 1)).filter(ImageFilter.GaussianBlur(0.8))
    out = Image.new("RGBA", big.size, (255, 255, 255, 0))
    out.putalpha(mask)
    out.alpha_composite(big)
    return out


def fit_sticker(img: Image.Image, outline: int = 0) -> Image.Image:
    """余白トリム→縮小して370x320の透明キャンバス中央に置く（切り取らず縮小で収める）"""
    bbox = img.getchannel("A").point(lambda v: 255 if v > 16 else 0).getbbox()
    if bbox is None:
        raise ValueError("空のセルです（背景しかありません）")
    img = img.crop(bbox)
    if outline:
        img = add_outline(img, outline)
    cw, ch = STICKER_MAX_SIZE
    max_w, max_h = cw - 2 * MARGIN_X, ch - 2 * MARGIN_Y
    w, h = img.size
    ratio = min(max_w / w, max_h / h)
    nw, nh = max(2, round(w * ratio)), max(2, round(h * ratio))
    img = img.resize((nw, nh), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (cw, ch), (0, 0, 0, 0))
    canvas.paste(img, ((cw - nw) // 2, (ch - nh) // 2), img)
    return canvas


def touches_cell_edge(cell: Image.Image) -> bool:
    """絵が区画の外周に接触していないか（接触=はみ出し・隣の混入の疑い）"""
    a = cell.getchannel("A").point(lambda v: 255 if v > 16 else 0)
    w, h = a.size
    edges = [a.crop((0, 0, w, 1)), a.crop((0, h - 1, w, h)), a.crop((0, 0, 1, h)), a.crop((w - 1, 0, w, h))]
    return any(e.getextrema()[1] > 0 for e in edges)


def inspect(path: Path) -> list:
    """出力1枚の検査。問題点のリストを返す（空なら合格）"""
    problems = []
    im = Image.open(path)
    if im.size != STICKER_MAX_SIZE:
        problems.append(f"サイズ{im.size}")
    if im.mode != "RGBA":
        problems.append("RGBAでない")
        return problems
    w, h = im.size
    a = im.getchannel("A")
    if any(a.getpixel(p) != 0 for p in [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]):
        problems.append("四隅が透過でない")
    bbox = a.point(lambda v: 255 if v > 16 else 0).getbbox()
    if bbox is None:
        problems.append("空画像")
    else:
        m = min(bbox[0], bbox[1], w - bbox[2], h - bbox[3])
        if m < MIN_MARGIN:
            problems.append(f"余白{m}px（最低{MIN_MARGIN}px）")
    if path.stat().st_size > 1024 * 1024:
        problems.append("1MB超")
    return problems


def split(sheet_path: Path, grid: tuple, out_dir: Path, outline: int = 0, start: int = 1) -> tuple:
    cols, rows = grid
    count = cols * rows
    sheet = Image.open(sheet_path)
    transparent = has_real_alpha(sheet)
    sheet = sheet.convert("RGBA")
    bg = None if transparent else estimate_bg(sheet)
    W, H = sheet.size
    cw, ch = W / cols, H / rows
    out_dir.mkdir(parents=True, exist_ok=True)
    saved, warns = [], []
    for i in range(count):
        c, r = i % cols, i // cols
        cell = sheet.crop((round(c * cw), round(r * ch), round((c + 1) * cw), round((r + 1) * ch)))
        if not transparent:
            cell = remove_bg(cell, bg)
        if touches_cell_edge(cell):
            warns.append(f"{start + i:02d}: 絵が区画の端に接触（はみ出し/隣の混入の疑い。一覧を作り直す）")
        sticker = fit_sticker(cell, outline)
        path = out_dir / f"{start + i:02d}.png"
        if not save_png_constrained(sticker, path):
            print(f"警告: {path.name} が1MBを超えています")
        saved.append(path)
    return saved, warns


def main():
    p = argparse.ArgumentParser(description="スタンプ一覧PNGを分割")
    p.add_argument("sheet", type=Path)
    p.add_argument("-n", "--count", type=int, default=40, choices=sorted(GRIDS))
    p.add_argument("--grid", help="列x行を直接指定（例: 5x4）。指定時は --count を無視")
    p.add_argument("--start", type=int, default=1, help="先頭の連番（複数シートを同じ出力先に続けるとき）")
    p.add_argument("-o", "--out", type=Path, default=None, help="出力先（既定: output/<入力名>）")
    p.add_argument("--zip", action="store_true", help="検査合格なら01〜NN.pngをZIPにまとめる")
    p.add_argument("--outline", type=int, default=0, help="白フチの太さpx（例: 4）。既定は付けない")
    a = p.parse_args()
    out = a.out or Path("output") / a.sheet.stem
    grid = tuple(int(x) for x in a.grid.lower().split("x")) if a.grid else GRIDS[a.count]
    files, warns = split(a.sheet, grid, out, a.outline, a.start)
    ng = {f.name: pr for f in files if (pr := inspect(f))}
    print(f"{len(files)}枚を {out} に保存しました")
    for w in warns:
        print("警告", w)
    for name, pr in ng.items():
        print("NG", name, "/".join(pr))
    ok = not ng and not warns
    print("検査: 全て合格" if ok else f"検査: 要確認（警告{len(warns)}件・NG{len(ng)}件）")
    if a.zip:
        ng = {f.name: pr for f in sorted(out.glob("[0-9][0-9].png")) if (pr := inspect(f))}
        if ng:
            print("NGがあるためZIPは作成しません")
            return 1
        zp = out.with_suffix(".zip")
        with zipfile.ZipFile(zp, "w", zipfile.ZIP_DEFLATED) as zf:
            files = sorted(out.glob("[0-9][0-9].png"))  # 複数シートを続けた場合も全部入れる
            for f in files:
                zf.write(f, f.name)
        mb = zp.stat().st_size / 1024 / 1024
        print(f"ZIP: {zp}（{len(files)}ファイル・{mb:.1f}MB）" + ("" if mb <= MAX_ZIP_SIZE_MB else " ※60MB超"))
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
