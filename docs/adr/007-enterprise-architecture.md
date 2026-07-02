# ADR-007: Enterprise Architecture Refactor

**Status:** Accepted  
**Date:** 2026-06-27  
**Supersedes:** Partial updates to ADR-002, ADR-003, ADR-004

## Context

Sprint 0.5 established FE/BE split but left scaffolding gaps: dual type models, stale Supabase docs, flat module structure, compiled JS artifacts in mobile `src/`, no API versioning, permissive CORS.

## Decision

Adopt enterprise monorepo layout for 5-year maintainability:

1. **Mobile:** `app/` (routes) + `features/` (domain) + `shared/` (infra)
2. **API:** `config/` + `common/` + `modules/` with Controller→Service→Repository
3. **Shared package:** `@caffeapp/shared` as FE/BE boundary
4. **API versioning:** `/api/v1`
5. **Infra:** `infra/docker-compose.yml` for local PostgreSQL
6. **Tooling packages:** `@caffeapp/tsconfig`, `@caffeapp/eslint-config`

## Consequences

**Positive:**

- Clear folder responsibilities
- Scales to multiple teams/domains
- Documentation aligned with implementation

**Negative:**

- Import path changes in mobile (mechanical)
- Sprint 1 delayed slightly by structural work
