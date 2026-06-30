# CaffeApp — Entity Relationship Diagram

**Version:** 2.0.0  
**Database:** PostgreSQL 16 (local Docker hoặc managed)  
**Source of truth:** `apps/api/prisma/schema.prisma`  
**Last synced:** 2026-06-28

> **Lưu ý:** Schema Supabase cũ (`employees`, `user_roles`, `menu_items`, …) đã **deprecated**.  
> Xem archive: [docs/legacy/README.md](../legacy/README.md)

---

## ERD Diagram

```mermaid
erDiagram
    users ||--o| staff : has
    users ||--o{ audit_logs : actor

    branches ||--o{ staff : employs
    branches ||--o{ tables : has
    branches ||--o{ product_categories : has
    branches ||--o{ products : offers
    branches ||--o{ shifts : runs
    branches ||--o{ orders : receives
    branches ||--o{ audit_logs : scopes

    product_categories ||--o{ products : contains

    tables ||--o{ orders : hosts

    shifts ||--o{ orders : during

    orders ||--|{ order_items : contains
    order_items }o--|| products : references

    orders ||--o{ payments : has

    users {
        uuid id PK
        string email UK
        string password_hash
        string full_name
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }

    staff {
        uuid id PK
        uuid user_id FK UK
        uuid branch_id FK
        enum role
        string full_name
        string phone
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }

    branches {
        uuid id PK
        string name
        string address
        string phone
        jsonb bank_info
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }

    tables {
        uuid id PK
        uuid branch_id FK
        string code
        string floor
        int capacity
        enum status
        timestamp created_at
        timestamp updated_at
    }

    product_categories {
        uuid id PK
        uuid branch_id FK
        string name
        string slug
        int sort_order
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }

    products {
        uuid id PK
        uuid branch_id FK
        uuid category_id FK
        string name
        string description
        int price
        string image_url
        boolean is_available
        timestamp created_at
        timestamp updated_at
    }

    shifts {
        uuid id PK
        uuid branch_id FK
        string name
        string shift_type
        string start_time
        string end_time
        timestamp opened_at
        timestamp closed_at
        enum status
        int total_revenue
        int total_orders
        timestamp created_at
        timestamp updated_at
    }

    orders {
        uuid id PK
        uuid branch_id FK
        uuid shift_id FK
        uuid table_id FK
        string order_number
        enum order_type
        enum status
        int subtotal
        int tax_amount
        int total
        string notes
        timestamp created_at
        timestamp updated_at
        timestamp paid_at
        timestamp delivered_at
    }

    order_items {
        uuid id PK
        uuid order_id FK
        uuid product_id FK
        string product_name
        int quantity
        int unit_price
        int line_total
        string notes
        timestamp created_at
    }

    payments {
        uuid id PK
        uuid order_id FK
        enum method
        int amount
        int change_amount
        string reference
        timestamp paid_at
        timestamp created_at
    }

    audit_logs {
        uuid id PK
        uuid branch_id FK
        uuid actor_id FK
        string entity_type
        uuid entity_id
        string action
        jsonb before_data
        jsonb after_data
        jsonb metadata
        timestamp created_at
    }
```

---

## Enums (Prisma)

### `StaffRole`

| Value     | Mô tả                 |
| --------- | --------------------- |
| `OWNER`   | Chủ quán — toàn quyền |
| `MANAGER` | Quản lý chi nhánh     |
| `CASHIER` | Thu ngân              |
| `BARISTA` | Barista               |

### `OrderStatus`

| Value       | Mô tả                                  |
| ----------- | -------------------------------------- |
| `PENDING`   | Đã gửi bếp, chờ pha                    |
| `MAKING`    | Barista đang pha                       |
| `READY`     | Barista hoàn thành pha — sẵn sàng giao |
| `PAID`      | Đã thanh toán                          |
| `CANCELLED` | Đã hủy                                 |

Flow: `PENDING → MAKING → READY → PAID` (hoặc `CANCELLED` trước `PAID`).

**Đã giao món:** field `delivered_at` (không dùng enum `SERVING` — F-12).  
**Legacy:** migration `SERVING` sẽ được gỡ; code refactor theo `delivered_at`.

### `OrderType`

`DINE_IN` | `TAKE_AWAY`

### `TableStatus`

`EMPTY` | `OCCUPIED` | `MAINTENANCE`

### `PaymentMethod`

`CASH` | `BANK_TRANSFER` | `CARD` | `E_WALLET`

### `ShiftStatus`

`OPEN` | `CLOSED`

---

## Indexes (Prisma)

| Model                | Index                                                                     |
| -------------------- | ------------------------------------------------------------------------- |
| `staff`              | `(branch_id, role)`                                                       |
| `tables`             | `(branch_id, status)`, unique `(branch_id, code)`                         |
| `products`           | `(branch_id, category_id)`                                                |
| `product_categories` | unique `(branch_id, slug)`                                                |
| `shifts`             | `(branch_id, status)`                                                     |
| `orders`             | `(branch_id, status)`, `(created_at)`, unique `(branch_id, order_number)` |
| `order_items`        | `(order_id)`                                                              |
| `payments`           | `(order_id)`                                                              |
| `audit_logs`         | `(entity_type, entity_id)`, `(branch_id, created_at)`                     |

---

## Key Constraints

- `orders.order_number`: unique per branch
- `tables.code`: unique per branch (ví dụ `B01`)
- `users.email`: unique globally
- `staff.user_id`: one staff record per user (1:1)
- Money fields: **integer VND** (`Int`) — không dùng decimal
- `order_items`: snapshot `product_name`, `unit_price`, `line_total` tại thời điểm đặt
- Authorization: **NestJS service layer + JWT guards** (không dùng Supabase RLS)

---

## Migrations

| Migration                       | Mô tả                               |
| ------------------------------- | ----------------------------------- |
| `20260628032842_initial_schema` | Schema ban đầu — 11 models, 6 enums |

Chạy: `npm run db:migrate` (từ repo root).

---

## Seed Data (hiện tại)

`apps/api/prisma/seed.ts` tạo:

- 1 branch: **CN Quận 1**

Seed mở rộng (staff, menu, bàn) — Sprint 1+.

---

## Related documents

| Doc                                                  | Content                   |
| ---------------------------------------------------- | ------------------------- |
| [API_CONTRACT.md](API_CONTRACT.md)                   | REST endpoints + DTOs     |
| [database/README.md](../../database/README.md)       | Commands + business rules |
| [schema.prisma](../../apps/api/prisma/schema.prisma) | Prisma source of truth    |
