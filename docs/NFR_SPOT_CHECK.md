# CaffeApp — Phase 3 NFR Spot-Check

**Mục tiêu:** đo latency API staging trên WiFi mô phỏng quán, p95 < 500ms cho luồng pilot.  
**Liên quan:** GO_LIVE_PLAN TASK-P3-04, Questionnaire H-12.  
**Tool repo-side:** `scripts/nfr-spot-check.mjs`.

---

## 1. Endpoint đo

| GO_LIVE_PLAN      | Endpoint thực tế hiện tại                        | Ghi chú                                 |
| ----------------- | ------------------------------------------------ | --------------------------------------- |
| GET /tables       | `GET /api/v1/tables?branchId=...`                | Sơ đồ bàn                               |
| GET /orders/queue | `GET /api/v1/orders?status=PENDING,MAKING,READY` | App hiện dùng list orders làm queue bếp |
| POST /orders      | `POST /api/v1/orders`                            | Opt-in vì tạo data thật                 |

---

## 2. Chạy read-only GET spot-check

```powershell
$env:API_BASE_URL="https://staging-api.example.com"
$env:API_EMAIL="station.q1@caffe.app"
$env:API_PASSWORD="***"
$env:BRANCH_ID="a0000000-0000-0000-0000-000000000001"
$env:NFR_ITERATIONS="100"
npm run phase3:nfr
```

Có thể thay `API_EMAIL`/`API_PASSWORD` bằng token sẵn có:

```powershell
$env:API_TOKEN="eyJ..."
npm run phase3:nfr
```

---

## 3. Chạy kèm POST /orders

Mặc định script không gọi POST để tránh tạo nhiều đơn staging. Chỉ bật khi demo owner/dev đã đồng ý:

```powershell
$env:NFR_CREATE_ORDER="true"
$env:NFR_CLEANUP_ORDERS="true"
$env:NFR_POST_ITERATIONS="100"
npm run phase3:nfr
```

Ghi chú:

- POST dùng `TAKE_AWAY` để tránh lock cùng một bàn nhiều lần.
- Nếu không set `PRODUCT_ID`, script tự lấy món available đầu tiên của CN.
- `NFR_CLEANUP_ORDERS=true` sẽ gọi cancel các order vừa tạo sau khi đo.
- Audit/notification vẫn có thể phát sinh trên staging; không chạy trên production.

---

## 4. Acceptance

| Metric                | Pass                    |
| --------------------- | ----------------------- |
| p95 GET /tables       | < 500ms                 |
| p95 GET /orders queue | < 500ms                 |
| p95 POST /orders      | < 500ms nếu đã bật POST |
| Error rate            | 0 lỗi HTTP/timeout      |

Nếu endpoint nào > 500ms hoặc có lỗi HTTP/timeout, tạo ticket optimize Phase 5 với log command và bảng kết quả.

---

## 5. Result template

| Ngày | WiFi/vị trí | API build | Mobile build | Người chạy |
| ---- | ----------- | --------- | ------------ | ---------- |
|      |             |           |              |            |

| Endpoint          | Requests |  OK | Failed | p50 | p95 | Result |
| ----------------- | -------: | --: | -----: | --: | --: | ------ |
| GET /tables       |          |     |        |     |     |        |
| GET /orders queue |          |     |        |     |     |        |
| POST /orders      |          |     |        |     |     |        |

Kết luận:

- Pass/Fail:
- Ticket optimize nếu fail:
- Ghi chú mạng/thiết bị:
