# Contributing to CaffeApp

## Development Workflow

1. Khởi tạo Git theo [docs/GIT.md](docs/GIT.md) (nếu chưa có repo)
2. Tạo branch từ `develop`: `feature/US-XXX-short-description`
3. Đảm bảo story pass **Definition of Ready** ([DOR_CHECKLIST.md](docs/DOR_CHECKLIST.md))
4. Implement + viết tests cho logic quan trọng ([TESTING.md](docs/TESTING.md))
5. Chạy `npm run validate` trước khi push
6. Tạo Pull Request vào `develop`
7. Cần 1 approval + CI pass

> **Không** kết nối Supabase/PostgreSQL trực tiếp từ mobile — mọi request qua NestJS API (`/api/v1`).

## Branch strategy

| Branch      | Purpose                      |
| ----------- | ---------------------------- |
| `main`      | Production releases (tagged) |
| `develop`   | Daily integration            |
| `feature/*` | User stories                 |
| `release/*` | Release stabilization        |
| `hotfix/*`  | Production fixes             |

Chi tiết: [docs/GIT.md](docs/GIT.md)

## Commit Message Format

Theo [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): short description

feat(auth): add login screen with validation
fix(orders): prevent duplicate table selection
docs(deployment): add staging checklist
```

### Types

| Type       | Usage                       |
| ---------- | --------------------------- |
| `feat`     | New feature                 |
| `fix`      | Bug fix                     |
| `docs`     | Documentation only          |
| `style`    | Formatting, no logic change |
| `refactor` | Code change, no feature/fix |
| `test`     | Add or update tests         |
| `build`    | Build system, dependencies  |
| `ci`       | CI/CD configuration         |
| `perf`     | Performance improvement     |
| `chore`    | Maintenance, tooling        |

Breaking change: `feat!:` hoặc footer `BREAKING CHANGE:`

Versioning impact: [docs/VERSIONING.md](docs/VERSIONING.md)

## Code Style

- TypeScript strict mode
- Functional components + hooks
- Shared types từ `@caffeapp/shared` — không duplicate
- UI components từ `apps/mobile/src/shared/components/ui/`
- Colors/spacing từ `@caffeapp/shared/theme` — không hardcode hex trong screens

## PR Checklist

- [ ] `npm run validate` pass (format:check + lint + typecheck)
- [ ] Acceptance criteria từ User Story được đáp ứng
- [ ] Không commit `.env` hoặc secrets
- [ ] Screenshots cho thay đổi UI (nếu có)
- [ ] CHANGELOG updated (nếu user-facing change)

## Environment Setup

1. `npm install` tại root
2. Tạo `.env` theo [docs/ENV_SETUP.md](docs/ENV_SETUP.md):
   - `apps/api/.env` từ `apps/api/.env.example`
   - `apps/mobile/.env` từ `apps/mobile/.env.example`
3. PostgreSQL — Docker hoặc cài local ([infra/README.md](infra/README.md)):

   ```bash
   docker compose -f infra/docker-compose.yml up -d
   npm run db:generate
   npm run db:migrate
   npm run db:seed
   ```

4. Chạy dev:

   ```bash
   # Terminal 1
   npm run api

   # Terminal 2
   npm run mobile
   # hoặc Android emulator: npm run mobile:android
   ```

Mobile **không** kết nối Supabase/PostgreSQL trực tiếp — mọi request qua NestJS API.

## Questions

| Topic               | Document                                                       |
| ------------------- | -------------------------------------------------------------- |
| System architecture | [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)                   |
| Mobile architecture | [docs/MOBILE_ARCHITECTURE.md](docs/MOBILE_ARCHITECTURE.md)     |
| Coding conventions  | [docs/CONVENTIONS.md](docs/CONVENTIONS.md)                     |
| Git & branches      | [docs/GIT.md](docs/GIT.md)                                     |
| Deployment          | [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)                       |
| Security            | [docs/SECURITY.md](docs/SECURITY.md)                           |
| Testing             | [docs/TESTING.md](docs/TESTING.md)                             |
| Release             | [docs/RELEASE.md](docs/RELEASE.md)                             |
| ADRs                | [docs/adr/](docs/adr/)                                         |
| Legacy (Supabase)   | [docs/legacy/README.md](docs/legacy/README.md) — **READ ONLY** |
