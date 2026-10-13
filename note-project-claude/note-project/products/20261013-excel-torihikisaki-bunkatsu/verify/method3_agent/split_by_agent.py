# -*- coding: utf-8 -*-
"""売上一覧を取引先ごとのExcelに分割する。
実行: python split.py [入力ファイル名]   (省略時は 売上一覧_2026-09.xlsx)
このスクリプトと同じフォルダを基準に動く。元ファイルは読み取り専用で開き、変更しない。
"""
import re
import sys
from collections import OrderedDict
from pathlib import Path

import openpyxl
from openpyxl.styles import Font

BASE = Path(__file__).resolve().parent
SRC = BASE / (sys.argv[1] if len(sys.argv) > 1 else "売上一覧_2026-09.xlsx")
OUT = BASE / "取引先別"
LOG = BASE / "分割ログ.xlsx"
EMPTY_NAME = "取引先未設定"
BAD = re.compile(r'[\/:*?"<>|\x00-\x1f]')
RESERVED = {"CON", "PRN", "AUX", "NUL", *(f"COM{i}" for i in range(1, 10)), *(f"LPT{i}" for i in range(1, 10))}

wb = openpyxl.load_workbook(SRC)  # 読み込みのみ。保存はしない
ws = wb.worksheets[0]
rows = list(ws.iter_rows(values_only=True))
header, data = rows[0], rows[1:]
data = [r for r in data if any(v is not None and str(v).strip() != "" for v in r)]  # 完全な空行は除外
ci = header.index("取引先")
ai = header.index("金額")

groups = OrderedDict()  # 正規化後の取引先名 -> {"rows":[], "raw":set()}
for r in data:
    raw = r[ci]
    name = "" if raw is None else str(raw).strip()
    key = name if name else EMPTY_NAME
    g = groups.setdefault(key, {"rows": [], "raw": set(), "blank": not name})
    g["rows"].append(list(r))
    g["raw"].add("" if raw is None else str(raw))

OUT.mkdir(exist_ok=True)
for old in OUT.glob("*.xlsx"):  # 再実行時に前回分を消す(取引先別フォルダ内のみ)
    old.unlink()

used = {}
log_rows = []
tot_n = tot_amt = 0
for key, g in groups.items():
    memo = []
    safe = BAD.sub("_", key).strip().rstrip(".")
    if safe != key:
        memo.append(f"ファイル名に使えない文字を「_」に置換(元の名前: {key})")
    if safe.upper() in RESERVED:
        safe = "_" + safe
        memo.append("Windows予約名のため先頭に「_」を付加")
    if safe.lower() in used:  # 置換の結果、別取引先と名前が衝突した場合
        n = 2
        while f"{safe}_{n}".lower() in used:
            n += 1
        memo.append(f"ファイル名が「{used[safe.lower()]}」と重複したため連番を付加")
        safe = f"{safe}_{n}"
    used[safe.lower()] = key
    if g["blank"]:
        memo.append("取引先が空欄の行をまとめたファイル")
    trimmed = sorted(x for x in g["raw"] if x != "" and x != x.strip())
    if trimmed:
        memo.append("前後の空白あり表記も同一取引先として統合(" + "・".join(repr(x) for x in trimmed) + ")")
    amt = 0
    for r in g["rows"]:
        v = r[ai]
        if isinstance(v, (int, float)):
            amt += v
        else:
            memo.append(f"金額が数値でない行あり({v!r})")
    o = openpyxl.Workbook()
    s = o.active
    s.title = ws.title
    s.append(list(header))
    for c in s[1]:
        c.font = Font(bold=True)
    for r in g["rows"]:
        s.append(r)
    for col, dim in ws.column_dimensions.items():
        if dim.width:
            s.column_dimensions[col].width = dim.width
    fname = f"{safe}.xlsx"
    o.save(OUT / fname)
    log_rows.append([key, fname, len(g["rows"]), amt, " / ".join(dict.fromkeys(memo))])
    tot_n += len(g["rows"])
    tot_amt += amt

src_amt = sum(r[ai] for r in data if isinstance(r[ai], (int, float)))
ok = tot_n == len(data) and tot_amt == src_amt
lw = openpyxl.Workbook()
l = lw.active
l.title = "分割ログ"
l.append(["取引先", "ファイル名", "件数", "金額合計", "メモ"])
for c in l[1]:
    c.font = Font(bold=True)
for r in log_rows:
    l.append(r)
l.append(["合計(分割後)", "", tot_n, tot_amt, f"元ファイル: {len(data)}件 / {src_amt}円 → {'一致' if ok else '不一致!'}"])
for c in l[l.max_row]:
    c.font = Font(bold=True)
for col, w in zip("ABCDE", (24, 28, 8, 14, 70)):
    l.column_dimensions[col].width = w
for row in l.iter_rows(min_row=2, min_col=4, max_col=4):
    row[0].number_format = "#,##0"
lw.save(LOG)

print(f"取引先数: {len(groups)}")
print(f"元: {len(data)}行 / {src_amt:,}円   分割後: {tot_n}行 / {tot_amt:,}円   -> {'一致' if ok else '不一致'}")
for r in log_rows:
    print(r)
