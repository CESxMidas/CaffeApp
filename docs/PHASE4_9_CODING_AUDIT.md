# CaffeApp — Phase 4–9 Coding Audit

**Ngày:** 2026-06-30  
**Phạm vi:** rà soát GO_LIVE_PLAN Phase 4–9 để xử lý phần coding/tooling có thể làm trước UAT/pilot.  
**Nguyên tắc:** không tick gate nghiệp vụ khi chưa có UAT, staging/prod deploy, thiết bị thật, PO/Owner sign-off.

---

## Kết luận nhanh

| Phase                | Repo-side đã hoàn thiện                                                                | Còn thủ công / phụ thuộc thực tế                                |
| -------------------- | -------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Phase 4 — UAT        | EAS config, release-ready check, UAT sign-off/report templates                         | Book lịch, cài build, chạy 15 kịch bản, Owner/QL ký             |
| Phase 5 — Bug Fix/RC | RC checklist, backup helper, release readiness verifier                                | Fix bug thật sau UAT, tag/branch RC, restore drill staging      |
| Phase 6 — Pilot      | Pilot daily log, on-call roster, smoke/go-live tooling                                 | Vận hành CN1, KPI hằng ngày, go/no-go CN2                       |
| Phase 7 — Training   | Training pack + SOP source markdown                                                    | Quay video, in/laminate SOP, NV ký competency                   |
| Phase 8 — Go-Live    | EAS production profile, production smoke script, data checklist, announcement template | Deploy prod, EAS build thật, import prod, war room              |
| Phase 9 — Hypercare  | Weekly stability report + post-mortem templates                                        | On-call 2–4 tuần, patch release theo bug thật, roadmap sign-off |

---

## Coding/tooling đã thêm

| Task                       | File                                   | Ghi chú                                                |
| -------------------------- | -------------------------------------- | ------------------------------------------------------ |
| P4-02 / P8-02 EAS profiles | `apps/mobile/eas.json`                 | `development`, `preview`, `production` profiles        |
| P4-02 / P8-02 local EAS    | `apps/mobile/package.json`             | `eas-cli` devDependency + npm build scripts            |
| P4/P8 release readiness    | `scripts/verify-release-readiness.mjs` | Kiểm EAS profile, version, API URL build env           |
| P5/P8 DB backup            | `scripts/pg-backup.mjs`                | Wrapper `pg_dump`, output vào `database/backups/`      |
| P8 smoke test              | `scripts/go-live-smoke.mjs`            | Read-only default; write-path opt-in                   |
| Root npm scripts           | `package.json`                         | `phase4:release-ready`, `phase8:smoke`, `db:backup:pg` |

---

## Những phần không thể tự code trước

- P4-06 copy cuối: chỉ sửa string sau khi Owner/QL duyệt trên thiết bị thật.
- P5-02 bug fixes: chưa có defect UAT/demo cụ thể.
- P6-02 hotfix S1: chỉ làm khi có incident thật.
- P8-01/P8-02 deploy/build production: cần secrets, domain, EAS account, production DB.
- P9-03 patch release: phụ thuộc bug/PR thật sau go-live.

---

## Lệnh kiểm tra nhanh

```powershell
# Preview/UAT build readiness
$env:EXPO_PUBLIC_API_URL="https://<staging-api-domain>"
npm run phase4:release-ready -- --profile preview

# Production build readiness
$env:EXPO_PUBLIC_API_URL="https://<prod-api-domain>"
npm run phase4:release-ready -- --profile production

# DB backup trước deploy
$env:DATABASE_URL="postgresql://..."
$env:PG_BACKUP_LABEL="pre-prod-v1.0.0"
npm run db:backup:pg

# Read-only production smoke
$env:API_BASE_URL="https://<prod-api-domain>"
$env:API_EMAIL="manager.q1@caffe.app"
$env:API_PASSWORD="***"
npm run phase8:smoke
```
