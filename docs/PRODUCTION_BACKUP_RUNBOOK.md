# CaffeApp — Production Backup Runbook

**Phase:** 5/8  
**Mục tiêu:** có backup DB trước production deploy và restore drill.

---

## 1. Backup thủ công trước deploy

Yêu cầu `pg_dump` có trong PATH.

```powershell
$env:DATABASE_URL="postgresql://..."
$env:PG_BACKUP_LABEL="pre-prod-v1.0.0"
npm run db:backup:pg
```

Output mặc định nằm ở `database/backups/` và đã được `.gitignore`.

---

## 2. Backup tự động production

Checklist cloud/managed PostgreSQL:

- [ ] Daily automated backup bật.
- [ ] PITR bật nếu nhà cung cấp hỗ trợ.
- [ ] Retention tối thiểu 30 ngày.
- [ ] Alert backup failed gửi DevOps/Tech Lead.
- [ ] Restore drill chạy ít nhất 1 lần trước Go-Live.

---

## 3. Restore drill

Không restore vào production trực tiếp trong drill.

```powershell
# Ví dụ restore vào DB tạm bằng pg_restore
pg_restore --dbname "postgresql://..." --clean --if-exists "database/backups/<file>.dump"
```

Sau restore:

- [ ] API test DB tạm migrate-compatible.
- [ ] Đếm branch/table/product đúng.
- [ ] Login Owner/staff smoke pass.
- [ ] Ghi thời gian restore và người chịu trách nhiệm.
