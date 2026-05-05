import assert from "node:assert/strict";
import test from "node:test";

import { investorSightData } from "../dist/src/data.js";

test("demo includes an evaluator-facing narrative", () => {
  assert.ok(investorSightData.productNarrative.whatWeBuilt.length >= 80);
  assert.ok(investorSightData.productNarrative.whyValuable.length >= 80);
  assert.ok(investorSightData.productNarrative.howBuilt.length >= 80);
  assert.ok(investorSightData.productNarrative.aboveAndBeyond.length >= 4);
});

test("demo includes deeper system design roadmap", () => {
  const stages = investorSightData.systemDesign.map((stage) => stage.name);

  assert.deepEqual(stages, [
    "ingestion",
    "source trust",
    "event extraction",
    "scoring",
    "human review",
    "delivery",
    "observability",
  ]);

  for (const stage of investorSightData.systemDesign) {
    assert.ok(stage.now.length >= 30, `${stage.name} describes current prototype`);
    assert.ok(stage.next.length >= 30, `${stage.name} describes production evolution`);
    assert.ok(stage.risk.length >= 30, `${stage.name} describes design risk`);
  }
});
