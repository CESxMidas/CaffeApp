# CaffeApp — Demo Minutes Nội Bộ

**Ngày:** YYYY-MM-DD  
**Môi trường:** staging  
**Build mobile:**  
**API commit/tag:**  
**Thiết bị:** tablet model, Android version, phone/emulator  
**WiFi:** tên mạng, vị trí test  
**Người tham gia:** Dev, QA, PO/TPM, Designer

---

## 1. Tóm tắt quyết định

| Mục                | Kết quả    |
| ------------------ | ---------- |
| Go/No-Go sang UAT  | Go / No-Go |
| Lý do chính        |            |
| Critical open      |            |
| High open          |            |
| Workaround đã chốt |            |
| Người approve      |            |

---

## 2. Kết quả 5 luồng demo

| Flow                                    | Kết quả           | Evidence              | Ghi chú |
| --------------------------------------- | ----------------- | --------------------- | ------- |
| 1. Owner login + chọn CN                | Pass / Fail / N/A | Link video/screenshot |         |
| 2. Tablet order bàn + chọn NV + gửi bếp | Pass / Fail / N/A | Link video/screenshot |         |
| 3. Bếp MAKING → READY → Đã giao         | Pass / Fail / N/A | Link video/screenshot |         |
| 4. Thanh toán TM + CK VietQR            | Pass / Fail / N/A | Link video/screenshot |         |
| 5. Manager dashboard doanh thu          | Pass / Fail / N/A | Link video/screenshot |         |

---

## 3. Defect list

Severity:

- S1 / Critical: mất doanh thu, không tạo/thanh toán được đơn, sai tiền, crash blocker.
- S2 / High: flow chính lỗi nhưng có workaround tạm.
- S3 / Medium: ảnh hưởng UX/vận hành nhưng không block pilot.
- S4 / Low: polish/copy nhỏ.

| ID       | Severity | Flow | Mô tả | Steps reproduce | Expected | Actual | Owner | Ticket |
| -------- | -------- | ---- | ----- | --------------- | -------- | ------ | ----- | ------ |
| DEMO-001 | S?       |      |       |                 |          |        |       |        |

---

## 4. UX feedback

| Màn hình | Feedback | Mức độ                | Quyết định                      |
| -------- | -------- | --------------------- | ------------------------------- |
|          |          | Must / Should / Could | Fix Phase 5 / Defer / No change |

---

## 5. Scope gap

| Gap | Liên quan US/Questionnaire | Quyết định                   |
| --- | -------------------------- | ---------------------------- |
|     |                            | Pilot / Phase 5 / Post-pilot |

---

## 6. Copy tiếng Việt

| Màn hình | Copy hiện tại | Đề xuất | Quyết định |
| -------- | ------------- | ------- | ---------- |
|          |               |         |            |

---

## 7. NFR spot-check

| Endpoint          | p50 | p95 | Threshold | Kết quả               |
| ----------------- | --: | --: | --------: | --------------------- |
| GET /tables       |     |     |   < 500ms | Pass / Fail           |
| GET /orders queue |     |     |   < 500ms | Pass / Fail           |
| POST /orders      |     |     |   < 500ms | Pass / Fail / Not run |

Command/log đính kèm:

```text
npm run phase3:nfr
```

---

## 8. Action items

| Action | Owner | Deadline | Phase |
| ------ | ----- | -------- | ----- |
|        |       |          |       |
