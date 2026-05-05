# Contributing

InvestorSight is a small TypeScript prototype, so contributions should preserve the core contract: every ranking claim must be traceable to a dated public source and every score change must be testable.

## Local Checks

```bash
npm ci
npm run typecheck
npm test -- --test-reporter=dot
npm run verify:data
npm run build
```

## Data Changes

- Add or update source entries in `src/data.ts` before changing events or memos.
- Keep every event tied to a valid `sourceId`.
- Prefer original filings, company releases, activist materials, and primary transaction documents over mirrors.
- If a source is a reputable-news mirror, make that explicit in the source title or publisher.

## Scoring Changes

- Update `src/scoring.ts` and the relevant tests together.
- Keep `score.components` transparent; the UI depends on those factors for the score waterfall.
- Treat completed transactions, weak source quality, and macro-only stories as explicit uncertainty penalties.

## Pull Request Standard

- Explain what changed, why it matters, and how it was verified.
- Include the ranking impact if any company score changes.
- Do not include private assignment files, local browser profiles, API keys, or parent-repo metadata.
