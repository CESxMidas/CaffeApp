#!/usr/bin/env node
/**
 * Generates docs/GO_LIVE_PROMPTS_FULL.md from questionnaire ID registry.
 * Run: node scripts/generate-go-live-prompts.mjs
 */
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'docs', 'GO_LIVE_PROMPTS_FULL.md');

/** @type {Array<{id:string,prio:string,part:string,title:string,decision:string,assignee:string,sprint:string,map?:string,status?:string,type:'code'|'seed'|'ops'|'qa'|'doc'|'defer',us?:string,files?:string,ac?:string[]}>} */
const ITEMS = [
  // —— Phần A ——
  { id: 'A-01', prio: 'P0', part: 'A', title: 'CN pilot Quận 1', decision: 'Quán thật CN1 Quận 1; địa chỉ prod chờ chủ quán; dev seed 123 Nguyễn Huệ Q1', assignee: 'Backend/TPM', sprint: '0', map: 'TASK-P2-06', type: 'seed', ac: ['Branch seed có tên CN Quận 1', 'GO_LIVE_PLAN cập nhật địa chỉ khi chủ quán chốt'] },
  { id: 'A-02', prio: 'P0', part: 'A', title: '3 chi nhánh multi-tenant', decision: '3 CN; schema filter branch_id', assignee: 'Backend', sprint: '2', type: 'code', files: 'branches.service.ts, branch-scope.util.ts', ac: ['Seed 3 CN', 'API không leak data cross-branch'] },
  { id: 'A-03', prio: 'P0', part: 'A', title: '50 bàn/CN layout', decision: 'T1×20 T2×20 sân×10; 2 NV pha+thu ngân/CN', assignee: 'Backend', sprint: '2', map: 'TASK-P2-06', type: 'seed', ac: ['50 bàn B01–B50', '2 staff vận hành + station account'] },
  { id: 'A-04', prio: 'P1', part: 'A', title: '24/7 + 3 ca 8h', decision: 'NIGHT 00–08 DAY 08–16 EVENING 16–24', assignee: 'Backend', sprint: '5', type: 'code', files: 'shifts module', ac: ['Shift enum khớp B-07', 'Pilot: optional shift_id'] },
  { id: 'A-05', prio: 'P1', part: 'A', title: 'Baseline đơn/giờ cao điểm', decision: 'Cao điểm 18–22h; đo khi pilot', assignee: 'TPM', sprint: '6', type: 'ops', ac: ['Pilot daily log KPI', 'Không code trước pilot'] },
  { id: 'A-06', prio: 'P0', part: 'A', title: 'Menu ~40 món 6 category', decision: 'Size S/M/L; modifier; giá 19k–69k; list D-13', assignee: 'Backend', sprint: '2', map: 'TASK-P2-06', type: 'seed', us: 'US-B03' },
  { id: 'A-07', prio: 'P1', part: 'A', title: 'Combo/mùa post-MVP', decision: 'MVP món đơn+size; combo sau pilot', assignee: '—', sprint: '—', type: 'defer', ac: ['Không implement combo engine pilot'] },
  { id: 'A-08', prio: 'P2', part: 'A', title: 'Grab/ShopeeFood', decision: 'Không MVP', assignee: '—', type: 'defer', ac: ['D-04: enum DELIVERY reserved only'] },
  { id: 'A-09', prio: 'P0', part: 'A', title: 'Tablet trạm + ĐT cá nhân', decision: '1 tablet/CN session chung; ĐT login cá nhân; Android pilot', assignee: 'Mobile', sprint: '2', map: 'TASK-P2-03', status: '✅', type: 'code', files: 'DEVICE_POLICY, station shell' },
  { id: 'A-10', prio: 'P1', part: 'A', title: 'WiFi không offline', decision: 'WiFi ổn định; không offline-first', assignee: 'Mobile', sprint: '2', type: 'code', ac: ['Network error UI rõ', 'Không offline queue'] },
  { id: 'A-11', prio: 'P0', part: 'A', title: 'Pilot 2 tuần', decision: 'Deadline pilot 2 tuần sau Sprint 3 UAT', assignee: 'TPM', type: 'ops' },
  { id: 'A-12', prio: 'P1', part: 'A', title: 'Team có design', decision: 'Design UI có; dev đang setup', assignee: 'Designer', map: 'GAP-08', type: 'doc' },
  { id: 'A-13', prio: 'P1', part: 'A', title: 'Velocity 20pts/sprint', decision: 'Khả thi', assignee: 'TPM', type: 'ops' },

  // —— B.1 ——
  { id: 'B-01', prio: 'P0', part: 'B', title: 'QL nhận ca không gate bán', decision: '3 ca tự giờ; QL nhận/kết ca; không chặn tạo đơn', assignee: 'Backend+Mobile', sprint: '5', type: 'code', us: 'US-D03' },
  { id: 'B-02', prio: 'P0', part: 'B', title: 'Kết ca không đóng hết đơn', decision: 'QL kết ca; đơn tồn OK', assignee: 'Backend', sprint: '5', type: 'code' },
  { id: 'B-03', prio: 'P1', part: 'B', title: 'Đối chiếu TM/CK cuối ca', decision: 'Báo cáo app TM vs thực tế + CK', assignee: 'Full-stack', sprint: '5', us: 'US-D03', ac: ['Form nhập TM thực tế', 'Chênh lệch ghi chú bắt buộc'] },
  { id: 'B-04', prio: 'P0', part: 'B', title: 'Đơn tồn rollover ca', decision: 'PAID giữ ca; PENDING/MAKING/READY rollover qua mốc 08/16/00', assignee: 'Backend', sprint: '5', type: 'code', files: 'shifts.service.ts' },
  { id: 'B-05', prio: 'P0', part: 'B', title: 'Shift module timing', decision: 'Pilot: không bắt buộc shift_id; Sprint 5 bật', assignee: 'Backend', sprint: '5', map: 'GAP-06', type: 'code' },
  { id: 'B-06', prio: 'P0', part: 'B', title: 'Doanh thu theo ca', decision: 'PAID = ca lúc thanh toán', assignee: 'Backend', sprint: '5', us: 'US-D02' },
  { id: 'B-07', prio: 'P1', part: 'B', title: '3 ca cố định giờ', decision: 'NIGHT/DAY/EVENING 8h', assignee: 'Backend', sprint: '5', type: 'code' },

  // —— B.2 ——
  { id: 'B-08', prio: 'P1', part: 'B', title: 'Không float đầu ca', decision: 'Chỉ đối chiếu cuối ca TM/CK', assignee: 'Mobile', sprint: '5', type: 'code' },
  { id: 'B-09', prio: 'P2', part: 'B', title: 'Tablet Tab Thu ngân + Bếp', decision: 'Login trạm làm ngay; tab Bếp queue', assignee: 'Mobile', sprint: '2', map: 'TASK-P2-03b', status: '✅', type: 'code' },
  { id: 'B-10', prio: 'P2', part: 'B', title: 'Không duyệt mở ca', decision: 'Đơn realtime không gate', assignee: '—', type: 'defer' },
  { id: 'B-11', prio: 'P0', part: 'B', title: 'Logout cuối ca', decision: 'ĐT: nhắc + auto logout +10p; tablet: không auto logout', assignee: 'Mobile', sprint: '5', type: 'code' },
  { id: 'B-12', prio: 'P2', part: 'B', title: 'Cảnh báo phiên cũ', decision: 'Tablet không áp dụng; ĐT không bắt buộc', assignee: '—', type: 'defer' },

  // —— B.3 ——
  { id: 'B-13', prio: 'P0', part: 'B', title: '2 NV pha+thu ngân/CN', decision: '1 CN = 2 NV vận hành (+ 5 phục vụ bàn ngoài app scope)', assignee: 'TPM', type: 'ops' },
  { id: 'B-14', prio: 'P0', part: 'B', title: 'Khóa bàn khi đang order', decision: 'Bàn SELECTED/LOCKED; NV2 không mở; timeout 2–3p', assignee: 'Full-stack', sprint: '2', us: 'US-B02', files: 'tables.service.ts, tables.tsx', ac: ['API lock soft', 'UI thông báo bàn đang xử lý'] },
  { id: 'B-15', prio: 'P1', part: 'B', title: 'Tablet chọn NV mỗi thao tác', decision: 'Station: StaffPicker + actedByStaffId', assignee: 'Mobile+API', sprint: '2', map: 'TASK-P2-03', status: '✅', type: 'code' },
  { id: 'B-16', prio: 'P1', part: 'B', title: 'Audit theo StaffRole JWT', decision: 'Không chọn role; audit role từ tài khoản', assignee: 'Backend', sprint: '2', map: 'TASK-P2-01', status: '✅', type: 'code' },
  { id: 'B-17', prio: 'P2', part: 'B', title: 'Không đổi role trong ca', decision: 'Chỉ Owner/QL đổi role tài khoản', assignee: 'Backend', sprint: '5', us: 'US-D05' },

  // —— B.4 offline ——
  { id: 'B-18', prio: 'P0', part: 'B', title: 'Mất mạng → thủ công', decision: 'App không hoạt động; SOP giấy', assignee: 'Mobile', sprint: '2', type: 'code', ac: ['Banner lỗi mạng', 'Không fake offline mode', 'SOP_QUAY_PILOT.pdf'] },
  { id: 'B-19', prio: 'P1', part: 'B', title: 'Không offline cart', decision: 'Mất mạng = thủ công', assignee: 'Mobile', type: 'code', ac: ['Không persist cart offline lâu'] },
  { id: 'B-20', prio: 'P2', part: 'B', title: 'API down notify QL', decision: 'Thủ công', assignee: '—', type: 'defer', ac: ['Post-MVP monitoring alert'] },
  { id: 'B-21', prio: 'P1', part: 'B', title: 'Barista reconnect', decision: 'Mất mạng thủ công; WS reconnect Sprint 4', assignee: 'Mobile', sprint: '4', map: 'TASK-P2-11' },

  // —— B.5 audit ——
  { id: 'B-22', prio: 'P1', part: 'B', title: 'Audit log đầy đủ', decision: 'Mọi thao tác doanh thu; before/after; NV, device, IP', assignee: 'Backend', sprint: '5', type: 'code', files: 'audit_logs module' },
  { id: 'B-23', prio: 'P2', part: 'B', title: 'Audit UI Owner/QL', decision: 'Cashier/Barista không xem', assignee: 'Mobile', sprint: '5', us: 'US-D06' },
  { id: 'B-24', prio: 'P1', part: 'B', title: 'CK xác nhận + trách nhiệm', decision: 'Cashier xác nhận; audit; QL void', assignee: 'Full-stack', sprint: '3', us: 'US-B07', map: 'TASK-P2-10' },

  // —— B.6 order workflow ——
  { id: 'B-25', prio: 'P0', part: 'B', title: 'Chọn bàn hoặc order trước', decision: 'Cả 2; NV quan sát tránh trùng bàn', assignee: 'Mobile', sprint: '2', us: 'US-B01,B02' },
  { id: 'B-26', prio: 'P0', part: 'B', title: 'Nhiều đơn/bàn', decision: 'Append nếu chưa PAID; order mới sau PAID', assignee: 'Backend', sprint: '2', us: 'US-B05', ac: ['D-08 logic'] },
  { id: 'B-27', prio: 'P1', part: 'B', title: 'Đổi bàn', decision: 'Thu ngân/pha chế đổi bàn', assignee: 'Full-stack', sprint: '6', us: 'B-30', ac: ['transfer table endpoint'] },
  { id: 'B-28', prio: 'P1', part: 'B', title: 'Số thứ tự mang đi', decision: '#042 format', assignee: 'Full-stack', sprint: '2', us: 'US-B01', ac: ['orderNumber hiển thị mang đi'] },
  { id: 'B-29', prio: 'P0', part: 'B', title: 'Thanh toán linh hoạt', decision: 'READY/sau giao hoặc rời bàn', assignee: 'Full-stack', sprint: '3', us: 'US-B06', ac: ['E-01: cho trả READY; optional trả trước'] },
  { id: 'B-30', prio: 'P2', part: 'B', title: 'Gộp/chuyển/tách bill', decision: 'MVP v2 Sprint 6; audit bắt buộc', assignee: 'Full-stack', sprint: '6', type: 'code' },
  { id: 'B-31', prio: 'P2', part: 'B', title: 'Giảm giá/voucher', decision: '% / cố định / voucher; 1 promo/đơn', assignee: 'Full-stack', sprint: '6', type: 'code' },
  { id: 'B-32', prio: 'P1', part: 'B', title: 'baristaNote vs internalNote', decision: '2 field riêng', assignee: 'Full-stack', sprint: '2', files: 'Order schema, order DTO', ac: ['baristaNote trên ticket bếp', 'internalNote chỉ NV/QL'] },
  { id: 'B-33', prio: 'P1', part: 'B', title: 'Đã giao → chờ thanh toán', decision: 'READY → nút Đã giao → deliveredAt', assignee: 'Full-stack', sprint: '2', map: 'TASK-P2-02', status: '✅', us: 'C-14' },

  // —— C Sprint 1 ——
  { id: 'C-01', prio: 'P0', part: 'C', title: 'Login email hoặc SĐT', decision: 'Gmail hoặc SĐT + MK', assignee: 'Full-stack', sprint: '1', us: 'US-A01', files: 'auth.service.ts, login.tsx' },
  { id: 'C-02', prio: 'P1', part: 'C', title: 'Quên MK qua Gmail OTP', decision: 'OTP email; notify Owner', assignee: 'Full-stack', sprint: '5', type: 'code', ac: ['Post-pilot hoặc Sprint 5 polish'] },
  { id: 'C-03', prio: 'P2', part: 'C', title: 'Khóa 5 lần sai MK', decision: '15 phút; audit', assignee: 'Backend', sprint: '5', type: 'code' },
  { id: 'C-04', prio: 'P0', part: 'C', title: 'JWT 15p + refresh', decision: 'Auto refresh nền', assignee: 'Full-stack', sprint: '1', files: 'auth module, apiClient interceptor' },
  { id: 'C-05', prio: 'P0', part: 'C', title: 'Session 8h max', decision: 'Refresh 8h; logout/đổi MK hết session', assignee: 'Backend', sprint: '1', type: 'code' },
  { id: 'C-06', prio: 'P2', part: 'C', title: 'Force logout đa thiết bị', decision: 'Owner/QL force; NV quản lý thiết bị', assignee: 'Backend', sprint: '6', type: 'code' },
  { id: 'C-07', prio: 'P2', part: 'C', title: 'Sinh trắc học unlock app', decision: 'Sau login lần đầu; SecureStore session', assignee: 'Mobile', sprint: '6', type: 'code' },
  { id: 'C-08', prio: 'P0', part: 'C', title: 'Staff không chọn CN', decision: 'Branch assignment auto', assignee: 'Mobile', sprint: '1', map: 'TASK-P2-01', status: '✅', us: 'US-A02' },
  { id: 'C-09', prio: 'P1', part: 'C', title: 'Owner đổi CN không logout', decision: 'Working branch context + audit', assignee: 'Mobile', sprint: '1', files: 'branch.tsx, session store' },
  { id: 'C-10', prio: 'P1', part: 'C', title: 'Notify Owner duyệt CN', decision: 'PENDING_OWNER → Owner badge/push v2', assignee: 'Full-stack', sprint: '5', us: 'BRANCH_ASSIGNMENT' },
  { id: 'C-11', prio: 'P0', part: 'C', title: 'Bỏ màn chọn role', decision: 'Route theo StaffRole', assignee: 'Mobile', sprint: '1', map: 'TASK-P2-01', status: '✅', us: 'US-A03' },
  { id: 'C-12', prio: 'P2', part: 'C', title: 'Không xác nhận role', decision: 'N/A sau C-11', assignee: '—', type: 'defer' },
  { id: 'C-13', prio: 'P1', part: 'C', title: '6 quick actions layout', decision: 'Hàng1: Tạo đơn|Sơ đồ|Món xong; Hàng2: DS đơn|TB|Lịch sử', assignee: 'Mobile', sprint: '1', us: 'US-A04', files: 'home.tsx' },
  { id: 'C-14', prio: 'P1', part: 'C', title: 'Món đã xong 2 tab', decision: 'Chờ giao vs Chờ thanh toán', assignee: 'Mobile', sprint: '2', map: 'TASK-P2-02', status: '✅' },
  { id: 'C-15', prio: 'P0', part: 'C', title: 'E2E SecureStore kill app', decision: 'Chưa test thiết bị thật', assignee: 'QA', sprint: '2', map: 'TASK-P2-05', type: 'qa' },

  // —— D Sprint 2 ——
  { id: 'D-01', prio: 'P0', part: 'D', title: '75/25 dine/takeaway', decision: 'Luôn màn chọn loại', assignee: 'Mobile', sprint: '2', us: 'US-B01' },
  { id: 'D-02', prio: 'P1', part: 'D', title: 'Luôn màn chọn loại', decision: 'Highlight loại gần nhất', assignee: 'Mobile', sprint: '2', us: 'US-B01' },
  { id: 'D-03', prio: 'P1', part: 'D', title: 'Mang đi không tên/SĐT', decision: 'Không bắt buộc', assignee: 'Mobile', sprint: '2', type: 'code' },
  { id: 'D-04', prio: 'P2', part: 'D', title: 'Enum DELIVERY reserved', decision: 'Schema only', assignee: 'Backend', sprint: '2', type: 'code' },
  { id: 'D-05', prio: 'P0', part: 'D', title: '50 bàn B01–B50', decision: 'T1/T2/sân', assignee: 'Backend', sprint: '2', map: 'TASK-P2-06', type: 'seed' },
  { id: 'D-06', prio: 'P0', part: 'D', title: 'Layout khu vực + list', decision: 'Zone + danh sách bàn', assignee: 'Mobile', sprint: '2', us: 'US-B02' },
  { id: 'D-07', prio: 'P0', part: 'D', title: 'OCCUPIED thêm món', decision: 'Tap → xem + thêm món', assignee: 'Mobile', sprint: '2', us: 'US-B02' },
  { id: 'D-08', prio: 'P0', part: 'D', title: 'Nhiều order_id/bàn', decision: 'Append chưa PAID; mới sau PAID', assignee: 'Backend', sprint: '2', type: 'code' },
  { id: 'D-09', prio: 'P1', part: 'D', title: 'Polling bàn 3–5s', decision: '10s màn khác', assignee: 'Mobile', sprint: '2', map: 'TASK-P2-09', files: 'useTables.ts' },
  { id: 'D-10', prio: 'P1', part: 'D', title: 'MAINTENANCE legend', decision: 'Màu xám + legend; QL set', assignee: 'Mobile', sprint: '2', type: 'code' },
  { id: 'D-11', prio: 'P2', part: 'D', title: 'CLEANING', decision: 'Không pilot', assignee: '—', type: 'defer' },
  { id: 'D-12', prio: 'P1', part: 'D', title: 'Soft lock bàn ordering', decision: 'SELECTED 2–3p timeout', assignee: 'Full-stack', sprint: '2', ac: ['Map B-14'] },
  { id: 'D-13', prio: 'P0', part: 'D', title: 'Seed menu D-13 list', decision: '~40 món từ questionnaire', assignee: 'Backend', sprint: '2', map: 'TASK-P2-06', type: 'seed' },
  { id: 'D-14', prio: 'P1', part: 'D', title: 'Category tabs dynamic', decision: 'sort_order từ API', assignee: 'Mobile', sprint: '2', us: 'US-B03' },
  { id: 'D-15', prio: 'P1', part: 'D', title: 'Tìm kiếm món', decision: 'Không dấu / gần đúng', assignee: 'Mobile', sprint: '2', type: 'code' },
  { id: 'D-16', prio: 'P0', part: 'D', title: 'Món hết hàng badge', decision: 'Hiện + gạch + không thêm giỏ', assignee: 'Full-stack', sprint: '2', type: 'code' },
  { id: 'D-17', prio: 'P0', part: 'D', title: 'VAT 8% inclusive bill', decision: 'Tách dòng VAT', assignee: 'Full-stack', sprint: '2', map: 'TASK-P2-04', status: '✅' },
  { id: 'D-18', prio: 'P2', part: 'D', title: 'Best-seller sort', decision: 'sort_order manual', assignee: '—', type: 'defer' },
  { id: 'D-19', prio: 'P1', part: 'D', title: 'Giá đồng nhất 3 CN', decision: 'Same price all branches', assignee: 'Backend', sprint: '2', type: 'seed' },
  { id: 'D-20', prio: 'P2', part: 'D', title: 'Ảnh món', decision: 'Placeholder pilot', assignee: '—', type: 'defer' },
  { id: 'D-21', prio: 'P0', part: 'D', title: 'Modifier Size/Đường/Đá', decision: 'Nóng ẩn Đá; bánh không modifier', assignee: 'Full-stack', sprint: '2', us: 'US-B04' },
  { id: 'D-22', prio: 'P0', part: 'D', title: 'Phụ thu Size/topping', decision: 'Đường/Đá free', assignee: 'Backend', sprint: '2', type: 'code' },
  { id: 'D-23', prio: 'P1', part: 'D', title: 'Max 3 topping', decision: 'Phụ thu từng topping', assignee: 'Full-stack', sprint: '2', type: 'code' },
  { id: 'D-24', prio: 'P1', part: 'D', title: 'Skip modal món đơn giản', decision: 'requiresCustomization false → thêm thẳng', assignee: 'Mobile', sprint: '2', type: 'code' },
  { id: 'D-25', prio: 'P1', part: 'D', title: 'Ghi chú món vs đơn', decision: 'baristaNote per line; internalNote per order', assignee: 'Full-stack', sprint: '2', ac: ['B-32'] },
  { id: 'D-26', prio: 'P1', part: 'D', title: 'Default modifier M', decision: 'M, đường/đá bình thường', assignee: 'Mobile', sprint: '2', type: 'code' },
  { id: 'D-27', prio: 'P0', part: 'D', title: 'Append vs new order', decision: 'Chưa PAID append; PAID new', assignee: 'Backend', sprint: '2', us: 'US-B05' },
  { id: 'D-28', prio: 'P0', part: 'D', title: 'Hủy PENDING + lý do', decision: 'Audit bắt buộc', assignee: 'Full-stack', sprint: '2', type: 'code' },
  { id: 'D-29', prio: 'P1', part: 'D', title: 'Gửi bếp một phần', decision: 'Chọn món gửi', assignee: 'Mobile', sprint: '2', type: 'code' },
  { id: 'D-30', prio: 'P1', part: 'D', title: 'Draft cart trước gửi bếp', decision: 'Local draft; sau gửi từ server', assignee: 'Mobile', sprint: '2', files: 'cart store' },
  { id: 'D-31', prio: 'P1', part: 'D', title: 'Toast + sound gửi bếp', decision: 'Tablet trạm; # mang đi', assignee: 'Mobile', sprint: '2', type: 'code' },
  { id: 'D-32', prio: 'P1', part: 'D', title: 'Chặn món hết hàng lúc gửi', decision: 'Dialog liệt kê', assignee: 'Full-stack', sprint: '2', type: 'code' },
  { id: 'D-33', prio: 'P1', part: 'D', title: 'Tab Bếp demo S2', decision: 'Polling PENDING queue', assignee: 'Mobile', sprint: '2', map: 'TASK-P2-03b', status: '✅' },

  // —— E Sprint 3 ——
  { id: 'E-01', prio: 'P0', part: 'E', title: 'Thanh toán READY default', decision: 'Cho trả trước nếu cần', assignee: 'Full-stack', sprint: '3', us: 'US-B06', map: 'TASK-P2-10' },
  { id: 'E-02', prio: 'P1', part: 'E', title: 'Mệnh giá nhanh TM', decision: '50/100/200/500k', assignee: 'Mobile', sprint: '3', us: 'US-B06' },
  { id: 'E-03', prio: 'P2', part: 'E', title: 'Không làm tròn lẻ', decision: 'Thu đúng bill', assignee: 'Mobile', sprint: '3', type: 'code' },
  { id: 'E-04', prio: 'P0', part: 'E', title: 'STK theo chủ quán', decision: 'Per branch config', assignee: 'Backend', sprint: '3', type: 'seed', ac: ['Chờ Owner cung cấp STK'] },
  { id: 'E-05', prio: 'P0', part: 'E', title: 'VietQR dynamic amount', decision: 'Bắt buộc MVP', assignee: 'Full-stack', sprint: '3', us: 'US-B07' },
  { id: 'E-06', prio: 'P1', part: 'E', title: 'CK 4 số cuối optional', decision: 'Khuyến khích nhập', assignee: 'Mobile', sprint: '3', type: 'code' },
  { id: 'E-07', prio: 'P1', part: 'E', title: 'CK chưa vào — chụp bill', decision: 'QL chốt sau', assignee: 'Ops', type: 'ops', ac: ['SOP training'] },
  { id: 'E-08', prio: 'P1', part: 'E', title: 'Thẻ ghi nhận thủ công', decision: 'Không POS', assignee: 'Mobile', sprint: '6', us: 'US-B08', type: 'defer' },
  { id: 'E-09', prio: 'P1', part: 'E', title: 'Pilot TM+CK only', decision: 'VNPay sandbox dev only', assignee: 'Full-stack', sprint: '3', us: 'US-B09' },
  { id: 'E-10', prio: 'P0', part: 'E', title: 'PAID → bàn EMPTY', decision: 'Tự EMPTY pilot', assignee: 'Backend', sprint: '3', type: 'code' },
  { id: 'E-11', prio: 'P2', part: 'E', title: 'Void payment QL/Owner', decision: 'Lý do + audit', assignee: 'Backend', sprint: '6', type: 'code' },
  { id: 'E-12', prio: 'P0', part: 'E', title: 'Tab đang phục vụ', decision: 'PENDING+MAKING+READY', assignee: 'Mobile', sprint: '3', us: 'US-B10' },
  { id: 'E-13', prio: 'P0', part: 'E', title: 'Tab chờ thanh toán', decision: 'delivered + chưa PAID', assignee: 'Mobile', sprint: '3', us: 'US-B10' },
  { id: 'E-14', prio: 'P1', part: 'E', title: 'Sort đơn', decision: 'Chờ lâu trước; lịch sử mới trước', assignee: 'Mobile', sprint: '3', type: 'code' },
  { id: 'E-15', prio: 'P1', part: 'E', title: 'Filter bàn/loại/trạng thái', decision: 'Không filter thu ngân', assignee: 'Mobile', sprint: '3', type: 'code' },
  { id: 'E-16', prio: 'P0', part: 'E', title: 'Lịch sử trong ca/hôm nay', decision: 'Theo ca B-07', assignee: 'Mobile', sprint: '3', us: 'US-B11' },
  { id: 'E-17', prio: 'P1', part: 'E', title: 'Xem tất cả đơn CN', decision: 'Tablet chung', assignee: 'Mobile', sprint: '3', type: 'code' },
  { id: 'E-18', prio: 'P2', part: 'E', title: 'Chi tiết PAID; export sau', decision: 'Xem trên app; CSV post-MVP', assignee: 'Mobile', sprint: '6', type: 'defer' },

  // —— F Sprint 4 ——
  { id: 'F-01', prio: 'P0', part: 'F', title: 'WebSocket bếp', decision: 'Primary; SSE fallback', assignee: 'Full-stack', sprint: '4', map: 'TASK-P2-11', us: 'US-C01' },
  { id: 'F-02', prio: 'P0', part: 'F', title: 'Queue chung không claim', decision: '2 NV shared queue', assignee: 'Backend', sprint: '4', type: 'code' },
  { id: 'F-03', prio: 'P0', part: 'F', title: 'FIFO queue', decision: 'Badge mang đi >5p v2.1', assignee: 'Mobile', sprint: '4', type: 'code' },
  { id: 'F-04', prio: 'P1', part: 'F', title: 'Cảnh báo 5p/10p', decision: 'Vàng 5p đỏ 10p', assignee: 'Mobile', sprint: '4', type: 'code' },
  { id: 'F-05', prio: 'P1', part: 'F', title: 'Âm thanh đơn mới', decision: 'Default on tablet', assignee: 'Mobile', sprint: '4', type: 'code' },
  { id: 'F-06', prio: 'P1', part: 'F', title: 'Tablet bếp station account', decision: 'Chung + picker NV', assignee: 'Mobile', sprint: '2', map: 'TASK-P2-03b', status: '✅' },
  { id: 'F-07', prio: 'P1', part: 'F', title: 'Modifier tags UI', decision: 'Tag màu + text', assignee: 'Mobile', sprint: '4', us: 'US-C02' },
  { id: 'F-08', prio: 'P1', part: 'F', title: 'Highlight baristaNote', decision: 'Vàng/đỏ gấp', assignee: 'Mobile', sprint: '4', type: 'code' },
  { id: 'F-09', prio: 'P0', part: 'F', title: '1 NV/đơn MAKING', decision: 'Tránh trùng pha', assignee: 'Backend', sprint: '4', us: 'US-C03' },
  { id: 'F-10', prio: 'P1', part: 'F', title: 'Qty x2 badge', decision: 'Tick cả dòng', assignee: 'Mobile', sprint: '4', type: 'code' },
  { id: 'F-11', prio: 'P1', part: 'F', title: 'Timer từ MAKING', decision: 'Hiện chờ từ PENDING nếu >5p', assignee: 'Mobile', sprint: '4', type: 'code' },
  { id: 'F-12', prio: 'P0', part: 'F', title: 'Xóa SERVING', decision: 'deliveredAt', assignee: 'Full-stack', sprint: '2', map: 'TASK-P2-02', status: '✅' },
  { id: 'F-13', prio: 'P0', part: 'F', title: 'Push READY', decision: 'Tablet in-app; ĐT Expo push v2', assignee: 'Mobile', sprint: '6', us: 'US-E02' },
  { id: 'F-14', prio: 'P1', part: 'F', title: 'READY >10p alert QL', decision: 'Notify QL', assignee: 'Full-stack', sprint: '6', type: 'code' },
  { id: 'F-15', prio: 'P1', part: 'F', title: 'Revert READY→MAKING', decision: 'Lý do + audit', assignee: 'Backend', sprint: '4', us: 'US-C04' },
  { id: 'F-16', prio: 'P0', part: 'F', title: 'WS fallback polling 10s', decision: 'Banner chậm', assignee: 'Mobile', sprint: '4', type: 'code' },
  { id: 'F-17', prio: 'P1', part: 'F', title: 'No foreground service', decision: 'Tablet always on', assignee: '—', type: 'defer' },

  // —— G Sprint 5 ——
  { id: 'G-01', prio: 'P0', part: 'G', title: 'Dashboard số đơn PAID', decision: 'Proxy khách', assignee: 'Full-stack', sprint: '5', us: 'US-D01' },
  { id: 'G-02', prio: 'P1', part: 'G', title: 'Timezone VN', decision: 'Asia/Ho_Chi_Minh', assignee: 'Backend', sprint: '5', type: 'code' },
  { id: 'G-03', prio: 'P1', part: 'G', title: 'Doanh thu gross', decision: 'Không trừ phí CK', assignee: 'Backend', sprint: '5', us: 'US-D02' },
  { id: 'G-04', prio: 'P1', part: 'G', title: 'Top 10 món top 5 cat', decision: 'Dashboard', assignee: 'Mobile', sprint: '5', type: 'code' },
  { id: 'G-05', prio: 'P1', part: 'G', title: 'Owner multi-CN dashboard', decision: 'Drill-down', assignee: 'Mobile', sprint: '5', us: 'US-D01' },
  { id: 'G-06', prio: 'P0', part: 'G', title: 'Doanh thu gộp ca', decision: 'Không tách NV', assignee: 'Backend', sprint: '5', type: 'code' },
  { id: 'G-07', prio: 'P1', part: 'G', title: 'Form kết ca TM', decision: 'Chênh lệch bắt buộc ghi chú', assignee: 'Mobile', sprint: '5', us: 'US-D03' },
  { id: 'G-08', prio: 'P1', part: 'G', title: 'Kết ca logout ĐT', decision: 'Tablet không force', assignee: 'Mobile', sprint: '5', type: 'code' },
  { id: 'G-09', prio: 'P0', part: 'G', title: 'CRUD menu soft-hide', decision: 'Xóa cứng Owner only', assignee: 'Full-stack', sprint: '5', us: 'US-D04' },
  { id: 'G-10', prio: 'P1', part: 'G', title: 'Sửa giá ngay', decision: 'Audit; đơn mới apply', assignee: 'Backend', sprint: '5', type: 'code' },
  { id: 'G-11', prio: 'P2', part: 'G', title: 'Upload ảnh món', decision: 'v2.1', assignee: '—', type: 'defer' },
  { id: 'G-12', prio: 'P2', part: 'G', title: 'Modifier template UI', decision: 'Post-MVP', assignee: '—', type: 'defer' },
  { id: 'G-13', prio: 'P1', part: 'G', title: 'NV active flag', decision: 'Manager set isActive', assignee: 'Backend', sprint: '5', us: 'US-D05' },
  { id: 'G-14', prio: 'P1', part: 'G', title: 'Tạo NV trên app', decision: 'Pilot seed; v2 Owner tạo', assignee: 'Full-stack', sprint: '5', type: 'code' },
  { id: 'G-15', prio: 'P0', part: 'G', title: 'BRANCH_ASSIGNMENT pilot', decision: 'QL đề xuất Owner duyệt', assignee: 'Full-stack', sprint: '5', files: 'BRANCH_ASSIGNMENT.md' },
  { id: 'G-16', prio: 'P1', part: 'G', title: 'Push duyệt CN', decision: 'MVP v2', assignee: 'Full-stack', sprint: '6', type: 'code' },
  { id: 'G-17', prio: 'P2', part: 'G', title: 'Lịch ca NV', decision: 'Ngoài MVP', assignee: '—', type: 'defer' },
  { id: 'G-18', prio: 'P1', part: 'G', title: 'QL quản lý bàn', decision: 'Pilot seed; v2 thêm/MAINTENANCE', assignee: 'Mobile', sprint: '5', us: 'US-E01' },
  { id: 'G-19', prio: 'P1', part: 'G', title: 'MAINTENANCE block OCCUPIED', decision: 'Phải PAID/chuyển đơn', assignee: 'Backend', sprint: '5', type: 'code' },
  { id: 'G-20', prio: 'P0', part: 'G', title: 'Manager scope 1 CN', decision: 'Owner all CN', assignee: 'Backend', sprint: '5', type: 'code' },
  { id: 'G-21', prio: 'P1', part: 'G', title: 'Hoãn inventory/export', decision: 'Post-pilot list', assignee: 'TPM', type: 'doc' },

  // —— H Sprint 6 ——
  { id: 'H-01', prio: 'P0', part: 'H', title: 'Notification types', decision: 'ORDER_NEW, ORDER_READY, BRANCH_PENDING', assignee: 'Full-stack', sprint: '6', us: 'US-E02' },
  { id: 'H-02', prio: 'P1', part: 'H', title: 'Feed 7 ngày unread', decision: 'Mark read + badge', assignee: 'Mobile', sprint: '6', type: 'code' },
  { id: 'H-03', prio: 'P1', part: 'H', title: 'Expo push credentials', decision: 'ĐT Owner/NV; tablet in-app', assignee: 'DevOps', sprint: '6', type: 'ops' },
  { id: 'H-04', prio: 'P1', part: 'H', title: 'Đổi MK rule', decision: 'MK cũ + ≥8 char', assignee: 'Full-stack', sprint: '6', us: 'US-E03' },
  { id: 'H-05', prio: 'P2', part: 'H', title: 'Thông tin quán screen', decision: 'Tên, địa chỉ, hotline, STK ẩn bớt', assignee: 'Mobile', sprint: '6', type: 'code' },
  { id: 'H-06', prio: 'P2', part: 'H', title: 'Toggle âm thanh/rung', decision: 'Per device', assignee: 'Mobile', sprint: '6', type: 'code' },
  { id: 'H-07', prio: 'P2', part: 'H', title: 'Version trong Cài đặt', decision: 'version+build', assignee: 'Mobile', sprint: '6', type: 'code' },
  { id: 'H-08', prio: 'P0', part: 'H', title: 'Ngày G pilot', decision: 'Sau Sprint 3 UAT; giấy 3–5 ngày', assignee: 'PO/TPM', type: 'ops' },
  { id: 'H-09', prio: 'P0', part: 'H', title: 'UAT 15 kịch bản', decision: 'Owner+QL chấm', assignee: 'QA', sprint: '6', map: 'TASK-P4-03', type: 'qa' },
  { id: 'H-10', prio: 'P1', part: 'H', title: 'SLA S1 4h', decision: 'Giờ mở cửa', assignee: 'Dev on-call', type: 'ops' },
  { id: 'H-11', prio: 'P1', part: 'H', title: 'Go CN2 gate 7 ngày', decision: '0 critical', assignee: 'Owner', type: 'ops' },
  { id: 'H-12', prio: 'P1', part: 'H', title: 'NFR WiFi p95', decision: 'WiFi primary; 4G spot', assignee: 'QA', map: 'TASK-P3-04', type: 'qa' },
  { id: 'H-13', prio: 'P1', part: 'H', title: 'Review copy VN', decision: 'QL+Owner trước UAT', assignee: 'Dev', map: 'TASK-P4-06', type: 'doc' },

  // —— I Infra ——
  { id: 'I-01', prio: 'P0', part: 'I', title: 'VPS + SSL', decision: 'api.* Lets Encrypt VN', assignee: 'DevOps', sprint: '3', map: 'TASK-P2-08', type: 'ops' },
  { id: 'I-02', prio: 'P0', part: 'I', title: 'EXPO_PUBLIC_API_URL', decision: 'Staging→prod sau UAT', assignee: 'Mobile/DevOps', sprint: '5', type: 'ops' },
  { id: 'I-03', prio: 'P1', part: 'I', title: 'Seed thật staging', decision: 'Menu D-13 + 50 bàn + 3 CN', assignee: 'Backend', sprint: '2', map: 'TASK-P2-06', status: '✅', type: 'seed' },
  { id: 'I-04', prio: 'P2', part: 'I', title: 'OpenAPI generate', decision: 'Sprint 3 GAP-07', assignee: 'Tech Lead', sprint: '3', map: 'GAP-07', type: 'code' },
  { id: 'I-05', prio: 'P1', part: 'I', title: 'Design PNG repo', decision: 'Optional; DESIGN_SYSTEM ok', assignee: 'Designer', map: 'GAP-08', type: 'doc' },
  { id: 'I-06', prio: 'P1', part: 'I', title: '100% tiếng Việt', decision: 'No i18n pilot', assignee: 'Mobile', type: 'code', ac: ['All UI strings VI'] },
  { id: 'I-07', prio: 'P2', part: 'I', title: 'Chữ lớn toggle', decision: 'v2.1', assignee: '—', type: 'defer' },
  { id: 'I-08', prio: 'P2', part: 'I', title: 'No dark mode', decision: 'Light only', assignee: 'Mobile', type: 'code', ac: ['No dark theme'] },
  { id: 'I-09', prio: 'P2', part: 'I', title: 'Google Play internal', decision: 'Sprint 5-6 Android', assignee: 'DevOps', sprint: '5', map: 'TASK-P8-02', type: 'ops' },

  // —— GAP ——
  { id: 'GAP-01', prio: 'P0', part: 'J', title: 'Sprint 1 status', decision: 'Code done; C-15 pending', assignee: 'Tech Lead', type: 'doc', status: '✅' },
  { id: 'GAP-02', prio: 'P0', part: 'J', title: 'Staff no branch pick', decision: 'Owner only', assignee: '—', status: '✅', type: 'doc' },
  { id: 'GAP-03', prio: 'P0', part: 'J', title: 'VAT 8%', decision: 'Inclusive', assignee: '—', map: 'TASK-P2-04', status: '✅', type: 'doc' },
  { id: 'GAP-04', prio: 'P2', part: 'J', title: 'Split bill in scope', decision: 'MVP v2', assignee: 'Full-stack', sprint: '6', type: 'code' },
  { id: 'GAP-05', prio: 'P0', part: 'J', title: 'deliveredAt', decision: 'No SERVING', assignee: 'Full-stack', map: 'TASK-P2-02', status: '✅', type: 'code' },
  { id: 'GAP-06', prio: 'P0', part: 'J', title: 'Shift Sprint 5', decision: 'Optional pilot', assignee: 'Backend', sprint: '5', type: 'code' },
  { id: 'GAP-07', prio: 'P2', part: 'J', title: 'OpenAPI', decision: 'Sprint 3', assignee: 'Tech Lead', map: 'I-04', type: 'code' },
  { id: 'GAP-08', prio: 'P1', part: 'J', title: 'Design PNG', decision: 'Optional not block', assignee: 'Designer', type: 'doc' },
  { id: 'GAP-09', prio: 'P0', part: 'J', title: 'AuthProvider done', decision: 'Yes', assignee: '—', status: '✅', type: 'doc' },
  { id: 'GAP-10', prio: 'P1', part: 'J', title: 'Polling S2-3 WS S4', decision: 'Aligned', assignee: '—', status: '✅', type: 'doc' },
  { id: 'GAP-11', prio: 'P0', part: 'J', title: 'Station kitchen tab', decision: 'Tab Bếp trạm', assignee: 'Mobile', map: 'TASK-P2-03b', status: '✅', type: 'code' },
];

const TYPE_ACTION = {
  code: 'Implement code theo quyết định nghiệp vụ. Đọc USER_STORIES + API_CONTRACT trước.',
  seed: 'Cập nhật seed/import data (prisma/seed, staging JSON). Không hard-code trong app.',
  ops: 'Thực hiện quy trình vận hành / deploy / meeting — không hoặc ít code.',
  qa: 'Viết test plan, chạy manual/E2E, ghi evidence.',
  doc: 'Cập nhật tài liệu hoặc xác nhận — không đổi logic app.',
  defer: 'KHÔNG implement trong phase hiện tại. Ghi backlog post-MVP.',
};

function buildPrompt(item) {
  const ac = item.ac?.length ? item.ac : [`Đáp ứng quyết định: ${item.decision}`];
  const files = item.files ? `\nFILE GỢI Ý: ${item.files}` : '';
  const us = item.us ? `\nUSER STORY: ${item.us}` : '';
  const map = item.map ? `\nTASK LIÊN QUAN: ${item.map}${item.status ? ' ' + item.status : ''}` : '';
  const defer = item.type === 'defer';

  return `Bạn là dev/QA/ops CaffeApp — đọc STAKEHOLDER_QUESTIONNAIRE.md ${item.id}.

ID: ${item.id} · Phần ${item.part} · Ưu tiên ${item.prio} · Sprint ${item.sprint ?? '—'}
TIÊU ĐỀ: ${item.title}
QUYẾT ĐỊNH ĐÃ CHỐT: ${item.decision}
LOẠI VIỆC: ${(item.type ?? 'code').toUpperCase()} — ${TYPE_ACTION[item.type ?? 'code']}${us}${map}${files}

${defer ? 'NHIỆM VỤ: Xác nhận không code. Ghi note trong backlog nếu có ticket mở nhầm.\n' : `NHIỆM VỤ:
1. Đọc ${item.id} trong questionnaire + PRD/US liên quan.
2. Phân tích code hiện tại (grep, đọc module liên quan).
3. Implement/fix tối thiểu scope — khớp quyết định trên.
4. Không đổi nghiệp vụ ngoài questionnaire (freeze rule DOC_FREEZE_MEMO).
`}
ACCEPTANCE CRITERIA:
${ac.map((a, i) => `${i + 1}. ${a}`).join('\n')}

KIỂM TRA: npm run typecheck; test liên quan; manual theo TESTING.md nếu UI.
OUTPUT: PR title "[${item.id}] ${item.title}" + mô tả file đã sửa.`;
}

let md = `# CaffeApp — Prompt giao việc FULL (theo Questionnaire)

**Nguồn:** [STAKEHOLDER_QUESTIONNAIRE.md](STAKEHOLDER_QUESTIONNAIRE.md) · [GO_LIVE_PLAN.md](GO_LIVE_PLAN.md)  
**Phiên bản:** 2.0.0 · **Sinh:** ${new Date().toISOString().slice(0, 10)}  
**Tổng task:** ${ITEMS.length} (A→I + GAP)

> Copy block \`\`\`text\`\`\` vào Cursor Agent / giao dev. Mỗi ID = 1 ticket.

---

## Master Index

| ID | P | Sprint | Loại | Giao cho | Map | Status |
| -- | - | ------ | ---- | -------- | --- | ------ |
`;

for (const i of ITEMS) {
  md += `| [${i.id}](#task-q-${i.id.toLowerCase()}) | ${i.prio} | ${i.sprint ?? '—'} | ${i.type ?? 'code'} | ${i.assignee} | ${i.map || '—'} | ${i.status || '⏳'} |\n`;
}

md += `\n---\n\n## Prompt chi tiết theo ID\n\n`;

for (const item of ITEMS) {
  md += `### TASK-Q-${item.id} {#task-q-${item.id.toLowerCase()}}\n\n`;
  md += `| | |\n| --- | --- |\n`;
  md += `| **Giao cho** | ${item.assignee} |\n`;
  md += `| **Ưu tiên** | ${item.prio} |\n`;
  md += `| **Sprint** | ${item.sprint ?? '—'} |\n`;
  md += `| **Loại** | ${item.type} |\n`;
  if (item.us) md += `| **User Story** | ${item.us} |\n`;
  if (item.map) md += `| **Map** | ${item.map} |\n`;
  if (item.status) md += `| **Trạng thái** | ${item.status} |\n`;
  md += `\n\`\`\`text\n${buildPrompt(item)}\n\`\`\`\n\n---\n\n`;
}

// User Stories rollup
const US = [
  ['US-A01', 'C-01,C-04,C-05', 'Login JWT', 'Sprint 1', 'TASK-P2-01'],
  ['US-A02', 'C-08,C-09', 'Owner chọn CN', 'Sprint 1', 'TASK-P2-01'],
  ['US-A03', 'C-11,C-12', 'Routing StaffRole', 'Sprint 1', 'TASK-P2-01 ✅'],
  ['US-A04', 'C-13,C-14', 'Home quick actions', 'Sprint 1', '—'],
  ['US-B01', 'D-01,D-02,D-03,B-28', 'Chọn loại đơn', 'Sprint 2', 'TASK-P2-09'],
  ['US-B02', 'D-05..D-12,B-14', 'Sơ đồ bàn', 'Sprint 2', 'TASK-P2-09'],
  ['US-B03', 'D-13..D-20', 'Menu', 'Sprint 2', 'TASK-P2-09'],
  ['US-B04', 'D-21..D-26', 'Tùy chỉnh món', 'Sprint 2', 'TASK-P2-09'],
  ['US-B05', 'D-27..D-33', 'Giỏ + gửi bếp', 'Sprint 2', 'TASK-P2-09'],
  ['US-B06', 'E-01..E-03', 'Tiền mặt', 'Sprint 3', 'TASK-P2-10'],
  ['US-B07', 'E-04..E-07,B-24', 'Chuyển khoản', 'Sprint 3', 'TASK-P2-10'],
  ['US-B08', 'E-08', 'Thẻ thủ công', 'Sprint 6', 'defer'],
  ['US-B09', 'E-09', 'VNPay sandbox', 'Sprint 3 dev', 'defer prod'],
  ['US-B10', 'E-12..E-15', 'Danh sách đơn', 'Sprint 3', 'TASK-P2-10'],
  ['US-B11', 'E-16..E-18', 'Lịch sử đơn', 'Sprint 3', 'TASK-P2-10'],
  ['US-C01', 'F-01..F-06,F-16', 'Queue realtime', 'Sprint 4', 'TASK-P2-11'],
  ['US-C02', 'F-07,F-08', 'Chi tiết đơn bếp', 'Sprint 4', '—'],
  ['US-C03', 'F-09..F-12,F-15', 'Đang pha', 'Sprint 4', '—'],
  ['US-C04', 'F-13,F-14', 'Hoàn thành', 'Sprint 4', '—'],
  ['US-D01', 'G-01,G-02,G-05', 'Dashboard', 'Sprint 5', '—'],
  ['US-D02', 'G-03,G-04,G-06', 'Báo cáo DT', 'Sprint 5', '—'],
  ['US-D03', 'G-07,G-08,B-03', 'Kết ca', 'Sprint 5', '—'],
  ['US-D04', 'G-09,G-10', 'Quản lý menu', 'Sprint 5', '—'],
  ['US-D05', 'G-13,G-14,G-15', 'Nhân viên', 'Sprint 5', '—'],
  ['US-D06', 'B-22,B-23', 'Audit UI', 'Sprint 5', '—'],
  ['US-E01', 'G-18,G-19', 'Quản lý bàn', 'Sprint 5', '—'],
  ['US-E02', 'H-01..H-03', 'Thông báo', 'Sprint 6', '—'],
  ['US-E03', 'H-04..H-07', 'Cài đặt', 'Sprint 6', '—'],
];

md += `## User Stories — Prompt tổng hợp\n\n`;
md += `| US | Questionnaire IDs | Mô tả | Sprint | Phase task |\n| -- | ----------------- | ----- | ------ | ---------- |\n`;
for (const [us, ids, desc, sp, map] of US) {
  md += `| ${us} | ${ids} | ${desc} | ${sp} | ${map} |\n`;
}

md += `\n### Prompt mẫu giao theo User Story\n\n\`\`\`text\n`;
md += `Bạn implement User Story [US-XXX] cho CaffeApp.\n`;
md += `1. Đọc USER_STORIES.md acceptance criteria cho US-XXX.\n`;
md += `2. Đọc TẤT CẢ questionnaire IDs liên quan (cột trên).\n`;
md += `3. Đọc design/screens/INDEX.md màn hình tương ứng.\n`;
md += `4. Implement full-stack; business rules trên API.\n`;
md += `5. Manual test theo TESTING.md critical path.\n`;
md += `OUTPUT: PR per US hoặc sub-PR ≤400 LOC.\n\`\`\`\n\n`;

// UAT 15
const UAT = [
  ['UAT-01', 'C-11,C-08', 'Owner login + chọn CN'],
  ['UAT-02', 'C-08,C-11', 'Staff login routing'],
  ['UAT-03', 'C-15', 'SecureStore kill app'],
  ['UAT-04', 'B-15,D-27', 'Tạo đơn + chọn NV'],
  ['UAT-05', 'B-28,D-01', 'Mang đi + số thứ tự'],
  ['UAT-06', 'B-14,D-12', 'Khóa bàn'],
  ['UAT-07', 'D-33,F-01', 'Bếp MAKING→READY'],
  ['UAT-08', 'B-33,F-12', 'Đã giao deliveredAt'],
  ['UAT-09', 'E-02', 'Thanh toán TM'],
  ['UAT-10', 'E-05,B-24', 'CK VietQR'],
  ['UAT-11', 'D-17', 'VAT bill'],
  ['UAT-12', 'D-28,B-22', 'Hủy đơn audit'],
  ['UAT-13', 'B-30', 'Gộp/chuyển bàn v2'],
  ['UAT-14', 'B-03,G-07', 'Kết ca TM/CK'],
  ['UAT-15', 'B-18', 'Mất mạng SOP'],
];

md += `## UAT 15 kịch bản — Prompt (H-09)\n\n`;
for (const [id, qids, title] of UAT) {
  md += `### TASK-${id}\n\n\`\`\`text\n`;
  md += `QA/Owner chạy UAT: ${title}.\nQuestionnaire: ${qids}.\n`;
  md += `Steps: (ghi từ GO_LIVE_PLAN UAT checklist).\nPass: đúng AC questionnaire.\nFail: ticket S1-S4 + video.\n\`\`\`\n\n`;
}

writeFileSync(OUT, md, 'utf8');
console.log(`Wrote ${ITEMS.length} prompts to ${OUT}`);
