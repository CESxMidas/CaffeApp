import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { staffService } from '@shared/lib/api';

export function useStaffList() {
  return useQuery({
    queryKey: ['staff', 'list'],
    queryFn: () => staffService.list(),
  });
}

export function usePendingBranchAssignments(enabled = true) {
  return useQuery({
    queryKey: ['staff', 'pending-assignments'],
    queryFn: () => staffService.listPendingAssignments(),
    enabled,
  });
}

export function useProposeBranchAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ staffId, branchId }: { staffId: string; branchId: string }) =>
      staffService.proposeBranchAssignment(staffId, branchId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
  });
}

export function useApproveBranchAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (staffId: string) => staffService.approveBranchAssignment(staffId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
  });
}

export function useRejectBranchAssignment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (staffId: string) => staffService.rejectBranchAssignment(staffId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
  });
}
