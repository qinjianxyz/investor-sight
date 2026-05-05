import { spawnSync } from "node:child_process";
import { access, cp, rm } from "node:fs/promises";
import { join } from "node:path";

await rm(join(process.cwd(), "dist"), { recursive: true, force: true });

const tsc = spawnSync("npx", ["tsc", "--pretty", "false"], {
  cwd: process.cwd(),
  stdio: "inherit",
});

if (tsc.status !== 0) {
  process.exit(tsc.status ?? 1);
}

const staticFiles = ["index.html", "styles.css"];
for (const file of staticFiles) {
  await cp(join(process.cwd(), file), join(process.cwd(), "dist", file));
}

const requiredFiles = [
  "dist/index.html",
  "dist/styles.css",
  "dist/src/app.js",
  "dist/src/analysis.js",
  "dist/src/scoring.js",
  "dist/src/data.js",
];
for (const file of requiredFiles) {
  await access(join(process.cwd(), file));
}

await import("../dist/src/data.js");
await import("../dist/src/scoring.js");

console.log(`PASS investor-sight TypeScript build: ${requiredFiles.length} dist files present and modules import cleanly`);
