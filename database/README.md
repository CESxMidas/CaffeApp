# Database

PostgreSQL 16 is the **single source of truth** for CaffeApp POS data.

## Schema management

| Artifact          | Path                            |
| ----------------- | ------------------------------- |
| Prisma schema     | `apps/api/prisma/schema.prisma` |
| Migrations        | `apps/api/prisma/migrations/`   |
| Initial migration | `20260628032842_initial_schema` |
| Seed              | `apps/api/prisma/seed.ts`       |
| ERD documentation | `docs/api/ERD.md`               |

## Models (11)

`User`, `Staff`, `Branch`, `Table`, `ProductCategory`, `Product`, `Shift`, `Order`, `OrderItem`, `Payment`, `AuditLog`

## Enums (6)

`StaffRole`, `OrderType`, `OrderStatus`, `PaymentMethod`, `TableStatus`, `ShiftStatus`

## Business rules (enforced in NestJS)

| Rule                                         | Enforcement layer            |
| -------------------------------------------- | ---------------------------- |
| `DINE_IN` requires `tableId`                 | Orders service               |
| `TAKE_AWAY` must not have `tableId`          | Orders service               |
| Status flow: PENDING → MAKING → READY → PAID | Orders service               |
| Order changes logged                         | Audit service → `audit_logs` |

## Commands

```bash
# From repo root
npm run db:generate
npm run db:migrate
npm run db:seed

# Prisma Studio (from apps/api)
npm run db:studio --workspace=@caffeapp/api
```

Docker PostgreSQL: [infra/README.md](../infra/README.md)
