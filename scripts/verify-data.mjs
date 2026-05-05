import assert from "node:assert/strict";

import { buildDemoReliabilityReport, stableRankingHash } from "../dist/src/analysis.js";
import { investorSightData } from "../dist/src/data.js";
import { rankCompanies } from "../dist/src/scoring.js";

const requiredTickers = ["HON", "NCLH", "K", "LOW", "ALGM", "ZIP", "GIS", "ASH", "PSX", "LW"];
const ranked = rankCompanies(investorSightData.companies);
const reliability = buildDemoReliabilityReport(investorSightData, ranked);
const sourceIds = new Set(investorSightData.companies.flatMap((company) => company.sources.map((source) => source.id)));

assert.equal(investorSightData.asOf, "2026-05-05", "as-of date must match assignment run date");
assert.deepEqual(
  new Set(investorSightData.companies.map((company) => company.ticker)),
  new Set(requiredTickers),
  "dataset must match assigned universe",
);

for (const company of investorSightData.companies) {
  assert.ok(company.events.length >= 3, `${company.ticker} requires at least 3 events`);
  assert.ok(company.sources.length >= 2, `${company.ticker} requires at least 2 sources`);
  assert.ok(company.whyNow.thesis, `${company.ticker} requires thesis`);
  assert.ok(company.whyNow.counterarguments.length >= 2, `${company.ticker} requires counterarguments`);
  assert.ok(company.memo.nextSteps.length >= 2, `${company.ticker} requires next diligence steps`);
  for (const event of company.events) {
    assert.ok(sourceIds.has(event.sourceId), `${company.ticker} event has missing source ${event.sourceId}`);
    assert.match(event.date, /^\d{4}-\d{2}-\d{2}$/, `${company.ticker} event date must be ISO-like`);
  }
}

for (const company of ranked) {
  assert.ok(company.score.total >= 0 && company.score.total <= 100, `${company.ticker} score bounded`);
  assert.ok(company.score.drivers.length >= 2, `${company.ticker} score drivers visible`);
  assert.ok(company.score.penalties.length >= 1, `${company.ticker} score penalties visible`);
}

assert.equal(reliability.demoReadinessScore, 100, "demo readiness should be presenter-safe");
assert.equal(reliability.missingEventSources, 0, "all events should resolve to company-local sources");

console.log(
  `PASS investor-sight data: ${ranked.length} companies, ${sourceIds.size} sources, top=${ranked[0].ticker}:${ranked[0].score.total}, readiness=${reliability.demoReadinessScore}, hash=${stableRankingHash(ranked)}`,
);
