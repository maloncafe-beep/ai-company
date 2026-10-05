/**
 * docs.mjs — Google Docs ドキュメント作成ヘルパー
 *
 * Sheets と同じ OAuth トークンを使用。
 * auth-google.mjs のスコープに documents + drive.file を含めること。
 */

import { google } from "googleapis";
import { getAuthClient } from "./sheets.mjs";

let _docs;
let _drive;

function getDocsApi() {
  if (_docs) return _docs;
  const client = getAuthClient();
  _docs = google.docs({ version: "v1", auth: client });
  return _docs;
}

function getDriveApi() {
  if (_drive) return _drive;
  const client = getAuthClient();
  _drive = google.drive({ version: "v3", auth: client });
  return _drive;
}

/**
 * Google ドキュメントを新規作成してテキストを挿入する
 *
 * @param {string} title - ドキュメントタイトル
 * @param {string} body - 本文テキスト
 * @param {string} [folderId] - 保存先フォルダID（省略時はマイドライブ直下）
 * @returns {{ documentId: string, url: string }}
 */
export async function createArticleDoc(title, body, folderId) {
  const docs = getDocsApi();

  const res = await docs.documents.create({
    requestBody: { title },
  });

  const documentId = res.data.documentId;

  if (body) {
    await docs.documents.batchUpdate({
      documentId,
      requestBody: {
        requests: [
          {
            insertText: {
              location: { index: 1 },
              text: body,
            },
          },
        ],
      },
    });
  }

  if (folderId) {
    const drive = getDriveApi();
    const file = await drive.files.get({
      fileId: documentId,
      fields: "parents",
    });
    const previousParents = (file.data.parents || []).join(",");
    await drive.files.update({
      fileId: documentId,
      addParents: folderId,
      removeParents: previousParents,
      fields: "id, parents",
    });
  }

  const url = `https://docs.google.com/document/d/${documentId}/edit`;
  return { documentId, url };
}
