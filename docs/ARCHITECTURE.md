# CaffeApp — Enterprise Architecture

**Version:** 2.0.0-arch  
**Status:** Production foundation (Sprint 0.5 → Enterprise refactor)  
**Last updated:** 2026-06-29  
**Nghiệp vụ:** [STAKEHOLDER_QUESTIONNAIRE.md](STAKEHOLDER_QUESTIONNAIRE.md) · [PRD.md](PRD.md)

---

## 1. Principles

| #   | Principle                                                               |
| --- | ----------------------------------------------------------------------- |
| 1   | Mobile **never** accesses PostgreSQL directly                           |
| 2   | All business rules live in **NestJS API**                               |
| 3   | **PostgreSQL** is the single source of truth (Prisma ORM)               |
| 4   | **Shared package** (`@caffeapp/shared`) defines FE/BE boundary          |
| 5   | Mobile: **Zustand** = local UI state; **TanStack Query** = server state |
| 6   | API: **Controller → Service → Repository** (Prisma) per module          |
| 7   | Every order/payment mutation → **audit_logs** (Sprint 2+)               |

---

## 2. System Context

```
┌─────────────────┐     HTTPS/JSON      ┌─────────────────┐     Prisma     ┌──────────────┐
│  Expo Mobile    │ ──────────────────▶ │  NestJS API     │ ─────────────▶ │ PostgreSQL   │
│  (CASHIER/BARISTA/MANAGER UX) │   /api/v1/*         │  (domain modules)│              │              │
└────────┬────────┘                     └────────┬────────┘              └──────────────┘
         │                                       │
         └──────── @caffeapp/shared ◀─────────────┘
                    (enums, DTOs, contracts)
```

---

## 3. Monorepo Layout

```
CaffeApp/
├── apps/
│   ├── mobile/                 # Expo React Native
│   │   └── src/
│   │       ├── app/            # Expo Router (thin routes)
│   │       ├── features/       # Feature modules (auth, orders, …)
│   │       └── shared/         # UI kit, API client, stores, providers
│   └── api/                    # NestJS REST API
│       └── src/
│           ├── config/         # Validated environment
│           ├── common/         # Cross-cutting infra
│           └── modules/        # Domain bounded contexts
├── packages/
│   ├── shared/                 # Contracts, enums, theme
│   ├── tsconfig/               # Shared TS configs
│   └── eslint-config/          # Shared lint baseline
├── infra/                      # docker-compose (PostgreSQL)
├── database/                   # DB documentation
└── docs/
    ├── ARCHITECTURE.md         # This file
    ├── ARCHITECTURE_REVIEW.md  # Principal review
    └── adr/                    # Decision records
```

---

## 4. Mobile Architecture

| Layer            | Location                               | Responsibility                            |
| ---------------- | -------------------------------------- | ----------------------------------------- |
| **Routes**       | `src/app/`                             | Navigation shell only — no business logic |
| **Features**     | `src/features/{domain}/`               | Hooks, feature API, screen logic          |
| **Shared UI**    | `src/shared/components/ui/`            | Design system primitives                  |
| **API Client**   | `src/shared/lib/api/`                  | Axios services → NestJS                   |
| **Local State**  | `src/shared/stores/`                   | Zustand: session, cart                    |
| **Server State** | TanStack Query via `shared/providers/` | Cache, refetch                            |
| **Storage**      | `src/shared/lib/storage/`              | SecureStore adapters (Sprint 1)           |

---

## 5. API Architecture

| Layer       | Location                | Responsibility                               |
| ----------- | ----------------------- | -------------------------------------------- |
| **Config**  | `src/config/`           | Env validation, typed configuration          |
| **Common**  | `src/common/`           | Prisma, filters, interceptors, guards, audit |
| **Modules** | `src/modules/{domain}/` | Bounded context per domain                   |

### Module template (Sprint 1+)

```
modules/orders/
├── orders.module.ts
├── orders.controller.ts    # HTTP layer
├── orders.service.ts       # Business rules
├── orders.repository.ts    # Prisma access (optional)
└── dto/                    # class-validator DTOs
```

### API versioning

All endpoints: `/api/v1/*`

---

## 6. Database

- **ORM:** Prisma (`apps/api/prisma/schema.prisma`)
- **Migrations:** `apps/api/prisma/migrations/`
- **Local dev:** `infra/docker-compose.yml` or Neon PostgreSQL (cloud)

### Core entities

`users`, `staff`, `branches`, `tables`, `product_categories`, `products`, `orders`, `order_items`, `payments`, `shifts`, `audit_logs`

---

## 7. Security Model

| Concern          | Implementation                            |
| ---------------- | ----------------------------------------- |
| Auth             | JWT access + refresh (Sprint 1)           |
| RBAC             | `StaffRole` guards per route              |
| Tenant isolation | `branchId` scoped queries in services     |
| Token storage    | Expo SecureStore (mobile)                 |
| Input validation | class-validator DTOs (API)                |
| Error shape      | `ApiErrorDto` via global exception filter |
| CORS             | Configurable via `CORS_ORIGINS`           |
| Audit            | `audit_logs` on critical mutations        |

---

## 8. ADR Index

| ADR                                       | Title               | Status         |
| ----------------------------------------- | ------------------- | -------------- |
| [001](adr/001-react-native-expo.md)       | React Native + Expo | Accepted       |
| [004](adr/004-auth-rbac.md)               | Auth & RBAC         | **Superseded** |
| [005](adr/005-monorepo-structure.md)      | Monorepo            | Accepted       |
| [006](adr/006-fe-be-split-nestjs.md)      | FE/BE split         | Accepted       |
| [007](adr/007-enterprise-architecture.md) | Enterprise refactor | Accepted       |

---

## 9. Environments

| Env           | API            | Database                     |
| ------------- | -------------- | ---------------------------- |
| `development` | localhost:3000 | Docker PostgreSQL            |
| `staging`     | TBD            | Managed PostgreSQL           |
| `production`  | TBD            | Managed PostgreSQL + backups |
