import assert from "node:assert/strict";
import test from "node:test";

import { investorSightData } from "../dist/src/data.js";
import { rankCompanies } from "../dist/src/scoring.js";

const requiredCompanies = new Set([
  "HON",
  "NCLH",
  "K",
  "LOW",
  "ALGM",
  "ZIP",
  "GIS",
  "ASH",
  "PSX",
  "LW",
]);

test("dataset covers the full assigned company universe", () => {
  assert.equal(investorSightData.asOf, "2026-05-05");
  assert.deepEqual(new Set(investorSightData.companies.map((company) => company.ticker)), requiredCompanies);
});

test("each company has complete why-now, event, source, and memo coverage", () => {
  for (const company of investorSightData.companies) {
    assert.ok(company.name, `${company.ticker} has name`);
    assert.ok(company.status, `${company.ticker} has public-status context`);
    assert.ok(company.events.length >= 3, `${company.ticker} has at least three recent events`);
    assert.ok(company.sources.length >= 2, `${company.ticker} has multiple public sources`);
    assert.ok(company.whyNow.recentDevelopments.length >= 2, `${company.ticker} has recent developments`);
    assert.ok(company.whyNow.whyItMattersNow, `${company.ticker} explains why it matters now`);
    assert.ok(company.whyNow.thesis, `${company.ticker} has activist or strategic-pressure thesis`);
    assert.ok(company.whyNow.counterarguments.length >= 2, `${company.ticker} has counterarguments`);
    assert.ok(company.whyNow.supportingEvidence.length >= 2, `${company.ticker} has supporting evidence`);
    assert.ok(company.whyNow.weakeningEvidence.length >= 2, `${company.ticker} has weakening evidence`);
    assert.ok(company.memo.whyNow, `${company.ticker} memo has why now/not now`);
    assert.ok(company.memo.supportingPoints.length >= 2, `${company.ticker} memo has support`);
    assert.ok(company.memo.risks.length >= 2, `${company.ticker} memo has risks`);
    assert.ok(company.memo.nextSteps.length >= 2, `${company.ticker} memo has next steps`);
  }
});

test("every event is structured and source-backed", () => {
  const sourceIds = new Set(investorSightData.companies.flatMap((company) => company.sources.map((source) => source.id)));

  for (const company of investorSightData.companies) {
    for (const event of company.events) {
      assert.match(event.date, /^\d{4}-\d{2}-\d{2}$/);
      assert.ok(event.type, `${company.ticker} event has type`);
      assert.ok(event.description.length >= 40, `${company.ticker} event has meaningful description`);
      assert.ok(sourceIds.has(event.sourceId), `${company.ticker} event source exists: ${event.sourceId}`);
      assert.ok(["low", "medium", "high", "very high"].includes(event.importance), `${company.ticker} event importance valid`);
      assert.ok(["low", "medium", "high"].includes(event.confidence), `${company.ticker} event confidence valid`);
    }
  }
});

test("final ranking includes score, tier, drivers, and uncertainties for all companies", () => {
  for (const ranked of rankCompanies(investorSightData.companies)) {
    assert.ok(Number.isInteger(ranked.score.total), `${ranked.ticker} total score is integer`);
    assert.ok(ranked.score.total >= 0 && ranked.score.total <= 100, `${ranked.ticker} score bounded`);
    assert.ok(ranked.actionabilityTier, `${ranked.ticker} has tier`);
    assert.ok(ranked.score.drivers.length >= 2, `${ranked.ticker} has score drivers`);
    assert.ok(ranked.whyNow.uncertainties.length >= 2, `${ranked.ticker} has uncertainties`);
  }
});
