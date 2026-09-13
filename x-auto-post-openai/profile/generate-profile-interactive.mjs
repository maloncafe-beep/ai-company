#!/usr/bin/env node

import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { createOpenAITextResponse } from "../tools/lib/openai.mjs";

const PROJECT_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
dotenv.config({ path: join(PROJECT_ROOT, ".env") });

const PROFILE_PATH = join(PROJECT_ROOT, "profile", "profile.json");

async function buildProfileWithAI(answers) {
  const prompt = `以下の回答から、X投稿用の profile.json を作ってください。

# 回答
- handle: ${answers.handle || "your_handle"}
- theme: ${answers.theme || ""}
- target: ${answers.target || ""}
- tone: ${answers.tone || ""}
- credential: ${answers.credential || ""}
- values: ${answers.values || ""}
- ng: ${answers.ng || ""}
- reference_posts: ${answers.reference_posts || ""}

# 要件
- 今後の投稿生成で使いやすい具体的な profile.json にする
- rules は5個以上
- ng_expressions は配列
- stats は初期値 0 でよい
- 出力は JSON オブジェクトのみ

# 出力形式
{
  "handle": "@${answers.handle || "your_handle"}",
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

  console.log("OpenAI API でプロファイルを生成中...");
  const text = await createOpenAITextResponse(prompt, { maxOutputTokens: 4096 });
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("OpenAI の応答から JSON を抽出できませんでした");
  }
  return JSON.parse(jsonMatch[0]);
}

async function main() {
  const jsonArg = process.argv[2];
  if (!jsonArg) {
    console.error("Usage: node profile/generate-profile-interactive.mjs '<JSON>'");
    process.exit(1);
  }

  if (!process.env.OPENAI_API_KEY) {
    console.error("Error: OPENAI_API_KEY が .env に設定されていません");
    process.exit(1);
  }

  const answers = JSON.parse(jsonArg);
  const profile = await buildProfileWithAI(answers);

  writeFileSync(PROFILE_PATH, JSON.stringify(profile, null, 2), "utf-8");
  console.log(`プロフィールを保存しました: ${PROFILE_PATH}`);
  console.log(JSON.stringify(profile, null, 2));
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
