# CaffeApp — Copy Review Phase 3

**Mục tiêu:** rà soát bản nháp tiếng Việt cho màn pilot 01–15 trước UAT.  
**Liên quan:** GO_LIVE_PLAN TASK-P3-05, Questionnaire H-13.  
**Ngày chuẩn bị:** 2026-06-30.  
**Trạng thái:** repo-side checklist ready; PO/QL duyệt trên thiết bị thật vẫn pending.

---

## 1. Thuật ngữ chuẩn

| Khái niệm           | Copy dùng trong app                        |
| ------------------- | ------------------------------------------ |
| Cash                | Tiền mặt                                   |
| Bank transfer       | Chuyển khoản                               |
| VietQR              | VietQR                                     |
| Delivered           | Đã giao                                    |
| Waiting delivery    | Chờ giao                                   |
| Waiting payment     | Chờ thanh toán                             |
| Kitchen             | Bếp                                        |
| Cashier             | Thu ngân                                   |
| Barista             | Pha chế                                    |
| Manager             | Quản lý                                    |
| Owner               | Chủ quán                                   |
| Branch              | Chi nhánh / CN                             |
| Station tablet      | Tablet trạm                                |
| Network unavailable | Không tải được... / Mất mạng dùng SOP giấy |

Không dùng lẫn:

- `SERVING` trên UI.
- Thẻ/Ví điện tử trong pilot payment.
- "Chọn role" sau login.

---

## 2. Static scan repo-side

Các điểm đã thấy trong code hiện tại:

- Core error screens dùng mẫu `Không tải được ...` và có nút retry.
- Payment pilot hiển thị Tiền mặt + Chuyển khoản; phương thức Thẻ/Ví đã ẩn khỏi mobile pilot.
- Kitchen/order flow dùng `Đã giao`, `Chờ giao`, `Chờ thanh toán`.
- Manager dashboard có copy `Doanh thu hôm nay`, `đơn đã thanh toán`.
- Owner/staff branch assignment dùng `Chủ quán`, `quản lý`, `chi nhánh`.

Chưa thể chốt 100% nếu chưa xem trên tablet thật vì cần kiểm:

- Text có bị cắt ở tablet 8–10 inch không.
- QR/payment screen có đủ STK/holder/amount rõ ràng không.
- Network loss copy có đủ rõ để NV chuyển sang SOP giấy không.

---

## 3. Checklist màn pilot 01–15

| #   | Màn hình             | Checklist copy                                     | Kết quả               | Ghi chú |
| --- | -------------------- | -------------------------------------------------- | --------------------- | ------- |
| 01  | Login                | Email/mật khẩu rõ, lỗi đăng nhập dễ hiểu           | Pending device review |         |
| 02  | Owner chọn CN        | Dùng `Chi nhánh`/`CN` nhất quán                    | Pending device review |         |
| 03  | Home quick actions   | Action ngắn, không lẫn vai trò                     | Pending device review |         |
| 04  | Chọn loại đơn        | `Tại bàn` / `Mang đi` rõ                           | Pending device review |         |
| 05  | Sơ đồ bàn            | Trạng thái bàn rõ, bàn maintenance dễ hiểu         | Pending device review |         |
| 06  | Menu                 | Tên món, giá, hết hàng rõ                          | Pending device review |         |
| 07  | Giỏ hàng             | VAT/tổng tiền rõ, notes không gây hiểu nhầm        | Pending device review |         |
| 08  | Staff picker         | `Chọn nhân viên thao tác` rõ với tablet trạm       | Pending device review |         |
| 09  | Danh sách đơn        | Tab chờ giao/chờ thanh toán rõ                     | Pending device review |         |
| 10  | Chi tiết đơn         | Trạng thái PENDING/MAKING/READY được Việt hóa      | Pending device review |         |
| 11  | Thanh toán tiền mặt  | Tiền mặt, tiền thối, xác nhận rõ                   | Pending device review |         |
| 12  | Thanh toán CK VietQR | STK, chủ TK, số tiền, xác nhận CK rõ               | Pending device review |         |
| 13  | Bếp queue            | Bắt đầu pha, Hoàn thành, READY rõ                  | Pending device review |         |
| 14  | Manager dashboard    | Doanh thu, số đơn, scope CN rõ                     | Pending device review |         |
| 15  | Mất mạng/SOP         | Thông báo rõ: app không offline-first, chuyển giấy | Pending device review |         |

---

## 4. Copy fixes phát sinh

| ID       | Màn hình | Copy hiện tại | Đề xuất | Severity | Phase   |
| -------- | -------- | ------------- | ------- | -------- | ------- |
| COPY-001 |          |               |         | S4       | Phase 5 |

Không có code fix copy mới được xác định trong static scan ngày 2026-06-30. Bảng này dùng để ghi phát hiện khi chạy demo trên thiết bị thật.
