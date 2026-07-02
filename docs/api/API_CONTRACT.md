# CaffeApp — REST API Contract

**Version:** 1.0.0  
**Base URL:** `https://{host}/api/v1`  
**Content-Type:** `application/json`  
**Auth:** `Authorization: Bearer {accessToken}` (trừ endpoint `Public`)

> Tài liệu này là **contract thiết kế** — không phải implementation.  
> DTO names khớp `@caffeapp/shared`. Inventory là domain mới (chưa có trong Prisma).

### Trạng thái implementation (2026-06-28)

| Endpoint             | Status         | Ghi chú                                                                      |
| -------------------- | -------------- | ---------------------------------------------------------------------------- |
| `GET /health`        | ✅ Implemented | Response **không** bọc `{ data }` — trả raw `{ status, service, timestamp }` |
| Tất cả endpoint khác | 📋 Design only | Module shells tại `apps/api/src/modules/`                                    |

OpenAPI machine-readable: **chưa generate**.

---

## 1. Quy ước chung

### 1.1 Response envelope

**Thành công (single resource):**

```json
{
  "data": {}
}
```

**Thành công (danh sách có phân trang):**

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

**Lỗi (`ApiErrorDto`):**

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "details": [{ "field": "email", "message": "must be an email" }]
}
```

### 1.2 Query params chuẩn (list endpoints)

| Param    | Type          | Default          | Mô tả                        |
| -------- | ------------- | ---------------- | ---------------------------- |
| `page`   | integer ≥ 1   | 1                | Trang hiện tại               |
| `limit`  | integer 1–100 | 20               | Số bản ghi/trang             |
| `sort`   | string        | `createdAt:desc` | `field:asc\|desc`            |
| `search` | string        | —                | Tìm theo tên/mã (nếu hỗ trợ) |

### 1.3 Tiền tệ

- Tất cả số tiền: **integer VND** (không decimal), ví dụ `45000` = 45.000₫
- Khớp Prisma `Int` fields: `price`, `subtotal`, `total`, `amount`

### 1.4 Timestamp

- ISO 8601 UTC: `"2026-06-27T10:30:00.000Z"`

### 1.5 Authorization roles

| Ký hiệu    | Roles được phép           |
| ---------- | ------------------------- |
| `Public`   | Không cần token           |
| `Auth`     | Bất kỳ staff đã đăng nhập |
| `CASHIER+` | CASHIER, MANAGER, OWNER   |
| `BARISTA+` | BARISTA, MANAGER, OWNER   |
| `MANAGER+` | MANAGER, OWNER            |
| `OWNER`    | OWNER only                |

### 1.6 Branch isolation

- Mọi request (trừ `Public`) **scope theo `branchId`** từ JWT claim `staff.branchId`
- OWNER có thể truyền `?branchId=` để xem chi nhánh khác
- MANAGER/CASHIER/BARISTA chỉ truy cập chi nhánh được gán

### 1.7 Order status flow

```
PENDING → MAKING → READY → PAID
    ↓         ↓        ↓
 CANCELLED  CANCELLED  CANCELLED (chỉ trước PAID)
```

**Đã giao món:** không dùng status `SERVING`. Set `deliveredAt` trên order khi NV ấn "Đã giao" (B-33, F-12).  
UI tab **Chờ giao** = `READY` + `deliveredAt IS NULL`; **Chờ thanh toán** = `deliveredAt` set + chưa `PAID` (C-14).

### 1.7.1 Shift module (pilot)

- **Pilot / Sprint 1–4:** `shift_id` **optional** — gắn theo `created_at` / ca hệ thống (B-05)
- **Sprint 5+:** bắt buộc shift `OPEN` khi tạo order (GAP-06)

### 1.7.2 Station device — `actedByStaffId`

Tablet trạm dùng tài khoản chung (A-09, B-15). Mỗi mutation quan trọng có thể gửi **`actedByStaffId`** (UUID staff thực hiện):

| Endpoint                    | Field trong body          |
| --------------------------- | ------------------------- |
| `POST /orders`              | `actedByStaffId` optional |
| `PATCH /orders/{id}/status` | `actedByStaffId` optional |
| `POST /orders/{id}/deliver` | `actedByStaffId` optional |
| `POST /orders/{id}/cancel`  | `actedByStaffId` optional |
| `POST /payments`            | `actedByStaffId` optional |

**Rules:**

- **ĐT cá nhân:** không gửi — server dùng `staff.id` từ JWT
- **Tablet trạm:** **bắt buộc** `actedByStaffId` (station account ≠ NV thao tác)
- Staff phải `isActive` và cùng `branchId` với request
- Audit `actor_id` = `actedByStaffId` nếu có, else JWT staff

Xem thêm [API_ERD_REFACTOR_CHECKLIST.md](../API_ERD_REFACTOR_CHECKLIST.md) §3.

### 1.7.3 OrderDto — fields lifecycle

| Field         | Type                  | Mô tả                                                      |
| ------------- | --------------------- | ---------------------------------------------------------- |
| `deliveredAt` | ISO timestamp \| null | Set khi NV ấn "Đã giao"; `null` = chưa giao (tab Chờ giao) |
| `paidAt`      | ISO timestamp \| null | Set khi thanh toán thành công                              |

**List filter** (`GET /orders`): query `deliveryState` = `awaiting_delivery` \| `awaiting_payment` (C-14):

- `awaiting_delivery`: `status=READY` AND `deliveredAt IS NULL`
- `awaiting_payment`: `deliveredAt IS NOT NULL` AND `status != PAID`

## 1.7 Health check

|            |           |
| ---------- | --------- |
| **Method** | `GET`     |
| **URL**    | `/health` |
| **Auth**   | `Public`  |

**Response `200` (implemented — no envelope):**

```json
{
  "status": "ok",
  "service": "caffeapp-api",
  "timestamp": "2026-06-28T03:28:42.000Z"
}
```

---

## 1.8 Branches

### 1.8.1 Danh sách chi nhánh

|            |                                  |
| ---------- | -------------------------------- |
| **Method** | `GET`                            |
| **URL**    | `/branches`                      |
| **DTO**    | `BranchDto[]` (trong `{ data }`) |

**Query params:**

| Param      | Type    | Mô tả                               |
| ---------- | ------- | ----------------------------------- |
| `isActive` | boolean | Lọc chi nhánh active (default true) |

**Authorization:** `Auth` — staff chỉ thấy branch được gán (OWNER: tất cả)

**Response `200`:**

```json
{
  "data": [
    {
      "id": "uuid",
      "name": "CN Quận 1",
      "address": "123 Nguyễn Huệ, Q.1, TP.HCM",
      "phone": "0281234567",
      "bankInfo": {
        "bank": "Vietcombank",
        "bankCode": "VCB",
        "account": "1023456789",
        "holder": "CTY TNHH CA PHE PILOT Q1"
      },
      "isActive": true
    }
  ]
}
```

`bankInfo` dùng cho màn Chuyển khoản/VietQR; `null` nếu chi nhánh chưa cấu hình STK.

**Status:** ✅ Implemented (Sprint 1 — US-A02; VietQR bankInfo added 2026-06-30)

---

## 2. Auth

### 2.1 Đăng nhập

|            |                                        |
| ---------- | -------------------------------------- |
| **Method** | `POST`                                 |
| **URL**    | `/auth/login`                          |
| **DTO**    | `LoginRequestDto` → `LoginResponseDto` |

**Request:**

```json
{
  "email": "cashier@caffe.app",
  "password": "secret123"
}
```

**Response `200`:**

```json
{
  "data": {
    "accessToken": "eyJhbG...",
    "refreshToken": "dGhpcy...",
    "expiresIn": 28800,
    "user": {
      "id": "uuid",
      "email": "cashier@caffe.app",
      "fullName": "Nguyễn Văn A"
    },
    "staff": {
      "id": "uuid",
      "userId": "uuid",
      "branchId": "uuid",
      "role": "CASHIER",
      "fullName": "Nguyễn Văn A",
      "isActive": true
    }
  }
}
```

| Status | Khi nào                  |
| ------ | ------------------------ |
| `200`  | Đăng nhập thành công     |
| `400`  | Body không hợp lệ        |
| `401`  | Email/password sai       |
| `403`  | User/staff bị deactivate |

**Validation:**

| Field      | Rules                  |
| ---------- | ---------------------- |
| `email`    | required, email format |
| `password` | required, min 6 chars  |

**Authorization:** `Public`

**Business rules:**

- Chỉ user `isActive = true` và staff `isActive = true` mới login được
- Một user chỉ có tối đa 1 staff record
- Access token TTL mặc định 8h; refresh token TTL 7 ngày
- Ghi audit log `AUTH_LOGIN`

---

### 2.2 Refresh token

|            |                                                      |
| ---------- | ---------------------------------------------------- |
| **Method** | `POST`                                               |
| **URL**    | `/auth/refresh`                                      |
| **DTO**    | `RefreshTokenRequestDto` → `RefreshTokenResponseDto` |

**Request:**

```json
{
  "refreshToken": "dGhpcy..."
}
```

**Response `200`:**

```json
{
  "data": {
    "accessToken": "eyJhbG...",
    "refreshToken": "bmV3...",
    "expiresIn": 28800
  }
}
```

| Status | Khi nào                            |
| ------ | ---------------------------------- |
| `200`  | Token mới cấp thành công           |
| `401`  | Refresh token hết hạn hoặc revoked |

**Validation:** `refreshToken` required, non-empty string

**Authorization:** `Public`

**Business rules:**

- Rotate refresh token (cấp token mới, revoke token cũ)
- Staff/user deactivate → revoke tất cả refresh tokens

---

### 2.3 Đăng xuất

|            |                             |
| ---------- | --------------------------- |
| **Method** | `POST`                      |
| **URL**    | `/auth/logout`              |
| **DTO**    | `LogoutRequestDto` → `void` |

**Request:**

```json
{
  "refreshToken": "dGhpcy..."
}
```

**Response `204`:** No body

| Status | Khi nào              |
| ------ | -------------------- |
| `204`  | Đăng xuất thành công |
| `401`  | Token không hợp lệ   |

**Authorization:** `Auth`

**Business rules:**

- Revoke refresh token hiện tại
- Access token vẫn valid đến hết TTL (stateless) — client xóa local

---

### 2.4 Thông tin phiên hiện tại

|            |                     |
| ---------- | ------------------- |
| **Method** | `GET`               |
| **URL**    | `/auth/me`          |
| **DTO**    | — → `MeResponseDto` |

**Response `200`:**

```json
{
  "data": {
    "user": { "id": "uuid", "email": "...", "fullName": "..." },
    "staff": {
      "id": "uuid",
      "userId": "uuid",
      "branchId": "uuid",
      "role": "CASHIER",
      "fullName": "...",
      "isActive": true
    },
    "branch": {
      "id": "uuid",
      "name": "Caffe Quận 1",
      "address": "...",
      "phone": "...",
      "isActive": true
    }
  }
}
```

| Status | Khi nào                    |
| ------ | -------------------------- |
| `200`  | OK                         |
| `401`  | Token hết hạn/không hợp lệ |

**Authorization:** `Auth`

**Business rules:**

- Trả về branch từ `staff.branchId`
- Nếu staff chưa gán branch → `branch: null`, chỉ OWNER login được

---

### 2.5 Đổi mật khẩu

|            |                                     |
| ---------- | ----------------------------------- |
| **Method** | `POST`                              |
| **URL**    | `/auth/change-password`             |
| **DTO**    | `ChangePasswordRequestDto` → `void` |

**Request:**

```json
{
  "currentPassword": "old123",
  "newPassword": "new456"
}
```

**Response `204`:** No body

| Status | Khi nào               |
| ------ | --------------------- |
| `204`  | Đổi thành công        |
| `400`  | Validation lỗi        |
| `401`  | Mật khẩu hiện tại sai |

**Validation:**

| Field             | Rules                                         |
| ----------------- | --------------------------------------------- |
| `currentPassword` | required                                      |
| `newPassword`     | required, min 8 chars, khác `currentPassword` |

**Authorization:** `Auth`

**Business rules:**

- Revoke tất cả refresh tokens sau đổi mật khẩu
- Ghi audit `AUTH_PASSWORD_CHANGE`

---

## 3. Users

> Quản lý tài khoản hệ thống (`users` table). Staff profile tách ở module Staff.

### 3.1 Danh sách users

|            |                                                    |
| ---------- | -------------------------------------------------- |
| **Method** | `GET`                                              |
| **URL**    | `/users`                                           |
| **DTO**    | `ListUsersQueryDto` → `PaginatedResponse<UserDto>` |

**Query:** `page`, `limit`, `search` (email, fullName), `isActive`

**Response `200`:**

```json
{
  "data": [
    {
      "id": "uuid",
      "email": "a@caffe.app",
      "fullName": "...",
      "isActive": true,
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "meta": { "page": 1, "limit": 20, "total": 5, "totalPages": 1 }
}
```

| Status | Khi nào        |
| ------ | -------------- |
| `200`  | OK             |
| `403`  | Không đủ quyền |

**Authorization:** `MANAGER+` (OWNER: all branches; MANAGER: users thuộc branch mình qua staff)

**Business rules:**

- MANAGER chỉ thấy users có staff record cùng `branchId`
- Không trả `passwordHash`

---

### 3.2 Chi tiết user

|            |                     |
| ---------- | ------------------- |
| **Method** | `GET`               |
| **URL**    | `/users/{userId}`   |
| **DTO**    | — → `UserDetailDto` |

**Response `200`:** `UserDto` + `staff: StaffDto | null`

| Status | Khi nào                  |
| ------ | ------------------------ |
| `200`  | OK                       |
| `404`  | User không tồn tại       |
| `403`  | Không thuộc scope branch |

**Authorization:** `MANAGER+`

---

### 3.3 Tạo user

|            |                                    |
| ---------- | ---------------------------------- |
| **Method** | `POST`                             |
| **URL**    | `/users`                           |
| **DTO**    | `CreateUserRequestDto` → `UserDto` |

**Request:**

```json
{
  "email": "new@caffe.app",
  "password": "initPass1",
  "fullName": "Trần B"
}
```

| Status | Khi nào          |
| ------ | ---------------- |
| `201`  | Tạo thành công   |
| `400`  | Validation lỗi   |
| `409`  | Email đã tồn tại |

**Validation:**

| Field      | Rules                   |
| ---------- | ----------------------- |
| `email`    | required, email, unique |
| `password` | required, min 8 chars   |
| `fullName` | required, 2–100 chars   |

**Authorization:** `OWNER` (MANAGER: không tạo user — chỉ OWNER tạo, gán staff sau)

**Business rules:**

- Email unique toàn hệ thống
- Password hash server-side (bcrypt)
- Ghi audit `USER_CREATE`

---

### 3.4 Cập nhật user

|            |                                    |
| ---------- | ---------------------------------- |
| **Method** | `PATCH`                            |
| **URL**    | `/users/{userId}`                  |
| **DTO**    | `UpdateUserRequestDto` → `UserDto` |

**Request (partial):**

```json
{
  "fullName": "Trần B Updated",
  "isActive": false
}
```

| Status | Khi nào   |
| ------ | --------- |
| `200`  | OK        |
| `404`  | Not found |

**Validation:** `fullName` 2–100 chars; `isActive` boolean

**Authorization:** `OWNER`

**Business rules:**

- Deactivate user → deactivate staff liên kết + revoke tokens
- Không đổi email qua endpoint này (endpoint riêng nếu cần)

---

### 3.5 Reset mật khẩu (admin)

|            |                                         |
| ---------- | --------------------------------------- |
| **Method** | `POST`                                  |
| **URL**    | `/users/{userId}/reset-password`        |
| **DTO**    | `AdminResetPasswordRequestDto` → `void` |

**Request:**

```json
{
  "newPassword": "tempPass99"
}
```

| Status | Khi nào   |
| ------ | --------- |
| `204`  | OK        |
| `404`  | Not found |

**Authorization:** `OWNER`

**Business rules:**

- Revoke all refresh tokens của user
- Ghi audit `USER_PASSWORD_RESET`

---

## 4. Staff

### 4.1 Danh sách staff

|            |                                                     |
| ---------- | --------------------------------------------------- |
| **Method** | `GET`                                               |
| **URL**    | `/staff`                                            |
| **DTO**    | `ListStaffQueryDto` → `PaginatedResponse<StaffDto>` |

**Query:** `page`, `limit`, `role`, `isActive`, `branchId` (OWNER only)

**Response `200`:** Paginated `StaffDto` (+ optional `phone`)

| Status | `200`, `403` |

**Authorization:** `MANAGER+`

**Business rules:**

- Default filter `branchId` = JWT branch
- OWNER có thể `?branchId=` hoặc xem all

---

### 4.1.1 Danh sách NV thao tác (tablet picker)

|            |                                     |
| ---------- | ----------------------------------- |
| **Method** | `GET`                               |
| **URL**    | `/staff/branch-operators`           |
| **DTO**    | — → `{ data: BranchOperatorDto[] }` |

**Response `200`:** Active staff `CASHIER` / `BARISTA` / `MANAGER` tại JWT branch (đã APPROVED), **loại trừ** tài khoản trạm (`station@*`).

| Status | `200`, `400` (chưa có branch), `403` |

**Authorization:** `CASHIER+`

**Use case:** Tablet trạm — modal chọn NV trước mutation (B-15).

---

### 4.2 Chi tiết staff

|            |                      |
| ---------- | -------------------- |
| **Method** | `GET`                |
| **URL**    | `/staff/{staffId}`   |
| **DTO**    | — → `StaffDetailDto` |

**Response `200`:** `StaffDto` + `user: UserDto` (không password)

| Status | `200`, `404`, `403` |

**Authorization:** `MANAGER+` hoặc `Auth` (xem chính mình)

---

### 4.3 Tạo staff

|            |                                      |
| ---------- | ------------------------------------ |
| **Method** | `POST`                               |
| **URL**    | `/staff`                             |
| **DTO**    | `CreateStaffRequestDto` → `StaffDto` |

**Request:**

```json
{
  "userId": "uuid",
  "branchId": "uuid",
  "role": "CASHIER",
  "fullName": "Nguyễn Văn A",
  "phone": "0901234567"
}
```

| Status | `201`, `400`, `404` (user not found), `409` (user đã có staff) |

**Validation:**

| Field      | Rules                         |
| ---------- | ----------------------------- |
| `userId`   | required, UUID, user tồn tại  |
| `branchId` | required, UUID, branch active |
| `role`     | required, enum `StaffRole`    |
| `fullName` | required, 2–100 chars         |
| `phone`    | optional, VN phone format     |

**Authorization:** `MANAGER+` (MANAGER không tạo OWNER)

**Business rules:**

- 1 user ↔ 1 staff (unique `userId`)
- MANAGER không gán role `OWNER`
- Ghi audit `STAFF_CREATE`

---

### 4.4 Cập nhật staff

|            |                                      |
| ---------- | ------------------------------------ |
| **Method** | `PATCH`                              |
| **URL**    | `/staff/{staffId}`                   |
| **DTO**    | `UpdateStaffRequestDto` → `StaffDto` |

**Request (partial):**

```json
{
  "role": "BARISTA",
  "phone": "0909999888",
  "isActive": true
}
```

| Status | `200`, `404`, `403` |

**Authorization:** `MANAGER+`

**Business rules:**

- Không đổi `userId`
- Đổi `branchId` chỉ OWNER
- Deactivate → revoke tokens của user đó

---

### 4.5 Xóa staff (soft)

|            |                    |
| ---------- | ------------------ |
| **Method** | `DELETE`           |
| **URL**    | `/staff/{staffId}` |
| **DTO**    | — → `void`         |

| Status | `204`, `404`, `403` |

**Authorization:** `OWNER`

**Business rules:**

- Soft delete: `isActive = false` (không xóa hard nếu có orders liên quan)
- Ghi audit `STAFF_DEACTIVATE`

---

## 5. Categories

### 5.1 Danh sách categories

|            |                                                                    |
| ---------- | ------------------------------------------------------------------ |
| **Method** | `GET`                                                              |
| **URL**    | `/categories`                                                      |
| **DTO**    | `ListCategoriesQueryDto` → `PaginatedResponse<ProductCategoryDto>` |

**Query:** `page`, `limit`, `isActive`, `search`

**Response `200`:**

```json
{
  "data": [
    {
      "id": "uuid",
      "branchId": "uuid",
      "name": "Cà phê",
      "slug": "ca-phe",
      "sortOrder": 1,
      "isActive": true
    }
  ],
  "meta": { "page": 1, "limit": 20, "total": 8, "totalPages": 1 }
}
```

| Status | `200` |

**Authorization:** `Auth` (CASHIER+ cần xem menu; BARISTA+ cần xem queue context)

**Business rules:**

- Scope `branchId` từ JWT
- Sort mặc định `sortOrder:asc`, `name:asc`

---

### 5.2 Chi tiết category

|            |                            |
| ---------- | -------------------------- |
| **Method** | `GET`                      |
| **URL**    | `/categories/{categoryId}` |
| **DTO**    | — → `ProductCategoryDto`   |

| Status | `200`, `404` |

**Authorization:** `Auth`

---

### 5.3 Tạo category

|            |                                                   |
| ---------- | ------------------------------------------------- |
| **Method** | `POST`                                            |
| **URL**    | `/categories`                                     |
| **DTO**    | `CreateCategoryRequestDto` → `ProductCategoryDto` |

**Request:**

```json
{
  "name": "Trà sữa",
  "slug": "tra-sua",
  "sortOrder": 2
}
```

| Status | `201`, `400`, `409` (slug trùng trong branch) |

**Validation:**

| Field       | Rules                                   |
| ----------- | --------------------------------------- |
| `name`      | required, 1–80 chars                    |
| `slug`      | required, kebab-case, unique per branch |
| `sortOrder` | optional, integer ≥ 0                   |

**Authorization:** `MANAGER+`

**Business rules:**

- `branchId` lấy từ JWT
- Slug auto-generate từ name nếu client không gửi
- Ghi audit `CATEGORY_CREATE`

---

### 5.4 Cập nhật category

|            |                                                   |
| ---------- | ------------------------------------------------- |
| **Method** | `PATCH`                                           |
| **URL**    | `/categories/{categoryId}`                        |
| **DTO**    | `UpdateCategoryRequestDto` → `ProductCategoryDto` |

| Status | `200`, `404`, `409` |

**Authorization:** `MANAGER+`

**Business rules:**

- Deactivate category → không xóa products; products vẫn hiển thị nhưng category ẩn trên menu mới

---

### 5.5 Xóa category

|            |                            |
| ---------- | -------------------------- |
| **Method** | `DELETE`                   |
| **URL**    | `/categories/{categoryId}` |
| **DTO**    | — → `void`                 |

| Status | `204`, `404`, `409` |

**Authorization:** `MANAGER+`

**Business rules:**

- Không xóa nếu còn products active → `409 Conflict`
- Soft delete preferred: `isActive = false`

---

## 6. Products

### 6.1 Danh sách products

|            |                                                          |
| ---------- | -------------------------------------------------------- |
| **Method** | `GET`                                                    |
| **URL**    | `/products`                                              |
| **DTO**    | `ListProductsQueryDto` → `PaginatedResponse<ProductDto>` |

**Query:** `page`, `limit`, `categoryId`, `isAvailable`, `search`

**Response `200`:** Paginated `ProductDto`

| Status | `200` |

**Authorization:** `Auth`

**Business rules:**

- CASHIER/BARISTA: chỉ products `isAvailable = true` (trừ MANAGER+ có `?includeUnavailable=true`)

---

### 6.2 Chi tiết product

|            |                         |
| ---------- | ----------------------- |
| **Method** | `GET`                   |
| **URL**    | `/products/{productId}` |
| **DTO**    | — → `ProductDto`        |

| Status | `200`, `404` |

**Authorization:** `Auth`

---

### 6.3 Tạo product

|            |                                          |
| ---------- | ---------------------------------------- |
| **Method** | `POST`                                   |
| **URL**    | `/products`                              |
| **DTO**    | `CreateProductRequestDto` → `ProductDto` |

**Request:**

```json
{
  "categoryId": "uuid",
  "name": "Cà phê sữa đá",
  "description": "Size M",
  "price": 35000,
  "imageUrl": "https://cdn.../caphe.jpg",
  "isAvailable": true
}
```

| Status | `201`, `400`, `404` (category) |

**Validation:**

| Field         | Rules                       |
| ------------- | --------------------------- |
| `categoryId`  | required, UUID, cùng branch |
| `name`        | required, 1–120 chars       |
| `description` | optional, max 500 chars     |
| `price`       | required, integer > 0       |
| `imageUrl`    | optional, URL               |
| `isAvailable` | optional, default true      |

**Authorization:** `MANAGER+`

**Business rules:**

- Category phải thuộc cùng branch
- Ghi audit `PRODUCT_CREATE`

---

### 6.4 Cập nhật product

|            |                                          |
| ---------- | ---------------------------------------- |
| **Method** | `PATCH`                                  |
| **URL**    | `/products/{productId}`                  |
| **DTO**    | `UpdateProductRequestDto` → `ProductDto` |

| Status | `200`, `404`, `400` |

**Authorization:** `MANAGER+`

**Business rules:**

- Đổi giá không ảnh hưởng order items đã tạo (snapshot `unitPrice` trên order_item)
- `isAvailable = false` → không thêm vào order mới

---

### 6.5 Xóa product

|            |                         |
| ---------- | ----------------------- |
| **Method** | `DELETE`                |
| **URL**    | `/products/{productId}` |
| **DTO**    | — → `void`              |

| Status | `204`, `404`, `409` |

**Authorization:** `MANAGER+`

**Business rules:**

- Không hard delete nếu có `order_items` → soft: `isAvailable = false`

---

## 7. Tables

### 7.1 Danh sách bàn

|            |                                                      |
| ---------- | ---------------------------------------------------- |
| **Method** | `GET`                                                |
| **URL**    | `/tables`                                            |
| **DTO**    | `ListTablesQueryDto` → `PaginatedResponse<TableDto>` |

**Query:** `page`, `limit`, `status`, `floor`, `search` (code)

| Status | `200` |

**Authorization:** `CASHIER+`

**Business rules:**

- Realtime status qua polling/SSE (Sprint 2+); contract REST chỉ snapshot

---

### 7.2 Chi tiết bàn

|            |                      |
| ---------- | -------------------- |
| **Method** | `GET`                |
| **URL**    | `/tables/{tableId}`  |
| **DTO**    | — → `TableDetailDto` |

**Response `200`:** `TableDto` + `activeOrder: OrderDto | null` (order PENDING/MAKING/READY chưa PAID)

| Status | `200`, `404` |

**Authorization:** `CASHIER+`

---

### 7.3 Tạo bàn

|            |                                      |
| ---------- | ------------------------------------ |
| **Method** | `POST`                               |
| **URL**    | `/tables`                            |
| **DTO**    | `CreateTableRequestDto` → `TableDto` |

**Request:**

```json
{
  "code": "B01",
  "floor": "Tầng 1",
  "capacity": 4
}
```

| Status | `201`, `400`, `409` (code trùng branch) |

**Validation:**

| Field      | Rules                                   |
| ---------- | --------------------------------------- |
| `code`     | required, 1–20 chars, unique per branch |
| `floor`    | optional, max 50 chars                  |
| `capacity` | optional, integer 1–20, default 4       |

**Authorization:** `MANAGER+`

**Business rules:**

- Default `status = EMPTY`
- Ghi audit `TABLE_CREATE`

---

### 7.4 Cập nhật bàn

|            |                                      |
| ---------- | ------------------------------------ |
| **Method** | `PATCH`                              |
| **URL**    | `/tables/{tableId}`                  |
| **DTO**    | `UpdateTableRequestDto` → `TableDto` |

| Status | `200`, `404` |

**Authorization:** `MANAGER+`

---

### 7.5 Cập nhật trạng thái bàn

|            |                                            |
| ---------- | ------------------------------------------ |
| **Method** | `PATCH`                                    |
| **URL**    | `/tables/{tableId}/status`                 |
| **DTO**    | `UpdateTableStatusRequestDto` → `TableDto` |

**Request:**

```json
{
  "status": "OCCUPIED"
}
```

| Status | `200`, `400`, `404`, `409` |

**Validation:** `status` required, enum `TableStatus`

**Authorization:** `CASHIER+`

**Business rules:**

- `EMPTY → OCCUPIED`: thường tự động khi tạo DINE_IN order; manual override cho MANAGER+
- `OCCUPIED → EMPTY`: chỉ khi không còn order active trên bàn
- `MAINTENANCE`: không gán order mới

---

### 7.6 Xóa bàn

|            |                     |
| ---------- | ------------------- |
| **Method** | `DELETE`            |
| **URL**    | `/tables/{tableId}` |
| **DTO**    | — → `void`          |

| Status | `204`, `404`, `409` |

**Authorization:** `MANAGER+`

**Business rules:**

- Không xóa bàn đang OCCUPIED hoặc có lịch sử orders → `409`

---

## 8. Orders

### 8.1 Danh sách orders

|            |                                                      |
| ---------- | ---------------------------------------------------- |
| **Method** | `GET`                                                |
| **URL**    | `/orders`                                            |
| **DTO**    | `ListOrdersQueryDto` → `PaginatedResponse<OrderDto>` |

**Query:** `page`, `limit`, `status`, `orderType`, `tableId`, `from`, `to` (ISO date)

| Status | `200` |

**Authorization:**

- `CASHIER+`: all orders branch
- `BARISTA+`: filter `status` ∈ {PENDING, MAKING, READY} (barista queue)

**Business rules:**

- Default sort `createdAt:desc`
- BARISTA default `status=PENDING,MAKING`

---

### 8.2 Chi tiết order

|            |                     |
| ---------- | ------------------- |
| **Method** | `GET`               |
| **URL**    | `/orders/{orderId}` |
| **DTO**    | — → `OrderDto`      |

**Response `200`:** `OrderDto` (includes `items[]`)

| Status | `200`, `404` |

**Authorization:** `Auth` (scope branch)

---

### 8.3 Tạo order

|            |                               |
| ---------- | ----------------------------- |
| **Method** | `POST`                        |
| **URL**    | `/orders`                     |
| **DTO**    | `CreateOrderDto` → `OrderDto` |

**Request:**

```json
{
  "orderType": "DINE_IN",
  "tableId": "uuid",
  "notes": "Ít đường",
  "actedByStaffId": "uuid",
  "items": [{ "productId": "uuid", "quantity": 2, "notes": "Không đá" }]
}
```

| Status | `201`, `400`, `404`, `409` |

**Validation:**

| Field               | Rules                                            |
| ------------------- | ------------------------------------------------ |
| `orderType`         | required, enum `OrderType`                       |
| `tableId`           | required if `DINE_IN`, forbidden if `TAKE_AWAY`  |
| `items`             | required, min 1 item                             |
| `items[].productId` | required, UUID, available                        |
| `items[].quantity`  | required, integer 1–99                           |
| `items[].notes`     | optional, max 200 chars                          |
| `actedByStaffId`    | optional UUID; **required** tablet trạm (§1.7.2) |

**Authorization:** `CASHIER+`

**Business rules:**

- `branchId` từ JWT; `orderNumber` auto: `{branchCode}-{YYYYMMDD}-{seq}`
- Snapshot `productName`, `unitPrice` từ product tại thời điểm tạo
- Tính `lineTotal = quantity * unitPrice`, `subtotal = sum(lineTotal)`
- **VAT:** giá sản phẩm **đã gồm 8%**; `taxAmount` = phần VAT tách từ `total` để hiển thị bill (D-17); `total = subtotal` (không cộng thêm VAT)
- DINE_IN + `tableId` → set table `OCCUPIED`
- **Pilot:** `shift_id` optional (B-05). **Sprint 5+:** phải có shift `OPEN` khi shift enabled
- Status ban đầu: `PENDING`
- Ghi audit `ORDER_CREATE`

---

### 8.4 Thêm/sửa items (order chưa PAID)

|            |                                            |
| ---------- | ------------------------------------------ |
| **Method** | `PUT`                                      |
| **URL**    | `/orders/{orderId}/items`                  |
| **DTO**    | `ReplaceOrderItemsRequestDto` → `OrderDto` |

**Request:**

```json
{
  "items": [{ "productId": "uuid", "quantity": 1, "notes": null }]
}
```

| Status | `200`, `400`, `404`, `409` |

**Authorization:** `CASHIER+`

**Business rules:**

- Chỉ khi `status` ∈ {PENDING, MAKING}
- Replace toàn bộ items (idempotent theo productId+notes merge logic)
- Recalculate totals

---

### 8.5 Cập nhật trạng thái order

|            |                                     |
| ---------- | ----------------------------------- |
| **Method** | `PATCH`                             |
| **URL**    | `/orders/{orderId}/status`          |
| **DTO**    | `UpdateOrderStatusDto` → `OrderDto` |

**Request:**

```json
{
  "status": "MAKING",
  "actedByStaffId": "uuid"
}
```

| Status | `200`, `400`, `404`, `409` |

**Validation:** `status` required, enum `OrderStatus`

**Authorization:**

| Transition        | Roles                                                     |
| ----------------- | --------------------------------------------------------- |
| PENDING → MAKING  | BARISTA+, CASHIER+                                        |
| MAKING → READY    | BARISTA+                                                  |
| READY → delivered | CASHIER+ — `POST /orders/{id}/deliver` sets `deliveredAt` |
| READY → PAID      | CASHIER+ (Payment; mặc định sau `deliveredAt`, E-01)      |
| * → CANCELLED     | CASHIER+, MANAGER+                                        |

**Business rules:**

- Validate state machine (§1.7)
- `deliveredAt`: khi NV ấn "Đã giao" (B-33, C-14)
- CANCELLED: chỉ khi chưa PAID; bắt buộc `reason`; release table nếu DINE_IN
- PAID chỉ qua endpoint Payment (không set trực tiếp trừ MANAGER+ override)
- Ghi audit `ORDER_STATUS_CHANGE`

---

### 8.6 Đánh dấu đã giao món

|            |                                       |
| ---------- | ------------------------------------- |
| **Method** | `POST`                                |
| **URL**    | `/orders/{orderId}/deliver`           |
| **DTO**    | `DeliverOrderRequestDto` → `OrderDto` |

**Request:**

```json
{
  "actedByStaffId": "uuid"
}
```

| Status | `200`, `400`, `404`, `409` |

**Validation:**

| Field            | Rules                                            |
| ---------------- | ------------------------------------------------ |
| `actedByStaffId` | optional UUID; **required** tablet trạm (§1.7.2) |

**Authorization:** `CASHIER+`

**Business rules:**

- Order phải `status = READY`
- `deliveredAt` phải `null` (idempotent: đã giao → `409` hoặc `200` no-op — implement chọn một)
- **Không** đổi `status` — vẫn `READY` cho đến khi thanh toán
- Set `deliveredAt = now()`
- Ghi audit `ORDER_DELIVERED` với `actor_id` = NV được chọn

---

### 8.7 Hủy order

|            |                                      |
| ---------- | ------------------------------------ |
| **Method** | `POST`                               |
| **URL**    | `/orders/{orderId}/cancel`           |
| **DTO**    | `CancelOrderRequestDto` → `OrderDto` |

**Request:**

```json
{
  "reason": "Khách hủy",
  "actedByStaffId": "uuid"
}
```

| Status | `200`, `404`, `409` |

**Authorization:** `CASHIER+` (MANAGER+ nếu đã READY)

**Business rules:**

- `reason` required, 3–200 chars
- Không hủy order `PAID`
- Release table

---

## 9. Payments

### 9.1 Danh sách payments

|            |                                                          |
| ---------- | -------------------------------------------------------- |
| **Method** | `GET`                                                    |
| **URL**    | `/payments`                                              |
| **DTO**    | `ListPaymentsQueryDto` → `PaginatedResponse<PaymentDto>` |

**Query:** `page`, `limit`, `orderId`, `method`, `from`, `to`

| Status | `200` |

**Authorization:** `MANAGER+`

---

### 9.2 Chi tiết payment

|            |                         |
| ---------- | ----------------------- |
| **Method** | `GET`                   |
| **URL**    | `/payments/{paymentId}` |
| **DTO**    | — → `PaymentDto`        |

| Status | `200`, `404` |

**Authorization:** `CASHIER+` (own shift) / `MANAGER+` (all)

---

### 9.3 Thanh toán order

|            |                                   |
| ---------- | --------------------------------- |
| **Method** | `POST`                            |
| **URL**    | `/payments`                       |
| **DTO**    | `CreatePaymentDto` → `PaymentDto` |

**Request:**

```json
{
  "orderId": "uuid",
  "method": "CASH",
  "amount": 100000,
  "changeAmount": 5000,
  "reference": null,
  "actedByStaffId": "uuid"
}
```

| Status | `201`, `400`, `404`, `409` |

**Validation:**

| Field          | Rules                                                    |
| -------------- | -------------------------------------------------------- |
| `orderId`      | required, UUID                                           |
| `method`       | required, pilot chỉ nhận `CASH` hoặc `BANK_TRANSFER`     |
| `amount`       | required, integer > 0                                    |
| `changeAmount` | optional, ≥ 0; required logic nếu CASH và amount > total |
| `reference`    | optional, max 100 chars                                  |

**Authorization:** `CASHIER+`

**Business rules:**

- Order phải `status = READY` và (`deliveredAt` set **hoặc** `allowEarlyPayment` / mang đi trả trước — E-01)
- `amount` ≥ `order.total` (thiếu → `400`)
- Pilot: API từ chối `CARD` / `E_WALLET`; thẻ/ví để sau pilot
- CASH: `changeAmount = amount - total` (server validate)
- Non-CASH: `changeAmount` phải null/0
- Sau payment thành công: order → `PAID`, set `paidAt`, table → `EMPTY` nếu DINE_IN
- Cập nhật `shift.totalRevenue`, `shift.totalOrders`
- Một order chỉ PAID một lần (partial payment: Sprint 2+)
- Ghi audit `PAYMENT_CREATE`

---

### 9.4 Hoàn tiền (void payment)

|            |                                        |
| ---------- | -------------------------------------- |
| **Method** | `POST`                                 |
| **URL**    | `/payments/{paymentId}/void`           |
| **DTO**    | `VoidPaymentRequestDto` → `PaymentDto` |

**Request:**

```json
{
  "reason": "Thu nhầm"
}
```

| Status | `200`, `404`, `409` |

**Authorization:** `MANAGER+`

**Business rules:**

- Chỉ trong 24h kể từ `paidAt` (configurable)
- Order revert → `READY` hoặc `CANCELLED` tùy policy
- Ghi audit `PAYMENT_VOID`

---

## 10. Reports

> Read-only aggregates. Không mutate data.

### 10.1 Tổng quan doanh thu

|            |                                              |
| ---------- | -------------------------------------------- |
| **Method** | `GET`                                        |
| **URL**    | `/reports/revenue`                           |
| **DTO**    | `RevenueReportQueryDto` → `RevenueReportDto` |

**Query:** `from`, `to` (required, ISO date), `groupBy` (`day`|`week`|`month`)

**Response `200`:**

```json
{
  "data": {
    "summary": {
      "totalRevenue": 15000000,
      "totalOrders": 320,
      "averageOrderValue": 46875,
      "cancelledOrders": 12
    },
    "series": [{ "period": "2026-06-27", "revenue": 2500000, "orders": 45 }]
  }
}
```

| Status | `200`, `400` |

**Validation:** `from` ≤ `to`, range max 366 days

**Authorization:** `MANAGER+`

**Business rules:**

- Chỉ tính orders `PAID`
- Scope branch từ JWT

---

### 10.2 Top sản phẩm

|            |                                                      |
| ---------- | ---------------------------------------------------- |
| **Method** | `GET`                                                |
| **URL**    | `/reports/top-products`                              |
| **DTO**    | `TopProductsReportQueryDto` → `TopProductsReportDto` |

**Query:** `from`, `to`, `limit` (default 10)

**Response `200`:**

```json
{
  "data": [
    { "productId": "uuid", "productName": "Cà phê sữa đá", "quantitySold": 150, "revenue": 5250000 }
  ]
}
```

| Status | `200`, `400` |

**Authorization:** `MANAGER+`

---

### 10.3 Báo cáo theo ca (shift)

|            |                                                             |
| ---------- | ----------------------------------------------------------- |
| **Method** | `GET`                                                       |
| **URL**    | `/reports/shifts`                                           |
| **DTO**    | `ShiftReportQueryDto` → `PaginatedResponse<ShiftReportDto>` |

**Query:** `from`, `to`, `status`, `page`, `limit`

**Response `200`:**

```json
{
  "data": [
    {
      "shiftId": "uuid",
      "name": "Ca sáng",
      "status": "CLOSED",
      "openedAt": "...",
      "closedAt": "...",
      "totalRevenue": 5000000,
      "totalOrders": 80,
      "paymentBreakdown": {
        "CASH": 3000000,
        "BANK_TRANSFER": 2000000
      }
    }
  ],
  "meta": { "page": 1, "limit": 20, "total": 3, "totalPages": 1 }
}
```

| Status | `200` |

**Authorization:** `MANAGER+`

---

### 10.4 Báo cáo orders theo trạng thái

|            |                                                            |
| ---------- | ---------------------------------------------------------- |
| **Method** | `GET`                                                      |
| **URL**    | `/reports/orders-by-status`                                |
| **DTO**    | `OrdersByStatusReportQueryDto` → `OrdersByStatusReportDto` |

**Query:** `from`, `to`

**Response `200`:**

```json
{
  "data": {
    "PENDING": 5,
    "MAKING": 3,
    "READY": 2,
    "PAID": 310,
    "CANCELLED": 12
  }
}
```

| Status | `200` |

**Authorization:** `MANAGER+`

---

### 10.5 Export CSV (optional Sprint 2+)

|            |                                            |
| ---------- | ------------------------------------------ |
| **Method** | `GET`                                      |
| **URL**    | `/reports/export`                          |
| **DTO**    | `ExportReportQueryDto` → `text/csv` stream |

**Query:** `type` (`revenue`|`orders`|`payments`), `from`, `to`

| Status | `200`, `400` |

**Authorization:** `MANAGER+`

**Business rules:**

- Rate limit: 5 exports/hour/user

---

## 11. Inventory

> Domain thiết kế mới — bổ sung schema sau. Phục vụ quản lý nguyên liệu (cà phê, sữa, đường…).

### Entities (contract)

| Entity              | Mô tả                              |
| ------------------- | ---------------------------------- |
| `InventoryItem`     | Nguyên liệu master (branch-scoped) |
| `InventoryStock`    | Tồn kho hiện tại theo item         |
| `InventoryMovement` | Phiếu nhập/xuất/điều chỉnh         |

### 11.1 Danh sách nguyên liệu

|            |                                                                      |
| ---------- | -------------------------------------------------------------------- |
| **Method** | `GET`                                                                |
| **URL**    | `/inventory/items`                                                   |
| **DTO**    | `ListInventoryItemsQueryDto` → `PaginatedResponse<InventoryItemDto>` |

**Query:** `page`, `limit`, `search`, `isActive`, `lowStock` (boolean)

**Response `200`:**

```json
{
  "data": [
    {
      "id": "uuid",
      "branchId": "uuid",
      "sku": "CF-ARABICA-1KG",
      "name": "Cà phê Arabica",
      "unit": "kg",
      "minStock": 5,
      "currentStock": 12.5,
      "isActive": true
    }
  ],
  "meta": { "page": 1, "limit": 20, "total": 30, "totalPages": 2 }
}
```

| Status | `200` |

**Authorization:** `MANAGER+` (BARISTA+: read-only nếu `?lowStock=true`)

---

### 11.2 Chi tiết nguyên liệu

|            |                              |
| ---------- | ---------------------------- |
| **Method** | `GET`                        |
| **URL**    | `/inventory/items/{itemId}`  |
| **DTO**    | — → `InventoryItemDetailDto` |

**Response `200`:** `InventoryItemDto` + `recentMovements[]`

| Status | `200`, `404` |

**Authorization:** `MANAGER+`

---

### 11.3 Tạo nguyên liệu

|            |                                                      |
| ---------- | ---------------------------------------------------- |
| **Method** | `POST`                                               |
| **URL**    | `/inventory/items`                                   |
| **DTO**    | `CreateInventoryItemRequestDto` → `InventoryItemDto` |

**Request:**

```json
{
  "sku": "MILK-FRESH-1L",
  "name": "Sữa tươi",
  "unit": "liter",
  "minStock": 10,
  "initialStock": 50
}
```

| Status | `201`, `400`, `409` |

**Validation:**

| Field          | Rules                                                     |
| -------------- | --------------------------------------------------------- |
| `sku`          | required, unique per branch, 3–30 chars                   |
| `name`         | required, 1–100 chars                                     |
| `unit`         | required, enum: `kg`, `g`, `liter`, `ml`, `piece`, `pack` |
| `minStock`     | required, number ≥ 0                                      |
| `initialStock` | optional, number ≥ 0                                      |

**Authorization:** `MANAGER+`

**Business rules:**

- Tạo kèm movement `INITIAL` nếu `initialStock > 0`
- Ghi audit `INVENTORY_ITEM_CREATE`

---

### 11.4 Cập nhật nguyên liệu

|            |                                                      |
| ---------- | ---------------------------------------------------- |
| **Method** | `PATCH`                                              |
| **URL**    | `/inventory/items/{itemId}`                          |
| **DTO**    | `UpdateInventoryItemRequestDto` → `InventoryItemDto` |

| Status | `200`, `404` |

**Authorization:** `MANAGER+`

**Business rules:**

- Không sửa `currentStock` trực tiếp — dùng movements

---

### 11.5 Danh sách movements

|            |                                                                              |
| ---------- | ---------------------------------------------------------------------------- |
| **Method** | `GET`                                                                        |
| **URL**    | `/inventory/movements`                                                       |
| **DTO**    | `ListInventoryMovementsQueryDto` → `PaginatedResponse<InventoryMovementDto>` |

**Query:** `page`, `limit`, `itemId`, `type`, `from`, `to`

| Status | `200` |

**Authorization:** `MANAGER+`

---

### 11.6 Nhập kho

|            |                                                            |
| ---------- | ---------------------------------------------------------- |
| **Method** | `POST`                                                     |
| **URL**    | `/inventory/movements/inbound`                             |
| **DTO**    | `CreateInboundMovementRequestDto` → `InventoryMovementDto` |

**Request:**

```json
{
  "itemId": "uuid",
  "quantity": 20,
  "unitCost": 85000,
  "note": "Nhập từ NCC ABC",
  "reference": "PO-2026-001"
}
```

| Status | `201`, `400`, `404` |

**Validation:**

| Field       | Rules                                |
| ----------- | ------------------------------------ |
| `itemId`    | required, UUID                       |
| `quantity`  | required, number > 0                 |
| `unitCost`  | optional, integer ≥ 0 (VND per unit) |
| `note`      | optional, max 300 chars              |
| `reference` | optional, max 50 chars               |

**Authorization:** `MANAGER+`

**Business rules:**

- `type = INBOUND`; tăng `currentStock`
- Ghi audit `INVENTORY_INBOUND`

---

### 11.7 Xuất kho

|            |                                                             |
| ---------- | ----------------------------------------------------------- |
| **Method** | `POST`                                                      |
| **URL**    | `/inventory/movements/outbound`                             |
| **DTO**    | `CreateOutboundMovementRequestDto` → `InventoryMovementDto` |

**Request:**

```json
{
  "itemId": "uuid",
  "quantity": 2.5,
  "reason": "Pha chế ca sáng",
  "reference": null
}
```

| Status | `201`, `400`, `404`, `409` |

**Validation:** `quantity` > 0; `reason` required 3–200 chars

**Authorization:** `MANAGER+` (BARISTA+: nếu policy cho phép xuất tiêu hao)

**Business rules:**

- `type = OUTBOUND`; giảm stock
- Không cho `currentStock - quantity < 0` → `409 Insufficient stock`
- Ghi audit `INVENTORY_OUTBOUND`

---

### 11.8 Điều chỉnh tồn (kiểm kê)

|            |                                                               |
| ---------- | ------------------------------------------------------------- |
| **Method** | `POST`                                                        |
| **URL**    | `/inventory/movements/adjustment`                             |
| **DTO**    | `CreateAdjustmentMovementRequestDto` → `InventoryMovementDto` |

**Request:**

```json
{
  "itemId": "uuid",
  "actualStock": 10,
  "note": "Kiểm kê cuối tháng"
}
```

| Status | `201`, `400`, `404` |

**Authorization:** `MANAGER+`

**Business rules:**

- `type = ADJUSTMENT`; `quantity = actualStock - currentStock` (có thể âm/dương)
- `note` required
- Ghi audit `INVENTORY_ADJUSTMENT`

---

### 11.9 Cảnh báo tồn thấp

|            |                               |
| ---------- | ----------------------------- |
| **Method** | `GET`                         |
| **URL**    | `/inventory/alerts/low-stock` |
| **DTO**    | — → `LowStockAlertDto[]`      |

**Response `200`:**

```json
{
  "data": [
    {
      "itemId": "uuid",
      "sku": "CF-ARABICA-1KG",
      "name": "Cà phê Arabica",
      "currentStock": 3,
      "minStock": 5,
      "deficit": 2
    }
  ]
}
```

| Status | `200` |

**Authorization:** `MANAGER+`

**Business rules:**

- `currentStock < minStock`
- Dùng cho dashboard manager

---

## 12. DTO Index (shared package)

Các DTO cần bổ sung vào `@caffeapp/shared`:

| DTO                                                                            | Module                |
| ------------------------------------------------------------------------------ | --------------------- |
| `LoginRequestDto`, `LoginResponseDto`                                          | Auth ✅               |
| `RefreshTokenRequestDto`, `RefreshTokenResponseDto`                            | Auth                  |
| `ChangePasswordRequestDto`                                                     | Auth                  |
| `MeResponseDto`                                                                | Auth                  |
| `CreateUserRequestDto`, `UpdateUserRequestDto`, `UserDetailDto`                | Users                 |
| `CreateStaffRequestDto`, `UpdateStaffRequestDto`, `StaffDetailDto`             | Staff                 |
| `ProductCategoryDto`, `CreateCategoryRequestDto`                               | Categories ✅ partial |
| `ProductDto`, `CreateProductRequestDto`                                        | Products ✅ partial   |
| `TableDto`, `CreateTableRequestDto`, `UpdateTableStatusRequestDto`             | Tables ✅ partial     |
| `OrderDto`, `CreateOrderDto`, `UpdateOrderStatusDto`, `DeliverOrderRequestDto` | Orders ✅             |
| `PaymentDto`, `CreatePaymentDto`                                               | Payments ✅           |
| `RevenueReportDto`, `TopProductsReportDto`, `ShiftReportDto`                   | Reports               |
| `InventoryItemDto`, `InventoryMovementDto`, movement requests                  | Inventory             |

---

## 13. HTTP Status Code reference

| Code  | Usage                                            |
| ----- | ------------------------------------------------ |
| `200` | GET/PATCH thành công                             |
| `201` | POST tạo resource                                |
| `204` | DELETE/logout thành công, no body                |
| `400` | Validation error                                 |
| `401` | Chưa auth / token invalid                        |
| `403` | Không đủ role / branch                           |
| `404` | Resource not found                               |
| `409` | Conflict (state, duplicate, stock)               |
| `422` | Business rule violation (optional, hoặc gộp 400) |
| `429` | Rate limit                                       |
| `500` | Server error                                     |

---

## 14. RBAC Matrix (tóm tắt)

| Resource                  | OWNER | MANAGER           | CASHIER  | BARISTA  |
| ------------------------- | ----- | ----------------- | -------- | -------- |
| Auth login/refresh        | ✓     | ✓                 | ✓        | ✓        |
| Users CRUD                | ✓     | read (branch)     | —        | —        |
| Staff CRUD                | ✓     | ✓ (no OWNER role) | —        | —        |
| Categories/Products write | ✓     | ✓                 | —        | —        |
| Categories/Products read  | ✓     | ✓                 | ✓        | ✓        |
| Tables write              | ✓     | ✓                 | —        | —        |
| Tables read/status        | ✓     | ✓                 | ✓        | —        |
| Orders create/pay         | ✓     | ✓                 | ✓        | —        |
| Orders status (kitchen)   | ✓     | ✓                 | ✓        | ✓        |
| Orders queue read         | ✓     | ✓                 | —        | ✓        |
| Payments                  | ✓     | ✓                 | ✓        | —        |
| Reports                   | ✓     | ✓                 | —        | —        |
| Inventory write           | ✓     | ✓                 | —        | —        |
| Inventory read            | ✓     | ✓                 | optional | optional |

---

## 15. Next steps

1. Sync DTOs vào `packages/shared/src/dto/` (một số DTO refresh/report còn thiếu)
2. Generate `docs/api/openapi.yaml` từ contract này (optional — chưa có file)
3. Prisma migration cho Inventory entities (post-MVP design)
4. ~~ADR cập nhật RBAC~~ ✅ ADR-004 marked Superseded; RBAC trong NestJS guards
