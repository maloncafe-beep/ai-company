// run-from-sheet.mjs
import { google } from 'googleapis';
import fs from 'fs/promises';

async function main() {
  try {
    // 認証設定
    const auth = new google.auth.GoogleAuth({
      keyFile: 'credentials.json', // サービスアカウントの鍵ファイル
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // 読み込むスプレッドシート情報
    const spreadsheetId = 'YOUR_SPREADSHEET_ID'; // 例: 1AbCdEfGhIjKlMnOpQrStUvWxYz
    const range = 'Sheet1!A1:C10';

    // データ取得
    const res = await sheets.spreadsheets.values.get({ spreadsheetId, range });
    const rows = res.data.values || [];

    console.log('取得データ:');
    console.table(rows);

    // CSVとして保存（任意）
    await fs.writeFile('output.csv', rows.map(r => r.join(',')).join('\n'));
    console.log('output.csv に保存しました');
  } catch (err) {
    console.error('エラー:', err.message);
  }
}

main();
