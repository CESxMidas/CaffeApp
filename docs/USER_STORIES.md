# CaffeApp — User Stories & Acceptance Criteria

**Format:** `US-{group}{seq}` — Given/When/Then  
**Estimation:** Story Points (Fibonacci)  
**Nguồn nghiệp vụ:** [STAKEHOLDER_QUESTIONNAIRE.md](STAKEHOLDER_QUESTIONNAIRE.md) (MVP v2)

**Quy ước API:** Base URL `/api/v1` — ví dụ `POST /api/v1/auth/login`.  
**Quy ước role:** `StaffRole` = `OWNER | MANAGER | CASHIER | BARISTA` (Prisma/API).  
**Quy ước enum đơn:** `OrderStatus` = `PENDING | MAKING | READY | PAID | CANCELLED`; `deliveredAt` = đã giao món (B-33).  
**Quy ước routing:** Không màn chọn vai trò — điều hướng theo `StaffRole` (C-11).

---

## Nhóm A — Đăng nhập & Phân quyền

### US-A01: Đăng nhập

**Là** nhân viên, **tôi muốn** đăng nhập bằng email/SĐT và mật khẩu, **để** truy cập app an toàn.

**Acceptance Criteria:**

- Given màn hình đăng nhập
- When nhập đúng credentials và nhấn "Đăng nhập"
- Then OWNER (nếu cần) → màn chọn chi nhánh phiên → dashboard chủ quán
- And CASHIER/BARISTA/MANAGER → vào khu vận hành / quản lý theo CN đã gán (không chọn CN)
- And lưu JWT + refresh token securely (SecureStore)

- Given credentials sai
- When nhấn "Đăng nhập"
- Then hiện lỗi "Email hoặc mật khẩu không đúng"
- And không redirect

**Design:** `design/screens/01-dang-nhap.png`  
**API:** `POST /api/v1/auth/login`  
**Points:** 3

---

### US-A02: Chọn chi nhánh (chỉ Owner)

**Là** chủ quán, **tôi muốn** chọn chi nhánh làm việc trong phiên, **để** xem báo cáo đúng quán.

**Acceptance Criteria:**

- Given user có `StaffRole = OWNER`
- When chọn 1 chi nhánh và nhấn "Tiếp tục"
- Then lưu `branch_id` phiên vào session
- And chuyển dashboard / owner tools

- Given user có `StaffRole` ≠ OWNER
- When đăng nhập thành công với `branch_assignment = APPROVED`
- Then **không** hiện màn chọn chi nhánh — dùng CN từ DB

- Given `branch_assignment = PENDING_OWNER`
- When đăng nhập
- Then chặn với message chờ chủ quán duyệt

**Design:** `design/screens/02-chon-chi-nhanh.png` (Owner only)  
**API:** `GET /api/v1/branches`  
**Points:** 2

---

### US-A03: Điều hướng sau đăng nhập

**Là** nhân viên, **tôi muốn** vào đúng khu làm việc ngay sau login, **để** không phải chọn vai trò thủ công.

**Acceptance Criteria:**

- Given `StaffRole = CASHIER` hoặc `BARISTA`
- When đăng nhập thành công
- Then vào **tablet trạm**: tab Thu ngân + Bếp (không màn `03-chon-vai-tro`)
- And tab **Bếp** có queue + "Bắt đầu pha" / "Hoàn thành đơn" (READY) **giống** ĐT barista (B-09, TASK-P2-03b)
- And mỗi thao tác nhạy cảm hiện bước chọn tên NV (B-15)

- Given `StaffRole = MANAGER`
- Then vào dashboard quản lý CN đã gán

- Given `StaffRole = OWNER` đã chọn CN phiên
- Then vào dashboard chuỗi / owner tools

> **Deprecated:** Màn chọn card Thu ngân/Barista/Quản lý — thay bằng routing cố định (C-11).

**Design:** `design/screens/03-chon-vai-tro.png` (deprecated UI — giữ file tham chiếu)  
**Points:** 2

---

### US-A04: Trang chủ Thu ngân

**Là** thu ngân, **tôi muốn** thấy quick actions, **để** bắt đầu ca nhanh.

**Acceptance Criteria:**

- Given đã đăng nhập với quyền vận hành trạm
- When vào trang chủ Thu ngân
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

**Priority pilot:** Could — ghi nhận thủ công sau khi quẹt POS riêng (E-08).

**Acceptance Criteria:**

- Given chọn Thẻ
- When nhấn "Thanh toán thẻ" (sau khi quẹt máy POS ngoài app)
- Then order PAID với `payment_method=CARD`

**Design:** `12-thanh-toan-the.png` | **Points:** 2

---

### US-B09: Thanh toán ví / cổng (post-pilot)

**Là** thu ngân, **tôi muốn** có lựa chọn mở rộng thanh toán ví/cổng sau pilot, **để** linh hoạt phương thức khi quán cần.

**Priority pilot:** Out of pilot — MVP/pilot dùng **Tiền mặt + Chuyển khoản VietQR**. Không triển khai cổng online.

**Acceptance Criteria:**

- Given đang ở pilot
- When mở màn thanh toán
- Then chỉ hiển thị Tiền mặt và Chuyển khoản VietQR

- Given sau pilot có quyết định mở rộng cổng thanh toán
- When chọn nhà cung cấp mới
- Then cập nhật API/payment method riêng sau khi có yêu cầu nghiệp vụ mới

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

- Given tablet trạm (`isStationDevice`)
- When mở tab **Bếp**
- Then thấy queue PENDING / MAKING / READY và thao tác pha **giống** US-C01–C04 trên ĐT barista
- And mỗi cập nhật trạng thái bếp hiện **StaffPicker** (B-15)

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
- Given nhập MK cũ + MK mới hợp lệ
- When nhấn "Gửi mã xác nhận"
- Then hệ thống gửi mã 6 số về email đăng nhập
- Given nhập đúng mã còn hạn
- Then đổi MK thành công, toast confirm, và quản lý/chủ quán nhận notification bảo mật

**Design:** `28-cai-dat.png` | **API:** `POST /api/v1/auth/change-password`, `POST /api/v1/auth/change-password/confirm`, `POST /api/v1/auth/logout` | **Points:** 3

---

## Nhóm F — Pilot Hardening (bổ sung sau PM gate review 2026-07-07)

> Các story dưới đây phát sinh từ rà soát vận hành trước đóng gói pilot, **không** nằm trong 112 điểm plan gốc. Đã code + verify tầng API; dùng làm test case thủ công cho tầng UI. Tham chiếu edge case: PRD §5 EC-11/EC-12/EC-13.

### US-F01: Hủy thanh toán (void)

**Là** quản lý, **tôi muốn** hủy một thanh toán bị ghi nhầm, **để** đơn quay lại chờ thanh toán và két không lệch (EC-11).

**Acceptance Criteria:**

- Given đơn đã `PAID`, đăng nhập vai trò MANAGER/OWNER
- When mở chi tiết đơn → nhập lý do < 5 ký tự → nhấn "Hủy thanh toán"
- Then bị chặn với lỗi "Lý do hủy cần ít nhất 5 ký tự"

- Given nhập lý do hợp lệ và xác nhận dialog
- Then payment bị xóa, đơn quay lại `READY`, bàn `OCCUPIED` lại
- And thao tác (kèm snapshot số tiền + lý do) được ghi vào audit log

- Given vai trò CASHIER
- Then **không** thấy nút "Hủy thanh toán"

**API:** `POST /api/v1/payments/{paymentId}/void` | **Points:** 3

---

### US-F02: Đối soát kết ca

**Là** quản lý, **tôi muốn** xem tiền mặt dự kiến và các chuyển khoản chưa xác nhận trước khi đóng ca, **để** đối chiếu với két thực tế (EC-08/EC-13).

**Acceptance Criteria:**

- Given ca đang mở có đơn đã thanh toán
- When mở màn Ca làm việc
- Then card "Đối soát ca" hiện: tiền mặt dự kiến (đã trừ tiền thối), tổng CK, số đơn từng loại
- And liệt kê các CK **chưa xác nhận** với nút "Đã nhận"

- Given nhấn "Đã nhận" trên 1 giao dịch CK
- Then giao dịch đó biến khỏi danh sách chưa xác nhận

- Given còn CK chưa xác nhận
- When nhấn "Đóng ca"
- Then hiện cảnh báo confirm số lượng CK chưa xác nhận trước khi cho đóng

**API:** `GET /api/v1/shifts/{shiftId}/reconciliation`, `POST /api/v1/payments/{paymentId}/verify` | **Points:** 3

---

### US-F03: Báo hết món tại quầy

**Là** thu ngân/barista, **tôi muốn** báo hết một món ngay trên menu, **để** không nhận thêm đơn món đó giữa ca cao điểm (EC-12).

**Acceptance Criteria:**

- Given menu thu ngân đang mở
- When nhấn "Báo hết món" trên 1 món
- Then món mờ đi, ẩn nút thêm vào giỏ, hiện nhãn "Hết món · chạm để mở bán lại"
- And món vẫn hiển thị (không biến mất) để có thể mở bán lại

- Given món đang hết
- When nhấn để mở bán lại
- Then món trở về trạng thái bán bình thường

**API:** `PATCH /api/v1/products/{productId}/availability` | **Points:** 2

---

### US-F04: Khả năng chịu lỗi khi mất mạng

**Là** nhân viên, **tôi muốn** biết rõ khi mất kết nối và không mất giỏ hàng đang tạo, **để** không thao tác nhầm hoặc thu tiền 2 lần (EC-01/EC-10).

**Acceptance Criteria:**

- Given mất kết nối máy chủ
- Then banner đỏ "Mất kết nối máy chủ" hiện trên mọi màn hình

- Given đang có giỏ hàng nháp
- When app bị kill hoặc hết session rồi mở lại
- Then giỏ hàng nháp vẫn còn (lưu mã hóa qua SecureStore)

- Given mạng chập chờn khi bấm thanh toán, request đầu đã xử lý ở server
- When bấm lại lần 2 và nhận lỗi "Đơn đã thanh toán"
- Then app coi là **thành công** (không báo lỗi, không thu 2 lần)

**Points:** 2

---

## Tổng hợp Story Points

| Nhóm            | Stories | Total Points |
| --------------- | ------- | ------------ |
| A               | 4       | 10           |
| B               | 11      | 43           |
| C               | 4       | 19           |
| D               | 6       | 29           |
| E               | 3       | 11           |
| **MVP total**   | **28**  | **112**      |
| F (hardening)   | 4       | 10           |
| **Grand total** | **32**  | **122**      |

**Velocity giả định:** 20 points/sprint → ~6 sprints (khớp plan). Nhóm F là công việc hardening sau plan gốc.
