# InvestorSight Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:test-driven-development or the local TDD workflow. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a source-backed browser prototype for the InvestorSight take-home assignment.

**Architecture:** A static HTML/CSS/TypeScript app loads curated source-backed data, computes rankings in a typed scoring module, and renders a dense analyst dashboard. A Node test suite validates source coverage, event schema, scoring outputs, TypeScript build artifacts, and final memo coverage.

**Tech Stack:** Strict TypeScript, Node built-in test runner, static HTML/CSS, no runtime dependencies.

---

### Task 1: Data Contract and Scoring Tests

**Files:**
- Create: `tests/scoring.test.mjs`
- Create: `tests/data-contract.test.mjs`
- Create: `src/scoring.ts`
- Create: `src/data.ts`
- Create: `src/types.ts`

- [x] Write failing tests for required company/event/source/memo coverage.
- [x] Run tests and confirm they fail because modules/data do not exist yet.
- [x] Implement minimal scoring and data to pass contract tests.
- [x] Re-run tests.

### Task 2: Prototype UI

**Files:**
- Create: `index.html`
- Create: `styles.css`
- Create: `src/app.ts`

- [x] Render ranking, event cards, source links, deep dives, and memos.
- [x] Add filtering by company and actionability tier.
- [x] Add visible score waterfalls for ranking and deep-dive auditability.
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
- Create: `tsconfig.json`

- [x] Run tests, data verifier, build, and static server smoke check.
- [x] Audit every assignment requirement against concrete evidence.

### Task 5: Public OSS Polish

**Files:**
- Create: `LICENSE`
- Create: `CONTRIBUTING.md`
- Create: `CHANGELOG.md`
- Create: `.github/workflows/ci.yml`

- [x] Add standalone OSS project surfaces.
- [x] Add CI for install, typecheck, test, verify, and build.
- [x] Add publication notes for keeping private parent-repo artifacts out of the public export.
