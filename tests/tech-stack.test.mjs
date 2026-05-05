import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("project uses TypeScript source and exposes typecheck/build scripts", async () => {
  for (const file of ["tsconfig.json", "src/app.ts", "src/scoring.ts", "src/data.ts", "src/types.ts"]) {
    await access(new URL(`../${file}`, import.meta.url));
  }

  const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
  assert.equal(packageJson.scripts.typecheck, "tsc --noEmit");
  assert.ok(packageJson.devDependencies.typescript, "typescript dev dependency is declared");
});

test("build produces compiled browser modules", async () => {
  await access(new URL("../dist/index.html", import.meta.url));
  await access(new URL("../dist/src/app.js", import.meta.url));
  await access(new URL("../dist/src/scoring.js", import.meta.url));
  await access(new URL("../dist/src/data.js", import.meta.url));

  const compiledApp = await readFile(new URL("../dist/src/app.js", import.meta.url), "utf8");
  const compiledCss = await readFile(new URL("../dist/styles.css", import.meta.url), "utf8");
  assert.match(compiledApp, /component-grid/);
  assert.match(compiledCss, /component-row-penalty/);
});

test("ranking model exposes score components for product waterfall UI", async () => {
  const { investorSightData } = await import("../dist/src/data.js");
  const { rankCompanies } = await import("../dist/src/scoring.js");
  const [top] = rankCompanies(investorSightData.companies);

  assert.deepEqual(Object.keys(top.score.components), [
    "activistPressure",
    "recentChange",
    "businessSeverity",
    "thesisClarity",
    "evidenceQuality",
    "uncertaintyPenalty",
  ]);
  assert.equal(top.score.components.uncertaintyPenalty, -2);
});

test("standalone repo includes OSS and CI surfaces", async () => {
  for (const file of [
    "package-lock.json",
    "LICENSE",
    "CONTRIBUTING.md",
    "CHANGELOG.md",
    ".github/workflows/ci.yml",
  ]) {
    await access(new URL(`../${file}`, import.meta.url));
  }

  const workflow = await readFile(new URL("../.github/workflows/ci.yml", import.meta.url), "utf8");
  assert.match(workflow, /npm run typecheck/);
  assert.match(workflow, /npm run verify:data/);
});
