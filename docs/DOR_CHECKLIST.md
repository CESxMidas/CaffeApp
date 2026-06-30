# Definition of Ready (DoR) — CaffeApp

**Gate trước khi dev nhận story vào sprint.**  
Mỗi User Story phải pass 100% checklist này trước khi chuyển sang `In Progress`.

---

## Global Pre-Coding Gate (Sprint 0 → Sprint 1)

Checklist cho toàn dự án trước khi bắt đầu code feature:

| #   | Item                        | Status  | Evidence                                                              |
| --- | --------------------------- | ------- | --------------------------------------------------------------------- |
| G1  | Discovery document approved | ✅ Pass | [docs/DISCOVERY.md](DISCOVERY.md)                                     |
| G2  | PRD v1.0 approved           | ✅ Pass | [docs/PRD.md](PRD.md)                                                 |
| G3  | User Stories + AC defined   | ✅ Pass | [docs/USER_STORIES.md](USER_STORIES.md)                               |
| G4  | Tech stack decided (ADRs)   | ✅ Pass | [docs/adr/](adr/)                                                     |
| G5  | Architecture documented     | ✅ Pass | [docs/ARCHITECTURE.md](ARCHITECTURE.md)                               |
| G6  | ERD + API contract          | ✅ Pass | [docs/api/ERD.md](api/ERD.md), [API_CONTRACT.md](api/API_CONTRACT.md) |
| G7  | Design system + UI states   | ✅ Pass | [design/DESIGN_SYSTEM.md](../design/DESIGN_SYSTEM.md)                 |
| G8  | Monorepo + CI setup         | ✅ Pass | [README.md](../README.md), `.github/workflows/ci.yml`                 |
| G9  | Navigation shell            | ✅ Pass | `apps/mobile/src/app/`                                                |
| G10 | PostgreSQL + Prisma setup   | ✅ Pass | `infra/docker-compose.yml`, migration `initial_schema`, local `.env`  |

**Global Gate Result:** ✅ **PASS**

> **Ghi chú G6:** OpenAPI machine-readable (`openapi.yaml`) chưa generate — contract markdown là source of truth. Archive Supabase OpenAPI: [docs/legacy/openapi-supabase.yaml](../legacy/openapi-supabase.yaml).  
> **Ghi chú G7:** Design mockup PNGs được index tại [design/screens/INDEX.md](../design/screens/INDEX.md); file ảnh có thể chưa commit vào repo.

---

## Per-Story DoR Checklist

Áp dụng cho **mỗi** User Story trước khi dev bắt đầu:

- [ ] **User story** viết rõ: "Là [role], tôi muốn [action], để [benefit]"
- [ ] **Acceptance criteria** đủ Given/When/Then, có thể test được
- [ ] **Design mockup** approved — link trong `design/screens/INDEX.md`
- [ ] **API contract** defined trong [API_CONTRACT.md](api/API_CONTRACT.md) (nếu story cần backend)
- [ ] **Dependencies** identified (blocked by story nào?)
- [ ] **Estimate** thống nhất (story points)
- [ ] **Không còn open questions** blocking implementation
- [ ] **Test scenarios** liệt kê (ít nhất happy path + 1 edge case)

---

## Sprint 1 DoR Review — Auth Flow (US-A01 → US-A04)

**Sprint 1 status:** 🔄 **IN PROGRESS** — API + UI scaffold done; refactor bỏ màn chọn role; E2E thiết bị thật (C-15) pending

### US-A01: Đăng nhập

| DoR Item            | Status | Notes                                                               |
| ------------------- | ------ | ------------------------------------------------------------------- |
| User story clear    | ✅     | US-A01 in USER_STORIES.md                                           |
| Acceptance criteria | ✅     | Given/When/Then defined                                             |
| Design mockup       | ✅     | `design/screens/INDEX.md` → `01-dang-nhap.png`                      |
| API contract        | ✅     | `POST /api/v1/auth/login` in [API_CONTRACT.md](api/API_CONTRACT.md) |
| Dependencies        | ✅     | PostgreSQL + NestJS API running                                     |
| Estimate            | ✅     | 3 points                                                            |
| Open questions      | ✅     | None — email vs phone: support both in one field                    |
| Test scenarios      | ✅     | Valid login, invalid creds, empty fields, network error             |

**Verdict:** ✅ Ready

---

### US-A02: Chọn chi nhánh (Owner only)

| DoR Item            | Status | Notes                                    |
| ------------------- | ------ | ---------------------------------------- |
| User story clear    | ✅     | Staff không chọn CN — questionnaire C-08 |
| Acceptance criteria | ✅     | Owner only; staff auto branch            |
| Design mockup       | ✅     | `02-chon-chi-nhanh.png` (Owner)          |
| API contract        | ✅     | `GET /api/v1/branches`                   |
| Dependencies        | ⚠️     | US-A01 (auth token)                      |
| Estimate            | ✅     | 2 points                                 |
| Open questions      | ✅     | None                                     |
| Test scenarios      | ✅     | Owner multi-CN; staff skip screen        |

**Verdict:** ✅ Ready

---

### US-A03: Điều hướng sau đăng nhập

| DoR Item            | Status | Notes                            |
| ------------------- | ------ | -------------------------------- |
| User story clear    | ✅     | Supersedes "chọn vai trò" C-11   |
| Acceptance criteria | ✅     | Route by StaffRole               |
| Design mockup       | ⚠️     | `03-chon-vai-tro.png` deprecated |
| API contract        | ✅     | Roles in login response          |
| Dependencies        | ⚠️     | US-A01, BRANCH_ASSIGNMENT        |
| Estimate            | ✅     | 2 points                         |
| Open questions      | ✅     | Tablet trạm tab layout           |
| Test scenarios      | ✅     | CASHIER→ops; MANAGER→dashboard   |

**Verdict:** ✅ Ready (refactor FE pending)

---

### US-A04: Trang chủ Thu ngân

| DoR Item            | Status | Notes                              |
| ------------------- | ------ | ---------------------------------- |
| User story clear    | ✅     |                                    |
| Acceptance criteria | ✅     | 6 actions + tab nav                |
| Design mockup       | ✅     | `04-trang-chu-thu-ngan.png`        |
| API contract        | N/A    | Local session only                 |
| Dependencies        | ⚠️     | US-A03                             |
| Estimate            | ✅     | 3 points                           |
| Open questions      | ✅     | None                               |
| Test scenarios      | ✅     | Greeting shows name, tabs navigate |

**Verdict:** ✅ Ready

---

## Definition of Done (DoD)

Story chỉ được mark **Done** khi:

- [ ] Code merged vào `develop` via approved PR
- [ ] TypeScript compiles (`npm run typecheck`)
- [ ] Acceptance criteria verified (manual hoặc automated)
- [ ] Không critical/high bugs open
- [ ] UI khớp design mockup (± spacing tolerance)
- [ ] Error/empty states handled per DESIGN_SYSTEM.md

---

## Sign-off

| Role          | Sprint 1 DoR                      | Date       |
| ------------- | --------------------------------- | ---------- |
| Product Owner | Approved                          | 2026-06-25 |
| Tech Lead     | Approved                          | 2026-06-25 |
| QA            | Approved (test scenarios defined) | 2026-06-25 |

**Sprint 1 Authorization:** ✅ **CLEARED TO START** — PostgreSQL local + Prisma migration đã setup.
