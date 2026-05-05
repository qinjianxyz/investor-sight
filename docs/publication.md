# Public Repo Publication Notes

## Publication Strategy

The public repository should contain only this standalone InvestorSight project. It should not include any parent repository history, parent `.git`, private docs, worktree metadata, or other projects.

## Include

- `README.md`
- `index.html`
- `styles.css`
- `package.json`
- `data/`
- `src/`
- `scripts/`
- `tests/`
- `docs/`
- `research/`

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
npm test -- --test-reporter=dot
npm run verify:data
npm run build
python3 -m http.server 4317 --bind 127.0.0.1
```

Then verify the browser renders the top score, rankings, sources, and memos.

## Licensing

No license is included yet. The repository is public for review, but reuse rights should be selected deliberately before presenting it as open-source software.
