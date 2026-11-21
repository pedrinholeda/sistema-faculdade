# AGENTS.md

Notes for AI agents and new contributors.

- Node.js 22+, CommonJS, Express 4, Handlebars views, Mongoose 9.
- `npm test` runs `node --test`; the e2e suite starts an in-memory MongoDB
  (mongodb-memory-server), so tests need no database.
- Settings come from the environment through `config/env.js`; never hardcode secrets.
  New variables go in `.env.example` and the README.
- Authorization lives in `helpers/eAdmin.js` and `helpers/eProfessor.js`, always based on
  `req.user`. Never keep per-user state in globals.
- Views receive Mongoose documents (prototype access is allowed in the engine config).
- Commits follow Conventional Commits, in English. A fix comes with a test that fails
  without it.
