# Sprint 0.5 — Architecture Refactor (FE/BE Split)

**Status:** Accepted  
**Date:** 2026-06-27

## Context

Sprint 0 dùng Supabase trực tiếp trong thiết kế. Production nội bộ cần tách rõ Frontend/Backend, business logic tập trung ở API.

## Decision

- **Mobile:** Expo + Axios + TanStack Query → gọi NestJS API only
- **Backend:** NestJS + Prisma + PostgreSQL
- **Shared:** enums, DTOs, types trong `packages/shared`
- **Supabase:** deprecated cho mobile direct access; `docs/legacy/supabase/` giữ làm reference

## Consequences

**Positive:**

- Business rules enforce tại một nơi (API)
- Dễ audit, test, scale backend
- Mobile mỏng, dễ maintain

**Negative:**

- Cần host PostgreSQL + API server
- Sprint 1 delay nhẹ do setup infra
