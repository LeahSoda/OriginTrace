# OriginTrace

An upload-first research prototype for the “real footage, wrong context” problem: understanding how short videos may be reused with claims about a different date, event, place or identity. The current application extracts clues, retrieves related reporting and presents a source-linked **Life history of the footage** report; it does not yet verify visual reuse or original origin.

The application lives in [`video-context-engine/`](video-context-engine/), with a Vite frontend and Express backend managed as npm workspaces.

## Get started

See the [application README](video-context-engine/README.md) for prerequisites, configuration and usage.

```bash
cd video-context-engine
npm ci
cp .env.example .env
```

If `.env` already exists, edit it instead of overwriting it. Configure provider keys and search mode using the application README, then run:

```bash
npm run doctor -w backend
npm run dev
```

Open http://127.0.0.1:5173. Real analysis can incur provider charges; the recommended retrieval configuration uses Tavily with strict Meta spending controls. Hosted Meta search requires a separate best-effort billing opt-in.

## Documentation

- [Application guide, API, tests and troubleshooting](video-context-engine/README.md)
- [Product/research scope and implementation gaps](video-context-engine/docs/SCOPE.md)
- [Architecture and source-file responsibilities](video-context-engine/docs/ARCHITECTURE.md)
- [Budgets, providers, operator review and deployment](video-context-engine/docs/OPERATIONS.md)

## Project status

Research prototype, not a fact-check verdict or verified original-source detector. Related web coverage and reported edits are not cryptographically verified provenance. Review the application guide's limitations before use.

## Contributors and license

Maintained by the OriginTrace project contributors; see repository contribution history for attribution. Support and contribution guidance are in the application guide.

No project `LICENSE` file is currently included. A license has not yet been declared.
