#!/usr/bin/env node

/**
 * post-to-x.mjs — スプシから「承認済み」投稿を取得し X API で投稿する
 *
 * スレッド対応: 投稿文に "---" 区切りがある場合、自動的にスレッド（連鎖リプライ）として投稿。
 *
 * Usage:
 *   node tools/post-to-x.mjs              # 承認済みの投稿を1件投稿
 *   node tools/post-to-x.mjs --all        # 承認済みの投稿を全件投稿
 *   node tools/post-to-x.mjs --dry-run    # 投稿せずに対象を表示
 */

import { TwitterApi } from "twitter-api-v2";
import { readSheet, updateRange, SHEET_NAME } from "./lib/sheets.mjs";
import dotenv from "dotenv";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { existsSync } from "fs";

const PROJECT_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
dotenv.config({ path: join(PROJECT_ROOT, ".env") });

const HANDLE = process.env.X_HANDLE;
if (!HANDLE) {
  console.error("Error: X_HANDLE が .env に設定されていません");
  process.exit(1);
}
const THREAD_SEPARATOR = "---";
const DEFAULT_THREAD_REPLY_DELAY_MS = 5000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getNumericOption(args, name) {
  const index = args.indexOf(name);
  if (index === -1) return undefined;

  const raw = args[index + 1];
  if (!raw || raw.startsWith("--")) {
    console.error(`Error: ${name} requires a numeric value`);
    process.exit(1);
  }

  const value = Number(raw);
  if (!Number.isFinite(value) || value < 0) {
    console.error(`Error: ${name} must be a number >= 0`);
    process.exit(1);
  }

  return value;
}

function getThreadReplyDelayMs(args) {
  const delayMsFromArg = getNumericOption(args, "--thread-delay-ms");
  if (delayMsFromArg !== undefined) return Math.floor(delayMsFromArg);

  const delaySecFromArg = getNumericOption(args, "--thread-delay-sec");
  if (delaySecFromArg !== undefined) return Math.floor(delaySecFromArg * 1000);

  const envValue = process.env.X_THREAD_REPLY_DELAY_MS;
  if (envValue) {
    const parsed = Number(envValue);
    if (!Number.isFinite(parsed) || parsed < 0) {
      console.error("Error: X_THREAD_REPLY_DELAY_MS must be a number >= 0");
      process.exit(1);
    }
    return Math.floor(parsed);
  }

  return DEFAULT_THREAD_REPLY_DELAY_MS;
}

function getClient() {
  const { X_API_KEY, X_API_KEY_SECRET, X_ACCESS_TOKEN, X_ACCESS_TOKEN_SECRET } = process.env;
  if (!X_API_KEY || !X_API_KEY_SECRET || !X_ACCESS_TOKEN || !X_ACCESS_TOKEN_SECRET) {
    console.error("Error: X API キーが .env に設定されていません");
    process.exit(1);
  }
  return new TwitterApi({
    appKey: X_API_KEY,
    appSecret: X_API_KEY_SECRET,
    accessToken: X_ACCESS_TOKEN,
    accessSecret: X_ACCESS_TOKEN_SECRET,
  });
}

function parseThreadParts(text) {
  return text
    .split(THREAD_SEPARATOR)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

function normalizeCell(value) {
  return String(value || "").trim();
}

function findColumnIndex(headers, ...candidates) {
  return headers.findIndex((header) => candidates.includes(normalizeCell(header)));
}

function normalizeImagePath(rawValue) {
  const value = normalizeCell(rawValue);
  if (!value) return "";

  const quotedMatch = value.match(/^"(.*)"$/);
  return quotedMatch ? quotedMatch[1] : value;
}

function extractTweetIdFromUrl(rawValue) {
  const value = normalizeCell(rawValue);
  if (!value) return "";

  const match = value.match(/status\/(\d+)/);
  return match ? match[1] : "";
}

function toColumnLetter(index) {
  let value = index + 1;
  let result = "";

  while (value > 0) {
    const remainder = (value - 1) % 26;
    result = String.fromCharCode(65 + remainder) + result;
    value = Math.floor((value - 1) / 26);
  }

  return result;
}

async function postSingle(client, text, imagePath = "", replyToId = "") {
  if (!imagePath) {
    const result = await client.v2.tweet(
      replyToId
        ? {
            text,
            reply: {
              in_reply_to_tweet_id: replyToId,
            },
          }
        : text
    );
    return result.data;
  }

  const mediaId = await client.v1.uploadMedia(imagePath);
  const result = await client.v2.tweet({
    text,
    ...(replyToId
      ? {
          reply: {
            in_reply_to_tweet_id: replyToId,
          },
        }
      : {}),
    media: {
      media_ids: [mediaId],
    },
  });
  return result.data;
}

async function postThread(client, parts, replyDelayMs, replyToId = "") {
  const results = [];

  const first = await client.v2.tweet(
    replyToId
      ? {
          text: parts[0],
          reply: {
            in_reply_to_tweet_id: replyToId,
          },
        }
      : parts[0]
  );
  results.push(first.data);

  let lastId = first.data.id;
  for (let i = 1; i < parts.length; i++) {
    await sleep(replyDelayMs);
    const reply = await client.v2.tweet(parts[i], {
      reply: { in_reply_to_tweet_id: lastId },
    });
    results.push(reply.data);
    lastId = reply.data.id;
  }

  return results;
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const postAll = args.includes("--all");
  const threadReplyDelayMs = getThreadReplyDelayMs(args);

  const rows = await readSheet(SHEET_NAME);
  if (rows.length <= 1) {
    console.log("投稿管理シートにデータがありません");
    return;
  }

  const headerRow = rows[0];
  const statusCol = headerRow.indexOf("ステータス");
  const textCol = headerRow.indexOf("投稿文");
  const idCol = headerRow.indexOf("ID");
  const imageFileCol = findColumnIndex(headerRow, "IMAGE_FILE");
  const parentPostUrlCol = findColumnIndex(headerRow, "PARENT_POST_URL");
  const parentPostIdCol = findColumnIndex(headerRow, "PARENT_POST_ID");

  const approved = [];
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][statusCol] === "承認済み") {
      approved.push({ rowIndex: i + 1, row: rows[i] });
    }
  }

  if (approved.length === 0) {
    console.log("「承認済み」の投稿がありません");
    return;
  }

  const targets = postAll ? approved : [approved[0]];
  const client = getClient();
  console.log(`thread reply delay: ${threadReplyDelayMs}ms`);

  console.log(`投稿対象: ${targets.length}件${dryRun ? "（ドライラン）" : ""}`);
  console.log("");

  for (const { rowIndex, row } of targets) {
    const id = row[idCol];
    const text = row[textCol];
    const imagePath = imageFileCol >= 0 ? normalizeImagePath(row[imageFileCol]) : "";
    const parentPostUrl = parentPostUrlCol >= 0 ? normalizeCell(row[parentPostUrlCol]) : "";
    const parentPostId = parentPostIdCol >= 0 ? normalizeCell(row[parentPostIdCol]) : "";
    const derivedParentPostId = parentPostId || extractTweetIdFromUrl(parentPostUrl);
    const parts = parseThreadParts(text);
    const isThread = parts.length > 1;

    if (isThread) {
      console.log(`[ID: ${id}] スレッド（${parts.length}ツイート）`);
      parts.forEach((p, i) => console.log(`  ${i + 1}/${parts.length}: ${p.slice(0, 50)}${p.length > 50 ? "..." : ""}`));
    } else {
      console.log(`[ID: ${id}] ${text.slice(0, 50)}${text.length > 50 ? "..." : ""}`);
      if (imagePath) {
        console.log(`  image: ${imagePath}`);
      }
    }
    if (parentPostUrl && derivedParentPostId) {
      console.log(`  parent: ${derivedParentPostId}`);
    }

    if (dryRun) {
      console.log("  → スキップ（ドライラン）");
      continue;
    }

    try {
      // スケジューラの二重投稿を防ぐため、投稿前に「処理中」へ更新
      if (parentPostUrl && !parentPostId && derivedParentPostId && parentPostIdCol >= 0) {
        await updateRange(
          SHEET_NAME,
          `${toColumnLetter(parentPostIdCol)}${rowIndex}`,
          [[derivedParentPostId]]
        );
      }

      await updateRange(SHEET_NAME, `B${rowIndex}`, [["処理中"]]);

      const now = new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });

      if (isThread) {
        const results = await postThread(client, parts, threadReplyDelayMs, derivedParentPostId);
        const firstTweetId = results[0].id;
        const link = `https://x.com/${HANDLE}/status/${firstTweetId}`;

        await updateRange(SHEET_NAME, `B${rowIndex}`, [["投稿済み"]]);
        await updateRange(SHEET_NAME, `F${rowIndex}:G${rowIndex}`, [[link, now]]);
        await updateRange(SHEET_NAME, `H${rowIndex}`, [[`スレッド ${results.length}件`]]);

        console.log(`  → スレッド投稿成功（${results.length}ツイート）: ${link}`);
      } else {
        if (imagePath && !existsSync(imagePath)) {
          throw new Error(`Image file not found: ${imagePath}`);
        }

        const result = await postSingle(client, text, imagePath, derivedParentPostId);
        const link = `https://x.com/${HANDLE}/status/${result.id}`;

        await updateRange(SHEET_NAME, `B${rowIndex}`, [["投稿済み"]]);
        await updateRange(SHEET_NAME, `F${rowIndex}:G${rowIndex}`, [[link, now]]);

        console.log(`  → 投稿成功: ${link}`);
      }
    } catch (err) {
      const errorMsg = err.message || String(err);
      await updateRange(SHEET_NAME, `B${rowIndex}`, [["エラー"]]);
      await updateRange(SHEET_NAME, `H${rowIndex}`, [[errorMsg.slice(0, 200)]]);
      console.error(`  → エラー: ${errorMsg}`);
    }

    if (targets.length > 1) {
      await sleep(3000);
    }
  }

  console.log("");
  console.log("完了");
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
