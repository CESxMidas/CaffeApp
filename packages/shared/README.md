# @caffeapp/shared

Shared contracts between mobile and API.

## Structure

```
src/
├── domain/          # Domain helpers (session role mapping)
├── enums/           # Shared enums
├── dto/             # API request/response types
├── constants/       # Labels, VAT, formatters
└── theme/           # Design tokens (mobile)
```

## Imports

```typescript
// Preferred
import { OrderStatus, StaffRole } from '@caffeapp/shared';
import type { LoginRequestDto } from '@caffeapp/shared';

// Subpath exports
import { colors } from '@caffeapp/shared/theme';
import { formatCurrency } from '@caffeapp/shared/constants';
```

## Rules

- **camelCase** for all API JSON fields
- Enums must match Prisma schema (`apps/api/prisma/schema.prisma`)
- No React Native or NestJS imports in this package
