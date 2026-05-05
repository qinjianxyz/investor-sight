import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("analysis layer builds a real analyst cockpit from the ranking", async () => {
  const { investorSightData } = await import("../dist/src/data.js");
  const { rankCompanies } = await import("../dist/src/scoring.js");
  const {
    buildAnalystQueue,
    buildDemoReliabilityReport,
    buildEventTimeline,
    buildScenarioViews,
    buildSourceTrustReport,
  } = await import("../dist/src/analysis.js");

  const ranking = rankCompanies(investorSightData.companies);
  const queue = buildAnalystQueue(ranking);
  const scenarios = buildScenarioViews(ranking);
  const timeline = buildEventTimeline(ranking);
  const sourceTrust = buildSourceTrustReport(ranking);
  const reliability = buildDemoReliabilityReport(investorSightData, ranking);

  assert.equal(queue[0].ticker, "NCLH");
  assert.equal(queue[0].recommendedAction, "Act now");
  assert.ok(queue.some((item) => item.recommendedAction === "Exclude"));
  assert.deepEqual(
    scenarios.map((scenario) => scenario.id),
    ["activist-triage", "ic-memo", "risk-review"],
  );
  assert.equal(scenarios[0].topTickers[0], "NCLH");
  assert.equal(timeline[0].date, "2026-05-04");
  assert.equal(timeline[0].ticker, "NCLH");
  assert.equal(sourceTrust.primarySourceRatio, 0.67);
  assert.equal(reliability.demoReadinessScore, 100);
  assert.equal(reliability.missingEventSources, 0);
  assert.deepEqual(reliability.requiredViews, [
    "mission-control",
    "scenario-lab",
    "evidence-ledger",
    "change-timeline",
    "demo-reliability",
  ]);
});

test("compiled app renders evaluator-visible cockpit surfaces", async () => {
  const html = await readFile(new URL("../dist/index.html", import.meta.url), "utf8");
  const app = await readFile(new URL("../dist/src/app.js", import.meta.url), "utf8");
  const css = await readFile(new URL("../dist/styles.css", import.meta.url), "utf8");

  for (const id of ["mission-control", "scenario-lab", "evidence-ledger", "change-timeline", "demo-reliability"]) {
    assert.match(html, new RegExp(`id="${id}"`), `${id} placeholder exists`);
  }

  for (const marker of ["renderMissionControl", "renderScenarioLab", "renderEvidenceLedger", "renderDemoReliability"]) {
    assert.match(app, new RegExp(marker), `${marker} is compiled`);
  }

  assert.match(css, /cockpit-grid/);
  assert.match(css, /scenario-card/);
  assert.match(css, /reliability-console/);
});

test("package exposes deterministic demo smoke command in CI", async () => {
  const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
  const workflow = await readFile(new URL("../.github/workflows/ci.yml", import.meta.url), "utf8");

  assert.equal(packageJson.scripts["demo:smoke"], "npm run build && node scripts/demo-smoke.mjs");
  assert.match(workflow, /npm run demo:smoke/);
});
