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
import { google } from "googleapis";
import dotenv from "dotenv";

import { fileURLToPath } from "url";
export const PROJECT_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
dotenv.config({ path: join(PROJECT_ROOT, ".env") });

export let SPREADSHEET_ID = process.env.SPREADSHEET_ID;
export const LOG_SHEET = "記事ログ";

const TOKENS_PATH =
  process.env.GOOGLE_TOKENS_PATH || join(PROJECT_ROOT, "credentials", "tokens.json");

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

/**
 * SPREADSHEET_ID を .env に書き込む
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
 * シートの全データを読み取る（ヘッダー含む）
 */
export async function readSheet(sheetName, range = "A:E") {
  const sheets = await getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `'${sheetName}'!${range}`,
  });
  return res.data.values || [];
}

/**
 * 記事ログに1行追記する
 *
 * 列構成: A=キーワード B=title C=記事URL D=文字数 E=作成日
 *
 * @param {object} entry - { keyword, title, articleUrl, charCount }
 */
export async function appendArticleLog(entry) {
  const sheets = await getSheets();
  const row = [
    entry.keyword || "",
    entry.title || "",
    entry.articleUrl || "",
    entry.charCount ? String(entry.charCount) : "",
    new Date().toLocaleDateString("ja-JP"),
  ];
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `'${LOG_SHEET}'!A:E`,
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [row] },
  });
  return row;
}
