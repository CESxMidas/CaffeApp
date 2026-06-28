# Guards

Auth/RBAC guards:

- `jwt-auth.guard.ts` — validate JWT access token; respects `@Public()`
- `roles.guard.ts` — enforce `@Roles(...)` from JWT `StaffRole`; skip when no decorator
- Branch scoping — `common/utils/branch-scope.util.ts` (`resolveBranchScope`, `assertBranchAccess`)

Global guards registered in `app.module.ts` via `APP_GUARD` (JwtAuthGuard then RolesGuard).

Decorators: `@Public()`, `@CurrentUser()`, `@Roles(...StaffRole)`.
