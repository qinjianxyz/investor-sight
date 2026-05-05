# InvestorSight Why Now Prototype

Static prototype for the take-home assignment: rank 10 companies by current actionability for shareholder activism or strategic pressure using public, source-backed events.

**As-of date:** 2026-05-05

## 90-Second Review

```bash
npm ci
npm run typecheck
npm test -- --test-reporter=dot
npm run verify:data
npm run demo:smoke
npm run build
npm run dev
```

Open `http://127.0.0.1:4317/`, start with Mission Control, inspect NCLH as the top case, review the scenario lab and evidence ledger, inspect Kellanova as the "Why Not Now" edge case, then audit sources in `research/source-register.md`.

See [EVALUATOR.md](EVALUATOR.md) for the full reviewer path.

## What This Is

InvestorSight is a small analyst workflow for answering one expensive question quickly: which public-company situations deserve attention now? It converts public evidence into structured events, ranks the 10 assigned names, and produces a mission-control queue, scenario views, evidence ledger, catalyst timeline, and concise "Why Now" or "Why Not Now" view for each company.

The prototype is valuable because it does not stop at collection. It separates source gathering, relevance filtering, event extraction, scoring, synthesis, and final memos, so a reviewer can challenge both the facts and the judgment.

## Quick Start

```bash
cd investor-sight
npm ci
npm run typecheck
npm test
npm run verify:data
npm run demo:smoke
npm run build
npm run dev
```

Open `http://localhost:4317/`. `npm run dev` builds TypeScript into `dist/` and serves the compiled static app.

To serve an already-built artifact directly:

```bash
python3 -m http.server 4317 -d dist
```

Then open `http://localhost:4317/`.

## Current Ranking

1. NCLH - 92 - Immediate
2. LW - 87 - Immediate
3. PSX - 83 - High
4. HON - 76 - High
5. ASH - 74 - High
6. ALGM - 64 - Watchlist
7. GIS - 50 - Watchlist
8. LOW - 43 - Low
9. ZIP - 40 - Low
10. K - 18 - Why Not Now

## Workflow

The prototype explicitly separates:

- Source collection: `research/source-register.md` and the `sources` arrays in `src/data.ts`.
- Relevance filtering: event inclusion rules in `docs/spec.md` and `research/quick-notes.md`.
- Event extraction: normalized `events` objects with `type`, `date`, `description`, `sourceId`, `importance`, and `confidence`.
- Scoring / ranking: strict TypeScript in `src/scoring.ts`, tested by `tests/scoring.test.mjs`.
- Analyst workflow modeling: `src/analysis.ts` builds the mission queue, scenario lab, source-trust report, catalyst timeline, and demo-readiness report.
- Synthesis: `whyNow` sections in `src/data.ts`.
- Final output: `index.html`, `src/app.ts`, and IC-style `memo` sections in the data.

## How It Was Built

- Spec-driven: the assignment PDF became `docs/spec.md` and `docs/implementation-plan.md`.
- Test-driven: contract tests were written before the data/scoring modules and later extended for the TypeScript build and explainer/system-design layer.
- Typed: the browser app, dataset contract, scoring model, and score components are all expressed in `src/*.ts` and checked by `tsc --noEmit`.
- Research-driven: parallel research lanes collected SEC filings, IR releases, earnings materials, activist letters, proxy materials, transaction releases, and reputable public news.
- Product-driven: the app opens with an analyst cockpit instead of a report, then exposes score waterfalls, scenario views, source trust, fresh catalysts, and reliability checks.
- Reliability-driven: `npm run demo:smoke` verifies compiled views, top ranking, source coverage, readiness score, timeline shape, and a stable ranking hash.
- Audit-driven: `docs/completion-audit.md` maps each assignment requirement to concrete evidence.

## Scoring Logic

The score is a 0-100 judgmental rubric:

- Activist/shareholder pressure
- Catalyst recency and immediacy
- Severity of value gap or operating issue
- Thesis clarity and value lever
- Evidence quality
- Uncertainty penalty for macro-only stories, completed deals, weak governance access, or cyclical noise

Tests pin the expected ranking and edge cases: NCLH as the highest-actionability active campaign and Kellanova as the lowest because Mars completed the acquisition and public-company activism is no longer the right frame.

## Tradeoffs

- Manual source curation was chosen over live scraping because the assignment rewards auditable judgment and source traceability.
- The app is static and dependency-free so it can be reviewed without private keys or market-data subscriptions.
- Some reputable-news links are mirrors where the original wire article may require subscription access.
- This is not investment advice. It is a prototype for organizing public evidence and surfacing diligence questions.

## How To Improve It

- Add source snapshotting so every source is preserved even if a link changes.
- Add source snapshots and quote spans so the source-trust ledger can preserve exact evidence even if links change.
- Add a review queue for proposed events and score changes.
- Add score history so "what changed recently" becomes a diff, not just a static ranking.
- Add peer-relative metrics: TSR, margin, leverage, buybacks, valuation, governance, and board composition.
- Add exportable IC memos and alert subscriptions for newly actionable names.
- Add reviewer state, claim polarity, and memo-bullet-to-source traceability.
- Add a proxy/campaign clock for nomination windows, settlement expiries, annual meetings, and 13D amendments.

## Deeper System Design

See [docs/system-design.md](docs/system-design.md). The intended production architecture is:

```text
public sources -> source snapshots -> event extraction -> human review -> score history -> dashboard / alerts / memo export
```

The key system-design principle is evidence before synthesis. Every score change should be traceable to a dated event, a source, and a reviewer-visible confidence level.

## Files

- `src/data.ts`: typed source-backed company facts, events, synthesis, and memos.
- `src/scoring.ts`: typed ranking logic and score components.
- `src/analysis.ts`: typed analyst queue, scenario, timeline, source-trust, and demo-readiness view models.
- `src/app.ts`: browser rendering, filters, cockpit, and score-waterfall UI.
- `src/types.ts`: explicit project data contracts.
- `tests/*.test.mjs`: schema, coverage, and scoring tests.
- `scripts/verify-data.mjs`: data integrity verifier.
- `scripts/demo-smoke.mjs`: deterministic compiled-demo readiness smoke test.
- `scripts/build.mjs`: TypeScript build and static artifact verifier.
- `docs/spec.md`: implementation spec.
- `docs/completion-audit.md`: requirement-to-evidence audit.
- `docs/system-design.md`: production architecture and roadmap.
- `docs/publication.md`: safe standalone public-repo export notes.
- `research/source-register.md`: source collection register.
- `research/quick-notes.md`: approach and tradeoff notes.

## GitHub

This repo is structured as a standalone public project. It includes MIT licensing, GitHub Actions CI, a contributor guide, a lockfile, and publication notes that keep parent-repo/private artifacts out of the public export.
