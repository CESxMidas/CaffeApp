# Staff feature

Quản lý nhân viên phía mobile: danh sách NV, luồng gán chi nhánh (đề xuất → Owner duyệt), và StaffPicker cho tablet trạm (B-15).

## Public API (`index.ts`)

| Export                               | Mô tả                                        |
| ------------------------------------ | -------------------------------------------- |
| `useStaffList`                       | Danh sách NV theo chi nhánh                  |
| `usePendingBranchAssignments`        | Đề xuất gán CN chờ Owner duyệt               |
| `useProposeBranchAssignment`         | Manager đề xuất gán NV vào CN                |
| `useApproveBranchAssignment`         | Owner duyệt                                  |
| `useRejectBranchAssignment`          | Owner từ chối                                |
| `useBranchOperators`                 | Danh sách NV thao tác cho tablet trạm        |
| `useStaffActor` + `StaffPickerModal` | Chọn tên NV xác nhận trước thao tác nhạy cảm |

## Screens sử dụng

`(manager)/staff.tsx`, `(manager)/staff/[id].tsx`, `(manager)/branch-approvals.tsx`, mọi màn có thao tác nhạy cảm trên tablet trạm.
