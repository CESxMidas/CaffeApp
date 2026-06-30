# CaffeApp — On-call Roster

**Giai đoạn:** Pilot / Go-Live / Hypercare  
**SLA:** S1 4h giờ mở cửa, S2 1 ngày làm việc.

---

## 1. Roster

| Tuần/ngày | Khung giờ | Primary | Backup | Escalation        | Hotline |
| --------- | --------- | ------- | ------ | ----------------- | ------- |
|           |           |         |        | Tech Lead / Owner |         |

---

## 2. Incident workflow

1. Ghi nhận triệu chứng, CN, thiết bị, build.
2. Phân loại S1–S4 theo GO_LIVE_PLAN.
3. S1: mở war room, cập nhật Owner/QL trong 15 phút.
4. Nếu S1 không fix trong SLA hoặc ảnh hưởng tiền/đơn: kích hoạt rollback.
5. Sau xử lý: ghi Pilot Daily Log hoặc Post-mortem.
