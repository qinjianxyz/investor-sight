# Public Repo Publication Notes

## Publication Strategy

The public repository should contain only this standalone InvestorSight project. It should not include any parent repository history, parent `.git`, private docs, worktree metadata, or other projects.

## Include

- `README.md`
- `EVALUATOR.md`
- `LICENSE`
- `CONTRIBUTING.md`
- `CHANGELOG.md`
- `index.html`
- `styles.css`
- `package.json`
- `package-lock.json`
- `src/`
- `scripts/`
- `tests/`
- `docs/`
- `research/`
- `.github/workflows/ci.yml`

## Exclude

- parent repo files
- worktree metadata
- `.claude/`
- `.codex/`
- `.gitnexus/`
- `node_modules/`
- local screenshots and `/tmp` artifacts
- API keys, cookies, tokens, browser profiles, or private assignment copies

## Verification Before Push

Run from the standalone export:

```bash
npm ci
npm run typecheck
npm test -- --test-reporter=dot
npm run verify:data
npm run build
npm run dev
```

Then verify the browser renders the top score, rankings, sources, and memos.

## Licensing

The standalone review repo uses the MIT license. Do not publish parent-repo files or private assignment materials with that license.
