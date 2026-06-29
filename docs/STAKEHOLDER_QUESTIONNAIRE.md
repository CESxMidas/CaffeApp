# CaffeApp — Bảng câu hỏi Stakeholder & Vận hành

**Mục đích:** Thu thập quyết định nghiệp vụ trước và trong giai đoạn coding (Sprint 1 → Sprint 6).  
**Cách dùng:** Điền cột **Trả lời**; đánh dấu **Ưu tiên** nếu cần chốt gấp; ghi **Ghi chú** khi câu trả lời phụ thuộc điều kiện.  
**Sau khi hoàn thành:** Cập nhật `PRD.md`, `USER_STORIES.md`, `SPRINT_PLAN.md`, `DOR_CHECKLIST.md` theo các quyết định đã chốt.

**Trạng thái:** 🔄 Đang điền — Phần A, B.1, B.2 đã chuẩn hóa

---

## Chú giải

| Ký hiệu | Ý nghĩa |
| ------- | ------- |
| **P0** | Phải chốt trước khi code sprint liên quan |
| **P1** | Nên chốt trong sprint |
| **P2** | Có thể hoãn sau pilot |
| ☐ | Chưa trả lời |
| ☑ | Đã chốt |

**Liên kết tài liệu:** [PRD](PRD.md) · [USER_STORIES](USER_STORIES.md) · [SPRINT_PLAN](SPRINT_PLAN.md) · [DISCOVERY](DISCOVERY.md) · [DEVICE_POLICY](DEVICE_POLICY.md) · [BRANCH_ASSIGNMENT](BRANCH_ASSIGNMENT.md) · [API_CONTRACT](api/API_CONTRACT.md)

---

## Phần A — Bối cảnh quán & Pilot

| ID | Ưu tiên | Câu hỏi | Trả lời | Ghi chú |
| -- | ------- | ------- | ------- | ------- |
| A-01 | P0 | Quán pilot là quán thật hay mô phỏng? Tên, địa chỉ? | Quán thật — dự án vận hành đang phát triển hệ thống | Tên / địa chỉ chi nhánh pilot: _bổ sung_ |
| A-02 | P0 | Số chi nhánh hiện tại và kế hoạch mở rộng (6 tháng)? | 3 chi nhánh; kế hoạch mở thêm nhiều CN trong 6 tháng | |
| A-03 | P0 | Một ca điển hình: bao nhiêu bàn, thu ngân, barista? | 50 bàn/CN: T1 ×20, T2 ×20, sân ×10 | Số thu ngân & barista/ca: _bổ sung ở B-13_ |
| A-04 | P1 | Giờ mở/đóng cửa? Có chia ca sáng/chiều/tối? | Mở 24/7; 3 ca × 8 giờ (00–08, 08–16, 16–24) | |
| A-05 | P1 | Giờ cao điểm: khoảng bao nhiêu đơn/giờ? | Cao điểm 18:00–22:00 | Chưa có số đơn/giờ baseline — đo khi pilot |
| A-06 | P0 | Menu thực tế: số category, số món, có size/topping phức tạp? | ~6 nhóm (cà phê, trà, freeze, bánh…); size S/M/L; giá 19k–69k; modifier size/đường/đá | Tham chiếu menu Highlands; seed data từ chủ quán — pending |
| A-07 | P1 | Có combo / món theo mùa trong MVP không? | Có trong vận hành thực tế; MVP ưu tiên món đơn + size | Combo giờ vàng, voucher, món mùa → post-MVP (engine khuyến mãi) |
| A-08 | P2 | Có giao hàng (Grab/ShopeeFood) trong MVP không? | Không — chưa liên kết | |
| A-09 | P0 | Thiết bị pilot: tablet/phone? Android/iOS? Mấy máy? | 1 tablet trạm chung/CN (quầy + bếp cùng khu) + ĐT nhân viên (cá nhân) | Tablet: tài khoản trạm; ĐT: login cá nhân. Android ưu tiên pilot |
| A-10 | P1 | Mạng quán: WiFi ổn định hay cần offline fallback? | WiFi ổn định; không cần offline-first MVP | |
| A-11 | P0 | Deadline demo/pilot cứng (nếu có)? | 2 tuần | |
| A-12 | P1 | Team: solo hay có thêm dev/QA/designer? | Đã có design UI; coding đang setup và bắt đầu | |
| A-13 | P1 | Velocity ~20 pts/sprint có khả thi không? | Khả thi | |

---

## Phần B — Luồng vận hành tổng thể (xuyên sprint)

### B.1 Vòng đời một ngày làm việc

| ID | Ưu tiên | Câu hỏi | Trả lời | Ghi chú |
| -- | ------- | ------- | ------- | ------- |
| B-01 | P0 | Ai **mở ca** trên hệ thống? (Manager / thu ngân đầu tiên / tự động) | 3 ca tự theo giờ (00–08, 08–16, 16–24). QL chi nhánh **nhận ca** trên app (xem thông tin / bàn giao) — không mở/tắt bán hàng | Vai trò: Owner, QL CN, thu ngân/pha chế, NV phục vụ bàn. Bàn giao 15p cuối/đầu ca = **ngoài app** |
| B-02 | P0 | Ai được **kết ca**? Có bắt buộc đóng hết đơn trước khi kết ca? | QL chi nhánh ca đó kết ca. **Không** bắt buộc đóng hết đơn PENDING/MAKING/READY | Chi tiết đơn tồn: xem B-04 |
| B-03 | P1 | Khi kết ca: cần báo cáo tổng kết tiền mặt (thực tế vs hệ thống)? | Có — báo cáo trên app; đối chiếu tiền mặt thực tế vs hệ thống (tách TM / CK) | Két tiền chung giữa các ca |
| B-04 | P0 | Đơn PENDING/MAKING/READY lúc kết ca — xử lý thế nào? | PAID giữ nguyên ca. PENDING/MAKING/READY theo thời gian thực; qua mốc 08/16/00 → chuyển **ca kế** nếu chưa xong. Mở/đóng ca **không chặn** bởi đơn tồn | Nhắc chốt / thu tiền 5–10p trước đổi ca (không block). READY: nhắc khách thanh toán tại quầy |
| B-05 | P0 | Module **shift** (`shifts` table): bật bắt buộc MVP không? Sprint nào? | **Pilot 2 tuần:** chưa bắt buộc `shift_id` (dùng `created_at`). **Sau pilot / Sprint 5:** bật auto gắn ca + rollover đơn mở | Mở ca = nhận ca + xem info; **không** gate tạo đơn |
| B-06 | P0 | Doanh thu báo cáo gắn **ca** hay **ngày lịch** (00:00–23:59)? | Theo **ca** (khung 8h). Doanh thu PAID = ca lúc **thanh toán** | |
| B-07 | P1 | Định nghĩa ca: MORNING/AFTERNOON/EVENING cố định giờ hay tự mở? | 3 ca **cố định giờ**: NIGHT 00–08, DAY 08–16, EVENING 16–24 | Nhắc chốt trước mốc đổi ca 5–10 phút |

### B.2 Đầu ca / cuối ca theo vai trò

| ID | Ưu tiên | Câu hỏi | Trả lời | Ghi chú |
| -- | ------- | ------- | ------- | ------- |
| B-08 | P1 | Thu ngân đầu ca: cần **đếm tiền đầu ca** (float cash) trên app? | Không bắt buộc nhập float đầu ca. **Kết ca:** đối chiếu TM / CK trên app vs tiền thực tế; két chung các ca | Tablet trạm: 1 tài khoản chung; chọn tên NV khi thao tác. App hỗ trợ tính tiền thừa; tổng TM + CK đối chiếu cuối ca |
| B-09 | P2 | Barista đầu ca: chỉ login hay cần xác nhận "Sẵn sàng pha chế"? | Login trạm = làm việc ngay; **không** màn "Sẵn sàng pha chế" | Quầy + bếp **chung khu**, 1 tablet/CN: tab Thu ngân + Bếp. Xác nhận đơn → chọn tên NV → `PENDING` (không nút "Gửi bếp" riêng) |
| B-10 | P2 | Manager cần duyệt mở ca trước khi tạo đơn? | Không — đơn tự theo thời gian thực / ca hệ thống | |
| B-11 | P0 | Cuối ca: đăng xuất bắt buộc — có nhắc nếu còn đơn mở? | **ĐT cá nhân:** nhắc cuối ca; auto logout phiên sau mốc ca +10p. **Tablet trạm:** không auto logout; chỉ nhắc đổi ca / bàn giao | |
| B-12 | P2 | Nhân viên quên đăng xuất — ca sau có cảnh báo phiên cũ? | **Tablet trạm:** không áp dụng (máy chung, không phiên cá nhân). **ĐT cá nhân:** không bắt buộc cảnh báo phiên cũ | |

### B.3 Đa người dùng & xung đột

| ID | Ưu tiên | Câu hỏi | Trả lời | Ghi chú |
| -- | ------- | ------- | ------- | ------- |
| B-13 | P0 | Một chi nhánh: mấy thu ngân / mấy máy quầy song song? | | |
| B-14 | P0 | Hai thu ngân cùng chọn một bàn — khóa bàn hay ai chọn trước? | | |
| B-15 | P1 | Thu ngân A tạo đơn — thu ngân B được xem/sửa không? | | |
| B-16 | P1 | Manager vào role thu ngân — audit ghi MANAGER hay CASHIER? | | |
| B-17 | P2 | Một người vừa pha vừa thu ngân — đổi role giữa ca được không? | | |

### B.4 Mạng, offline, lỗi

| ID | Ưu tiên | Câu hỏi | Trả lời | Ghi chú |
| -- | ------- | ------- | ------- | ------- |
| B-18 | P0 | Mất mạng khi đông khách — quy trình dự phòng? | | |
| B-19 | P1 | Giỏ hàng local khi offline: giữ bao lâu? Có mã hóa? | | |
| B-20 | P2 | API down > 5 phút — thông báo Manager? | | |
| B-21 | P1 | Barista reconnect — queue tự sync không cần refresh tay? | | |

### B.5 Audit & truy vết

| ID | Ưu tiên | Câu hỏi | Trả lời | Ghi chú |
| -- | ------- | ------- | ------- | ------- |
| B-22 | P1 | Cần log chi tiết: hủy đơn, giảm giá, sửa giá — mức nào? | | |
| B-23 | P2 | Chủ quán xem audit_logs trên app hay chỉ backend? | | |
| B-24 | P1 | CK xác nhận thủ công — ai chịu trách nhiệm nếu nhầm? | | |

### B.6 Workflow đơn hàng tổng quát

| ID | Ưu tiên | Câu hỏi | Trả lời | Ghi chú |
| -- | ------- | ------- | ------- | ------- |
| B-25 | P0 | Khách vào: chọn bàn trước hay order trước gán bàn sau? | | |
| B-26 | P0 | Một bàn có nhiều đơn cùng lúc (gọi thêm) không? | | |
| B-27 | P1 | Đổi bàn giữa chừng — MVP cần không? Ai được phép? | | |
| B-28 | P1 | Đơn mang đi: cần số thứ tự (#042) cho khách không? | | |
| B-29 | P0 | Thanh toán: trả khi order hay trả khi rời bàn? | | |
| B-30 | P2 | Tách bill / gộp bàn — pilot có case thực tế không? (PRD: out of scope) | | |
| B-31 | P2 | Giảm giá / voucher / khuyến mãi trong MVP? | | |
| B-32 | P1 | Ghi chú nội bộ vs ghi chú barista — một hay hai field? | | |
| B-33 | P1 | Sau barista READY — ai báo khách? Có màn "Món đã xong"? | | |

---

## Phần C — Sprint 1: Auth & Phân quyền (US-A01 → A04)

**Trạng thái sprint (chốt):** ☐ Done chính thức · ☐ Còn việc · Ghi rõ: _______________

| ID | Story | Ưu tiên | Câu hỏi | Trả lời | Ghi chú |
| -- | ----- | ------- | ------- | ------- | ------- |
| C-01 | A01 | P0 | Đăng nhập: email, SĐT, hay một ô chung? Format SĐT? | | |
| C-02 | A01 | P1 | Quên mật khẩu — MVP có cần? Hay Manager reset thủ công? | | |
| C-03 | A01 | P2 | Sai MK 5 lần — khóa tài khoản tạm? | | |
| C-04 | A01 | P0 | Access token 15 phút + refresh — đủ mượt ca 8 tiếng? | | |
| C-05 | A01 | P0 | Session timeout: PRD 8 giờ vs JWT 15 phút — rule nào đúng? | | |
| C-06 | A01 | P2 | Force logout thiết bị khác — MVP cần? | | |
| C-07 | A01 | P2 | Đăng nhập sinh trắc học (FR-A05) — có trong pilot? | | |
| C-08 | A02 | P0 | CASHIER/BARISTA không chọn CN (BRANCH_ASSIGNMENT) — code đã khớp? | | |
| C-09 | A02 | P1 | OWNER đổi CN giữa phiên không cần logout? | | |
| C-10 | A02 | P1 | Nhân viên PENDING_OWNER — ai nhận thông báo cần duyệt? | | |
| C-11 | A03 | P0 | MANAGER thấy mấy card role? OWNER chọn role nào? | | |
| C-12 | A03 | P2 | Sau chọn role — cần màn xác nhận lại? | | |
| C-13 | A04 | P1 | 6 quick actions — thứ tự đúng thói quen quầy? | | |
| C-14 | A04 | P1 | "Món đã xong" = đơn READY chưa thanh toán? | | |
| C-15 | — | P0 | Demo login E2E thiết bị thật + SecureStore sau kill app — pass? | | |

---

## Phần D — Sprint 2: Order Core (US-B01 → B05)

**Demo tối thiểu Sprint 2:** ☐ Chọn bàn → menu → giỏ → gửi bếp · Khác: _______________

### D.1 US-B01 — Chọn loại đơn

| ID | Ưu tiên | Câu hỏi | Trả lời | Ghi chú |
| -- | ------- | ------- | ------- | ------- |
| D-01 | P0 | Tỷ lệ đơn tại bàn vs mang đi (~%)? | | |
| D-02 | P1 | Luôn qua màn chọn loại hay nhớ lựa chọn trước? | | |
| D-03 | P1 | Mang đi: cần tên/SĐT khách trước khi chọn món? | | |
| D-04 | P2 | Dự trù enum DELIVERY cho tương lai? | | |

### D.2 US-B02 — Sơ đồ bàn

| ID | Ưu tiên | Câu hỏi | Trả lời | Ghi chú |
| -- | ------- | ------- | ------- | ------- |
| D-05 | P0 | Số bàn pilot? Tên bàn (B01 vs Bàn 1)? | | |
| D-06 | P0 | Layout: lưới cố định hay khu vực (trong/sân)? | | |
| D-07 | P0 | Bàn OCCUPIED — chỉ xem đơn hay được thêm món (round 2)? | | |
| D-08 | P0 | Một bàn nhiều đơn: gộp bill hay nhiều order_id? | | |
| D-09 | P1 | Real-time Sprint 2: polling bao nhiêu giây chấp nhận được? | | |
| D-10 | P1 | Màu MAINTENANCE + legend chú thích? | | |
| D-11 | P2 | Trạng thái CLEANING (khách rời, chưa dọn)? | | |
| D-12 | P1 | Khóa bàn khi một thu ngân đang order? | | |

### D.3 US-B03 — Menu

| ID | Ưu tiên | Câu hỏi | Trả lời | Ghi chú |
| -- | ------- | ------- | ------- | ------- |
| D-13 | P0 | Số category + món cần seed? Ai cung cấp data? Deadline? | | |
| D-14 | P1 | Category tab cố định 3 hay dynamic từ API? | | |
| D-15 | P1 | Tìm kiếm món theo tên — MVP? | | |
| D-16 | P0 | Món hết hàng: ẩn / gạch / badge "Hết"? | | |
| D-17 | P0 | Giá hiển thị đã gồm VAT 8% chưa? Bật VAT trên bill? | | |
| D-18 | P2 | Pin best-seller lên đầu menu? | | |
| D-19 | P1 | Giá khác nhau theo chi nhánh? | | |
| D-20 | P2 | Ảnh món: thật hay placeholder MVP? | | |

### D.4 US-B04 — Tùy chỉnh món

| ID | Ưu tiên | Câu hỏi | Trả lời | Ghi chú |
| -- | ------- | ------- | ------- | ------- |
| D-21 | P0 | Modifier chuẩn: Size, Đường, Đá — còn thiếu gì? | | |
| D-22 | P0 | Modifier có phụ thu giá? (Size L +5k) | | |
| D-23 | P1 | Topping: nhiều lựa chọn — tối đa N? | | |
| D-24 | P1 | Món không cần tùy chỉnh — skip modal, thêm thẳng giỏ? | | |
| D-25 | P1 | Ghi chú món vs ghi chú đơn — riêng hay chung? | | |
| D-26 | P1 | Pre-select mặc định (Size M, đường bình thường)? | | |

### D.5 US-B05 — Giỏ hàng & Gửi bếp

| ID | Ưu tiên | Câu hỏi | Trả lời | Ghi chú |
| -- | ------- | ------- | ------- | ------- |
| D-27 | P0 | Sau gửi bếp — thêm món: order mới hay append items? | | |
| D-28 | P0 | Hủy đơn PENDING: CASHIER được hủy? Cần lý do? | | |
| D-29 | P1 | Gửi bếp một phần (một số món trước)? | | |
| D-30 | P1 | Lưu đơn nháp khi thoát màn / kill app? | | |
| D-31 | P1 | Feedback sau gửi bếp: toast / âm thanh / số thứ tự? | | |
| D-32 | P1 | Món hết hàng trong giỏ lúc gửi — chặn hay cảnh báo? | | |
| D-33 | P1 | Sprint 2 demo: barista cần thấy đơn (dù chưa WS)? | | |

---

## Phần E — Sprint 3: Payment & Quản lý đơn (US-B06 → B11)

**MVP payment tối thiểu chốt:** ☐ Tiền mặt · ☐ Chuyển khoản · ☐ Thẻ · ☐ Ví điện tử

### E.1 Thanh toán

| ID | Story | Ưu tiên | Câu hỏi | Trả lời | Ghi chú |
| -- | ----- | ------- | ------- | ------- | ------- |
| E-01 | B06 | P0 | Thanh toán khi READY hay cho trả trước (PENDING)? | | |
| E-02 | B06 | P1 | Nút mệnh giá nhanh (50k, 100k, 200k)? | | |
| E-03 | B06 | P2 | Làm tròn tiền lẻ (bỏ 500đ)? | | |
| E-04 | B07 | P0 | STK ngân hàng? Nhiều STK theo chi nhánh? | | |
| E-05 | B07 | P0 | VietQR tự sinh theo số tiền — bắt buộc MVP? | | |
| E-06 | B07 | P1 | Xác nhận CK: cần mã GD / 4 số cuối? | | |
| E-07 | B07 | P1 | CK chưa vào TK — đơn READY giữ bao lâu? | | |
| E-08 | B08 | P1 | Thẻ: app chỉ ghi nhận hay tích hợp POS? | | |
| E-09 | B09 | P1 | Ví: MoMo hay ZaloPay ưu tiên? Quét QR khách hay merchant? | | |
| E-10 | — | P0 | Sau PAID — bàn DINE_IN tự EMPTY hay sau dọn thủ công? | | |
| E-11 | — | P2 | Hoàn tiền / void sau PAID — MVP? | | |

### E.2 Danh sách & Lịch sử đơn

| ID | Story | Ưu tiên | Câu hỏi | Trả lời | Ghi chú |
| -- | ----- | ------- | ------- | ------- | ------- |
| E-12 | B10 | P0 | Tab "Đang phục vụ" gồm status nào? | | |
| E-13 | B10 | P0 | Tab "Chờ thanh toán" = chỉ READY? | | |
| E-14 | B10 | P1 | Sort: mới nhất hay chờ lâu nhất? | | |
| E-15 | B10 | P1 | Filter theo bàn / mang đi / thu ngân tạo? | | |
| E-16 | B11 | P0 | "Trong ca" vs "Hôm nay" — định nghĩa ca? | | |
| E-17 | B11 | P1 | CASHIER xem đơn mình tạo hay tất cả CN? | | |
| E-18 | B11 | P2 | Xem chi tiết món đơn đã PAID? Export? | | |

---

## Phần F — Sprint 4: Barista Real-time (US-C01 → C04)

| ID | Story | Ưu tiên | Câu hỏi | Trả lời | Ghi chú |
| -- | ----- | ------- | ------- | ------- | ------- |
| F-01 | C01 | P0 | Transport: WebSocket hay SSE? | | |
| F-02 | C01 | P0 | Nhiều barista: cùng queue hay claim đơn? | | |
| F-03 | C01 | P0 | Sắp xếp: FIFO hay ưu tiên mang đi / >5 phút? | | |
| F-04 | C01 | P1 | Ngưỡng cảnh báo chờ: 5 phút đúng thực tế? | | |
| F-05 | C01 | P1 | Âm thanh / rung đơn mới — bắt buộc hay tùy chỉnh? | | |
| F-06 | C01 | P1 | Tablet bếp cố định — login cá nhân hay chung? | | |
| F-07 | C02 | P1 | Modifier hiển thị tag hay dòng text? | | |
| F-08 | C02 | P1 | Ghi chú đặc biệt (ít đá, gấp) — highlight? | | |
| F-09 | C03 | P0 | Một barista / đơn MAKING hay nhiều người? | | |
| F-10 | C03 | P1 | Món x2 — check một hay hai lần? | | |
| F-11 | C03 | P1 | Timer từ PENDING hay MAKING? | | |
| F-12 | C03 | P0 | Status SERVING (migration) — giữ hay xóa? | | |
| F-13 | C04 | P0 | READY → push: Expo push hay in-app only? | | |
| F-14 | C04 | P1 | Đơn READY lâu không lấy — cảnh báo Manager? | | |
| F-15 | C04 | P1 | Revert READY → MAKING — ai được phép? | | |
| F-16 | — | P0 | KPI <3s: chấp nhận polling 10s fallback khi WS lỗi? | | |
| F-17 | — | P1 | Android background — cần foreground service? | | |

---

## Phần G — Sprint 5: Quản lý (US-D01 → D06, US-E01)

| ID | Story | Ưu tiên | Câu hỏi | Trả lời | Ghi chú |
| -- | ----- | ------- | ------- | ------- | ------- |
| G-01 | D01 | P0 | "Số khách" = số đơn PAID hay ước lượng người? | | |
| G-02 | D01 | P1 | Biểu đồ giờ — timezone Asia/Ho_Chi_Minh cố định? | | |
| G-03 | D02 | P1 | Doanh thu gross hay trừ phí CK/ví? | | |
| G-04 | D02 | P1 | Top selling: top 5 hay top 10? | | |
| G-05 | D02 | P1 | OWNER xem tổng đa chi nhánh một dashboard? | | |
| G-06 | D03 | P0 | Một ca nhiều thu ngân — doanh thu gộp hay theo người? | | |
| G-07 | D03 | P1 | Kết ca — form kiểm đếm tiền mặt? | | |
| G-08 | D03 | P1 | Ca đóng — force logout nhân viên còn login? | | |
| G-09 | D04 | P0 | CRUD menu đầy đủ hay chỉ thêm + ẩn món? | | |
| G-10 | D04 | P1 | Sửa giá — áp dụng ngay hay từ ngày mai? | | |
| G-11 | D04 | P2 | Upload ảnh món trên mobile? | | |
| G-12 | D04 | P2 | Quản lý modifier template trên app? | | |
| G-13 | D05 | P1 | Status đang làm/nghỉ — từ login hay Manager set? | | |
| G-14 | D05 | P1 | Thêm NV mới trên app — MVP hay seed/backend? | | |
| G-15 | D05 | P0 | Flow BRANCH_ASSIGNMENT — đã pilot thật chưa? | | |
| G-16 | D05 | P1 | OWNER duyệt gán CN — push notify? | | |
| G-17 | D06 | P2 | Lịch ca tuần trên profile — nguồn data? | | |
| G-18 | E01 | P1 | Thêm/xóa bàn trên app — MVP hay seed cố định? | | |
| G-19 | E01 | P1 | MAINTENANCE khi bàn OCCUPIED — chặn hay cảnh báo? | | |
| G-20 | — | P0 | MANAGER xem báo cáo tất cả CN hay chỉ CN được gán? | | |
| G-21 | — | P1 | Chức năng Manager nào hoãn sau pilot 2 tuần? | | |

---

## Phần H — Sprint 6: Polish, Thông báo, UAT (US-E02, E03)

| ID | Story | Ưu tiên | Câu hỏi | Trả lời | Ghi chú |
| -- | ----- | ------- | ------- | ------- | ------- |
| H-01 | E02 | P0 | Loại notification MVP: ORDER_READY / ORDER_NEW / LOW_STOCK? | | |
| H-02 | E02 | P1 | Feed giữ bao lâu? Mark read + badge count? | | |
| H-03 | E02 | P1 | Push khi app đóng — cần Expo production credentials? | | |
| H-04 | E03 | P1 | Đổi MK: cần MK cũ + rule độ mạnh? | | |
| H-05 | E03 | P2 | Màn "Thông tin quán" hiển thị gì? | | |
| H-06 | E03 | P2 | Cài đặt âm thanh/rung per role? | | |
| H-07 | E03 | P2 | Hiển thị version app + check update? | | |
| H-08 | — | P0 | Ngày bắt đầu pilot? Chạy song song giấy bao lâu? | | |
| H-09 | — | P0 | Ai chấm UAT? Bao nhiêu kịch bản tối thiểu? | | |
| H-10 | — | P1 | Bug critical giờ cao điểm — SLA hotfix? | | |
| H-11 | — | P1 | Tiêu chí go/no-go mở rộng chi nhánh 2? | | |
| H-12 | — | P1 | NFR p95 <500ms — test WiFi quán hay cả 4G? | | |
| H-13 | — | P1 | Ai review copy lỗi tiếng Việt cuối? | | |

---

## Phần I — Hạ tầng & Kỹ thuật

| ID | Ưu tiên | Câu hỏi | Trả lời | Ghi chú |
| -- | ------- | ------- | ------- | ------- |
| I-01 | P0 | API pilot/staging deploy ở đâu? Domain + SSL? | | |
| I-02 | P0 | `EXPO_PUBLIC_API_URL` production trỏ đâu? | | |
| I-03 | P1 | Seed demo đủ UAT hay cần import menu thật? | | |
| I-04 | P2 | Generate `openapi.yaml` — ưu tiên sprint nào? | | |
| I-05 | P1 | Design PNG/Figma — dev bám file nào? (repo vs local) | | |
| I-06 | P1 | Ngôn ngữ app: 100% tiếng Việt MVP? | | |
| I-07 | P2 | Cỡ chữ lớn cho thu ngân cao tuổi? | | |
| I-08 | P2 | Dark mode MVP? | | |
| I-09 | P2 | Apple Developer / Google Play internal test — sprint target? | | |

---

## Phần J — Mâu thuẫn tài liệu cần chốt (GAP)

| ID | Mâu thuẫn / gap | Quyết định chốt | Doc cần cập nhật |
| -- | --------------- | --------------- | ---------------- |
| GAP-01 | SPRINT_PLAN: Sprint 1 Done vs DOR: IN PROGRESS | | `DOR_CHECKLIST.md`, `SPRINT_PLAN.md` |
| GAP-02 | US-A02 chọn CN vs BRANCH_ASSIGNMENT: staff không chọn CN | | `USER_STORIES.md`, `PRD.md` |
| GAP-03 | PRD VAT 8% configurable — bật pilot? | | `PRD.md` |
| GAP-04 | PRD out of scope: split bill / gộp bàn | | `PRD.md` |
| GAP-05 | Migration `order_status_serving` — SERVING còn dùng? | | `ERD.md`, Prisma schema |
| GAP-06 | API: shift OPEN bắt buộc khi tạo order — bật sprint nào? | | `API_CONTRACT.md`, `SPRINT_PLAN.md` |
| GAP-07 | OpenAPI chưa generate | | `DOR_CHECKLIST.md` |
| GAP-08 | Design PNG có thể chưa commit repo | | `design/screens/INDEX.md` |
| GAP-09 | MOBILE_ARCHITECTURE: AuthProvider ⏳ vs Sprint 1 Done | | `MOBILE_ARCHITECTURE.md` |
| GAP-10 | DEVICE_POLICY: barista real-time "Sprint 3+" vs plan Sprint 4 | | `DEVICE_POLICY.md`, `SPRINT_PLAN.md` |

---

## Phần K — Tóm tắt quyết định chính (điền sau khi xong)

> Copy các quyết định P0 đã chốt vào đây để team dev đọc nhanh.

### K.1 Pilot

- Chi nhánh / bàn / nhân sự:
- Thiết bị / mạng:
- Deadline:

### K.2 Ca làm & Shift

- Mở/kết ca:
- Shift module: bật / tắt MVP
- Báo cáo theo ca hay ngày:

### K.3 Luồng đơn hàng

- Tại bàn vs mang đi:
- Nhiều đơn/bàn:
- Thanh toán khi nào:
- Sau PAID — bàn EMPTY:

### K.4 Sprint 2 scope chốt

- Menu seed:
- Real-time bàn (polling):
- Demo E2E:

### K.5 Payment MVP

- Phương thức:
- VietQR:
- VAT:

### K.6 Barista real-time

- Transport:
- Multi-barista:
- Push notification:

### K.7 Manager MVP

- Dashboard must-have:
- Hoãn post-pilot:

### K.8 UAT

- Ngày pilot:
- Go/no-go criteria:

---

## Phần L — Checklist sau khi điền xong

- [ ] Tất cả câu **P0** đã có trả lời
- [ ] Phần **J (GAP)** đã chốt và ghi doc cần sửa
- [ ] Phần **K** đã tóm tắt
- [ ] Cập nhật `PRD.md` theo quyết định mới
- [ ] Cập nhật `USER_STORIES.md` (AC / open questions)
- [ ] Cập nhật `SPRINT_PLAN.md` (scope / status)
- [ ] Cập nhật `DOR_CHECKLIST.md` (Sprint 2 DoR)
- [ ] Thông báo team / ghi changelog nội bộ

---

## Tham chiếu sprint & story

| Sprint | Stories | Points | Màn hình |
| ------ | ------- | ------ | -------- |
| 1 | US-A01 → A04 | 10 | 01–04 |
| 2 | US-B01 → B05 | 23 | 05–09 |
| 3 | US-B06 → B11 | 13 | 10–15 |
| 4 | US-C01 → C04 | 19 | 16–19 |
| 5 | US-D01 → D06, E01 | 32 | 20–26 |
| 6 | US-E02, E03 + UAT | 18 | 27–28 |

**Tổng:** 28 stories · 112 points · ~6 sprints
