/**
 * sheets.mjs — Google Sheets 認証・接続ヘルパー
 *
 * 必須 .env:
 *   SPREADSHEET_ID
 *   GOOGLE_CLIENT_ID
 *   GOOGLE_CLIENT_SECRET
 *   GOOGLE_TOKENS_PATH (デフォルト: ./credentials/tokens.json)
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { google } from "googleapis";
import dotenv from "dotenv";

export const PROJECT_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
dotenv.config({ path: join(PROJECT_ROOT, ".env") });

export let SPREADSHEET_ID = process.env.SPREADSHEET_ID;
export const SHEET_NAME = process.env.SHEET_NAME || "投稿管理";

const TOKENS_PATH =
  process.env.GOOGLE_TOKENS_PATH || join(PROJECT_ROOT, "credentials", "tokens.json");

/**
 * Google OAuth2 クライアントを返す（SPREADSHEET_ID 不要）
 */
export function getAuthClient() {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.error("Error: GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET not set in .env");
    process.exit(1);
  }
  if (!existsSync(TOKENS_PATH)) {
    console.error(`Error: Token file not found at ${TOKENS_PATH}`);
    console.error("Run: node auth-google.mjs");
    process.exit(1);
  }
  const tokens = JSON.parse(readFileSync(TOKENS_PATH, "utf-8"));
  const client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );
  client.setCredentials(tokens);
  return client;
}

let _sheets;

export async function getSheets() {
  if (_sheets) return _sheets;

  if (!SPREADSHEET_ID) {
    console.error("Error: SPREADSHEET_ID not set in .env");
    process.exit(1);
  }

  const client = getAuthClient();
  _sheets = google.sheets({ version: "v4", auth: client });
  return _sheets;
}

export const TEMPLATE_COPY_URL =
  "https://docs.google.com/spreadsheets/d/1Ncb_PRwpjNOnwIjRMbgBRkq_9gAsMgmBVEwzdd1pesY/copy";

/**
 * SPREADSHEET_ID を .env に書き込む
 * @param {string} newId - スプレッドシートID
 */
export function saveSpreadsheetId(newId) {
  const envPath = join(PROJECT_ROOT, ".env");
  let envContent = existsSync(envPath) ? readFileSync(envPath, "utf-8") : "";
  if (envContent.match(/^SPREADSHEET_ID=.*$/m)) {
    envContent = envContent.replace(/^SPREADSHEET_ID=.*$/m, `SPREADSHEET_ID=${newId}`);
  } else {
    envContent += `\nSPREADSHEET_ID=${newId}\n`;
  }
  writeFileSync(envPath, envContent, "utf-8");

  SPREADSHEET_ID = newId;
  process.env.SPREADSHEET_ID = newId;
  _sheets = null;
}

/**
 * シートが存在しなければ作成する
 */
export async function ensureSheet(sheetName) {
  const sheets = await getSheets();
  try {
    await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `'${sheetName}'!A1`,
    });
  } catch {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        requests: [{ addSheet: { properties: { title: sheetName } } }],
      },
    });
  }
}

/**
 * シートの全データを読み取る（ヘッダー含む）
 */
export async function readSheet(sheetName, range = "A:Z") {
  const sheets = await getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `'${sheetName}'!${range}`,
  });
  return res.data.values || [];
}

/**
 * シートにデータを追記する
 */
export async function appendRows(sheetName, rows) {
  if (!rows.length) return 0;
  const sheets = await getSheets();
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `'${sheetName}'!A:Z`,
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: rows },
  });
  return rows.length;
}

function normalizeHeader(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "");
}

function findHeaderIndex(headers, aliases) {
  const normalizedAliases = aliases.map((alias) => normalizeHeader(alias));
  return headers.findIndex((header) => normalizedAliases.includes(normalizeHeader(header)));
}

function extractNumericSuffix(value) {
  const match = String(value || "").match(/(\d+)$/);
  return match ? Number(match[1]) : null;
}

function getNextPostKey(rows, postType) {
  const headers = rows[0] || [];
  const postKeyIndex = findHeaderIndex(headers, ["POST_KEY", "post_key"]);
  if (postKeyIndex === -1) return "";

  const prefix = postType === "thread" ? "T" : "S";
  let maxNumber = 0;

  for (const row of rows.slice(1)) {
    const value = row[postKeyIndex];
    if (!String(value || "").startsWith(`${prefix}-`)) continue;
    const numericPart = extractNumericSuffix(value);
    if (numericPart && numericPart > maxNumber) {
      maxNumber = numericPart;
    }
  }

  return `${prefix}-${String(maxNumber + 1).padStart(2, "0")}`;
}

function buildRowFromHeaders(headers, valuesByHeader) {
  const row = Array.from({ length: headers.length }, () => "");

  for (const [aliases, value] of valuesByHeader) {
    const index = findHeaderIndex(headers, aliases);
    if (index !== -1) {
      row[index] = value;
    }
  }

  return row;
}

/**
 * シートの特定セル範囲を更新する
 */
export async function updateRange(sheetName, range, values) {
  const sheets = await getSheets();
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `'${sheetName}'!${range}`,
    valueInputOption: "RAW",
    requestBody: { values },
  });
}

/**
 * 投稿1件をスプシに追加する（ID・スケジュール・文字数を自動計算）
 *
 * @param {string} text - 投稿文
 * @param {object} opts - オプション
 * @param {string} opts.status - ステータス（デフォルト: "下書き"）
 * @param {string} opts.scheduledAt - 投稿予定日時を明示指定する場合（省略で自動割当）
 * @param {string} opts.note - 備考
 * @returns {{ id: number, scheduledAt: string }} 追加された行の情報
 */
async function addPostLegacy(text, opts = {}) {
  const sheetName = SHEET_NAME;
  const rows = await readSheet(sheetName);

  // ID 自動採番
  const ids = rows.slice(1).map((r) => parseInt(r[0], 10)).filter((n) => !isNaN(n));
  const nextId = ids.length > 0 ? Math.max(...ids) + 1 : 1;

  // スケジュール自動割当
  const scheduledAt = opts.scheduledAt || await findNextSlot(rows);

  const row = [
    nextId,
    opts.status || "下書き",
    scheduledAt,
    text,
    text.length,
    "", // 投稿リンク
    "", // 投稿日時
    opts.note || "",
    opts.imagePrompt || "",
  ];

  await appendRows(sheetName, [row]);
  return { id: nextId, scheduledAt };
}

export async function addPost(text, opts = {}) {
  const sheetName = SHEET_NAME;
  const rows = await readSheet(sheetName);
  const headers = rows[0] || [];
  const ids = rows
    .slice(1)
    .map((r) => parseInt(r[0], 10))
    .filter((n) => !Number.isNaN(n));
  const nextId = ids.length > 0 ? Math.max(...ids) + 1 : 1;
  const scheduledAt = opts.scheduledAt || (await findNextSlot(rows));
  const postType = opts.postType || "single";
  const postKey = opts.postKey || getNextPostKey(rows, postType);
  const postKeyNumber = extractNumericSuffix(postKey);
  const imagePromptFile =
    opts.imagePromptFile ||
    (postType === "single" && postKeyNumber
      ? `x-prompt-single-${String(postKeyNumber).padStart(2, "0")}.txt`
      : "");

  if (!headers.length) {
    return addPostLegacy(text, {
      ...opts,
      scheduledAt,
      imagePrompt: opts.imagePromptText || opts.imagePrompt || "",
    });
  }

  const row = buildRowFromHeaders(headers, [
    [["ID", "id"], nextId],
    [["ステータス", "status"], opts.status || "下書き"],
    [["投稿予定日時", "scheduled_at", "scheduledat"], scheduledAt],
    [["投稿文", "text"], text],
    [["文字数", "length"], text.length],
    [["投稿リンク", "link"], ""],
    [["投稿日時", "posted_at", "postedat"], ""],
    [["備考", "note"], opts.note || ""],
    [["POST_KEY", "post_key"], postKey],
    [["POST_TYPE", "post_type"], postType],
    [["IMAGE_FILE", "image_file"], opts.imageFile || ""],
    [["IMAGE_PROMPT_FILE", "image_prompt_file"], imagePromptFile],
    [["IMAGE_PROMPT_TEXT", "image_prompt_text"], opts.imagePromptText || ""],
    [["PARENT_POST_URL", "parent_post_url"], opts.parentPostUrl || ""],
    [["PARENT_POST_ID", "parent_post_id"], opts.parentPostId || ""],
  ]);

  await appendRows(sheetName, [row]);
  return { id: nextId, scheduledAt, postKey };
}

/**
 * 設定シートの投稿時間と既存予約から、次に空いている投稿枠を返す
 */
async function findNextSlot(postRows) {
  const settingsRows = await readSheet("設定");
  let times = ["08:00"];

  for (const row of settingsRows.slice(1)) {
    if (row[0] === "投稿時間") {
      times = String(row[1]).split(",").map((t) => t.trim());
    }
  }

  // 既存の投稿予定日時を Set に
  const booked = new Set();
  for (const row of postRows.slice(1)) {
    const v = row[2];
    if (v && String(v).trim()) booked.add(String(v).trim());
  }

  const now = new Date();
  const date = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  for (let d = 0; d < 365; d++) {
    for (const time of times) {
      const [h, m] = time.split(":").map(Number);
      const candidate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), h, m, 0);
      if (candidate <= now) continue;

      const y = candidate.getFullYear();
      const mo = String(candidate.getMonth() + 1).padStart(2, "0");
      const dd = String(candidate.getDate()).padStart(2, "0");
      const hh = String(candidate.getHours()).padStart(2, "0");
      const mi = String(candidate.getMinutes()).padStart(2, "0");
      const formatted = `${y}/${mo}/${dd} ${hh}:${mi}`;

      if (!booked.has(formatted)) return formatted;
    }
    date.setDate(date.getDate() + 1);
  }

  return "枠なし";
}

/**
 * シートをクリアしてヘッダー付きで上書きする
 */
export async function writeSheet(sheetName, headers, rows) {
  const sheets = await getSheets();
  const data = [headers, ...rows];
  await sheets.spreadsheets.values.clear({
    spreadsheetId: SPREADSHEET_ID,
    range: `'${sheetName}'!A:Z`,
  });
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `'${sheetName}'!A1`,
    valueInputOption: "RAW",
    requestBody: { values: data },
  });
}
