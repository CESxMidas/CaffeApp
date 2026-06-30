# CaffeApp — Production Data Checklist

**Phase:** 8 — Import production data  
**Mục tiêu:** production có đúng dữ liệu 3 CN, không copy đơn test staging.

---

## 1. Trước import

- [ ] Owner chốt tên/địa chỉ/số điện thoại 3 CN.
- [ ] Owner chốt STK VietQR từng CN.
- [ ] Menu thật + giá đã gồm VAT 8%.
- [ ] Staff accounts đúng role.
- [ ] Backup DB production đã tạo.

---

## 2. Import

Nếu dữ liệu production trùng cấu trúc staging seed:

```powershell
$env:DATABASE_URL="postgresql://<prod>"
$env:STAGING_SEED_PASSWORD="<temporary-strong-password>"
npm run db:seed:staging
```

> Đổi tên script/import về production-specific nếu dữ liệu khác staging. Không import test orders.

---

## 3. Verify API

```powershell
$env:API_BASE_URL="https://<prod-api-domain>"
$env:API_EMAIL="manager.q1@caffe.app"
$env:API_PASSWORD="***"
npm run phase8:smoke
```

| Check            | Expected                      |
| ---------------- | ----------------------------- |
| Branches         | 3 CN active                   |
| Tables           | 50 bàn/CN                     |
| Products         | ~40 món/CN                    |
| VietQR           | STK/holder đúng từng CN       |
| Branch isolation | Staff CN1 không thấy data CN2 |
