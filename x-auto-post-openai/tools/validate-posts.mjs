/**
 * validate-posts.mjs — 投稿スプシの事前チェック
 *
 * チェック項目:
 *   1. 投稿日時の重複
 *   2. 投稿本文の重複
 *   3. スレッド→リメイクの順番・備考IDの整合性
 *   4. リメイクの抜け（スレッドに対応するリメイクが未登録）
 *
 * Usage: node tools/validate-posts.mjs
 */

import { readSheet, SHEET_NAME } from "./lib/sheets.mjs";

const DONE_STATUSES = new Set(["投稿済み"]);

async function validate() {
  process.stdout.write("スプシ読み込み中...\n\n");

  const rows = await readSheet(SHEET_NAME);
  if (rows.length <= 1) {
    console.log("投稿データがありません。");
    return;
  }

  const all = rows.slice(1)
    .map(row => ({
      id:          parseInt(row[0], 10),
      status:      row[1] || "",
      scheduledAt: (row[2] || "").trim(),
      text:        (row[3] || "").trim(),
      note:        (row[7] || "").trim(),
    }))
    .filter(p => !isNaN(p.id));

  // 投稿済みは過去データなので対象外
  const posts = all.filter(p => !DONE_STATUSES.has(p.status));

  const errors = [];

  // ---- Check 1: 日時の重複 ----
  const dateMap = {};
  for (const p of posts) {
    if (!p.scheduledAt) continue;
    (dateMap[p.scheduledAt] ??= []).push(p.id);
  }
  for (const [date, ids] of Object.entries(dateMap)) {
    if (ids.length > 1) {
      errors.push(`[日時重複] ${date} → ID: ${ids.join(", ")}`);
    }
  }

  // ---- Check 2: 本文の重複 ----
  const textMap = {};
  for (const p of posts) {
    if (!p.text) continue;
    (textMap[p.text] ??= []).push(p.id);
  }
  for (const [text, ids] of Object.entries(textMap)) {
    if (ids.length > 1) {
      const preview = text.substring(0, 20).replace(/\n/g, "↵");
      errors.push(`[本文重複] 「${preview}…」 → ID: ${ids.join(", ")}`);
    }
  }

  // ---- Check 3: スレッド→リメイクの順番・備考IDの整合性 ----
  const postById = Object.fromEntries(all.map(p => [p.id, p]));

  for (const p of posts) {
    const m = p.note.match(/リメイク版[（(](\d+)-(\d+)[）)]/);
    if (!m) continue;

    const threadId = parseInt(m[1], 10);
    const noteRemakeId = parseInt(m[2], 10);

    if (noteRemakeId !== p.id) {
      errors.push(`[備考ID不一致] ID${p.id} の備考「${p.note}」の登録ID(${noteRemakeId})が実際のID(${p.id})と不一致`);
    }

    const thread = postById[threadId];
    if (!thread) {
      errors.push(`[元スレッド欠落] ID${p.id} が参照する元スレッドID${threadId} が見つかりません`);
      continue;
    }

    if (thread.scheduledAt && p.scheduledAt && thread.scheduledAt >= p.scheduledAt) {
      errors.push(`[順番逆転] ID${threadId}(${thread.scheduledAt}) → ID${p.id}(${p.scheduledAt}) の順が逆または同時刻です`);
    }
  }

  // ---- Check 4: リメイクの抜け ----
  const remakeForThread = new Set(
    posts
      .map(p => p.note.match(/リメイク版[（(](\d+)-\d+[）)]/))
      .filter(Boolean)
      .map(m => parseInt(m[1], 10))
  );

  for (const p of posts) {
    if (p.text.includes("---") && !remakeForThread.has(p.id)) {
      errors.push(`[リメイク未登録] ID${p.id}(${p.scheduledAt}) に対応するリメイクがありません`);
    }
  }

  // ---- 結果出力 ----
  const target = posts.length;
  if (errors.length === 0) {
    console.log(`✅ OK — ${target}件チェック、問題なし`);
  } else {
    console.log(`❌ ${errors.length}件の問題 (対象: ${target}件)\n`);
    errors.forEach((e, i) => console.log(`  ${i + 1}. ${e}`));
    process.exit(1);
  }
}

validate().catch(err => {
  console.error("エラー:", err.message);
  process.exit(1);
});
