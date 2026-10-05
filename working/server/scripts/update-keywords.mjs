// update-keywords.mjs
// 検索結果をスプシの「キーワード設定」シートに書き戻す。
// 3回連続0件のキーワードを自動で無効化（D列を空に）する。
//
// 使い方:
//   node server/scripts/update-keywords.mjs '[{"kw":"提案書","hits":5},{"kw":"資料作成","hits":0}]'
//
// スプシの列構成（更新対象）:
//   A=カテゴリ / B=キーワード / C=除外条件 / D=有効 / E=前回ヒット数 / F=連続0件数 / G=前回実施日 / H=CWカテゴリ（参考）

import { google } from 'googleapis';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const SPREADSHEET_ID = '1xa9cVV28mP53P2Vyq2UtTP9piRr5-r_niaPQ2ZiLsNQ';
const SHEET_NAME     = 'キーワード設定';
const ZERO_LIMIT     = 3; // 何回連続0件で無効化するか

function getAuth() {
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );
  auth.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
  return auth;
}

async function main() {
  const arg = process.argv[2];
  if (!arg) {
    console.error('❌ 引数が必要です: node update-keywords.mjs \'[{"kw":"...","hits":N}]\'');
    process.exit(1);
  }

  let results;
  try {
    results = JSON.parse(arg);
  } catch {
    console.error('❌ JSON のパースに失敗しました。形式: \'[{"kw":"...","hits":N}]\'');
    process.exit(1);
  }

  if (!process.env.GOOGLE_REFRESH_TOKEN) {
    console.error('❌ GOOGLE_REFRESH_TOKEN が .env にありません。');
    process.exit(1);
  }

  const auth = getAuth();
  const sheets = google.sheets({ version: 'v4', auth });

  // 現在のシートデータを全取得（A:G）
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!A:G`,
  });
  const rows = res.data.values || [];

  // ヘッダー行を確認・補完
  if (rows.length === 0) {
    console.error('❌ シートにデータがありません。');
    process.exit(1);
  }
  const header = rows[0];
  if (!header[4]) header[4] = '前回ヒット数';
  if (!header[5]) header[5] = '連続0件数';
  if (!header[6]) header[6] = '前回実施日';

  const today = new Date().toLocaleDateString('ja-JP', { year:'numeric', month:'2-digit', day:'2-digit' }).replace(/\//g, '/');
  const disabled = [];
  const updated = [];

  // キーワードをB列で検索して更新
  const resultMap = Object.fromEntries(results.map(r => [r.kw, r.hits]));

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const kw = (row[1] || '').trim();
    if (!(kw in resultMap)) continue;

    const hits  = resultMap[kw];
    const prevZero = parseInt(row[5] || '0', 10);
    const newZero  = hits === 0 ? prevZero + 1 : 0;
    const isValid  = (row[3] || '').trim();

    row[4] = String(hits);
    row[5] = String(newZero);
    row[6] = today;

    if (newZero >= ZERO_LIMIT && isValid) {
      row[3] = ''; // D列を空に → 無効化
      disabled.push(kw);
    }

    updated.push({ kw, hits, newZero, wasDisabled: newZero >= ZERO_LIMIT && isValid });
  }

  // ヘッダー含めてシート全体を上書き
  rows[0] = header;
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!A1`,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: rows },
  });

  // 結果レポート
  console.log('📊 キーワード更新結果:');
  updated.forEach(({ kw, hits, newZero }) => {
    const tag = hits === 0 ? `0件（連続${newZero}回）` : `${hits}件`;
    const dis = newZero >= ZERO_LIMIT ? ' → 🔴 自動無効化' : '';
    console.log(`  ${kw}: ${tag}${dis}`);
  });

  if (disabled.length > 0) {
    console.log(`\n🔴 自動無効化したキーワード（${ZERO_LIMIT}回連続0件）: ${disabled.join('、')}`);
  }
  console.log('\n✅ スプシを更新しました');
}

main().catch(e => {
  console.error('❌ 予期しないエラー:', e.message);
  process.exit(1);
});
