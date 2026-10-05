/**
 * HTMLファイル → 各ページをPNG → PPTX → Google Drive（スライド＋PDF）
 * 使い方: node server/scripts/html_to_slides.mjs <htmlファイルパス> [フォルダ名]
 */

import puppeteer from 'puppeteer';
import pptxgen from 'pptxgenjs';
import { google } from 'googleapis';
import { createReadStream, writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, basename, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '../../server/.env') });

const HTML_PATH = process.argv[2];
const FOLDER_NAME = process.argv[3] || 'AIカンパニー_スライド';

if (!HTML_PATH || !existsSync(HTML_PATH)) {
  console.error('❌ HTMLファイルが見つかりません:', HTML_PATH);
  console.error('使い方: node server/scripts/html_to_slides.mjs <htmlファイルパス> [フォルダ名]');
  process.exit(1);
}

const htmlPath = resolve(HTML_PATH);
const baseName = basename(htmlPath, '.html');
const outDir = dirname(htmlPath);
const pptxPath = join(outDir, `${baseName}.pptx`);
const pdfPath = join(outDir, `${baseName}.pdf`);
const tmpDir = join(outDir, `_tmp_${baseName}`);
mkdirSync(tmpDir, { recursive: true });

// ─── STEP 1: puppeteerで各ページをPNG撮影 ───
console.log(`\n📸 HTMLをスキャン中: ${basename(htmlPath)}`);
const browser = await puppeteer.launch({ headless: 'new' });
const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });

const fileUrl = `file:///${htmlPath.replace(/\\/g, '/')}`;
await page.goto(fileUrl, { waitUntil: 'networkidle0' });

// .page クラスの要素を取得（なければbodyを1枚として扱う）
const pageCount = await page.evaluate(() =>
  document.querySelectorAll('.page, .slide, section.page').length
);

const pngPaths = [];

if (pageCount > 0) {
  console.log(`   ${pageCount}ページ検出 → 各ページを撮影します`);
  for (let i = 0; i < pageCount; i++) {
    const pngPath = join(tmpDir, `page_${String(i+1).padStart(2,'0')}.png`);
    const clip = await page.evaluate((idx) => {
      const el = document.querySelectorAll('.page, .slide, section.page')[idx];
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: r.left, y: r.top, width: r.width, height: r.height };
    }, i);

    if (clip && clip.width > 0 && clip.height > 0) {
      await page.screenshot({ path: pngPath, clip });
      pngPaths.push(pngPath);
      process.stdout.write(`   撮影: page ${i+1}/${pageCount}\r`);
    }
  }
  console.log('');
} else {
  // ページ区切りなし → 全体を1枚
  console.log('   ページ区切りなし → 全体を1枚で撮影');
  const pngPath = join(tmpDir, 'page_01.png');
  await page.screenshot({ path: pngPath, fullPage: true });
  pngPaths.push(pngPath);
}

await browser.close();
console.log(`✅ ${pngPaths.length}枚撮影完了`);

// ─── STEP 2: PPTXを生成（各PNGを1スライド） ───
console.log(`\n📊 PPTX生成中...`);
const pres = new pptxgen();
pres.layout = 'LAYOUT_16x9';

for (const png of pngPaths) {
  const slide = pres.addSlide();
  slide.addImage({ path: png, x: 0, y: 0, w: '100%', h: '100%' });
}

await pres.writeFile({ fileName: pptxPath });
console.log(`✅ PPTX生成: ${basename(pptxPath)}`);

// ─── STEP 3: Google Driveにアップロード ───
console.log(`\n📤 Google Driveにアップロード中...`);
const auth = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);
auth.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
const drive = google.drive({ version: 'v3', auth });

// フォルダ取得/作成
const folderRes = await drive.files.list({
  q: `name='${FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
  fields: 'files(id)',
});
let folderId;
if (folderRes.data.files.length > 0) {
  folderId = folderRes.data.files[0].id;
  console.log(`   📁 フォルダ既存: "${FOLDER_NAME}"`);
} else {
  const f = await drive.files.create({
    requestBody: { name: FOLDER_NAME, mimeType: 'application/vnd.google-apps.folder' },
    fields: 'id',
  });
  folderId = f.data.id;
  console.log(`   📁 フォルダ作成: "${FOLDER_NAME}"`);
}

// PPTXをアップロード → Googleスライドに変換
const uploadRes = await drive.files.create({
  requestBody: {
    name: baseName,
    mimeType: 'application/vnd.google-apps.presentation',
    parents: [folderId],
  },
  media: {
    mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    body: createReadStream(pptxPath),
  },
  fields: 'id, webViewLink',
});

const fileId = uploadRes.data.id;
const slideUrl = uploadRes.data.webViewLink;
console.log(`✅ Googleスライドに変換完了`);

// PDFエクスポート
const pdfRes = await drive.files.export(
  { fileId, mimeType: 'application/pdf' },
  { responseType: 'arraybuffer' }
);
writeFileSync(pdfPath, Buffer.from(pdfRes.data));
console.log(`✅ PDFエクスポート完了`);

console.log(`\n🎉 完了！`);
console.log(`   Googleスライド: ${slideUrl}`);
console.log(`   PDF: ${pdfPath}`);
