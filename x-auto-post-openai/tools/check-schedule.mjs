#!/usr/bin/env node
import { readSheet } from "./lib/sheets.mjs";

const rows = await readSheet("投稿管理");
console.log("ID | ステータス | 投稿日時 | 内容（先頭20字）");
console.log("---+----------+---------+------------------");
for (const r of rows.slice(1)) {
  if (!r[0]) continue;
  console.log(`${String(r[0]).padStart(3)} | ${String(r[1]||"").padEnd(8)} | ${String(r[2]||"").padEnd(16)} | ${String(r[3]||"").slice(0,20)}`);
}
