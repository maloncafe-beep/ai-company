// download-sheet.mjs
// スプシ（1_案件検索）の全件をCSVとしてダウンロードする
//
// 使い方:
//   node server/scripts/download-sheet.mjs

import { google } from 'googleapis';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const SPREADSHEET_ID = '1xa9cVV28mP53P2Vyq2UtTP9piRr5-r_niaPQ2ZiLsNQ';
const SHEET_GID      = 1702200267;
const CSV_PATH       = path.join(__dirname, '../../logs/案件検索結果.csv');

function getAuth() {
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );
  auth.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
  return auth;
}

function toCSVField(v) {
  const s = String(v ?? '');
  return s.includes(',') || s.includes('"') || s.includes('\n')
    ? `"${s.replace(/"/g, '""')}"` : s;
}

async function main() {
  const auth = getAuth();
  const sheets = google.sheets({ version: 'v4', auth });

  // シート名を取得
  const meta = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
  const sheet = meta.data.sheets.find(s => s.properties.sheetId === SHEET_GID);
  const sheetName = sheet?.properties?.title ?? 'Sheet1';

  // 全件取得
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${sheetName}`,
  });

  const rows = res.data.values ?? [];
  if (rows.length === 0) {
    console.log('データが見つかりませんでした');
    return;
  }

  // CSV に変換（列数を1行目のヘッダーに合わせる）
  const colCount = rows[0].length;
  const csvLines = rows.map(row => {
    const padded = [...row];
    while (padded.length < colCount) padded.push('');
    return padded.map(toCSVField).join(',');
  });

  await fs.writeFile(CSV_PATH, csvLines.join('\n'), 'utf8');
  console.log(`✅ ${rows.length - 1}件をダウンロードしました → ${CSV_PATH}`);
}

main().catch(e => { console.error('❌ エラー:', e.message); process.exit(1); });
