import { TwitterApi } from "twitter-api-v2";
import dotenv from "dotenv";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const PROJECT_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
dotenv.config({ path: join(PROJECT_ROOT, ".env") });

const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_KEY_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_TOKEN_SECRET,
});

console.log("テスト投稿を試みます...");
try {
  const result = await client.v2.tweet("テスト投稿です（すぐ削除します）");
  console.log("成功:", result.data.id);
  await client.v2.deleteTweet(result.data.id);
  console.log("削除完了");
} catch (err) {
  console.error("エラーコード:", err.code);
  console.error("エラー詳細:", JSON.stringify(err.data ?? err.errors ?? err.message, null, 2));
}
