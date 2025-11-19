# AI Assistant Instructions for `omisebiz-backend`

These notes are for AI coding agents working in this repository. Follow these project-specific patterns and workflows to stay aligned with how this backend is structured.

## Project overview

- **Stack**: Node.js + TypeScript, Express 5, Prisma, PostgreSQL.
- **Entry point**: `src/index.ts` sets up the Express app, CORS, JSON body parsing, and Prisma client.
- **Database access**: Done via `PrismaClient` from `@prisma/client`, configured by `prisma/schema.prisma` and `prisma.config.ts`.
- **Purpose**: HTTP API for the "Omisebiz" backend; currently exposes a basic health check and root endpoint.

## Architecture and patterns

- Keep **application startup** logic in `src/index.ts`:
  - Express app and middleware registration.
  - Creation of a single `PrismaClient` instance.
  - Route registration and `app.listen(...)`.
- When adding new functionality:
  - Prefer **Express routers** in new files under `src/` (e.g. `src/users.ts` or `src/routes/users.ts`), then mount them from `src/index.ts`.
  - Use the shared `PrismaClient` instance from the main file, or create a small `src/prisma.ts` helper that exports a singleton and reuse it across modules.
  - Keep route handlers **async** and wrap DB calls in `try/catch` blocks; return JSON error objects with appropriate HTTP status codes.
- Use **Prisma models** as the source of truth for data shape. Update `prisma/schema.prisma` first, then run migrations and regenerate the client before using new fields in TypeScript.

## Prisma and database workflows

- Schema definition lives in `prisma/schema.prisma` and is wired via `prisma.config.ts`.
- The `datasource db` uses `provider = "postgresql"` and `url = env("DATABASE_URL")`; ensure this environment variable is defined in `.env` for local work.
- The `User` model is currently defined with fields `id`, `email`, `password`, `createdAt`, and `updatedAt`.
- Typical DB workflow you should assume and follow when changing models:
  1. Edit `prisma/schema.prisma`.
  2. Run `prisma migrate dev` (or an equivalent npm script) to create/apply migrations.
  3. Run `prisma generate` if needed, then use the updated types via `PrismaClient` in `src/*.ts`.
- When adding new models or relations, reference the `User` model style (simple integer `@id @default(autoincrement())`, timestamps with `@default(now())` and `@updatedAt`).

## Runtime configuration

- Environment variables are loaded via `dotenv` using the shortcut import `import "dotenv/config";` at the top of `src/index.ts`.
- Required variables for typical work:
  - `DATABASE_URL` – PostgreSQL connection string used by Prisma.
  - `PORT` (optional) – overrides the default HTTP port `4000`.
- When adding new config knobs, read them from `process.env` in TypeScript and document them in comments near the usage site.

## HTTP API conventions

- Base server setup is in `src/index.ts`:
  - `app.use(cors());`
  - `app.use(express.json());`
  - Health endpoint: `GET /health` performs a simple DB query and returns `{ status, db, error? }`.
  - Root endpoint: `GET /` returns `{ message: "Omisebiz backend API" }`.
- When you create new endpoints:
  - Use JSON responses only; avoid sending HTML.
  - Be explicit with HTTP status codes (e.g. 201 for resource creation, 400 for validation errors, 401/403 for auth issues, 404 for not found, 500 for unexpected errors).
  - Return structured error shapes (e.g. `{ error: "message" }` or `{ error: { code, message } }`) rather than plain strings.

## Auth and security libraries

- `jsonwebtoken` and `bcryptjs` are installed but not yet wired up in `src/index.ts`.
- If you implement authentication:
  - Use `bcryptjs` to hash passwords before storing them on the `User` model.
  - Use `jsonwebtoken` to sign and verify tokens; keep secret keys in environment variables (e.g. `JWT_SECRET`).
  - Put auth helpers (hash/compare, sign/verify) in separate modules (e.g. `src/auth.ts`) instead of inlining in route handlers.

## Build, run, and dev workflows

- `package.json` scripts:
  - `npm run dev` – runs `ts-node-dev --respawn --transpile-only src/index.ts` for hot-reload TypeScript development.
  - `npm run build` – runs `tsc`, outputting compiled JS to `dist/` according to `tsconfig.json`.
  - `npm start` – runs the compiled server with `node dist/index.js`.
- There is currently no real test suite; `npm test` is a placeholder. If you add tests, ensure scripts and any chosen framework are configured in `package.json`.

## TypeScript and coding style

- Compiler is configured via `tsconfig.json` with `strict: true`, `target: "ES2020"`, and `module: "commonjs"`.
- Prefer ES module-style imports (as in `src/index.ts`) and keep new code TypeScript-first (`.ts` files under `src/`).
- Use the existing patterns in `src/index.ts` as references for import style, async/await usage, and basic logging.

## How to collaborate with humans

- Before making large refactors, summarize the impact (e.g. new routes, schema changes, breaking API changes) in your response.
- When you introduce new commands, scripts, or env vars, mention them explicitly so maintainers can update documentation or deployment configs.
- If you're unsure about a pattern that isn't yet established (e.g. auth, background jobs), propose 1–2 concrete options that fit this stack and ask for human preference.
