# CaffeApp — User Stories & Acceptance Criteria

**Format:** `US-{group}{seq}` — Given/When/Then  
**Estimation:** Story Points (Fibonacci)

**Quy ước API:** Base URL `/api/v1` — ví dụ `POST /api/v1/auth/login`.  
**Quy ước role:** `StaffRole` = `OWNER | MANAGER | CASHIER | BARISTA` (Prisma/API).  
**Quy ước enum đơn:** `OrderStatus` = `PENDING | MAKING | READY | PAID | CANCELLED`; `OrderType` = `DINE_IN | TAKE_AWAY`.

---

## Nhóm A — Đăng nhập & Phân quyền

### US-A01: Đăng nhập

**Là** nhân viên, **tôi muốn** đăng nhập bằng email/SĐT và mật khẩu, **để** truy cập app an toàn.

**Acceptance Criteria:**

- Given màn hình đăng nhập
- When nhập đúng credentials và nhấn "Đăng nhập"
- Then chuyển tới màn chọn chi nhánh (nếu >1) hoặc chọn vai trò
- And lưu JWT + refresh token securely (SecureStore)

- Given credentials sai
- When nhấn "Đăng nhập"
- Then hiện lỗi "Email hoặc mật khẩu không đúng"
- And không redirect

**Design:** `design/screens/01-dang-nhap.png`  
**API:** `POST /api/v1/auth/login`  
**Points:** 3

---

### US-A02: Chọn chi nhánh

**Là** nhân viên đa chi nhánh, **tôi muốn** chọn chi nhánh làm việc, **để** chỉ thấy dữ liệu đúng quán.

**Acceptance Criteria:**

- Given user có quyền >= 1 chi nhánh
- When chọn 1 chi nhánh và nhấn "Tiếp tục"
- Then lưu `branch_id` vào session
- And chuyển màn chọn vai trò

- Given user chỉ có 1 chi nhánh
- When đăng nhập thành công
- Then auto-select và skip màn này

**Design:** `design/screens/02-chon-chi-nhanh.png`  
**API:** `GET /api/v1/branches`  
**Points:** 2

---

### US-A03: Chọn vai trò

**Là** nhân viên, **tôi muốn** chọn vai trò trong ca (thu ngân/barista/quản lý), **để** vào đúng workflow.

**Acceptance Criteria:**

- Given user có role `cashier`
- When vào màn chọn vai trò
- Then chỉ hiện card Thu ngân (enabled); các role khác disabled hoặc ẩn

- Given chọn Thu ngân
- When tap card
- Then navigate tới Cashier home stack

**Design:** `design/screens/03-chon-vai-tro.png`  
**Points:** 2

---

### US-A04: Trang chủ Thu ngân

**Là** thu ngân, **tôi muốn** thấy quick actions, **để** bắt đầu ca nhanh.

**Acceptance Criteria:**

- Given đã chọn role cashier
- When vào trang chủ
- Then hiện greeting + tên user + chi nhánh
- And grid 6 actions: Tạo đơn, Danh sách đơn, Lịch sử, Sơ đồ bàn, Thông báo, Món đã xong
- And bottom tab navigation hoạt động

**Design:** `design/screens/04-trang-chu-thu-ngan.png`  
**Points:** 3

---

## Nhóm B — Thu ngân

### US-B01: Chọn loại đơn

**Là** thu ngân, **tôi muốn** chọn tại bàn hoặc mang đi, **để** workflow đúng loại phục vụ.

**Acceptance Criteria:**

- Given tap "Tạo đơn"
- When chọn "Uống tại bàn"
- Then navigate sơ đồ bàn với `order_type=DINE_IN`

- When chọn "Mang đi"
- Then navigate menu với `order_type=TAKE_AWAY`, skip chọn bàn

**Design:** `05-loai-don-hang.png` | **Points:** 2

---

### US-B02: Sơ đồ bàn

**Là** thu ngân, **tôi muốn** xem trạng thái bàn real-time, **để** biết bàn nào trống.

**Acceptance Criteria:**

- Given branch có N bàn
- When mở sơ đồ
- Then hiện grid bàn với màu: gray=EMPTY, green=OCCUPIED, orange=selected
- When chọn bàn EMPTY và nhấn "Chọn món"
- Then navigate menu với `table_id` set

- Given bàn OCCUPIED
- When tap
- Then hiện option "Xem đơn hiện tại" hoặc disable chọn

**Design:** `06-so-do-ban.png` | **API:** `GET /api/v1/tables` | **Points:** 5

---

### US-B03: Chọn món từ menu

**Là** thu ngân, **tôi muốn** browse menu theo danh mục, **để** thêm món vào đơn.

**Acceptance Criteria:**

- Given menu có categories
- When chọn tab "Cà phê"
- Then list chỉ món category coffee
- When tap "+" trên 1 món
- Then mở modal tùy chỉnh (US-B04)

**Design:** `07-chon-mon-ca-phe.png` | **API:** `GET /api/v1/products` | **Points:** 5

---

### US-B04: Tùy chỉnh món

**Là** thu ngân, **tôi muốn** chọn size/đường/đá, **để** barista pha đúng yêu cầu.

**Acceptance Criteria:**

- Given modal tùy chỉnh mở
- When chọn Size M, đường Ít, đá Ít, qty 2
- And nhấn "Thêm vào giỏ"
- Then item thêm vào cart với modifiers
- And đóng modal, cập nhật badge giỏ

**Design:** `08-tuy-chinh-mon.png` | **Points:** 5

---

### US-B05: Giỏ hàng & Gửi bếp

**Là** thu ngân, **tôi muốn** xem giỏ và gửi bếp, **để** barista bắt đầu pha.

**Acceptance Criteria:**

- Given giỏ có >= 1 món
- When nhấn "Gửi vào bếp"
- Then `POST /orders` status=PENDING
- And bàn chuyển OCCUPIED
- And barista nhận đơn < 3s

- Given giỏ rỗng
- When nhấn "Gửi vào bếp"
- Then button disabled + toast "Chưa có món"

**Design:** `09-gio-hang.png` | **API:** `POST /api/v1/orders` | **Points:** 8

---

### US-B06: Thanh toán tiền mặt

**Là** thu ngân, **tôi muốn** nhập tiền khách đưa, **để** tính tiền thừa chính xác.

**Acceptance Criteria:**

- Given đơn READY, tổng 130.000đ
- When nhập 150.000đ
- Then hiện tiền thừa 20.000đ
- When nhấn "Hoàn tất thanh toán"
- Then order chuyển `PAID` (terminal state MVP)

- Given nhập 100.000đ (< tổng)
- Then disable hoàn tất + lỗi "Số tiền không đủ"

**Design:** `10-thanh-toan-tien-mat.png` | **API:** `POST /api/v1/payments` | **Points:** 5

---

### US-B07: Thanh toán chuyển khoản

**Là** thu ngân, **tôi muốn** hiện QR chuyển khoản, **để** khách thanh toán không tiền mặt.

**Acceptance Criteria:**

- Given chọn phương thức Chuyển khoản
- Then hiện QR + STK + nút copy
- When nhấn "Xác nhận đã nhận"
- Then mark PAID (manual confirm MVP)

**Design:** `11-thanh-toan-chuyen-khoan.png` | **Points:** 3

---

### US-B08: Thanh toán thẻ

**Là** thu ngân, **tôi muốn** ghi nhận thanh toán thẻ, **để** đối soát cuối ngày.

**Acceptance Criteria:**

- Given chọn Thẻ
- When nhấn "Thanh toán thẻ"
- Then order PAID với `payment_method=CARD`

**Design:** `12-thanh-toan-the.png` | **Points:** 2

---

### US-B09: Thanh toán ví điện tử

**Là** thu ngân, **tôi muốn** chọn MoMo/ZaloPay, **để** linh hoạt phương thức.

**Acceptance Criteria:**

- Given chọn ví MoMo
- When xác nhận thanh toán
- Then PAID với `payment_method=E_WALLET`, `e_wallet_provider=MOMO`

**Design:** `13-thanh-toan-vi-dien-tu.png` | **Points:** 3

---

### US-B10: Danh sách đơn hàng

**Là** thu ngân, **tôi muốn** xem đơn đang phục vụ, **để** theo dõi trạng thái.

**Acceptance Criteria:**

- Given có đơn active trong chi nhánh
- When mở danh sách
- Then filter tabs: Tất cả / Đang phục vụ / Chờ thanh toán / Hoàn thành
- And mỗi card hiện #id, bàn, số món, tổng, status badge

**Design:** `14-danh-sach-don.png` | **API:** `GET /api/v1/orders` | **Points:** 5

---

### US-B11: Lịch sử đơn

**Là** thu ngân, **tôi muốn** xem lịch sử đơn trong ca, **để** tra cứu nhanh.

**Acceptance Criteria:**

- Given filter "Hôm nay"
- Then list đơn `PAID` sắp xếp mới nhất
- And hiện payment method + thời gian

**Design:** `15-lich-su-don.png` | **Points:** 3

---

## Nhóm C — Barista

### US-C01: Đơn chờ xử lý

**Là** barista, **tôi muốn** thấy hàng đợi đơn real-time, **để** biết làm gì tiếp theo.

**Acceptance Criteria:**

- Given có đơn PENDING
- When mở app barista
- Then list đơn sắp theo `created_at` ASC
- And đơn chờ > 5 phút có badge ưu tiên orange

- Given thu ngân vừa gửi bếp
- When trong 3s
- Then đơn xuất hiện trong list (WebSocket/Realtime)

**Design:** `16-barista-don-cho.png` | **API:** `GET /api/v1/orders?status=PENDING` + WS | **Points:** 8

---

### US-C02: Chi tiết đơn

**Là** barista, **tôi muốn** xem chi tiết món và ghi chú, **để** pha đúng.

**Acceptance Criteria:**

- Given tap đơn #1024
- Then hiện từng món + modifiers (size, đường, đá) + ghi chú đơn
- And nút "Bắt đầu pha" visible

**Design:** `17-barista-chi-tiet-don.png` | **Points:** 3

---

### US-C03: Đang pha chế

**Là** barista, **tôi muốn** check từng món khi xong, **để** theo dõi tiến độ.

**Acceptance Criteria:**

- Given nhấn "Bắt đầu pha"
- Then status `MAKING` + timer chạy
- When check hết món
- Then enable "Hoàn thành đơn"

**Design:** `18-barista-dang-pha.png` | **API:** `PATCH /api/v1/orders/{id}/status` | **Points:** 5

---

### US-C04: Hoàn thành đơn

**Là** barista, **tôi muốn** báo đơn sẵn sàng, **để** thu ngân biết giao khách.

**Acceptance Criteria:**

- Given tất cả món checked
- When nhấn "Hoàn thành đơn"
- Then status READY
- And push notification tới thu ngân

**Design:** `19-barista-hoan-thanh.png` | **Points:** 3

---

## Nhóm D — Quản lý

### US-D01: Dashboard

**Là** quản lý, **tôi muốn** xem doanh thu hôm nay, **để** nắm tình hình kinh doanh.

**Acceptance Criteria:**

- Given có đơn PAID hôm nay
- When mở dashboard
- Then hiện tổng doanh thu, số đơn, số khách
- And bar chart doanh thu theo giờ

**Design:** `20-dashboard-quan-ly.png` | **API:** `GET /api/v1/reports/revenue` | **Points:** 8

---

### US-D02: Báo cáo doanh thu

**Là** quản lý, **tôi muốn** xem báo cáo theo ngày, **để** phân tích xu hướng.

**Acceptance Criteria:**

- Given chọn range 01/06–25/06
- Then hiện tổng + breakdown theo payment method
- And top selling items

**Design:** `21-bao-cao-doanh-thu.png` | **API:** `GET /api/v1/reports/revenue` | **Points:** 5

---

### US-D03: Lịch sử ca làm

**Là** quản lý, **tôi muốn** xem ca hiện tại và lịch sử, **để** đối soát doanh thu/ca.

**Acceptance Criteria:**

- Given ca sáng đang active
- Then hiện staff, thời gian, doanh thu ca
- And nút "Kết ca" (manager only)

**Design:** `22-lich-su-ca-lam.png` | **Points:** 5

---

### US-D04: Quản lý menu

**Là** quản lý, **tôi muốn** thêm/sửa món, **để** cập nhật menu quán.

**Acceptance Criteria:**

- Given form thêm món hợp lệ
- When nhấn "Lưu món"
- Then `POST /api/v1/products` thành công
- And món xuất hiện trong menu thu ngân

**Design:** `23-quan-ly-menu.png` | **API:** `POST /api/v1/products` | **Points:** 5

---

### US-D05: Danh sách nhân viên

**Là** quản lý, **tôi muốn** xem danh sách NV, **để** quản lý nhân sự.

**Acceptance Criteria:**

- Given có nhân viên trong chi nhánh
- Then list với avatar, tên, role, status (đang làm/nghỉ)

**Design:** `24-danh-sach-nhan-vien.png` | **API:** `GET /api/v1/staff` | **Points:** 3

---

### US-D06: Chi tiết nhân viên

**Là** quản lý, **tôi muốn** xem profile NV, **để** tra cứu ca và liên hệ.

**Acceptance Criteria:**

- Given tap 1 nhân viên
- Then hiện SĐT, email, chi nhánh, lịch ca tuần

**Design:** `25-chi-tiet-nhan-vien.png` | **Points:** 3

---

## Nhóm E — Khác

### US-E01: Quản lý bàn

**Là** quản lý, **tôi muốn** đặt bàn bảo trì, **để** thu ngân không chọn nhầm.

**Acceptance Criteria:**

- Given toggle bàn B08 sang MAINTENANCE
- Then bàn hiện wrench icon trên sơ đồ thu ngân
- And không thể chọn để tạo đơn mới

**Design:** `26-quan-ly-ban.png` | **API:** `PATCH /api/v1/tables/{id}` | **Points:** 3

---

### US-E02: Thông báo

**Là** nhân viên, **tôi muốn** nhận thông báo đơn/cảnh báo, **để** phản ứng kịp thời.

**Acceptance Criteria:**

- Given đơn READY
- Then thu ngân nhận notification trong app
- And feed hiện item với timestamp

**Design:** `27-thong-bao.png` | **Points:** 5

---

### US-E03: Cài đặt

**Là** nhân viên, **tôi muốn** đổi mật khẩu và đăng xuất, **để** bảo mật tài khoản.

**Acceptance Criteria:**

- Given nhấn "Đăng xuất"
- Then clear tokens + redirect login
- Given đổi MK thành công
- Then toast confirm + optional re-login

**Design:** `28-cai-dat.png` | **API:** `POST /api/v1/auth/logout` | **Points:** 3

---

## Tổng hợp Story Points

| Nhóm      | Stories | Total Points |
| --------- | ------- | ------------ |
| A         | 4       | 10           |
| B         | 11      | 43           |
| C         | 4       | 19           |
| D         | 6       | 29           |
| E         | 3       | 11           |
| **Total** | **28**  | **112**      |

**Velocity giả định:** 20 points/sprint → ~6 sprints (khớp plan)
