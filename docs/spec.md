# InvestorSight Why Now Prototype Spec

**As of:** 2026-05-05

## Objective

Build a browser prototype that ranks the 10 assigned companies by current actionability for shareholder activism or strategic pressure, using public source-backed events and clear investment-committee style synthesis.

## Company Universe

- Honeywell
- Norwegian Cruise Line Holdings
- Kellanova
- Lowe's
- Allegro MicroSystems
- ZipRecruiter
- General Mills
- Ashland
- Phillips 66
- Lamb Weston

## Workflow Separation

1. Source collection: maintain a source register with SEC filings, company IR, earnings materials, and reputable news.
2. Relevance filtering: tag only events that affect governance pressure, strategic alternatives, portfolio shape, margin trajectory, capital allocation, management, or relative performance.
3. Event extraction: represent each event with type, date, description, source, importance, and confidence.
4. Scoring and ranking: calculate a transparent score from pressure, recency, severity, thesis clarity, evidence quality, and counterargument penalties.
5. Synthesis: create a Why Now or Why Not Now view for each company.
6. Final output: show ranking, drivers, company deep dives, event table, and short decision memos.

## Prototype Requirements

- Static browser app under `projects/oss/investor-sight`.
- No backend or private data dependency.
- Public source URLs are visible in the UI.
- All 10 companies have events, ranking drivers, confidence, uncertainty, and a decision memo.
- Tests verify schema completeness, source coverage, ranking determinism, and known edge cases.

## Tradeoffs

- This is a research prototype, not financial advice or a live-data product.
- Source collection is manually curated for auditability instead of scraped at runtime.
- The ranking is judgmental but encoded in inspectable scoring logic.
