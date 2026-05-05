# 90-Second Evaluator Path

## 1. Run the Checks

```bash
npm test -- --test-reporter=dot
npm run verify:data
npm run build
```

Expected:

- 9 tests pass.
- Data verifier reports 10 companies, 54 sources, top `NCLH:92`.
- Static build imports required modules cleanly.

## 2. Open the Demo

```bash
python3 -m http.server 4317 --bind 127.0.0.1
```

Open `http://127.0.0.1:4317/`.

## 3. Review the Product Path

- Start with the top decision panel: `Norwegian Cruise Line Holdings (NCLH)` is most actionable.
- Scan the "What we built and why it matters" section for product framing.
- Inspect the ranking cards and score drivers.
- Open NCLH in the deep dive to inspect the highest-conviction case.
- Open Kellanova to inspect the "Why Not Now" edge case after the Mars close.
- Use `research/source-register.md` to audit source quality.
- Use `docs/system-design.md` to see how this becomes a production workflow.

## 4. What To Challenge

- Are the event types correctly classified?
- Are the scores directionally right, or should factor weights change?
- Are sources original enough, or should any mirror be replaced?
- Which events would change the ranking if updated tomorrow?
