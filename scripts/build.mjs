import { access } from "node:fs/promises";
import { join } from "node:path";

const requiredFiles = ["index.html", "styles.css", "src/app.mjs", "src/scoring.mjs", "data/investor-sight.js"];

for (const file of requiredFiles) {
  await access(join(process.cwd(), file));
}

await import("../data/investor-sight.js");
await import("../src/scoring.mjs");

console.log(`PASS investor-sight static build: ${requiredFiles.length} required files present and modules import cleanly`);
