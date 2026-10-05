#!/usr/bin/env node

import { TwitterApi } from "twitter-api-v2";
import { readSheet, updateRange, ensureSheet, appendRows, SHEET_NAME } from "./lib/sheets.mjs";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { createOpenAITextResponse } from "./lib/openai.mjs";

const PROJECT_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
dotenv.config({ path: join(PROJECT_ROOT, ".env") });

const PROFILE_PATH = join(PROJECT_ROOT, "profile", "profile.json");
const PERF_SHEET = "パフォーマンス";

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

function extractTweetId(link) {
  if (!link) return null;
  const match = String(link).match(/status\/(\d+)/);
  return match ? match[1] : null;
}

async function fetchMetrics(client, tweetIds) {
  if (!tweetIds.length) return {};

  const batchSize = 100;
  const results = {};

  for (let i = 0; i < tweetIds.length; i += batchSize) {
    const batch = tweetIds.slice(i, i + batchSize);
    try {
      const res = await client.v2.tweets(batch, {
        "tweet.fields": "public_metrics",
      });

      if (res.data) {
        for (const tweet of res.data) {
          results[tweet.id] = tweet.public_metrics;
        }
      }
    } catch (err) {
      console.error(`  API error (batch ${i}):`, err.message);
    }
  }

  return results;
}

async function updateProfileWithAI(profile, topPosts) {
  if (!process.env.OPENAI_API_KEY) {
    console.log("OPENAI_API_KEY が未設定のため、profile 更新をスキップします");
    return null;
  }

  const postsText = topPosts
    .map((post, index) => `${index + 1}. imp:${post.impressions} like:${post.likes} rt:${post.retweets}\n${post.text}`)
    .join("\n\n");

  const prompt = `以下は直近の高パフォーマンス投稿です。profile.json の top_patterns を更新してください。

# 高パフォーマンス投稿
${postsText}

# 現在の top_patterns
${profile.top_patterns || ""}

# 要件
- 今回の勝ち筋だけを短く要約する
- 200文字以内
- top_patterns の本文だけを返す
- 箇条書きや JSON は不要`;

  return await createOpenAITextResponse(prompt, { maxOutputTokens: 1024 });
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const topIndex = args.indexOf("--top");
  const topN = topIndex >= 0 && args[topIndex + 1] ? parseInt(args[topIndex + 1], 10) : 5;

  console.log("=== 投稿パフォーマンス更新 ===");
  console.log("");

  const rows = await readSheet(SHEET_NAME);
  if (rows.length <= 1) {
    console.log("投稿データがありません");
    return;
  }

  const header = rows[0];
  const idCol = header.indexOf("ID");
  const statusCol = header.indexOf("ステータス");
  const textCol = header.indexOf("投稿文");
  const linkCol = header.indexOf("投稿リンク");

  const posted = [];
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][statusCol] === "投稿済み" && rows[i][linkCol]) {
      const tweetId = extractTweetId(rows[i][linkCol]);
      if (tweetId) {
        posted.push({
          rowIndex: i + 1,
          id: rows[i][idCol],
          text: rows[i][textCol],
          link: rows[i][linkCol],
          tweetId,
        });
      }
    }
  }

  if (!posted.length) {
    console.log("投稿済みデータがありません");
    return;
  }

  console.log(`投稿済み: ${posted.length}件`);
  const client = getClient();
  const metrics = await fetchMetrics(client, posted.map((post) => post.tweetId));

  await ensureSheet(PERF_SHEET);
  const perfHeader = ["ID", "投稿文", "投稿リンク", "imp", "like", "RT", "reply", "quote", "bookmark", "取得日時"];
  await updateRange(PERF_SHEET, "A1:J1", [perfHeader]);

  const enriched = [];
  const perfRows = [];
  const now = new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });

  for (const post of posted) {
    const metric = metrics[post.tweetId];
    if (!metric) continue;

    const entry = {
      ...post,
      impressions: metric.impression_count || 0,
      likes: metric.like_count || 0,
      retweets: metric.retweet_count || 0,
      replies: metric.reply_count || 0,
      quotes: metric.quote_count || 0,
      bookmarks: metric.bookmark_count || 0,
    };

    enriched.push(entry);
    perfRows.push([
      post.id,
      post.text,
      post.link,
      entry.impressions,
      entry.likes,
      entry.retweets,
      entry.replies,
      entry.quotes,
      entry.bookmarks,
      now,
    ]);
  }

  if (perfRows.length) {
    await appendRows(PERF_SHEET, perfRows);
    console.log(`パフォーマンスシートへ ${perfRows.length} 件を追加しました`);
  }

  if (!enriched.length) {
    console.log("取得できたメトリクスがありません");
    return;
  }

  enriched.sort((a, b) => b.impressions - a.impressions);
  const topPosts = enriched.slice(0, topN);

  console.log("");
  console.log(`=== Top ${Math.min(topN, topPosts.length)} Posts ===`);
  for (const [index, post] of topPosts.entries()) {
    console.log(`${index + 1}. imp:${post.impressions} like:${post.likes} rt:${post.retweets}`);
    console.log(`   ${post.text.slice(0, 80)}${post.text.length > 80 ? "..." : ""}`);
  }

  if (dryRun) {
    console.log("");
    console.log("dry-run のため profile.json は更新しません");
    return;
  }

  if (!existsSync(PROFILE_PATH)) {
    console.log("profile.json が見つからないため、更新をスキップします");
    return;
  }

  const profile = JSON.parse(readFileSync(PROFILE_PATH, "utf-8"));
  console.log("");
  console.log("OpenAI API で top_patterns を更新中...");
  const newPatterns = await updateProfileWithAI(profile, topPosts);
  if (!newPatterns) return;

  profile.top_patterns = newPatterns.trim();
  writeFileSync(PROFILE_PATH, JSON.stringify(profile, null, 2) + "\n");
  console.log("profile.json を更新しました");
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
