#!/usr/bin/env node

/**
 * add-single-post.mjs — 単体ポストをスプシに追加
 *
 * Usage:
 *   node tools/add-single-post.mjs
 */

import { readSheet, appendRows } from "./lib/sheets.mjs";

const POST_SHEET = "投稿管理";

const POST = {
  scheduledAt: "2026/05/08 12:00",
  status: "承認済み",
  text: "「若いねぇ」は内容への返答じゃない。年齢に話をすり替えて「ちゃんと聞かなくていい理由」を作る、会話を終わらせる装置だ。正しいかどうかは、最初から問われていない。",
};

async function main() {
  console.log("=== 単体ポスト追加 ===\n");

  const existingRows = await readSheet(POST_SHEET);
  const ids = existingRows.slice(1).map((r) => parseInt(r[0], 10)).filter((n) => !isNaN(n));
  const maxId = ids.length > 0 ? Math.max(...ids) : 0;
  const nextId = maxId + 1;

  console.log(`現在の最大ID: ${maxId}`);
  console.log(`新規ID: ${nextId}`);

  const row = [
    nextId,
    POST.status,
    POST.scheduledAt,
    POST.text,
    POST.text.length,
    "",
    "",
    "",
  ];

  await appendRows(POST_SHEET, [row]);
  console.log(`\n✓ 登録完了`);
  console.log(`  ID=${nextId}  ${POST.scheduledAt}  ${POST.text.slice(0, 30)}...`);
  console.log(`  ステータス: ${POST.status}`);
  console.log(`  文字数: ${POST.text.length}`);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
