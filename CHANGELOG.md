# Changelog

## 0.3.0 - 2026-05-05

- Added Analyst Mission Control for act-now, monitor, diligence, and exclude workflows.
- Added Scenario Lab, Evidence Ledger, Change Timeline, and Demo Reliability console.
- Added `src/analysis.ts` view-model/domain layer for analyst queue, scenario views, source trust, timeline, readiness, and ranking hash.
- Added deterministic `npm run demo:smoke` and wired it into GitHub Actions CI.
- Extended tests to cover cockpit product surfaces and demo reliability.

## 0.2.0 - 2026-05-05

- Converted the prototype from plain ESM JavaScript to strict TypeScript.
- Added a real `tsc` build that emits browser-ready files under `dist/`.
- Added score-component waterfalls to make ranking factors visible in the product UI.
- Added standalone OSS surfaces: MIT license, contributor guide, lockfile, and GitHub Actions CI.

## 0.1.0 - 2026-05-05

- Added the source-backed InvestorSight why-now prototype.
- Covered 10 assigned companies with structured events, source links, ranking logic, and decision memos.
- Added evaluator documentation, system-design roadmap, and data/scoring tests.
