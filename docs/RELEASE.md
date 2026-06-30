# Release Strategy — CaffeApp

**Sprint 0.9** | Git Flow lite + SemVer + EAS (mobile)

---

## 1. Release channels

```
Development → QA → Staging → Production
     │          │       │          │
  feature/*   develop  release/*    main (tagged)
```

| Channel         | Branch       | Audience       | API         | Mobile build           |
| --------------- | ------------ | -------------- | ----------- | ---------------------- |
| **Development** | `feature/*`  | Developers     | Local / dev | Expo Go                |
| **QA**          | `develop`    | QA team        | Dev/staging | EAS preview (internal) |
| **Staging**     | `release/*`  | PO, pilot prep | Staging     | EAS preview            |
| **Production**  | `main` + tag | Pilot quán     | Production  | EAS production         |

---

## 2. Release cadence

| Type            | Frequency      | Version bump              |
| --------------- | -------------- | ------------------------- |
| Sprint release  | ~2 weeks       | MINOR (`0.1.0` → `0.2.0`) |
| Hotfix          | As needed      | PATCH (`0.2.0` → `0.2.1`) |
| Breaking change | Rare (pre-1.0) | MAJOR when stable         |

Milestone mapping: [SPRINT_PLAN.md](SPRINT_PLAN.md)

| Milestone               | Target version |
| ----------------------- | -------------- |
| M0 Foundation           | `v0.9.0`       |
| M1 Auth (Sprint 1)      | `v0.2.0`       |
| M4 Pilot UAT (Sprint 6) | `v1.0.0`       |

---

## 3. Release process

### Step 1 — Code freeze (release branch)

```bash
git checkout develop
git pull origin develop
git checkout -b release/0.2.0
```

- Chỉ bug fixes trên `release/*`
- Chạy full validation: `npm run validate`
- QA sign-off trên staging

### Step 2 — Staging deploy

| Component | Action                                         |
| --------- | ---------------------------------------------- |
| API       | Deploy build to staging + `db:migrate:deploy`  |
| Mobile    | EAS build `preview` profile → internal testers |
| Smoke     | Health check + critical path manual            |

Pre-build check:

```bash
EXPO_PUBLIC_API_URL="https://<staging-api-domain>" npm run phase4:release-ready -- --profile preview
```

### Step 3 — Production release

```bash
git checkout main
git merge release/0.2.0
git tag -a v0.2.0 -m "Release 0.2.0 — Auth flow"
git push origin main --tags

git checkout develop
git merge release/0.2.0
git push origin develop
```

| Component | Action                                 |
| --------- | -------------------------------------- |
| API       | Deploy to production                   |
| DB        | `db:migrate:deploy` (backup trước)     |
| Mobile    | EAS production build                   |
| Changelog | Update [CHANGELOG.md](../CHANGELOG.md) |

Production readiness + smoke:

```bash
EXPO_PUBLIC_API_URL="https://<prod-api-domain>" npm run phase4:release-ready -- --profile production
DATABASE_URL="postgresql://..." PG_BACKUP_LABEL="pre-prod-v1.0.0" npm run db:backup:pg
API_BASE_URL="https://<prod-api-domain>" API_EMAIL="manager.q1@caffe.app" API_PASSWORD="***" npm run phase8:smoke
```

### Step 4 — Post-release

- Monitor logs 24h
- Smoke test production
- Announce release notes nội bộ

---

## 4. Rollback

### API rollback

1. Redeploy **previous Docker image / artifact** từ tag trước
2. Nếu migration breaking: restore DB backup + deploy previous API version
3. **Không** rollback migration đã destructive — cần forward-fix

### Mobile rollback

1. **EAS Update** — rollback JS bundle nếu OTA enabled
2. **Full rollback** — redistribute previous APK/IPA build từ EAS

### Database rollback

| Scenario                       | Action                 |
| ------------------------------ | ---------------------- |
| Migration chưa deploy prod     | Không áp dụng          |
| Migration đã deploy, lỗi logic | Forward migration fix  |
| Data corruption                | Restore từ backup PITR |

---

## 5. Hotfix process

```bash
git checkout main
git checkout -b hotfix/0.2.1-jwt-fix
# fix, test, PR → main
git tag v0.2.1
git checkout develop
git merge hotfix/0.2.1-jwt-fix
```

Deploy hotfix **trực tiếp production** — skip staging nếu critical.

---

## 6. Release checklist

### Pre-release

- [ ] All sprint stories Done (DoD)
- [ ] `npm run validate` pass on `release/*`
- [ ] [CHANGELOG.md](../CHANGELOG.md) updated
- [ ] Version bumped ([VERSIONING.md](VERSIONING.md))
- [ ] QA sign-off
- [ ] Staging smoke pass
- [ ] `phase4:release-ready` pass for target profile
- [ ] DB migration reviewed
- [ ] Secrets rotated if needed

### Production deploy

- [ ] DB backup confirmed
- [ ] `db:migrate:deploy` success
- [ ] API health OK
- [ ] `phase8:smoke` read-only pass
- [ ] Mobile build distributed
- [ ] Rollback artifact identified

### Post-release

- [ ] Tag pushed (`vX.Y.Z`)
- [ ] Release notes published
- [ ] Sprint retrospective scheduled

---

## Related

- [GIT.md](GIT.md)
- [VERSIONING.md](VERSIONING.md)
- [DEPLOYMENT.md](DEPLOYMENT.md)
- [TESTING.md](TESTING.md)
- [CHANGELOG.md](../CHANGELOG.md)
