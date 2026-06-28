# CaffeApp — Sprint Plan

**Total estimated:** 112 story points | **Velocity:** ~20 pts/sprint | **Duration:** 6 sprints + Sprint 0

---

## Sprint 0: Foundation (Completed)

**Goal:** Repo, CI, design system, navigation shell

| Task                                    | Status |
| --------------------------------------- | ------ |
| Monorepo setup (npm workspaces)         | Done   |
| Expo + Expo Router init                 | Done   |
| `@caffeapp/shared` package              | Done   |
| Design tokens + UI components           | Done   |
| Auth/Cashier/Barista/Manager nav shells | Done   |
| CI workflow (typecheck)                 | Done   |
| Documentation (PRD, ADR, API, ERD)      | Done   |

**Deliverable:** App chạy được, navigate login → role → home screens

---

## Sprint 0.5: FE/BE Architecture Split (Completed)

**Goal:** Tách Mobile ↔ NestJS API, Prisma schema, service layer

| Task                              | Status |
| --------------------------------- | ------ |
| NestJS API scaffold (`apps/api`)  | Done   |
| Prisma PostgreSQL schema          | Done   |
| Prisma migration `initial_schema` | Done   |
| `packages/shared` enums + DTOs    | Done   |
| Mobile service layer (Axios)      | Done   |
| TanStack Query Provider           | Done   |
| Mobile `src/app/` restructure     | Done   |
| README + env standardization      | Done   |

**Deliverable:** Mobile gọi API qua services; backend module shells sẵn sàng Sprint 1

---

## Sprint 0.9: Production Readiness Foundation (Completed)

**Goal:** Ops docs, git/versioning strategy, security & testing plan — **không code feature**

| Task                                           | Status |
| ---------------------------------------------- | ------ |
| DEPLOYMENT.md                                  | Done   |
| SECURITY.md                                    | Done   |
| TESTING.md                                     | Done   |
| RELEASE.md                                     | Done   |
| VERSIONING.md                                  | Done   |
| CHANGELOG.md                                   | Done   |
| GIT.md (branch strategy — chưa git init)       | Done   |
| CONTRIBUTING.md updated (Conventional Commits) | Done   |

**Deliverable:** Production Ready Foundation documentation complete

---

## Sprint 1: Auth Flow (10 pts) — 🔄 IN PROGRESS

**Stories:** US-A01 → US-A04  
**Screens:** 01–04  
**Backend:** NestJS Auth module + JWT + Prisma users/staff

| Story                        | Points | FE                                | BE                        | Status |
| ---------------------------- | ------ | --------------------------------- | ------------------------- | ------ |
| US-A01 Đăng nhập (API + JWT) | 3      | `authService.login` + SecureStore | `POST /api/v1/auth/login` | TODO   |
| US-A02 Chọn chi nhánh        | 2      | `useBranches` query               | `GET /api/v1/branches`    | TODO   |
| US-A03 Chọn vai trò          | 2      | Session store + staff role        | `GET /api/v1/auth/me`     | TODO   |
| US-A04 Trang chủ Thu ngân    | 3      | Wire home screen                  | Shift context API         | TODO   |

**Infrastructure done:** Prisma migration `initial_schema`, seed 1 branch, API health endpoint, mobile nav shell.

**DoD:** Login E2E qua NestJS API, session persist SecureStore, mobile không gọi DB trực tiếp

---

## Sprint 2: Order Core (23 pts)

**Stories:** US-B01 → US-B05  
**Screens:** 05–09

| Story                     | Points |
| ------------------------- | ------ |
| US-B01 Chọn loại đơn      | 2      |
| US-B02 Sơ đồ bàn          | 5      |
| US-B03 Menu               | 5      |
| US-B04 Tùy chỉnh món      | 5      |
| US-B05 Giỏ hàng + Gửi bếp | 8      |

---

## Sprint 3: Payment (13 pts)

**Stories:** US-B06 → US-B11  
**Screens:** 10–15

| Story               | Points |
| ------------------- | ------ |
| US-B06 Tiền mặt     | 5      |
| US-B07 Chuyển khoản | 3      |
| US-B08 Thẻ          | 2      |
| US-B09 Ví điện tử   | 3      |

---

## Sprint 4: Barista Real-time (19 pts)

**Stories:** US-C01 → US-C04  
**Screens:** 16–19

| Story                   | Points |
| ----------------------- | ------ |
| US-C01 Queue + Realtime | 8      |
| US-C02 Chi tiết đơn     | 3      |
| US-C03 Đang pha         | 5      |
| US-C04 Hoàn thành       | 3      |

---

## Sprint 5: Manager (29 pts)

**Stories:** US-D01 → US-D06, US-E01  
**Screens:** 20–26

---

## Sprint 6: Polish + UAT (18 pts)

**Stories:** US-E02, US-E03 + bug fixes  
**Screens:** 27–28

- UAT tại quán pilot
- Performance tuning
- Error handling hardening

---

## Release Milestones

| Milestone     | Sprint     | Date (target) |
| ------------- | ---------- | ------------- |
| M0 Foundation | Sprint 0   | 2026-06-25    |
| M1 Auth       | Sprint 1   | +2 weeks      |
| M2 Order      | Sprint 2–3 | +5 weeks      |
| M3 Barista    | Sprint 4   | +7 weeks      |
| M4 Pilot UAT  | Sprint 6   | +12 weeks     |
