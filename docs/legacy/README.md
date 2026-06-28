# Legacy Reference — READ ONLY / ARCHIVED

> **LEGACY — READ ONLY / ARCHIVED**  
> Nội dung trong thư mục này thuộc thiết kế **Supabase-first (Sprint 0)**.  
> **Không implement feature mới** dựa trên các file này.

## Superseded artifacts

| Path                    | Status   | Thay thế bằng                                   |
| ----------------------- | -------- | ----------------------------------------------- |
| `supabase/migrations/`  | ARCHIVED | `apps/api/prisma/schema.prisma` + `migrations/` |
| `supabase/seed.sql`     | ARCHIVED | `apps/api/prisma/seed.ts`                       |
| `openapi-supabase.yaml` | ARCHIVED | `docs/api/API_CONTRACT.md`                      |

## Superseded ADRs (giữ lịch sử)

| ADR                                    | Topic               | Status     |
| -------------------------------------- | ------------------- | ---------- |
| [002](../adr/002-supabase-backend.md)  | Supabase BaaS       | Superseded |
| [003](../adr/003-realtime-strategy.md) | Supabase Realtime   | Superseded |
| [004](../adr/004-auth-rbac.md)         | Supabase Auth + RLS | Superseded |

## Current stack (Sprint 0.5+)

```
Mobile (Expo) → NestJS API (/api/v1) → PostgreSQL 16 (Prisma)
```

Xem: [ARCHITECTURE.md](../ARCHITECTURE.md), [ADR-006](../adr/006-fe-be-split-nestjs.md), [ADR-007](../adr/007-enterprise-architecture.md).

Do not implement new features against Supabase direct access.
