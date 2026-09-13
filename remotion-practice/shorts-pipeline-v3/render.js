import fs from "fs";
import { execSync } from "child_process";

const data = JSON.parse(fs.readFileSync("./src/lines-data.json", "utf8"));
const out = `out/${data.outputFilename}`;
fs.mkdirSync("out", { recursive: true });
console.log(`\n🎬 レンダリング開始: ${out}\n`);
execSync(`npx remotion render KatsuVideo ${out}`, { stdio: "inherit" });
console.log(`\n✅ 完成: ${out}\n`);
