# Deployment — CaffeApp

**Stack:** Expo (mobile) · NestJS (API) · PostgreSQL 16 · Prisma · npm workspaces  
**Sprint 0.9** — Foundation guide. Chưa deploy production.

---

## 1. Environments

| Environment     | Mobile               | API              | Database                      | Mục đích      |
| --------------- | -------------------- | ---------------- | ----------------------------- | ------------- |
| **Development** | Expo Go / emulator   | `localhost:3000` | Docker local                  | Dev hàng ngày |
| **QA**          | Internal build (EAS) | Staging URL      | Staging PG                    | Test story AC |
| **Staging**     | Internal build       | Pre-prod API     | Staging PG (copy prod schema) | UAT rehearsal |
| **Production**  | EAS production build | Prod API         | Managed PostgreSQL            | Pilot quán    |

---

## 2. Prerequisites

| Component  | Requirement                                       |
| ---------- | ------------------------------------------------- |
| Node.js    | ≥ 20                                              |
| npm        | ≥ 10                                              |
| PostgreSQL | 16+                                               |
| Docker     | Optional (local dev)                              |
| Expo EAS   | Post-Sprint 4 (app store / internal distribution) |

---

## 3. Local development

```bash
# 1. Dependencies
npm install

# 2. Environment (không commit .env)
cp apps/api/.env.example apps/api/.env
cp apps/mobile/.env.example apps/mobile/.env

# 3. Database
docker compose -f infra/docker-compose.yml up -d
npm run db:generate
npm run db:migrate
npm run db:seed

# Staging / UAT (menu thật D-13, 3 CN, 50 bàn/CN) — xem mục 9
# npm run db:seed:staging

# 4. Run
npm run api          # Terminal 1 → http://localhost:3000/api/v1/health
npm run mobile:android   # Terminal 2
```

Chi tiết: [ENV_SETUP.md](ENV_SETUP.md), [infra/README.md](../infra/README.md)

---

## 4. API deployment (NestJS)

### Build

```bash
npm run db:generate
npm run api:build
# Output: apps/api/dist/
```

### Production start

```bash
cd apps/api
NODE_ENV=production node dist/src/main
# Hoặc: npm run start:prod --workspace=@caffeapp/api
```

### Environment variables (production)

| Variable                 | Required | Notes                                |
| ------------------------ | -------- | ------------------------------------ |
| `DATABASE_URL`           | ✅       | Managed PostgreSQL connection string |
| `JWT_SECRET`             | ✅       | Strong random secret (≥ 32 chars)    |
| `JWT_EXPIRES_IN`         | ✅       | e.g. `15m`                           |
| `JWT_REFRESH_EXPIRES_IN` | ✅       | e.g. `7d`                            |
| `CORS_ORIGINS`           | ✅       | Production mobile/web origins only   |
| `PORT`                   | Optional | Default `3000`                       |
| `NODE_ENV`               | ✅       | `production`                         |

### Database migrate (production)

```bash
npm run db:migrate:deploy --workspace=@caffeapp/api
```

**Không** chạy `db:migrate` (dev) trên production.

### Recommended hosting

| Option                                                      | Fit                                  |
| ----------------------------------------------------------- | ------------------------------------ |
| Docker container + orchestrator (K8s, ECS, Railway, Render) | ✅ Recommended                       |
| VM + systemd + reverse proxy (Nginx)                        | ✅ Acceptable                        |
| Serverless                                                  | ⚠️ Not ideal for NestJS long-running |

### Reverse proxy

```
https://api.caffeapp.internal → localhost:3000
```

TLS termination tại proxy. Health check: `GET /api/v1/health`

---

## 5. Mobile deployment (Expo)

### Development

- **Expo Go** — dev nhanh, không cần build
- **Android emulator** — `EXPO_PUBLIC_API_URL=http://10.0.2.2:3000`

### Internal QA / Staging / Production

Dùng **Expo Application Services (EAS)**:

```bash
# Cần cấu hình eas.json (Sprint 4+)
eas build --platform android --profile preview
eas build --platform ios --profile preview
```

| Profile       | `EXPO_PUBLIC_API_URL` | Distribution      |
| ------------- | --------------------- | ----------------- |
| `development` | Dev machine / staging | Internal          |
| `preview`     | Staging API           | Internal testers  |
| `production`  | Production API        | Pilot store / MDM |

OTA updates (post-MVP): Expo EAS Update cho JS bundle — không thay native modules.

---

## 6. PostgreSQL

### Local (Docker)

```bash
docker compose -f infra/docker-compose.yml up -d
```

Connection: `postgresql://postgres:postgres@localhost:5432/caffeapp`

### Staging / Production

| Concern    | Recommendation                                  |
| ---------- | ----------------------------------------------- |
| Version    | PostgreSQL 16                                   |
| Backups    | Daily automated + PITR                          |
| Connection | Pool via Prisma (default)                       |
| Migrations | CI/CD step: `db:migrate:deploy`                 |
| Secrets    | Vault / cloud secret manager — không trong repo |

---

## 7. CI/CD pipeline (current + target)

### Current (`.github/workflows/ci.yml`)

| Job       | Command                |
| --------- | ---------------------- |
| typecheck | `npm run typecheck`    |
| lint      | `npm run lint`         |
| format    | `npm run format:check` |
| api-build | `npm run api:build`    |

### Target (Sprint 2+)

| Stage         | Action                            |
| ------------- | --------------------------------- |
| PR            | `npm run validate` + api-build    |
| Merge develop | Deploy staging API                |
| Release tag   | Deploy production API + EAS build |
| Post-deploy   | Smoke test `/api/v1/health`       |

---

## 8. Deployment checklist

### Pre-deploy

- [ ] `npm run validate` pass
- [ ] `npm run api:build` pass
- [ ] Prisma migrations reviewed
- [ ] Env vars set in secret manager
- [ ] `JWT_SECRET` rotated from dev default
- [ ] CORS origins restricted
- [ ] Database backup verified

### Post-deploy

- [ ] `GET /api/v1/health` → `{ "status": "ok" }`
- [ ] Mobile app connects to correct API URL
- [ ] Logs accessible (stdout / aggregator)
- [ ] Rollback plan documented ([RELEASE.md](RELEASE.md))

---

## 9. Staging seed (TASK-P2-06 / I-03)

Seed **dev local** (`npm run db:seed`) dùng menu demo ngắn — 2 CN, phục vụ dev hàng ngày.

Seed **staging / UAT** (`npm run db:seed:staging`) import data giống quán thật:

| Hạng mục | Nội dung |
| -------- | -------- |
| Chi nhánh | 3 CN (Q1, Q3, Q7) — `prisma/data/staging-branches.json` |
| Bàn | 50/CN: Tầng 1 ×20, Tầng 2 ×20, Sân ×10 |
| Menu | 38 món / 8 category từ D-13 — `prisma/data/staging-menu.json` |
| Tài khoản | `owner@caffe.app` + QL/CASHIER/BARISTA/station mỗi CN |
| VietQR | `bankInfo` theo CN (STK placeholder — chủ quán cập nhật JSON trước go-live) |

### Chạy trên staging DB

```bash
# 1. Trỏ DATABASE_URL tới staging (secret manager / .env staging — không commit)
export DATABASE_URL="postgresql://..."
# Windows PowerShell:
# $env:DATABASE_URL="postgresql://..."

# 2. Migration (nếu chưa)
npm run db:migrate:deploy --workspace=@caffeapp/api

# 3. Seed staging
npm run db:seed:staging

# Tùy chọn: đổi mật khẩu mặc định
# $env:STAGING_SEED_PASSWORD="your-strong-password"
```

Script in ra số lượng bàn/món sau khi chạy. **Không** chạy trên production.

### Cập nhật menu / STK

1. Sửa `apps/api/prisma/data/staging-menu.json` (giá, món mới) hoặc `staging-branches.json` (STK VietQR).
2. Chạy lại `npm run db:seed:staging` (idempotent upsert).

### Verify API

Đăng nhập bằng tài khoản staging (vd. `cashier.q1@caffe.app`), rồi:

```bash
# Health
curl -s https://<staging-api>/api/v1/health

# Branches (Bearer token)
curl -s -H "Authorization: Bearer <token>" https://<staging-api>/api/v1/branches

# Products / tables (branchId = CN Quận 1)
curl -s -H "Authorization: Bearer <token>" "https://<staging-api>/api/v1/products?branchId=a0000000-0000-0000-0000-000000000001"
curl -s -H "Authorization: Bearer <token>" "https://<staging-api>/api/v1/tables?branchId=a0000000-0000-0000-0000-000000000001"
```

Tài khoản staging (mật khẩu mặc định `password123` hoặc `STAGING_SEED_PASSWORD`):

| Email | Vai trò |
| ----- | ------- |
| `owner@caffe.app` | OWNER |
| `manager.q1@caffe.app` | MANAGER CN Q1 |
| `cashier.q1@caffe.app` | CASHIER |
| `barista.q1@caffe.app` | BARISTA |
| `station.q1@caffe.app` | Tablet trạm (CASHIER) |
| `manager.q3@` / `q7@` … | Tương tự cho CN khác |

---

## Related

- [SECURITY.md](SECURITY.md)
- [RELEASE.md](RELEASE.md)
- [ENV_SETUP.md](ENV_SETUP.md)
- [database/README.md](../database/README.md)
