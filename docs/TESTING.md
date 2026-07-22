# Testing Strategy — CaffeApp

**Test plan + current implementation.** Phần lớn tài liệu là kế hoạch; mục
[§0 Trạng thái hiện tại](#0-trạng-thái-hiện-tại-thực-tế) mô tả những gì đã chạy thật.

Stack: Jest (NestJS) · future Detox/Maestro (mobile E2E)

---

## 0. Trạng thái hiện tại (thực tế)

| Lớp                           | Có thật? | Vị trí                                            | Database              |
| ----------------------------- | -------- | ------------------------------------------------- | --------------------- |
| API characterization (in-mem) | ✅       | `apps/api/src/app.characterization.spec.ts`       | InMemoryPrisma (fake) |
| API integration (real DB)     | ✅       | `apps/api/test/integration/*.integration.spec.ts` | PostgreSQL thật       |
| Shared unit                   | ✅       | `packages/shared/test/*.test.mjs`                 | —                     |
| Mobile unit/hooks             | ❌ gap   | script `test` vẫn là placeholder `echo`           | —                     |

> **Characterization ≠ integration.** `app.characterization.spec.ts` khởi động Nest
> app thật nhưng **override PrismaService bằng fake in-memory** — nhanh, không cần DB,
> nhưng **không** kiểm chứng migration/constraint/transaction thật. Việc đó thuộc về
> integration suite dùng PostgreSQL thật.

### Cách chạy local

```bash
# Unit / characterization + shared (không cần DB)
npm test

# Integration thật — cần PostgreSQL test database
#   1. Tạo DB test (tên phải chứa "test"):
#        createdb caffeapp_test   # hoặc dùng infra/docker-compose.yml
#   2. Apply migrations vào DB test:
TEST_DATABASE_URL=postgresql://postgres:postgres@localhost:5432/caffeapp_test?schema=public \
  npm run db:migrate:deploy --workspace=@caffeapp/api
#   3. Chạy integration suite:
TEST_DATABASE_URL=postgresql://postgres:postgres@localhost:5432/caffeapp_test?schema=public \
  npm run test:integration
```

### Database safety rules (integration)

- Bắt buộc `TEST_DATABASE_URL`; **không** fallback âm thầm sang `DATABASE_URL`.
- Tên database **phải chứa "test"** — guard từ chối nếu không.
- Từ chối chạy khi `NODE_ENV=production`.
- **Không** log full connection string (có credential).
- Cleanup có phạm vi xác định (chỉ xoá data test namespaced), không phụ thuộc seed.

---

## 1. Test pyramid

```
        ┌─────────┐
        │  E2E    │  Manual + automated (few, critical paths)
        ├─────────┤
        │ Integr. │  API + DB (NestJS + Prisma test DB)
        ├─────────┤
        │  Unit   │  Services, hooks, utils (many, fast)
        └─────────┘
```

---

## 2. Test types

### Unit tests

| Target       | Tool        | Location (planned)                               |
| ------------ | ----------- | ------------------------------------------------ |
| API services | Jest        | `apps/api/src/**/*.spec.ts`                      |
| Shared utils | Jest/Vitest | `packages/shared/**/*.spec.ts`                   |
| Mobile hooks | Jest + RTL  | `apps/mobile/src/**/*.test.ts`                   |
| Use-cases    | Jest        | `apps/mobile/src/features/*/use-cases/*.test.ts` |

**When:** Sprint 1+ — auth service, session store, DTO mappers

**Command (planned):**

```bash
npm run test --workspace=@caffeapp/api
npm run test --workspace=@caffeapp/mobile
```

### Integration tests

| Target           | Scope                                     |
| ---------------- | ----------------------------------------- |
| Auth flow        | `POST /auth/login` → JWT → `GET /auth/me` |
| Orders           | Create order → update status → payment    |
| Branch isolation | User A cannot read Branch B data          |

**Setup:**

- Test PostgreSQL (Docker) hoặc ephemeral DB
- `prisma migrate deploy` trước test suite
- NestJS `TestingModule` + supertest

**When:** Sprint 1 (auth), Sprint 2 (orders)

### E2E tests

| Target       | Tool options                   |
| ------------ | ------------------------------ |
| Mobile flows | Maestro / Detox                |
| API smoke    | supertest / Postman collection |

**Critical paths:**

1. Login → (Owner: branch) → khu vận hành / dashboard
2. Create order → send kitchen → barista queue (polling Sprint 2)
3. READY → Đã giao → payment TM/CK → order PAID
4. UAT: 15 kịch bản (H-09) — gộp bàn, hủy đơn, kết ca

**When:** Sprint 2–4

### Manual tests

| When             | Who                   |
| ---------------- | --------------------- |
| Every PR with UI | Developer             |
| Sprint review    | QA + PO               |
| UAT              | Pilot quán (Sprint 6) |

Checklist: User Story **Given/When/Then** in [USER_STORIES.md](USER_STORIES.md)

### Smoke tests

Chạy sau mỗi deploy:

```bash
curl -f http://<api-host>/api/v1/health
# Expected: { "status": "ok", "service": "caffeapp-api" }
```

Sprint 1+: thêm smoke login với test account.

### Regression tests

| Trigger     | Scope                   |
| ----------- | ----------------------- |
| Pre-release | Full sprint test suite  |
| Hotfix      | Affected module + smoke |

Automated regression: CI chạy unit + integration trên mỗi PR.

---

## 3. Coverage targets (goals)

| Layer                   | Target     | Sprint   |
| ----------------------- | ---------- | -------- |
| API services (critical) | ≥ 80%      | Sprint 2 |
| Shared contracts/utils  | ≥ 70%      | Sprint 1 |
| Mobile hooks            | ≥ 60%      | Sprint 2 |
| E2E critical paths      | 100% paths | Sprint 4 |

Hiện tại: API có characterization suite + integration suite (real PostgreSQL) và
shared unit tests đang chạy; **mobile vẫn 0%** (script `test` là placeholder). Coverage
số hoá formal chưa được đo — xem [§0](#0-trạng-thái-hiện-tại-thực-tế).

---

## 4. Test data

| Source                     | Use                         |
| -------------------------- | --------------------------- |
| `prisma/seed.ts`           | Dev + integration baseline  |
| Factory helpers (planned)  | `test/factories/` Sprint 1+ |
| Không dùng production data | Ever                        |

Test accounts (planned Sprint 1 seed):

| Email               | Role    | Password      |
| ------------------- | ------- | ------------- |
| `cashier@caffe.app` | CASHIER | `password123` |
| `barista@caffe.app` | BARISTA | `password123` |
| `manager@caffe.app` | MANAGER | `password123` |
| `owner@caffe.app`   | OWNER   | `password123` |

---

## 5. CI integration (target)

Current CI (`.github/workflows/ci.yml`):

| Job                | Chạy gì                                                                  |
| ------------------ | ------------------------------------------------------------------------ |
| `typecheck`        | `npm run typecheck`                                                      |
| `lint`             | `npm run lint`                                                           |
| `format`           | `npm run format:check`                                                   |
| `api-build`        | `npm run api:build`                                                      |
| `mobile-typecheck` | `npm run typecheck --workspace=@caffeapp/mobile`                         |
| `test-unit`        | `npm test` (API characterization + shared; **mobile placeholder**)       |
| `test-integration` | PostgreSQL 16 service → `db:migrate:deploy` → `npm run test:integration` |

Mobile chưa có test tự động → chưa có job test cho mobile.

---

## 6. Definition of Done — testing

Story **Done** khi:

- [ ] Happy path tested (manual hoặc automated)
- [ ] ≥ 1 edge case verified
- [ ] Không regression trên flows liên quan
- [ ] API integration test (nếu story có backend)

Xem [DOR_CHECKLIST.md](DOR_CHECKLIST.md) DoD section.

---

## Related

- [USER_STORIES.md](USER_STORIES.md)
- [API_CONTRACT.md](api/API_CONTRACT.md)
- [RELEASE.md](RELEASE.md)
- [CONTRIBUTING.md](../CONTRIBUTING.md)
