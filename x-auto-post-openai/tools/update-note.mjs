#!/usr/bin/env node

/**
 * update-note.mjs — 指定IDの備考列を更新
 *
 * Usage:
 *   node tools/update-note.mjs <ID> <備考>
 */

import { readSheet, updateRange } from "./lib/sheets.mjs";

const POST_SHEET = "投稿管理";
const [,, targetId, note] = process.argv;

if (!targetId || !note) {
  console.error("Usage: node tools/update-note.mjs <ID> <備考>");
  process.exit(1);
}

async function main() {
  const rows = await readSheet(POST_SHEET);

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(targetId)) {
      const rowNum = i + 1;
      await updateRange(POST_SHEET, `H${rowNum}`, [[note]]);
      console.log(`✓ ID=${targetId} の備考を更新しました: ${note}`);
      return;
    }
  }

  console.error(`ID=${targetId} が見つかりませんでした`);
  process.exit(1);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
