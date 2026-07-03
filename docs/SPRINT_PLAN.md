# CaffeApp — Sprint Plan

**Total estimated:** 112 story points | **Velocity:** ~20 pts/sprint | **Duration:** 6 sprints + Sprint 0  
**Nguồn nghiệp vụ:** [STAKEHOLDER_QUESTIONNAIRE.md](STAKEHOLDER_QUESTIONNAIRE.md) (MVP v2)

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

**Deliverable:** App chạy được, navigate login → khu vận hành / QL / Owner (không màn chọn role)

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

## Sprint 1: Auth Flow (10 pts) — ✅ Code done; E2E thiết bị thật pending (C-15)

**Stories:** US-A01 → US-A04  
**Screens:** 01–04 (`03-chon-vai-tro` deprecated — routing theo StaffRole)

| Story                         | Points | FE                                | BE                        | Status  |
| ----------------------------- | ------ | --------------------------------- | ------------------------- | ------- |
| US-A01 Đăng nhập (API + JWT)  | 3      | `authService.login` + SecureStore | `POST /api/v1/auth/login` | ✅ Done |
| US-A02 Chọn chi nhánh (Owner) | 2      | `useBranches` query               | `GET /api/v1/branches`    | ✅ Done |
| US-A03 Điều hướng sau login   | 2      | Routing theo StaffRole            | `GET /api/v1/auth/me`     | ✅ Done |
| US-A04 Trang chủ trạm         | 3      | Wire home + tablet tabs           | —                         | ✅ Done |

**DoD:** Login E2E **thiết bị thật** + SecureStore sau kill app (C-15); đồng bộ DEVICE_POLICY v2

---

## Sprint 2: Order Core (23 pts) — ✅ Code done; UAT/manual verification pending

**Stories:** US-B01 → US-B05  
**Screens:** 05–09

| Story                     | Points | FE status | BE status |
| ------------------------- | ------ | --------- | --------- |
| US-B01 Chọn loại đơn      | 2      | Done      | N/A       |
| US-B02 Sơ đồ bàn          | 5      | Done      | Done      |
| US-B03 Menu               | 5      | Done      | Done      |
| US-B04 Tùy chỉnh món      | 5      | Done      | N/A       |
| US-B05 Giỏ hàng + Gửi bếp | 8      | Done      | Done      |

---

## Sprint 3: Payment + Order Management (13 pts) — ✅ Pilot code done; thẻ/ví/cổng để sau pilot

**Stories:** US-B06 → US-B11  
**Screens:** 10–15  
**Payment pilot (Must):** Tiền mặt + Chuyển khoản VietQR. Không dùng cổng online trong MVP/pilot.

| Story                       | Points | Priority pilot | Coding status              |
| --------------------------- | ------ | -------------- | -------------------------- |
| US-B06 Tiền mặt             | 5      | Must           | Done                       |
| US-B07 Chuyển khoản VietQR  | 3      | Must           | Done                       |
| US-B08 Thẻ                  | 2      | Post-pilot     | Not enabled                |
| US-B09 Ví / cổng thanh toán | 3      | Out of pilot   | Replaced by VietQR for MVP |
| US-B10 Danh sách đơn        | —      | Must           | Done                       |
| US-B11 Lịch sử đơn          | —      | Should         | Done                       |

---

## Sprint 4: Barista Real-time (19 pts) — ✅ Code done; real device/UAT pending

**Stories:** US-C01 → US-C04  
**Screens:** 16–19  
**Transport:** WebSocket primary; polling 10s fallback (F-01, F-16)

| Story                   | Points | Coding status |
| ----------------------- | ------ | ------------- |
| US-C01 Queue + Realtime | 8      | Done          |
| US-C02 Chi tiết đơn     | 3      | Done          |
| US-C03 Đang pha         | 5      | Done          |
| US-C04 Hoàn thành       | 3      | Done          |

---

## Sprint 5: Manager (29 pts) — ✅ Core code done; UAT/manual verification pending

**Stories:** US-D01 → US-D06, US-E01  
**Screens:** 20–26  
**Shift module:** bật bắt buộc `shift_id` (B-05, GAP-06)

| Area                | Coding status |
| ------------------- | ------------- |
| Dashboard + revenue | Done          |
| Revenue reports     | Done          |
| Shift management    | Done          |
| Menu CRUD           | Done          |
| Staff list/detail   | Done          |
| Table maintenance   | Done          |

---

## Sprint 6: Polish + UAT (18 pts) — 🔄 Partial code done; UAT/manual work pending

**Stories:** US-E02, US-E03 + bug fixes  
**Screens:** 27–28

- UAT tại quán pilot
- Performance tuning
- Error handling hardening

**Code-side done:** in-app notifications, settings, change password qua mã email, logout.  
**Pending:** UAT tại quán, real-device verification, production data/sign-off.

---

## Release Milestones

| Milestone     | Sprint     | Date (target) |
| ------------- | ---------- | ------------- |
| M0 Foundation | Sprint 0   | 2026-06-25    |
| M1 Auth       | Sprint 1   | +2 weeks      |
| M2 Order      | Sprint 2–3 | +5 weeks      |
| M3 Barista    | Sprint 4   | +7 weeks      |
| M4 Pilot UAT  | Sprint 6   | +12 weeks     |
