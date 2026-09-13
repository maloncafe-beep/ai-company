// sync-sheet.mjs
// ローカルCSV → スプシ 自動同期スクリプト
//
// 使い方:
//   node server/scripts/sync-sheet.mjs           # 新規行をスプシに追記
//   node server/scripts/sync-sheet.mjs --dry-run  # 追記せず差分だけ確認
//
// 動作:
//   1. スプシから管理ID(A列)を全件取得
//   2. logs/案件検索結果.csv を読み込む
//   3. スプシにない行だけスプシに追記する（管理IDで重複除外）

import { google } from 'googleapis';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const SPREADSHEET_ID = '1xa9cVV28mP53P2Vyq2UtTP9piRr5-r_niaPQ2ZiLsNQ'; // maloncafe@gmail.com
const SHEET_GID     = 1702200267;
const CSV_PATH      = path.join(__dirname, '../../logs/案件検索結果.csv');
const DRY_RUN       = process.argv.includes('--dry-run');

// OAuth2 認証（.env のリフレッシュトークンを使用）
function getAuth() {
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );
  auth.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
  return auth;
}

// CSV パース（ダブルクォート・改行・Windows改行対応）
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
  if (DRY_RUN) console.log('🔍 DRY RUN モード（スプシへの書き込みは行いません）\n');

  // 認証チェック
  if (!process.env.GOOGLE_REFRESH_TOKEN) {
    console.error('❌ GOOGLE_REFRESH_TOKEN が .env にありません。server/SETUP.md のパート1を確認してください。');
    process.exit(1);
  }

  const auth = getAuth();
  const sheets = google.sheets({ version: 'v4', auth });

  // シート名をGIDから取得
  console.log('📊 スプシに接続中...');
  let sheetName;
  try {
    const meta = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
    const sheet = meta.data.sheets.find(s => s.properties.sheetId === SHEET_GID);
    if (!sheet) throw new Error(`GID ${SHEET_GID} のシートが見つかりません`);
    sheetName = sheet.properties.title;
    console.log(`   シート名: "${sheetName}"`);
  } catch (e) {
    console.error('❌ スプシへのアクセスに失敗しました:', e.message);
    console.error('   スプシがzodiacm369@gmail.comと共有されているか確認してください。');
    process.exit(1);
  }

  // スプシの管理ID(A列)を全件取得
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${sheetName}!A:A`,
  });
  const sheetIds = new Set(
    (res.data.values || []).slice(1).map(r => (r[0] || '').replace(/^'/, '').trim()).filter(Boolean)
  );
  console.log(`   既存件数: ${sheetIds.size}件\n`);

  // ローカルCSVを読み込む
  let csvContent;
  try {
    csvContent = await fs.readFile(CSV_PATH, 'utf8');
  } catch (e) {
    console.error('❌ CSVファイルが見つかりません:', CSV_PATH);
    process.exit(1);
  }

  const rows = parseCSV(csvContent);
  if (rows.length < 2) {
    console.log('CSVにデータがありません。');
    return;
  }

  const dataRows = rows.slice(1); // ヘッダー行を除く
  const newRows = dataRows.filter(r => r[0] && r[0].trim() && !sheetIds.has(r[0].trim()));

  console.log(`📋 CSV総件数: ${dataRows.length}件`);
  console.log(`✨ 新規追加対象: ${newRows.length}件\n`);

  if (newRows.length === 0) {
    console.log('✅ 追加する行がありません。スプシは最新の状態です。');
    return;
  }

  // 追加予定の内容を表示
  console.log('追加予定:');
  newRows.forEach(r => {
    const id    = r[0] || '';
    const media = r[1] || '';
    const title = (r[2] || '').substring(0, 40);
    const price = r[3] || '';
    console.log(`  [${media}] ${id} | ${title} | ${price}`);
  });

  if (DRY_RUN) {
    console.log('\n🔍 DRY RUN 完了。実際に追記するには --dry-run を外して実行してください。');
    return;
  }

  // スプシに追記（既存行の末尾にだけ append — 既存の「検討」等を上書きしない）
  // A列(管理ID)は数値として送る（文字列のまま送ると Sheets が ' を付けることがある）
  const formattedRows = newRows.map(r => {
    const row = [...r];
    const numId = Number(row[0]);
    if (!isNaN(numId) && String(numId) === row[0].trim()) row[0] = numId;
    return row;
  });

  console.log('\nスプシに追記中...');
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${sheetName}!A:K`,
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    requestBody: { values: formattedRows },
  });

  console.log(`\n✅ ${newRows.length}件をスプシに追記しました！`);
  console.log(`   スプシ: https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit`);
}

main().catch(e => {
  console.error('❌ 予期しないエラー:', e.message);
  process.exit(1);
});
