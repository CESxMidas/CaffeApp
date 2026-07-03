# Changelog

All notable changes to CaffeApp are documented in this file.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)  
Versioning: [Semantic Versioning](docs/VERSIONING.md)

---

## [Unreleased]

### Added

- Sprint 0.9 production foundation documentation (DEPLOYMENT, SECURITY, TESTING, RELEASE, VERSIONING, GIT)
- Documentation audit & repair (ERD sync Prisma, ADR superseded markers, API contract status)
- **Doc Freeze Memo** (`docs/DOC_FREEZE_MEMO.md`) — tag `docs-v2.0-mvp`, ngày 2026-06-29
- **API/ERD refactor checklist** (`docs/API_ERD_REFACTOR_CHECKLIST.md`) — xác nhận scope Phase 2
- **Phase 3 internal demo pack** — demo script, minutes template, staging data checklist, NFR spot-check guide, copy review checklist
- **Phase 3 tooling** — `phase3:verify-staging-data` and `phase3:nfr` scripts
- **Phase 4–9 go-live pack** — UAT, RC, pilot, training, SOP, go-live, weekly stability, post-mortem, roadmap templates
- **Release/go-live tooling** — EAS profiles, release readiness checker, production smoke checker, PostgreSQL backup helper

### Changed

- Documentation aligned with NestJS + Prisma + Expo 56 stack
- **docs(payment):** cập nhật MVP/pilot dùng Tiền mặt + Chuyển khoản VietQR; cổng online để sau pilot
- **feat(auth):** đổi mật khẩu 2 bước bằng mã email, audit và notification cho quản lý/chủ quán
- **MVP v2 doc sync (2026-06-29):** PRD, USER_STORIES, SPRINT_PLAN, API_CONTRACT, ERD, DEVICE_POLICY, BRANCH_ASSIGNMENT, TESTING, MOBILE_ARCHITECTURE, GO_LIVE_PLAN — questionnaire khách đã ký
- **refactor(auth):** route by `StaffRole` (TASK-P2-01) — bỏ màn chọn role
- **refactor(orders):** `deliveredAt` thay `SERVING` (TASK-P2-02) — `POST /orders/:id/deliver`, payment khi `READY`
- **feat(tablet):** staff picker trạm (TASK-P2-03) — `actedByStaffId`, `StaffPickerModal`
- **feat(station):** Tab Bếp tablet trạm (TASK-P2-03b) — `(station)/` shell, `BaristaQueueView`, `operationalRoutes`
- **fix(vat):** VAT 8% inclusive pricing (TASK-P2-04) — `calculateOrderTotal`, bill breakdown cart/payment
- **chore(seed):** Staging seed menu thật D-13 (TASK-P2-06) — `db:seed:staging`, 3 CN, 50 bàn/CN
- **fix(payment):** khóa pilot payment chỉ TM + CK — mobile ẩn Thẻ/Ví, API từ chối `CARD`/`E_WALLET`; thêm `BranchDto.bankInfo` + VietQR động theo số tiền
- **chore(ci):** Phase 2 code-side CI green local — format/lint/typecheck/test pass; ignore Android build artefacts in Prettier

### Doc Freeze 2026-06-29 — Thông báo nội bộ team (trước Phase 2 refactor)

**Tóm tắt:** Bộ docs MVP v2 đã freeze. Questionnaire stakeholder đã chốt với khách. **Code hiện tại chưa khớp docs** — Phase 2 refactor bắt buộc trước demo/UAT.

**3 gap code ↔ docs (ưu tiên P0):**

| #   | Gap                                                     | File / vùng ảnh hưởng                                             |
| --- | ------------------------------------------------------- | ----------------------------------------------------------------- |
| 1   | Màn chọn role sau login (đã bỏ theo C-11)               | ~~`role.tsx`~~ ✅ P2-01 — route theo `StaffRole`                  |
| 2   | Enum `SERVING` còn trong code (docs dùng `deliveredAt`) | ~~`packages/shared`~~ ✅ P2-02 — `deliveredAt` + deliver endpoint |
| 3   | `activeRole` (user chọn) vs `StaffRole` cố định từ JWT  | ~~`session.ts`~~ ✅ P2-01 — `activateSession` + `useMobileRole`   |

**Thứ tự PR refactor (không đổi):**

1. **P2-01** — Auth routing (bỏ role screen)
2. **P2-02** — `deliveredAt` / gỡ `SERVING`
3. **P2-03** — Tablet trạm: picker chọn NV (`actedByStaffId`)
4. **P2-03b** — Tablet trạm: Tab Bếp (hoàn thành món → READY, giống barista) — **PO duyệt 2026-06-29**
5. **P2-04** — VAT 8% trên bill
6. **P2-05** — E2E C-15 (SecureStore thiết bị thật)

**Tham chiếu:** [GO_LIVE_PLAN.md — Phase 2](docs/GO_LIVE_PLAN.md#phase-2--code-refactor) · [DOC_FREEZE_MEMO.md](docs/DOC_FREEZE_MEMO.md)

**Freeze rule:** Thay đổi nghiệp vụ sau freeze → ticket + PO + cập nhật questionnaire trước khi code.

---

## [0.9.0] - 2026-06-28

### Added

- **Sprint 0.5:** NestJS API scaffold, Prisma schema (11 models), initial migration `initial_schema`
- **Sprint 0:** Expo mobile nav shell (auth, cashier, barista, manager routes)
- Monorepo npm workspaces (`apps/mobile`, `apps/api`, `packages/shared`)
- CI workflow: typecheck, lint, format, api-build
- Docker PostgreSQL 16 (`infra/docker-compose.yml`)
- Shared package: enums, DTOs, contracts, theme

### Notes

- Pre-release foundation tag — **no production features implemented yet**
- Only API endpoint live: `GET /api/v1/health`
- Mobile auth flow uses mock data (Sprint 1 pending)

---

## [0.1.0] - TBD (Sprint 1 target)

Planned:

- Auth API (JWT login, refresh, `/me`)
- Mobile SecureStore session
- Branch selection via API

---

[Unreleased]: https://github.com/<org>/CaffeApp/compare/v0.9.0...HEAD
[0.9.0]: https://github.com/<org>/CaffeApp/releases/tag/v0.9.0
