# UI States Reference — CaffeApp

Bổ sung cho 28 màn hình chính. Implement theo [DESIGN_SYSTEM.md](../DESIGN_SYSTEM.md).

---

## Loading Skeletons

| File                       | Screen        | Elements                                |
| -------------------------- | ------------- | --------------------------------------- |
| `loading-table-map.md`     | Sơ đồ bàn     | 12 card placeholders 3×4 grid           |
| `loading-menu-list.md`     | Menu          | 6 row placeholders (image + 2 lines)    |
| `loading-order-list.md`    | Danh sách đơn | 5 card placeholders                     |
| `loading-barista-queue.md` | Barista queue | 4 order card placeholders               |
| `loading-dashboard.md`     | Dashboard     | 1 large card + 8 bar chart placeholders |

### loading-table-map

- Grid: 3 columns, gap 12px
- Each cell: 80×80px, borderRadius 12px, shimmer
- Legend row: 3 pill placeholders 60×24px

### loading-menu-list

- Row height: 72px
- Left: 56×56px image placeholder
- Right: 2 text lines (60% + 40% width)

---

## Empty States

| File                     | Screen        | Copy (VI)                              |
| ------------------------ | ------------- | -------------------------------------- |
| `empty-cart.md`          | Giỏ hàng      | "Chưa có món nào" / "Chọn món từ menu" |
| `empty-orders.md`        | Danh sách đơn | "Chưa có đơn đang phục vụ"             |
| `empty-barista-queue.md` | Barista       | "Không có đơn chờ" / "Tất cả đã xử lý" |
| `empty-history.md`       | Lịch sử       | "Chưa có đơn hôm nay"                  |
| `empty-notifications.md` | Thông báo     | "Không có thông báo"                   |
| `empty-search.md`        | Tìm menu      | "Không tìm thấy món"                   |

---

## Error States

| File                    | Screen        | Copy (VI)                            |
| ----------------------- | ------------- | ------------------------------------ |
| `error-login.md`        | Đăng nhập     | "Email hoặc mật khẩu không đúng"     |
| `error-network.md`      | Global banner | "Mất kết nối mạng"                   |
| `error-fetch.md`        | Any list      | "Không tải được dữ liệu" + Thử lại   |
| `error-payment.md`      | Thanh toán TM | "Số tiền không đủ"                   |
| `error-table-locked.md` | Sơ đồ bàn     | "Bàn đã được chọn bởi thu ngân khác" |
| `error-send-kitchen.md` | Giỏ hàng      | "Gửi bếp thất bại. Thử lại."         |

---

## Component State Matrix

```
Component     | Default | Loading | Empty | Error | Success
--------------|---------|---------|-------|-------|--------
Button        |    ✓    |    ✓    |   —   |   —   |    —
TextInput     |    ✓    |    —    |   —   |   ✓   |    —
OrderList     |    ✓    |    ✓    |   ✓   |   ✓   |    —
TableGrid     |    ✓    |    ✓    |   —   |   ✓   |    —
MenuList      |    ✓    |    ✓    |   ✓   |   ✓   |    —
BaristaQueue  |    ✓    |    ✓    |   ✓   |   ✓   |    —
Dashboard     |    ✓    |    ✓    |   —   |   ✓   |    —
PaymentForm   |    ✓    |    ✓    |   —   |   ✓   |    ✓
Toast         |    —    |    —    |   —   |   ✓   |    ✓
```

---

## Figma / Design Handoff Notes

Khi tạo Figma component library, mỗi component cần variants:

- `State=Default | Pressed | Disabled | Loading`
- `Type=Primary | Secondary | Outline | Destructive`
- Dark mode: post-MVP

PNG mockups cho states có thể generate thêm trong `design/states/` khi cần demo stakeholder.
