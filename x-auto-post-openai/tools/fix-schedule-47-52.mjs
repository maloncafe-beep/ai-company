#!/usr/bin/env node
import { readSheet, updateRange } from "./lib/sheets.mjs";

const POST_SHEET = "投稿管理";

const FIXES = {
  47: "2026/05/14 21:00",
  48: "2026/05/15 12:00",
  49: "2026/05/15 21:00",
  50: "2026/05/16 12:00",
  51: "2026/05/16 21:00",
  52: "2026/05/17 12:00",
};

const rows = await readSheet(POST_SHEET);

for (let i = 1; i < rows.length; i++) {
  const id = parseInt(rows[i][0], 10);
  if (FIXES[id]) {
    const rowNum = i + 1;
    await updateRange(POST_SHEET, `C${rowNum}`, [[FIXES[id]]]);
    console.log(`✓ ID=${id}  ${rows[i][2]} → ${FIXES[id]}`);
  }
}

console.log("\n修正完了");
