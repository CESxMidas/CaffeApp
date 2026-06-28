# Testing Strategy — CaffeApp

**Sprint 0.9** — Test plan. **Không implement** test framework trong sprint này.

Stack: Jest (NestJS default) · future Detox/Maestro (mobile E2E)

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

| Target | Tool | Location (planned) |
| ------ | ---- | ------------------ |
| API services | Jest | `apps/api/src/**/*.spec.ts` |
| Shared utils | Jest/Vitest | `packages/shared/**/*.spec.ts` |
| Mobile hooks | Jest + RTL | `apps/mobile/src/**/*.test.ts` |
| Use-cases | Jest | `apps/mobile/src/features/*/use-cases/*.test.ts` |

**When:** Sprint 1+ — auth service, session store, DTO mappers

**Command (planned):**

```bash
npm run test --workspace=@caffeapp/api
npm run test --workspace=@caffeapp/mobile
```

### Integration tests

| Target | Scope |
| ------ | ----- |
| Auth flow | `POST /auth/login` → JWT → `GET /auth/me` |
| Orders | Create order → update status → payment |
| Branch isolation | User A cannot read Branch B data |

**Setup:**

- Test PostgreSQL (Docker) hoặc ephemeral DB
- `prisma migrate deploy` trước test suite
- NestJS `TestingModule` + supertest

**When:** Sprint 1 (auth), Sprint 2 (orders)

### E2E tests

| Target | Tool options |
| ------ | ------------ |
| Mobile flows | Maestro / Detox |
| API smoke | supertest / Postman collection |

**Critical paths:**

1. Login → branch → role → cashier home
2. Create order → send kitchen → barista queue
3. Payment → order PAID

**When:** Sprint 2–4

### Manual tests

| When | Who |
| ---- | --- |
| Every PR with UI | Developer |
| Sprint review | QA + PO |
| UAT | Pilot quán (Sprint 6) |

Checklist: User Story **Given/When/Then** in [USER_STORIES.md](USER_STORIES.md)

### Smoke tests

Chạy sau mỗi deploy:

```bash
curl -f http://<api-host>/api/v1/health
# Expected: { "status": "ok", "service": "caffeapp-api" }
```

Sprint 1+: thêm smoke login với test account.

### Regression tests

| Trigger | Scope |
| ------- | ----- |
| Pre-release | Full sprint test suite |
| Hotfix | Affected module + smoke |

Automated regression: CI chạy unit + integration trên mỗi PR.

---

## 3. Coverage targets (goals)

| Layer | Target | Sprint |
| ----- | ------ | ------ |
| API services (critical) | ≥ 80% | Sprint 2 |
| Shared contracts/utils | ≥ 70% | Sprint 1 |
| Mobile hooks | ≥ 60% | Sprint 2 |
| E2E critical paths | 100% paths | Sprint 4 |

Hiện tại: **0%** — placeholders in `package.json` test scripts.

---

## 4. Test data

| Source | Use |
| ------ | --- |
| `prisma/seed.ts` | Dev + integration baseline |
| Factory helpers (planned) | `test/factories/` Sprint 1+ |
| Không dùng production data | Ever |

Test accounts (planned Sprint 1 seed):

| Email | Role | Password |
| ----- | ---- | -------- |
| `cashier@caffe.app` | CASHIER | (dev only) |
| `barista@caffe.app` | BARISTA | (dev only) |
| `manager@caffe.app` | MANAGER | (dev only) |

---

## 5. CI integration (target)

```yaml
# Future job in .github/workflows/ci.yml
test:
  runs-on: ubuntu-latest
  services:
    postgres:
      image: postgres:16-alpine
  steps:
    - run: npm ci
    - run: npm run db:migrate:deploy --workspace=@caffeapp/api
    - run: npm run test
```

Current CI: typecheck, lint, format, api-build — **no test job yet**.

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
