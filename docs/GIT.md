# Git — Branch Strategy & Workflow

**Sprint 0.9** | Repository chưa khởi tạo Git tại thời điểm audit — **không tự chạy `git init`**.  
Team thực hiện thủ công theo hướng dẫn dưới đây.

---

## 1. Khởi tạo repository (một lần)

```bash
cd CaffeApp

# Khởi tạo
git init

# Branch mặc định
git branch -M main

# Commit foundation
git add .
git commit -m "chore: initial project foundation (Sprint 0.9)"

# Tạo develop từ main
git checkout -b develop

# Remote (thay URL bằng repo công ty)
git remote add origin https://github.com/<org>/CaffeApp.git
git push -u origin main
git push -u origin develop
```

---

## 2. Branch strategy (Git Flow lite)

| Branch      | Mục đích                     | Merge vào            |
| ----------- | ---------------------------- | -------------------- |
| `main`      | Production-ready releases    | —                    |
| `develop`   | Integration branch hàng ngày | `main` (via release) |
| `feature/*` | User story / task            | `develop`            |
| `release/*` | Stabilize trước release      | `main` + `develop`   |
| `hotfix/*`  | Sửa khẩn production          | `main` + `develop`   |

### Naming convention

```
feature/US-A01-login-api
feature/US-B05-cart-checkout
release/0.2.0
hotfix/0.1.1-jwt-expiry
```

---

## 3. Workflow hàng ngày

```bash
git checkout develop
git pull origin develop
git checkout -b feature/US-A01-login-api

# ... làm việc, commit theo Conventional Commits ...

git push -u origin feature/US-A01-login-api
# Tạo PR → develop, cần 1 approval + CI pass
```

---

## 4. Commit convention

Theo [Conventional Commits](https://www.conventionalcommits.org/) — chi tiết: [VERSIONING.md](VERSIONING.md), [CONTRIBUTING.md](../CONTRIBUTING.md).

```
type(scope): short description

feat(auth): implement POST /api/v1/auth/login
fix(api): correct CORS origin parsing
docs(deployment): add staging checklist
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `build`, `ci`, `perf`, `chore`

---

## 5. Tag strategy

Tags theo **Semantic Versioning** — gắn trên commit trên `main` sau merge release.

```bash
# Sau merge release/0.2.0 → main
git checkout main
git pull origin main
git tag -a v0.2.0 -m "Release 0.2.0 — Auth flow"
git push origin v0.2.0
```

| Tag pattern | Ý nghĩa                  |
| ----------- | ------------------------ |
| `v0.1.0`    | MVP internal alpha       |
| `v0.2.0`    | Sprint 1 complete (Auth) |
| `v1.0.0`    | Pilot UAT production     |

Pre-release (optional): `v0.2.0-rc.1`

---

## 6. Protected branches (khuyến nghị)

| Branch    | Rule                                             |
| --------- | ------------------------------------------------ |
| `main`    | Require PR, 1+ approval, CI pass, no direct push |
| `develop` | Require PR, CI pass                              |

---

## 7. Files không commit

Xem [.gitignore](../.gitignore):

- `.env`, `.env.local`
- `node_modules/`
- `apps/api/dist/`
- `.expo/`
- Keys: `*.jks`, `*.p8`, `*.p12`

---

## Related

- [CONTRIBUTING.md](../CONTRIBUTING.md)
- [RELEASE.md](RELEASE.md)
- [VERSIONING.md](VERSIONING.md)
