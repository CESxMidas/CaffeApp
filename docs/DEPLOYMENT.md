# Deployment — CaffeApp

**Stack:** Expo (mobile) · NestJS (API) · PostgreSQL 16 · Prisma · npm workspaces  
**Sprint 0.9** — Foundation guide. Chưa deploy production.

---

## 1. Environments

| Environment | Mobile | API | Database | Mục đích |
| ----------- | ------ | --- | -------- | -------- |
| **Development** | Expo Go / emulator | `localhost:3000` | Docker local | Dev hàng ngày |
| **QA** | Internal build (EAS) | Staging URL | Staging PG | Test story AC |
| **Staging** | Internal build | Pre-prod API | Staging PG (copy prod schema) | UAT rehearsal |
| **Production** | EAS production build | Prod API | Managed PostgreSQL | Pilot quán |

---

## 2. Prerequisites

| Component | Requirement |
| --------- | ----------- |
| Node.js | ≥ 20 |
| npm | ≥ 10 |
| PostgreSQL | 16+ |
| Docker | Optional (local dev) |
| Expo EAS | Post-Sprint 4 (app store / internal distribution) |

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

| Variable | Required | Notes |
| -------- | -------- | ----- |
| `DATABASE_URL` | ✅ | Managed PostgreSQL connection string |
| `JWT_SECRET` | ✅ | Strong random secret (≥ 32 chars) |
| `JWT_EXPIRES_IN` | ✅ | e.g. `15m` |
| `JWT_REFRESH_EXPIRES_IN` | ✅ | e.g. `7d` |
| `CORS_ORIGINS` | ✅ | Production mobile/web origins only |
| `PORT` | Optional | Default `3000` |
| `NODE_ENV` | ✅ | `production` |

### Database migrate (production)

```bash
npm run db:migrate:deploy --workspace=@caffeapp/api
```

**Không** chạy `db:migrate` (dev) trên production.

### Recommended hosting

| Option | Fit |
| ------ | --- |
| Docker container + orchestrator (K8s, ECS, Railway, Render) | ✅ Recommended |
| VM + systemd + reverse proxy (Nginx) | ✅ Acceptable |
| Serverless | ⚠️ Not ideal for NestJS long-running |

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

| Profile | `EXPO_PUBLIC_API_URL` | Distribution |
| ------- | ----------------------- | ------------ |
| `development` | Dev machine / staging | Internal |
| `preview` | Staging API | Internal testers |
| `production` | Production API | Pilot store / MDM |

OTA updates (post-MVP): Expo EAS Update cho JS bundle — không thay native modules.

---

## 6. PostgreSQL

### Local (Docker)

```bash
docker compose -f infra/docker-compose.yml up -d
```

Connection: `postgresql://postgres:postgres@localhost:5432/caffeapp`

### Staging / Production

| Concern | Recommendation |
| ------- | -------------- |
| Version | PostgreSQL 16 |
| Backups | Daily automated + PITR |
| Connection | Pool via Prisma (default) |
| Migrations | CI/CD step: `db:migrate:deploy` |
| Secrets | Vault / cloud secret manager — không trong repo |

---

## 7. CI/CD pipeline (current + target)

### Current (`.github/workflows/ci.yml`)

| Job | Command |
| --- | ------- |
| typecheck | `npm run typecheck` |
| lint | `npm run lint` |
| format | `npm run format:check` |
| api-build | `npm run api:build` |

### Target (Sprint 2+)

| Stage | Action |
| ----- | ------ |
| PR | `npm run validate` + api-build |
| Merge develop | Deploy staging API |
| Release tag | Deploy production API + EAS build |
| Post-deploy | Smoke test `/api/v1/health` |

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

## Related

- [SECURITY.md](SECURITY.md)
- [RELEASE.md](RELEASE.md)
- [ENV_SETUP.md](ENV_SETUP.md)
- [database/README.md](../database/README.md)
