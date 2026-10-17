# ServeFlow API

Backend foundation for the ServeFlow restaurant operating system.

## Stack

- NestJS 11 and TypeScript
- PostgreSQL 16
- Prisma ORM 7 with the PostgreSQL driver adapter
- Redis 7 (reserved for jobs, idempotency and realtime fan-out)
- OpenAPI/Swagger

## Requirements

- Node.js 20.19 or newer on the Node 20 line
- npm 10+
- Docker Desktop, or your own PostgreSQL and Redis instances

## Local setup

```bash
copy .env.example .env
npm install
docker compose up -d postgres redis
npm run prisma:generate
npm run prisma:migrate:dev -- --name foundation
npm run start:dev
```

The API runs at `http://localhost:3000/api/v1`. Swagger is available at
`http://localhost:3000/docs` when `SWAGGER_ENABLED=true`.

## Useful commands

```bash
npm run build
npm run lint
npm test
npm run prisma:validate
npm run prisma:studio
```

## Health endpoints

- `GET /api/v1/health/live` — process liveness; does not require dependencies.
- `GET /api/v1/health/ready` — checks PostgreSQL and reports whether the API can serve traffic.

## Architecture rules

- Money is stored as integer minor units; never persist JavaScript floating-point totals.
- Every tenant record carries `organizationId`; operational records carry `branchId`.
- Tenant scope comes from authenticated server context, never directly from a request body.
- Financial records are reversed with new records/status transitions, not hard-deleted.
- Finalized order lines preserve price, discount and tax snapshots.
- Sensitive actions require permission checks, audit events and reason codes.

See [docs/PRODUCT_REQUIREMENTS.md](docs/PRODUCT_REQUIREMENTS.md),
[docs/ORDER_STATE_MACHINE.md](docs/ORDER_STATE_MACHINE.md), and
[docs/PERMISSIONS_MATRIX.md](docs/PERMISSIONS_MATRIX.md) before implementing domain endpoints.
