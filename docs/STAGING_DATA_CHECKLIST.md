# CaffeApp — Phase 3 Staging Data Checklist

**Mục tiêu:** xác nhận staging có data giống quán thật trước internal demo.  
**Ngày chuẩn bị repo-side:** 2026-06-30.  
**Trạng thái:** static seed inputs pass bằng script; actual staging DB vẫn cần Dev/TPM ký sau khi seed.

---

## 1. Repo-side verification

Chạy:

```powershell
npm run phase3:verify-staging-data
```

Script kiểm:

- `apps/api/prisma/data/staging-branches.json` có ít nhất 3 chi nhánh.
- Mỗi chi nhánh có `bankInfo.bank`, `bankInfo.bankCode`, `bankInfo.account`, `bankInfo.holder`.
- `apps/api/prisma/data/staging-menu.json` có ít nhất 6 category và 38 món.
- Product trỏ đúng category, giá là số nguyên dương, không trùng tên trong cùng category.
- Tính expected DB count sau `db:seed:staging`.

Kết quả kỳ vọng hiện tại:

| Hạng mục            | Kỳ vọng |
| ------------------- | ------: |
| Active branches     |    >= 3 |
| Tables              |     150 |
| Active branch staff |      12 |
| Categories          |      24 |
| Available products  |     114 |

---

## 2. Staging DB verification

Chạy seed trên staging DB:

```powershell
npm run db:seed:staging --workspace=@caffeapp/api
```

Sau khi seed, login staging bằng account CN Quận 1 và kiểm API:

| Check           | Endpoint                                                                           | Expected                                                  |
| --------------- | ---------------------------------------------------------------------------------- | --------------------------------------------------------- |
| Health          | `GET /api/v1/health`                                                               | 200 OK                                                    |
| Branches        | `GET /api/v1/branches`                                                             | 3 CN active                                               |
| Tables Q1       | `GET /api/v1/tables?branchId=a0000000-0000-0000-0000-000000000001`                 | 50 bàn                                                    |
| Products Q1     | `GET /api/v1/products?branchId=a0000000-0000-0000-0000-000000000001`               | 38 món available                                          |
| Staff picker Q1 | `GET /api/v1/staff/branch-operators?branchId=a0000000-0000-0000-0000-000000000001` | cashier/barista/manager active, không gồm station account |

---

## 3. Demo readiness sign-off

| Mục                                                      | Pass/Fail | Người ký | Ghi chú |
| -------------------------------------------------------- | --------- | -------- | ------- |
| 3 CN active                                              |           | Dev      |         |
| 50 bàn/CN                                                |           | Dev      |         |
| ~40 món/CN                                               |           | Dev      |         |
| STK VietQR từng CN                                       |           | Dev/TPM  |         |
| Account Owner/Manager/Cashier/Barista/Station login được |           | QA       |         |
| Dry-run tạo đơn test không lỗi                           |           | QA       |         |

Không tick Phase 3 gate nếu bảng này chưa được ký trên staging thật.
