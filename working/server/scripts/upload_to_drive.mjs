/**
 * PPTXをGoogle Driveにアップロード → Googleスライドに変換 → PDFでエクスポート
 * 使い方: node server/scripts/upload_to_drive.mjs <pptxファイルパス> [フォルダ名]
 */

import { google } from 'googleapis';
import { createReadStream, writeFileSync, existsSync } from 'fs';
import { resolve, basename, dirname } from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

// .env 読み込み
const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '../../server/.env') });

const PPTX_PATH = process.argv[2];
const FOLDER_NAME = process.argv[3] || 'AIカンパニー_スライド';

if (!PPTX_PATH || !existsSync(PPTX_PATH)) {
  console.error('❌ PPTXファイルが見つかりません:', PPTX_PATH);
  console.error('使い方: node server/scripts/upload_to_drive.mjs <pptxファイルパス>');
  process.exit(1);
}

// OAuth2 クライアント
const auth = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);
auth.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

const drive = google.drive({ version: 'v3', auth });

async function getOrCreateFolder(name) {
  // 既存フォルダを検索
  const res = await drive.files.list({
    q: `name='${name}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
    fields: 'files(id, name)',
  });
  if (res.data.files.length > 0) {
    console.log(`📁 フォルダ既存: "${name}"`);
    return res.data.files[0].id;
  }
  // 新規作成
  const folder = await drive.files.create({
    requestBody: { name, mimeType: 'application/vnd.google-apps.folder' },
    fields: 'id',
  });
  console.log(`📁 フォルダ作成: "${name}"`);
  return folder.data.id;
}

async function main() {
  const pptxPath = resolve(PPTX_PATH);
  const pptxName = basename(pptxPath, '.pptx');
  const pdfPath = resolve(dirname(pptxPath), `${pptxName}.pdf`);

  console.log(`\n📤 アップロード開始: ${basename(pptxPath)}`);

  // 1. フォルダ取得/作成
  const folderId = await getOrCreateFolder(FOLDER_NAME);

  // 2. PPTXをアップロード → Googleスライドに変換
  const uploadRes = await drive.files.create({
    requestBody: {
      name: pptxName,
      mimeType: 'application/vnd.google-apps.presentation',
      parents: [folderId],
    },
    media: {
      mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      body: createReadStream(pptxPath),
    },
    fields: 'id, name, webViewLink',
  });

  const fileId = uploadRes.data.id;
  const slideUrl = uploadRes.data.webViewLink;
  console.log(`✅ Googleスライドに変換完了`);
  console.log(`   → ${slideUrl}`);

  // 3. PDFとしてエクスポート
  const pdfRes = await drive.files.export(
    { fileId, mimeType: 'application/pdf' },
    { responseType: 'arraybuffer' }
  );
  writeFileSync(pdfPath, Buffer.from(pdfRes.data));
  console.log(`✅ PDFエクスポート完了`);
  console.log(`   → ${pdfPath}`);

  console.log(`\n🎉 完了！`);
  console.log(`   Googleスライド: ${slideUrl}`);
  console.log(`   PDF: ${pdfPath}`);
}

main().catch(e => {
  console.error('❌ エラー:', e.message);
  process.exit(1);
});
