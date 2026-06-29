# CaffeApp — Prompt giao việc FULL (theo Questionnaire)

**Nguồn:** [STAKEHOLDER_QUESTIONNAIRE.md](STAKEHOLDER_QUESTIONNAIRE.md) · [GO_LIVE_PLAN.md](GO_LIVE_PLAN.md)  
**Phiên bản:** 2.0.0 · **Sinh:** 2026-06-29  
**Tổng task:** 183 (A→I + GAP)

> Copy block ```text``` vào Cursor Agent / giao dev. Mỗi ID = 1 ticket.

---

## Master Index

| ID | P | Sprint | Loại | Giao cho | Map | Status |
| -- | - | ------ | ---- | -------- | --- | ------ |
| [A-01](#task-q-a-01) | P0 | 0 | seed | Backend/TPM | TASK-P2-06 | ⏳ |
| [A-02](#task-q-a-02) | P0 | 2 | code | Backend | — | ⏳ |
| [A-03](#task-q-a-03) | P0 | 2 | seed | Backend | TASK-P2-06 | ⏳ |
| [A-04](#task-q-a-04) | P1 | 5 | code | Backend | — | ⏳ |
| [A-05](#task-q-a-05) | P1 | 6 | ops | TPM | — | ⏳ |
| [A-06](#task-q-a-06) | P0 | 2 | seed | Backend | TASK-P2-06 | ⏳ |
| [A-07](#task-q-a-07) | P1 | — | defer | — | — | ⏳ |
| [A-08](#task-q-a-08) | P2 | — | defer | — | — | ⏳ |
| [A-09](#task-q-a-09) | P0 | 2 | code | Mobile | TASK-P2-03 | ✅ |
| [A-10](#task-q-a-10) | P1 | 2 | code | Mobile | — | ⏳ |
| [A-11](#task-q-a-11) | P0 | — | ops | TPM | — | ⏳ |
| [A-12](#task-q-a-12) | P1 | — | doc | Designer | GAP-08 | ⏳ |
| [A-13](#task-q-a-13) | P1 | — | ops | TPM | — | ⏳ |
| [B-01](#task-q-b-01) | P0 | 5 | code | Backend+Mobile | — | ⏳ |
| [B-02](#task-q-b-02) | P0 | 5 | code | Backend | — | ⏳ |
| [B-03](#task-q-b-03) | P1 | 5 | code | Full-stack | — | ⏳ |
| [B-04](#task-q-b-04) | P0 | 5 | code | Backend | — | ⏳ |
| [B-05](#task-q-b-05) | P0 | 5 | code | Backend | GAP-06 | ⏳ |
| [B-06](#task-q-b-06) | P0 | 5 | code | Backend | — | ⏳ |
| [B-07](#task-q-b-07) | P1 | 5 | code | Backend | — | ⏳ |
| [B-08](#task-q-b-08) | P1 | 5 | code | Mobile | — | ⏳ |
| [B-09](#task-q-b-09) | P2 | 2 | code | Mobile | TASK-P2-03b | ✅ |
| [B-10](#task-q-b-10) | P2 | — | defer | — | — | ⏳ |
| [B-11](#task-q-b-11) | P0 | 5 | code | Mobile | — | ⏳ |
| [B-12](#task-q-b-12) | P2 | — | defer | — | — | ⏳ |
| [B-13](#task-q-b-13) | P0 | — | ops | TPM | — | ⏳ |
| [B-14](#task-q-b-14) | P0 | 2 | code | Full-stack | — | ⏳ |
| [B-15](#task-q-b-15) | P1 | 2 | code | Mobile+API | TASK-P2-03 | ✅ |
| [B-16](#task-q-b-16) | P1 | 2 | code | Backend | TASK-P2-01 | ✅ |
| [B-17](#task-q-b-17) | P2 | 5 | code | Backend | — | ⏳ |
| [B-18](#task-q-b-18) | P0 | 2 | code | Mobile | — | ⏳ |
| [B-19](#task-q-b-19) | P1 | — | code | Mobile | — | ⏳ |
| [B-20](#task-q-b-20) | P2 | — | defer | — | — | ⏳ |
| [B-21](#task-q-b-21) | P1 | 4 | code | Mobile | TASK-P2-11 | ⏳ |
| [B-22](#task-q-b-22) | P1 | 5 | code | Backend | — | ⏳ |
| [B-23](#task-q-b-23) | P2 | 5 | code | Mobile | — | ⏳ |
| [B-24](#task-q-b-24) | P1 | 3 | code | Full-stack | TASK-P2-10 | ⏳ |
| [B-25](#task-q-b-25) | P0 | 2 | code | Mobile | — | ⏳ |
| [B-26](#task-q-b-26) | P0 | 2 | code | Backend | — | ⏳ |
| [B-27](#task-q-b-27) | P1 | 6 | code | Full-stack | — | ⏳ |
| [B-28](#task-q-b-28) | P1 | 2 | code | Full-stack | — | ⏳ |
| [B-29](#task-q-b-29) | P0 | 3 | code | Full-stack | — | ⏳ |
| [B-30](#task-q-b-30) | P2 | 6 | code | Full-stack | — | ⏳ |
| [B-31](#task-q-b-31) | P2 | 6 | code | Full-stack | — | ⏳ |
| [B-32](#task-q-b-32) | P1 | 2 | code | Full-stack | — | ⏳ |
| [B-33](#task-q-b-33) | P1 | 2 | code | Full-stack | TASK-P2-02 | ✅ |
| [C-01](#task-q-c-01) | P0 | 1 | code | Full-stack | — | ⏳ |
| [C-02](#task-q-c-02) | P1 | 5 | code | Full-stack | — | ⏳ |
| [C-03](#task-q-c-03) | P2 | 5 | code | Backend | — | ⏳ |
| [C-04](#task-q-c-04) | P0 | 1 | code | Full-stack | — | ⏳ |
| [C-05](#task-q-c-05) | P0 | 1 | code | Backend | — | ⏳ |
| [C-06](#task-q-c-06) | P2 | 6 | code | Backend | — | ⏳ |
| [C-07](#task-q-c-07) | P2 | 6 | code | Mobile | — | ⏳ |
| [C-08](#task-q-c-08) | P0 | 1 | code | Mobile | TASK-P2-01 | ✅ |
| [C-09](#task-q-c-09) | P1 | 1 | code | Mobile | — | ⏳ |
| [C-10](#task-q-c-10) | P1 | 5 | code | Full-stack | — | ⏳ |
| [C-11](#task-q-c-11) | P0 | 1 | code | Mobile | TASK-P2-01 | ✅ |
| [C-12](#task-q-c-12) | P2 | — | defer | — | — | ⏳ |
| [C-13](#task-q-c-13) | P1 | 1 | code | Mobile | — | ⏳ |
| [C-14](#task-q-c-14) | P1 | 2 | code | Mobile | TASK-P2-02 | ✅ |
| [C-15](#task-q-c-15) | P0 | 2 | qa | QA | TASK-P2-05 | ⏳ |
| [D-01](#task-q-d-01) | P0 | 2 | code | Mobile | — | ⏳ |
| [D-02](#task-q-d-02) | P1 | 2 | code | Mobile | — | ⏳ |
| [D-03](#task-q-d-03) | P1 | 2 | code | Mobile | — | ⏳ |
| [D-04](#task-q-d-04) | P2 | 2 | code | Backend | — | ⏳ |
| [D-05](#task-q-d-05) | P0 | 2 | seed | Backend | TASK-P2-06 | ⏳ |
| [D-06](#task-q-d-06) | P0 | 2 | code | Mobile | — | ⏳ |
| [D-07](#task-q-d-07) | P0 | 2 | code | Mobile | — | ⏳ |
| [D-08](#task-q-d-08) | P0 | 2 | code | Backend | — | ⏳ |
| [D-09](#task-q-d-09) | P1 | 2 | code | Mobile | TASK-P2-09 | ⏳ |
| [D-10](#task-q-d-10) | P1 | 2 | code | Mobile | — | ⏳ |
| [D-11](#task-q-d-11) | P2 | — | defer | — | — | ⏳ |
| [D-12](#task-q-d-12) | P1 | 2 | code | Full-stack | — | ⏳ |
| [D-13](#task-q-d-13) | P0 | 2 | seed | Backend | TASK-P2-06 | ⏳ |
| [D-14](#task-q-d-14) | P1 | 2 | code | Mobile | — | ⏳ |
| [D-15](#task-q-d-15) | P1 | 2 | code | Mobile | — | ⏳ |
| [D-16](#task-q-d-16) | P0 | 2 | code | Full-stack | — | ⏳ |
| [D-17](#task-q-d-17) | P0 | 2 | code | Full-stack | TASK-P2-04 | ✅ |
| [D-18](#task-q-d-18) | P2 | — | defer | — | — | ⏳ |
| [D-19](#task-q-d-19) | P1 | 2 | seed | Backend | — | ⏳ |
| [D-20](#task-q-d-20) | P2 | — | defer | — | — | ⏳ |
| [D-21](#task-q-d-21) | P0 | 2 | code | Full-stack | — | ⏳ |
| [D-22](#task-q-d-22) | P0 | 2 | code | Backend | — | ⏳ |
| [D-23](#task-q-d-23) | P1 | 2 | code | Full-stack | — | ⏳ |
| [D-24](#task-q-d-24) | P1 | 2 | code | Mobile | — | ⏳ |
| [D-25](#task-q-d-25) | P1 | 2 | code | Full-stack | — | ⏳ |
| [D-26](#task-q-d-26) | P1 | 2 | code | Mobile | — | ⏳ |
| [D-27](#task-q-d-27) | P0 | 2 | code | Backend | — | ⏳ |
| [D-28](#task-q-d-28) | P0 | 2 | code | Full-stack | — | ⏳ |
| [D-29](#task-q-d-29) | P1 | 2 | code | Mobile | — | ⏳ |
| [D-30](#task-q-d-30) | P1 | 2 | code | Mobile | — | ⏳ |
| [D-31](#task-q-d-31) | P1 | 2 | code | Mobile | — | ⏳ |
| [D-32](#task-q-d-32) | P1 | 2 | code | Full-stack | — | ⏳ |
| [D-33](#task-q-d-33) | P1 | 2 | code | Mobile | TASK-P2-03b | ✅ |
| [E-01](#task-q-e-01) | P0 | 3 | code | Full-stack | TASK-P2-10 | ⏳ |
| [E-02](#task-q-e-02) | P1 | 3 | code | Mobile | — | ⏳ |
| [E-03](#task-q-e-03) | P2 | 3 | code | Mobile | — | ⏳ |
| [E-04](#task-q-e-04) | P0 | 3 | seed | Backend | — | ⏳ |
| [E-05](#task-q-e-05) | P0 | 3 | code | Full-stack | — | ⏳ |
| [E-06](#task-q-e-06) | P1 | 3 | code | Mobile | — | ⏳ |
| [E-07](#task-q-e-07) | P1 | — | ops | Ops | — | ⏳ |
| [E-08](#task-q-e-08) | P1 | 6 | defer | Mobile | — | ⏳ |
| [E-09](#task-q-e-09) | P1 | 3 | code | Full-stack | — | ⏳ |
| [E-10](#task-q-e-10) | P0 | 3 | code | Backend | — | ⏳ |
| [E-11](#task-q-e-11) | P2 | 6 | code | Backend | — | ⏳ |
| [E-12](#task-q-e-12) | P0 | 3 | code | Mobile | — | ⏳ |
| [E-13](#task-q-e-13) | P0 | 3 | code | Mobile | — | ⏳ |
| [E-14](#task-q-e-14) | P1 | 3 | code | Mobile | — | ⏳ |
| [E-15](#task-q-e-15) | P1 | 3 | code | Mobile | — | ⏳ |
| [E-16](#task-q-e-16) | P0 | 3 | code | Mobile | — | ⏳ |
| [E-17](#task-q-e-17) | P1 | 3 | code | Mobile | — | ⏳ |
| [E-18](#task-q-e-18) | P2 | 6 | defer | Mobile | — | ⏳ |
| [F-01](#task-q-f-01) | P0 | 4 | code | Full-stack | TASK-P2-11 | ⏳ |
| [F-02](#task-q-f-02) | P0 | 4 | code | Backend | — | ⏳ |
| [F-03](#task-q-f-03) | P0 | 4 | code | Mobile | — | ⏳ |
| [F-04](#task-q-f-04) | P1 | 4 | code | Mobile | — | ⏳ |
| [F-05](#task-q-f-05) | P1 | 4 | code | Mobile | — | ⏳ |
| [F-06](#task-q-f-06) | P1 | 2 | code | Mobile | TASK-P2-03b | ✅ |
| [F-07](#task-q-f-07) | P1 | 4 | code | Mobile | — | ⏳ |
| [F-08](#task-q-f-08) | P1 | 4 | code | Mobile | — | ⏳ |
| [F-09](#task-q-f-09) | P0 | 4 | code | Backend | — | ⏳ |
| [F-10](#task-q-f-10) | P1 | 4 | code | Mobile | — | ⏳ |
| [F-11](#task-q-f-11) | P1 | 4 | code | Mobile | — | ⏳ |
| [F-12](#task-q-f-12) | P0 | 2 | code | Full-stack | TASK-P2-02 | ✅ |
| [F-13](#task-q-f-13) | P0 | 6 | code | Mobile | — | ⏳ |
| [F-14](#task-q-f-14) | P1 | 6 | code | Full-stack | — | ⏳ |
| [F-15](#task-q-f-15) | P1 | 4 | code | Backend | — | ⏳ |
| [F-16](#task-q-f-16) | P0 | 4 | code | Mobile | — | ⏳ |
| [F-17](#task-q-f-17) | P1 | — | defer | — | — | ⏳ |
| [G-01](#task-q-g-01) | P0 | 5 | code | Full-stack | — | ⏳ |
| [G-02](#task-q-g-02) | P1 | 5 | code | Backend | — | ⏳ |
| [G-03](#task-q-g-03) | P1 | 5 | code | Backend | — | ⏳ |
| [G-04](#task-q-g-04) | P1 | 5 | code | Mobile | — | ⏳ |
| [G-05](#task-q-g-05) | P1 | 5 | code | Mobile | — | ⏳ |
| [G-06](#task-q-g-06) | P0 | 5 | code | Backend | — | ⏳ |
| [G-07](#task-q-g-07) | P1 | 5 | code | Mobile | — | ⏳ |
| [G-08](#task-q-g-08) | P1 | 5 | code | Mobile | — | ⏳ |
| [G-09](#task-q-g-09) | P0 | 5 | code | Full-stack | — | ⏳ |
| [G-10](#task-q-g-10) | P1 | 5 | code | Backend | — | ⏳ |
| [G-11](#task-q-g-11) | P2 | — | defer | — | — | ⏳ |
| [G-12](#task-q-g-12) | P2 | — | defer | — | — | ⏳ |
| [G-13](#task-q-g-13) | P1 | 5 | code | Backend | — | ⏳ |
| [G-14](#task-q-g-14) | P1 | 5 | code | Full-stack | — | ⏳ |
| [G-15](#task-q-g-15) | P0 | 5 | code | Full-stack | — | ⏳ |
| [G-16](#task-q-g-16) | P1 | 6 | code | Full-stack | — | ⏳ |
| [G-17](#task-q-g-17) | P2 | — | defer | — | — | ⏳ |
| [G-18](#task-q-g-18) | P1 | 5 | code | Mobile | — | ⏳ |
| [G-19](#task-q-g-19) | P1 | 5 | code | Backend | — | ⏳ |
| [G-20](#task-q-g-20) | P0 | 5 | code | Backend | — | ⏳ |
| [G-21](#task-q-g-21) | P1 | — | doc | TPM | — | ⏳ |
| [H-01](#task-q-h-01) | P0 | 6 | code | Full-stack | — | ⏳ |
| [H-02](#task-q-h-02) | P1 | 6 | code | Mobile | — | ⏳ |
| [H-03](#task-q-h-03) | P1 | 6 | ops | DevOps | — | ⏳ |
| [H-04](#task-q-h-04) | P1 | 6 | code | Full-stack | — | ⏳ |
| [H-05](#task-q-h-05) | P2 | 6 | code | Mobile | — | ⏳ |
| [H-06](#task-q-h-06) | P2 | 6 | code | Mobile | — | ⏳ |
| [H-07](#task-q-h-07) | P2 | 6 | code | Mobile | — | ⏳ |
| [H-08](#task-q-h-08) | P0 | — | ops | PO/TPM | — | ⏳ |
| [H-09](#task-q-h-09) | P0 | 6 | qa | QA | TASK-P4-03 | ⏳ |
| [H-10](#task-q-h-10) | P1 | — | ops | Dev on-call | — | ⏳ |
| [H-11](#task-q-h-11) | P1 | — | ops | Owner | — | ⏳ |
| [H-12](#task-q-h-12) | P1 | — | qa | QA | TASK-P3-04 | ⏳ |
| [H-13](#task-q-h-13) | P1 | — | doc | Dev | TASK-P4-06 | ⏳ |
| [I-01](#task-q-i-01) | P0 | 3 | ops | DevOps | TASK-P2-08 | ⏳ |
| [I-02](#task-q-i-02) | P0 | 5 | ops | Mobile/DevOps | — | ⏳ |
| [I-03](#task-q-i-03) | P1 | 2 | seed | Backend | TASK-P2-06 | ✅ |
| [I-04](#task-q-i-04) | P2 | 3 | code | Tech Lead | GAP-07 | ⏳ |
| [I-05](#task-q-i-05) | P1 | — | doc | Designer | GAP-08 | ⏳ |
| [I-06](#task-q-i-06) | P1 | — | code | Mobile | — | ⏳ |
| [I-07](#task-q-i-07) | P2 | — | defer | — | — | ⏳ |
| [I-08](#task-q-i-08) | P2 | — | code | Mobile | — | ⏳ |
| [I-09](#task-q-i-09) | P2 | 5 | ops | DevOps | TASK-P8-02 | ⏳ |
| [GAP-01](#task-q-gap-01) | P0 | — | doc | Tech Lead | — | ✅ |
| [GAP-02](#task-q-gap-02) | P0 | — | doc | — | — | ✅ |
| [GAP-03](#task-q-gap-03) | P0 | — | doc | — | TASK-P2-04 | ✅ |
| [GAP-04](#task-q-gap-04) | P2 | 6 | code | Full-stack | — | ⏳ |
| [GAP-05](#task-q-gap-05) | P0 | — | code | Full-stack | TASK-P2-02 | ✅ |
| [GAP-06](#task-q-gap-06) | P0 | 5 | code | Backend | — | ⏳ |
| [GAP-07](#task-q-gap-07) | P2 | — | code | Tech Lead | I-04 | ⏳ |
| [GAP-08](#task-q-gap-08) | P1 | — | doc | Designer | — | ⏳ |
| [GAP-09](#task-q-gap-09) | P0 | — | doc | — | — | ✅ |
| [GAP-10](#task-q-gap-10) | P1 | — | doc | — | — | ✅ |
| [GAP-11](#task-q-gap-11) | P0 | — | code | Mobile | TASK-P2-03b | ✅ |

---

## Prompt chi tiết theo ID

### TASK-Q-A-01 {#task-q-a-01}

| | |
| --- | --- |
| **Giao cho** | Backend/TPM |
| **Ưu tiên** | P0 |
| **Sprint** | 0 |
| **Loại** | seed |
| **Map** | TASK-P2-06 |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md A-01.

ID: A-01 · Phần A · Ưu tiên P0 · Sprint 0
TIÊU ĐỀ: CN pilot Quận 1
QUYẾT ĐỊNH ĐÃ CHỐT: Quán thật CN1 Quận 1; địa chỉ prod chờ chủ quán; dev seed 123 Nguyễn Huệ Q1
LOẠI VIỆC: SEED — Cập nhật seed/import data (prisma/seed, staging JSON). Không hard-code trong app.
TASK LIÊN QUAN: TASK-P2-06

NHIỆM VỤ:
1. Đọc A-01 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Branch seed có tên CN Quận 1
2. GO_LIVE_PLAN cập nhật địa chỉ khi chủ quán chốt

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[A-01] CN pilot Quận 1" + mô tả file đã sửa.
```

---

### TASK-Q-A-02 {#task-q-a-02}

| | |
| --- | --- |
| **Giao cho** | Backend |
| **Ưu tiên** | P0 |
| **Sprint** | 2 |
| **Loại** | code |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md A-02.

ID: A-02 · Phần A · Ưu tiên P0 · Sprint 2
TIÊU ĐỀ: 3 chi nhánh multi-tenant
QUYẾT ĐỊNH ĐÃ CHỐT: 3 CN; schema filter branch_id
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.
FILE GỢI Ý: branches.service.ts, branch-scope.util.ts

NHIỆM VỤ:
1. Đọc A-02 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Seed 3 CN
2. API không leak data cross-branch

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[A-02] 3 chi nhánh multi-tenant" + mô tả file đã sửa.
```

---

### TASK-Q-A-03 {#task-q-a-03}

| | |
| --- | --- |
| **Giao cho** | Backend |
| **Ưu tiên** | P0 |
| **Sprint** | 2 |
| **Loại** | seed |
| **Map** | TASK-P2-06 |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md A-03.

ID: A-03 · Phần A · Ưu tiên P0 · Sprint 2
TIÊU ĐỀ: 50 bàn/CN layout
QUYẾT ĐỊNH ĐÃ CHỐT: T1×20 T2×20 sân×10; 2 NV pha+thu ngân/CN
LOẠI VIỆC: SEED — Cập nhật seed/import data (prisma/seed, staging JSON). Không hard-code trong app.
TASK LIÊN QUAN: TASK-P2-06

NHIỆM VỤ:
1. Đọc A-03 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. 50 bàn B01–B50
2. 2 staff vận hành + station account

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[A-03] 50 bàn/CN layout" + mô tả file đã sửa.
```

---

### TASK-Q-A-04 {#task-q-a-04}

| | |
| --- | --- |
| **Giao cho** | Backend |
| **Ưu tiên** | P1 |
| **Sprint** | 5 |
| **Loại** | code |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md A-04.

ID: A-04 · Phần A · Ưu tiên P1 · Sprint 5
TIÊU ĐỀ: 24/7 + 3 ca 8h
QUYẾT ĐỊNH ĐÃ CHỐT: NIGHT 00–08 DAY 08–16 EVENING 16–24
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.
FILE GỢI Ý: shifts module

NHIỆM VỤ:
1. Đọc A-04 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Shift enum khớp B-07
2. Pilot: optional shift_id

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[A-04] 24/7 + 3 ca 8h" + mô tả file đã sửa.
```

---

### TASK-Q-A-05 {#task-q-a-05}

| | |
| --- | --- |
| **Giao cho** | TPM |
| **Ưu tiên** | P1 |
| **Sprint** | 6 |
| **Loại** | ops |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md A-05.

ID: A-05 · Phần A · Ưu tiên P1 · Sprint 6
TIÊU ĐỀ: Baseline đơn/giờ cao điểm
QUYẾT ĐỊNH ĐÃ CHỐT: Cao điểm 18–22h; đo khi pilot
LOẠI VIỆC: OPS — Thực hiện quy trình vận hành / deploy / meeting — không hoặc ít code.

NHIỆM VỤ:
1. Đọc A-05 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Pilot daily log KPI
2. Không code trước pilot

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[A-05] Baseline đơn/giờ cao điểm" + mô tả file đã sửa.
```

---

### TASK-Q-A-06 {#task-q-a-06}

| | |
| --- | --- |
| **Giao cho** | Backend |
| **Ưu tiên** | P0 |
| **Sprint** | 2 |
| **Loại** | seed |
| **User Story** | US-B03 |
| **Map** | TASK-P2-06 |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md A-06.

ID: A-06 · Phần A · Ưu tiên P0 · Sprint 2
TIÊU ĐỀ: Menu ~40 món 6 category
QUYẾT ĐỊNH ĐÃ CHỐT: Size S/M/L; modifier; giá 19k–69k; list D-13
LOẠI VIỆC: SEED — Cập nhật seed/import data (prisma/seed, staging JSON). Không hard-code trong app.
USER STORY: US-B03
TASK LIÊN QUAN: TASK-P2-06

NHIỆM VỤ:
1. Đọc A-06 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Size S/M/L; modifier; giá 19k–69k; list D-13

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[A-06] Menu ~40 món 6 category" + mô tả file đã sửa.
```

---

### TASK-Q-A-07 {#task-q-a-07}

| | |
| --- | --- |
| **Giao cho** | — |
| **Ưu tiên** | P1 |
| **Sprint** | — |
| **Loại** | defer |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md A-07.

ID: A-07 · Phần A · Ưu tiên P1 · Sprint —
TIÊU ĐỀ: Combo/mùa post-MVP
QUYẾT ĐỊNH ĐÃ CHỐT: MVP món đơn+size; combo sau pilot
LOẠI VIỆC: DEFER — KHÔNG implement trong phase hiện tại. Ghi backlog post-MVP.

NHIỆM VỤ: Xác nhận không code. Ghi note trong backlog nếu có ticket mở nhầm.

ACCEPTANCE CRITERIA:
1. Không implement combo engine pilot

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[A-07] Combo/mùa post-MVP" + mô tả file đã sửa.
```

---

### TASK-Q-A-08 {#task-q-a-08}

| | |
| --- | --- |
| **Giao cho** | — |
| **Ưu tiên** | P2 |
| **Sprint** | — |
| **Loại** | defer |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md A-08.

ID: A-08 · Phần A · Ưu tiên P2 · Sprint —
TIÊU ĐỀ: Grab/ShopeeFood
QUYẾT ĐỊNH ĐÃ CHỐT: Không MVP
LOẠI VIỆC: DEFER — KHÔNG implement trong phase hiện tại. Ghi backlog post-MVP.

NHIỆM VỤ: Xác nhận không code. Ghi note trong backlog nếu có ticket mở nhầm.

ACCEPTANCE CRITERIA:
1. D-04: enum DELIVERY reserved only

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[A-08] Grab/ShopeeFood" + mô tả file đã sửa.
```

---

### TASK-Q-A-09 {#task-q-a-09}

| | |
| --- | --- |
| **Giao cho** | Mobile |
| **Ưu tiên** | P0 |
| **Sprint** | 2 |
| **Loại** | code |
| **Map** | TASK-P2-03 |
| **Trạng thái** | ✅ |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md A-09.

ID: A-09 · Phần A · Ưu tiên P0 · Sprint 2
TIÊU ĐỀ: Tablet trạm + ĐT cá nhân
QUYẾT ĐỊNH ĐÃ CHỐT: 1 tablet/CN session chung; ĐT login cá nhân; Android pilot
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.
TASK LIÊN QUAN: TASK-P2-03 ✅
FILE GỢI Ý: DEVICE_POLICY, station shell

NHIỆM VỤ:
1. Đọc A-09 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: 1 tablet/CN session chung; ĐT login cá nhân; Android pilot

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[A-09] Tablet trạm + ĐT cá nhân" + mô tả file đã sửa.
```

---

### TASK-Q-A-10 {#task-q-a-10}

| | |
| --- | --- |
| **Giao cho** | Mobile |
| **Ưu tiên** | P1 |
| **Sprint** | 2 |
| **Loại** | code |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md A-10.

ID: A-10 · Phần A · Ưu tiên P1 · Sprint 2
TIÊU ĐỀ: WiFi không offline
QUYẾT ĐỊNH ĐÃ CHỐT: WiFi ổn định; không offline-first
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.

NHIỆM VỤ:
1. Đọc A-10 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Network error UI rõ
2. Không offline queue

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[A-10] WiFi không offline" + mô tả file đã sửa.
```

---

### TASK-Q-A-11 {#task-q-a-11}

| | |
| --- | --- |
| **Giao cho** | TPM |
| **Ưu tiên** | P0 |
| **Sprint** | — |
| **Loại** | ops |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md A-11.

ID: A-11 · Phần A · Ưu tiên P0 · Sprint —
TIÊU ĐỀ: Pilot 2 tuần
QUYẾT ĐỊNH ĐÃ CHỐT: Deadline pilot 2 tuần sau Sprint 3 UAT
LOẠI VIỆC: OPS — Thực hiện quy trình vận hành / deploy / meeting — không hoặc ít code.

NHIỆM VỤ:
1. Đọc A-11 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Deadline pilot 2 tuần sau Sprint 3 UAT

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[A-11] Pilot 2 tuần" + mô tả file đã sửa.
```

---

### TASK-Q-A-12 {#task-q-a-12}

| | |
| --- | --- |
| **Giao cho** | Designer |
| **Ưu tiên** | P1 |
| **Sprint** | — |
| **Loại** | doc |
| **Map** | GAP-08 |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md A-12.

ID: A-12 · Phần A · Ưu tiên P1 · Sprint —
TIÊU ĐỀ: Team có design
QUYẾT ĐỊNH ĐÃ CHỐT: Design UI có; dev đang setup
LOẠI VIỆC: DOC — Cập nhật tài liệu hoặc xác nhận — không đổi logic app.
TASK LIÊN QUAN: GAP-08

NHIỆM VỤ:
1. Đọc A-12 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Design UI có; dev đang setup

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[A-12] Team có design" + mô tả file đã sửa.
```

---

### TASK-Q-A-13 {#task-q-a-13}

| | |
| --- | --- |
| **Giao cho** | TPM |
| **Ưu tiên** | P1 |
| **Sprint** | — |
| **Loại** | ops |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md A-13.

ID: A-13 · Phần A · Ưu tiên P1 · Sprint —
TIÊU ĐỀ: Velocity 20pts/sprint
QUYẾT ĐỊNH ĐÃ CHỐT: Khả thi
LOẠI VIỆC: OPS — Thực hiện quy trình vận hành / deploy / meeting — không hoặc ít code.

NHIỆM VỤ:
1. Đọc A-13 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Khả thi

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[A-13] Velocity 20pts/sprint" + mô tả file đã sửa.
```

---

### TASK-Q-B-01 {#task-q-b-01}

| | |
| --- | --- |
| **Giao cho** | Backend+Mobile |
| **Ưu tiên** | P0 |
| **Sprint** | 5 |
| **Loại** | code |
| **User Story** | US-D03 |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md B-01.

ID: B-01 · Phần B · Ưu tiên P0 · Sprint 5
TIÊU ĐỀ: QL nhận ca không gate bán
QUYẾT ĐỊNH ĐÃ CHỐT: 3 ca tự giờ; QL nhận/kết ca; không chặn tạo đơn
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.
USER STORY: US-D03

NHIỆM VỤ:
1. Đọc B-01 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: 3 ca tự giờ; QL nhận/kết ca; không chặn tạo đơn

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[B-01] QL nhận ca không gate bán" + mô tả file đã sửa.
```

---

### TASK-Q-B-02 {#task-q-b-02}

| | |
| --- | --- |
| **Giao cho** | Backend |
| **Ưu tiên** | P0 |
| **Sprint** | 5 |
| **Loại** | code |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md B-02.

ID: B-02 · Phần B · Ưu tiên P0 · Sprint 5
TIÊU ĐỀ: Kết ca không đóng hết đơn
QUYẾT ĐỊNH ĐÃ CHỐT: QL kết ca; đơn tồn OK
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.

NHIỆM VỤ:
1. Đọc B-02 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: QL kết ca; đơn tồn OK

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[B-02] Kết ca không đóng hết đơn" + mô tả file đã sửa.
```

---

### TASK-Q-B-03 {#task-q-b-03}

| | |
| --- | --- |
| **Giao cho** | Full-stack |
| **Ưu tiên** | P1 |
| **Sprint** | 5 |
| **Loại** | undefined |
| **User Story** | US-D03 |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md B-03.

ID: B-03 · Phần B · Ưu tiên P1 · Sprint 5
TIÊU ĐỀ: Đối chiếu TM/CK cuối ca
QUYẾT ĐỊNH ĐÃ CHỐT: Báo cáo app TM vs thực tế + CK
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.
USER STORY: US-D03

NHIỆM VỤ:
1. Đọc B-03 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Form nhập TM thực tế
2. Chênh lệch ghi chú bắt buộc

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[B-03] Đối chiếu TM/CK cuối ca" + mô tả file đã sửa.
```

---

### TASK-Q-B-04 {#task-q-b-04}

| | |
| --- | --- |
| **Giao cho** | Backend |
| **Ưu tiên** | P0 |
| **Sprint** | 5 |
| **Loại** | code |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md B-04.

ID: B-04 · Phần B · Ưu tiên P0 · Sprint 5
TIÊU ĐỀ: Đơn tồn rollover ca
QUYẾT ĐỊNH ĐÃ CHỐT: PAID giữ ca; PENDING/MAKING/READY rollover qua mốc 08/16/00
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.
FILE GỢI Ý: shifts.service.ts

NHIỆM VỤ:
1. Đọc B-04 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: PAID giữ ca; PENDING/MAKING/READY rollover qua mốc 08/16/00

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[B-04] Đơn tồn rollover ca" + mô tả file đã sửa.
```

---

### TASK-Q-B-05 {#task-q-b-05}

| | |
| --- | --- |
| **Giao cho** | Backend |
| **Ưu tiên** | P0 |
| **Sprint** | 5 |
| **Loại** | code |
| **Map** | GAP-06 |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md B-05.

ID: B-05 · Phần B · Ưu tiên P0 · Sprint 5
TIÊU ĐỀ: Shift module timing
QUYẾT ĐỊNH ĐÃ CHỐT: Pilot: không bắt buộc shift_id; Sprint 5 bật
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.
TASK LIÊN QUAN: GAP-06

NHIỆM VỤ:
1. Đọc B-05 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Pilot: không bắt buộc shift_id; Sprint 5 bật

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[B-05] Shift module timing" + mô tả file đã sửa.
```

---

### TASK-Q-B-06 {#task-q-b-06}

| | |
| --- | --- |
| **Giao cho** | Backend |
| **Ưu tiên** | P0 |
| **Sprint** | 5 |
| **Loại** | undefined |
| **User Story** | US-D02 |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md B-06.

ID: B-06 · Phần B · Ưu tiên P0 · Sprint 5
TIÊU ĐỀ: Doanh thu theo ca
QUYẾT ĐỊNH ĐÃ CHỐT: PAID = ca lúc thanh toán
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.
USER STORY: US-D02

NHIỆM VỤ:
1. Đọc B-06 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: PAID = ca lúc thanh toán

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[B-06] Doanh thu theo ca" + mô tả file đã sửa.
```

---

### TASK-Q-B-07 {#task-q-b-07}

| | |
| --- | --- |
| **Giao cho** | Backend |
| **Ưu tiên** | P1 |
| **Sprint** | 5 |
| **Loại** | code |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md B-07.

ID: B-07 · Phần B · Ưu tiên P1 · Sprint 5
TIÊU ĐỀ: 3 ca cố định giờ
QUYẾT ĐỊNH ĐÃ CHỐT: NIGHT/DAY/EVENING 8h
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.

NHIỆM VỤ:
1. Đọc B-07 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: NIGHT/DAY/EVENING 8h

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[B-07] 3 ca cố định giờ" + mô tả file đã sửa.
```

---

### TASK-Q-B-08 {#task-q-b-08}

| | |
| --- | --- |
| **Giao cho** | Mobile |
| **Ưu tiên** | P1 |
| **Sprint** | 5 |
| **Loại** | code |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md B-08.

ID: B-08 · Phần B · Ưu tiên P1 · Sprint 5
TIÊU ĐỀ: Không float đầu ca
QUYẾT ĐỊNH ĐÃ CHỐT: Chỉ đối chiếu cuối ca TM/CK
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.

NHIỆM VỤ:
1. Đọc B-08 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Chỉ đối chiếu cuối ca TM/CK

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[B-08] Không float đầu ca" + mô tả file đã sửa.
```

---

### TASK-Q-B-09 {#task-q-b-09}

| | |
| --- | --- |
| **Giao cho** | Mobile |
| **Ưu tiên** | P2 |
| **Sprint** | 2 |
| **Loại** | code |
| **Map** | TASK-P2-03b |
| **Trạng thái** | ✅ |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md B-09.

ID: B-09 · Phần B · Ưu tiên P2 · Sprint 2
TIÊU ĐỀ: Tablet Tab Thu ngân + Bếp
QUYẾT ĐỊNH ĐÃ CHỐT: Login trạm làm ngay; tab Bếp queue
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.
TASK LIÊN QUAN: TASK-P2-03b ✅

NHIỆM VỤ:
1. Đọc B-09 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Login trạm làm ngay; tab Bếp queue

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[B-09] Tablet Tab Thu ngân + Bếp" + mô tả file đã sửa.
```

---

### TASK-Q-B-10 {#task-q-b-10}

| | |
| --- | --- |
| **Giao cho** | — |
| **Ưu tiên** | P2 |
| **Sprint** | — |
| **Loại** | defer |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md B-10.

ID: B-10 · Phần B · Ưu tiên P2 · Sprint —
TIÊU ĐỀ: Không duyệt mở ca
QUYẾT ĐỊNH ĐÃ CHỐT: Đơn realtime không gate
LOẠI VIỆC: DEFER — KHÔNG implement trong phase hiện tại. Ghi backlog post-MVP.

NHIỆM VỤ: Xác nhận không code. Ghi note trong backlog nếu có ticket mở nhầm.

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Đơn realtime không gate

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[B-10] Không duyệt mở ca" + mô tả file đã sửa.
```

---

### TASK-Q-B-11 {#task-q-b-11}

| | |
| --- | --- |
| **Giao cho** | Mobile |
| **Ưu tiên** | P0 |
| **Sprint** | 5 |
| **Loại** | code |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md B-11.

ID: B-11 · Phần B · Ưu tiên P0 · Sprint 5
TIÊU ĐỀ: Logout cuối ca
QUYẾT ĐỊNH ĐÃ CHỐT: ĐT: nhắc + auto logout +10p; tablet: không auto logout
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.

NHIỆM VỤ:
1. Đọc B-11 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: ĐT: nhắc + auto logout +10p; tablet: không auto logout

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[B-11] Logout cuối ca" + mô tả file đã sửa.
```

---

### TASK-Q-B-12 {#task-q-b-12}

| | |
| --- | --- |
| **Giao cho** | — |
| **Ưu tiên** | P2 |
| **Sprint** | — |
| **Loại** | defer |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md B-12.

ID: B-12 · Phần B · Ưu tiên P2 · Sprint —
TIÊU ĐỀ: Cảnh báo phiên cũ
QUYẾT ĐỊNH ĐÃ CHỐT: Tablet không áp dụng; ĐT không bắt buộc
LOẠI VIỆC: DEFER — KHÔNG implement trong phase hiện tại. Ghi backlog post-MVP.

NHIỆM VỤ: Xác nhận không code. Ghi note trong backlog nếu có ticket mở nhầm.

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Tablet không áp dụng; ĐT không bắt buộc

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[B-12] Cảnh báo phiên cũ" + mô tả file đã sửa.
```

---

### TASK-Q-B-13 {#task-q-b-13}

| | |
| --- | --- |
| **Giao cho** | TPM |
| **Ưu tiên** | P0 |
| **Sprint** | — |
| **Loại** | ops |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md B-13.

ID: B-13 · Phần B · Ưu tiên P0 · Sprint —
TIÊU ĐỀ: 2 NV pha+thu ngân/CN
QUYẾT ĐỊNH ĐÃ CHỐT: 1 CN = 2 NV vận hành (+ 5 phục vụ bàn ngoài app scope)
LOẠI VIỆC: OPS — Thực hiện quy trình vận hành / deploy / meeting — không hoặc ít code.

NHIỆM VỤ:
1. Đọc B-13 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: 1 CN = 2 NV vận hành (+ 5 phục vụ bàn ngoài app scope)

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[B-13] 2 NV pha+thu ngân/CN" + mô tả file đã sửa.
```

---

### TASK-Q-B-14 {#task-q-b-14}

| | |
| --- | --- |
| **Giao cho** | Full-stack |
| **Ưu tiên** | P0 |
| **Sprint** | 2 |
| **Loại** | undefined |
| **User Story** | US-B02 |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md B-14.

ID: B-14 · Phần B · Ưu tiên P0 · Sprint 2
TIÊU ĐỀ: Khóa bàn khi đang order
QUYẾT ĐỊNH ĐÃ CHỐT: Bàn SELECTED/LOCKED; NV2 không mở; timeout 2–3p
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.
USER STORY: US-B02
FILE GỢI Ý: tables.service.ts, tables.tsx

NHIỆM VỤ:
1. Đọc B-14 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. API lock soft
2. UI thông báo bàn đang xử lý

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[B-14] Khóa bàn khi đang order" + mô tả file đã sửa.
```

---

### TASK-Q-B-15 {#task-q-b-15}

| | |
| --- | --- |
| **Giao cho** | Mobile+API |
| **Ưu tiên** | P1 |
| **Sprint** | 2 |
| **Loại** | code |
| **Map** | TASK-P2-03 |
| **Trạng thái** | ✅ |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md B-15.

ID: B-15 · Phần B · Ưu tiên P1 · Sprint 2
TIÊU ĐỀ: Tablet chọn NV mỗi thao tác
QUYẾT ĐỊNH ĐÃ CHỐT: Station: StaffPicker + actedByStaffId
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.
TASK LIÊN QUAN: TASK-P2-03 ✅

NHIỆM VỤ:
1. Đọc B-15 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Station: StaffPicker + actedByStaffId

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[B-15] Tablet chọn NV mỗi thao tác" + mô tả file đã sửa.
```

---

### TASK-Q-B-16 {#task-q-b-16}

| | |
| --- | --- |
| **Giao cho** | Backend |
| **Ưu tiên** | P1 |
| **Sprint** | 2 |
| **Loại** | code |
| **Map** | TASK-P2-01 |
| **Trạng thái** | ✅ |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md B-16.

ID: B-16 · Phần B · Ưu tiên P1 · Sprint 2
TIÊU ĐỀ: Audit theo StaffRole JWT
QUYẾT ĐỊNH ĐÃ CHỐT: Không chọn role; audit role từ tài khoản
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.
TASK LIÊN QUAN: TASK-P2-01 ✅

NHIỆM VỤ:
1. Đọc B-16 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Không chọn role; audit role từ tài khoản

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[B-16] Audit theo StaffRole JWT" + mô tả file đã sửa.
```

---

### TASK-Q-B-17 {#task-q-b-17}

| | |
| --- | --- |
| **Giao cho** | Backend |
| **Ưu tiên** | P2 |
| **Sprint** | 5 |
| **Loại** | undefined |
| **User Story** | US-D05 |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md B-17.

ID: B-17 · Phần B · Ưu tiên P2 · Sprint 5
TIÊU ĐỀ: Không đổi role trong ca
QUYẾT ĐỊNH ĐÃ CHỐT: Chỉ Owner/QL đổi role tài khoản
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.
USER STORY: US-D05

NHIỆM VỤ:
1. Đọc B-17 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Chỉ Owner/QL đổi role tài khoản

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[B-17] Không đổi role trong ca" + mô tả file đã sửa.
```

---

### TASK-Q-B-18 {#task-q-b-18}

| | |
| --- | --- |
| **Giao cho** | Mobile |
| **Ưu tiên** | P0 |
| **Sprint** | 2 |
| **Loại** | code |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md B-18.

ID: B-18 · Phần B · Ưu tiên P0 · Sprint 2
TIÊU ĐỀ: Mất mạng → thủ công
QUYẾT ĐỊNH ĐÃ CHỐT: App không hoạt động; SOP giấy
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.

NHIỆM VỤ:
1. Đọc B-18 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Banner lỗi mạng
2. Không fake offline mode
3. SOP_QUAY_PILOT.pdf

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[B-18] Mất mạng → thủ công" + mô tả file đã sửa.
```

---

### TASK-Q-B-19 {#task-q-b-19}

| | |
| --- | --- |
| **Giao cho** | Mobile |
| **Ưu tiên** | P1 |
| **Sprint** | — |
| **Loại** | code |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md B-19.

ID: B-19 · Phần B · Ưu tiên P1 · Sprint —
TIÊU ĐỀ: Không offline cart
QUYẾT ĐỊNH ĐÃ CHỐT: Mất mạng = thủ công
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.

NHIỆM VỤ:
1. Đọc B-19 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Không persist cart offline lâu

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[B-19] Không offline cart" + mô tả file đã sửa.
```

---

### TASK-Q-B-20 {#task-q-b-20}

| | |
| --- | --- |
| **Giao cho** | — |
| **Ưu tiên** | P2 |
| **Sprint** | — |
| **Loại** | defer |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md B-20.

ID: B-20 · Phần B · Ưu tiên P2 · Sprint —
TIÊU ĐỀ: API down notify QL
QUYẾT ĐỊNH ĐÃ CHỐT: Thủ công
LOẠI VIỆC: DEFER — KHÔNG implement trong phase hiện tại. Ghi backlog post-MVP.

NHIỆM VỤ: Xác nhận không code. Ghi note trong backlog nếu có ticket mở nhầm.

ACCEPTANCE CRITERIA:
1. Post-MVP monitoring alert

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[B-20] API down notify QL" + mô tả file đã sửa.
```

---

### TASK-Q-B-21 {#task-q-b-21}

| | |
| --- | --- |
| **Giao cho** | Mobile |
| **Ưu tiên** | P1 |
| **Sprint** | 4 |
| **Loại** | undefined |
| **Map** | TASK-P2-11 |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md B-21.

ID: B-21 · Phần B · Ưu tiên P1 · Sprint 4
TIÊU ĐỀ: Barista reconnect
QUYẾT ĐỊNH ĐÃ CHỐT: Mất mạng thủ công; WS reconnect Sprint 4
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.
TASK LIÊN QUAN: TASK-P2-11

NHIỆM VỤ:
1. Đọc B-21 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Mất mạng thủ công; WS reconnect Sprint 4

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[B-21] Barista reconnect" + mô tả file đã sửa.
```

---

### TASK-Q-B-22 {#task-q-b-22}

| | |
| --- | --- |
| **Giao cho** | Backend |
| **Ưu tiên** | P1 |
| **Sprint** | 5 |
| **Loại** | code |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md B-22.

ID: B-22 · Phần B · Ưu tiên P1 · Sprint 5
TIÊU ĐỀ: Audit log đầy đủ
QUYẾT ĐỊNH ĐÃ CHỐT: Mọi thao tác doanh thu; before/after; NV, device, IP
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.
FILE GỢI Ý: audit_logs module

NHIỆM VỤ:
1. Đọc B-22 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Mọi thao tác doanh thu; before/after; NV, device, IP

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[B-22] Audit log đầy đủ" + mô tả file đã sửa.
```

---

### TASK-Q-B-23 {#task-q-b-23}

| | |
| --- | --- |
| **Giao cho** | Mobile |
| **Ưu tiên** | P2 |
| **Sprint** | 5 |
| **Loại** | undefined |
| **User Story** | US-D06 |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md B-23.

ID: B-23 · Phần B · Ưu tiên P2 · Sprint 5
TIÊU ĐỀ: Audit UI Owner/QL
QUYẾT ĐỊNH ĐÃ CHỐT: Cashier/Barista không xem
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.
USER STORY: US-D06

NHIỆM VỤ:
1. Đọc B-23 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Cashier/Barista không xem

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[B-23] Audit UI Owner/QL" + mô tả file đã sửa.
```

---

### TASK-Q-B-24 {#task-q-b-24}

| | |
| --- | --- |
| **Giao cho** | Full-stack |
| **Ưu tiên** | P1 |
| **Sprint** | 3 |
| **Loại** | undefined |
| **User Story** | US-B07 |
| **Map** | TASK-P2-10 |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md B-24.

ID: B-24 · Phần B · Ưu tiên P1 · Sprint 3
TIÊU ĐỀ: CK xác nhận + trách nhiệm
QUYẾT ĐỊNH ĐÃ CHỐT: Cashier xác nhận; audit; QL void
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.
USER STORY: US-B07
TASK LIÊN QUAN: TASK-P2-10

NHIỆM VỤ:
1. Đọc B-24 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Cashier xác nhận; audit; QL void

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[B-24] CK xác nhận + trách nhiệm" + mô tả file đã sửa.
```

---

### TASK-Q-B-25 {#task-q-b-25}

| | |
| --- | --- |
| **Giao cho** | Mobile |
| **Ưu tiên** | P0 |
| **Sprint** | 2 |
| **Loại** | undefined |
| **User Story** | US-B01,B02 |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md B-25.

ID: B-25 · Phần B · Ưu tiên P0 · Sprint 2
TIÊU ĐỀ: Chọn bàn hoặc order trước
QUYẾT ĐỊNH ĐÃ CHỐT: Cả 2; NV quan sát tránh trùng bàn
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.
USER STORY: US-B01,B02

NHIỆM VỤ:
1. Đọc B-25 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Cả 2; NV quan sát tránh trùng bàn

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[B-25] Chọn bàn hoặc order trước" + mô tả file đã sửa.
```

---

### TASK-Q-B-26 {#task-q-b-26}

| | |
| --- | --- |
| **Giao cho** | Backend |
| **Ưu tiên** | P0 |
| **Sprint** | 2 |
| **Loại** | undefined |
| **User Story** | US-B05 |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md B-26.

ID: B-26 · Phần B · Ưu tiên P0 · Sprint 2
TIÊU ĐỀ: Nhiều đơn/bàn
QUYẾT ĐỊNH ĐÃ CHỐT: Append nếu chưa PAID; order mới sau PAID
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.
USER STORY: US-B05

NHIỆM VỤ:
1. Đọc B-26 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. D-08 logic

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[B-26] Nhiều đơn/bàn" + mô tả file đã sửa.
```

---

### TASK-Q-B-27 {#task-q-b-27}

| | |
| --- | --- |
| **Giao cho** | Full-stack |
| **Ưu tiên** | P1 |
| **Sprint** | 6 |
| **Loại** | undefined |
| **User Story** | B-30 |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md B-27.

ID: B-27 · Phần B · Ưu tiên P1 · Sprint 6
TIÊU ĐỀ: Đổi bàn
QUYẾT ĐỊNH ĐÃ CHỐT: Thu ngân/pha chế đổi bàn
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.
USER STORY: B-30

NHIỆM VỤ:
1. Đọc B-27 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. transfer table endpoint

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[B-27] Đổi bàn" + mô tả file đã sửa.
```

---

### TASK-Q-B-28 {#task-q-b-28}

| | |
| --- | --- |
| **Giao cho** | Full-stack |
| **Ưu tiên** | P1 |
| **Sprint** | 2 |
| **Loại** | undefined |
| **User Story** | US-B01 |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md B-28.

ID: B-28 · Phần B · Ưu tiên P1 · Sprint 2
TIÊU ĐỀ: Số thứ tự mang đi
QUYẾT ĐỊNH ĐÃ CHỐT: #042 format
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.
USER STORY: US-B01

NHIỆM VỤ:
1. Đọc B-28 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. orderNumber hiển thị mang đi

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[B-28] Số thứ tự mang đi" + mô tả file đã sửa.
```

---

### TASK-Q-B-29 {#task-q-b-29}

| | |
| --- | --- |
| **Giao cho** | Full-stack |
| **Ưu tiên** | P0 |
| **Sprint** | 3 |
| **Loại** | undefined |
| **User Story** | US-B06 |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md B-29.

ID: B-29 · Phần B · Ưu tiên P0 · Sprint 3
TIÊU ĐỀ: Thanh toán linh hoạt
QUYẾT ĐỊNH ĐÃ CHỐT: READY/sau giao hoặc rời bàn
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.
USER STORY: US-B06

NHIỆM VỤ:
1. Đọc B-29 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. E-01: cho trả READY; optional trả trước

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[B-29] Thanh toán linh hoạt" + mô tả file đã sửa.
```

---

### TASK-Q-B-30 {#task-q-b-30}

| | |
| --- | --- |
| **Giao cho** | Full-stack |
| **Ưu tiên** | P2 |
| **Sprint** | 6 |
| **Loại** | code |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md B-30.

ID: B-30 · Phần B · Ưu tiên P2 · Sprint 6
TIÊU ĐỀ: Gộp/chuyển/tách bill
QUYẾT ĐỊNH ĐÃ CHỐT: MVP v2 Sprint 6; audit bắt buộc
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.

NHIỆM VỤ:
1. Đọc B-30 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: MVP v2 Sprint 6; audit bắt buộc

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[B-30] Gộp/chuyển/tách bill" + mô tả file đã sửa.
```

---

### TASK-Q-B-31 {#task-q-b-31}

| | |
| --- | --- |
| **Giao cho** | Full-stack |
| **Ưu tiên** | P2 |
| **Sprint** | 6 |
| **Loại** | code |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md B-31.

ID: B-31 · Phần B · Ưu tiên P2 · Sprint 6
TIÊU ĐỀ: Giảm giá/voucher
QUYẾT ĐỊNH ĐÃ CHỐT: % / cố định / voucher; 1 promo/đơn
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.

NHIỆM VỤ:
1. Đọc B-31 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: % / cố định / voucher; 1 promo/đơn

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[B-31] Giảm giá/voucher" + mô tả file đã sửa.
```

---

### TASK-Q-B-32 {#task-q-b-32}

| | |
| --- | --- |
| **Giao cho** | Full-stack |
| **Ưu tiên** | P1 |
| **Sprint** | 2 |
| **Loại** | undefined |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md B-32.

ID: B-32 · Phần B · Ưu tiên P1 · Sprint 2
TIÊU ĐỀ: baristaNote vs internalNote
QUYẾT ĐỊNH ĐÃ CHỐT: 2 field riêng
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.
FILE GỢI Ý: Order schema, order DTO

NHIỆM VỤ:
1. Đọc B-32 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. baristaNote trên ticket bếp
2. internalNote chỉ NV/QL

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[B-32] baristaNote vs internalNote" + mô tả file đã sửa.
```

---

### TASK-Q-B-33 {#task-q-b-33}

| | |
| --- | --- |
| **Giao cho** | Full-stack |
| **Ưu tiên** | P1 |
| **Sprint** | 2 |
| **Loại** | undefined |
| **User Story** | C-14 |
| **Map** | TASK-P2-02 |
| **Trạng thái** | ✅ |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md B-33.

ID: B-33 · Phần B · Ưu tiên P1 · Sprint 2
TIÊU ĐỀ: Đã giao → chờ thanh toán
QUYẾT ĐỊNH ĐÃ CHỐT: READY → nút Đã giao → deliveredAt
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.
USER STORY: C-14
TASK LIÊN QUAN: TASK-P2-02 ✅

NHIỆM VỤ:
1. Đọc B-33 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: READY → nút Đã giao → deliveredAt

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[B-33] Đã giao → chờ thanh toán" + mô tả file đã sửa.
```

---

### TASK-Q-C-01 {#task-q-c-01}

| | |
| --- | --- |
| **Giao cho** | Full-stack |
| **Ưu tiên** | P0 |
| **Sprint** | 1 |
| **Loại** | undefined |
| **User Story** | US-A01 |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md C-01.

ID: C-01 · Phần C · Ưu tiên P0 · Sprint 1
TIÊU ĐỀ: Login email hoặc SĐT
QUYẾT ĐỊNH ĐÃ CHỐT: Gmail hoặc SĐT + MK
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.
USER STORY: US-A01
FILE GỢI Ý: auth.service.ts, login.tsx

NHIỆM VỤ:
1. Đọc C-01 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Gmail hoặc SĐT + MK

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[C-01] Login email hoặc SĐT" + mô tả file đã sửa.
```

---

### TASK-Q-C-02 {#task-q-c-02}

| | |
| --- | --- |
| **Giao cho** | Full-stack |
| **Ưu tiên** | P1 |
| **Sprint** | 5 |
| **Loại** | code |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md C-02.

ID: C-02 · Phần C · Ưu tiên P1 · Sprint 5
TIÊU ĐỀ: Quên MK qua Gmail OTP
QUYẾT ĐỊNH ĐÃ CHỐT: OTP email; notify Owner
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.

NHIỆM VỤ:
1. Đọc C-02 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Post-pilot hoặc Sprint 5 polish

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[C-02] Quên MK qua Gmail OTP" + mô tả file đã sửa.
```

---

### TASK-Q-C-03 {#task-q-c-03}

| | |
| --- | --- |
| **Giao cho** | Backend |
| **Ưu tiên** | P2 |
| **Sprint** | 5 |
| **Loại** | code |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md C-03.

ID: C-03 · Phần C · Ưu tiên P2 · Sprint 5
TIÊU ĐỀ: Khóa 5 lần sai MK
QUYẾT ĐỊNH ĐÃ CHỐT: 15 phút; audit
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.

NHIỆM VỤ:
1. Đọc C-03 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: 15 phút; audit

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[C-03] Khóa 5 lần sai MK" + mô tả file đã sửa.
```

---

### TASK-Q-C-04 {#task-q-c-04}

| | |
| --- | --- |
| **Giao cho** | Full-stack |
| **Ưu tiên** | P0 |
| **Sprint** | 1 |
| **Loại** | undefined |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md C-04.

ID: C-04 · Phần C · Ưu tiên P0 · Sprint 1
TIÊU ĐỀ: JWT 15p + refresh
QUYẾT ĐỊNH ĐÃ CHỐT: Auto refresh nền
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.
FILE GỢI Ý: auth module, apiClient interceptor

NHIỆM VỤ:
1. Đọc C-04 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Auto refresh nền

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[C-04] JWT 15p + refresh" + mô tả file đã sửa.
```

---

### TASK-Q-C-05 {#task-q-c-05}

| | |
| --- | --- |
| **Giao cho** | Backend |
| **Ưu tiên** | P0 |
| **Sprint** | 1 |
| **Loại** | code |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md C-05.

ID: C-05 · Phần C · Ưu tiên P0 · Sprint 1
TIÊU ĐỀ: Session 8h max
QUYẾT ĐỊNH ĐÃ CHỐT: Refresh 8h; logout/đổi MK hết session
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.

NHIỆM VỤ:
1. Đọc C-05 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Refresh 8h; logout/đổi MK hết session

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[C-05] Session 8h max" + mô tả file đã sửa.
```

---

### TASK-Q-C-06 {#task-q-c-06}

| | |
| --- | --- |
| **Giao cho** | Backend |
| **Ưu tiên** | P2 |
| **Sprint** | 6 |
| **Loại** | code |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md C-06.

ID: C-06 · Phần C · Ưu tiên P2 · Sprint 6
TIÊU ĐỀ: Force logout đa thiết bị
QUYẾT ĐỊNH ĐÃ CHỐT: Owner/QL force; NV quản lý thiết bị
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.

NHIỆM VỤ:
1. Đọc C-06 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Owner/QL force; NV quản lý thiết bị

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[C-06] Force logout đa thiết bị" + mô tả file đã sửa.
```

---

### TASK-Q-C-07 {#task-q-c-07}

| | |
| --- | --- |
| **Giao cho** | Mobile |
| **Ưu tiên** | P2 |
| **Sprint** | 6 |
| **Loại** | code |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md C-07.

ID: C-07 · Phần C · Ưu tiên P2 · Sprint 6
TIÊU ĐỀ: Sinh trắc học unlock app
QUYẾT ĐỊNH ĐÃ CHỐT: Sau login lần đầu; SecureStore session
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.

NHIỆM VỤ:
1. Đọc C-07 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Sau login lần đầu; SecureStore session

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[C-07] Sinh trắc học unlock app" + mô tả file đã sửa.
```

---

### TASK-Q-C-08 {#task-q-c-08}

| | |
| --- | --- |
| **Giao cho** | Mobile |
| **Ưu tiên** | P0 |
| **Sprint** | 1 |
| **Loại** | undefined |
| **User Story** | US-A02 |
| **Map** | TASK-P2-01 |
| **Trạng thái** | ✅ |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md C-08.

ID: C-08 · Phần C · Ưu tiên P0 · Sprint 1
TIÊU ĐỀ: Staff không chọn CN
QUYẾT ĐỊNH ĐÃ CHỐT: Branch assignment auto
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.
USER STORY: US-A02
TASK LIÊN QUAN: TASK-P2-01 ✅

NHIỆM VỤ:
1. Đọc C-08 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Branch assignment auto

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[C-08] Staff không chọn CN" + mô tả file đã sửa.
```

---

### TASK-Q-C-09 {#task-q-c-09}

| | |
| --- | --- |
| **Giao cho** | Mobile |
| **Ưu tiên** | P1 |
| **Sprint** | 1 |
| **Loại** | undefined |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md C-09.

ID: C-09 · Phần C · Ưu tiên P1 · Sprint 1
TIÊU ĐỀ: Owner đổi CN không logout
QUYẾT ĐỊNH ĐÃ CHỐT: Working branch context + audit
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.
FILE GỢI Ý: branch.tsx, session store

NHIỆM VỤ:
1. Đọc C-09 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Working branch context + audit

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[C-09] Owner đổi CN không logout" + mô tả file đã sửa.
```

---

### TASK-Q-C-10 {#task-q-c-10}

| | |
| --- | --- |
| **Giao cho** | Full-stack |
| **Ưu tiên** | P1 |
| **Sprint** | 5 |
| **Loại** | undefined |
| **User Story** | BRANCH_ASSIGNMENT |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md C-10.

ID: C-10 · Phần C · Ưu tiên P1 · Sprint 5
TIÊU ĐỀ: Notify Owner duyệt CN
QUYẾT ĐỊNH ĐÃ CHỐT: PENDING_OWNER → Owner badge/push v2
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.
USER STORY: BRANCH_ASSIGNMENT

NHIỆM VỤ:
1. Đọc C-10 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: PENDING_OWNER → Owner badge/push v2

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[C-10] Notify Owner duyệt CN" + mô tả file đã sửa.
```

---

### TASK-Q-C-11 {#task-q-c-11}

| | |
| --- | --- |
| **Giao cho** | Mobile |
| **Ưu tiên** | P0 |
| **Sprint** | 1 |
| **Loại** | undefined |
| **User Story** | US-A03 |
| **Map** | TASK-P2-01 |
| **Trạng thái** | ✅ |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md C-11.

ID: C-11 · Phần C · Ưu tiên P0 · Sprint 1
TIÊU ĐỀ: Bỏ màn chọn role
QUYẾT ĐỊNH ĐÃ CHỐT: Route theo StaffRole
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.
USER STORY: US-A03
TASK LIÊN QUAN: TASK-P2-01 ✅

NHIỆM VỤ:
1. Đọc C-11 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Route theo StaffRole

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[C-11] Bỏ màn chọn role" + mô tả file đã sửa.
```

---

### TASK-Q-C-12 {#task-q-c-12}

| | |
| --- | --- |
| **Giao cho** | — |
| **Ưu tiên** | P2 |
| **Sprint** | — |
| **Loại** | defer |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md C-12.

ID: C-12 · Phần C · Ưu tiên P2 · Sprint —
TIÊU ĐỀ: Không xác nhận role
QUYẾT ĐỊNH ĐÃ CHỐT: N/A sau C-11
LOẠI VIỆC: DEFER — KHÔNG implement trong phase hiện tại. Ghi backlog post-MVP.

NHIỆM VỤ: Xác nhận không code. Ghi note trong backlog nếu có ticket mở nhầm.

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: N/A sau C-11

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[C-12] Không xác nhận role" + mô tả file đã sửa.
```

---

### TASK-Q-C-13 {#task-q-c-13}

| | |
| --- | --- |
| **Giao cho** | Mobile |
| **Ưu tiên** | P1 |
| **Sprint** | 1 |
| **Loại** | undefined |
| **User Story** | US-A04 |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md C-13.

ID: C-13 · Phần C · Ưu tiên P1 · Sprint 1
TIÊU ĐỀ: 6 quick actions layout
QUYẾT ĐỊNH ĐÃ CHỐT: Hàng1: Tạo đơn|Sơ đồ|Món xong; Hàng2: DS đơn|TB|Lịch sử
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.
USER STORY: US-A04
FILE GỢI Ý: home.tsx

NHIỆM VỤ:
1. Đọc C-13 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Hàng1: Tạo đơn|Sơ đồ|Món xong; Hàng2: DS đơn|TB|Lịch sử

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[C-13] 6 quick actions layout" + mô tả file đã sửa.
```

---

### TASK-Q-C-14 {#task-q-c-14}

| | |
| --- | --- |
| **Giao cho** | Mobile |
| **Ưu tiên** | P1 |
| **Sprint** | 2 |
| **Loại** | undefined |
| **Map** | TASK-P2-02 |
| **Trạng thái** | ✅ |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md C-14.

ID: C-14 · Phần C · Ưu tiên P1 · Sprint 2
TIÊU ĐỀ: Món đã xong 2 tab
QUYẾT ĐỊNH ĐÃ CHỐT: Chờ giao vs Chờ thanh toán
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.
TASK LIÊN QUAN: TASK-P2-02 ✅

NHIỆM VỤ:
1. Đọc C-14 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Chờ giao vs Chờ thanh toán

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[C-14] Món đã xong 2 tab" + mô tả file đã sửa.
```

---

### TASK-Q-C-15 {#task-q-c-15}

| | |
| --- | --- |
| **Giao cho** | QA |
| **Ưu tiên** | P0 |
| **Sprint** | 2 |
| **Loại** | qa |
| **Map** | TASK-P2-05 |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md C-15.

ID: C-15 · Phần C · Ưu tiên P0 · Sprint 2
TIÊU ĐỀ: E2E SecureStore kill app
QUYẾT ĐỊNH ĐÃ CHỐT: Chưa test thiết bị thật
LOẠI VIỆC: QA — Viết test plan, chạy manual/E2E, ghi evidence.
TASK LIÊN QUAN: TASK-P2-05

NHIỆM VỤ:
1. Đọc C-15 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Chưa test thiết bị thật

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[C-15] E2E SecureStore kill app" + mô tả file đã sửa.
```

---

### TASK-Q-D-01 {#task-q-d-01}

| | |
| --- | --- |
| **Giao cho** | Mobile |
| **Ưu tiên** | P0 |
| **Sprint** | 2 |
| **Loại** | undefined |
| **User Story** | US-B01 |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md D-01.

ID: D-01 · Phần D · Ưu tiên P0 · Sprint 2
TIÊU ĐỀ: 75/25 dine/takeaway
QUYẾT ĐỊNH ĐÃ CHỐT: Luôn màn chọn loại
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.
USER STORY: US-B01

NHIỆM VỤ:
1. Đọc D-01 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Luôn màn chọn loại

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[D-01] 75/25 dine/takeaway" + mô tả file đã sửa.
```

---

### TASK-Q-D-02 {#task-q-d-02}

| | |
| --- | --- |
| **Giao cho** | Mobile |
| **Ưu tiên** | P1 |
| **Sprint** | 2 |
| **Loại** | undefined |
| **User Story** | US-B01 |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md D-02.

ID: D-02 · Phần D · Ưu tiên P1 · Sprint 2
TIÊU ĐỀ: Luôn màn chọn loại
QUYẾT ĐỊNH ĐÃ CHỐT: Highlight loại gần nhất
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.
USER STORY: US-B01

NHIỆM VỤ:
1. Đọc D-02 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Highlight loại gần nhất

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[D-02] Luôn màn chọn loại" + mô tả file đã sửa.
```

---

### TASK-Q-D-03 {#task-q-d-03}

| | |
| --- | --- |
| **Giao cho** | Mobile |
| **Ưu tiên** | P1 |
| **Sprint** | 2 |
| **Loại** | code |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md D-03.

ID: D-03 · Phần D · Ưu tiên P1 · Sprint 2
TIÊU ĐỀ: Mang đi không tên/SĐT
QUYẾT ĐỊNH ĐÃ CHỐT: Không bắt buộc
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.

NHIỆM VỤ:
1. Đọc D-03 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Không bắt buộc

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[D-03] Mang đi không tên/SĐT" + mô tả file đã sửa.
```

---

### TASK-Q-D-04 {#task-q-d-04}

| | |
| --- | --- |
| **Giao cho** | Backend |
| **Ưu tiên** | P2 |
| **Sprint** | 2 |
| **Loại** | code |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md D-04.

ID: D-04 · Phần D · Ưu tiên P2 · Sprint 2
TIÊU ĐỀ: Enum DELIVERY reserved
QUYẾT ĐỊNH ĐÃ CHỐT: Schema only
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.

NHIỆM VỤ:
1. Đọc D-04 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Schema only

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[D-04] Enum DELIVERY reserved" + mô tả file đã sửa.
```

---

### TASK-Q-D-05 {#task-q-d-05}

| | |
| --- | --- |
| **Giao cho** | Backend |
| **Ưu tiên** | P0 |
| **Sprint** | 2 |
| **Loại** | seed |
| **Map** | TASK-P2-06 |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md D-05.

ID: D-05 · Phần D · Ưu tiên P0 · Sprint 2
TIÊU ĐỀ: 50 bàn B01–B50
QUYẾT ĐỊNH ĐÃ CHỐT: T1/T2/sân
LOẠI VIỆC: SEED — Cập nhật seed/import data (prisma/seed, staging JSON). Không hard-code trong app.
TASK LIÊN QUAN: TASK-P2-06

NHIỆM VỤ:
1. Đọc D-05 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: T1/T2/sân

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[D-05] 50 bàn B01–B50" + mô tả file đã sửa.
```

---

### TASK-Q-D-06 {#task-q-d-06}

| | |
| --- | --- |
| **Giao cho** | Mobile |
| **Ưu tiên** | P0 |
| **Sprint** | 2 |
| **Loại** | undefined |
| **User Story** | US-B02 |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md D-06.

ID: D-06 · Phần D · Ưu tiên P0 · Sprint 2
TIÊU ĐỀ: Layout khu vực + list
QUYẾT ĐỊNH ĐÃ CHỐT: Zone + danh sách bàn
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.
USER STORY: US-B02

NHIỆM VỤ:
1. Đọc D-06 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Zone + danh sách bàn

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[D-06] Layout khu vực + list" + mô tả file đã sửa.
```

---

### TASK-Q-D-07 {#task-q-d-07}

| | |
| --- | --- |
| **Giao cho** | Mobile |
| **Ưu tiên** | P0 |
| **Sprint** | 2 |
| **Loại** | undefined |
| **User Story** | US-B02 |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md D-07.

ID: D-07 · Phần D · Ưu tiên P0 · Sprint 2
TIÊU ĐỀ: OCCUPIED thêm món
QUYẾT ĐỊNH ĐÃ CHỐT: Tap → xem + thêm món
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.
USER STORY: US-B02

NHIỆM VỤ:
1. Đọc D-07 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Tap → xem + thêm món

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[D-07] OCCUPIED thêm món" + mô tả file đã sửa.
```

---

### TASK-Q-D-08 {#task-q-d-08}

| | |
| --- | --- |
| **Giao cho** | Backend |
| **Ưu tiên** | P0 |
| **Sprint** | 2 |
| **Loại** | code |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md D-08.

ID: D-08 · Phần D · Ưu tiên P0 · Sprint 2
TIÊU ĐỀ: Nhiều order_id/bàn
QUYẾT ĐỊNH ĐÃ CHỐT: Append chưa PAID; mới sau PAID
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.

NHIỆM VỤ:
1. Đọc D-08 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Append chưa PAID; mới sau PAID

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[D-08] Nhiều order_id/bàn" + mô tả file đã sửa.
```

---

### TASK-Q-D-09 {#task-q-d-09}

| | |
| --- | --- |
| **Giao cho** | Mobile |
| **Ưu tiên** | P1 |
| **Sprint** | 2 |
| **Loại** | undefined |
| **Map** | TASK-P2-09 |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md D-09.

ID: D-09 · Phần D · Ưu tiên P1 · Sprint 2
TIÊU ĐỀ: Polling bàn 3–5s
QUYẾT ĐỊNH ĐÃ CHỐT: 10s màn khác
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.
TASK LIÊN QUAN: TASK-P2-09
FILE GỢI Ý: useTables.ts

NHIỆM VỤ:
1. Đọc D-09 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: 10s màn khác

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[D-09] Polling bàn 3–5s" + mô tả file đã sửa.
```

---

### TASK-Q-D-10 {#task-q-d-10}

| | |
| --- | --- |
| **Giao cho** | Mobile |
| **Ưu tiên** | P1 |
| **Sprint** | 2 |
| **Loại** | code |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md D-10.

ID: D-10 · Phần D · Ưu tiên P1 · Sprint 2
TIÊU ĐỀ: MAINTENANCE legend
QUYẾT ĐỊNH ĐÃ CHỐT: Màu xám + legend; QL set
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.

NHIỆM VỤ:
1. Đọc D-10 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Màu xám + legend; QL set

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[D-10] MAINTENANCE legend" + mô tả file đã sửa.
```

---

### TASK-Q-D-11 {#task-q-d-11}

| | |
| --- | --- |
| **Giao cho** | — |
| **Ưu tiên** | P2 |
| **Sprint** | — |
| **Loại** | defer |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md D-11.

ID: D-11 · Phần D · Ưu tiên P2 · Sprint —
TIÊU ĐỀ: CLEANING
QUYẾT ĐỊNH ĐÃ CHỐT: Không pilot
LOẠI VIỆC: DEFER — KHÔNG implement trong phase hiện tại. Ghi backlog post-MVP.

NHIỆM VỤ: Xác nhận không code. Ghi note trong backlog nếu có ticket mở nhầm.

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Không pilot

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[D-11] CLEANING" + mô tả file đã sửa.
```

---

### TASK-Q-D-12 {#task-q-d-12}

| | |
| --- | --- |
| **Giao cho** | Full-stack |
| **Ưu tiên** | P1 |
| **Sprint** | 2 |
| **Loại** | undefined |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md D-12.

ID: D-12 · Phần D · Ưu tiên P1 · Sprint 2
TIÊU ĐỀ: Soft lock bàn ordering
QUYẾT ĐỊNH ĐÃ CHỐT: SELECTED 2–3p timeout
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.

NHIỆM VỤ:
1. Đọc D-12 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Map B-14

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[D-12] Soft lock bàn ordering" + mô tả file đã sửa.
```

---

### TASK-Q-D-13 {#task-q-d-13}

| | |
| --- | --- |
| **Giao cho** | Backend |
| **Ưu tiên** | P0 |
| **Sprint** | 2 |
| **Loại** | seed |
| **Map** | TASK-P2-06 |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md D-13.

ID: D-13 · Phần D · Ưu tiên P0 · Sprint 2
TIÊU ĐỀ: Seed menu D-13 list
QUYẾT ĐỊNH ĐÃ CHỐT: ~40 món từ questionnaire
LOẠI VIỆC: SEED — Cập nhật seed/import data (prisma/seed, staging JSON). Không hard-code trong app.
TASK LIÊN QUAN: TASK-P2-06

NHIỆM VỤ:
1. Đọc D-13 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: ~40 món từ questionnaire

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[D-13] Seed menu D-13 list" + mô tả file đã sửa.
```

---

### TASK-Q-D-14 {#task-q-d-14}

| | |
| --- | --- |
| **Giao cho** | Mobile |
| **Ưu tiên** | P1 |
| **Sprint** | 2 |
| **Loại** | undefined |
| **User Story** | US-B03 |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md D-14.

ID: D-14 · Phần D · Ưu tiên P1 · Sprint 2
TIÊU ĐỀ: Category tabs dynamic
QUYẾT ĐỊNH ĐÃ CHỐT: sort_order từ API
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.
USER STORY: US-B03

NHIỆM VỤ:
1. Đọc D-14 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: sort_order từ API

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[D-14] Category tabs dynamic" + mô tả file đã sửa.
```

---

### TASK-Q-D-15 {#task-q-d-15}

| | |
| --- | --- |
| **Giao cho** | Mobile |
| **Ưu tiên** | P1 |
| **Sprint** | 2 |
| **Loại** | code |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md D-15.

ID: D-15 · Phần D · Ưu tiên P1 · Sprint 2
TIÊU ĐỀ: Tìm kiếm món
QUYẾT ĐỊNH ĐÃ CHỐT: Không dấu / gần đúng
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.

NHIỆM VỤ:
1. Đọc D-15 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Không dấu / gần đúng

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[D-15] Tìm kiếm món" + mô tả file đã sửa.
```

---

### TASK-Q-D-16 {#task-q-d-16}

| | |
| --- | --- |
| **Giao cho** | Full-stack |
| **Ưu tiên** | P0 |
| **Sprint** | 2 |
| **Loại** | code |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md D-16.

ID: D-16 · Phần D · Ưu tiên P0 · Sprint 2
TIÊU ĐỀ: Món hết hàng badge
QUYẾT ĐỊNH ĐÃ CHỐT: Hiện + gạch + không thêm giỏ
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.

NHIỆM VỤ:
1. Đọc D-16 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Hiện + gạch + không thêm giỏ

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[D-16] Món hết hàng badge" + mô tả file đã sửa.
```

---

### TASK-Q-D-17 {#task-q-d-17}

| | |
| --- | --- |
| **Giao cho** | Full-stack |
| **Ưu tiên** | P0 |
| **Sprint** | 2 |
| **Loại** | undefined |
| **Map** | TASK-P2-04 |
| **Trạng thái** | ✅ |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md D-17.

ID: D-17 · Phần D · Ưu tiên P0 · Sprint 2
TIÊU ĐỀ: VAT 8% inclusive bill
QUYẾT ĐỊNH ĐÃ CHỐT: Tách dòng VAT
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.
TASK LIÊN QUAN: TASK-P2-04 ✅

NHIỆM VỤ:
1. Đọc D-17 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Tách dòng VAT

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[D-17] VAT 8% inclusive bill" + mô tả file đã sửa.
```

---

### TASK-Q-D-18 {#task-q-d-18}

| | |
| --- | --- |
| **Giao cho** | — |
| **Ưu tiên** | P2 |
| **Sprint** | — |
| **Loại** | defer |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md D-18.

ID: D-18 · Phần D · Ưu tiên P2 · Sprint —
TIÊU ĐỀ: Best-seller sort
QUYẾT ĐỊNH ĐÃ CHỐT: sort_order manual
LOẠI VIỆC: DEFER — KHÔNG implement trong phase hiện tại. Ghi backlog post-MVP.

NHIỆM VỤ: Xác nhận không code. Ghi note trong backlog nếu có ticket mở nhầm.

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: sort_order manual

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[D-18] Best-seller sort" + mô tả file đã sửa.
```

---

### TASK-Q-D-19 {#task-q-d-19}

| | |
| --- | --- |
| **Giao cho** | Backend |
| **Ưu tiên** | P1 |
| **Sprint** | 2 |
| **Loại** | seed |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md D-19.

ID: D-19 · Phần D · Ưu tiên P1 · Sprint 2
TIÊU ĐỀ: Giá đồng nhất 3 CN
QUYẾT ĐỊNH ĐÃ CHỐT: Same price all branches
LOẠI VIỆC: SEED — Cập nhật seed/import data (prisma/seed, staging JSON). Không hard-code trong app.

NHIỆM VỤ:
1. Đọc D-19 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Same price all branches

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[D-19] Giá đồng nhất 3 CN" + mô tả file đã sửa.
```

---

### TASK-Q-D-20 {#task-q-d-20}

| | |
| --- | --- |
| **Giao cho** | — |
| **Ưu tiên** | P2 |
| **Sprint** | — |
| **Loại** | defer |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md D-20.

ID: D-20 · Phần D · Ưu tiên P2 · Sprint —
TIÊU ĐỀ: Ảnh món
QUYẾT ĐỊNH ĐÃ CHỐT: Placeholder pilot
LOẠI VIỆC: DEFER — KHÔNG implement trong phase hiện tại. Ghi backlog post-MVP.

NHIỆM VỤ: Xác nhận không code. Ghi note trong backlog nếu có ticket mở nhầm.

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Placeholder pilot

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[D-20] Ảnh món" + mô tả file đã sửa.
```

---

### TASK-Q-D-21 {#task-q-d-21}

| | |
| --- | --- |
| **Giao cho** | Full-stack |
| **Ưu tiên** | P0 |
| **Sprint** | 2 |
| **Loại** | undefined |
| **User Story** | US-B04 |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md D-21.

ID: D-21 · Phần D · Ưu tiên P0 · Sprint 2
TIÊU ĐỀ: Modifier Size/Đường/Đá
QUYẾT ĐỊNH ĐÃ CHỐT: Nóng ẩn Đá; bánh không modifier
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.
USER STORY: US-B04

NHIỆM VỤ:
1. Đọc D-21 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Nóng ẩn Đá; bánh không modifier

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[D-21] Modifier Size/Đường/Đá" + mô tả file đã sửa.
```

---

### TASK-Q-D-22 {#task-q-d-22}

| | |
| --- | --- |
| **Giao cho** | Backend |
| **Ưu tiên** | P0 |
| **Sprint** | 2 |
| **Loại** | code |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md D-22.

ID: D-22 · Phần D · Ưu tiên P0 · Sprint 2
TIÊU ĐỀ: Phụ thu Size/topping
QUYẾT ĐỊNH ĐÃ CHỐT: Đường/Đá free
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.

NHIỆM VỤ:
1. Đọc D-22 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Đường/Đá free

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[D-22] Phụ thu Size/topping" + mô tả file đã sửa.
```

---

### TASK-Q-D-23 {#task-q-d-23}

| | |
| --- | --- |
| **Giao cho** | Full-stack |
| **Ưu tiên** | P1 |
| **Sprint** | 2 |
| **Loại** | code |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md D-23.

ID: D-23 · Phần D · Ưu tiên P1 · Sprint 2
TIÊU ĐỀ: Max 3 topping
QUYẾT ĐỊNH ĐÃ CHỐT: Phụ thu từng topping
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.

NHIỆM VỤ:
1. Đọc D-23 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Phụ thu từng topping

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[D-23] Max 3 topping" + mô tả file đã sửa.
```

---

### TASK-Q-D-24 {#task-q-d-24}

| | |
| --- | --- |
| **Giao cho** | Mobile |
| **Ưu tiên** | P1 |
| **Sprint** | 2 |
| **Loại** | code |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md D-24.

ID: D-24 · Phần D · Ưu tiên P1 · Sprint 2
TIÊU ĐỀ: Skip modal món đơn giản
QUYẾT ĐỊNH ĐÃ CHỐT: requiresCustomization false → thêm thẳng
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.

NHIỆM VỤ:
1. Đọc D-24 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: requiresCustomization false → thêm thẳng

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[D-24] Skip modal món đơn giản" + mô tả file đã sửa.
```

---

### TASK-Q-D-25 {#task-q-d-25}

| | |
| --- | --- |
| **Giao cho** | Full-stack |
| **Ưu tiên** | P1 |
| **Sprint** | 2 |
| **Loại** | undefined |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md D-25.

ID: D-25 · Phần D · Ưu tiên P1 · Sprint 2
TIÊU ĐỀ: Ghi chú món vs đơn
QUYẾT ĐỊNH ĐÃ CHỐT: baristaNote per line; internalNote per order
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.

NHIỆM VỤ:
1. Đọc D-25 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. B-32

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[D-25] Ghi chú món vs đơn" + mô tả file đã sửa.
```

---

### TASK-Q-D-26 {#task-q-d-26}

| | |
| --- | --- |
| **Giao cho** | Mobile |
| **Ưu tiên** | P1 |
| **Sprint** | 2 |
| **Loại** | code |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md D-26.

ID: D-26 · Phần D · Ưu tiên P1 · Sprint 2
TIÊU ĐỀ: Default modifier M
QUYẾT ĐỊNH ĐÃ CHỐT: M, đường/đá bình thường
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.

NHIỆM VỤ:
1. Đọc D-26 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: M, đường/đá bình thường

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[D-26] Default modifier M" + mô tả file đã sửa.
```

---

### TASK-Q-D-27 {#task-q-d-27}

| | |
| --- | --- |
| **Giao cho** | Backend |
| **Ưu tiên** | P0 |
| **Sprint** | 2 |
| **Loại** | undefined |
| **User Story** | US-B05 |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md D-27.

ID: D-27 · Phần D · Ưu tiên P0 · Sprint 2
TIÊU ĐỀ: Append vs new order
QUYẾT ĐỊNH ĐÃ CHỐT: Chưa PAID append; PAID new
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.
USER STORY: US-B05

NHIỆM VỤ:
1. Đọc D-27 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Chưa PAID append; PAID new

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[D-27] Append vs new order" + mô tả file đã sửa.
```

---

### TASK-Q-D-28 {#task-q-d-28}

| | |
| --- | --- |
| **Giao cho** | Full-stack |
| **Ưu tiên** | P0 |
| **Sprint** | 2 |
| **Loại** | code |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md D-28.

ID: D-28 · Phần D · Ưu tiên P0 · Sprint 2
TIÊU ĐỀ: Hủy PENDING + lý do
QUYẾT ĐỊNH ĐÃ CHỐT: Audit bắt buộc
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.

NHIỆM VỤ:
1. Đọc D-28 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Audit bắt buộc

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[D-28] Hủy PENDING + lý do" + mô tả file đã sửa.
```

---

### TASK-Q-D-29 {#task-q-d-29}

| | |
| --- | --- |
| **Giao cho** | Mobile |
| **Ưu tiên** | P1 |
| **Sprint** | 2 |
| **Loại** | code |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md D-29.

ID: D-29 · Phần D · Ưu tiên P1 · Sprint 2
TIÊU ĐỀ: Gửi bếp một phần
QUYẾT ĐỊNH ĐÃ CHỐT: Chọn món gửi
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.

NHIỆM VỤ:
1. Đọc D-29 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Chọn món gửi

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[D-29] Gửi bếp một phần" + mô tả file đã sửa.
```

---

### TASK-Q-D-30 {#task-q-d-30}

| | |
| --- | --- |
| **Giao cho** | Mobile |
| **Ưu tiên** | P1 |
| **Sprint** | 2 |
| **Loại** | undefined |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md D-30.

ID: D-30 · Phần D · Ưu tiên P1 · Sprint 2
TIÊU ĐỀ: Draft cart trước gửi bếp
QUYẾT ĐỊNH ĐÃ CHỐT: Local draft; sau gửi từ server
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.
FILE GỢI Ý: cart store

NHIỆM VỤ:
1. Đọc D-30 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Local draft; sau gửi từ server

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[D-30] Draft cart trước gửi bếp" + mô tả file đã sửa.
```

---

### TASK-Q-D-31 {#task-q-d-31}

| | |
| --- | --- |
| **Giao cho** | Mobile |
| **Ưu tiên** | P1 |
| **Sprint** | 2 |
| **Loại** | code |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md D-31.

ID: D-31 · Phần D · Ưu tiên P1 · Sprint 2
TIÊU ĐỀ: Toast + sound gửi bếp
QUYẾT ĐỊNH ĐÃ CHỐT: Tablet trạm; # mang đi
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.

NHIỆM VỤ:
1. Đọc D-31 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Tablet trạm; # mang đi

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[D-31] Toast + sound gửi bếp" + mô tả file đã sửa.
```

---

### TASK-Q-D-32 {#task-q-d-32}

| | |
| --- | --- |
| **Giao cho** | Full-stack |
| **Ưu tiên** | P1 |
| **Sprint** | 2 |
| **Loại** | code |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md D-32.

ID: D-32 · Phần D · Ưu tiên P1 · Sprint 2
TIÊU ĐỀ: Chặn món hết hàng lúc gửi
QUYẾT ĐỊNH ĐÃ CHỐT: Dialog liệt kê
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.

NHIỆM VỤ:
1. Đọc D-32 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Dialog liệt kê

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[D-32] Chặn món hết hàng lúc gửi" + mô tả file đã sửa.
```

---

### TASK-Q-D-33 {#task-q-d-33}

| | |
| --- | --- |
| **Giao cho** | Mobile |
| **Ưu tiên** | P1 |
| **Sprint** | 2 |
| **Loại** | undefined |
| **Map** | TASK-P2-03b |
| **Trạng thái** | ✅ |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md D-33.

ID: D-33 · Phần D · Ưu tiên P1 · Sprint 2
TIÊU ĐỀ: Tab Bếp demo S2
QUYẾT ĐỊNH ĐÃ CHỐT: Polling PENDING queue
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.
TASK LIÊN QUAN: TASK-P2-03b ✅

NHIỆM VỤ:
1. Đọc D-33 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Polling PENDING queue

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[D-33] Tab Bếp demo S2" + mô tả file đã sửa.
```

---

### TASK-Q-E-01 {#task-q-e-01}

| | |
| --- | --- |
| **Giao cho** | Full-stack |
| **Ưu tiên** | P0 |
| **Sprint** | 3 |
| **Loại** | undefined |
| **User Story** | US-B06 |
| **Map** | TASK-P2-10 |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md E-01.

ID: E-01 · Phần E · Ưu tiên P0 · Sprint 3
TIÊU ĐỀ: Thanh toán READY default
QUYẾT ĐỊNH ĐÃ CHỐT: Cho trả trước nếu cần
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.
USER STORY: US-B06
TASK LIÊN QUAN: TASK-P2-10

NHIỆM VỤ:
1. Đọc E-01 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Cho trả trước nếu cần

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[E-01] Thanh toán READY default" + mô tả file đã sửa.
```

---

### TASK-Q-E-02 {#task-q-e-02}

| | |
| --- | --- |
| **Giao cho** | Mobile |
| **Ưu tiên** | P1 |
| **Sprint** | 3 |
| **Loại** | undefined |
| **User Story** | US-B06 |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md E-02.

ID: E-02 · Phần E · Ưu tiên P1 · Sprint 3
TIÊU ĐỀ: Mệnh giá nhanh TM
QUYẾT ĐỊNH ĐÃ CHỐT: 50/100/200/500k
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.
USER STORY: US-B06

NHIỆM VỤ:
1. Đọc E-02 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: 50/100/200/500k

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[E-02] Mệnh giá nhanh TM" + mô tả file đã sửa.
```

---

### TASK-Q-E-03 {#task-q-e-03}

| | |
| --- | --- |
| **Giao cho** | Mobile |
| **Ưu tiên** | P2 |
| **Sprint** | 3 |
| **Loại** | code |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md E-03.

ID: E-03 · Phần E · Ưu tiên P2 · Sprint 3
TIÊU ĐỀ: Không làm tròn lẻ
QUYẾT ĐỊNH ĐÃ CHỐT: Thu đúng bill
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.

NHIỆM VỤ:
1. Đọc E-03 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Thu đúng bill

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[E-03] Không làm tròn lẻ" + mô tả file đã sửa.
```

---

### TASK-Q-E-04 {#task-q-e-04}

| | |
| --- | --- |
| **Giao cho** | Backend |
| **Ưu tiên** | P0 |
| **Sprint** | 3 |
| **Loại** | seed |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md E-04.

ID: E-04 · Phần E · Ưu tiên P0 · Sprint 3
TIÊU ĐỀ: STK theo chủ quán
QUYẾT ĐỊNH ĐÃ CHỐT: Per branch config
LOẠI VIỆC: SEED — Cập nhật seed/import data (prisma/seed, staging JSON). Không hard-code trong app.

NHIỆM VỤ:
1. Đọc E-04 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Chờ Owner cung cấp STK

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[E-04] STK theo chủ quán" + mô tả file đã sửa.
```

---

### TASK-Q-E-05 {#task-q-e-05}

| | |
| --- | --- |
| **Giao cho** | Full-stack |
| **Ưu tiên** | P0 |
| **Sprint** | 3 |
| **Loại** | undefined |
| **User Story** | US-B07 |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md E-05.

ID: E-05 · Phần E · Ưu tiên P0 · Sprint 3
TIÊU ĐỀ: VietQR dynamic amount
QUYẾT ĐỊNH ĐÃ CHỐT: Bắt buộc MVP
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.
USER STORY: US-B07

NHIỆM VỤ:
1. Đọc E-05 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Bắt buộc MVP

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[E-05] VietQR dynamic amount" + mô tả file đã sửa.
```

---

### TASK-Q-E-06 {#task-q-e-06}

| | |
| --- | --- |
| **Giao cho** | Mobile |
| **Ưu tiên** | P1 |
| **Sprint** | 3 |
| **Loại** | code |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md E-06.

ID: E-06 · Phần E · Ưu tiên P1 · Sprint 3
TIÊU ĐỀ: CK 4 số cuối optional
QUYẾT ĐỊNH ĐÃ CHỐT: Khuyến khích nhập
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.

NHIỆM VỤ:
1. Đọc E-06 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Khuyến khích nhập

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[E-06] CK 4 số cuối optional" + mô tả file đã sửa.
```

---

### TASK-Q-E-07 {#task-q-e-07}

| | |
| --- | --- |
| **Giao cho** | Ops |
| **Ưu tiên** | P1 |
| **Sprint** | — |
| **Loại** | ops |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md E-07.

ID: E-07 · Phần E · Ưu tiên P1 · Sprint —
TIÊU ĐỀ: CK chưa vào — chụp bill
QUYẾT ĐỊNH ĐÃ CHỐT: QL chốt sau
LOẠI VIỆC: OPS — Thực hiện quy trình vận hành / deploy / meeting — không hoặc ít code.

NHIỆM VỤ:
1. Đọc E-07 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. SOP training

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[E-07] CK chưa vào — chụp bill" + mô tả file đã sửa.
```

---

### TASK-Q-E-08 {#task-q-e-08}

| | |
| --- | --- |
| **Giao cho** | Mobile |
| **Ưu tiên** | P1 |
| **Sprint** | 6 |
| **Loại** | defer |
| **User Story** | US-B08 |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md E-08.

ID: E-08 · Phần E · Ưu tiên P1 · Sprint 6
TIÊU ĐỀ: Thẻ ghi nhận thủ công
QUYẾT ĐỊNH ĐÃ CHỐT: Không POS
LOẠI VIỆC: DEFER — KHÔNG implement trong phase hiện tại. Ghi backlog post-MVP.
USER STORY: US-B08

NHIỆM VỤ: Xác nhận không code. Ghi note trong backlog nếu có ticket mở nhầm.

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Không POS

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[E-08] Thẻ ghi nhận thủ công" + mô tả file đã sửa.
```

---

### TASK-Q-E-09 {#task-q-e-09}

| | |
| --- | --- |
| **Giao cho** | Full-stack |
| **Ưu tiên** | P1 |
| **Sprint** | 3 |
| **Loại** | undefined |
| **User Story** | US-B09 |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md E-09.

ID: E-09 · Phần E · Ưu tiên P1 · Sprint 3
TIÊU ĐỀ: Pilot TM+CK only
QUYẾT ĐỊNH ĐÃ CHỐT: VNPay sandbox dev only
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.
USER STORY: US-B09

NHIỆM VỤ:
1. Đọc E-09 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: VNPay sandbox dev only

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[E-09] Pilot TM+CK only" + mô tả file đã sửa.
```

---

### TASK-Q-E-10 {#task-q-e-10}

| | |
| --- | --- |
| **Giao cho** | Backend |
| **Ưu tiên** | P0 |
| **Sprint** | 3 |
| **Loại** | code |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md E-10.

ID: E-10 · Phần E · Ưu tiên P0 · Sprint 3
TIÊU ĐỀ: PAID → bàn EMPTY
QUYẾT ĐỊNH ĐÃ CHỐT: Tự EMPTY pilot
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.

NHIỆM VỤ:
1. Đọc E-10 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Tự EMPTY pilot

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[E-10] PAID → bàn EMPTY" + mô tả file đã sửa.
```

---

### TASK-Q-E-11 {#task-q-e-11}

| | |
| --- | --- |
| **Giao cho** | Backend |
| **Ưu tiên** | P2 |
| **Sprint** | 6 |
| **Loại** | code |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md E-11.

ID: E-11 · Phần E · Ưu tiên P2 · Sprint 6
TIÊU ĐỀ: Void payment QL/Owner
QUYẾT ĐỊNH ĐÃ CHỐT: Lý do + audit
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.

NHIỆM VỤ:
1. Đọc E-11 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Lý do + audit

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[E-11] Void payment QL/Owner" + mô tả file đã sửa.
```

---

### TASK-Q-E-12 {#task-q-e-12}

| | |
| --- | --- |
| **Giao cho** | Mobile |
| **Ưu tiên** | P0 |
| **Sprint** | 3 |
| **Loại** | undefined |
| **User Story** | US-B10 |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md E-12.

ID: E-12 · Phần E · Ưu tiên P0 · Sprint 3
TIÊU ĐỀ: Tab đang phục vụ
QUYẾT ĐỊNH ĐÃ CHỐT: PENDING+MAKING+READY
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.
USER STORY: US-B10

NHIỆM VỤ:
1. Đọc E-12 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: PENDING+MAKING+READY

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[E-12] Tab đang phục vụ" + mô tả file đã sửa.
```

---

### TASK-Q-E-13 {#task-q-e-13}

| | |
| --- | --- |
| **Giao cho** | Mobile |
| **Ưu tiên** | P0 |
| **Sprint** | 3 |
| **Loại** | undefined |
| **User Story** | US-B10 |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md E-13.

ID: E-13 · Phần E · Ưu tiên P0 · Sprint 3
TIÊU ĐỀ: Tab chờ thanh toán
QUYẾT ĐỊNH ĐÃ CHỐT: delivered + chưa PAID
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.
USER STORY: US-B10

NHIỆM VỤ:
1. Đọc E-13 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: delivered + chưa PAID

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[E-13] Tab chờ thanh toán" + mô tả file đã sửa.
```

---

### TASK-Q-E-14 {#task-q-e-14}

| | |
| --- | --- |
| **Giao cho** | Mobile |
| **Ưu tiên** | P1 |
| **Sprint** | 3 |
| **Loại** | code |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md E-14.

ID: E-14 · Phần E · Ưu tiên P1 · Sprint 3
TIÊU ĐỀ: Sort đơn
QUYẾT ĐỊNH ĐÃ CHỐT: Chờ lâu trước; lịch sử mới trước
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.

NHIỆM VỤ:
1. Đọc E-14 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Chờ lâu trước; lịch sử mới trước

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[E-14] Sort đơn" + mô tả file đã sửa.
```

---

### TASK-Q-E-15 {#task-q-e-15}

| | |
| --- | --- |
| **Giao cho** | Mobile |
| **Ưu tiên** | P1 |
| **Sprint** | 3 |
| **Loại** | code |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md E-15.

ID: E-15 · Phần E · Ưu tiên P1 · Sprint 3
TIÊU ĐỀ: Filter bàn/loại/trạng thái
QUYẾT ĐỊNH ĐÃ CHỐT: Không filter thu ngân
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.

NHIỆM VỤ:
1. Đọc E-15 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Không filter thu ngân

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[E-15] Filter bàn/loại/trạng thái" + mô tả file đã sửa.
```

---

### TASK-Q-E-16 {#task-q-e-16}

| | |
| --- | --- |
| **Giao cho** | Mobile |
| **Ưu tiên** | P0 |
| **Sprint** | 3 |
| **Loại** | undefined |
| **User Story** | US-B11 |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md E-16.

ID: E-16 · Phần E · Ưu tiên P0 · Sprint 3
TIÊU ĐỀ: Lịch sử trong ca/hôm nay
QUYẾT ĐỊNH ĐÃ CHỐT: Theo ca B-07
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.
USER STORY: US-B11

NHIỆM VỤ:
1. Đọc E-16 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Theo ca B-07

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[E-16] Lịch sử trong ca/hôm nay" + mô tả file đã sửa.
```

---

### TASK-Q-E-17 {#task-q-e-17}

| | |
| --- | --- |
| **Giao cho** | Mobile |
| **Ưu tiên** | P1 |
| **Sprint** | 3 |
| **Loại** | code |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md E-17.

ID: E-17 · Phần E · Ưu tiên P1 · Sprint 3
TIÊU ĐỀ: Xem tất cả đơn CN
QUYẾT ĐỊNH ĐÃ CHỐT: Tablet chung
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.

NHIỆM VỤ:
1. Đọc E-17 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Tablet chung

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[E-17] Xem tất cả đơn CN" + mô tả file đã sửa.
```

---

### TASK-Q-E-18 {#task-q-e-18}

| | |
| --- | --- |
| **Giao cho** | Mobile |
| **Ưu tiên** | P2 |
| **Sprint** | 6 |
| **Loại** | defer |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md E-18.

ID: E-18 · Phần E · Ưu tiên P2 · Sprint 6
TIÊU ĐỀ: Chi tiết PAID; export sau
QUYẾT ĐỊNH ĐÃ CHỐT: Xem trên app; CSV post-MVP
LOẠI VIỆC: DEFER — KHÔNG implement trong phase hiện tại. Ghi backlog post-MVP.

NHIỆM VỤ: Xác nhận không code. Ghi note trong backlog nếu có ticket mở nhầm.

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Xem trên app; CSV post-MVP

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[E-18] Chi tiết PAID; export sau" + mô tả file đã sửa.
```

---

### TASK-Q-F-01 {#task-q-f-01}

| | |
| --- | --- |
| **Giao cho** | Full-stack |
| **Ưu tiên** | P0 |
| **Sprint** | 4 |
| **Loại** | undefined |
| **User Story** | US-C01 |
| **Map** | TASK-P2-11 |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md F-01.

ID: F-01 · Phần F · Ưu tiên P0 · Sprint 4
TIÊU ĐỀ: WebSocket bếp
QUYẾT ĐỊNH ĐÃ CHỐT: Primary; SSE fallback
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.
USER STORY: US-C01
TASK LIÊN QUAN: TASK-P2-11

NHIỆM VỤ:
1. Đọc F-01 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Primary; SSE fallback

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[F-01] WebSocket bếp" + mô tả file đã sửa.
```

---

### TASK-Q-F-02 {#task-q-f-02}

| | |
| --- | --- |
| **Giao cho** | Backend |
| **Ưu tiên** | P0 |
| **Sprint** | 4 |
| **Loại** | code |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md F-02.

ID: F-02 · Phần F · Ưu tiên P0 · Sprint 4
TIÊU ĐỀ: Queue chung không claim
QUYẾT ĐỊNH ĐÃ CHỐT: 2 NV shared queue
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.

NHIỆM VỤ:
1. Đọc F-02 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: 2 NV shared queue

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[F-02] Queue chung không claim" + mô tả file đã sửa.
```

---

### TASK-Q-F-03 {#task-q-f-03}

| | |
| --- | --- |
| **Giao cho** | Mobile |
| **Ưu tiên** | P0 |
| **Sprint** | 4 |
| **Loại** | code |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md F-03.

ID: F-03 · Phần F · Ưu tiên P0 · Sprint 4
TIÊU ĐỀ: FIFO queue
QUYẾT ĐỊNH ĐÃ CHỐT: Badge mang đi >5p v2.1
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.

NHIỆM VỤ:
1. Đọc F-03 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Badge mang đi >5p v2.1

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[F-03] FIFO queue" + mô tả file đã sửa.
```

---

### TASK-Q-F-04 {#task-q-f-04}

| | |
| --- | --- |
| **Giao cho** | Mobile |
| **Ưu tiên** | P1 |
| **Sprint** | 4 |
| **Loại** | code |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md F-04.

ID: F-04 · Phần F · Ưu tiên P1 · Sprint 4
TIÊU ĐỀ: Cảnh báo 5p/10p
QUYẾT ĐỊNH ĐÃ CHỐT: Vàng 5p đỏ 10p
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.

NHIỆM VỤ:
1. Đọc F-04 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Vàng 5p đỏ 10p

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[F-04] Cảnh báo 5p/10p" + mô tả file đã sửa.
```

---

### TASK-Q-F-05 {#task-q-f-05}

| | |
| --- | --- |
| **Giao cho** | Mobile |
| **Ưu tiên** | P1 |
| **Sprint** | 4 |
| **Loại** | code |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md F-05.

ID: F-05 · Phần F · Ưu tiên P1 · Sprint 4
TIÊU ĐỀ: Âm thanh đơn mới
QUYẾT ĐỊNH ĐÃ CHỐT: Default on tablet
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.

NHIỆM VỤ:
1. Đọc F-05 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Default on tablet

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[F-05] Âm thanh đơn mới" + mô tả file đã sửa.
```

---

### TASK-Q-F-06 {#task-q-f-06}

| | |
| --- | --- |
| **Giao cho** | Mobile |
| **Ưu tiên** | P1 |
| **Sprint** | 2 |
| **Loại** | undefined |
| **Map** | TASK-P2-03b |
| **Trạng thái** | ✅ |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md F-06.

ID: F-06 · Phần F · Ưu tiên P1 · Sprint 2
TIÊU ĐỀ: Tablet bếp station account
QUYẾT ĐỊNH ĐÃ CHỐT: Chung + picker NV
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.
TASK LIÊN QUAN: TASK-P2-03b ✅

NHIỆM VỤ:
1. Đọc F-06 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Chung + picker NV

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[F-06] Tablet bếp station account" + mô tả file đã sửa.
```

---

### TASK-Q-F-07 {#task-q-f-07}

| | |
| --- | --- |
| **Giao cho** | Mobile |
| **Ưu tiên** | P1 |
| **Sprint** | 4 |
| **Loại** | undefined |
| **User Story** | US-C02 |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md F-07.

ID: F-07 · Phần F · Ưu tiên P1 · Sprint 4
TIÊU ĐỀ: Modifier tags UI
QUYẾT ĐỊNH ĐÃ CHỐT: Tag màu + text
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.
USER STORY: US-C02

NHIỆM VỤ:
1. Đọc F-07 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Tag màu + text

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[F-07] Modifier tags UI" + mô tả file đã sửa.
```

---

### TASK-Q-F-08 {#task-q-f-08}

| | |
| --- | --- |
| **Giao cho** | Mobile |
| **Ưu tiên** | P1 |
| **Sprint** | 4 |
| **Loại** | code |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md F-08.

ID: F-08 · Phần F · Ưu tiên P1 · Sprint 4
TIÊU ĐỀ: Highlight baristaNote
QUYẾT ĐỊNH ĐÃ CHỐT: Vàng/đỏ gấp
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.

NHIỆM VỤ:
1. Đọc F-08 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Vàng/đỏ gấp

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[F-08] Highlight baristaNote" + mô tả file đã sửa.
```

---

### TASK-Q-F-09 {#task-q-f-09}

| | |
| --- | --- |
| **Giao cho** | Backend |
| **Ưu tiên** | P0 |
| **Sprint** | 4 |
| **Loại** | undefined |
| **User Story** | US-C03 |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md F-09.

ID: F-09 · Phần F · Ưu tiên P0 · Sprint 4
TIÊU ĐỀ: 1 NV/đơn MAKING
QUYẾT ĐỊNH ĐÃ CHỐT: Tránh trùng pha
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.
USER STORY: US-C03

NHIỆM VỤ:
1. Đọc F-09 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Tránh trùng pha

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[F-09] 1 NV/đơn MAKING" + mô tả file đã sửa.
```

---

### TASK-Q-F-10 {#task-q-f-10}

| | |
| --- | --- |
| **Giao cho** | Mobile |
| **Ưu tiên** | P1 |
| **Sprint** | 4 |
| **Loại** | code |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md F-10.

ID: F-10 · Phần F · Ưu tiên P1 · Sprint 4
TIÊU ĐỀ: Qty x2 badge
QUYẾT ĐỊNH ĐÃ CHỐT: Tick cả dòng
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.

NHIỆM VỤ:
1. Đọc F-10 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Tick cả dòng

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[F-10] Qty x2 badge" + mô tả file đã sửa.
```

---

### TASK-Q-F-11 {#task-q-f-11}

| | |
| --- | --- |
| **Giao cho** | Mobile |
| **Ưu tiên** | P1 |
| **Sprint** | 4 |
| **Loại** | code |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md F-11.

ID: F-11 · Phần F · Ưu tiên P1 · Sprint 4
TIÊU ĐỀ: Timer từ MAKING
QUYẾT ĐỊNH ĐÃ CHỐT: Hiện chờ từ PENDING nếu >5p
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.

NHIỆM VỤ:
1. Đọc F-11 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Hiện chờ từ PENDING nếu >5p

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[F-11] Timer từ MAKING" + mô tả file đã sửa.
```

---

### TASK-Q-F-12 {#task-q-f-12}

| | |
| --- | --- |
| **Giao cho** | Full-stack |
| **Ưu tiên** | P0 |
| **Sprint** | 2 |
| **Loại** | undefined |
| **Map** | TASK-P2-02 |
| **Trạng thái** | ✅ |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md F-12.

ID: F-12 · Phần F · Ưu tiên P0 · Sprint 2
TIÊU ĐỀ: Xóa SERVING
QUYẾT ĐỊNH ĐÃ CHỐT: deliveredAt
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.
TASK LIÊN QUAN: TASK-P2-02 ✅

NHIỆM VỤ:
1. Đọc F-12 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: deliveredAt

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[F-12] Xóa SERVING" + mô tả file đã sửa.
```

---

### TASK-Q-F-13 {#task-q-f-13}

| | |
| --- | --- |
| **Giao cho** | Mobile |
| **Ưu tiên** | P0 |
| **Sprint** | 6 |
| **Loại** | undefined |
| **User Story** | US-E02 |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md F-13.

ID: F-13 · Phần F · Ưu tiên P0 · Sprint 6
TIÊU ĐỀ: Push READY
QUYẾT ĐỊNH ĐÃ CHỐT: Tablet in-app; ĐT Expo push v2
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.
USER STORY: US-E02

NHIỆM VỤ:
1. Đọc F-13 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Tablet in-app; ĐT Expo push v2

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[F-13] Push READY" + mô tả file đã sửa.
```

---

### TASK-Q-F-14 {#task-q-f-14}

| | |
| --- | --- |
| **Giao cho** | Full-stack |
| **Ưu tiên** | P1 |
| **Sprint** | 6 |
| **Loại** | code |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md F-14.

ID: F-14 · Phần F · Ưu tiên P1 · Sprint 6
TIÊU ĐỀ: READY >10p alert QL
QUYẾT ĐỊNH ĐÃ CHỐT: Notify QL
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.

NHIỆM VỤ:
1. Đọc F-14 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Notify QL

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[F-14] READY >10p alert QL" + mô tả file đã sửa.
```

---

### TASK-Q-F-15 {#task-q-f-15}

| | |
| --- | --- |
| **Giao cho** | Backend |
| **Ưu tiên** | P1 |
| **Sprint** | 4 |
| **Loại** | undefined |
| **User Story** | US-C04 |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md F-15.

ID: F-15 · Phần F · Ưu tiên P1 · Sprint 4
TIÊU ĐỀ: Revert READY→MAKING
QUYẾT ĐỊNH ĐÃ CHỐT: Lý do + audit
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.
USER STORY: US-C04

NHIỆM VỤ:
1. Đọc F-15 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Lý do + audit

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[F-15] Revert READY→MAKING" + mô tả file đã sửa.
```

---

### TASK-Q-F-16 {#task-q-f-16}

| | |
| --- | --- |
| **Giao cho** | Mobile |
| **Ưu tiên** | P0 |
| **Sprint** | 4 |
| **Loại** | code |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md F-16.

ID: F-16 · Phần F · Ưu tiên P0 · Sprint 4
TIÊU ĐỀ: WS fallback polling 10s
QUYẾT ĐỊNH ĐÃ CHỐT: Banner chậm
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.

NHIỆM VỤ:
1. Đọc F-16 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Banner chậm

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[F-16] WS fallback polling 10s" + mô tả file đã sửa.
```

---

### TASK-Q-F-17 {#task-q-f-17}

| | |
| --- | --- |
| **Giao cho** | — |
| **Ưu tiên** | P1 |
| **Sprint** | — |
| **Loại** | defer |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md F-17.

ID: F-17 · Phần F · Ưu tiên P1 · Sprint —
TIÊU ĐỀ: No foreground service
QUYẾT ĐỊNH ĐÃ CHỐT: Tablet always on
LOẠI VIỆC: DEFER — KHÔNG implement trong phase hiện tại. Ghi backlog post-MVP.

NHIỆM VỤ: Xác nhận không code. Ghi note trong backlog nếu có ticket mở nhầm.

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Tablet always on

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[F-17] No foreground service" + mô tả file đã sửa.
```

---

### TASK-Q-G-01 {#task-q-g-01}

| | |
| --- | --- |
| **Giao cho** | Full-stack |
| **Ưu tiên** | P0 |
| **Sprint** | 5 |
| **Loại** | undefined |
| **User Story** | US-D01 |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md G-01.

ID: G-01 · Phần G · Ưu tiên P0 · Sprint 5
TIÊU ĐỀ: Dashboard số đơn PAID
QUYẾT ĐỊNH ĐÃ CHỐT: Proxy khách
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.
USER STORY: US-D01

NHIỆM VỤ:
1. Đọc G-01 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Proxy khách

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[G-01] Dashboard số đơn PAID" + mô tả file đã sửa.
```

---

### TASK-Q-G-02 {#task-q-g-02}

| | |
| --- | --- |
| **Giao cho** | Backend |
| **Ưu tiên** | P1 |
| **Sprint** | 5 |
| **Loại** | code |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md G-02.

ID: G-02 · Phần G · Ưu tiên P1 · Sprint 5
TIÊU ĐỀ: Timezone VN
QUYẾT ĐỊNH ĐÃ CHỐT: Asia/Ho_Chi_Minh
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.

NHIỆM VỤ:
1. Đọc G-02 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Asia/Ho_Chi_Minh

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[G-02] Timezone VN" + mô tả file đã sửa.
```

---

### TASK-Q-G-03 {#task-q-g-03}

| | |
| --- | --- |
| **Giao cho** | Backend |
| **Ưu tiên** | P1 |
| **Sprint** | 5 |
| **Loại** | undefined |
| **User Story** | US-D02 |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md G-03.

ID: G-03 · Phần G · Ưu tiên P1 · Sprint 5
TIÊU ĐỀ: Doanh thu gross
QUYẾT ĐỊNH ĐÃ CHỐT: Không trừ phí CK
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.
USER STORY: US-D02

NHIỆM VỤ:
1. Đọc G-03 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Không trừ phí CK

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[G-03] Doanh thu gross" + mô tả file đã sửa.
```

---

### TASK-Q-G-04 {#task-q-g-04}

| | |
| --- | --- |
| **Giao cho** | Mobile |
| **Ưu tiên** | P1 |
| **Sprint** | 5 |
| **Loại** | code |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md G-04.

ID: G-04 · Phần G · Ưu tiên P1 · Sprint 5
TIÊU ĐỀ: Top 10 món top 5 cat
QUYẾT ĐỊNH ĐÃ CHỐT: Dashboard
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.

NHIỆM VỤ:
1. Đọc G-04 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Dashboard

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[G-04] Top 10 món top 5 cat" + mô tả file đã sửa.
```

---

### TASK-Q-G-05 {#task-q-g-05}

| | |
| --- | --- |
| **Giao cho** | Mobile |
| **Ưu tiên** | P1 |
| **Sprint** | 5 |
| **Loại** | undefined |
| **User Story** | US-D01 |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md G-05.

ID: G-05 · Phần G · Ưu tiên P1 · Sprint 5
TIÊU ĐỀ: Owner multi-CN dashboard
QUYẾT ĐỊNH ĐÃ CHỐT: Drill-down
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.
USER STORY: US-D01

NHIỆM VỤ:
1. Đọc G-05 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Drill-down

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[G-05] Owner multi-CN dashboard" + mô tả file đã sửa.
```

---

### TASK-Q-G-06 {#task-q-g-06}

| | |
| --- | --- |
| **Giao cho** | Backend |
| **Ưu tiên** | P0 |
| **Sprint** | 5 |
| **Loại** | code |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md G-06.

ID: G-06 · Phần G · Ưu tiên P0 · Sprint 5
TIÊU ĐỀ: Doanh thu gộp ca
QUYẾT ĐỊNH ĐÃ CHỐT: Không tách NV
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.

NHIỆM VỤ:
1. Đọc G-06 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Không tách NV

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[G-06] Doanh thu gộp ca" + mô tả file đã sửa.
```

---

### TASK-Q-G-07 {#task-q-g-07}

| | |
| --- | --- |
| **Giao cho** | Mobile |
| **Ưu tiên** | P1 |
| **Sprint** | 5 |
| **Loại** | undefined |
| **User Story** | US-D03 |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md G-07.

ID: G-07 · Phần G · Ưu tiên P1 · Sprint 5
TIÊU ĐỀ: Form kết ca TM
QUYẾT ĐỊNH ĐÃ CHỐT: Chênh lệch bắt buộc ghi chú
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.
USER STORY: US-D03

NHIỆM VỤ:
1. Đọc G-07 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Chênh lệch bắt buộc ghi chú

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[G-07] Form kết ca TM" + mô tả file đã sửa.
```

---

### TASK-Q-G-08 {#task-q-g-08}

| | |
| --- | --- |
| **Giao cho** | Mobile |
| **Ưu tiên** | P1 |
| **Sprint** | 5 |
| **Loại** | code |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md G-08.

ID: G-08 · Phần G · Ưu tiên P1 · Sprint 5
TIÊU ĐỀ: Kết ca logout ĐT
QUYẾT ĐỊNH ĐÃ CHỐT: Tablet không force
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.

NHIỆM VỤ:
1. Đọc G-08 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Tablet không force

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[G-08] Kết ca logout ĐT" + mô tả file đã sửa.
```

---

### TASK-Q-G-09 {#task-q-g-09}

| | |
| --- | --- |
| **Giao cho** | Full-stack |
| **Ưu tiên** | P0 |
| **Sprint** | 5 |
| **Loại** | undefined |
| **User Story** | US-D04 |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md G-09.

ID: G-09 · Phần G · Ưu tiên P0 · Sprint 5
TIÊU ĐỀ: CRUD menu soft-hide
QUYẾT ĐỊNH ĐÃ CHỐT: Xóa cứng Owner only
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.
USER STORY: US-D04

NHIỆM VỤ:
1. Đọc G-09 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Xóa cứng Owner only

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[G-09] CRUD menu soft-hide" + mô tả file đã sửa.
```

---

### TASK-Q-G-10 {#task-q-g-10}

| | |
| --- | --- |
| **Giao cho** | Backend |
| **Ưu tiên** | P1 |
| **Sprint** | 5 |
| **Loại** | code |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md G-10.

ID: G-10 · Phần G · Ưu tiên P1 · Sprint 5
TIÊU ĐỀ: Sửa giá ngay
QUYẾT ĐỊNH ĐÃ CHỐT: Audit; đơn mới apply
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.

NHIỆM VỤ:
1. Đọc G-10 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Audit; đơn mới apply

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[G-10] Sửa giá ngay" + mô tả file đã sửa.
```

---

### TASK-Q-G-11 {#task-q-g-11}

| | |
| --- | --- |
| **Giao cho** | — |
| **Ưu tiên** | P2 |
| **Sprint** | — |
| **Loại** | defer |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md G-11.

ID: G-11 · Phần G · Ưu tiên P2 · Sprint —
TIÊU ĐỀ: Upload ảnh món
QUYẾT ĐỊNH ĐÃ CHỐT: v2.1
LOẠI VIỆC: DEFER — KHÔNG implement trong phase hiện tại. Ghi backlog post-MVP.

NHIỆM VỤ: Xác nhận không code. Ghi note trong backlog nếu có ticket mở nhầm.

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: v2.1

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[G-11] Upload ảnh món" + mô tả file đã sửa.
```

---

### TASK-Q-G-12 {#task-q-g-12}

| | |
| --- | --- |
| **Giao cho** | — |
| **Ưu tiên** | P2 |
| **Sprint** | — |
| **Loại** | defer |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md G-12.

ID: G-12 · Phần G · Ưu tiên P2 · Sprint —
TIÊU ĐỀ: Modifier template UI
QUYẾT ĐỊNH ĐÃ CHỐT: Post-MVP
LOẠI VIỆC: DEFER — KHÔNG implement trong phase hiện tại. Ghi backlog post-MVP.

NHIỆM VỤ: Xác nhận không code. Ghi note trong backlog nếu có ticket mở nhầm.

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Post-MVP

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[G-12] Modifier template UI" + mô tả file đã sửa.
```

---

### TASK-Q-G-13 {#task-q-g-13}

| | |
| --- | --- |
| **Giao cho** | Backend |
| **Ưu tiên** | P1 |
| **Sprint** | 5 |
| **Loại** | undefined |
| **User Story** | US-D05 |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md G-13.

ID: G-13 · Phần G · Ưu tiên P1 · Sprint 5
TIÊU ĐỀ: NV active flag
QUYẾT ĐỊNH ĐÃ CHỐT: Manager set isActive
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.
USER STORY: US-D05

NHIỆM VỤ:
1. Đọc G-13 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Manager set isActive

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[G-13] NV active flag" + mô tả file đã sửa.
```

---

### TASK-Q-G-14 {#task-q-g-14}

| | |
| --- | --- |
| **Giao cho** | Full-stack |
| **Ưu tiên** | P1 |
| **Sprint** | 5 |
| **Loại** | code |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md G-14.

ID: G-14 · Phần G · Ưu tiên P1 · Sprint 5
TIÊU ĐỀ: Tạo NV trên app
QUYẾT ĐỊNH ĐÃ CHỐT: Pilot seed; v2 Owner tạo
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.

NHIỆM VỤ:
1. Đọc G-14 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Pilot seed; v2 Owner tạo

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[G-14] Tạo NV trên app" + mô tả file đã sửa.
```

---

### TASK-Q-G-15 {#task-q-g-15}

| | |
| --- | --- |
| **Giao cho** | Full-stack |
| **Ưu tiên** | P0 |
| **Sprint** | 5 |
| **Loại** | undefined |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md G-15.

ID: G-15 · Phần G · Ưu tiên P0 · Sprint 5
TIÊU ĐỀ: BRANCH_ASSIGNMENT pilot
QUYẾT ĐỊNH ĐÃ CHỐT: QL đề xuất Owner duyệt
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.
FILE GỢI Ý: BRANCH_ASSIGNMENT.md

NHIỆM VỤ:
1. Đọc G-15 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: QL đề xuất Owner duyệt

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[G-15] BRANCH_ASSIGNMENT pilot" + mô tả file đã sửa.
```

---

### TASK-Q-G-16 {#task-q-g-16}

| | |
| --- | --- |
| **Giao cho** | Full-stack |
| **Ưu tiên** | P1 |
| **Sprint** | 6 |
| **Loại** | code |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md G-16.

ID: G-16 · Phần G · Ưu tiên P1 · Sprint 6
TIÊU ĐỀ: Push duyệt CN
QUYẾT ĐỊNH ĐÃ CHỐT: MVP v2
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.

NHIỆM VỤ:
1. Đọc G-16 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: MVP v2

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[G-16] Push duyệt CN" + mô tả file đã sửa.
```

---

### TASK-Q-G-17 {#task-q-g-17}

| | |
| --- | --- |
| **Giao cho** | — |
| **Ưu tiên** | P2 |
| **Sprint** | — |
| **Loại** | defer |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md G-17.

ID: G-17 · Phần G · Ưu tiên P2 · Sprint —
TIÊU ĐỀ: Lịch ca NV
QUYẾT ĐỊNH ĐÃ CHỐT: Ngoài MVP
LOẠI VIỆC: DEFER — KHÔNG implement trong phase hiện tại. Ghi backlog post-MVP.

NHIỆM VỤ: Xác nhận không code. Ghi note trong backlog nếu có ticket mở nhầm.

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Ngoài MVP

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[G-17] Lịch ca NV" + mô tả file đã sửa.
```

---

### TASK-Q-G-18 {#task-q-g-18}

| | |
| --- | --- |
| **Giao cho** | Mobile |
| **Ưu tiên** | P1 |
| **Sprint** | 5 |
| **Loại** | undefined |
| **User Story** | US-E01 |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md G-18.

ID: G-18 · Phần G · Ưu tiên P1 · Sprint 5
TIÊU ĐỀ: QL quản lý bàn
QUYẾT ĐỊNH ĐÃ CHỐT: Pilot seed; v2 thêm/MAINTENANCE
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.
USER STORY: US-E01

NHIỆM VỤ:
1. Đọc G-18 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Pilot seed; v2 thêm/MAINTENANCE

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[G-18] QL quản lý bàn" + mô tả file đã sửa.
```

---

### TASK-Q-G-19 {#task-q-g-19}

| | |
| --- | --- |
| **Giao cho** | Backend |
| **Ưu tiên** | P1 |
| **Sprint** | 5 |
| **Loại** | code |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md G-19.

ID: G-19 · Phần G · Ưu tiên P1 · Sprint 5
TIÊU ĐỀ: MAINTENANCE block OCCUPIED
QUYẾT ĐỊNH ĐÃ CHỐT: Phải PAID/chuyển đơn
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.

NHIỆM VỤ:
1. Đọc G-19 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Phải PAID/chuyển đơn

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[G-19] MAINTENANCE block OCCUPIED" + mô tả file đã sửa.
```

---

### TASK-Q-G-20 {#task-q-g-20}

| | |
| --- | --- |
| **Giao cho** | Backend |
| **Ưu tiên** | P0 |
| **Sprint** | 5 |
| **Loại** | code |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md G-20.

ID: G-20 · Phần G · Ưu tiên P0 · Sprint 5
TIÊU ĐỀ: Manager scope 1 CN
QUYẾT ĐỊNH ĐÃ CHỐT: Owner all CN
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.

NHIỆM VỤ:
1. Đọc G-20 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Owner all CN

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[G-20] Manager scope 1 CN" + mô tả file đã sửa.
```

---

### TASK-Q-G-21 {#task-q-g-21}

| | |
| --- | --- |
| **Giao cho** | TPM |
| **Ưu tiên** | P1 |
| **Sprint** | — |
| **Loại** | doc |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md G-21.

ID: G-21 · Phần G · Ưu tiên P1 · Sprint —
TIÊU ĐỀ: Hoãn inventory/export
QUYẾT ĐỊNH ĐÃ CHỐT: Post-pilot list
LOẠI VIỆC: DOC — Cập nhật tài liệu hoặc xác nhận — không đổi logic app.

NHIỆM VỤ:
1. Đọc G-21 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Post-pilot list

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[G-21] Hoãn inventory/export" + mô tả file đã sửa.
```

---

### TASK-Q-H-01 {#task-q-h-01}

| | |
| --- | --- |
| **Giao cho** | Full-stack |
| **Ưu tiên** | P0 |
| **Sprint** | 6 |
| **Loại** | undefined |
| **User Story** | US-E02 |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md H-01.

ID: H-01 · Phần H · Ưu tiên P0 · Sprint 6
TIÊU ĐỀ: Notification types
QUYẾT ĐỊNH ĐÃ CHỐT: ORDER_NEW, ORDER_READY, BRANCH_PENDING
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.
USER STORY: US-E02

NHIỆM VỤ:
1. Đọc H-01 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: ORDER_NEW, ORDER_READY, BRANCH_PENDING

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[H-01] Notification types" + mô tả file đã sửa.
```

---

### TASK-Q-H-02 {#task-q-h-02}

| | |
| --- | --- |
| **Giao cho** | Mobile |
| **Ưu tiên** | P1 |
| **Sprint** | 6 |
| **Loại** | code |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md H-02.

ID: H-02 · Phần H · Ưu tiên P1 · Sprint 6
TIÊU ĐỀ: Feed 7 ngày unread
QUYẾT ĐỊNH ĐÃ CHỐT: Mark read + badge
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.

NHIỆM VỤ:
1. Đọc H-02 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Mark read + badge

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[H-02] Feed 7 ngày unread" + mô tả file đã sửa.
```

---

### TASK-Q-H-03 {#task-q-h-03}

| | |
| --- | --- |
| **Giao cho** | DevOps |
| **Ưu tiên** | P1 |
| **Sprint** | 6 |
| **Loại** | ops |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md H-03.

ID: H-03 · Phần H · Ưu tiên P1 · Sprint 6
TIÊU ĐỀ: Expo push credentials
QUYẾT ĐỊNH ĐÃ CHỐT: ĐT Owner/NV; tablet in-app
LOẠI VIỆC: OPS — Thực hiện quy trình vận hành / deploy / meeting — không hoặc ít code.

NHIỆM VỤ:
1. Đọc H-03 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: ĐT Owner/NV; tablet in-app

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[H-03] Expo push credentials" + mô tả file đã sửa.
```

---

### TASK-Q-H-04 {#task-q-h-04}

| | |
| --- | --- |
| **Giao cho** | Full-stack |
| **Ưu tiên** | P1 |
| **Sprint** | 6 |
| **Loại** | undefined |
| **User Story** | US-E03 |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md H-04.

ID: H-04 · Phần H · Ưu tiên P1 · Sprint 6
TIÊU ĐỀ: Đổi MK rule
QUYẾT ĐỊNH ĐÃ CHỐT: MK cũ + ≥8 char
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.
USER STORY: US-E03

NHIỆM VỤ:
1. Đọc H-04 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: MK cũ + ≥8 char

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[H-04] Đổi MK rule" + mô tả file đã sửa.
```

---

### TASK-Q-H-05 {#task-q-h-05}

| | |
| --- | --- |
| **Giao cho** | Mobile |
| **Ưu tiên** | P2 |
| **Sprint** | 6 |
| **Loại** | code |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md H-05.

ID: H-05 · Phần H · Ưu tiên P2 · Sprint 6
TIÊU ĐỀ: Thông tin quán screen
QUYẾT ĐỊNH ĐÃ CHỐT: Tên, địa chỉ, hotline, STK ẩn bớt
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.

NHIỆM VỤ:
1. Đọc H-05 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Tên, địa chỉ, hotline, STK ẩn bớt

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[H-05] Thông tin quán screen" + mô tả file đã sửa.
```

---

### TASK-Q-H-06 {#task-q-h-06}

| | |
| --- | --- |
| **Giao cho** | Mobile |
| **Ưu tiên** | P2 |
| **Sprint** | 6 |
| **Loại** | code |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md H-06.

ID: H-06 · Phần H · Ưu tiên P2 · Sprint 6
TIÊU ĐỀ: Toggle âm thanh/rung
QUYẾT ĐỊNH ĐÃ CHỐT: Per device
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.

NHIỆM VỤ:
1. Đọc H-06 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Per device

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[H-06] Toggle âm thanh/rung" + mô tả file đã sửa.
```

---

### TASK-Q-H-07 {#task-q-h-07}

| | |
| --- | --- |
| **Giao cho** | Mobile |
| **Ưu tiên** | P2 |
| **Sprint** | 6 |
| **Loại** | code |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md H-07.

ID: H-07 · Phần H · Ưu tiên P2 · Sprint 6
TIÊU ĐỀ: Version trong Cài đặt
QUYẾT ĐỊNH ĐÃ CHỐT: version+build
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.

NHIỆM VỤ:
1. Đọc H-07 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: version+build

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[H-07] Version trong Cài đặt" + mô tả file đã sửa.
```

---

### TASK-Q-H-08 {#task-q-h-08}

| | |
| --- | --- |
| **Giao cho** | PO/TPM |
| **Ưu tiên** | P0 |
| **Sprint** | — |
| **Loại** | ops |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md H-08.

ID: H-08 · Phần H · Ưu tiên P0 · Sprint —
TIÊU ĐỀ: Ngày G pilot
QUYẾT ĐỊNH ĐÃ CHỐT: Sau Sprint 3 UAT; giấy 3–5 ngày
LOẠI VIỆC: OPS — Thực hiện quy trình vận hành / deploy / meeting — không hoặc ít code.

NHIỆM VỤ:
1. Đọc H-08 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Sau Sprint 3 UAT; giấy 3–5 ngày

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[H-08] Ngày G pilot" + mô tả file đã sửa.
```

---

### TASK-Q-H-09 {#task-q-h-09}

| | |
| --- | --- |
| **Giao cho** | QA |
| **Ưu tiên** | P0 |
| **Sprint** | 6 |
| **Loại** | qa |
| **Map** | TASK-P4-03 |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md H-09.

ID: H-09 · Phần H · Ưu tiên P0 · Sprint 6
TIÊU ĐỀ: UAT 15 kịch bản
QUYẾT ĐỊNH ĐÃ CHỐT: Owner+QL chấm
LOẠI VIỆC: QA — Viết test plan, chạy manual/E2E, ghi evidence.
TASK LIÊN QUAN: TASK-P4-03

NHIỆM VỤ:
1. Đọc H-09 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Owner+QL chấm

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[H-09] UAT 15 kịch bản" + mô tả file đã sửa.
```

---

### TASK-Q-H-10 {#task-q-h-10}

| | |
| --- | --- |
| **Giao cho** | Dev on-call |
| **Ưu tiên** | P1 |
| **Sprint** | — |
| **Loại** | ops |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md H-10.

ID: H-10 · Phần H · Ưu tiên P1 · Sprint —
TIÊU ĐỀ: SLA S1 4h
QUYẾT ĐỊNH ĐÃ CHỐT: Giờ mở cửa
LOẠI VIỆC: OPS — Thực hiện quy trình vận hành / deploy / meeting — không hoặc ít code.

NHIỆM VỤ:
1. Đọc H-10 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Giờ mở cửa

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[H-10] SLA S1 4h" + mô tả file đã sửa.
```

---

### TASK-Q-H-11 {#task-q-h-11}

| | |
| --- | --- |
| **Giao cho** | Owner |
| **Ưu tiên** | P1 |
| **Sprint** | — |
| **Loại** | ops |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md H-11.

ID: H-11 · Phần H · Ưu tiên P1 · Sprint —
TIÊU ĐỀ: Go CN2 gate 7 ngày
QUYẾT ĐỊNH ĐÃ CHỐT: 0 critical
LOẠI VIỆC: OPS — Thực hiện quy trình vận hành / deploy / meeting — không hoặc ít code.

NHIỆM VỤ:
1. Đọc H-11 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: 0 critical

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[H-11] Go CN2 gate 7 ngày" + mô tả file đã sửa.
```

---

### TASK-Q-H-12 {#task-q-h-12}

| | |
| --- | --- |
| **Giao cho** | QA |
| **Ưu tiên** | P1 |
| **Sprint** | — |
| **Loại** | qa |
| **Map** | TASK-P3-04 |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md H-12.

ID: H-12 · Phần H · Ưu tiên P1 · Sprint —
TIÊU ĐỀ: NFR WiFi p95
QUYẾT ĐỊNH ĐÃ CHỐT: WiFi primary; 4G spot
LOẠI VIỆC: QA — Viết test plan, chạy manual/E2E, ghi evidence.
TASK LIÊN QUAN: TASK-P3-04

NHIỆM VỤ:
1. Đọc H-12 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: WiFi primary; 4G spot

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[H-12] NFR WiFi p95" + mô tả file đã sửa.
```

---

### TASK-Q-H-13 {#task-q-h-13}

| | |
| --- | --- |
| **Giao cho** | Dev |
| **Ưu tiên** | P1 |
| **Sprint** | — |
| **Loại** | doc |
| **Map** | TASK-P4-06 |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md H-13.

ID: H-13 · Phần H · Ưu tiên P1 · Sprint —
TIÊU ĐỀ: Review copy VN
QUYẾT ĐỊNH ĐÃ CHỐT: QL+Owner trước UAT
LOẠI VIỆC: DOC — Cập nhật tài liệu hoặc xác nhận — không đổi logic app.
TASK LIÊN QUAN: TASK-P4-06

NHIỆM VỤ:
1. Đọc H-13 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: QL+Owner trước UAT

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[H-13] Review copy VN" + mô tả file đã sửa.
```

---

### TASK-Q-I-01 {#task-q-i-01}

| | |
| --- | --- |
| **Giao cho** | DevOps |
| **Ưu tiên** | P0 |
| **Sprint** | 3 |
| **Loại** | ops |
| **Map** | TASK-P2-08 |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md I-01.

ID: I-01 · Phần I · Ưu tiên P0 · Sprint 3
TIÊU ĐỀ: VPS + SSL
QUYẾT ĐỊNH ĐÃ CHỐT: api.* Lets Encrypt VN
LOẠI VIỆC: OPS — Thực hiện quy trình vận hành / deploy / meeting — không hoặc ít code.
TASK LIÊN QUAN: TASK-P2-08

NHIỆM VỤ:
1. Đọc I-01 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: api.* Lets Encrypt VN

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[I-01] VPS + SSL" + mô tả file đã sửa.
```

---

### TASK-Q-I-02 {#task-q-i-02}

| | |
| --- | --- |
| **Giao cho** | Mobile/DevOps |
| **Ưu tiên** | P0 |
| **Sprint** | 5 |
| **Loại** | ops |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md I-02.

ID: I-02 · Phần I · Ưu tiên P0 · Sprint 5
TIÊU ĐỀ: EXPO_PUBLIC_API_URL
QUYẾT ĐỊNH ĐÃ CHỐT: Staging→prod sau UAT
LOẠI VIỆC: OPS — Thực hiện quy trình vận hành / deploy / meeting — không hoặc ít code.

NHIỆM VỤ:
1. Đọc I-02 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Staging→prod sau UAT

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[I-02] EXPO_PUBLIC_API_URL" + mô tả file đã sửa.
```

---

### TASK-Q-I-03 {#task-q-i-03}

| | |
| --- | --- |
| **Giao cho** | Backend |
| **Ưu tiên** | P1 |
| **Sprint** | 2 |
| **Loại** | seed |
| **Map** | TASK-P2-06 |
| **Trạng thái** | ✅ |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md I-03.

ID: I-03 · Phần I · Ưu tiên P1 · Sprint 2
TIÊU ĐỀ: Seed thật staging
QUYẾT ĐỊNH ĐÃ CHỐT: Menu D-13 + 50 bàn + 3 CN
LOẠI VIỆC: SEED — Cập nhật seed/import data (prisma/seed, staging JSON). Không hard-code trong app.
TASK LIÊN QUAN: TASK-P2-06 ✅

NHIỆM VỤ:
1. Đọc I-03 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Menu D-13 + 50 bàn + 3 CN

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[I-03] Seed thật staging" + mô tả file đã sửa.
```

---

### TASK-Q-I-04 {#task-q-i-04}

| | |
| --- | --- |
| **Giao cho** | Tech Lead |
| **Ưu tiên** | P2 |
| **Sprint** | 3 |
| **Loại** | code |
| **Map** | GAP-07 |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md I-04.

ID: I-04 · Phần I · Ưu tiên P2 · Sprint 3
TIÊU ĐỀ: OpenAPI generate
QUYẾT ĐỊNH ĐÃ CHỐT: Sprint 3 GAP-07
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.
TASK LIÊN QUAN: GAP-07

NHIỆM VỤ:
1. Đọc I-04 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Sprint 3 GAP-07

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[I-04] OpenAPI generate" + mô tả file đã sửa.
```

---

### TASK-Q-I-05 {#task-q-i-05}

| | |
| --- | --- |
| **Giao cho** | Designer |
| **Ưu tiên** | P1 |
| **Sprint** | — |
| **Loại** | doc |
| **Map** | GAP-08 |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md I-05.

ID: I-05 · Phần I · Ưu tiên P1 · Sprint —
TIÊU ĐỀ: Design PNG repo
QUYẾT ĐỊNH ĐÃ CHỐT: Optional; DESIGN_SYSTEM ok
LOẠI VIỆC: DOC — Cập nhật tài liệu hoặc xác nhận — không đổi logic app.
TASK LIÊN QUAN: GAP-08

NHIỆM VỤ:
1. Đọc I-05 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Optional; DESIGN_SYSTEM ok

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[I-05] Design PNG repo" + mô tả file đã sửa.
```

---

### TASK-Q-I-06 {#task-q-i-06}

| | |
| --- | --- |
| **Giao cho** | Mobile |
| **Ưu tiên** | P1 |
| **Sprint** | — |
| **Loại** | code |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md I-06.

ID: I-06 · Phần I · Ưu tiên P1 · Sprint —
TIÊU ĐỀ: 100% tiếng Việt
QUYẾT ĐỊNH ĐÃ CHỐT: No i18n pilot
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.

NHIỆM VỤ:
1. Đọc I-06 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. All UI strings VI

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[I-06] 100% tiếng Việt" + mô tả file đã sửa.
```

---

### TASK-Q-I-07 {#task-q-i-07}

| | |
| --- | --- |
| **Giao cho** | — |
| **Ưu tiên** | P2 |
| **Sprint** | — |
| **Loại** | defer |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md I-07.

ID: I-07 · Phần I · Ưu tiên P2 · Sprint —
TIÊU ĐỀ: Chữ lớn toggle
QUYẾT ĐỊNH ĐÃ CHỐT: v2.1
LOẠI VIỆC: DEFER — KHÔNG implement trong phase hiện tại. Ghi backlog post-MVP.

NHIỆM VỤ: Xác nhận không code. Ghi note trong backlog nếu có ticket mở nhầm.

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: v2.1

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[I-07] Chữ lớn toggle" + mô tả file đã sửa.
```

---

### TASK-Q-I-08 {#task-q-i-08}

| | |
| --- | --- |
| **Giao cho** | Mobile |
| **Ưu tiên** | P2 |
| **Sprint** | — |
| **Loại** | code |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md I-08.

ID: I-08 · Phần I · Ưu tiên P2 · Sprint —
TIÊU ĐỀ: No dark mode
QUYẾT ĐỊNH ĐÃ CHỐT: Light only
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.

NHIỆM VỤ:
1. Đọc I-08 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. No dark theme

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[I-08] No dark mode" + mô tả file đã sửa.
```

---

### TASK-Q-I-09 {#task-q-i-09}

| | |
| --- | --- |
| **Giao cho** | DevOps |
| **Ưu tiên** | P2 |
| **Sprint** | 5 |
| **Loại** | ops |
| **Map** | TASK-P8-02 |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md I-09.

ID: I-09 · Phần I · Ưu tiên P2 · Sprint 5
TIÊU ĐỀ: Google Play internal
QUYẾT ĐỊNH ĐÃ CHỐT: Sprint 5-6 Android
LOẠI VIỆC: OPS — Thực hiện quy trình vận hành / deploy / meeting — không hoặc ít code.
TASK LIÊN QUAN: TASK-P8-02

NHIỆM VỤ:
1. Đọc I-09 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Sprint 5-6 Android

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[I-09] Google Play internal" + mô tả file đã sửa.
```

---

### TASK-Q-GAP-01 {#task-q-gap-01}

| | |
| --- | --- |
| **Giao cho** | Tech Lead |
| **Ưu tiên** | P0 |
| **Sprint** | — |
| **Loại** | doc |
| **Trạng thái** | ✅ |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md GAP-01.

ID: GAP-01 · Phần J · Ưu tiên P0 · Sprint —
TIÊU ĐỀ: Sprint 1 status
QUYẾT ĐỊNH ĐÃ CHỐT: Code done; C-15 pending
LOẠI VIỆC: DOC — Cập nhật tài liệu hoặc xác nhận — không đổi logic app.

NHIỆM VỤ:
1. Đọc GAP-01 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Code done; C-15 pending

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[GAP-01] Sprint 1 status" + mô tả file đã sửa.
```

---

### TASK-Q-GAP-02 {#task-q-gap-02}

| | |
| --- | --- |
| **Giao cho** | — |
| **Ưu tiên** | P0 |
| **Sprint** | — |
| **Loại** | doc |
| **Trạng thái** | ✅ |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md GAP-02.

ID: GAP-02 · Phần J · Ưu tiên P0 · Sprint —
TIÊU ĐỀ: Staff no branch pick
QUYẾT ĐỊNH ĐÃ CHỐT: Owner only
LOẠI VIỆC: DOC — Cập nhật tài liệu hoặc xác nhận — không đổi logic app.

NHIỆM VỤ:
1. Đọc GAP-02 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Owner only

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[GAP-02] Staff no branch pick" + mô tả file đã sửa.
```

---

### TASK-Q-GAP-03 {#task-q-gap-03}

| | |
| --- | --- |
| **Giao cho** | — |
| **Ưu tiên** | P0 |
| **Sprint** | — |
| **Loại** | doc |
| **Map** | TASK-P2-04 |
| **Trạng thái** | ✅ |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md GAP-03.

ID: GAP-03 · Phần J · Ưu tiên P0 · Sprint —
TIÊU ĐỀ: VAT 8%
QUYẾT ĐỊNH ĐÃ CHỐT: Inclusive
LOẠI VIỆC: DOC — Cập nhật tài liệu hoặc xác nhận — không đổi logic app.
TASK LIÊN QUAN: TASK-P2-04 ✅

NHIỆM VỤ:
1. Đọc GAP-03 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Inclusive

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[GAP-03] VAT 8%" + mô tả file đã sửa.
```

---

### TASK-Q-GAP-04 {#task-q-gap-04}

| | |
| --- | --- |
| **Giao cho** | Full-stack |
| **Ưu tiên** | P2 |
| **Sprint** | 6 |
| **Loại** | code |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md GAP-04.

ID: GAP-04 · Phần J · Ưu tiên P2 · Sprint 6
TIÊU ĐỀ: Split bill in scope
QUYẾT ĐỊNH ĐÃ CHỐT: MVP v2
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.

NHIỆM VỤ:
1. Đọc GAP-04 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: MVP v2

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[GAP-04] Split bill in scope" + mô tả file đã sửa.
```

---

### TASK-Q-GAP-05 {#task-q-gap-05}

| | |
| --- | --- |
| **Giao cho** | Full-stack |
| **Ưu tiên** | P0 |
| **Sprint** | — |
| **Loại** | code |
| **Map** | TASK-P2-02 |
| **Trạng thái** | ✅ |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md GAP-05.

ID: GAP-05 · Phần J · Ưu tiên P0 · Sprint —
TIÊU ĐỀ: deliveredAt
QUYẾT ĐỊNH ĐÃ CHỐT: No SERVING
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.
TASK LIÊN QUAN: TASK-P2-02 ✅

NHIỆM VỤ:
1. Đọc GAP-05 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: No SERVING

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[GAP-05] deliveredAt" + mô tả file đã sửa.
```

---

### TASK-Q-GAP-06 {#task-q-gap-06}

| | |
| --- | --- |
| **Giao cho** | Backend |
| **Ưu tiên** | P0 |
| **Sprint** | 5 |
| **Loại** | code |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md GAP-06.

ID: GAP-06 · Phần J · Ưu tiên P0 · Sprint 5
TIÊU ĐỀ: Shift Sprint 5
QUYẾT ĐỊNH ĐÃ CHỐT: Optional pilot
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.

NHIỆM VỤ:
1. Đọc GAP-06 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Optional pilot

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[GAP-06] Shift Sprint 5" + mô tả file đã sửa.
```

---

### TASK-Q-GAP-07 {#task-q-gap-07}

| | |
| --- | --- |
| **Giao cho** | Tech Lead |
| **Ưu tiên** | P2 |
| **Sprint** | — |
| **Loại** | code |
| **Map** | I-04 |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md GAP-07.

ID: GAP-07 · Phần J · Ưu tiên P2 · Sprint —
TIÊU ĐỀ: OpenAPI
QUYẾT ĐỊNH ĐÃ CHỐT: Sprint 3
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.
TASK LIÊN QUAN: I-04

NHIỆM VỤ:
1. Đọc GAP-07 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Sprint 3

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[GAP-07] OpenAPI" + mô tả file đã sửa.
```

---

### TASK-Q-GAP-08 {#task-q-gap-08}

| | |
| --- | --- |
| **Giao cho** | Designer |
| **Ưu tiên** | P1 |
| **Sprint** | — |
| **Loại** | doc |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md GAP-08.

ID: GAP-08 · Phần J · Ưu tiên P1 · Sprint —
TIÊU ĐỀ: Design PNG
QUYẾT ĐỊNH ĐÃ CHỐT: Optional not block
LOẠI VIỆC: DOC — Cập nhật tài liệu hoặc xác nhận — không đổi logic app.

NHIỆM VỤ:
1. Đọc GAP-08 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Optional not block

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[GAP-08] Design PNG" + mô tả file đã sửa.
```

---

### TASK-Q-GAP-09 {#task-q-gap-09}

| | |
| --- | --- |
| **Giao cho** | — |
| **Ưu tiên** | P0 |
| **Sprint** | — |
| **Loại** | doc |
| **Trạng thái** | ✅ |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md GAP-09.

ID: GAP-09 · Phần J · Ưu tiên P0 · Sprint —
TIÊU ĐỀ: AuthProvider done
QUYẾT ĐỊNH ĐÃ CHỐT: Yes
LOẠI VIỆC: DOC — Cập nhật tài liệu hoặc xác nhận — không đổi logic app.

NHIỆM VỤ:
1. Đọc GAP-09 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Yes

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[GAP-09] AuthProvider done" + mô tả file đã sửa.
```

---

### TASK-Q-GAP-10 {#task-q-gap-10}

| | |
| --- | --- |
| **Giao cho** | — |
| **Ưu tiên** | P1 |
| **Sprint** | — |
| **Loại** | doc |
| **Trạng thái** | ✅ |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md GAP-10.

ID: GAP-10 · Phần J · Ưu tiên P1 · Sprint —
TIÊU ĐỀ: Polling S2-3 WS S4
QUYẾT ĐỊNH ĐÃ CHỐT: Aligned
LOẠI VIỆC: DOC — Cập nhật tài liệu hoặc xác nhận — không đổi logic app.

NHIỆM VỤ:
1. Đọc GAP-10 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Aligned

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[GAP-10] Polling S2-3 WS S4" + mô tả file đã sửa.
```

---

### TASK-Q-GAP-11 {#task-q-gap-11}

| | |
| --- | --- |
| **Giao cho** | Mobile |
| **Ưu tiên** | P0 |
| **Sprint** | — |
| **Loại** | code |
| **Map** | TASK-P2-03b |
| **Trạng thái** | ✅ |

```text
Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md GAP-11.

ID: GAP-11 · Phần J · Ưu tiên P0 · Sprint —
TIÊU ĐỀ: Station kitchen tab
QUYẾT ĐỊNH ĐÃ CHỐT: Tab Bếp trạm
LOẠI VIỆC: CODE — Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.
TASK LIÊN QUAN: TASK-P2-03b ✅

NHIỆM VỤ:
1. Đọc GAP-11 trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).

ACCEPTANCE CRITERIA:
1. Đáp ứng quyết định: Tab Bếp trạm

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[GAP-11] Station kitchen tab" + mô tả file đã sửa.
```

---

## User Stories — Prompt tổng hợp

| US | Questionnaire IDs | Mô tả | Sprint | Phase task |
| -- | ----------------- | ----- | ------ | ---------- |
| US-A01 | C-01,C-04,C-05 | Login JWT | Sprint 1 | TASK-P2-01 |
| US-A02 | C-08,C-09 | Owner chọn CN | Sprint 1 | TASK-P2-01 |
| US-A03 | C-11,C-12 | Routing StaffRole | Sprint 1 | TASK-P2-01 ✅ |
| US-A04 | C-13,C-14 | Home quick actions | Sprint 1 | — |
| US-B01 | D-01,D-02,D-03,B-28 | Chọn loại đơn | Sprint 2 | TASK-P2-09 |
| US-B02 | D-05..D-12,B-14 | Sơ đồ bàn | Sprint 2 | TASK-P2-09 |
| US-B03 | D-13..D-20 | Menu | Sprint 2 | TASK-P2-09 |
| US-B04 | D-21..D-26 | Tùy chỉnh món | Sprint 2 | TASK-P2-09 |
| US-B05 | D-27..D-33 | Giỏ + gửi bếp | Sprint 2 | TASK-P2-09 |
| US-B06 | E-01..E-03 | Tiền mặt | Sprint 3 | TASK-P2-10 |
| US-B07 | E-04..E-07,B-24 | Chuyển khoản | Sprint 3 | TASK-P2-10 |
| US-B08 | E-08 | Thẻ thủ công | Sprint 6 | defer |
| US-B09 | E-09 | VNPay sandbox | Sprint 3 dev | defer prod |
| US-B10 | E-12..E-15 | Danh sách đơn | Sprint 3 | TASK-P2-10 |
| US-B11 | E-16..E-18 | Lịch sử đơn | Sprint 3 | TASK-P2-10 |
| US-C01 | F-01..F-06,F-16 | Queue realtime | Sprint 4 | TASK-P2-11 |
| US-C02 | F-07,F-08 | Chi tiết đơn bếp | Sprint 4 | — |
| US-C03 | F-09..F-12,F-15 | Đang pha | Sprint 4 | — |
| US-C04 | F-13,F-14 | Hoàn thành | Sprint 4 | — |
| US-D01 | G-01,G-02,G-05 | Dashboard | Sprint 5 | — |
| US-D02 | G-03,G-04,G-06 | Báo cáo DT | Sprint 5 | — |
| US-D03 | G-07,G-08,B-03 | Kết ca | Sprint 5 | — |
| US-D04 | G-09,G-10 | Quản lý menu | Sprint 5 | — |
| US-D05 | G-13,G-14,G-15 | Nhân viên | Sprint 5 | — |
| US-D06 | B-22,B-23 | Audit UI | Sprint 5 | — |
| US-E01 | G-18,G-19 | Quản lý bàn | Sprint 5 | — |
| US-E02 | H-01..H-03 | Thông báo | Sprint 6 | — |
| US-E03 | H-04..H-07 | Cài đặt | Sprint 6 | — |

### Prompt mẫu giao theo User Story

```text
Bạn implement User Story [US-XXX] cho CaffeApp.
1. Đọc USER_STORIES.md acceptance criteria cho US-XXX.
2. Đọc TẤT CẢ questionnaire IDs liên quan (cột trên).
3. Đọc design/screens/INDEX.md màn hình tương ứng.
4. Implement full-stack; business rules trên API.
5. Manual test theo TESTING.md critical path.
OUTPUT: PR per US hoặc sub-PR ≤400 LOC.
```

## UAT 15 kịch bản — Prompt (H-09)

### TASK-UAT-01

```text
QA/Owner chạy UAT: Owner login + chọn CN.
Questionnaire: C-11,C-08.
Steps: (ghi từ GO_LIVE_PLAN UAT checklist).
Pass: đúng AC questionnaire.
Fail: ticket S1-S4 + video.
```

### TASK-UAT-02

```text
QA/Owner chạy UAT: Staff login routing.
Questionnaire: C-08,C-11.
Steps: (ghi từ GO_LIVE_PLAN UAT checklist).
Pass: đúng AC questionnaire.
Fail: ticket S1-S4 + video.
```

### TASK-UAT-03

```text
QA/Owner chạy UAT: SecureStore kill app.
Questionnaire: C-15.
Steps: (ghi từ GO_LIVE_PLAN UAT checklist).
Pass: đúng AC questionnaire.
Fail: ticket S1-S4 + video.
```

### TASK-UAT-04

```text
QA/Owner chạy UAT: Tạo đơn + chọn NV.
Questionnaire: B-15,D-27.
Steps: (ghi từ GO_LIVE_PLAN UAT checklist).
Pass: đúng AC questionnaire.
Fail: ticket S1-S4 + video.
```

### TASK-UAT-05

```text
QA/Owner chạy UAT: Mang đi + số thứ tự.
Questionnaire: B-28,D-01.
Steps: (ghi từ GO_LIVE_PLAN UAT checklist).
Pass: đúng AC questionnaire.
Fail: ticket S1-S4 + video.
```

### TASK-UAT-06

```text
QA/Owner chạy UAT: Khóa bàn.
Questionnaire: B-14,D-12.
Steps: (ghi từ GO_LIVE_PLAN UAT checklist).
Pass: đúng AC questionnaire.
Fail: ticket S1-S4 + video.
```

### TASK-UAT-07

```text
QA/Owner chạy UAT: Bếp MAKING→READY.
Questionnaire: D-33,F-01.
Steps: (ghi từ GO_LIVE_PLAN UAT checklist).
Pass: đúng AC questionnaire.
Fail: ticket S1-S4 + video.
```

### TASK-UAT-08

```text
QA/Owner chạy UAT: Đã giao deliveredAt.
Questionnaire: B-33,F-12.
Steps: (ghi từ GO_LIVE_PLAN UAT checklist).
Pass: đúng AC questionnaire.
Fail: ticket S1-S4 + video.
```

### TASK-UAT-09

```text
QA/Owner chạy UAT: Thanh toán TM.
Questionnaire: E-02.
Steps: (ghi từ GO_LIVE_PLAN UAT checklist).
Pass: đúng AC questionnaire.
Fail: ticket S1-S4 + video.
```

### TASK-UAT-10

```text
QA/Owner chạy UAT: CK VietQR.
Questionnaire: E-05,B-24.
Steps: (ghi từ GO_LIVE_PLAN UAT checklist).
Pass: đúng AC questionnaire.
Fail: ticket S1-S4 + video.
```

### TASK-UAT-11

```text
QA/Owner chạy UAT: VAT bill.
Questionnaire: D-17.
Steps: (ghi từ GO_LIVE_PLAN UAT checklist).
Pass: đúng AC questionnaire.
Fail: ticket S1-S4 + video.
```

### TASK-UAT-12

```text
QA/Owner chạy UAT: Hủy đơn audit.
Questionnaire: D-28,B-22.
Steps: (ghi từ GO_LIVE_PLAN UAT checklist).
Pass: đúng AC questionnaire.
Fail: ticket S1-S4 + video.
```

### TASK-UAT-13

```text
QA/Owner chạy UAT: Gộp/chuyển bàn v2.
Questionnaire: B-30.
Steps: (ghi từ GO_LIVE_PLAN UAT checklist).
Pass: đúng AC questionnaire.
Fail: ticket S1-S4 + video.
```

### TASK-UAT-14

```text
QA/Owner chạy UAT: Kết ca TM/CK.
Questionnaire: B-03,G-07.
Steps: (ghi từ GO_LIVE_PLAN UAT checklist).
Pass: đúng AC questionnaire.
Fail: ticket S1-S4 + video.
```

### TASK-UAT-15

```text
QA/Owner chạy UAT: Mất mạng SOP.
Questionnaire: B-18.
Steps: (ghi từ GO_LIVE_PLAN UAT checklist).
Pass: đúng AC questionnaire.
Fail: ticket S1-S4 + video.
```

