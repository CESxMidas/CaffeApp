# Feature modules

Mỗi feature là một bounded context trên mobile. **Routes** nằm ở `src/app/`; logic nằm ở đây.

## Cấu trúc chuẩn

```
features/<name>/
├── README.md       # Mô tả feature + ownership
├── index.ts        # Public API của feature
├── hooks/          # TanStack Query hooks
├── use-cases/      # Orchestration (optional, Sprint 1+)
├── api/            # Feature-specific API wrappers (optional)
└── types/          # Feature-only types (optional)
```

## Danh sách feature (đồng bộ với code)

| Feature         | Vai trò                                                                              |
| --------------- | ------------------------------------------------------------------------------------ |
| `auth`          | Đăng nhập, chọn chi nhánh (Owner), đổi mật khẩu qua mã email                         |
| `orders`        | Domain đơn hàng dùng chung: bàn, menu, giỏ, tạo đơn, thanh toán, gộp/tách/chuyển bàn |
| `barista`       | Queue bếp, chi tiết pha chế, timer, hoàn thành món                                   |
| `manager`       | Dashboard, báo cáo doanh thu, ca làm việc, CRUD menu                                 |
| `staff`         | Danh sách NV, gán chi nhánh, StaffPicker cho tablet trạm                             |
| `notifications` | Feed thông báo in-app + badge chưa đọc                                               |

> **Lưu ý:** Không có feature `cashier` riêng — màn hình thu ngân (`src/app/(cashier)/`)
> dùng chung domain logic từ `orders` (quyết định hợp nhất từ Sprint 2).

## Quy tắc

- Không import chéo feature → feature (dùng `@caffeapp/shared` hoặc `@shared/lib/api`)
- Server state → `hooks/` + TanStack Query
- Local UI state → `@shared/stores/`
