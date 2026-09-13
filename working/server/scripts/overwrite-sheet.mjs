// overwrite-sheet.mjs
// ローカルCSV の全内容でスプシを上書き（ヘッダー行を残してデータ行を全置換）
//
// 使い方:
//   node server/scripts/overwrite-sheet.mjs           # 実際に上書き
//   node server/scripts/overwrite-sheet.mjs --dry-run  # 確認のみ

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
const DRY_RUN        = process.argv.includes('--dry-run');

function getAuth() {
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );
  auth.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
  return auth;
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
      else { inQuotes = !inQuotes; }
    } else if (ch === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

function parseCSV(content) {
  return content.split(/\r?\n/).filter(l => l.trim()).map(parseCSVLine);
}

async function main() {
  if (DRY_RUN) console.log('🔍 DRY RUN モード\n');

  if (!process.env.GOOGLE_REFRESH_TOKEN) {
    console.error('❌ GOOGLE_REFRESH_TOKEN が .env にありません。');
    process.exit(1);
  }

  const auth = getAuth();
  const sheets = google.sheets({ version: 'v4', auth });

  // シート名取得
  console.log('📊 スプシに接続中...');
  const meta = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
  const sheet = meta.data.sheets.find(s => s.properties.sheetId === SHEET_GID);
  if (!sheet) throw new Error(`GID ${SHEET_GID} のシートが見つかりません`);
  const sheetName = sheet.properties.title;
  console.log(`   シート名: "${sheetName}"`);

  // 現在の行数を確認
  const existing = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${sheetName}!A:A`,
  });
  const existingCount = (existing.data.values || []).length - 1; // ヘッダー除く
  console.log(`   既存件数: ${existingCount}件`);

  // CSV読み込み
  const csvContent = await fs.readFile(CSV_PATH, 'utf8');
  const rows = parseCSV(csvContent);
  const header = rows[0];
  const dataRows = rows.slice(1);

  console.log(`📋 CSV件数: ${dataRows.length}件`);
  console.log(`🗑  削除予定: ${existingCount - dataRows.length}件`);

  if (DRY_RUN) {
    console.log('\n🔍 DRY RUN 完了。実際に上書きするには --dry-run を外してください。');
    return;
  }

  // STEP1: データ行を全クリア（ヘッダー行 = 1行目は残す）
  console.log('\nデータ行をクリア中...');
  if (existingCount > 0) {
    await sheets.spreadsheets.values.clear({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A2:K${existingCount + 2}`,
    });
  }

  // STEP2: CSVの全データ行を書き込む
  const formattedRows = dataRows.map(r => {
    const row = [...r];
    const numId = Number(row[0]);
    if (!isNaN(numId) && String(numId) === (row[0] || '').trim()) row[0] = numId;
    return row;
  });

  console.log('スプシに書き込み中...');
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${sheetName}!A2`,
    valueInputOption: 'RAW',
    requestBody: { values: formattedRows },
  });

  console.log(`\n✅ 完了！${dataRows.length}件でスプシを上書きしました。`);
  console.log(`   スプシ: https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit`);
}

main().catch(e => {
  console.error('❌ エラー:', e.message);
  process.exit(1);
});
