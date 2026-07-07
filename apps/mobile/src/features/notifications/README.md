# Notifications feature

Feed thông báo in-app (FR-E02): đơn READY, cảnh báo hệ thống, sự kiện gán chi nhánh, thông báo bảo mật đổi mật khẩu.

## Public API (`index.ts`)

| Export                        | Mô tả                             |
| ----------------------------- | --------------------------------- |
| `useNotifications`            | Danh sách thông báo (polling 30s) |
| `useUnreadNotificationCount`  | Badge số chưa đọc (polling 15s)   |
| `useMarkNotificationRead`     | Đánh dấu 1 thông báo đã đọc       |
| `useMarkAllNotificationsRead` | Đánh dấu tất cả đã đọc            |
| `NotificationHeaderButton`    | Nút chuông + badge trên header    |

## Screens sử dụng

`(cashier)/notifications.tsx` (được `(manager)`/`(barista)` re-export dùng chung).

> Push notification hệ thống (ngoài app): backlog sau pilot.
