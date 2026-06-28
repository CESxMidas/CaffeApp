# CaffeApp — Principal Architecture Review

**Reviewer role:** Principal Software Architect  
**Date:** 2026-06-27  
**Scope:** Pre-coding enterprise readiness (no features added)

---

## Executive Summary

| Dimension        | Before             | After refactor                    | Target (Sprint 1+)       |
| ---------------- | ------------------ | --------------------------------- | ------------------------ |
| Overall          | C+ scaffold        | **B** foundation                  | A- production            |
| Folder structure | Flat, mixed        | **Layered**                       | Feature-complete modules |
| Monorepo         | Basic workspaces   | **+ tooling packages**            | Turborepo optional       |
| Mobile arch      | Services unused    | **Feature/shared split**          | Wire TanStack Query      |
| API arch         | Empty modules      | **Enterprise skeleton**           | Vertical slices          |
| PostgreSQL       | Schema only        | **+ docker infra**                | Committed migrations     |
| Security         | Installed, unwired | **Env validation, CORS, filters** | JWT + guards             |

---

## 1. Folder Structure

### Before

- Mobile: `components/`, `services/` at `src/` root — no feature boundaries
- API: domain modules at `src/` root alongside `common/`
- Compiled `.js` files committed alongside `.tsx` in mobile `src/`

### After

```
apps/mobile/src/
  app/           → thin routes (Expo Router)
  features/      → domain modules (auth, cashier, barista, manager, orders)
  shared/        → cross-cutting: UI, API client, stores, providers, config

apps/api/src/
  config/        → validated environment
  common/        → prisma, health, filters, interceptors, guards, audit
  modules/       → bounded contexts (auth, orders, …)
```

**Verdict:** ✅ Enterprise-ready layout. Routes stay thin; domain logic has a home.

---

## 2. Monorepo

### Assessment

- **npm workspaces** — appropriate for team size; avoids Nx/Turborepo complexity early
- Added `@caffeapp/tsconfig`, `@caffeapp/eslint-config` for shared tooling
- Root `tsconfig.json` uses project references (`shared` + `api`); mobile keeps Expo config

### Gaps (Sprint 1+)

- Turborepo for cached builds when CI time grows
- Shared ESLint rules rollout to all packages

**Verdict:** ✅ Sufficient for 5-year growth at current scale.

---

## 3. React Native Architecture

### Strengths

- Expo Router with role-based groups `(auth)`, `(cashier)`, `(barista)`, `(manager)`
- Correct state split design: Zustand (local) + TanStack Query (server)
- Axios service layer isolated in `shared/lib/api/`

### Refactored

- UI kit → `shared/components/ui/`
- API config → `shared/config/api.config.ts`
- Feature folders created for domain isolation

### Remaining (no code in this sprint)

- Screens still use mock data (intentional — Sprint 1)
- SecureStore not wired
- Query hooks not created

**Verdict:** ✅ Architecture correct; implementation deferred to Sprint 1.

---

## 4. NestJS Architecture

### Refactored

- Domain modules under `src/modules/`
- `config/` with `configuration.ts` + `env.validation.ts` (class-validator)
- `AllExceptionsFilter` → standardized `ApiErrorDto`
- `RequestLoggingInterceptor` for observability baseline
- `@Public()` decorator for future auth guard
- `AuditModule` shell for order mutation logging
- API versioning: `/api/v1`

### Module template (mandatory going forward)

```
Controller → Service → Repository (Prisma)
```

**Verdict:** ✅ Enterprise skeleton in place. No business logic added.

---

## 5. PostgreSQL Architecture

### Schema (Prisma)

11 models aligned with POS domain. Money as `Int` (VND — document convention).

### Refactored

- `infra/docker-compose.yml` — reproducible local PostgreSQL
- `docs/legacy/` — Supabase SQL marked reference-only

### Gaps

- ~~No committed Prisma migration yet~~ ✅ Migration `20260628032842_initial_schema` committed
- Seed is minimal (1 branch) — staff/menu seed Sprint 1+

**Verdict:** ✅ Schema + initial migration ready; Sprint 1 implements auth + expanded seed.

---

## 6. Package Structure

### `@caffeapp/shared`

| Path                             | Purpose                                     |
| -------------------------------- | ------------------------------------------- |
| `contracts/`                     | **Canonical** FE/BE boundary (enums + DTOs) |
| `domain/`                        | Session/role mapping types                  |
| `types/`                         | Deprecated re-exports (migration path)      |
| `enums/`, `constants/`, `theme/` | Unchanged                                   |

### New packages

- `@caffeapp/tsconfig` — shared compiler options
- `@caffeapp/eslint-config` — lint baseline

**Verdict:** ✅ Single contract source; legacy types marked deprecated.

---

## 7. Naming Conventions

| Area          | Convention                                | Status |
| ------------- | ----------------------------------------- | ------ |
| API JSON      | camelCase DTOs                            | ✅     |
| DB columns    | snake_case via Prisma `@map`              | ✅     |
| Enums         | SCREAMING_SNAKE (`TAKE_AWAY`, `MAKING`)   | ✅     |
| API routes    | kebab-case resources `/api/v1/orders`     | ✅     |
| Mobile routes | Expo Router groups                        | ✅     |
| Files         | kebab-case configs, PascalCase components | ✅     |

**Verdict:** ✅ Standardized. Retire `menu_items` / `TAKEAWAY` from legacy docs.

---

## 8. State Management

| State type    | Tool           | Location                                 |
| ------------- | -------------- | ---------------------------------------- |
| Auth session  | Zustand        | `shared/stores/session.ts`               |
| Cart (future) | Zustand        | `shared/stores/cart.ts` (Sprint 2)       |
| Server data   | TanStack Query | `shared/providers/` + `features/*/hooks` |

**Rule:** Never store server-fetched lists in Zustand.

**Verdict:** ✅ Correct pattern documented and structured.

---

## 9. Service Layer

### Mobile

`shared/lib/api/` — Axios only, no direct DB. Endpoints aligned to `/api/v1`.

### API

Services not implemented (intentional). Repository pattern documented in ARCHITECTURE.md.

**Verdict:** ✅ Mobile service layer complete as stubs; API services Sprint 1.

---

## 10. Folder Responsibilities

| Folder                       | Owns                   | Must NOT own           |
| ---------------------------- | ---------------------- | ---------------------- |
| `mobile/src/app/`            | Routing, layout        | Business rules         |
| `mobile/src/features/`       | Domain hooks/logic     | Generic UI             |
| `mobile/src/shared/`         | Reusable infra         | Feature-specific flows |
| `api/src/modules/`           | Domain HTTP + rules    | Cross-cutting concerns |
| `api/src/common/`            | Infra (prisma, guards) | Business rules         |
| `packages/shared/contracts/` | API shapes             | UI theme               |

**Verdict:** ✅ Enforced by structure + ADR-007.

---

## 11. Scalability (5-year horizon)

| Concern          | Path                                                        |
| ---------------- | ----------------------------------------------------------- |
| Multi-branch     | `branchId` on all tenant tables + service-layer scoping     |
| Multi-device     | Stateless JWT API                                           |
| Realtime barista | NestJS WebSocket Gateway or SSE (replace Supabase Realtime) |
| Read scaling     | Prisma read replicas (post-pilot)                           |
| Mobile OTA       | Expo EAS Updates                                            |
| API scaling      | Horizontal pods behind load balancer                        |

**Verdict:** ✅ Foundation supports growth; realtime strategy needs ADR-003 revision in Sprint 4.

---

## 12. Maintainability

### Improved

- Documentation aligned (`ARCHITECTURE.md` rewritten)
- Superseded ADRs marked
- Removed 37 compiled `.js` artifacts from mobile `src/`
- `.gitignore` prevents recurrence
- CI: lint no longer ignored; API build job added

**Verdict:** ✅ Significantly improved.

---

## 13. Clean Architecture

| Layer          | Mobile                        | API                      |
| -------------- | ----------------------------- | ------------------------ |
| Presentation   | `app/` routes                 | Controllers (Sprint 1)   |
| Application    | `features/`                   | Services (Sprint 1)      |
| Domain         | `@caffeapp/shared/contracts`  | Services + Prisma models |
| Infrastructure | `shared/lib/api`, SecureStore | Prisma, config           |

**Verdict:** ✅ Layers defined. Dependency rule: outer → inner only.

---

## 14. Security

| Control          | Status                                       |
| ---------------- | -------------------------------------------- |
| Env validation   | ✅ `validateEnv` on boot                     |
| CORS             | ✅ Configurable origins (not `origin: true`) |
| Error leakage    | ✅ Global filter, no stack in response       |
| JWT              | ⏳ Sprint 1                                  |
| RBAC guards      | ⏳ Sprint 1 (`common/guards/`)               |
| Branch isolation | ⏳ Sprint 1 (service layer)                  |
| Audit trail      | ⏳ Sprint 2 (`audit_logs`)                   |
| Rate limiting    | ⏳ Post-MVP                                  |
| Helmet           | ⏳ Sprint 1                                  |

**Verdict:** ✅ Infrastructure security improved; auth deferred intentionally.

---

## 15. Refactor Actions Completed

- [x] Mobile → `features/` + `shared/` structure
- [x] API → `config/`, `common/`, `modules/`
- [x] Shared → `contracts/` canonical boundary
- [x] API versioning `/api/v1`
- [x] Env validation + CORS + exception filter + logging interceptor
- [x] `infra/docker-compose.yml`
- [x] Tooling packages (`tsconfig`, `eslint-config`)
- [x] Documentation + ADR-007
- [x] Remove compiled JS artifacts
- [x] CI hardening

### Not in scope (Sprint 1+)

- Auth implementation
- TanStack Query hooks
- Feature business logic
- UI changes

---

## Sign-off

Architecture is **approved for Sprint 1 development** with the condition that the first vertical slice (auth) follows the documented module template and uses `@caffeapp/shared/contracts` exclusively for API types.
