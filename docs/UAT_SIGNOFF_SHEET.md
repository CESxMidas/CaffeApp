# CaffeApp — UAT Sign-off Sheet

**Phase:** 4 — UAT / Demo cho chủ quán test  
**Môi trường:** staging  
**Ngày:** YYYY-MM-DD  
**Build mobile:**  
**API commit/tag:**  
**Thiết bị:** tablet, Owner phone, QL phone  
**Người chấm:** Owner, QL CN pilot

---

## 1. UAT 15 kịch bản

| #   | Kịch bản                         | Pass/Fail/N-A | Evidence | Người chấm | Ghi chú |
| --- | -------------------------------- | ------------- | -------- | ---------- | ------- |
| 1   | Đăng nhập Owner → chọn CN        |               |          |            |         |
| 2   | Đăng nhập Staff → khu vận hành   |               |          |            |         |
| 3   | Phiên sau kill app (SecureStore) |               |          |            |         |
| 4   | Tạo đơn tại bàn + chọn NV        |               |          |            |         |
| 5   | Đơn mang đi + số thứ tự          |               |          |            |         |
| 6   | Khóa bàn — NV thứ 2              |               |          |            |         |
| 7   | Gửi bếp → MAKING → READY         |               |          |            |         |
| 8   | Ấn "Đã giao" sau READY           |               |          |            |         |
| 9   | Thanh toán tiền mặt              |               |          |            |         |
| 10  | Thanh toán CK xác nhận thủ công  |               |          |            |         |
| 11  | Bill VAT 8%                      |               |          |            |         |
| 12  | Hủy món / hủy đơn                |               |          |            |         |
| 13  | Chuyển bàn / gộp bàn (MVP v2)    |               |          |            |         |
| 14  | Kết ca — đối chiếu TM/CK         |               |          |            |         |
| 15  | Mất mạng — SOP thủ công          |               |          |            |         |

> Nếu Sprint 5–6 chưa bật cho kịch bản 13–14, ghi `N/A` và tạo lịch re-UAT.

---

## 2. Sign-off

| Gate                                         | Kết quả | Ghi chú |
| -------------------------------------------- | ------- | ------- |
| >= 15 kịch bản đã executed hoặc N/A có lý do |         |         |
| >= 90% kịch bản Pass                         |         |         |
| Owner xác nhận TM + CK đủ cho pilot          |         |         |
| Tablet trạm + chọn NV được chấp nhận         |         |         |
| Không lỗi Critical trong buổi UAT            |         |         |

**Quyết định:** Go Phase 5 / No-Go  
**Owner ký:**  
**QL CN ký:**  
**TPM/QA ghi nhận:**
