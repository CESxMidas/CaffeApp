# Versioning — Semantic Versioning

**Sprint 0.9** | Áp dụng cho monorepo CaffeApp (npm workspaces).

---

## 1. Quy tắc SemVer

Format: **`MAJOR.MINOR.PATCH`** (ví dụ `0.2.0`)

| Bump      | Khi nào                                            | Ví dụ             |
| --------- | -------------------------------------------------- | ----------------- |
| **MAJOR** | Breaking API/contract, migration không tương thích | `1.0.0` → `2.0.0` |
| **MINOR** | Feature mới, backward compatible                   | `0.1.0` → `0.2.0` |
| **PATCH** | Bug fix, docs-only release tag                     | `0.2.0` → `0.2.1` |

Pre-release: `0.2.0-rc.1`, `0.2.0-beta.1`

---

## 2. Trạng thái hiện tại

| Package            | `package.json` version | Ghi chú                                 |
| ------------------ | ---------------------- | --------------------------------------- |
| Root `caffeapp`    | `1.0.0-mvp`            | Chuyển sang SemVer tại release đầu tiên |
| `@caffeapp/api`    | `1.0.0-mvp`            | Lockstep với root (monorepo)            |
| `@caffeapp/mobile` | `1.0.0-mvp`            | Lockstep với root                       |
| `@caffeapp/shared` | `1.0.0-mvp`            | Lockstep với root                       |

**Khuyến nghị Sprint 1 kickoff:** đặt version **`0.1.0`** (foundation) hoặc **`0.2.0`** khi Auth E2E xong.

---

## 3. Monorepo versioning

CaffeApp dùng **single version** cho toàn repo (không independent versioning per package).

```
v0.2.0 tag → tất cả workspaces cùng version trong package.json
```

Bump version khi release:

```bash
# Manual hoặc tool (npm version) tại root — đồng bộ workspaces
npm version 0.2.0 --no-git-tag-version
# Cập nhật version trong apps/* và packages/* nếu cần
git tag v0.2.0
```

---

## 4. Commit ↔ version mapping

| Commit type                      | Version impact                            |
| -------------------------------- | ----------------------------------------- |
| `feat:`                          | MINOR bump                                |
| `fix:`                           | PATCH bump                                |
| `feat!:` hoặc `BREAKING CHANGE:` | MAJOR bump                                |
| `docs:`, `chore:`, `ci:`         | Không bump (trừ khi release housekeeping) |

---

## 5. API versioning

REST API dùng **URL prefix**: `/api/v1`

Breaking API change → tạo `/api/v2` + bump MAJOR app version.

Mobile `EXPO_PUBLIC_API_URL` trỏ base host; path version nằm trong `api.config.ts`.

---

## 6. Database migrations

Prisma migrations **không** gắn SemVer tag riêng — theo timestamp folder:

```
apps/api/prisma/migrations/20260628032842_initial_schema/
```

Production deploy: `npm run db:migrate:deploy --workspace=@caffeapp/api`

---

## 7. Changelog

Mọi release ghi vào [CHANGELOG.md](../CHANGELOG.md) theo [Keep a Changelog](https://keepachangelog.com/).

---

## Related

- [GIT.md](GIT.md) — tag strategy
- [RELEASE.md](RELEASE.md) — release process
- [CHANGELOG.md](../CHANGELOG.md)
