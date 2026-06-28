# Changelog

All notable changes to CaffeApp are documented in this file.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)  
Versioning: [Semantic Versioning](docs/VERSIONING.md)

---

## [Unreleased]

### Added

- Sprint 0.9 production foundation documentation (DEPLOYMENT, SECURITY, TESTING, RELEASE, VERSIONING, GIT)
- Documentation audit & repair (ERD sync Prisma, ADR superseded markers, API contract status)

### Changed

- Documentation aligned with NestJS + Prisma + Expo 56 stack

---

## [0.9.0] - 2026-06-28

### Added

- **Sprint 0.5:** NestJS API scaffold, Prisma schema (11 models), initial migration `initial_schema`
- **Sprint 0:** Expo mobile nav shell (auth, cashier, barista, manager routes)
- Monorepo npm workspaces (`apps/mobile`, `apps/api`, `packages/shared`)
- CI workflow: typecheck, lint, format, api-build
- Docker PostgreSQL 16 (`infra/docker-compose.yml`)
- Shared package: enums, DTOs, contracts, theme

### Notes

- Pre-release foundation tag — **no production features implemented yet**
- Only API endpoint live: `GET /api/v1/health`
- Mobile auth flow uses mock data (Sprint 1 pending)

---

## [0.1.0] - TBD (Sprint 1 target)

Planned:

- Auth API (JWT login, refresh, `/me`)
- Mobile SecureStore session
- Branch selection via API

---

[Unreleased]: https://github.com/<org>/CaffeApp/compare/v0.9.0...HEAD
[0.9.0]: https://github.com/<org>/CaffeApp/releases/tag/v0.9.0
