# CaffeApp — Bảng câu hỏi Stakeholder & Vận hành

**Mục đích:** Thu thập quyết định nghiệp vụ trước và trong giai đoạn coding (Sprint 1 → Sprint 6).  
**Cách dùng:** Điền cột **Trả lời**; đánh dấu **Ưu tiên** nếu cần chốt gấp; ghi **Ghi chú** khi câu trả lời phụ thuộc điều kiện.  
**Sau khi hoàn thành:** Cập nhật `PRD.md`, `USER_STORIES.md`, `SPRINT_PLAN.md`, `DOR_CHECKLIST.md` theo các quyết định đã chốt.

**Phiên bản:** MVP v2 (sau pilot 2 tuần) · Cập nhật 2026-06-29  
**Trạng thái:** ☑ Phần A–E.1, D · 🔄 E.2–L đã chuẩn hóa MVP v2

---

## Phạm vi MVP v1 (pilot) vs MVP v2

| Giai đoạn             | Sprint | Phạm vi chính                                              | Ghi chú                              |
| --------------------- | ------ | ---------------------------------------------------------- | ------------------------------------ |
| **MVP v1 — Pilot**    | 1–3    | Auth, order core, TM + CK, tablet trạm quầy+bếp (polling)  | 2 tuần; chưa shift bắt buộc; chưa WS |
| **MVP v2 — Vận hành** | 4–6    | WS barista, dashboard QL, audit UI, notification, UAT 3 CN | Shift module Sprint 5; gộp/tách bill |

**MVP v2 bổ sung so với pilot:** WebSocket đơn bếp · Báo cáo theo ca · Audit log trên app · Push thông báo · Giảm giá/voucher (B-31) · Gộp/chuyển/tách bàn (B-30) · Void payment (E-11) · Owner duyệt CN + notify.

---

## Chú giải

| Ký hiệu | Ý nghĩa                                   |
| ------- | ----------------------------------------- |
| **P0**  | Phải chốt trước khi code sprint liên quan |
| **P1**  | Nên chốt trong sprint                     |
| **P2**  | Có thể hoãn sau pilot                     |
| ☐       | Chưa trả lời                              |
| ☑       | Đã chốt                                   |

**Liên kết tài liệu:** [PRD](PRD.md) · [USER_STORIES](USER_STORIES.md) · [SPRINT_PLAN](SPRINT_PLAN.md) · [DISCOVERY](DISCOVERY.md) · [DEVICE_POLICY](DEVICE_POLICY.md) · [BRANCH_ASSIGNMENT](BRANCH_ASSIGNMENT.md) · [API_CONTRACT](api/API_CONTRACT.md) · [GO_LIVE_PLAN](GO_LIVE_PLAN.md) · **[GO_LIVE_PROMPTS_FULL](GO_LIVE_PROMPTS_FULL.md)**

---

## Phần A — Bối cảnh quán & Pilot

| ID   | Ưu tiên | Câu hỏi                                                      | Trả lời                                                                               | Ghi chú                                                                                                    |
| ---- | ------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| A-01 | P0      | Quán pilot là quán thật hay mô phỏng? Tên, địa chỉ?          | Quán thật — **CN1 pilot: CN Quận 1** (1 trong 3 chi nhánh)                            | Địa chỉ production: chủ quán xác nhận trước seed go-live. Tham chiếu dev seed: 123 Nguyễn Huệ, Q.1, TP.HCM |
| A-02 | P0      | Số chi nhánh hiện tại và kế hoạch mở rộng (6 tháng)?         | 3 chi nhánh; kế hoạch mở thêm nhiều CN trong 6 tháng                                  |                                                                                                            |
| A-03 | P0      | Một ca điển hình: bao nhiêu bàn, thu ngân, barista?          | 50 bàn/CN: T1 ×20, T2 ×20, sân ×10                                                    | Số thu ngân & barista/ca: _bổ sung ở B-13_                                                                 |
| A-04 | P1      | Giờ mở/đóng cửa? Có chia ca sáng/chiều/tối?                  | Mở 24/7; 3 ca × 8 giờ (00–08, 08–16, 16–24)                                           |                                                                                                            |
| A-05 | P1      | Giờ cao điểm: khoảng bao nhiêu đơn/giờ?                      | Cao điểm 18:00–22:00                                                                  | Chưa có số đơn/giờ baseline — đo khi pilot                                                                 |
| A-06 | P0      | Menu thực tế: số category, số món, có size/topping phức tạp? | ~6 nhóm (cà phê, trà, freeze, bánh…); size S/M/L; giá 19k–69k; modifier size/đường/đá | Tham chiếu menu Highlands; seed data từ chủ quán — pending                                                 |
| A-07 | P1      | Có combo / món theo mùa trong MVP không?                     | Có trong vận hành thực tế; MVP ưu tiên món đơn + size                                 | Combo giờ vàng, voucher, món mùa → post-MVP (engine khuyến mãi)                                            |
| A-08 | P2      | Có giao hàng (Grab/ShopeeFood) trong MVP không?              | Không — chưa liên kết                                                                 |                                                                                                            |
| A-09 | P0      | Thiết bị pilot: tablet/phone? Android/iOS? Mấy máy?          | 1 tablet trạm chung/CN (quầy + bếp cùng khu) + ĐT nhân viên (cá nhân)                 | Tablet: tài khoản trạm; ĐT: login cá nhân. Android ưu tiên pilot                                           |
| A-10 | P1      | Mạng quán: WiFi ổn định hay cần offline fallback?            | WiFi ổn định; không cần offline-first MVP                                             |                                                                                                            |
| A-11 | P0      | Deadline demo/pilot cứng (nếu có)?                           | 2 tuần                                                                                |                                                                                                            |
| A-12 | P1      | Team: solo hay có thêm dev/QA/designer?                      | Đã có design UI; coding đang setup và bắt đầu                                         |                                                                                                            |
| A-13 | P1      | Velocity ~20 pts/sprint có khả thi không?                    | Khả thi                                                                               |                                                                                                            |

---

## Phần B — Luồng vận hành tổng thể (xuyên sprint)

### B.1 Vòng đời một ngày làm việc

| ID   | Ưu tiên | Câu hỏi                                                                | Trả lời                                                                                                                                                | Ghi chú                                                                                           |
| ---- | ------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| B-01 | P0      | Ai **mở ca** trên hệ thống? (Manager / thu ngân đầu tiên / tự động)    | 3 ca tự theo giờ (00–08, 08–16, 16–24). QL chi nhánh **nhận ca** trên app (xem thông tin / bàn giao) — không mở/tắt bán hàng                           | Vai trò: Owner, QL CN, thu ngân/pha chế, NV phục vụ bàn. Bàn giao 15p cuối/đầu ca = **ngoài app** |
| B-02 | P0      | Ai được **kết ca**? Có bắt buộc đóng hết đơn trước khi kết ca?         | QL chi nhánh ca đó kết ca. **Không** bắt buộc đóng hết đơn PENDING/MAKING/READY                                                                        | Chi tiết đơn tồn: xem B-04                                                                        |
| B-03 | P1      | Khi kết ca: cần báo cáo tổng kết tiền mặt (thực tế vs hệ thống)?       | Có — báo cáo trên app; đối chiếu tiền mặt thực tế vs hệ thống (tách TM / CK)                                                                           | Két tiền chung giữa các ca                                                                        |
| B-04 | P0      | Đơn PENDING/MAKING/READY lúc kết ca — xử lý thế nào?                   | PAID giữ nguyên ca. PENDING/MAKING/READY theo thời gian thực; qua mốc 08/16/00 → chuyển **ca kế** nếu chưa xong. Mở/đóng ca **không chặn** bởi đơn tồn | Nhắc chốt / thu tiền 5–10p trước đổi ca (không block). READY: nhắc khách thanh toán tại quầy      |
| B-05 | P0      | Module **shift** (`shifts` table): bật bắt buộc MVP không? Sprint nào? | **Pilot 2 tuần:** chưa bắt buộc `shift_id` (dùng `created_at`). **Sau pilot / Sprint 5:** bật auto gắn ca + rollover đơn mở                            | Mở ca = nhận ca + xem info; **không** gate tạo đơn                                                |
| B-06 | P0      | Doanh thu báo cáo gắn **ca** hay **ngày lịch** (00:00–23:59)?          | Theo **ca** (khung 8h). Doanh thu PAID = ca lúc **thanh toán**                                                                                         |                                                                                                   |
| B-07 | P1      | Định nghĩa ca: MORNING/AFTERNOON/EVENING cố định giờ hay tự mở?        | 3 ca **cố định giờ**: NIGHT 00–08, DAY 08–16, EVENING 16–24                                                                                            | Nhắc chốt trước mốc đổi ca 5–10 phút                                                              |

### B.2 Đầu ca / cuối ca theo vai trò

| ID   | Ưu tiên | Câu hỏi                                                         | Trả lời                                                                                                                         | Ghi chú                                                                                                                                                                       |
| ---- | ------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| B-08 | P1      | Thu ngân đầu ca: cần **đếm tiền đầu ca** (float cash) trên app? | Không bắt buộc nhập float đầu ca. **Kết ca:** đối chiếu TM / CK trên app vs tiền thực tế; két chung các ca                      | Tablet trạm: 1 tài khoản chung; chọn tên NV khi thao tác. App hỗ trợ tính tiền thừa; tổng TM + CK đối chiếu cuối ca                                                           |
| B-09 | P2      | Barista đầu ca: chỉ login hay cần xác nhận "Sẵn sàng pha chế"?  | Login trạm = làm việc ngay; **không** màn "Sẵn sàng pha chế"                                                                    | Quầy + bếp **chung khu**, 1 tablet/CN: **Tab Thu ngân + Tab Bếp** (queue, hoàn thành món → READY). Picker NV mỗi thao tác (B-15). Code: **TASK-P2-03b** (PO duyệt 2026-06-29) |
| B-10 | P2      | Manager cần duyệt mở ca trước khi tạo đơn?                      | Không — đơn tự theo thời gian thực / ca hệ thống                                                                                |                                                                                                                                                                               |
| B-11 | P0      | Cuối ca: đăng xuất bắt buộc — có nhắc nếu còn đơn mở?           | **ĐT cá nhân:** nhắc cuối ca; auto logout phiên sau mốc ca +10p. **Tablet trạm:** không auto logout; chỉ nhắc đổi ca / bàn giao |                                                                                                                                                                               |
| B-12 | P2      | Nhân viên quên đăng xuất — ca sau có cảnh báo phiên cũ?         | **Tablet trạm:** không áp dụng (máy chung, không phiên cá nhân). **ĐT cá nhân:** không bắt buộc cảnh báo phiên cũ               |                                                                                                                                                                               |

### B.3 Đa người dùng & xung đột

| ID   | Ưu tiên | Câu hỏi                                                       | Trả lời                                                                                                                                                    | Ghi chú |
| ---- | ------- | ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| B-13 | P0      | Một chi nhánh: mấy thu ngân / mấy máy quầy song song?         | 1 CHI NHÁNH CHỈ CẦN 2 NHÂN VIÊN CÓ NHIỆM VỤ PHA CHẾ VÀ THU NGÂN                                                                                            |         |
| B-14 | P0      | Hai thu ngân cùng chọn một bàn — khóa bàn hay ai chọn trước?  | KHI BÀN ĐƯỢC CHỌN ĐỂ GỌI MÓN THÌ MẶC ĐỊNH BÀN ĐÃ SẼ CÓ THÔNG BÁO BÀN ĐÓ ĐANG ĐƯỢC CHỌN VÀ KHÔNG THỂ CÓ NGƯỜI THỨ 2 CHỌN ĐƯỢC                               |         |
| B-15 | P1      | Thu ngân A tạo đơn — thu ngân B được xem/sửa không?           | CÓ THỂ XEM VÀ SỬA ĐƯỢC VÌ MỖI BƯỚC THAO TÁC ĐỀU SẼ CÓ BƯỚC CHỌN NHÂN VIÊN NÀO XÁC NHẬN NẾU DÙNG TABLET TẠI QUẦY                                            |         |
| B-16 | P1      | Manager vào role thu ngân — audit ghi MANAGER hay CASHIER?    | KHI LOGIN VÀO SẼ MẶC ĐỊNH ROLE LUÔN CHỨ KHÔNG CẦN PHẢI CHỌN ROLE NỮA                                                                                       |         |
| B-17 | P2      | Một người vừa pha vừa thu ngân — đổi role giữa ca được không? | NHÂN QUYÊN KHÔNG CÓ QUYỀN ĐỔI ROLE TRONG QUÁ TRÌNH LÀM VIỆC, VIỆC ĐỔI ROLE CHỈ ĐƯỢC QUẢN LÍ VÀ CHỦ QUÁN LÀM. NẾU QUẢN LÍ ĐỔI THÌ PHẢI ĐƯỢC CHỦ QUÁN ĐỒNG Ý |         |

### B.4 Mạng, offline, lỗi

| ID   | Ưu tiên | Câu hỏi                                                  | Trả lời                                              | Ghi chú |
| ---- | ------- | -------------------------------------------------------- | ---------------------------------------------------- | ------- |
| B-18 | P0      | Mất mạng khi đông khách — quy trình dự phòng?            | MẤT MẠNG APP KHÔNG HOẠT ĐỘNG PHẢI HOẠT ĐỘNG THỦ CÔNG |         |
| B-19 | P1      | Giỏ hàng local khi offline: giữ bao lâu? Có mã hóa?      | MẤT MẠNG APP KHÔNG HOẠT ĐỘNG PHẢI HOẠT ĐỘNG THỦ CÔNG |         |
| B-20 | P2      | API down > 5 phút — thông báo Manager?                   | MẤT MẠNG APP KHÔNG HOẠT ĐỘNG PHẢI HOẠT ĐỘNG THỦ CÔNG |         |
| B-21 | P1      | Barista reconnect — queue tự sync không cần refresh tay? | MẤT MẠNG APP KHÔNG HOẠT ĐỘNG PHẢI HOẠT ĐỘNG THỦ CÔNG |         |

### B.5 Audit & truy vết

| ID   | Ưu tiên | Câu hỏi                                                 | Trả lời                                                                                                                                                                                                                                                                                                                                                                                                      | Ghi chú |
| ---- | ------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------- |
| B-22 | P1      | Cần log chi tiết: hủy đơn, giảm giá, sửa giá — mức nào? | Log toàn bộ các thao tác ảnh hưởng đến doanh thu và dữ liệu quan trọng. Bao gồm: tạo đơn, sửa đơn, hủy món, hủy đơn, giảm giá, sửa giá, đổi bàn, gộp bàn, tách bàn, thanh toán, hoàn tiền, mở/đóng ca, mở ngăn kéo tiền, đăng nhập/đăng xuất, thay đổi quyền, sửa thông tin sản phẩm. Mỗi log lưu: thời gian, nhân viên thực hiện, thiết bị, IP (nếu có), dữ liệu trước và sau khi thay đổi, lý do thao tác. |         |
| B-23 | P2      | Chủ quán xem audit_logs trên app hay chỉ backend?       | Owner và Manager được xem Audit Log ngay trên ứng dụng quản lý. Backend lưu trữ đầy đủ để phục vụ đối soát và điều tra khi cần. Cashier và Barista không có quyền xem Audit Log.                                                                                                                                                                                                                             |         |
| B-24 | P1      | CK xác nhận thủ công — ai chịu trách nhiệm nếu nhầm?    | Cashier là người xác nhận thanh toán chuyển khoản. Nếu xác nhận sai sẽ được ghi nhận trong Audit Log. Manager hoặc Owner có quyền kiểm tra, hủy hoặc điều chỉnh giao dịch theo quy trình.                                                                                                                                                                                                                    |         |

### B.6 Workflow đơn hàng tổng quát

| ID   | Ưu tiên | Câu hỏi                                                                | Trả lời                                                                                                                                                                                                                                  | Ghi chú |
| ---- | ------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| B-25 | P0      | Khách vào: chọn bàn trước hay order trước gán bàn sau?                 | CẢ 2 ĐỀU CÓ THỂ SẢY RA, VÍ DỤ ORDER TẠI QUẦY THÌ NHÂN VIÊN Ở QUẦY SẼ TRỰC TIẾP QUAN SÁT HOẶC HỎI TRỰC TIẾP KHÁCH HÀNG ĐỂ ĐẢM BẢO VIỆC KHÔNG THỂ SẢY RA TRƯỜNG HỢP 2 NHÓM KHÁCH KHÁC NHAU TRÙNG BÀN                                       |         |
| B-26 | P0      | Một bàn có nhiều đơn cùng lúc (gọi thêm) không?                        | KHÁCH HÀNG CÓ THỂ GỌI THÊM MÓM Ở NHỮNG TRƯỜNG HỢP NHƯ KHÁCH THANH TOÁN KHI VẪN NGỒI BÀN, KHÁCH CHƯA THANH TOÁN                                                                                                                           |         |
| B-27 | P1      | Đổi bàn giữa chừng — MVP cần không? Ai được phép?                      | NẾU KHÁCH HÀNG ĐỘT NGỘT ĐỔI BÀN THÌ THU NGÂN/PHA CHẾ HOẶC PHỤC VỤ BÀN CÓ THỂ ĐỔI BÀN HOẶC GỘP BÀN CHO KHÁCH. Ở ĐÂY THỰC TẾ NHÂN VIÊN PHẢI QUAN SÁT MỌI LÚC MỌI NƠI                                                                       |         |
| B-28 | P1      | Đơn mang đi: cần số thứ tự (#042) cho khách không?                     | CẦN CÓ SỐ THỨ TỰ                                                                                                                                                                                                                         |         |
| B-29 | P0      | Thanh toán: trả khi order hay trả khi rời bàn?                         | KHÁCH HÀNG CÓ THỂ THANH TOÁN KHI NƯỚC VỪA GIAO HOẶC KHI RỜI BÀN TÙY THEO NHU CẦU                                                                                                                                                         |         |
| B-30 | P2      | Tách bill / gộp bàn — pilot có case thực tế không? (PRD: out of scope) | Có. Trong quá trình vận hành có phát sinh nhu cầu gộp bàn, chuyển bàn và tách bill cho khách thanh toán riêng.sẽ hỗ trợ các nghiệp vụ cơ bản: Gộp bàn, Chuyển bàn và Tách bill theo món. Mọi thao tác phải được ghi vào Audit Log.       |         |
| B-31 | P2      | Giảm giá / voucher / khuyến mãi trong MVP?                             | Giảm giá theo %, (2) Giảm giá theo số tiền cố định, (3) Áp dụng voucher/mã giảm giá. Mỗi đơn hàng chỉ áp dụng một chương trình khuyến mãi tại một thời điểm. Mọi thao tác áp dụng hoặc hủy giảm giá phải được ghi vào Audit Log.         |         |
| B-32 | P1      | Ghi chú nội bộ vs ghi chú barista — một hay hai field?                 | Hai field riêng biệt. baristaNote dùng cho yêu cầu pha chế (ví dụ: ít đá, không đường, thêm shot, sữa yến mạch...). internalNote dùng cho nhân viên/quản lý (ví dụ: khách VIP, xử lý khiếu nại, chờ ghép đơn, xác nhận chuyển khoản...). |         |
| B-33 | P1      | Sau barista READY — ai báo khách? Có màn "Món đã xong"?                | SAU KHI PHA CHẾ ĐÃ XONG THÌ SẼ THÔNG BÁO ĐÃ HOÀN THÀNH ĐƠN, TRÊN GIAO DIỆN CỦA NHÂN VIÊN VÀ GIAO DIỆN TABLET ĐỀU THÔNG BÁO LÀ XONG MÓN, NHÂN VIÊN KHI GIAO MÓN XONG CHO KHÁCH SẼ ẤN ĐÃ GIAO VÀ CHUYỂN SANG PHẦN CHỜ THANH TOÁN           |         |

---

## Phần C — Sprint 1: Auth & Phân quyền (US-A01 → A04)

**Trạng thái sprint (chốt):** ☐ Done chính thức · ☐ Còn việc · Ghi rõ: _______________

| ID                                                                                                                                                                                                                      | Story | Ưu tiên | Câu hỏi                                                           | Trả lời                                                                                                                                                                                                                                                                                                                                                             | Ghi chú                                                                                                                                                        |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- | ------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| C-01                                                                                                                                                                                                                    | A01   | P0      | Đăng nhập: email, SĐT, hay một ô chung? Format SĐT?               | ĐĂNG NHẬP BẰNG GMAIL HOẶC SĐT VÀ MẬT KHẨU.                                                                                                                                                                                                                                                                                                                          |                                                                                                                                                                |
| C-02                                                                                                                                                                                                                    | A01   | P1      | Quên mật khẩu — MVP có cần? Hay Manager reset thủ công?           | NHÂN VIÊN NHẬP GMAIL XÁC NHẬN VÀ MÃ GỬI VỀ GMAIL ĐÓ VÀ NHẬP MÃ TẠO MẬT KHẨU MỚI, KHI THÀNH CÔNG SẼ BÁO VỀ CHỦ QUÁN LÀ NHÂN VIÊN ĐÓ VỪA CẬP NHẬT MẬT KHẨU. XEM ĐƯỢC THÔNG TIN NHƯ TÊN GMAIL SĐT TRẠNG THÁI THÀNH CÔNG HAY THẤT BẠI                                                                                                                                   |
| Đặt lại mật khẩu mới                                                                                                                                                                                                    |       |
| C-03                                                                                                                                                                                                                    | A01   | P2      | Sai MK 5 lần — khóa tài khoản tạm?                                | Có. Sau 5 lần nhập sai liên tiếp, tài khoản sẽ bị khóa tạm thời trong 15 phút. Trong thời gian khóa, không thể đăng nhập bằng mật khẩu. Sau 15 phút hệ thống tự mở khóa hoặc Owner/Manager có thể mở khóa thủ công. Mọi sự kiện khóa/mở khóa đều được ghi vào Audit Log.                                                                                            |                                                                                                                                                                |
| C-04                                                                                                                                                                                                                    | A01   | P0      | Access token 15 phút + refresh — đủ mượt ca 8 tiếng?              | Có. Access token 15 phút là hợp lý cho bảo mật, refresh token nên có thời hạn dài hơn ca làm việc, ví dụ 8–12 giờ hoặc đến khi nhân viên đăng xuất/đóng phiên thu ngân. App tự động refresh token trong nền nên nhân viên không bị văng ra khi đang bán hàng.                                                                                                       |                                                                                                                                                                |
| C-05                                                                                                                                                                                                                    | A01   | P0      | Session timeout: PRD 8 giờ vs JWT 15 phút — rule nào đúng?        | Cả hai đều đúng. Access Token có thời hạn 15 phút. Session/Refresh Token có thời hạn tối đa 8 giờ theo PRD. Trong 8 giờ, app tự động refresh access token để nhân viên không bị gián đoạn khi bán hàng. Sau 8 giờ hoặc khi đóng ca/đăng xuất/đổi mật khẩu/khóa tài khoản, session hết hiệu lực và nhân viên phải đăng nhập lại.                                     |                                                                                                                                                                |
| C-06                                                                                                                                                                                                                    | A01   | P2      | Force logout thiết bị khác — MVP cần?                             | Có. Hệ thống hỗ trợ Force Logout để thu hồi toàn bộ hoặc từng phiên đăng nhập của một tài khoản. Owner và Manager có quyền force logout tài khoản nhân viên. Nhân viên cũng có thể tự đăng xuất tất cả thiết bị của chính mình từ mục "Quản lý thiết bị". Sau khi force logout, mọi Access Token và Refresh Token của các thiết bị bị thu hồi sẽ hết hiệu lực ngay. |                                                                                                                                                                |
| C-07                                                                                                                                                                                                                    | A01   | P2      | Đăng nhập sinh trắc học (FR-A05) — có trong pilot?                | Có, nhưng chỉ dùng để mở khóa nhanh app sau khi nhân viên đã đăng nhập bằng email/mật khẩu lần đầu. Hệ thống vẫn dùng JWT + Refresh Token làm cơ chế xác thực chính. Sinh trắc học như Face ID, Touch ID hoặc vân tay chỉ giúp nhân viên truy cập lại app nhanh hơn trong phiên còn hiệu lực.                                                                       | Login bằng email/mật khẩu                                                                                                                                      |
| ↓                                                                                                                                                                                                                       |
| Hỏi: Bật Face ID / Vân tay cho lần sau?                                                                                                                                                                                 |
| ↓                                                                                                                                                                                                                       |
| Lưu refresh token an toàn trong SecureStore/Keychain                                                                                                                                                                    |
| ↓                                                                                                                                                                                                                       |
| Lần sau mở app                                                                                                                                                                                                          |
| ↓                                                                                                                                                                                                                       |
| Xác thực Face ID / Vân tay                                                                                                                                                                                              |
| ↓                                                                                                                                                                                                                       |
| Mở app nếu session còn hiệu lựcKhông dùng sinh trắc học để tạo tài khoản hoặc reset mật khẩu. Nếu session hết hạn 8 giờ, đổi mật khẩu, tài khoản bị khóa hoặc bị force logout thì bắt buộc đăng nhập lại bằng mật khẩu. |
| C-08                                                                                                                                                                                                                    | A02   | P0      | CASHIER/BARISTA không chọn CN (BRANCH_ASSIGNMENT) — code đã khớp? | Đúng. Cashier và Barista không được tự chọn chi nhánh. Sau khi đăng nhập, hệ thống tự động xác định chi nhánh dựa trên Branch Assignment đang có hiệu lực. Chỉ Owner và Manager mới có quyền chuyển đổi hoặc quản lý nhiều chi nhánh.                                                                                                                               |                                                                                                                                                                |
| C-09                                                                                                                                                                                                                    | A02   | P1      | OWNER đổi CN giữa phiên không cần logout?                         | Có. Owner được phép chuyển đổi chi nhánh trong cùng một phiên đăng nhập mà không cần logout. Khi chuyển chi nhánh, hệ thống cập nhật "Working Branch Context" và tự động tải lại dữ liệu của chi nhánh mới. Session và JWT vẫn giữ nguyên.                                                                                                                          | Không làm ảnh hưởng đến các thiết bị khác. Mọi thao tác sau khi chuyển đều áp dụng cho chi nhánh đang được chọn. Ghi Audit Log khi Owner chuyển đổi chi nhánh. |
| C-10                                                                                                                                                                                                                    | A02   | P1      | Nhân viên PENDING_OWNER — ai nhận thông báo cần duyệt?            | **Chủ quán (OWNER)** — in-app badge + màn Duyệt gán CN. **MVP v2:** thêm push khi QL gửi đề xuất. Manager không cần push riêng                                                                                                                                                                                                                                      |                                                                                                                                                                |
| C-11                                                                                                                                                                                                                    | A03   | P0      | MANAGER thấy mấy card role? OWNER chọn role nào?                  | Không dùng màn chọn role. Mỗi tài khoản gắn một vai trò cố định khi đăng nhập. MANAGER vào thẳng khu Quản lý; OWNER chọn chi nhánh (nếu cần) rồi vào khu Chủ quán — không chọn card Thu ngân/Barista. NV vận hành dùng tablet trạm chung (quầy + bếp); mỗi thao tác chọn tên NV xác nhận. Đổi vai trò tài khoản chỉ Owner/QL thực hiện, không tự đổi trong ca       |                                                                                                                                                                |
| C-12                                                                                                                                                                                                                    | A03   | P2      | Sau chọn role — cần màn xác nhận lại?                             | Không áp dụng — đã bỏ màn chọn role (C-11). Sau login vào thẳng đúng khu theo tài khoản; không cần màn xác nhận thêm.                                                                                                                                                                                                                                               |                                                                                                                                                                |
| C-13                                                                                                                                                                                                                    | A04   | P1      | 6 quick actions — thứ tự đúng thói quen quầy?                     | Hàng 1: Tạo đơn → Sơ đồ bàn → Món đã xong. Hàng 2: Danh sách đơn → Thông báo → Lịch sử. Ưu tiên thao tác cao điểm (order, bàn, giao món); lịch sử để cuối vì ít dùng trong ca.                                                                                                                                                                                      |                                                                                                                                                                |
| C-14                                                                                                                                                                                                                    | A04   | P1      | "Món đã xong" = đơn READY chưa thanh toán?                        | Có. Màn "Món đã xong" gồm đơn chưa PAID sau khi barista hoàn thành: tab Chờ giao (READY, chưa ấn Đã giao) và tab Chờ thanh toán (đã ấn Đã giao, chưa thanh toán). Mang đi: ưu tiên hiện số thứ tự (#042, B-28).                                                                                                                                                     |                                                                                                                                                                |
| C-15                                                                                                                                                                                                                    | —     | P0      | Demo login E2E thiết bị thật + SecureStore sau kill app — pass?   | Chưa test                                                                                                                                                                                                                                                                                                                                                           |                                                                                                                                                                |

---

## Phần D — Sprint 2: Order Core (US-B01 → B05)

**Demo tối thiểu Sprint 2:** ☑ Chọn bàn → menu → giỏ → gửi bếp · ☑ Tab Bếp thấy đơn (polling) · Khác: mang đi + số thứ tự

### D.1 US-B01 — Chọn loại đơn

| ID   | Ưu tiên | Câu hỏi                                        | Trả lời                                                                                                                                                                   | Ghi chú                       |
| ---- | ------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| D-01 | P0      | Tỷ lệ đơn tại bàn vs mang đi (~%)?             | Chưa có số thực (chưa khai trương). **Giả định MVP v2:** ~75% tại bàn / ~25% mang đi — đo lại sau pilot                                                                   | Cập nhật khi có baseline A-05 |
| D-02 | P1      | Luôn qua màn chọn loại hay nhớ lựa chọn trước? | Vẫn luôn qua màn chọn loại (2 nút lớn: Tại bàn / Mang đi). Highlight loại vừa dùng gần nhất trong ca; NV đổi bằng 1 tap. Không skip thẳng vào menu/sơ đồ bàn.             |                               |
| D-03 | P1      | Mang đi: cần tên/SĐT khách trước khi chọn món? | KHÔNG CẦN                                                                                                                                                                 |                               |
| D-04 | P2      | Dự trù enum DELIVERY cho tương lai?            | Có dự trù giá trị DELIVERY trong mô hình dữ liệu (schema/API), không hiển thị trên app pilot. Khi liên kết Grab/ShopeeFood → bật UI + luồng riêng, không đổi enum cơ bản. |                               |

### D.2 US-B02 — Sơ đồ bàn

| ID   | Ưu tiên | Câu hỏi                                                    | Trả lời                                                                                                                                                                                                                                             | Ghi chú |
| ---- | ------- | ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| D-05 | P0      | Số bàn pilot? Tên bàn (B01 vs Bàn 1)?                      | 50 BÀN ĐỀU ĐÁNH SỐ TỪ B01-50 20 BÀN TẦNG 1 20 BÀN TẦNG 2 10 BÀN NGOÀI SÂN                                                                                                                                                                           |         |
| D-06 | P0      | Layout: lưới cố định hay khu vực (trong/sân)?              | CHIA THEO KIỂU KHU VỰC XONG SẼ CÓ DANH SÁCH BÀN BÊN DƯỚI                                                                                                                                                                                            |         |
| D-07 | P0      | Bàn OCCUPIED — chỉ xem đơn hay được thêm món (round 2)?    | Được thêm món (round 2). Tap bàn OCCUPIED → xem đơn hiện tại + nút Thêm món (append vào đơn mở hoặc tạo đơn mới cùng bàn — xem D-08). Không chỉ xem.                                                                                                |         |
| D-08 | P0      | Một bàn nhiều đơn: gộp bill hay nhiều order_id?            | Nhiều order_id trên một bàn khi khách gọi thêm sau lần thanh toán trước. Cùng một order_id nếu chưa PAID — chỉ append món. Lúc thu tiền: gộp bill (nhiều đơn → một lần thanh toán) hoặc tách bill theo B-30.                                        |         |
| D-09 | P1      | Real-time Sprint 2: polling bao nhiêu giây chấp nhận được? | 3–5 giây khi màn sơ đồ bàn đang mở; 10 giây khi ở màn khác (tiết kiệm pin). Sprint 4 chuyển WebSocket, bỏ polling chủ động.                                                                                                                         |         |
| D-10 | P1      | Màu MAINTENANCE + legend chú thích?                        | Có. Màu xám (hoặc cam nhạt) cho MAINTENANCE; legend cố định dưới sơ đồ: Trống · Có khách · Đang chọn · Bảo trì. Chỉ QL/Chủ đặt/bỏ bảo trì.                                                                                                          |         |
| D-11 | P2      | Trạng thái CLEANING (khách rời, chưa dọn)?                 | Không                                                                                                                                                                                                                                               |         |
| D-12 | P1      | Khóa bàn khi một thu ngân đang order?                      | Có — khóa mềm khi đang order. Bàn ở trạng thái Đang chọn (SELECTED/LOCKED): NV khác không mở order mới; hiện “Bàn đang được xử lý”. Hết phiên order (gửi bếp / thoát / timeout ~2–3 phút) → mở khóa. Bàn OCCUPIED vẫn cho xem + thêm món theo D-07. |         |

### D.3 US-B03 — Menu

| ID                     | Ưu tiên | Câu hỏi                                                 | Trả lời                                                                                                                                                                                     | Ghi chú |
| ---------------------- | ------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| D-13                   | P0      | Số category + món cần seed? Ai cung cấp data? Deadline? | CÀ PHÊ PHIN                                                                                                                                                                                 |
| Phin Sữa Đá            |
| Phin Đen Đá            |
| Phin Sữa Nóng          |
| Phin Đen Nóng          |
| Bạc Xỉu Đá             |
| Bạc Xỉu Nóng           |
| ☕ PHINDI              |
| PhinDi Hạnh Nhân       |
| PhinDi Kem Sữa         |
| PhinDi Choco           |
| ☕ ESPRESSO            |
| Espresso               |
| Americano              |
| Latte                  |
| Cappuccino             |
| Mocha                  |
| Caramel Macchiato      |
| 🍵 TRÀ                 |
| Trà Sen Vàng           |
| Trà Thạch Đào          |
| Trà Thanh Đào          |
| Trà Thạch Vải          |
| Trà Xanh Đậu Đỏ        |
| ❄️ FREEZE              |
| Classic Phin Freeze    |
| Caramel Phin Freeze    |
| Freeze Trà Xanh        |
| Chocolate Freeze       |
| Cookies & Cream Freeze |
| 🍫 ĐỒ UỐNG KHÁC        |
| Chocolate Đá           |
| Chocolate Nóng         |
| Matcha Latte           |
| Chanh Đá Xay           |
| 🥐 BÁNH MÌ             |
| Bánh Mì Que Pate       |
| Bánh Mì Que Gà         |
| 🍰 BÁNH NGỌT           |
| Tiramisu               |
| Cheese Cake            |
| Mousse Đào             |
| Mousse Chocolate       |
| Bánh Chuối             |
| Su Kem                 |
| Croissant              |
| ☕ CÀ PHÊ ĐÓNG GÓI     |
| Heritage Blend         |
| Traditional Blend      |
| Moka Blend             |
| Culi Supreme           |
| Arabica                |         |
| D-14                   | P1      | Category tab cố định 3 hay dynamic từ API?              | tab theo category thật, sort theo sort_order. QL thêm/sửa category qua quản lý menu                                                                                                         |         |
| D-15                   | P1      | Tìm kiếm món theo tên — MVP?                            | tìm theo tên (không dấu / gần đúng). Ưu tiên tablet quầy; bắt buộc filter nâng cao.                                                                                                         |         |
| D-16                   | P0      | Món hết hàng: ẩn / gạch / badge "Hết"?                  | Hiện món + badge "Hết" + gạch ngang + không thêm vào giỏ. QL/Barista đánh dấu hết hàng; không ẩn món                                                                                        |         |
| D-17                   | P0      | Giá hiển thị đã gồm VAT 8% chưa? Bật VAT trên bill?     | Giá menu đã gồm VAT 8%. Trên bill: hiện tổng thanh toán (đã gồm VAT) + dòng tách VAT (số tiền / thuế suất) để đối soát — không cộng VAT thêm lên giá. Pilot: bill màn hình; in hóa đơn GTGT |         |
| D-18                   | P2      | Pin best-seller lên đầu menu?                           | Dùng thứ tự thủ công (sort_order) trong từng category. Gợi ý best-seller / bán chạy tự động → sau pilot khi có dữ liệu doanh thu.                                                           |         |
| D-19                   | P1      | Giá khác nhau theo chi nhánh?                           | giá đồng nhất 3 chi nhánh                                                                                                                                                                   |         |
| D-20                   | P2      | Ảnh món: thật hay placeholder MVP?                      | Ảnh thật từng món → sau pilot, upload qua quản lý menu; không chặn order nếu thiếu ảnh.                                                                                                     |         |

### D.4 US-B04 — Tùy chỉnh món

| ID   | Ưu tiên | Câu hỏi                                               | Trả lời                                                                                                                                                                               | Ghi chú |
| ---- | ------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| D-21 | P0      | Modifier chuẩn: Size, Đường, Đá — còn thiếu gì?       | Size, Đường, Đá cho đồ pha chế; đồ nóng ẩn Đá. Bánh/snack không modifier. Loại sữa / shot / topping đặc biệt                                                                          |         |
| D-22 | P0      | Modifier có phụ thu giá? (Size L +5k)                 | Có phụ thu cho Size (và topping nếu bật). Đường/Đá không phụ thu. Giá hiển thị realtime trên modal trước khi thêm giỏ.                                                                |         |
| D-23 | P1      | Topping: nhiều lựa chọn — tối đa N?                   | tối đa 3 topping/món, có phụ thu từng topping.                                                                                                                                        |         |
| D-24 | P1      | Món không cần tùy chỉnh — skip modal, thêm thẳng giỏ? | Có. Món requiresCustomization = false (bánh, snack đóng gói…) → thêm thẳng giỏ qty=1, toast xác nhận Đồ uống pha chế → luôn mở modal (hoặc long-press “thêm nhanh” với default D-26). |         |
| D-25 | P1      | Ghi chú món vs ghi chú đơn — riêng hay chung?         | Riêng. baristaNote theo từng dòng món (ít đá, không đường…). internalNote theo đơn (khách VIP, chờ CK…). Ghi chú món hiển thị trên ticket bếp; ghi chú đơn chỉ NV/QL.                 |         |
| D-26 | P1      | Pre-select mặc định (Size M, đường bình thường)?      | Có. Mặc định: Size M, Đường bình thường, Đá bình thường (đồ lạnh) / không đá (đồ nóng). NV đổi 1–2 tap rồi “Thêm giỏ”. Có thể nhớ lựa chọn gần nhất cùng món trong ca (tùy chọn P2).  |         |

### D.5 US-B05 — Giỏ hàng & Gửi bếp

| ID   | Ưu tiên | Câu hỏi                                             | Trả lời                                                                                                                                                                                      | Ghi chú |
| ---- | ------- | --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| D-27 | P0      | Sau gửi bếp — thêm món: order mới hay append items? | Chưa PAID → append cùng đơn. Đã PAID → đơn mới cùng bàn. Thông báo bếp khi có món thêm.                                                                                                      |         |
| D-28 | P0      | Hủy đơn PENDING: CASHIER được hủy? Cần lý do?       | Có — NV vận hành được hủy đơn PENDING (và MAKING có cảnh báo). Bắt buộc chọn lý do; ghi audit (NV, thời gian, before/after). Thông báo bếp khi hủy sau gửi.                                  |         |
| D-29 | P1      | Gửi bếp một phần (một số món trước)?                | Chọn món trong giỏ → Gửi bếp chỉ món đã chọn; món còn lại ở giỏ. Mỗi lần gửi có thể tạo batch line trên cùng đơn (chưa PAID).                                                                |         |
| D-30 | P1      | Lưu đơn nháp khi thoát màn / kill app?              | Có lưu nháp trước gửi bếp (kill app / thoát màn → khôi phục giỏ). Không coi là offline order — mất mạng thì không gửi được. Sau gửi bếp: lấy từ server.                                      |         |
| D-31 | P1      | Feedback sau gửi bếp: toast / âm thanh / số thứ tự? | Toast “Đã gửi bếp” + âm thanh ngắn trên tablet trạm. Mang đi: hiện số thứ tự #xxx (in/ghi cho khách). Tại bàn: hiện mã đơn + số bàn. Tab bếp trên cùng tablet cập nhật đơn mới (B-09).       |         |
| D-32 | P1      | Món hết hàng trong giỏ lúc gửi — chặn hay cảnh báo? | Chặn gửi bếp + dialog liệt kê món hết hàng; NV xóa hoặc thay món rồi gửi lại. Không tự gửi thiếu món, không âm thầm bỏ dòng.                                                                 |         |
| D-33 | P1      | Sprint 2 demo: barista cần thấy đơn (dù chưa WS)?   | Có — bắt buộc cho demo Sprint 2. Cùng tablet: tab Bếp list đơn PENDING (poll 3–5s hoặc refresh khi chuyển tab). Barista đổi trạng thái PENDING → MAKING → READY. WS thay polling ở Sprint 4. |         |

---

## Phần E — Sprint 3: Payment & Quản lý đơn (US-B06 → B11)

**MVP payment tối thiểu chốt:** ☑ Tiền mặt · ☑ Chuyển khoản VietQR · ☐ Thẻ (sau pilot) · ☐ Ví/cổng online (sau pilot, chưa chọn nhà cung cấp)

### E.1 Thanh toán

| ID   | Story | Ưu tiên | Câu hỏi                                               | Trả lời                                                                                                                                                              | Ghi chú                             |
| ---- | ----- | ------- | ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| E-01 | B06   | P0      | Thanh toán khi READY hay cho trả trước (PENDING)?     | Mặc định READY (tại bàn: sau giao món). Cho phép trả trước nếu khách yêu cầu (mang đi ưu tiên trả trước). Không bắt buộc thu lúc PENDING/MAKING trừ khi NV chủ động. |                                     |
| E-02 | B06   | P1      | Nút mệnh giá nhanh (50k, 100k, 200k)?                 | Có — 50k / 100k / 200k / 500k + ô nhập tay; tự tính tiền thừa. Giá đơn 19k–69k, bill thường 50k–200k.                                                                |                                     |
| E-03 | B06   | P2      | Làm tròn tiền lẻ (bỏ 500đ)?                           | Thu đúng số tiền trên bill; không làm tròn tự động.                                                                                                                  |                                     |
| E-04 | B07   | P0      | STK ngân hàng? Nhiều STK theo chi nhánh?              | SỐ TÀI KHOẢN THEO CHỦ QUÁN ĐƯA                                                                                                                                       |                                     |
| E-05 | B07   | P0      | VietQR tự sinh theo số tiền — bắt buộc MVP?           | TỰ SINH QR SỐ TIỀN                                                                                                                                                   |                                     |
| E-06 | B07   | P1      | Xác nhận CK: cần mã GD / 4 số cuối?                   | Khuyến khích nhập 4 số cuối hoặc mã GD khi xác nhận; không chặn nếu thiếu ở pilot (tốc độ cao điểm). QL đối soát cuối ca; sai sót → audit + void (E-11).             |                                     |
| E-07 | B07   | P1      | CK chưa vào TK — đơn READY giữ bao lâu?               | CHƯA VÀO TÀI KHOẢN CHỤP BILL LẠI QUẢN LÍ SAU CHỐT CHO KHÁCH XONG                                                                                                     |                                     |
| E-08 | B08   | P1      | Thẻ: app chỉ ghi nhận hay tích hợp POS?               | CHƯA TÍCH HỢP POS                                                                                                                                                    |                                     |
| E-09 | B09   | P1      | Ví/cổng online có triển khai trong pilot không?       | **Pilot/MVP:** không triển khai ví/cổng online; dùng TM + CK VietQR. **Sau pilot:** đánh giá nhu cầu rồi chọn nhà cung cấp riêng nếu cần.                            | Cổng online ngoài phạm vi MVP/pilot |
| E-10 | —     | P0      | Sau PAID — bàn DINE_IN tự EMPTY hay sau dọn thủ công? | Tự EMPTY ngay sau PAID (pilot). NV quan sát thực tế — bàn chưa dọn thì không cho khách mới (hoặc chọn bàn khác). Trạng thái CLEANING → post-MVP (D-11).              |                                     |
| E-11 | —     | P2      | Hoàn tiền / void sau PAID — MVP?                      | Có trong MVP — chỉ QL/Chủ; bắt buộc lý do; ghi audit PAYMENT_VOID / hoàn tiền. NV vận hành không tự void. Tiền hoàn ngoài app (TM/CK tay).                           |                                     |

### E.2 Danh sách & Lịch sử đơn

| ID   | Story | Ưu tiên | Câu hỏi                                   | Trả lời                                                                                                                                    | Ghi chú |
| ---- | ----- | ------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------- |
| E-12 | B10   | P0      | Tab "Đang phục vụ" gồm status nào?        | **PENDING + MAKING + READY** (chưa PAID). Tách riêng tab **Chờ thanh toán** theo C-14                                                      |         |
| E-13 | B10   | P0      | Tab "Chờ thanh toán" = chỉ READY?         | **READY đã ấn Đã giao** + chưa PAID (C-14). READY chưa giao nằm tab **Món đã xong → Chờ giao**                                             |         |
| E-14 | B10   | P1      | Sort: mới nhất hay chờ lâu nhất?          | **Đang phục vụ / Chờ thanh toán:** chờ lâu nhất trước. **Hoàn thành / Lịch sử:** mới nhất trước                                            |         |
| E-15 | B10   | P1      | Filter theo bàn / mang đi / thu ngân tạo? | Filter **bàn**, **mang đi / tại bàn**, **trạng thái**. Không filter theo thu ngân (tablet trạm + chọn tên NV — B-15)                       |         |
| E-16 | B11   | P0      | "Trong ca" vs "Hôm nay" — định nghĩa ca?  | **Trong ca** = ca hiện tại (NIGHT/DAY/EVENING theo B-07). **Hôm nay** = 3 ca trong ngày lịch. Doanh thu PAID theo ca lúc thanh toán (B-06) |         |
| E-17 | B11   | P1      | CASHIER xem đơn mình tạo hay tất cả CN?   | **Tất cả đơn chi nhánh** đang làm việc (tablet trạm chung). ĐT cá nhân: cùng rule theo CN đã gán                                           |         |
| E-18 | B11   | P2      | Xem chi tiết món đơn đã PAID? Export?     | **Có** xem chi tiết PAID trên app. **Export CSV/PDF** → MVP v2.1 (Sprint 6+)                                                               |         |

---

## Phần F — Sprint 4: Barista Real-time (US-C01 → C04)

| ID   | Story | Ưu tiên | Câu hỏi                                             | Trả lời                                                                                         | Ghi chú |
| ---- | ----- | ------- | --------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ------- |
| F-01 | C01   | P0      | Transport: WebSocket hay SSE?                       | **WebSocket** (primary MVP v2). SSE chỉ fallback nếu WS không khả thi                           |         |
| F-02 | C01   | P0      | Nhiều barista: cùng queue hay claim đơn?            | **Cùng queue** — 2 NV/CN, tablet trạm chung (B-09). Không claim đơn                             |         |
| F-03 | C01   | P0      | Sắp xếp: FIFO hay ưu tiên mang đi / >5 phút?        | **FIFO** mặc định. **MVP v2.1:** badge ưu tiên mang đi nếu chờ >5 phút                          |         |
| F-04 | C01   | P1      | Ngưỡng cảnh báo chờ: 5 phút đúng thực tế?           | **5 phút** PENDING → cảnh báo vàng; **10 phút** → đỏ + nhắc NV                                  |         |
| F-05 | C01   | P1      | Âm thanh / rung đơn mới — bắt buộc hay tùy chỉnh?   | **Bật mặc định** trên tablet trạm; tắt được trong Cài đặt (H-06)                                |         |
| F-06 | C01   | P1      | Tablet bếp cố định — login cá nhân hay chung?       | **Tài khoản trạm chung** + chọn tên NV khi thao tác (A-09, B-15)                                |         |
| F-07 | C02   | P1      | Modifier hiển thị tag hay dòng text?                | **Tag màu** (Size / Đường / Đá) + dòng text phụ khi cần                                         |         |
| F-08 | C02   | P1      | Ghi chú đặc biệt (ít đá, gấp) — highlight?          | **Có** — `baristaNote` highlight vàng/đỏ; từ khóa "gấp", "ít đá" in đậm                         |         |
| F-09 | C03   | P0      | Một barista / đơn MAKING hay nhiều người?           | **Một NV / đơn** ở trạng thái MAKING (tránh trùng pha)                                          |         |
| F-10 | C03   | P1      | Món x2 — check một hay hai lần?                     | **Check theo dòng** — qty=2 hiện badge ×2; một lần tick cho cả dòng                             |         |
| F-11 | C03   | P1      | Timer từ PENDING hay MAKING?                        | Từ **MAKING** (thời gian pha thực tế). Hiện thêm "chờ từ PENDING" nếu >5 phút                   |         |
| F-12 | C03   | P0      | Status SERVING (migration) — giữ hay xóa?           | **Xóa SERVING** — dùng `READY` thay thế (GAP-05). Flow: PENDING → MAKING → READY → PAID         |         |
| F-13 | C04   | P0      | READY → push: Expo push hay in-app only?            | **Tablet trạm:** in-app + âm thanh. **ĐT cá nhân NV:** Expo push (MVP v2). Không bắt buộc pilot |         |
| F-14 | C04   | P1      | Đơn READY lâu không lấy — cảnh báo Manager?         | **Có** — READY >10 phút chưa Đã giao → thông báo QL + nhắc trên tab Món đã xong                 |         |
| F-15 | C04   | P1      | Revert READY → MAKING — ai được phép?               | **NV vận hành + QL**; bắt buộc lý do; ghi audit                                                 |         |
| F-16 | —     | P0      | KPI <3s: chấp nhận polling 10s fallback khi WS lỗi? | **Có** — WS lỗi → polling 10s + banner "Kết nối chậm". Mất mạng → thủ công (B-18)               |         |
| F-17 | —     | P1      | Android background — cần foreground service?        | **Không MVP v2** — tablet trạm luôn mở tại quầy. ĐT cá nhân: push khi app background            |         |

---

## Phần G — Sprint 5: Quản lý (US-D01 → D06, US-E01)

| ID   | Story | Ưu tiên | Câu hỏi                                               | Trả lời                                                                                             | Ghi chú |
| ---- | ----- | ------- | ----------------------------------------------------- | --------------------------------------------------------------------------------------------------- | ------- |
| G-01 | D01   | P0      | "Số khách" = số đơn PAID hay ước lượng người?         | **Số đơn PAID** (proxy MVP v2). Không đếm số người/bàn — post-MVP                                   |         |
| G-02 | D01   | P1      | Biểu đồ giờ — timezone Asia/Ho_Chi_Minh cố định?      | **Cố định Asia/Ho_Chi_Minh**                                                                        |         |
| G-03 | D02   | P1      | Doanh thu gross hay trừ phí CK/ví?                    | **Gross** (tổng PAID). Phí cổng thanh toán đối soát ngoài app                                       |         |
| G-04 | D02   | P1      | Top selling: top 5 hay top 10?                        | **Top 10** món + top 5 category                                                                     |         |
| G-05 | D02   | P1      | OWNER xem tổng đa chi nhánh một dashboard?            | **Có** — dashboard chuỗi + drill-down từng CN                                                       |         |
| G-06 | D03   | P0      | Một ca nhiều thu ngân — doanh thu gộp hay theo người? | **Gộp theo ca/CN** (B-06). Không tách theo NV (tablet trạm + audit theo người xác nhận)             |         |
| G-07 | D03   | P1      | Kết ca — form kiểm đếm tiền mặt?                      | **Có** — nhập TM thực tế + CK đối chiếu; chênh lệch ghi chú bắt buộc nếu lệch (B-03)                |         |
| G-08 | D03   | P1      | Ca đóng — force logout nhân viên còn login?           | **ĐT cá nhân:** nhắc + auto logout sau mốc ca +10p (B-11). **Tablet trạm:** không force logout      |         |
| G-09 | D04   | P0      | CRUD menu đầy đủ hay chỉ thêm + ẩn món?               | **MVP v2:** thêm / sửa giá / ẩn-hết hàng / sửa tên. **Xóa cứng** chỉ Owner; mặc định soft-hide      |         |
| G-10 | D04   | P1      | Sửa giá — áp dụng ngay hay từ ngày mai?               | **Áp dụng ngay** cho đơn mới; ghi audit. Lên lịch giá theo ngày → post-MVP                          |         |
| G-11 | D04   | P2      | Upload ảnh món trên mobile?                           | **MVP v2.1** — Owner/QL upload từ app. Pilot: placeholder (D-20)                                    |         |
| G-12 | D04   | P2      | Quản lý modifier template trên app?                   | **Post-MVP v2.1** — pilot seed template Size/Đường/Đá (D-21)                                        |         |
| G-13 | D05   | P1      | Status đang làm/nghỉ — từ login hay Manager set?      | **Manager/Owner set** `isActive`. Login không tự đổi trạng thái làm việc                            |         |
| G-14 | D05   | P1      | Thêm NV mới trên app — MVP hay seed/backend?          | **Pilot:** seed/backend. **MVP v2:** Owner tạo user + QL đề xuất gán CN                             |         |
| G-15 | D05   | P0      | Flow BRANCH_ASSIGNMENT — đã pilot thật chưa?          | **Bắt buộc pilot thật** — QL đề xuất → Owner duyệt trước khi NV login (BRANCH_ASSIGNMENT.md)        |         |
| G-16 | D05   | P1      | OWNER duyệt gán CN — push notify?                     | **MVP v2** — push + badge (C-10). Pilot: in-app list chờ duyệt                                      |         |
| G-17 | D06   | P2      | Lịch ca tuần trên profile — nguồn data?               | **Ngoài MVP v2** — không có lịch ca trong app; ca theo giờ hệ thống (B-07)                          |         |
| G-18 | E01   | P1      | Thêm/xóa bàn trên app — MVP hay seed cố định?         | **Pilot:** seed 50 bàn (D-05). **MVP v2:** QL thêm/ẩn/MAINTENANCE; không xóa cứng lịch sử           |         |
| G-19 | E01   | P1      | MAINTENANCE khi bàn OCCUPIED — chặn hay cảnh báo?     | **Chặn** — phải PAID / chuyển đơn trước khi đặt MAINTENANCE                                         |         |
| G-20 | —     | P0      | MANAGER xem báo cáo tất cả CN hay chỉ CN được gán?    | **Chỉ CN được gán**. **Owner** xem tất cả CN (G-05)                                                 |         |
| G-21 | —     | P1      | Chức năng Manager nào hoãn sau pilot 2 tuần?          | Hoãn: inventory, lịch ca NV, export PDF, ảnh món upload, best-seller auto, dark mode, offline queue |         |

---

## Phần H — Sprint 6: Polish, Thông báo, UAT (US-E02, E03)

| ID   | Story | Ưu tiên | Câu hỏi                                                     | Trả lời                                                                                                                                                    | Ghi chú                                         |
| ---- | ----- | ------- | ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| H-01 | E02   | P0      | Loại notification MVP: ORDER_READY / ORDER_NEW / LOW_STOCK? | **MVP v2:** ORDER_NEW, ORDER_READY, BRANCH_ASSIGNMENT_PENDING (Owner). **LOW_STOCK** → post-MVP                                                            |                                                 |
| H-02 | E02   | P1      | Feed giữ bao lâu? Mark read + badge count?                  | Giữ **7 ngày**; mark read từng条; badge unread trên tab Thông báo                                                                                          |                                                 |
| H-03 | E02   | P1      | Push khi app đóng — cần Expo production credentials?        | **Có** cho ĐT cá nhân NV + Owner (MVP v2 UAT). Tablet trạm: in-app only                                                                                    |                                                 |
| H-04 | E03   | P1      | Đổi MK: cần MK cũ + rule độ mạnh?                           | **Có** — MK cũ + MK mới ≥8 ký tự (chữ + số). Ghi audit                                                                                                     |                                                 |
| H-05 | E03   | P2      | Màn "Thông tin quán" hiển thị gì?                           | Tên chuỗi, địa chỉ CN, hotline, giờ mở (24/7), STK CK (ẩn bớt số), phiên bản app                                                                           |                                                 |
| H-06 | E03   | P2      | Cài đặt âm thanh/rung per role?                             | **Per thiết bị** — toggle âm thanh đơn mới / rung. Mặc định bật tablet trạm                                                                                |                                                 |
| H-07 | E03   | P2      | Hiển thị version app + check update?                        | Hiện **version + build** trong Cài đặt. Auto-update check → post-MVP (EAS)                                                                                 |                                                 |
| H-08 | —     | P0      | Ngày bắt đầu pilot? Chạy song song giấy bao lâu?            | **Ngày G (D0):** sau Sprint 3 pass UAT — ngày cụ thể do chủ quán chốt (chưa chốt 2026-06-29). **Song song giấy:** **3–5 ngày** đầu pilot, sau đó thuần app | Đồng bộ ngày G vào GO_LIVE_PLAN khi chủ quán ký |
| H-09 | —     | P0      | Ai chấm UAT? Bao nhiêu kịch bản tối thiểu?                  | **Owner + QL CN pilot** chấm. Tối thiểu **15 kịch bản** (login, order, bếp, TM, CK, hủy, gộp bàn, kết ca…)                                                 |                                                 |
| H-10 | —     | P1      | Bug critical giờ cao điểm — SLA hotfix?                     | **4 giờ** trong giờ mở cửa; critical = không tạo đơn / không thanh toán / mất đơn                                                                          |                                                 |
| H-11 | —     | P1      | Tiêu chí go/no-go mở rộng chi nhánh 2?                      | **7 ngày** pilot CN1 ổn định; **0 critical** còn mở; NV trained; menu seed đủ                                                                              |                                                 |
| H-12 | —     | P1      | NFR p95 <500ms — test WiFi quán hay cả 4G?                  | **WiFi quán** (primary A-10). Spot-check **4G** trên ĐT NV                                                                                                 |                                                 |
| H-13 | —     | P1      | Ai review copy lỗi tiếng Việt cuối?                         | **QL CN pilot + Owner** trước UAT; dev sửa copy trong repo                                                                                                 |                                                 |

---

## Phần I — Hạ tầng & Kỹ thuật

| ID   | Ưu tiên | Câu hỏi                                                      | Trả lời                                                                                                                            | Ghi chú |
| ---- | ------- | ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- | ------- |
| I-01 | P0      | API pilot/staging deploy ở đâu? Domain + SSL?                | **VPS/cloud VN** (staging + production). Domain `api.*` + **SSL Let's Encrypt**. Chi tiết deploy: chủ quán/dev chốt trước Sprint 3 |         |
| I-02 | P0      | `EXPO_PUBLIC_API_URL` production trỏ đâu?                    | Staging pilot → production khi UAT pass. Không hard-code IP trong build release                                                    |         |
| I-03 | P1      | Seed demo đủ UAT hay cần import menu thật?                   | **Import menu thật** từ D-13 + 50 bàn/CN + 3 CN + tài khoản Owner/QL/NV. Seed demo chỉ dev local                                   |         |
| I-04 | P2      | Generate `openapi.yaml` — ưu tiên sprint nào?                | **Sprint 3** (sau payment API ổn định) — GAP-07                                                                                    |         |
| I-05 | P1      | Design PNG/Figma — dev bám file nào? (repo vs local)         | `design/screens/*.png` + `DESIGN_SYSTEM.md`. Commit repo trước Sprint 2                                                            |         |
| I-06 | P1      | Ngôn ngữ app: 100% tiếng Việt MVP?                           | **100% tiếng Việt** MVP v1/v2. i18n → post-MVP                                                                                     |         |
| I-07 | P2      | Cỡ chữ lớn cho thu ngân cao tuổi?                            | **MVP v2.1** — toggle "Chữ lớn" (+1–2 step). MVP v2 dùng token chuẩn DESIGN_SYSTEM                                                 |         |
| I-08 | P2      | Dark mode MVP?                                               | **Không** — light mode only                                                                                                        |         |
| I-09 | P2      | Apple Developer / Google Play internal test — sprint target? | **Google Play internal** Sprint 5–6 (Android pilot). iOS sau khi có thiết bị                                                       |         |

---

## Phần J — Mâu thuẫn tài liệu cần chốt (GAP)

| ID     | Mâu thuẫn / gap                                               | Quyết định chốt                                                                                                                   | Doc cần cập nhật                     | Owner         | Deadline          | Block P2? |
| ------ | ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ | ------------- | ----------------- | --------- |
| GAP-01 | SPRINT_PLAN: Sprint 1 Done vs DOR: IN PROGRESS                | **Sprint 1 code done; E2E C-15 + refactor routing pending**                                                                       | ✅ Synced 2026-06-29                 | Tech Lead     | —                 | —         |
| GAP-02 | US-A02 chọn CN vs BRANCH_ASSIGNMENT: staff không chọn CN      | **Staff không chọn CN** — chỉ Owner                                                                                               | ✅ `USER_STORIES`, `PRD`             | —             | —                 | —         |
| GAP-03 | PRD VAT 8% configurable — bật pilot?                          | **Giá đã gồm VAT 8%** (D-17)                                                                                                      | ✅ `PRD`, `API_CONTRACT`             | —             | —                 | —         |
| GAP-04 | PRD out of scope: split bill / gộp bàn                        | **MVP v2 in scope** (B-30)                                                                                                        | ✅ `PRD` §7.1                        | —             | —                 | —         |
| GAP-05 | Migration `order_status_serving` — SERVING còn dùng?          | **Xóa SERVING** → `deliveredAt`                                                                                                   | ✅ `ERD`, `API_CONTRACT`, code P2-02 | Tech Lead     | Phase 2 (P2-02)   | —         |
| GAP-06 | API: shift OPEN bắt buộc khi tạo order — bật sprint nào?      | **Sprint 5**; pilot optional                                                                                                      | ✅ `API_CONTRACT`, `SPRINT_PLAN`     | —             | Sprint 5          | —         |
| GAP-07 | OpenAPI chưa generate                                         | **Sprint 3** (I-04)                                                                                                               | `openapi.yaml` từ NestJS             | **Tech Lead** | **Cuối Sprint 3** | **Không** |
| GAP-08 | Design PNG có thể chưa commit repo                            | **Dev tiếp tục từ design cũ** (`DESIGN_SYSTEM.md` + INDEX màn hình); PNG commit repo khi có — **không block** Sprint 2 / refactor | `design/screens/*.png` (optional)    | **Designer**  | Khi có file PNG   | **Không** |
| GAP-09 | MOBILE_ARCHITECTURE: AuthProvider ⏳ vs Sprint 1 Done         | **AuthProvider Done**                                                                                                             | ✅ `MOBILE_ARCHITECTURE`             | —             | —                 | —         |
| GAP-10 | DEVICE_POLICY: barista real-time "Sprint 3+" vs plan Sprint 4 | **Polling S2–3; WS S4**                                                                                                           | ✅ `DEVICE_POLICY`, `SPRINT_PLAN`    | —             | —                 | —         |
| GAP-11 | Tablet trạm thiếu Tab Bếp (hoàn thành món)                    | **Shell trạm: Tab Thu ngân + Tab Bếp**                                                                                            | ✅ code P2-03b                       | Mobile dev    | Phase 2 (P2-03b)  | —         |

---

## Phần K — Tóm tắt quyết định chính (điền sau khi xong)

> Copy các quyết định P0 đã chốt vào đây để team dev đọc nhanh.

### K.1 Pilot

- Chi nhánh / bàn / nhân sự: **3 CN** · **CN1 pilot: CN Quận 1** · **50 bàn/CN** (T1×20, T2×20, sân×10) · **2 PHA CHẾ/THU NGÂN VÀ 5 PHỤC VỤ BÀN/CN** (pha + thu ngân)
- Thiết bị / mạng: **1 tablet trạm/CN** + **ĐT cá nhân/NV** · WiFi ổn định · **không offline**
- Deadline: **Pilot 2 tuần** sau Sprint 3 UAT (ngày cụ thể H-08)

### K.2 Ca làm & Shift

- Mở/kết ca: **QL nhận/kết ca** · không chặn đơn tồn · đối chiếu TM/CK cuối ca
- Shift module: **tắt pilot** → **bật Sprint 5** (auto gắn ca + rollover)
- Báo cáo theo ca hay ngày: **theo ca 8h** (B-06); PAID = lúc thanh toán

### K.3 Luồng đơn hàng

- Tại bàn vs mang đi: **~75/25** (giả định) · luôn màn chọn loại
- Nhiều đơn/bàn: **append nếu chưa PAID** · **order mới nếu đã PAID** · gộp/tách bill (B-30)
- Thanh toán khi nào: **mặc định READY/sau giao** · linh hoạt (B-29)
- Sau PAID — bàn EMPTY: **tự EMPTY** (pilot); CLEANING post-MVP

### K.4 Sprint 2 scope chốt

- Menu seed: **~40 món / 6 category** (D-13) từ chủ quán
- Real-time bàn (polling): **3–5s** màn bàn · **10s** màn khác
- Demo E2E: **bàn → menu → giỏ → gửi bếp → Tab Bếp: MAKING → READY → Đã giao** (TASK-P2-03b)

### K.5 Payment MVP

- Phương thức: **TM + CK** (pilot) · Thẻ/Ví ghi nhận → **v2**
- VietQR: **tự sinh theo số tiền** · STK theo CN/chủ quán
- VAT: **8% đã gồm giá** · bill tách dòng VAT

### K.6 Barista real-time

- Transport: **WS Sprint 4** · polling fallback 10s
- Multi-barista: **queue chung** · không claim
- Push notification: **in-app tablet** · **Expo push ĐT** MVP v2

### K.7 Manager MVP

- Dashboard must-have: **doanh thu ca/CN** · top món · kết ca TM/CK · audit (Owner/QL)
- Hoãn post-pilot: **inventory, lịch ca, export PDF, ảnh món, offline**

### K.8 UAT

- Ngày pilot: **sau Sprint 3 pass UAT** (ngày G chủ quán chốt) · song song giấy **3–5 ngày**
- Go/no-go criteria: **7 ngày ổn định CN1** · **0 critical** · NV trained → mở CN2 (H-11)

---

## Phần L — Checklist sau khi điền xong

- [x] Tất cả câu **P0** đã có trả lời — MVP v2 questionnaire
- [x] Phần **J (GAP)** đã chốt — docs đã sync 2026-06-29
- [x] Phần **K** đã tóm tắt
- [x] Cập nhật `PRD.md` theo quyết định mới
- [x] Cập nhật `USER_STORIES.md` (AC / open questions)
- [x] Cập nhật `SPRINT_PLAN.md` (scope / status)
- [x] Cập nhật `DOR_CHECKLIST.md` (Sprint 1 / A02–A03)
- [x] Cập nhật `DEVICE_POLICY.md`, `BRANCH_ASSIGNMENT.md`, `DISCOVERY.md`
- [x] Cập nhật `API_CONTRACT.md`, `ERD.md`, `MOBILE_ARCHITECTURE.md`, `TESTING.md`
- [x] **Order lifecycle (P2-02):** `deliveredAt` thay `SERVING`; `POST /orders/:id/deliver`
- [ ] **Code refactor** còn lại: tablet trạm picker (xem MOBILE_ARCHITECTURE)
- [x] Thông báo team / ghi changelog nội bộ — [CHANGELOG.md](../CHANGELOG.md) mục Doc Freeze 2026-06-29 · [DOC_FREEZE_MEMO.md](DOC_FREEZE_MEMO.md)

---

## Tham chiếu sprint & story

| Sprint | Stories           | Points | Màn hình |
| ------ | ----------------- | ------ | -------- |
| 1      | US-A01 → A04      | 10     | 01–04    |
| 2      | US-B01 → B05      | 23     | 05–09    |
| 3      | US-B06 → B11      | 13     | 10–15    |
| 4      | US-C01 → C04      | 19     | 16–19    |
| 5      | US-D01 → D06, E01 | 32     | 20–26    |
| 6      | US-E02, E03 + UAT | 18     | 27–28    |

**Tổng:** 28 stories · 112 points · ~6 sprints
