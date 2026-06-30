# CaffeApp — Release Candidate Checklist

**Target:** `v1.0.0-rc.1`  
**Phase:** 5 — Bug Fix / RC  
**Trạng thái:** template; không tag/branch nếu UAT chưa sign-off.

---

## 1. Pre-RC

- [ ] UAT Sign-off có Owner/QL ký.
- [ ] 0 Critical, 0 High open.
- [ ] Medium có fix hoặc Owner waiver.
- [ ] `CHANGELOG.md` cập nhật.
- [ ] Version theo [VERSIONING.md](VERSIONING.md).

---

## 2. Local verification

```powershell
npm run validate
npm run test
$env:EXPO_PUBLIC_API_URL="https://<staging-api-domain>"
npm run phase4:release-ready -- --profile preview
```

---

## 3. RC build

```powershell
git checkout develop
git pull origin develop
git checkout -b release/1.0.0-rc.1

$env:EXPO_PUBLIC_API_URL="https://<staging-api-domain>"
cd apps/mobile
npm run eas:build:preview:android
```

Ghi vào sheet:

| Hạng mục             | Giá trị              |
| -------------------- | -------------------- |
| Branch               | `release/1.0.0-rc.1` |
| Commit SHA           |                      |
| EAS build URL        |                      |
| API staging URL      |                      |
| DB migration version |                      |

---

## 4. Rollback proof

- [ ] Previous mobile build URL xác định.
- [ ] Previous API artifact/tag xác định.
- [ ] DB backup trước deploy/staging migrate đã tạo.
- [ ] `GET /api/v1/health` pass sau rollback rehearsal.
