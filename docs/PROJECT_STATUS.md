# CaffeApp — Project Status

**Cập nhật:** 2026-07-07 · **Nguồn đối chiếu:** code thực tế tại `apps/`, `packages/` (không phải plan)

Tài liệu này là **bảng trạng thái duy nhất** tách rõ: (1) đã hoàn thiện vs chưa, (2) việc coding vs việc thủ công. Khi thêm chức năng mới, cập nhật file này trước khi cập nhật SPRINT_PLAN.

---

## 1. CODING — Đã hoàn thiện ✅

### 1.1 Theo sprint (28/28 user stories MVP)

| Sprint | Phạm vi                                                         | Trạng thái |
| ------ | --------------------------------------------------------------- | ---------- |
| 0–0.9  | Monorepo, design system, FE/BE split, Prisma, ops docs          | ✅         |
| 1      | Auth (login JWT, refresh, routing theo StaffRole, branch phiên) | ✅         |
| 2      | Order core (bàn, menu, tùy chỉnh món, giỏ, gửi bếp)             | ✅         |
| 3      | Thanh toán tiền mặt + VietQR, danh sách/lịch sử đơn             | ✅         |
| 4      | Barista realtime (WebSocket `/ws` + polling 10s fallback)       | ✅         |
| 5      | Manager (dashboard, báo cáo, ca, menu CRUD, nhân viên, bàn)     | ✅         |
| 6      | Notifications in-app, settings, đổi MK qua mã email, logout     | ✅         |

### 1.2 Vượt plan (Should/MVP v2 đã code sớm)

- Gộp bàn / chuyển bàn / tách bill theo món (FR-B14) + audit log (B-22)
- Báo cáo doanh thu theo khoảng ngày (FR-D03): preset Hôm nay / 7 ngày / 30 ngày / Tháng này
- Luồng gán chi nhánh: Manager đề xuất → Owner duyệt + notification

### 1.3 Pilot hardening (2026-07-07 — từ PM gate review)

> User story + acceptance criteria: [USER_STORIES.md](USER_STORIES.md) §Nhóm F (US-F01→F04). Test case thủ công: [DEMO_SCRIPT_INTERNAL.md](DEMO_SCRIPT_INTERNAL.md) Flow 6. Tầng API đã verify E2E; tầng UI mobile chờ verify trên thiết bị.

| Hạng mục                             | Endpoint / vị trí                                           |
| ------------------------------------ | ----------------------------------------------------------- |
| Void payment (EC-11)                 | `POST /payments/:id/void` + UI chi tiết đơn (MANAGER/OWNER) |
| Đối soát kết ca (EC-13)              | `GET /shifts/:id/reconciliation` + card "Đối soát ca"       |
| Xác nhận CK từng giao dịch (EC-08)   | `POST /payments/:id/verify` + nút "Đã nhận" trong đối soát  |
| Toggle hết món tại quầy (EC-12)      | `PATCH /products/:id/availability` (mở cho CASHIER/BARISTA) |
| Banner offline toàn app (EC-01)      | `OfflineBanner` poll `/health` 15s, gắn root layout         |
| Draft cart sống sót kill app (EC-10) | Zustand persist + SecureStore (mã hóa)                      |
| Retry thanh toán an toàn (EC-01)     | Lỗi 409 "Đơn đã thanh toán" khi retry → coi là thành công   |

---

## 2. CODING — Chưa làm (backlog có chủ đích, KHÔNG chặn pilot)

| Hạng mục                                         | Lý do hoãn                                                                                          | Kế hoạch       |
| ------------------------------------------------ | --------------------------------------------------------------------------------------------------- | -------------- |
| PIN 4 số cho StaffPicker                         | Cần migration schema + UX mới; rủi ro thấp hơn nhóm hardening. **Rủi ro chấp nhận** — đã ghi PRD §7 | Sau pilot      |
| Thanh toán thẻ (US-B08)                          | Plan định "Post-pilot"; enum `CARD` đã có sẵn DB                                                    | Sau pilot      |
| Ví điện tử / cổng online (US-B09)                | Out of pilot — thay bằng VietQR (E-01)                                                              | Khi có nhu cầu |
| Push notification hệ thống                       | In-app notification + WebSocket đủ cho pilot                                                        | Sau pilot      |
| Đăng nhập sinh trắc học (FR-A05)                 | Priority "Could"                                                                                    | Sau pilot      |
| Inventory / kho (API_CONTRACT §11)               | Domain design-only, chưa có trong Prisma                                                            | MVP v3         |
| Export CSV báo cáo (§10.5)                       | Optional                                                                                            | Sau pilot      |
| Pagination đầy đủ các list                       | Pilot data nhỏ; API trả list giới hạn (take 30–100)                                                 | Khi scale      |
| OpenAPI generate từ code                         | Contract markdown là source of truth                                                                | Sau pilot      |
| In hóa đơn nhiệt, tích điểm, i18n, offline-first | Out of scope MVP (PRD §7)                                                                           | —              |

---

## 3. THỦ CÔNG — Chưa làm (không phải việc code)

| #   | Việc                                                                  | Ai làm         | Tài liệu hướng dẫn                                          |
| --- | --------------------------------------------------------------------- | -------------- | ----------------------------------------------------------- |
| 1   | Verify trên thiết bị thật (login + SecureStore sau kill app, WS < 3s) | Dev + QA       | `DEVICE_POLICY.md`, C-15                                    |
| 2   | UAT tại quán pilot                                                    | PO + chủ quán  | `DEMO_SCRIPT_INTERNAL.md`, `SOP_QUAY_PILOT.md`              |
| 3   | Seed menu thật từ chủ quán                                            | PO             | `PRODUCTION_DATA_CHECKLIST.md`                              |
| 4   | Cấu hình QR ngân hàng (Vietcombank) vào `branch.bankInfo`             | Chủ quán + Dev | `STAGING_DATA_CHECKLIST.md`                                 |
| 5   | Training nhân viên (kèm thông báo giới hạn StaffPicker không PIN)     | PO             | `TRAINING_PACK.md`                                          |
| 6   | Build phân phối nội bộ (TestFlight / Play internal)                   | DevOps         | `RELEASE.md`, `RELEASE_CANDIDATE_CHECKLIST.md`              |
| 7   | Setup backup production + smoke test                                  | DevOps         | `PRODUCTION_BACKUP_RUNBOOK.md`, `scripts/go-live-smoke.mjs` |
| 8   | Go-live sign-off                                                      | PO + Tech Lead | `GO_LIVE_PLAN.md`                                           |

---

## 4. Chất lượng code (đối chiếu lần audit 2026-07-07)

- `npm run typecheck`: ✅ pass toàn repo (shared/api/mobile)
- Backend: 100% Prisma (không raw SQL), error handling thống nhất `HttpException`, RBAC guard trên mọi endpoint, audit log cho thao tác tiền/bill
- Mobile: không `any`, không TODO/FIXME sót, error message parse qua util chung `getErrorMessage`, design token tập trung `@caffeapp/shared`
- Đã sửa trong đợt audit: Rules-of-Hooks bug (orders.tsx), N+1 query (mergeOrders), DTO validation thiếu (payments verify), logic thống kê trùng lặp (groupBy util), moduleResolution deprecated (nodenext)
