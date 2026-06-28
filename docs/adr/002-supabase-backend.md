# ADR-002: Supabase as BaaS Backend

**Status:** **Superseded** by [ADR-006](../adr/006-fe-be-split-nestjs.md) and [ADR-007](../adr/007-enterprise-architecture.md)  
**Superseded date:** 2026-06-27  
**Date:** 2026-06-25  
**Deciders:** Tech Lead

> **LEGACY — READ ONLY / ARCHIVED**  
> Backend hiện tại: **NestJS API + PostgreSQL + Prisma**. Không implement feature mới trên Supabase.

## Context

MVP cần backend nhanh với auth, PostgreSQL, real-time, file storage. Team nhỏ, không có dedicated backend engineer full-time cho MVP.

## Decision

Sử dụng **Supabase** làm backend chính:

- PostgreSQL database
- Supabase Auth
- Row Level Security (RLS)
- Realtime subscriptions
- Storage cho ảnh menu
- Edge Functions cho logic phức tạp (payment confirm, reports)

## Alternatives Considered

| Option                  | Pros                             | Cons                                |
| ----------------------- | -------------------------------- | ----------------------------------- |
| **Supabase**            | All-in-one, fast MVP, PostgreSQL | Vendor coupling                     |
| NestJS + self-hosted PG | Full control                     | DevOps overhead, slower MVP         |
| Firebase                | Real-time mature                 | NoSQL less fit for orders/relations |
| AWS Amplify             | Scalable                         | Complex setup                       |

## Consequences

**Positive:**

- Auth + DB + Realtime trong 1 tuần setup
- RLS enforce branch isolation
- SQL migrations version controlled
- OpenAPI spec vẫn document contract cho FE

**Negative:**

- Custom business logic trong Edge Functions (Deno)
- Migration path nếu outgrow Supabase cần planning

## Mitigation

- `packages/shared` chứa types/interfaces — không leak Supabase types vào UI
- Mobile API layer: `apps/mobile/src/shared/lib/api/` (Axios → NestJS)
