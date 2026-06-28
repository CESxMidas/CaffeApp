# Security — CaffeApp

**Sprint 0.9** — Security plan & checklist. **Không implement** trong sprint này.

Stack: NestJS · JWT · Prisma · PostgreSQL · Expo SecureStore

---

## 1. Security principles

1. Mobile **never** accesses PostgreSQL directly
2. All business rules enforced in **NestJS API**
3. **Branch isolation** via service-layer scoping (`branchId`)
4. **Defense in depth**: validation + auth + RBAC + audit
5. **Least privilege** per `StaffRole`

---

## 2. Authentication checklist

| Control | Status | Sprint | Notes |
| ------- | ------ | ------ | ----- |
| JWT access token | ⏳ Planned | 1 | `@nestjs/jwt`, short TTL |
| JWT refresh token | ⏳ Planned | 1 | Rotation on refresh |
| Password hash (bcrypt) | ⏳ Planned | 1 | `users.password_hash` — bcrypt cost ≥ 10 |
| SecureStore (mobile) | ⏳ Planned | 1 | `expo-secure-store` for tokens |
| Session timeout | ⏳ Planned | 1 | `JWT_EXPIRES_IN` env |
| Logout / token revoke | ⏳ Planned | 1 | Invalidate refresh token |
| `@Public()` decorator | ✅ Ready | — | `common/decorators/public.decorator.ts` |

---

## 3. Authorization (RBAC) checklist

| Control | Status | Sprint | Notes |
| ------- | ------ | ------ | ----- |
| `StaffRole` enum | ✅ Schema | — | OWNER, MANAGER, CASHIER, BARISTA |
| Route guards | ⏳ Planned | 1 | `common/guards/` |
| Permission matrix | ✅ Documented | — | [API_CONTRACT.md §14](api/API_CONTRACT.md) |
| Branch scoping in services | ⏳ Planned | 1 | Filter by JWT `branchId` |
| Client-side role UI gating | ⏳ Planned | 1 | UX only — not security boundary |

---

## 4. Input validation checklist

| Control | Status | Notes |
| ------- | ------ | ----- |
| `class-validator` DTOs | ⏳ Sprint 1 | Per endpoint |
| Global validation pipe | ✅ Ready | `main.ts` |
| Env validation on boot | ✅ Ready | `config/env.validation.ts` |
| Prisma parameterized queries | ✅ Default | ORM — no raw SQL injection |
| Money as integer VND | ✅ Schema | Prevent float errors |

---

## 5. Network & HTTP checklist

| Control | Status | Sprint | Notes |
| ------- | ------ | ------ | ----- |
| CORS configurable | ✅ Ready | — | `CORS_ORIGINS` env — not `origin: true` |
| Helmet (security headers) | ⏳ Planned | 1 | `helmet` middleware |
| HTTPS (TLS) | ⏳ Deploy | — | Reverse proxy / load balancer |
| Rate limiting | ⏳ Post-MVP | — | `@nestjs/throttler` |
| Request size limit | ⏳ Sprint 1 | — | Body parser limits |

---

## 6. Audit & logging checklist

| Control | Status | Sprint | Notes |
| ------- | ------ | ------ | ----- |
| Request logging interceptor | ✅ Ready | — | `common/interceptors/` |
| Global exception filter | ✅ Ready | — | No stack trace in response |
| `audit_logs` table | ✅ Schema | 2+ | Write on order/payment mutations |
| Auth login audit | ⏳ Planned | 1 | `AUTH_LOGIN` action |
| Structured logging (JSON) | ⏳ Post-MVP | — | For log aggregation |

---

## 7. Secrets management checklist

| Secret | Storage | Never |
| ------ | ------- | ----- |
| `JWT_SECRET` | Env / secret manager | Commit to git |
| `DATABASE_URL` | Env / secret manager | Commit to git |
| Expo credentials | EAS secrets | In repo |
| Android keystore | CI secret / EAS | In repo |

`.gitignore` blocks: `.env`, `.env.local`, `*.jks`, `*.p8`, `*.p12`

---

## 8. Mobile security checklist

| Control | Status | Sprint |
| ------- | ------ | ------ |
| Tokens in SecureStore | ⏳ | 1 |
| No secrets in `EXPO_PUBLIC_*` | ✅ Policy | — |
| Certificate pinning | ⏳ Post-MVP | — |
| Root/jailbreak detection | ⏳ Post-MVP | — |
| Biometric unlock | Could (FR-A05) | Post-MVP |

---

## 9. Database security checklist

| Control | Status | Notes |
| ------- | ------ | ----- |
| Dedicated DB user (non-superuser) | ⏳ Deploy | Production PG role |
| Network isolation | ⏳ Deploy | API-only access to PG |
| Encrypted connections (SSL) | ⏳ Deploy | `?sslmode=require` in URL |
| Backups encrypted | ⏳ Deploy | Daily + retention policy |
| No Supabase RLS | N/A | Service-layer RBAC instead |

---

## 10. Dependency security

| Action | Frequency |
| ------ | --------- |
| `npm audit` | Weekly / pre-release |
| Dependabot / Renovate | Recommended |
| Lock file committed | ✅ `package-lock.json` |

---

## 11. Incident response (outline)

1. Identify scope (API, DB, mobile)
2. Rotate `JWT_SECRET` if token compromise suspected
3. Force logout all sessions (invalidate refresh tokens)
4. Review `audit_logs`
5. Patch + deploy hotfix branch
6. Post-mortem document

---

## Related

- [ARCHITECTURE.md](ARCHITECTURE.md) § Security
- [DEPLOYMENT.md](DEPLOYMENT.md)
- [adr/004-auth-rbac.md](adr/004-auth-rbac.md) (Superseded — historical)
- [ENV_SETUP.md](ENV_SETUP.md)
