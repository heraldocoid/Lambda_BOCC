# Lambda_BOCC — Hexagonal POC

This repository is a small Proof of Concept implementing Hexagonal Architecture
in Node.js / TypeScript for AWS Lambda.

Quick start

1. Install dependencies

```bash
npm ci
```

2. Run tests

```bash
npm test
```

3. Build (compile TypeScript)

```bash
npm run build
```

Deployment notes

- The project compiles TypeScript into `dist/` via `tsc`.
- For AWS Lambda, deploy the compiled JS from `dist/` and ensure environment
  variables for Postgres are set (`DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`, `DB_PORT`).
- The Postgres adapter reuses a global `Pool` to avoid connection exhaustion
  across Lambda warm starts.

Testing

- Tests are unit-level and mock repository adapters. They validate behavior,
  not implementation details.

Code organization

- `src/domain` — domain entities (pure, no external deps)
- `src/application/use-cases` — business logic (pure functions/classes)
- `src/adapters/postgres` — Postgres adapters (outer layer)
- `src/interfaces/http` — Lambda handler (thin transport layer)

