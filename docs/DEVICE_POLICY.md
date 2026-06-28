# Chính sách thiết bị & đăng nhập (Device Policy)

**Version:** 1.0  
**Áp dụng:** MVP — pre-Sprint 2  
**Liên quan:** [ADR-004](adr/004-auth-rbac.md), [MOBILE_ARCHITECTURE §13](MOBILE_ARCHITECTURE.md)

---

## 1. Mô hình thiết bị

CaffeApp dùng **một codebase** cho mọi thiết bị. Phân luồng bằng **tài khoản đăng nhập** + **vai trò ca làm việc** (`activeRole`), không có app riêng hay `deviceType` trong DB.

| Thiết bị                             | Vai trò vận hành        | Tài khoản                        | Role chọn sau login  |
| ------------------------------------ | ----------------------- | -------------------------------- | -------------------- |
| Tablet / phone **tại quầy**          | Thu ngân POS            | `cashier@...` hoặc `manager@...` | `cashier`            |
| **Điện thoại cá nhân** pha chế       | Barista                 | `barista@...`                    | `barista` (duy nhất) |
| **Điện thoại cá nhân** chủ / quản lý | Quản lý / chủ quán      | `manager@...` / `owner@...`      | `manager`            |
| Quầy khi thiếu người                 | Quản lý hỗ trợ thu ngân | `manager@...`                    | `cashier`            |

---

## 2. Quyết định MVP (đã chốt)

### Thiết bị quầy: **Login cá nhân mỗi ca**

|               |                                                                             |
| ------------- | --------------------------------------------------------------------------- |
| **Chọn**      | Mỗi nhân viên đăng nhập bằng tài khoản riêng khi bắt đầu ca                 |
| **Lý do**     | Audit log đúng người; RBAC API theo JWT `StaffRole`; không chia sẻ mật khẩu |
| **Trade-off** | ~10–15 giây đầu ca; chấp nhận được cho MVP                                  |

### Không dùng trong MVP

| Phương án                        | Lý do loại                                     |
| -------------------------------- | ---------------------------------------------- |
| Tài khoản chung `quay@caffe.app` | Không truy vết được ai thao tác; vi phạm audit |
| Kiosk mode + PIN nhanh           | Post-MVP — cần thiết kế riêng                  |

---

## 3. Quy trình đầu ca / cuối ca

### Đầu ca (quầy)

1. Mở app trên thiết bị quầy
2. Đăng nhập email + mật khẩu **cá nhân**
3. Chọn chi nhánh (nếu có nhiều CN — thường auto với CASHIER/BARISTA)
4. Chọn **Thu ngân**
5. Bắt đầu tạo đơn

### Cuối ca (quầy)

1. Hoàn tất đơn đang mở
2. **Đăng xuất** (Settings → Đăng xuất) — bắt buộc trước khi giao máy cho ca sau

### Barista (điện thoại cá nhân)

1. Login một lần đầu ca
2. Vào thẳng **Hàng đợi bếp** (chỉ card Pha chế)
3. Giữ app mở; nhận cập nhật đơn real-time (Sprint 3+)

---

## 4. Bảo mật

- **API** enforce quyền theo JWT `StaffRole` — không tin `activeRole` trên client
- **Mobile** `activeRole` chỉ điều hướng UI; `RoleGuard` chặn deep link sai stack
- Session timeout: `JWT_EXPIRES_IN` (mặc định 15 phút access token)

---

## 5. Post-MVP (chưa implement)

- Kiosk mode: màn hình quầy cố định + PIN 4 số chọn nhân viên
- Đăng ký thiết bị (`deviceId`) gắn chi nhánh
- Multi-role trên một user (1 người vừa thu ngân vừa pha chế)
