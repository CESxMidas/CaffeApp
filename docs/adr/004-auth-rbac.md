# ADR-004: Authentication & RBAC Strategy

**Status:** **Superseded** by [ADR-006](006-fe-be-split-nestjs.md) and [ADR-007](007-enterprise-architecture.md)  
**Superseded date:** 2026-06-27  
**Date:** 2026-06-25  
**Deciders:** Tech Lead

> **LEGACY — READ ONLY / ARCHIVED**  
> Auth hiện tại: **NestJS JWT** + **Prisma** (`users`, `staff`) + **service-layer RBAC guards**.  
> Không dùng Supabase Auth, RLS, hay bảng `user_roles`.

## Context

App có 4 vai trò staff: `OWNER`, `MANAGER`, `CASHIER`, `BARISTA`. Mobile routing dùng 3 role UX: `cashier`, `barista`, `manager` (xem `@caffeapp/shared/domain`).

## Decision (historical — Supabase era)

### Authentication (superseded)

- ~~Supabase Auth email/password~~
- ~~RLS policies trên PostgreSQL~~

### Current authentication (see ADR-006/007, API_CONTRACT.md)

- **NestJS JWT** access + refresh tokens
- Password hash trong `users.password_hash` (Prisma)
- Tokens lưu **Expo SecureStore** (mobile)
- Session timeout: configurable via `JWT_EXPIRES_IN` (default `15m` access in `.env.example`)

### Current authorization (RBAC)

- Bảng `staff`: `user_id`, `branch_id`, `role` (`StaffRole` enum)
- Một user ↔ một staff record (single role per login context)
- **NestJS guards** theo `StaffRole` — không dùng RLS
- Branch isolation trong **service layer** (`branchId` scoped queries)

### Role permissions matrix (current — API contract)

| Action              | CASHIER | BARISTA | MANAGER | OWNER |
| ------------------- | ------- | ------- | ------- | ----- |
| Create order        | ✓       | —       | ✓       | ✓     |
| Send to kitchen     | ✓       | —       | ✓       | ✓     |
| View barista queue  | —       | ✓       | ✓       | ✓     |
| Update order status | ✓       | ✓       | ✓       | ✓     |
| Process payment     | ✓       | —       | ✓       | ✓     |
| View dashboard      | —       | —       | ✓       | ✓     |
| Manage menu         | —       | —       | ✓       | ✓     |
| Manage staff        | —       | —       | ✓       | ✓     |
| Manage tables       | —       | —       | ✓       | ✓     |

Chi tiết: [API_CONTRACT.md §14](../api/API_CONTRACT.md)

## Alternatives Considered (historical)

| Option                     | Pros              | Cons                            |
| -------------------------- | ----------------- | ------------------------------- |
| **Supabase Auth + RLS**    | DB-level security | RLS complexity                  |
| Custom JWT + NestJS guards | Flexible          | More code                       |
| Role in JWT claims only    | Simple            | Hard to update without re-login |

## Consequences (historical)

**Positive:**

- Security enforced at database level (defense in depth)
- Role switch trong ca không cần re-login

**Negative:**

- RLS policies cần test kỹ
- Client-side cũng hide UI theo role (UX, not security)
