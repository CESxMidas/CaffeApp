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

## Quy tắc

- Không import chéo feature → feature (dùng `@caffeapp/shared` hoặc `@shared/lib/api`)
- Server state → `hooks/` + TanStack Query
- Local UI state → `@shared/stores/`
