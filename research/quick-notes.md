# Quick Notes: Approach and Tradeoffs

## Approach

I treated the assignment as a small research operating system:

1. Define the required universe and output contract in `../docs/spec.md`.
2. Write tests for the data contract and ranking behavior before production code.
3. Collect public sources across SEC filings, company IR, earnings releases, activist materials, transaction releases, and reputable news.
4. Filter events to those that change current actionability: activist filings, proxy fights, board changes, management changes, guidance cuts, margin pressure, portfolio actions, capital allocation, strategic offers, and completed transactions.
5. Extract events into a single structured data module.
6. Score companies with a transparent rubric and render the same tested data in the browser.
7. Audit the final artifact against every requirement.

## Why NCLH Is #1

NCLH has the cleanest "now" setup: CEO change, Elliott's greater-than-10% economic interest, board-refresh cooperation agreement, Q1 2026 guide-down, cost actions, high debt, and an active annual-meeting window. It answers all five objective questions with the least inference.

## Why Kellanova Is Last

Kellanova is deliberately ranked last because Mars completed the acquisition in December 2025. The right answer is "Why Not Now": any current pressure is private-company integration or antitrust precedent, not public-company shareholder activism.

## Biggest Judgment Calls

- Ashland moved above Allegro after confirming Standard Investments' 13D, because that converted Ashland from "generic underperformer" to "visible holder plus fresh guidance pressure."
- Allegro remains a strategic-alternatives watchlist name because onsemi's bid proved buyer interest, but the bid was withdrawn and the board has a standalone-growth defense.
- ZipRecruiter has real operating pressure, but founder voting control sharply reduces ordinary activism actionability.
- Lowe's has a large Pro M&A/integration thesis, but housing macro and scale make it a weaker activism target.

## Tradeoffs

- Manual curation beats scraping for this prototype because source credibility and judgment matter more than ingestion volume.
- I used static data so the reviewer can inspect the reasoning without private service access.
- I favored recent 2026 catalysts where available, even when a 2025 event started the pressure cycle.
- Scores are intentionally transparent and test-pinned, not presented as statistical truth.

## Above and Beyond

- The app now explains what was built, why it is valuable, and how it was built inside the product experience.
- The source register and completion audit make the work inspectable without trusting the author.
- The system-design roadmap shows how to turn the prototype into a durable ingestion, review, scoring, and alerting workflow.
- Publication notes define how to push a clean public repo without leaking private parent-repo context.
