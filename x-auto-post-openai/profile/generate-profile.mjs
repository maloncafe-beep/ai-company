#!/usr/bin/env node

import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { ensureSheet, writeSheet } from "../tools/lib/sheets.mjs";
import { createOpenAITextResponse } from "../tools/lib/openai.mjs";

const PROJECT_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
dotenv.config({ path: join(PROJECT_ROOT, ".env") });

const PROFILE_PATH = join(PROJECT_ROOT, "profile", "profile.json");
const PROFILE_SHEET = "プロフィール";

function parseCSV(text) {
  const lines = text.split("\n").filter((line) => line.trim());
  if (!lines.length) return [];

  const headers = parseCSVLine(lines[0]);
  return lines.slice(1).map((line) => {
    const values = parseCSVLine(line);
    const row = {};
    headers.forEach((header, index) => {
      row[header.trim()] = (values[index] || "").trim();
    });
    return row;
  });
}

function parseCSVLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (const char of line) {
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}

function summarizePosts(csvData) {
  return csvData
    .map((row) => {
      const text = row["Post text"] || row["Tweet text"] || row["ポスト本文"] || "";
      const impressions = row.impressions || row["インプレッション"] || "0";
      const likes = row.likes || row["いいね"] || "0";
      const engagements = row.engagements || row["エンゲージメント"] || "0";
      return `---\n本文: ${text}\nimp: ${impressions} / likes: ${likes} / engagements: ${engagements}`;
    })
    .join("\n\n");
}

async function analyzeWithAI(csvData) {
  const handle = process.env.X_HANDLE || "your_handle";
  const prompt = `以下は @${handle} の過去投稿データです。これを分析して、今後の投稿生成に使う profile.json を作ってください。

# 投稿データ
${summarizePosts(csvData)}

# 要件
- 口調、ターゲット、強み、価値観、ポジショニングを要約する
- 再現しやすいルールを5個以上入れる
- NG表現も入れる
- top_patterns には勝ち筋を短い文章でまとめる
- stats は数値で返す
- 出力は JSON オブジェクトのみ

# 出力形式
{
  "handle": "@${handle}",
  "tone": "",
  "target": "",
  "credential": "",
  "positioning": "",
  "values": "",
  "rules": ["", ""],
  "top_patterns": "",
  "ng_expressions": ["", ""],
  "stats": {
    "total_posts": 0,
    "avg_impressions": 0,
    "top_post_impressions": 0
  }
}`;

  console.log("OpenAI API で分析中...");
  const text = await createOpenAITextResponse(prompt, { maxOutputTokens: 4096 });
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("OpenAI の応答から JSON を抽出できませんでした");
  }
  return JSON.parse(jsonMatch[0]);
}

async function syncToSheet(profile) {
  await ensureSheet(PROFILE_SHEET);
  const rows = Object.entries(profile).map(([key, value]) => [
    key,
    typeof value === "object" ? JSON.stringify(value, null, 2) : String(value),
  ]);
  await writeSheet(PROFILE_SHEET, ["項目", "内容"], rows);
}

async function main() {
  const csvPath = process.argv[2];
  if (!csvPath) {
    console.error("Usage: node profile/generate-profile.mjs <csv-path>");
    process.exit(1);
  }

  if (!process.env.OPENAI_API_KEY) {
    console.error("Error: OPENAI_API_KEY が .env に設定されていません");
    process.exit(1);
  }

  console.log(`CSV を読み込み中: ${csvPath}`);
  const csvText = readFileSync(csvPath, "utf-8");
  const csvData = parseCSV(csvText);
  console.log(`${csvData.length} 件の投稿を読み込みました`);

  const profile = await analyzeWithAI(csvData);
  writeFileSync(PROFILE_PATH, JSON.stringify(profile, null, 2), "utf-8");
  console.log(`プロフィールを保存しました: ${PROFILE_PATH}`);

  console.log("スプレッドシートへ同期中...");
  await syncToSheet(profile);
  console.log("スプレッドシートへ同期しました");
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
