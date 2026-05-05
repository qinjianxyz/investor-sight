# Completion Audit

**Objective:** Build a prototype under `projects/oss` that answers which of the 10 assigned companies is most actionable now for shareholder activism or strategic pressure, using real public data, structured events, ranking judgment, deep dives, final memos, code, README, and notes.

## Prompt-to-Artifact Checklist

| Requirement | Evidence |
|---|---|
| Create project under `/projects/oss` | `../` |
| Use assignment PDF | Assignment requirements were extracted into `spec.md` |
| Use all 10 companies | `../src/data.ts` contains HON, NCLH, K, LOW, ALGM, ZIP, GIS, ASH, PSX, LW; tested in `../tests/data-contract.test.mjs` |
| Answer most actionable now | UI decision panel and ranking; NCLH ranked #1 with score 92 |
| Answer what changed recently | `events` and `whyNow.recentDevelopments` for every company |
| Answer why it matters | `whyNow.whyItMattersNow` for every company |
| Provide plausible activist / strategic-pressure thesis | `whyNow.thesis` for every company |
| Show evidence strength and uncertainties | event `importance` / `confidence`, `whyNow.confidence`, `whyNow.uncertainties`, score drivers and penalties |
| Real source collection | `../research/source-register.md`; 54 source entries counted by `../scripts/verify-data.mjs` |
| SEC filings | SEC sources for NCLH, PSX, HON, ASH, ZIP, K |
| Press releases / IR pages | Company IR sources for every company |
| Earnings materials | Earnings releases for NCLH, LW, PSX, HON, ALGM, ASH, ZIP, GIS, LOW, K |
| Reputable public news | Reuters/AP/Investing.com and Business Wire links in source register |
| Proxy statements where relevant | NCLH proxy mirror and PSX proxy/company letter included |
| Structured event extraction | Every event has `type`, `date`, `description`, `sourceId`, `importance`, `confidence`; tested |
| Ranking with judgment | `../src/scoring.ts`, `investorSightData.scoringLogic`, ranking cards in UI |
| Show scoring logic and drivers | README, UI ranking cards, score waterfalls, `score.components`, `score.drivers`, `score.penalties` |
| Deep dives for each company | UI detail cards and `whyNow` objects for each company |
| Final decision memo per company | `memo` object for each company, rendered in UI |
| Workflow separation | `investorSightData.workflow`, README workflow section, UI workflow section |
| Prototype deliverable | `../index.html`, `../styles.css`, `../src/app.ts`, compiled `../dist/` output |
| Code deliverable | Full project code under `../` |
| README setup instructions | `../README.md` |
| Evaluator review path | `../EVALUATOR.md` |
| Quick notes / tradeoffs | `../research/quick-notes.md` |
| Explain what was built and why valuable | README, `productNarrative` in `../src/data.ts`, and UI brief section |
| Explain how it was built | README, `implementation-plan.md`, `../research/quick-notes.md`, and UI brief section |
| Explain how to improve demo | README improvement section and `system-design.md` roadmap |
| Go deeper in system design | `system-design.md` and UI system-design section |
| Public repo safety | `publication.md`; exported as standalone project rather than parent repo |
| TypeScript implementation | `../tsconfig.json`, `../src/*.ts`, `npm run typecheck`, and `../tests/tech-stack.test.mjs` |
| OSS-style repo polish | `../LICENSE`, `../CONTRIBUTING.md`, `../CHANGELOG.md`, `../package-lock.json`, and `../.github/workflows/ci.yml` |
| Spec-driven development | `spec.md` and `implementation-plan.md` |
| Test-driven development | Red test failed on missing data/scoring modules; final tests pass |
| Full agent harness | Five read-only subagents researched/reviewed company groups and scoring/audit rubric |

## Verification Commands

```bash
npm test -- --test-reporter=dot
npm run typecheck
npm run verify:data
npm run build
```

Expected current proof:

- 12 tests pass, 0 fail.
- TypeScript typecheck passes.
- Data verifier reports 10 companies, 54 sources, top=NCLH:92.
- TypeScript build reports 5 dist files present and modules import cleanly.
