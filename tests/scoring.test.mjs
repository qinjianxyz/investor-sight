import assert from "node:assert/strict";
import test from "node:test";

import { investorSightData } from "../data/investor-sight.js";
import { rankCompanies, scoreCompany } from "../src/scoring.mjs";

test("scoreCompany rewards active pressure, recent change, evidence quality, and thesis clarity", () => {
  const norwegian = investorSightData.companies.find((company) => company.ticker === "NCLH");
  const kellanova = investorSightData.companies.find((company) => company.ticker === "K");

  assert.ok(norwegian, "Norwegian Cruise Line Holdings fixture exists");
  assert.ok(kellanova, "Kellanova fixture exists");

  const nclhScore = scoreCompany(norwegian);
  const kellanovaScore = scoreCompany(kellanova);

  assert.equal(nclhScore.total, 92);
  assert.equal(kellanovaScore.total, 18);
  assert.ok(nclhScore.total > kellanovaScore.total);
});

test("rankCompanies produces a deterministic 10-company actionability ranking", () => {
  const ranking = rankCompanies(investorSightData.companies);

  assert.equal(ranking.length, 10);
  assert.deepEqual(
    ranking.map((company) => company.ticker),
    ["NCLH", "LW", "PSX", "HON", "ASH", "ALGM", "GIS", "LOW", "ZIP", "K"],
  );
});

test("rankCompanies exposes transparent score drivers", () => {
  const [top] = rankCompanies(investorSightData.companies);

  assert.equal(top.ticker, "NCLH");
  assert.ok(top.score.drivers.some((driver) => driver.includes("active activist")));
  assert.ok(top.score.drivers.some((driver) => driver.includes("board")));
  assert.ok(top.score.penalties.some((penalty) => penalty.includes("cyclical")));
});
