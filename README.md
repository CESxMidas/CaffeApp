# CaffeApp

Hệ thống quản lý quán cafe / POS nội bộ — mobile-first cho Thu ngân, Barista, Quản lý.

## Kiến trúc

```
Mobile (Expo)  ──HTTP/Axios──▶  NestJS API  ──Prisma──▶  PostgreSQL
       │                              │
       └── @caffeapp/shared ◀─────────┘
```

| Doc                                                   | Mô tả                                 |
| ----------------------------------------------------- | ------------------------------------- |
| [PROJECT_STATUS.md](docs/PROJECT_STATUS.md)           | **Trạng thái dự án** — done/pending   |
| [ARCHITECTURE.md](docs/ARCHITECTURE.md)               | Kiến trúc hệ thống                    |
| [MOBILE_ARCHITECTURE.md](docs/MOBILE_ARCHITECTURE.md) | Kiến trúc mobile (Clean Architecture) |
| [CONVENTIONS.md](docs/CONVENTIONS.md)                 | **Chuẩn hóa** folder, alias, import   |
| [ENV_SETUP.md](docs/ENV_SETUP.md)                     | Tạo `.env` API + Mobile               |
| [ANDROID_JDK.md](docs/ANDROID_JDK.md)                 | JDK 17 + Expo Go / Android build      |
| [SPRINT_PLAN.md](docs/SPRINT_PLAN.md)                 | Lộ trình sprint                       |
| [API_CONTRACT.md](docs/api/API_CONTRACT.md)           | REST API contract (design)            |
| [ERD.md](docs/api/ERD.md)                             | Database schema (Prisma)              |
| [PRD.md](docs/PRD.md)                                 | Product requirements                  |
| [USER_STORIES.md](docs/USER_STORIES.md)               | User stories + acceptance criteria    |
| [DOR_CHECKLIST.md](docs/DOR_CHECKLIST.md)             | Definition of Ready                   |

### Production foundation (Sprint 0.9)

| Doc                                 | Mô tả                            |
| ----------------------------------- | -------------------------------- |
| [DEPLOYMENT.md](docs/DEPLOYMENT.md) | Deploy API, mobile, PostgreSQL   |
| [SECURITY.md](docs/SECURITY.md)     | Security checklist & plan        |
| [TESTING.md](docs/TESTING.md)       | Testing strategy                 |
| [RELEASE.md](docs/RELEASE.md)       | Release & rollback process       |
| [VERSIONING.md](docs/VERSIONING.md) | Semantic Versioning              |
| [GIT.md](docs/GIT.md)               | Branch strategy & git init guide |
| [CHANGELOG.md](CHANGELOG.md)        | Release history                  |

---

## Folder tree

```
CaffeApp/
├── apps/
│   ├── mobile/src/
│   │   ├── app/                 # Expo Router (thin routes)
│   │   ├── features/            # Domain modules
│   │   │   ├── auth/
│   │   │   ├── barista/
│   │   │   ├── manager/
│   │   │   ├── notifications/
│   │   │   ├── orders/          # Domain đơn hàng dùng chung (kể cả màn thu ngân)
│   │   │   └── staff/
│   │   └── shared/
│   │       ├── components/ui/
│   │       ├── config/
│   │       ├── lib/api/
│   │       ├── stores/
│   │       └── providers/
│   └── api/src/
│       ├── config/
│       ├── common/
│       └── modules/
├── packages/
│   ├── shared/                  # contracts, enums, dto, theme
│   ├── tsconfig/
│   ├── eslint-config/
│   └── prettier-config/
└── infra/                       # docker-compose (PostgreSQL)
```

---

## Yêu cầu

- Node.js ≥ 20
- PostgreSQL 16+ (hoặc Docker — xem [infra/README.md](infra/README.md))
- Android Studio / Expo Go (mobile dev)

## Tech stack (2026-06-28)

| Layer    | Technology     | Version                   |
| -------- | -------------- | ------------------------- |
| Mobile   | Expo           | ~54.0.0                   |
| Mobile   | React Native   | 0.81.5                    |
| Mobile   | React          | 19.1.0                    |
| Mobile   | Expo Router    | ~6.0.24                   |
| Mobile   | TanStack Query | ^5.74                     |
| Mobile   | Zustand        | ^5.0                      |
| API      | NestJS         | ^11.0                     |
| API      | Prisma         | ^6.6                      |
| API      | TypeScript     | ~5.8                      |
| Database | PostgreSQL     | 16                        |
| Monorepo | npm workspaces | —                         |
| Shared   | TypeScript     | ~6.0 (mobile), ~5.8 (api) |

---

## Cài đặt

```bash
npm install
```

Tạo `.env` — chi tiết: [docs/ENV_SETUP.md](docs/ENV_SETUP.md)

```bash
# Windows PowerShell
Copy-Item apps\api\.env.example apps\api\.env
Copy-Item apps\mobile\.env.example apps\mobile\.env

# macOS / Linux
cp apps/api/.env.example apps/api/.env
cp apps/mobile/.env.example apps/mobile/.env
```

### PostgreSQL

**Docker (khuyên dùng):**

```bash
docker compose -f infra/docker-compose.yml up -d
npm run db:generate
npm run db:migrate
npm run db:seed
```

**Cài local (Windows/macOS):** tạo database, cấu hình `apps/api/.env` → chạy các lệnh trên.

Trong `apps/api`: dùng `npm run start:dev` thay vì `npm run api`.

---

## Chạy

```bash
# Terminal 1 — API
npm run api
# → http://localhost:3000/api/v1/health

# Terminal 2 — Mobile
npm run mobile:android
```

**Android emulator:** `EXPO_PUBLIC_API_URL=http://10.0.2.2:3000` trong `apps/mobile/.env`

---

## Scripts

| Lệnh                     | Mô tả                           |
| ------------------------ | ------------------------------- |
| `npm run validate`       | format:check + lint + typecheck |
| `npm run format`         | Prettier format toàn repo       |
| `npm run format:check`   | Prettier check (không ghi file) |
| `npm run lint`           | ESLint toàn repo                |
| `npm run lint:fix`       | ESLint auto-fix                 |
| `npm run typecheck`      | TypeScript tất cả workspaces    |
| `npm run test`           | Tests (placeholder Sprint 1+)   |
| `npm run mobile`         | Expo dev server                 |
| `npm run mobile:android` | Android emulator                |
| `npm run mobile:ios`     | iOS simulator                   |
| `npm run mobile:tunnel`  | Expo tunnel mode                |
| `npm run api`            | NestJS watch mode (từ root)     |
| `npm run api:build`      | Build NestJS API                |
| `npm run db:generate`    | Prisma generate client          |
| `npm run db:migrate`     | Prisma migrate dev              |
| `npm run db:seed`        | Seed database                   |

---

## Path aliases

### Mobile

| Alias              | Path              |
| ------------------ | ----------------- |
| `@shared/*`        | `src/shared/*`    |
| `@features/*`      | `src/features/*`  |
| `@caffeapp/shared` | `packages/shared` |

### API

| Alias        | Path            |
| ------------ | --------------- |
| `@/*`        | `src/*`         |
| `@modules/*` | `src/modules/*` |
| `@common/*`  | `src/common/*`  |

Chi tiết: [docs/CONVENTIONS.md](docs/CONVENTIONS.md)

---

## Packages

| Package                     | Vai trò                       |
| --------------------------- | ----------------------------- |
| `@caffeapp/shared`          | Enums, DTOs, contracts, theme |
| `@caffeapp/tsconfig`        | Shared TypeScript configs     |
| `@caffeapp/eslint-config`   | ESLint rules                  |
| `@caffeapp/prettier-config` | Prettier rules                |

---

## Sprint status

**Coding MVP: hoàn thiện 100%** (28/28 user stories + pilot hardening). Việc còn lại là thủ công (UAT, thiết bị thật, data production).

👉 Chi tiết done/pending, coding/thủ công: **[docs/PROJECT_STATUS.md](docs/PROJECT_STATUS.md)**

| Sprint          | Trạng thái coding                                                                |
| --------------- | -------------------------------------------------------------------------------- |
| Sprint 0 → 0.9  | ✅ Foundation, FE/BE split, ops docs                                             |
| Sprint 1        | ✅ Auth flow                                                                     |
| Sprint 2–3      | ✅ Order core + payment (tiền mặt, VietQR)                                       |
| Sprint 4        | ✅ Barista realtime (WebSocket + polling fallback)                               |
| Sprint 5        | ✅ Manager (dashboard, báo cáo, ca, menu, NV)                                    |
| Sprint 6        | ✅ Notifications, settings, đổi MK qua email                                     |
| Pilot hardening | ✅ Void payment, đối soát ca, toggle hết món, offline banner, draft cart persist |
