// read-keywords.mjs
// スプシの「キーワード設定」シートから検索キーワードを取得して JSON で出力する
//
// 使い方:
//   node server/scripts/read-keywords.mjs               # 有効キーワード全件
//   node server/scripts/read-keywords.mjs 動画・台本系   # カテゴリ絞り込み（部分一致）
//
// 出力（stdout）:
//   [
//     { "category": "資料系", "keyword": "提案書", "excludes": ["テンプレ"] },
//     { "category": "資料系", "keyword": "営業資料", "excludes": [] },
//     ...
//   ]
//
// スプシのシート構成（シート名: キーワード設定）:
//   A列: カテゴリ
//   B列: キーワード
//   C列: 除外条件（カンマ区切りで複数可。例: テンプレ,サンプル）
//   D列: 有効（✓ / ○ / true / TRUE のいずれかで有効。空欄は無効）

import { google } from 'googleapis';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const SPREADSHEET_ID = '1xa9cVV28mP53P2Vyq2UtTP9piRr5-r_niaPQ2ZiLsNQ';
const SHEET_NAME = 'キーワード設定';
const VALID_FLAGS = new Set(['✓', '○', 'true', 'TRUE', '1', 'yes', 'YES']);

function getAuth() {
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );
  auth.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
  return auth;
}

async function main() {
  const categoryFilter = (process.argv[2] || '').trim();

  if (!process.env.GOOGLE_REFRESH_TOKEN) {
    console.error('❌ GOOGLE_REFRESH_TOKEN が .env にありません。server/SETUP.md のパート1を確認してください。');
    process.exit(1);
  }

  const auth = getAuth();
  const sheets = google.sheets({ version: 'v4', auth });

  // シートの存在確認
  let sheetExists = false;
  try {
    const meta = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
    sheetExists = meta.data.sheets.some(s => s.properties.title === SHEET_NAME);
  } catch (e) {
    console.error('❌ スプシへのアクセスに失敗しました:', e.message);
    process.exit(1);
  }

  if (!sheetExists) {
    console.error(`❌ シート「${SHEET_NAME}」が見つかりません。`);
    console.error('   スプシに「キーワード設定」シートを作成してください。');
    console.error('   列構成: A=カテゴリ / B=キーワード / C=除外条件 / D=有効');
    process.exit(1);
  }

  // データ取得
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!A:D`,
  });

  const rows = res.data.values || [];
  if (rows.length < 2) {
    console.error(`❌ シート「${SHEET_NAME}」にデータがありません（ヘッダー行のみ）。`);
    process.exit(1);
  }

  // ヘッダー行をスキップしてデータ行を処理
  let keywords = rows.slice(1)
    .filter(row => {
      const keyword = (row[1] || '').trim();
      const flag = (row[3] || '').trim();
      return keyword && VALID_FLAGS.has(flag);
    })
    .map(row => {
      const category = (row[0] || '').trim();
      const keyword = (row[1] || '').trim();
      const excludeRaw = (row[2] || '').trim();
      const excludes = excludeRaw
        ? excludeRaw.split(',').map(s => s.trim()).filter(Boolean)
        : [];
      return { category, keyword, excludes };
    });

  // カテゴリ絞り込み（部分一致）
  if (categoryFilter) {
    keywords = keywords.filter(k => k.category.includes(categoryFilter));
    if (keywords.length === 0) {
      console.error(`❌ カテゴリ「${categoryFilter}」に一致する有効キーワードがありません。`);
      process.exit(1);
    }
  }

  if (keywords.length === 0) {
    console.error(`❌ 有効なキーワードが1件もありません。D列に ✓ を入れてください。`);
    process.exit(1);
  }

  console.log(JSON.stringify(keywords, null, 2));
}

main().catch(e => {
  console.error('❌ 予期しないエラー:', e.message);
  process.exit(1);
});
