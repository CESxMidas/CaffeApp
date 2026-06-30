# Chính sách thiết bị & đăng nhập (Device Policy)

**Version:** 2.0  
**Áp dụng:** MVP v2 — aligned [STAKEHOLDER_QUESTIONNAIRE.md](STAKEHOLDER_QUESTIONNAIRE.md)  
**Liên quan:** [BRANCH_ASSIGNMENT.md](BRANCH_ASSIGNMENT.md), [MOBILE_ARCHITECTURE.md](MOBILE_ARCHITECTURE.md)

---

## 1. Mô hình thiết bị

CaffeApp dùng **một codebase** cho mọi thiết bị. Phân luồng bằng **`StaffRole`** (JWT) + thiết bị vật lý.

| Thiết bị                               | Số lượng/CN | Tài khoản                   | Sau login                                        |
| -------------------------------------- | ----------- | --------------------------- | ------------------------------------------------ |
| **Tablet trạm** (quầy + bếp chung khu) | 1           | Tài khoản **trạm** (shared) | Tab Thu ngân + Bếp; chọn **tên NV** mỗi thao tác |
| **ĐT cá nhân** NV vận hành             | 1–2         | Login **cá nhân**           | Thông báo, Món đã xong, hỗ trợ quầy              |
| **ĐT cá nhân** QL / Chủ                | 1+          | Login **cá nhân**           | Dashboard / Owner tools                          |

**Pilot (A-09):** Android ưu tiên; WiFi ổn định — **không offline-first** (B-18).

---

## 2. Quyết định MVP v2 (đã chốt)

### Tablet trạm: tài khoản chung + chọn tên NV

|               |                                                                                       |
| ------------- | ------------------------------------------------------------------------------------- |
| **Chọn**      | 1 tài khoản trạm/CN; NV chọn tên mình khi order / thanh toán / hủy đơn                |
| **Lý do**     | 2 NV vừa pha vừa thu ngân; giảm login đầu ca; audit qua `actorId` từ bước xác nhận NV |
| **Trade-off** | Phụ thuộc NV chọn đúng tên — training + audit                                         |

### Tablet trạm: Tab Thu ngân + Tab Bếp (B-09, FR-A04)

|                     |                                                                                                                            |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Chọn**            | Cùng 1 tablet: **Tab Thu ngân** (order, thanh toán) + **Tab Bếp** (queue pha chế, hoàn thành món → READY)                  |
| **Lý do**           | Quầy + bếp chung khu; NV không đổi máy giữa gửi bếp và đánh dấu pha xong                                                   |
| **Implementation**  | `isStationDevice` → shell trạm; Tab Bếp **reuse** màn barista (`queue`, `order/[id]`); picker NV trên thao tác bếp (P2-03) |
| **Khác ĐT barista** | ĐT `barista@` cá nhân: vẫn `/(barista)/` riêng; không Tab Thu ngân                                                         |

> **GAP-11 / TASK-P2-03b:** ✅ Implemented 2026-06-29 — `(station)/` shell + Tab Bếp.

### ĐT cá nhân: login cá nhân

|           |                                                              |
| --------- | ------------------------------------------------------------ |
| **Chọn**  | Mỗi NV có tài khoản riêng trên điện thoại                    |
| **Lý do** | Push notification, phiên cá nhân, auto logout cuối ca (B-11) |

### Không dùng trong MVP

| Phương án                                    | Lý do                                   |
| -------------------------------------------- | --------------------------------------- |
| Màn **chọn vai trò** (card Thu ngân/Barista) | Đã bỏ — routing theo `StaffRole` (C-11) |
| Offline queue khi mất mạng                   | Vận hành thủ công (B-18)                |
| Kiosk PIN thay login                         | Post-MVP                                |

---

## 3. Quy trình đầu ca / cuối ca

### Tablet trạm (đầu ca)

1. Mở app — đăng nhập **tài khoản trạm** (hoặc phiên còn hiệu lực)
2. Chuyển **Tab Thu ngân** hoặc **Tab Bếp** theo việc đang làm
3. Mỗi thao tác: chọn **tên NV** xác nhận

### Tablet trạm (cuối ca)

1. Nhắc đổi ca / bàn giao (B-11)
2. **Không** auto logout — máy chung giữ phiên trạm

### ĐT cá nhân NV / QL

1. Login cá nhân đầu ca
2. Nhận push / xem Món đã xong
3. Cuối ca: nhắc logout; auto logout sau mốc ca +10p (B-11)

---

## 4. Bảo mật

- **API** enforce quyền theo JWT `StaffRole` — không tin client-only context
- Thao tác audit: lưu `actorId` = NV được chọn ở bước xác nhận (tablet trạm)
- Session: access 15 phút + refresh; session tối đa 8h (C-04, C-05)

---

## 5. Real-time & mạng

| Giai đoạn  | Cơ chế                                        |
| ---------- | --------------------------------------------- |
| Sprint 2–3 | Polling 3–5s (sơ đồ bàn, queue bếp)           |
| Sprint 4+  | WebSocket + polling 10s fallback (F-01, F-16) |
| Mất mạng   | App không dùng — quy trình giấy/tay tại quán  |

---

## 6. Post-MVP

- Kiosk: màn cố định + PIN chọn NV
- Đăng ký thiết bị (`deviceId`) gắn chi nhánh
- Offline draft sync (đã từ chối cho MVP)
