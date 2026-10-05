/**
 * HTMLファイル → A4縦PDF（チラシ・単票向け）
 * 使い方: node server/scripts/html_to_pdf.mjs <htmlファイルパス> [<htmlファイルパス2> ...]
 */

import puppeteer from 'puppeteer';
import { resolve, basename, dirname, join } from 'path';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';

const files = process.argv.slice(2);

if (files.length === 0) {
  console.error('使い方: node server/scripts/html_to_pdf.mjs <htmlファイルパス> [<htmlファイルパス2> ...]');
  process.exit(1);
}

const browser = await puppeteer.launch({ headless: 'new' });

for (const f of files) {
  const htmlPath = resolve(f);
  if (!existsSync(htmlPath)) {
    console.warn(`⚠️  見つかりません: ${f}`);
    continue;
  }
  const pdfPath = join(dirname(htmlPath), basename(htmlPath, '.html') + '.pdf');
  const page = await browser.newPage();
  await page.goto(`file:///${htmlPath.replace(/\\/g, '/')}`, { waitUntil: 'networkidle0' });
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: 0, bottom: 0, left: 0, right: 0 },
  });
  await page.close();
  console.log(`✅ ${basename(pdfPath)}`);
}

await browser.close();
console.log('\n完了！');
