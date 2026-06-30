# CaffeApp — Doc Freeze Memo (MVP v2)

|                   |                                                                     |
| ----------------- | ------------------------------------------------------------------- |
| **Version / tag** | `docs-v2.0-mvp`                                                     |
| **Ngày freeze**   | **2026-06-29**                                                      |
| **Trạng thái**    | Questionnaire khách đã chốt (Phần A–E.1, D; E.2–L chuẩn hóa MVP v2) |
| **Người soạn**    | TPM                                                                 |
| **Ký duyệt**      | PO / Chủ quán: HOANG · Tech Lead: HOANG                             |

---

## 1. Phạm vi freeze

Các file sau là **single source of truth** cho MVP v2 từ Phase 2 (refactor) trở đi:

| File                                             | Mô tả                     |
| ------------------------------------------------ | ------------------------- |
| [PRD.md](PRD.md)                                 | Yêu cầu sản phẩm          |
| [USER_STORIES.md](USER_STORIES.md)               | User stories + AC         |
| [SPRINT_PLAN.md](SPRINT_PLAN.md)                 | Lộ trình sprint           |
| [api/API_CONTRACT.md](api/API_CONTRACT.md)       | REST API contract         |
| [api/ERD.md](api/ERD.md)                         | Entity-relationship       |
| [DEVICE_POLICY.md](DEVICE_POLICY.md)             | Tablet trạm vs ĐT cá nhân |
| [BRANCH_ASSIGNMENT.md](BRANCH_ASSIGNMENT.md)     | Gán chi nhánh NV          |
| [TESTING.md](TESTING.md)                         | Chiến lược test           |
| [MOBILE_ARCHITECTURE.md](MOBILE_ARCHITECTURE.md) | Kiến trúc mobile          |
| [GO_LIVE_PLAN.md](GO_LIVE_PLAN.md)               | Refactor → go-live        |

**Tham chiếu nghiệp vụ:** [STAKEHOLDER_QUESTIONNAIRE.md](STAKEHOLDER_QUESTIONNAIRE.md) (MVP v2, cập nhật 2026-06-29).

---

## 2. Năm quyết định P0 ảnh hưởng code

| ID                | Quyết định                         | Tác động code                                                                                                |
| ----------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| **C-11**          | Bỏ màn chọn role                   | Routing theo `staff.role` từ `GET /auth/me`; xóa flow `(auth)/role.tsx`                                      |
| **A-09 / B-15**   | Tablet trạm + chọn NV              | Session trạm chung; `StaffPicker` + `actedByStaffId` trên thao tác quan trọng                                |
| **B-09 / FR-A04** | Tablet trạm Tab Thu ngân + Tab Bếp | Shell `isStationDevice`; Tab Bếp reuse queue barista (MAKING → READY) — **TASK-P2-03b**, PO duyệt 2026-06-29 |
| **B-18**          | Không offline                      | Mất mạng → vận hành thủ công; không offline queue MVP                                                        |
| **GAP-05**        | `deliveredAt` thay `SERVING`       | Gỡ enum `SERVING`; `POST /orders/{id}/deliver`; tab Chờ giao / Chờ thanh toán                                |
| **E-09**          | Pilot TM + CK                      | Payment pilot: tiền mặt + chuyển khoản VietQR; ví/cổng sau pilot                                             |

---

## 3. Freeze rule

Sau ngày freeze (**2026-06-29**):

1. Mọi **thay đổi nghiệp vụ** → ticket mới + **PO approve** + cập nhật `STAKEHOLDER_QUESTIONNAIRE.md` **trước** khi code.
2. Sửa doc kỹ thuật (typo, làm rõ contract) → PR doc + Tech Lead review; không đổi scope nghiệp vụ.
3. Code refactor Phase 2 **không** mở scope mới ngoài [GO_LIVE_PLAN.md](GO_LIVE_PLAN.md) Phase 2 — **ngoại lệ:** P2-03b (Tab Bếp trạm) bổ sung 2026-06-29, **PO duyệt**.

---

## 4. Ngoại lệ còn mở

| ID         | Mô tả                                                | Owner      | Deadline                          | Block refactor P2-01–05? |
| ---------- | ---------------------------------------------------- | ---------- | --------------------------------- | ------------------------ |
| **GAP-07** | OpenAPI `openapi.yaml` chưa generate                 | Tech Lead  | Cuối Sprint 3                     | **Không**                |
| **GAP-08** | Design PNG (`design/screens/01–28`) chưa commit repo | Designer   | Trước Sprint 2 UI (ưu tiên 01–15) | **Không**                |
| **GAP-11** | Tablet trạm thiếu Tab Bếp (hoàn thành món)           | Mobile dev | Phase 2 P2-03b                    | **Có** (E2E tablet)      |

Chi tiết: [STAKEHOLDER_QUESTIONNAIRE.md — Phần J](STAKEHOLDER_QUESTIONNAIRE.md#phần-j--mâu-thuẫn-tài-liệu-cần-chốt-gap).

---

## 5. Code vs docs (đã ghi nhận)

Docs đã sync; **code đang refactor Phase 2**:

- ~~`(auth)/role.tsx`~~ — ✅ P2-01: route theo `StaffRole`
- ~~Enum `SERVING`~~ — ✅ P2-02 (`deliveredAt` + `POST /orders/:id/deliver`)
- Tablet NV picker — ✅ P2-03
- Tablet Tab Bếp — ✅ P2-03b (`(station)/` shell)

→ Xem [CHANGELOG.md](../CHANGELOG.md) (mục Doc Freeze 2026-06-29) và Phase 2 trong [GO_LIVE_PLAN.md](GO_LIVE_PLAN.md).

---

## 6. Điều kiện mở Phase 2

- [x] Questionnaire P0 đã chốt
- [x] Doc Freeze Memo phát hành
- [x] PO + Tech Lead ký memo (PO: 2026-06-29)
- [x] Changelog nội bộ gửi team
- [x] GAP-07 / GAP-08 có owner + deadline

---

_Memo này khóa **tài liệu**, không khóa code. Tag git đề xuất: `docs-v2.0-mvp` trên commit doc sync 2026-06-29._
