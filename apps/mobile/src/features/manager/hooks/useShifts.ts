import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { shiftService } from '@shared/lib/api';

export function useShifts(branchId?: string | null) {
  return useQuery({
    queryKey: ['shifts', branchId],
    queryFn: () => shiftService.list(branchId ?? undefined),
    enabled: Boolean(branchId),
  });
}

export function useActiveShift(branchId?: string | null) {
  return useQuery({
    queryKey: ['shift', 'active', branchId],
    queryFn: () => shiftService.getActive(branchId ?? undefined),
    enabled: Boolean(branchId),
  });
}

export function useOpenShift() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: shiftService.open,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['shifts'] });
      void queryClient.invalidateQueries({ queryKey: ['shift', 'active'] });
    },
  });
}

export function useCloseShift() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: shiftService.close,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['shifts'] });
      void queryClient.invalidateQueries({ queryKey: ['shift', 'active'] });
    },
  });
}
