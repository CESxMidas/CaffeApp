# CaffeApp — Design System

**Version:** 1.0.0-MVP  
**Platform:** React Native (iOS 15+, Android 10+)

---

## 1. Color Tokens

| Token           | Hex       | Usage                                |
| --------------- | --------- | ------------------------------------ |
| `primary`       | `#22C55E` | Primary buttons, active tab, success |
| `primaryDark`   | `#16A34A` | Pressed state                        |
| `primaryLight`  | `#DCFCE7` | Selected background tint             |
| `accent`        | `#F97316` | Priority, warning, table selected    |
| `accentLight`   | `#FFEDD5` | Priority card background             |
| `error`         | `#EF4444` | Error text, destructive              |
| `errorLight`    | `#FEE2E2` | Error banner background              |
| `warning`       | `#F59E0B` | Caution states                       |
| `background`    | `#F9FAFB` | Screen background                    |
| `surface`       | `#FFFFFF` | Cards, inputs                        |
| `border`        | `#E5E7EB` | Dividers, input borders              |
| `text`          | `#111827` | Primary text                         |
| `textSecondary` | `#6B7280` | Labels, captions                     |
| `textMuted`     | `#9CA3AF` | Placeholder, disabled                |
| `tableEmpty`    | `#E5E7EB` | Empty table                          |
| `tableOccupied` | `#22C55E` | Occupied table                       |
| `tableSelected` | `#F97316` | Selected table                       |

---

## 2. Typography

| Token        | Size | Weight | Line Height | Usage                 |
| ------------ | ---- | ------ | ----------- | --------------------- |
| `h1`         | 28px | 700    | 34px        | Screen titles         |
| `h2`         | 22px | 600    | 28px        | Section headers       |
| `h3`         | 18px | 600    | 24px        | Card titles           |
| `body`       | 16px | 400    | 24px        | Body text             |
| `bodyMedium` | 16px | 500    | 24px        | Emphasized body       |
| `caption`    | 14px | 400    | 20px        | Secondary info        |
| `small`      | 12px | 400    | 16px        | Badges, timestamps    |
| `price`      | 16px | 600    | 24px        | Prices (tabular nums) |

**Font family:** System default (SF Pro iOS, Roboto Android)  
**Currency format:** `135.000đ` (vi-VN locale)

---

## 3. Spacing Scale

| Token  | Value |
| ------ | ----- |
| `xs`   | 4px   |
| `sm`   | 8px   |
| `md`   | 12px  |
| `base` | 16px  |
| `lg`   | 24px  |
| `xl`   | 32px  |
| `2xl`  | 48px  |

**Screen padding:** 16px horizontal  
**Card padding:** 16px  
**Grid gap:** 12px

---

## 4. Border Radius

| Token  | Value  | Usage               |
| ------ | ------ | ------------------- |
| `sm`   | 8px    | Inputs, badges      |
| `md`   | 12px   | Cards, buttons      |
| `lg`   | 16px   | Modals, large cards |
| `full` | 9999px | Pills, avatars      |

---

## 5. Shadows

```typescript
// Card shadow (iOS)
shadowColor: '#000',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.06,
shadowRadius: 8,
// Android
elevation: 2,
```

---

## 6. Component States

### 6.1 Button

| State       | Background  | Text          | Border        |
| ----------- | ----------- | ------------- | ------------- |
| Default     | `#22C55E`   | `#FFFFFF`     | none          |
| Pressed     | `#16A34A`   | `#FFFFFF`     | none          |
| Disabled    | `#E5E7EB`   | `#9CA3AF`     | none          |
| Loading     | `#22C55E`   | spinner white | none          |
| Outline     | transparent | `#22C55E`     | 1px `#22C55E` |
| Destructive | `#EF4444`   | `#FFFFFF`     | none          |

**Min height:** 48px (touch target ≥ 44px)

### 6.2 Input

| State    | Border        | Background | Label     |
| -------- | ------------- | ---------- | --------- |
| Default  | `#E5E7EB`     | `#FFFFFF`  | `#6B7280` |
| Focused  | `#22C55E` 2px | `#FFFFFF`  | `#22C55E` |
| Error    | `#EF4444` 2px | `#FEE2E2`  | `#EF4444` |
| Disabled | `#E5E7EB`     | `#F9FAFB`  | `#9CA3AF` |

### 6.3 Table Card

| State       | Background | Border               | Text                    |
| ----------- | ---------- | -------------------- | ----------------------- |
| Empty       | `#E5E7EB`  | none                 | `#6B7280`               |
| Occupied    | `#DCFCE7`  | 2px `#22C55E`        | `#16A34A`               |
| Selected    | `#FFEDD5`  | 2px `#F97316`        | `#EA580C`               |
| Maintenance | `#F3F4F6`  | 2px dashed `#9CA3AF` | `#9CA3AF` + wrench icon |

---

## 7. UI States — Screen Level

Reference mockups: `design/states/`

### 7.1 Loading (Skeleton)

Áp dụng khi fetch data lần đầu.

```
┌─────────────────────────┐
│ ░░░░░░░░  (shimmer)     │  ← Header skeleton
│ ┌─────┐ ┌─────┐        │
│ │░░░░░│ │░░░░░│        │  ← Card skeletons
│ └─────┘ └─────┘        │
│ ┌──────────────────┐   │
│ │░░░░░░░░░░░░░░░░░░│   │  ← List row skeleton × 5
│ └──────────────────┘   │
└─────────────────────────┘
```

**Specs:**

- Shimmer animation: 1.2s loop, `#E5E7EB` → `#F3F4F6`
- Skeleton blocks: `borderRadius: 8px`
- Show skeleton nếu loading > 200ms (tránh flash)

**Screens cần skeleton:**

- `06-so-do-ban` — grid 12 table cards
- `07-chon-mon` — list 6 rows
- `14-danh-sach-don` — list 5 rows
- `16-barista-don-cho` — list 4 order cards
- `20-dashboard` — revenue card + chart bars

---

### 7.2 Empty State

Hiện khi list/data rỗng (không phải lỗi).

```
┌─────────────────────────┐
│                         │
│      [illustration]     │  ← 120×120px, muted green
│                         │
│   Chưa có đơn nào      │  ← h3, text
│   Đơn mới sẽ hiện ở đây │  ← caption, textSecondary
│                         │
│   [ Tạo đơn mới ]       │  ← primary button (if applicable)
│                         │
└─────────────────────────┘
```

| Screen            | Title               | Subtitle                     | CTA      |
| ----------------- | ------------------- | ---------------------------- | -------- |
| Giỏ hàng          | Chưa có món nào     | Chọn món từ menu để bắt đầu  | Chọn món |
| Đơn chờ (Barista) | Không có đơn chờ    | Tất cả đã xử lý xong         | —        |
| Lịch sử đơn       | Chưa có đơn hôm nay | Đơn hoàn thành sẽ hiện ở đây | —        |
| Thông báo         | Không có thông báo  | Bạn sẽ nhận cập nhật tại đây | —        |
| Tìm kiếm menu     | Không tìm thấy món  | Thử từ khóa khác             | —        |

---

### 7.3 Error State

#### Inline field error (form)

- Border đỏ + message dưới input: `"Vui lòng nhập email"`
- Icon ⚠ 16px bên trái message

#### Toast (transient)

- Position: bottom, above tab bar
- Background: `#1F2937`, text white
- Duration: 3s auto-dismiss
- Examples: "Gửi bếp thất bại", "Thanh toán không thành công"

#### Error banner (persistent — offline)

```
┌─────────────────────────┐
│ ⚠ Mất kết nối mạng      │  ← errorLight bg, error text
│   Một số tính năng bị   │
│   hạn chế               │
└─────────────────────────┘
```

#### Full-screen error (fetch failed)

```
┌─────────────────────────┐
│                         │
│      [error icon]       │
│   Không tải được dữ liệu│
│   Vui lòng thử lại      │
│   [ Thử lại ]           │  ← outline button
│                         │
└─────────────────────────┘
```

| Screen        | Error scenario      | Type                      |
| ------------- | ------------------- | ------------------------- |
| Login         | Sai MK              | Inline field              |
| Login         | Server 500          | Toast                     |
| Sơ đồ bàn     | API fail            | Full-screen + retry       |
| Gửi bếp       | Network fail        | Toast + keep cart         |
| Thanh toán    | Insufficient cash   | Inline below input        |
| Barista queue | Realtime disconnect | Banner + polling fallback |

---

### 7.4 Success State

- Toast: green left border, "Đơn đã gửi vào bếp"
- Full-screen (barista complete): checkmark animation + "Đơn #1024 hoàn thành"

---

## 8. Icons

**Library:** `@expo/vector-icons` — Ionicons (outline style)

| Context      | Icon                    |
| ------------ | ----------------------- |
| Back         | `chevron-back`          |
| Add          | `add-circle`            |
| Cart         | `cart-outline`          |
| Table        | `grid-outline`          |
| Coffee       | `cafe-outline`          |
| Notification | `notifications-outline` |
| Settings     | `settings-outline`      |
| Error        | `alert-circle-outline`  |
| Success      | `checkmark-circle`      |
| Offline      | `cloud-offline-outline` |

**Size:** 24px default, 20px inline, 32px tab bar

---

## 9. Motion

| Animation        | Duration | Easing      |
| ---------------- | -------- | ----------- |
| Button press     | 150ms    | ease-out    |
| Modal slide up   | 300ms    | spring      |
| Toast enter/exit | 250ms    | ease-in-out |
| Skeleton shimmer | 1200ms   | linear loop |
| Tab switch       | 200ms    | ease        |

**Reduced motion:** Respect `AccessibilityInfo.isReduceMotionEnabled()` — skip shimmer, use static gray.

---

## 10. Implementation Map

| Design token file           | Code location                                   |
| --------------------------- | ----------------------------------------------- |
| Colors, spacing, typography | `packages/shared/src/theme/tokens.ts`           |
| Button, Input, Card         | `apps/mobile/src/components/ui/`                |
| Skeleton                    | `apps/mobile/src/components/ui/Skeleton.tsx`    |
| EmptyState                  | `apps/mobile/src/components/ui/EmptyState.tsx`  |
| ErrorBanner                 | `apps/mobile/src/components/ui/ErrorBanner.tsx` |
| Toast                       | `apps/mobile/src/components/ui/Toast.tsx`       |
