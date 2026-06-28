# Infrastructure

| Path                  | Purpose                               |
| --------------------- | ------------------------------------- |
| `docker-compose.yml`  | Local PostgreSQL for development      |
| `../apps/api/prisma/` | Schema + migrations (source of truth) |

## Local PostgreSQL

```bash
docker compose -f infra/docker-compose.yml up -d
```

Connection string:

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/caffeapp?schema=public
```
