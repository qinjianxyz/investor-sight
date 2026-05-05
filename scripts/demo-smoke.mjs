import { readFile } from "node:fs/promises";

import { buildAnalystQueue, buildDemoReliabilityReport, buildEventTimeline, stableRankingHash } from "../dist/src/analysis.js";
import { investorSightData } from "../dist/src/data.js";
import { rankCompanies } from "../dist/src/scoring.js";

const html = await readFile(new URL("../dist/index.html", import.meta.url), "utf8");
const app = await readFile(new URL("../dist/src/app.js", import.meta.url), "utf8");
const css = await readFile(new URL("../dist/styles.css", import.meta.url), "utf8");
const ranking = rankCompanies(investorSightData.companies);
const queue = buildAnalystQueue(ranking);
const timeline = buildEventTimeline(ranking);
const report = buildDemoReliabilityReport(investorSightData, ranking);

const requiredViews = report.requiredViews;
const missingViews = requiredViews.filter((id) => !html.includes(`id="${id}"`));
const missingRenderers = ["renderMissionControl", "renderScenarioLab", "renderEvidenceLedger", "renderDemoReliability"].filter(
  (name) => !app.includes(name),
);
const missingStyles = ["cockpit-grid", "scenario-card", "reliability-console"].filter((name) => !css.includes(name));

const failures = [
  queue[0]?.ticker === "NCLH" ? "" : "mission queue top ticker is not NCLH",
  queue[0]?.recommendedAction === "Act now" ? "" : "mission queue top action is not Act now",
  timeline[0]?.date === "2026-05-04" ? "" : "timeline latest event is not 2026-05-04",
  report.demoReadinessScore === 100 ? "" : `demo readiness is ${report.demoReadinessScore}`,
  report.missingEventSources === 0 ? "" : `${report.missingEventSources} event sources missing`,
  ...missingViews.map((id) => `missing view #${id}`),
  ...missingRenderers.map((name) => `missing renderer ${name}`),
  ...missingStyles.map((name) => `missing style ${name}`),
].filter(Boolean);

if (failures.length > 0) {
  console.error(`FAIL investor-sight demo smoke:\n- ${failures.join("\n- ")}`);
  process.exit(1);
}

console.log(
  `PASS investor-sight demo smoke: readiness=${report.demoReadinessScore} top=${queue[0].ticker}:${
    queue[0].score
  } timeline=${timeline.length} hash=${stableRankingHash(ranking)}`,
);
