# ADR-005: Monorepo with npm Workspaces

**Status:** Accepted  
**Date:** 2026-06-25  
**Deciders:** Tech Lead

## Context

Mobile app cần share types (Order, MenuItem, enums) với validation logic. Team 1–3 devs. Có thể mở rộng thêm Edge Functions hoặc admin web sau.

## Decision

**Monorepo** với **npm workspaces**:

```json
{
  "workspaces": ["apps/*", "packages/*"]
}
```

Packages:

- `@caffeapp/shared` — types, enums, zod schemas, constants
- `@caffeapp/mobile` — Expo app (apps/mobile)

Không tách repo mobile/backend riêng cho MVP.

## Alternatives Considered

| Option                      | Pros                     | Cons                                 |
| --------------------------- | ------------------------ | ------------------------------------ |
| **npm workspaces monorepo** | Simple, no extra tooling | No caching like Turborepo            |
| Turborepo monorepo          | Build cache              | Overkill for 2 packages              |
| Separate repos              | Independent deploy       | Type sync pain, npm publish overhead |
| Single app no packages      | Simplest                 | Types duplicated                     |

## Consequences

**Positive:**

- Import `@caffeapp/shared` trực tiếp
- Single PR cho FE + type changes
- Future: add `apps/admin-web` easily

**Negative:**

- Root `package.json` manages hoisting
- CI must know workspace structure

## Offline Strategy (MVP)

**Decision:** **Online-only** cho MVP.

- Hiện offline banner (NetInfo)
- Disable actions cần network (gửi bếp, thanh toán)
- Giữ cart trong Zustand persist (AsyncStorage) — không sync server khi offline

Post-MVP: evaluate WatermelonDB hoặc PowerSync cho offline-first.
