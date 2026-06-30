# CaffeApp — Demo Script Nội Bộ Phase 3

**Mục tiêu:** chạy 5 luồng pilot chính trong 30–45 phút trước khi mời Owner/QL UAT.  
**Môi trường:** staging API + mobile build staging trên ít nhất 1 tablet Android thật.  
**Ngày chuẩn bị:** 2026-06-30.  
**Trạng thái:** repo-side ready; buổi demo thật, video và sign-off vẫn pending.

---

## 1. Chuẩn bị trước demo

### Thiết bị và mạng

- 1 tablet Android thật cài staging build, đăng nhập station account.
- 1 điện thoại hoặc emulator cho Owner/Manager.
- WiFi văn phòng/quán mô phỏng điều kiện vận hành.
- Screen recording bật trên tablet trong toàn bộ luồng 2–4.

### Data staging bắt buộc

Chạy trước:

```powershell
npm run phase3:verify-staging-data
```

Kỳ vọng repo seed:

| Hạng mục      | Kỳ vọng                                           |
| ------------- | ------------------------------------------------- |
| Chi nhánh     | 3 CN: q1, q3, q7                                  |
| Bàn           | 50 bàn/CN sau `db:seed:staging`                   |
| Menu          | 8 category, 38 món/CN                             |
| Staff         | Manager, cashier, barista, station account mỗi CN |
| Thanh toán CK | `bankInfo` đầy đủ cho VietQR từng CN              |

### Tài khoản demo

Mật khẩu mặc định khi seed: `STAGING_SEED_PASSWORD` hoặc `password123`. Đổi trước UAT thật.

| Role              | Tài khoản gợi ý        |
| ----------------- | ---------------------- |
| Owner             | `owner@caffe.app`      |
| Manager Q1        | `manager.q1@caffe.app` |
| Cashier Q1        | `cashier.q1@caffe.app` |
| Barista Q1        | `barista.q1@caffe.app` |
| Tablet station Q1 | `station.q1@caffe.app` |

### Test data trong demo

| Dữ liệu      | Giá trị đề xuất                                  |
| ------------ | ------------------------------------------------ |
| Chi nhánh    | CN Quận 1                                        |
| Bàn          | B01 hoặc bàn trống đầu tiên                      |
| Món 1        | Phin Sữa Đá                                      |
| Món 2        | Croissant                                        |
| Thanh toán   | 1 đơn tiền mặt, 1 đơn chuyển khoản VietQR        |
| Staff picker | Cashier Q1 cho order/payment; Barista Q1 cho bếp |

---

## 2. Timeline 30–45 phút

| Phần                                        | Thời lượng | Người chạy |
| ------------------------------------------- | ---------: | ---------- |
| Setup, login, kiểm dữ liệu                  |     5 phút | Dev/QA     |
| Flow 1 Owner login + chọn CN                |     5 phút | PO/QA      |
| Flow 2 Tablet order bàn + chọn NV + gửi bếp |     8 phút | QA         |
| Flow 3 Bếp MAKING → READY → Đã giao         |     8 phút | QA/Dev     |
| Flow 4 Thanh toán TM + CK VietQR            |    10 phút | QA         |
| Flow 5 Manager dashboard doanh thu          |     5 phút | PO/QA      |
| Tổng hợp bug/scope gap                      |     5 phút | TPM        |

---

## 3. Flow 1 — Owner Login + Chọn CN

| #   | Role / thiết bị             | Bước                                    | Expected UI                                   | Evidence               |
| --- | --------------------------- | --------------------------------------- | --------------------------------------------- | ---------------------- |
| 1   | Owner / phone hoặc emulator | Mở app staging, login `owner@caffe.app` | Login thành công, không vào màn chọn role     | Screenshot home/branch |
| 2   | Owner                       | Chọn CN Quận 1                          | Session active branch = CN Quận 1             | Screenshot tên CN      |
| 3   | Owner                       | Quay lại/chuyển CN nếu UI hỗ trợ        | Owner có quyền đổi CN; staff không tự chọn CN | Ghi chú pass/fail      |

Pass nếu Owner vào được branch đúng và không còn màn chọn role cũ.

---

## 4. Flow 2 — Tablet Order Bàn → Chọn NV → Gửi Bếp

| #   | Role / thiết bị | Bước                              | Expected UI                                | Evidence        |
| --- | --------------- | --------------------------------- | ------------------------------------------ | --------------- |
| 1   | Tablet station  | Login `station.q1@caffe.app`      | Vào shell tablet trạm có tab Thu ngân/Bếp  | Video           |
| 2   | Tablet station  | Mở sơ đồ bàn, chọn B01 đang trống | Bàn hiển thị trống, có thể tạo đơn         | Video           |
| 3   | Tablet station  | Chọn loại dùng tại bàn            | Vào menu của CN Quận 1                     | Video           |
| 4   | Tablet station  | Thêm Phin Sữa Đá + Croissant      | Giỏ hàng có VAT/tổng tiền đúng             | Screenshot cart |
| 5   | Tablet station  | Bấm gửi bếp/tạo đơn               | Staff picker xuất hiện                     | Video           |
| 6   | Tablet station  | Chọn Cashier Q1                   | API tạo order PENDING; bàn chuyển OCCUPIED | Order number    |

Pass nếu đơn tạo thành công, không crash, audit dùng `actedByStaffId` đã chọn.

---

## 5. Flow 3 — Bếp MAKING → READY → Đã Giao

| #   | Role / thiết bị                           | Bước                | Expected UI                                | Evidence   |
| --- | ----------------------------------------- | ------------------- | ------------------------------------------ | ---------- |
| 1   | Tablet station tab Bếp hoặc Barista phone | Mở hàng đợi bếp     | Thấy đơn mới PENDING                       | Video      |
| 2   | Bếp                                       | Bấm bắt đầu pha     | Đơn chuyển MAKING                          | Video      |
| 3   | Bếp                                       | Bấm hoàn thành      | Đơn chuyển READY                           | Video      |
| 4   | Thu ngân                                  | Mở tab đơn chờ giao | Đơn READY hiển thị ở nhóm chờ giao         | Screenshot |
| 5   | Thu ngân                                  | Bấm Đã giao         | `deliveredAt` được set; đơn chờ thanh toán | Screenshot |

Pass nếu không còn trạng thái `SERVING` trong UI/API response và flow giao món không tạo order mới.

---

## 6. Flow 4 — Thanh Toán TM + CK VietQR

### 4A. Tiền mặt

| #   | Role / thiết bị | Bước                 | Expected UI                             | Evidence           |
| --- | --------------- | -------------------- | --------------------------------------- | ------------------ |
| 1   | Thu ngân        | Mở đơn đã giao       | Có breakdown subtotal/VAT/tổng          | Screenshot         |
| 2   | Thu ngân        | Chọn Tiền mặt        | Chỉ thấy phương thức pilot TM + CK      | Screenshot         |
| 3   | Thu ngân        | Nhập/confirm số tiền | Thanh toán thành công, order PAID       | Screenshot receipt |
| 4   | Thu ngân        | Quay lại sơ đồ bàn   | Bàn về trống nếu không còn order active | Video              |

### 4B. Chuyển khoản VietQR

Tạo một đơn thứ hai tương tự Flow 2–3, sau đó:

| #   | Role / thiết bị | Bước                               | Expected UI                         | Evidence      |
| --- | --------------- | ---------------------------------- | ----------------------------------- | ------------- |
| 1   | Thu ngân        | Mở payment, chọn Chuyển khoản      | Hiện QR VietQR theo `bankInfo` CN   | Screenshot QR |
| 2   | Thu ngân        | Đối chiếu STK/holder trên màn hình | STK khớp seed CN Quận 1             | Screenshot    |
| 3   | Thu ngân        | Xác nhận đã nhận CK                | Payment `BANK_TRANSFER`, order PAID | Screenshot    |

Pass nếu app không còn hiển thị Thẻ/Ví ở pilot và API từ chối phương thức ngoài TM/CK.

---

## 7. Flow 5 — Manager Dashboard Doanh Thu

| #   | Role / thiết bị       | Bước                        | Expected UI                                        | Evidence   |
| --- | --------------------- | --------------------------- | -------------------------------------------------- | ---------- |
| 1   | Manager Q1 hoặc Owner | Login vào dashboard manager | Thấy thẻ Doanh thu hôm nay                         | Screenshot |
| 2   | Manager Q1            | Chọn/giữ CN Quận 1          | Revenue scope theo CN                              | Screenshot |
| 3   | Manager Q1            | Refresh sau 1–2 đơn PAID    | Số đơn/tổng doanh thu tăng theo đơn vừa thanh toán | Screenshot |

Nếu Sprint 5 dashboard chưa bật trong build demo, ghi `N/A` vào minutes, kèm lý do và ticket liên quan. Không block Flow 1–4.

---

## 8. Checklist Pass/Fail tại buổi demo

| Gate                                  | Pass/Fail | Ghi chú |
| ------------------------------------- | --------- | ------- |
| 5 luồng demo không crash              |           |         |
| Không bug Critical/High mở            |           |         |
| UI khớp design màn pilot >= 90%       |           |         |
| Offline/network error có thông báo rõ |           |         |
| PO nội bộ đồng ý vào UAT              |           |         |

Sau demo, tạo `docs/DEMO_MINUTES_YYYY-MM-DD.md` từ template `docs/DEMO_MINUTES_TEMPLATE.md`.
