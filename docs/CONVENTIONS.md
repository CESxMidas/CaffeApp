# CaffeApp — Project Conventions

Chuẩn hóa monorepo sau kiến trúc enterprise. **Không thêm feature** — chỉ quy ước.

---

## 1. Folder tree

```
apps/mobile/src/
  app/              # Expo Router — routes only
  features/         # Domain logic (hooks, types)
  shared/           # Cross-cutting infra

apps/api/src/
  config/           # Env + configuration
  common/           # Prisma, filters, guards
  modules/          # Domain bounded contexts

packages/
  shared/           # FE/BE contracts
  tsconfig/         # Shared TS configs
  eslint-config/    # Shared ESLint configs
  prettier-config/  # Shared Prettier config
```

---

## 2. Path aliases

### Mobile (`apps/mobile/tsconfig.json`)

| Alias                | Maps to                 |
| -------------------- | ----------------------- |
| `@app/*`             | `src/app/*`             |
| `@shared/*`          | `src/shared/*`          |
| `@features/*`        | `src/features/*`        |
| `@caffeapp/shared`   | `packages/shared`       |
| `@caffeapp/shared/*` | `packages/shared/src/*` |

### API (`apps/api/tsconfig.json`)

| Alias        | Maps to         |
| ------------ | --------------- |
| `@/*`        | `src/*`         |
| `@config/*`  | `src/config/*`  |
| `@common/*`  | `src/common/*`  |
| `@modules/*` | `src/modules/*` |

---

## 3. Import rules

```typescript
// ✅ Mobile — UI from shared
import { Button } from '@shared/components/ui';
import { useSessionStore } from '@shared/stores/session';
import { authService } from '@shared/lib/api';

// ✅ Mobile — contracts from monorepo package
import { OrderStatus } from '@caffeapp/shared/contracts';
import { colors } from '@caffeapp/shared/theme';

// ✅ API — internal modules
import { PrismaModule } from '@common/prisma/prisma.module';
import { AuthModule } from '@modules/auth/auth.module';

// ❌ Never
import { PrismaClient } from '@prisma/client'; // in mobile
import { something } from '../../../common/...'; // deep relative in API
```

---

## 4. Packages

| Package                     | Purpose                                    |
| --------------------------- | ------------------------------------------ |
| `@caffeapp/shared`          | Enums, DTOs, contracts, theme              |
| `@caffeapp/tsconfig`        | `base`, `nestjs`, `react-native`, `shared` |
| `@caffeapp/eslint-config`   | ESLint flat configs                        |
| `@caffeapp/prettier-config` | Prettier rules                             |

---

## 5. Scripts (root)

| Command               | Description                            |
| --------------------- | -------------------------------------- |
| `npm run validate`    | format:check + lint + typecheck        |
| `npm run format`      | Prettier write all                     |
| `npm run lint`        | ESLint all workspaces                  |
| `npm run db:generate` | Prisma generate (root → api workspace) |
| `npm run db:migrate`  | Prisma migrate dev                     |
| `npm run db:seed`     | Seed database                          |

Trong `apps/api`: `npm run start:dev` (API), `npm run db:studio` (Prisma Studio).

---

## 6. Environment

- **Mobile:** `apps/mobile/.env` — only `EXPO_PUBLIC_*`
- **API:** `apps/api/.env` — `DATABASE_URL`, `JWT_*`, `CORS_ORIGINS`
- Never commit `.env` files

---

## 7. Feature module template

See `apps/mobile/src/features/README.md`

---

## 8. Shared package exports

```typescript
import { OrderStatus } from '@caffeapp/shared/enums';
import type { OrderDto } from '@caffeapp/shared/dto';
import { ROLE_LABELS } from '@caffeapp/shared/constants';
import { colors } from '@caffeapp/shared/theme';
```

Canonical boundary: `@caffeapp/shared/contracts`
