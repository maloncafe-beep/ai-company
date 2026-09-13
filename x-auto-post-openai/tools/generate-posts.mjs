#!/usr/bin/env node

import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { readSheet, addPost, SHEET_NAME } from "./lib/sheets.mjs";
import { createOpenAITextResponse } from "./lib/openai.mjs";

const PROJECT_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
dotenv.config({ path: join(PROJECT_ROOT, ".env") });

const PROFILE_PATH = join(PROJECT_ROOT, "profile", "profile.json");
const PROJECT_SAMPLE_DIR = join(PROJECT_ROOT, "projects", "blog-001");
const SETTINGS_SHEET = "設定";

function parseArgs() {
  const args = process.argv.slice(2);
  let count = null;
  let days = 7;
  let theme = "";
  let type = "";

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--days" && args[i + 1]) {
      days = parseInt(args[i + 1], 10);
      i++;
    }
    if (args[i] === "--count" && args[i + 1]) {
      count = parseInt(args[i + 1], 10);
      i++;
    }
    if (args[i] === "--theme" && args[i + 1]) {
      theme = args[i + 1];
      i++;
    }
    if (args[i] === "--type" && args[i + 1]) {
      type = String(args[i + 1]).toLowerCase();
      i++;
    }
  }

  return { count, days, theme, type };
}

async function getSettings() {
  try {
    const rows = await readSheet(SETTINGS_SHEET, "A:B");
    const settings = {};
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][0] && rows[i][1]) {
        settings[rows[i][0]] = rows[i][1];
      }
    }
    return settings;
  } catch {
    return {};
  }
}

function parseScheduledAt(value) {
  if (!value) return null;
  const match = String(value).match(/^(\d{4})\/(\d{2})\/(\d{2}) (\d{2}):(\d{2})$/);
  if (!match) return null;
  const [, y, mo, d, h, mi] = match;
  return new Date(Number(y), Number(mo) - 1, Number(d), Number(h), Number(mi), 0);
}

function formatScheduledAt(date) {
  const y = date.getFullYear();
  const mo = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const h = String(date.getHours()).padStart(2, "0");
  const mi = String(date.getMinutes()).padStart(2, "0");
  return `${y}/${mo}/${d} ${h}:${mi}`;
}

function getPostTimes(settings) {
  return String(settings["投稿時刻"] || "08:00")
    .split(",")
    .map((time) => time.trim())
    .filter(Boolean);
}

function buildUpcomingSlots(existingRows, times, count) {
  const booked = new Set();
  for (const row of existingRows.slice(1)) {
    if (row[2] && String(row[2]).trim()) {
      booked.add(String(row[2]).trim());
    }
  }

  const results = [];
  const now = new Date();
  const date = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  for (let dayOffset = 0; dayOffset < 365 && results.length < count; dayOffset++) {
    for (const time of times) {
      const [hour, minute] = time.split(":").map(Number);
      const candidate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, minute, 0);
      if (candidate <= now) continue;

      const formatted = formatScheduledAt(candidate);
      if (booked.has(formatted)) continue;

      results.push({
        scheduledAt: formatted,
        hour,
        type: "single",
      });
      booked.add(formatted);

      if (results.length >= count) break;
    }
    date.setDate(date.getDate() + 1);
  }

  let lastThread = null;
  for (const slot of results) {
    if (slot.hour >= 21) {
      slot.type = "thread";
      lastThread = slot;
      continue;
    }

    if (lastThread) {
      const currentDate = slot.scheduledAt.slice(0, 10);
      const threadDate = lastThread.scheduledAt.slice(0, 10);
      if (currentDate !== threadDate) {
        slot.type = "remix";
        slot.sourceScheduledAt = lastThread.scheduledAt;
        lastThread = null;
      }
    }
  }

  return results;
}

function buildForcedSlots(count, type) {
  return Array.from({ length: count }, () => ({
    scheduledAt: null,
    hour: null,
    type,
  }));
}

function loadReference(path) {
  if (!existsSync(path)) return "";
  return readFileSync(path, "utf-8").trim();
}

function buildReferenceSection() {
  if (!existsSync(PROJECT_SAMPLE_DIR)) return "";

  const threadRef = loadReference(join(PROJECT_SAMPLE_DIR, "x-thread-10-chotto-dake.md"));
  const remixRef = loadReference(join(PROJECT_SAMPLE_DIR, "x-remix-20-chotto-dake.md"));
  const singleRef = loadReference(join(PROJECT_SAMPLE_DIR, "x-single-01-kotei.md"));

  return `# 参考フォーマット
以下の雰囲気と構造を強く踏襲してください。

## スレッド参考
${threadRef}

## リメイク参考
${remixRef}

## 単発参考
${singleRef}`;
}

function buildImagePromptInstructions() {
  return `
# IMAGE_PROMPT_TEXT specification
- For type "single", include imagePromptText in the JSON output.
- For type "thread" and "remix", imagePromptText should be an empty string.
- imagePromptText must be a full Japanese prompt that can be pasted directly into an image model.

[用途]
X（Twitter）投稿用のメイン画像を作成する。

[構成・レイアウト]
アスペクト比: 16:9、横向き構図。
X（Twitter）のタイムラインで一覧表示されたときに主題がひと目で伝わるレイアウト。
中央またはやや左寄りに主題を置き、視線が散らない構成。
情報を詰め込みすぎず、余白を適度に残す。
スマホ表示でも主題がつぶれない構図にする。

[キャラクター設定]
オリジナルの架空キャラクター。40歳の中年男性。疲れた表情、目の下にクマ。ぼさぼさで整っていない中くらいの長さの黒髪。垂れ気味で疲れ切った茶色の目。体型は平均的でやや細身。しわのあるグレーのワイシャツ。ネクタイは緩め。袖はまくっている。

[画風・線画]
ラフでカジュアルな手描き風。やや荒めだが見やすい細いペン線。陰影は最小限。フォトリアルにはしない。派手なアニメ塗りにはしない。

[カラー]
落ち着いた柔らかいトーン。白を基調に、薄いグレーとくすんだ青を中心に使用する。強すぎる原色は避ける。

[文字要素]
入れる文字は最小限にする。タイトル、短いセリフまたはモノローグ、巻数表示（例: vol.18）までに限定する。著者名、出版社ロゴ、過剰な装飾文字は入れない。

[禁止事項]
ロゴ、透かし、不自然な装飾、過剰な演出は避ける。不自然な手、不自然な顔、不安定な身体バランスを避ける。
`;
}

function buildDefaultImagePromptText(title, text, volumeNumber = "") {
  const safeTitle = title || "日常の違和感";
  const safeVolume = volumeNumber ? `vol.${volumeNumber}` : "vol.XX";

  return `[用途]
X（Twitter）投稿用のメイン画像を作成する。

[構成・レイアウト]
アスペクト比: 16:9、横向き構図。
X（Twitter）のタイムラインで一覧表示されたときに主題がひと目で伝わるレイアウト。
中央またはやや左寄りに主題を置き、視線が散らない構成。
情報を詰め込みすぎず、余白を適度に残す。
スマホ表示でも主題がつぶれない構図にする。

[キャラクター設定]
オリジナルの架空キャラクター。40歳の中年男性。疲れた表情、目の下にクマ。ぼさぼさで整っていない中くらいの長さの黒髪。垂れ気味で疲れ切った茶色の目。体型は平均的でやや細身。しわのあるグレーのワイシャツ。ネクタイは緩め。袖はまくっている。

[画風・線画]
ラフでカジュアルな手描き風。やや荒めだが見やすい細いペン線。陰影は最小限。フォトリアルにはしない。派手なアニメ塗りにはしない。

[カラー]
落ち着いた柔らかいトーン。白を基調に、薄いグレーとくすんだ青を中心に使用する。強すぎる原色は避ける。

[文字要素]
タイトル: 「${safeTitle}」
短いモノローグまたはセリフを1つだけ入れる。
巻数表示: 「${safeVolume}」

[シーン]
以下の投稿文の内容を、日常の違和感や気づきが伝わる1場面として描写する。

[投稿文]
${text}`;
}

async function generatePosts(profile, slots, theme) {
  const prompt = `あなたはX投稿の企画と文案を作る編集者です。

以下の profile.json と参考フォーマットを守って、指定された投稿枠ぶんの投稿案を作ってください。

# profile.json
${JSON.stringify(profile, null, 2)}

# これから埋める投稿枠
${JSON.stringify(slots, null, 2)}

# 今回のテーマ
${theme || "指定なし。profile.json と参考フォーマットから自然に決める"}

# 投稿タイプのルール
- type が "thread" の枠は、必ず合計2ツイートのスレッドにする
- thread は「現象 → ズレ → 構造仮説 → 次の実験」の流れを、2ツイートに圧縮する
- 1ツイート目: 【現象】本文 + 【ズレ】本文 + #違和感 #気づき
- 2ツイート目: 【構造仮説】本文 + 【次の実験】本文
- 【現象】と【ズレ】は同じツイート内でつなげ、読者が「何がずれているのか」を自然に理解できるようにする
- 【構造仮説】と【次の実験】も同じツイート内でつなげ、仮説だけで浮かず、次の行動まで意味が通るようにする
- thread では 3ツイート以上に分割しない。合計4ツイートにすると X 側で2通目以降が「返信をさらに表示」に折り畳まれやすい
- type が "remix" の枠は、直前の thread を1ツイートに圧縮した単体投稿にする
- type が "single" の枠は、単発投稿として自然に完結させる
- type の指定は必須条件として守る
- 21:00 枠の thread は内省・心理・行動のテーマを優先する
- 営業色の強いツール紹介や露骨な宣伝は避ける
- テーマが指定されている場合は、そのテーマを最優先で扱う
- 今回のテーマは「違和感をそのまま問いにし、ズレの原因を探る」方向へ寄せる

# ルール
- 各投稿は 280 文字以内
- 口調、価値観、NG表現、ポジショニングを profile.json に合わせる
- profile.json の tone は必須条件として守る。語尾の文体を途中で崩さない
- 宣伝くささを抑え、自然に読める文にする
- 似た構文の連発を避ける
- thread の text は "---" 区切りで返す。区切りは1つだけにして、合計2ツイートにする
- single と remix の text は "---" を入れない
- 出力は JSON 配列のみ

${buildReferenceSection()}

${buildImagePromptInstructions()}

# Hashtag rules for single posts
- For single posts, append "#違和感" at the end by default.
- You may add at most one more hashtag only when it clearly fits the content.
- Never use more than 2 hashtags total in a single post.
- If the post risks exceeding 280 characters, keep only "#違和感".

# 出力形式
[
  {
    "type": "single",
    "title": "短い識別用タイトル",
    "text": "投稿本文"
  },
  {
    "type": "thread",
    "title": "短い識別用タイトル",
    "text": "【現象】本文【ズレ】本文 #違和感 #気づき---【構造仮説】本文【次の実験】本文"
  }
]`;

  console.log(`OpenAI API で ${slots.length} 件の投稿を生成中...`);
  const text = await createOpenAITextResponse(prompt, { maxOutputTokens: 8192 });
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) {
    throw new Error("OpenAI の応答から JSON 配列を抽出できませんでした");
  }
  return JSON.parse(jsonMatch[0]);
}

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.error("Error: OPENAI_API_KEY が .env に設定されていません");
    process.exit(1);
  }

  if (!existsSync(PROFILE_PATH)) {
    console.error("Error: profile.json が見つかりません");
    console.error("先に node profile/generate-profile.mjs <csv-path> を実行してください");
    process.exit(1);
  }

  const { count: argCount, days, theme, type } = parseArgs();
  const settings = await getSettings();
  const postsPerDay = parseInt(settings["投稿数"] || "1", 10);
  const totalCount = argCount || days * postsPerDay;
  const validTypes = new Set(["", "single", "thread", "remix"]);
  if (!validTypes.has(type)) {
    console.error("Error: --type は single / thread / remix のいずれかを指定してください");
    process.exit(1);
  }

  const existingRows = await readSheet(SHEET_NAME);
  const slots = type
    ? buildForcedSlots(totalCount, type)
    : buildUpcomingSlots(existingRows, getPostTimes(settings), totalCount);

  console.log(`生成設定: ${totalCount}件 (${days}日 x ${postsPerDay}件/日)`);
  if (type) {
    console.log(`生成タイプ固定: ${type}`);
  }
  console.log("");

  const profile = JSON.parse(readFileSync(PROFILE_PATH, "utf-8"));
  const posts = await generatePosts(profile, slots, theme);

  console.log(`${posts.length} 件の投稿を生成しました`);
  console.log("");
  console.log("スプレッドシートに書き込み中...");

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    const slot = slots[i];
    const text = typeof post === "string" ? post : post.text;
    const title = typeof post === "string" ? "" : post.title || "";
    const type = typeof post === "string" ? slot?.type || "single" : post.type || slot?.type || "single";
    const imagePromptText =
      typeof post === "string" ? "" : String(post.imagePromptText || "").trim();
    const finalImagePromptText =
      type === "single" ? imagePromptText || buildDefaultImagePromptText(title, text) : "";
    const note = title ? `${type}:${title}` : type;
    const { id, scheduledAt, postKey } = await addPost(text, {
      scheduledAt: slot?.scheduledAt,
      note,
      postType: type,
      imagePromptText: finalImagePromptText,
    });
    console.log(`  [ID ${id}] ${scheduledAt} (${type}${postKey ? ` / ${postKey}` : ""})`);
    console.log(`    ${text.slice(0, 80)}${text.length > 80 ? "..." : ""}`);
  }

  console.log("");
  console.log(`${posts.length} 件を下書きとして追加しました`);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
