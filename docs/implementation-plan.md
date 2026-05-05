# InvestorSight Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:test-driven-development or the local TDD workflow. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a source-backed browser prototype for the InvestorSight take-home assignment.

**Architecture:** A static HTML/CSS/JavaScript app loads curated JSON data, computes rankings in a small scoring module, and renders a dense analyst dashboard. A Node test suite validates source coverage, event schema, scoring outputs, and final memo coverage.

**Tech Stack:** Plain ESM JavaScript, Node built-in test runner, static HTML/CSS, no runtime dependencies.

---

### Task 1: Data Contract and Scoring Tests

**Files:**
- Create: `tests/scoring.test.mjs`
- Create: `tests/data-contract.test.mjs`
- Create: `src/scoring.mjs`
- Create: `data/investor-sight.json`

- [x] Write failing tests for required company/event/source/memo coverage.
- [x] Run tests and confirm they fail because modules/data do not exist yet.
- [x] Implement minimal scoring and data to pass contract tests.
- [x] Re-run tests.

### Task 2: Prototype UI

**Files:**
- Create: `index.html`
- Create: `styles.css`
- Create: `src/app.mjs`

- [x] Render ranking, event cards, source links, deep dives, and memos.
- [x] Add filtering by company and actionability tier.
- [x] Verify in a local browser server.

### Task 3: Source Register and README

**Files:**
- Create: `research/source-register.md`
- Create: `research/quick-notes.md`
- Create: `README.md`

- [x] Record source collection, relevance filtering, extraction, scoring, synthesis, and final-output workflow.
- [x] Document setup and tradeoffs.

### Task 4: Completion Audit

**Files:**
- Create: `scripts/verify-data.mjs`
- Create: `scripts/build.mjs`

- [x] Run tests, data verifier, build, and static server smoke check.
- [x] Audit every assignment requirement against concrete evidence.
