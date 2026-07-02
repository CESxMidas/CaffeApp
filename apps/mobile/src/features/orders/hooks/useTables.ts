import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { TableStatus } from '@caffeapp/shared';
import { tableService } from '@shared/lib/api';
import { useSessionStore } from '@shared/stores/session';

const TABLES_POLL_MS = 5_000;

export function useTables(branchId: string | null) {
  const accessToken = useSessionStore((s) => s.accessToken);
  const isOwner = useSessionStore((s) => s.isOwner);

  return useQuery({
    queryKey: ['tables', branchId ?? 'jwt'],
    queryFn: () => tableService.listTables(branchId ?? undefined),
    enabled: Boolean(accessToken) && (!isOwner || Boolean(branchId)),
    refetchInterval: TABLES_POLL_MS,
  });
}

export function useUpdateTableStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tableId, status }: { tableId: string; status: TableStatus }) =>
      tableService.updateStatus(tableId, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['tables'] });
    },
  });
}
