# Production System Design

InvestorSight should evolve from a static analyst prototype into a monitored research workflow. The central product bet is that public activism signals become more valuable when they are normalized, scored, reviewed, and traced back to sources.

## Architecture

```text
public sources
  -> ingestion connectors
  -> source snapshot store
  -> event extractor
  -> human review queue
  -> scored company timeline
  -> IC memo generator
  -> dashboard, alerts, exports
```

## Core Components

### Ingestion

- SEC EDGAR filings: 8-K, 10-Q, 10-K, DEF 14A, SC 13D/G, merger filings.
- Company IR: earnings releases, investor presentations, strategy updates, board announcements.
- Reputable news: Reuters/AP/WSJ/Bloomberg summaries where public access allows.
- Activist materials: letters, presentations, campaign microsites, settlement agreements.
- Regulatory and transaction sources: FTC, EC, merger-close releases.

Production ingestion should preserve raw snapshots, original URLs, capture timestamps, publisher type, and document hashes.

### Source Trust

Every source should carry trust metadata:

- `publisher_class`: SEC, company, activist, regulator, wire, secondary mirror.
- `lineage`: original, company-hosted mirror, news mirror, analyst summary.
- `freshness`: event date, publication date, ingestion date.
- `bias`: company defense, activist campaign, neutral filing, regulator, news.

This prevents the system from treating activist claims, management responses, and audited filings as the same kind of evidence.

### Event Extraction

The extractor should propose structured events:

- type
- date
- company
- source
- short description
- evidence quote or source pointer
- importance
- confidence
- relevance reason

Human review should approve or reject proposed events before they affect ranking.

### Scoring

The current deterministic rubric should become a versioned scorecard:

- visible factor scores
- source-backed drivers
- source-backed penalties
- reviewer overrides with rationale
- score history over time
- stale-score detection

The system should not pretend the score is statistically precise. It should explain why a name deserves attention today.

### Human Review

Analysts need explicit workflow states:

- `new_event`
- `needs_source_check`
- `accepted_event`
- `score_change_pending`
- `memo_ready`
- `published`

This lets the product distinguish machine-suggested evidence from investment judgment.

### Delivery

The dashboard should support:

- ranked actionability board
- company timeline
- score-change diff
- event/source drilldown
- side-by-side company comparison
- exportable IC memo
- watchlist and alert subscriptions

### Observability and Evaluation

Track:

- ingestion latency
- broken source links
- extraction acceptance rate
- duplicate event rate
- stale company profiles
- reviewer disagreement
- score drift
- missed activist campaigns
- precision of top-ranked alerts

Evaluation should focus on whether the system helps analysts allocate diligence time, not just whether extraction fields are populated.

## Roadmap

1. Add source snapshotting and link-health checks.
2. Build a small event-review queue with accepted/rejected states.
3. Add score history and score-change explanations.
4. Add peer-relative metrics: TSR, margins, leverage, buybacks, governance.
5. Add memo export and watchlist alerts.
6. Backtest against prior activist campaigns to calibrate false positives and missed signals.

## Above-and-Beyond Product Ideas

- **Evidence ledger:** every claim should link to a source snapshot, quote or span, hash, publisher tier, and reviewer state.
- **Why-now delta:** show what changed since yesterday, last week, and last filing cycle instead of only showing the current score.
- **Contradiction view:** put activist claims, company responses, SEC filings, and neutral news side by side.
- **Proxy and campaign clock:** track annual meetings, nomination windows, settlement expiries, 13D amendments, and vote deadlines.
- **Why-not-now engine:** formalize disqualifiers such as acquired company, controlled company, stale catalyst, weak float, and macro-only thesis.
- **IC pack export:** generate a one-click memo with score waterfall, source appendix, open diligence questions, and reviewer sign-off.
- **Backtest harness:** prove whether the system would have surfaced historical activist setups before they became obvious consensus.
