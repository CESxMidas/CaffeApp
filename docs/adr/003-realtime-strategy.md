# ADR-003: Real-time Order Sync Strategy

**Status:** **Superseded** by [ADR-006](006-fe-be-split-nestjs.md) and [ADR-007](007-enterprise-architecture.md)  
**Superseded date:** 2026-06-27  
**Date:** 2026-06-25  
**Deciders:** Tech Lead

> **LEGACY — READ ONLY / ARCHIVED**  
> Quyết định Supabase Realtime **không còn áp dụng**. Realtime sẽ triển khai qua **NestJS WebSocket Gateway hoặc SSE** (Sprint 4).  
> Order status enum hiện tại: `PENDING → MAKING → READY → PAID` (Prisma).

## Context

Khi thu ngân "Gửi vào bếp", barista phải thấy đơn trong **< 3 giây** (NFR-02). Cần cơ chế push, không polling.

## Decision (historical)

Sử dụng **Supabase Realtime** subscribe `postgres_changes` trên bảng `orders` và `order_items` — **đã thay thế**.

## Replacement (current direction)

| Concern | Current approach |
| ------- | ---------------- |
| Transport | NestJS WebSocket Gateway hoặc Server-Sent Events |
| Fallback | TanStack Query `refetchInterval` khi disconnect |
| Filter | `branchId` + `status IN (PENDING, MAKING)` |
| Sprint | Sprint 4 (Barista Real-time) |

## Alternatives Considered (historical)

| Option                       | Pros                   | Cons                     |
| ---------------------------- | ---------------------- | ------------------------ |
| **Supabase Realtime**        | Built-in, Postgres CDC | Coupled to Supabase      |
| Custom WebSocket (Socket.io) | Full control           | Extra server to maintain |
| Polling every 5s             | Simple                 | Latency, battery drain   |
| Firebase FCM only            | Push notifications     | Not true realtime list   |

## Consequences (historical)

**Positive:**

- Latency thường < 1s
- Không cần WebSocket server riêng
- Barista list auto-update

**Negative:**

- Cần handle reconnect khi mất mạng
- Channel subscription lifecycle phải cleanup on unmount

## Implementation Notes (replacement)

- Barista screen: subscribe on focus, unsubscribe on blur
- Fallback: TanStack Query `refetchInterval: 10000` khi Realtime disconnected
- Push notification (Expo) cho READY status → thu ngân (bổ sung Sprint 4)
