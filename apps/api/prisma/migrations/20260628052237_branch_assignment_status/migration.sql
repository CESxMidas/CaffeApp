-- CreateEnum
CREATE TYPE "BranchAssignmentStatus" AS ENUM ('NONE', 'PENDING_OWNER', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "staff" ADD COLUMN     "approved_at" TIMESTAMP(3),
ADD COLUMN     "assigned_by_staff_id" UUID,
ADD COLUMN     "branch_assignment_status" "BranchAssignmentStatus" NOT NULL DEFAULT 'NONE';

-- CreateIndex
CREATE INDEX "staff_branch_assignment_status_idx" ON "staff"("branch_assignment_status");
