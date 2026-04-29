#!/usr/bin/env node

/**
 * create-template-sheet.mjs — SEO記事ログ用テンプレートスプシを新規作成
 *
 * Google Sheets API で新規スプレッドシートを作成し、
 * 「記事ログ」シートのヘッダーを設定する。
 *
 * Usage: node tools/create-template-sheet.mjs
 */

import { getAuthClient } from "./lib/sheets.mjs";
import { google } from "googleapis";

const LOG_HEADERS = [
  "キーワード",
  "title",
  "記事URL",
  "文字数",
  "作成日",
];

async function main() {
  const auth = getAuthClient();
  const sheets = google.sheets({ version: "v4", auth });

  console.log("テンプレートスプシを作成中...");

  const createRes = await sheets.spreadsheets.create({
    requestBody: {
      properties: {
        title: "SEO記事ログ",
        locale: "ja_JP",
      },
      sheets: [
        {
          properties: {
            title: "記事ログ",
            sheetId: 0,
            gridProperties: { frozenRowCount: 1 },
          },
        },
      ],
    },
  });

  const spreadsheetId = createRes.data.spreadsheetId;
  const spreadsheetUrl = createRes.data.spreadsheetUrl;

  console.log(`✓ スプシ作成完了: ${spreadsheetUrl}`);

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: "'記事ログ'!A1:E1",
    valueInputOption: "RAW",
    requestBody: { values: [LOG_HEADERS] },
  });

  console.log("✓ ヘッダーを書き込み完了");

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        // ヘッダー行の書式（太字のみ）
        {
          repeatCell: {
            range: {
              sheetId: 0,
              startRowIndex: 0,
              endRowIndex: 1,
              startColumnIndex: 0,
              endColumnIndex: 5,
            },
            cell: {
              userEnteredFormat: {
                textFormat: { bold: true },
              },
            },
            fields: "userEnteredFormat(textFormat)",
          },
        },
        // 列幅の調整
        {
          updateDimensionProperties: {
            range: { sheetId: 0, dimension: "COLUMNS", startIndex: 0, endIndex: 1 },
            properties: { pixelSize: 220 },
            fields: "pixelSize",
          },
        },
        {
          updateDimensionProperties: {
            range: { sheetId: 0, dimension: "COLUMNS", startIndex: 1, endIndex: 2 },
            properties: { pixelSize: 300 },
            fields: "pixelSize",
          },
        },
        {
          updateDimensionProperties: {
            range: { sheetId: 0, dimension: "COLUMNS", startIndex: 2, endIndex: 3 },
            properties: { pixelSize: 350 },
            fields: "pixelSize",
          },
        },
        // デフォルトシート（Sheet1）を削除
        ...createRes.data.sheets
          .filter((s) => s.properties.title === "Sheet1")
          .map((s) => ({ deleteSheet: { sheetId: s.properties.sheetId } })),
      ],
    },
  });

  console.log("✓ 書式設定完了");

  const copyUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/copy`;

  console.log("");
  console.log("=== テンプレート作成完了 ===");
  console.log("");
  console.log(`スプシURL: ${spreadsheetUrl}`);
  console.log(`コピーURL: ${copyUrl}`);
  console.log("");
  console.log("クライアントにはコピーURLを渡してください。");
  console.log("コピー後のスプシIDを init-spreadsheet.mjs --id で設定します。");
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
