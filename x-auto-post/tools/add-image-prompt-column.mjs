#!/usr/bin/env node

/**
 * add-image-prompt-column.mjs — 画像プロンプト列（I列）の追加とパス記入
 *
 * - I1 に「画像プロンプト」ヘッダーを追加
 * - ID47〜52 の行にプロンプトファイルのパスを記入
 *
 * Usage: node tools/add-image-prompt-column.mjs
 */

import { readSheet, updateRange, SHEET_NAME } from "./lib/sheets.mjs";

const IMAGE_PROMPT_PATHS = {
  47: "C:\\Users\\yyasu\\ai-company\\members\\writer\\projects\\blog-001\\image-prompts\\x-prompt-thread-16.txt",
  48: "C:\\Users\\yyasu\\ai-company\\members\\writer\\projects\\blog-001\\image-prompts\\x-prompt-remix-26.txt",
  49: "C:\\Users\\yyasu\\ai-company\\members\\writer\\projects\\blog-001\\image-prompts\\x-prompt-thread-17.txt",
  50: "C:\\Users\\yyasu\\ai-company\\members\\writer\\projects\\blog-001\\image-prompts\\x-prompt-remix-27.txt",
  51: "C:\\Users\\yyasu\\ai-company\\members\\writer\\projects\\blog-001\\image-prompts\\x-prompt-thread-18.txt",
  52: "C:\\Users\\yyasu\\ai-company\\members\\writer\\projects\\blog-001\\image-prompts\\x-prompt-remix-28.txt",
};

async function main() {
  console.log("=== 画像プロンプト列追加 ===\n");

  // ヘッダー追加
  await updateRange(SHEET_NAME, "I1", [["画像プロンプト"]]);
  console.log("✓ I1 ヘッダー「画像プロンプト」追加");

  // 全行を読み取ってID→行番号マッピングを作成
  const rows = await readSheet(SHEET_NAME, "A:A");
  const idToRow = {};
  rows.slice(1).forEach((row, i) => {
    const id = parseInt(row[0], 10);
    if (!isNaN(id)) idToRow[id] = i + 2; // 1-indexed、ヘッダー分+1
  });

  // ID47〜52 のI列にパスを記入
  for (const [idStr, path] of Object.entries(IMAGE_PROMPT_PATHS)) {
    const id = parseInt(idStr, 10);
    const rowNum = idToRow[id];
    if (!rowNum) {
      console.log(`  ⚠ ID${id} が見つかりません`);
      continue;
    }
    await updateRange(SHEET_NAME, `I${rowNum}`, [[path]]);
    console.log(`  ✓ ID${id} (行${rowNum}): ${path.split("\\").pop()}`);
  }

  console.log("\n✅ 完了");
}

main().catch(err => {
  console.error("エラー:", err.message);
  process.exit(1);
});
