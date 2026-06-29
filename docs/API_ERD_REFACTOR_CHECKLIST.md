# API / ERD — Xác nhận refactor scope (Phase 2)

**Ngày:** 2026-06-29  
**Vai trò:** Tech Lead / Senior Architect  
**Task:** TASK-P1-05  
**Input:** [API_CONTRACT.md](api/API_CONTRACT.md) · [ERD.md](api/ERD.md) · [MOBILE_ARCHITECTURE.md](MOBILE_ARCHITECTURE.md)

---

## Checklist xác nhận

| # | Câu hỏi | Kết quả | Ghi chú |
| - | ------- | ------- | ------- |
| 1 | `GET /auth/me` trả `staff.role` đủ cho routing không cần màn chọn role? | **✅ Đủ** | `MeResponseDto.staff.role` ∈ `OWNER \| MANAGER \| CASHIER \| BARISTA` — đủ cho post-login routing (C-11). OWNER thêm flow chọn CN phiên; staff dùng `branchId` đã gán. |
| 2 | `delivered_at` + `POST /deliver` đã mô tả đủ trong contract? | **⚠️ Một phần → ✅** | §1.7 + transition table có `deliveredAt`. **Đã bổ sung** §8.6 endpoint đầy đủ + §1.7.3 `OrderDto` fields. |
| 3 | `actedByStaffId` / audit cho tablet NV picker — API nhận field nào? | **⚠️ Thiếu → ✅** | **Đã bổ sung** §1.7.2 + field trên mutation DTOs. |

**Kết luận:** ERD đủ cho refactor P2-01–03. API_CONTRACT cần bổ sung nhỏ (đã apply trong cùng PR doc) trước TASK-P2-02 / P2-03.

---

## 1. Auth routing — `GET /auth/me`

**Xác nhận:** ✅ Khớp refactor scope.

```json
"staff": {
  "id": "uuid",
  "role": "CASHIER",
  "branchId": "uuid",
  "isActive": true
}
```

| Role | Route sau login (mobile) |
| ---- | ------------------------ |
| `OWNER` | Chọn CN (nếu cần) → owner dashboard |
| `MANAGER` | Manager dashboard (không chọn CASHIER/BARISTA card) |
| `CASHIER` / `BARISTA` | Tablet trạm tabs hoặc ĐT cá nhân theo DEVICE_POLICY |

**Không cần** field bổ sung trên `/auth/me` cho Phase 2.

---

## 2. Order lifecycle — `deliveredAt` + deliver endpoint

**ERD:** ✅ `orders.delivered_at` (timestamp, nullable) — [ERD.md §orders](api/ERD.md).

**API contract trước bổ sung:**

| Hạng mục | Trạng thái |
| -------- | ---------- |
| §1.7 state machine (không `SERVING`) | ✅ |
| Transition `POST /orders/{id}/deliver` (mention) | ✅ |
| Section endpoint §8.6 đầy đủ | ❌ → **đã thêm** |
| `OrderDto.deliveredAt` trong response | ❌ → **đã thêm** §1.9 |
| List filter `deliveredAt` null/set (tab Chờ giao / Chờ TT) | ❌ → **đã thêm** query `deliveryState` |

**Diff đã apply:** `docs/api/API_CONTRACT.md` §8.6, §1.7.3, DTO index.

---

## 3. Tablet NV picker — `actedByStaffId`

**Bối cảnh (B-15, A-09):** Tài khoản tablet trạm ≠ NV thực hiện. Audit phải ghi **NV được chọn**, không ghi account trạm.

**ERD:** `audit_logs.actor_id` → FK `staff.id`.

**Quy ước API (§1.7.2):**

| Request | Field | Bắt buộc khi |
| ------- | ----- | ------------ |
| `POST /orders` | `actedByStaffId` | Tablet trạm (station session) |
| `PATCH /orders/{id}/status` | `actedByStaffId` | Tablet trạm |
| `POST /orders/{id}/deliver` | `actedByStaffId` | Tablet trạm |
| `POST /orders/{id}/cancel` | `actedByStaffId` | Tablet trạm |
| `POST /payments` | `actedByStaffId` | Tablet trạm |

**ĐT cá nhân:** Bỏ qua field — server dùng `staffId` từ JWT.

**Validation:**

- `actedByStaffId` phải thuộc cùng `branchId` request
- Staff `isActive = true`
- Ghi `audit_logs.actor_id = actedByStaffId` (fallback JWT nếu không gửi)

---

## 4. Không block P2-01–05

| GAP | Block? |
| --- | ------ |
| GAP-07 OpenAPI generate | Không |
| GAP-08 Design PNG | Không |
| Contract gaps §8.6 / §1.7.2 | Không (đã bổ sung doc) |

---

## Sign-off

| Vai trò | Trạng thái | Ngày |
| ------- | ---------- | ---- |
| Tech Lead | ✅ Xác nhận (doc) | 2026-06-29 |
| Backend lead | _pending_ | |
| Mobile lead | _pending_ | |
