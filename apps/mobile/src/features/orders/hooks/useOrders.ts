import { useQuery } from '@tanstack/react-query';
import { orderService } from '@shared/lib/api';

interface UseOrdersOptions {
  /** Omit for barista — API uses JWT branch. Pass null to disable the query. */
  branchId?: string | null;
  status?: string;
  deliveryState?: 'awaiting_delivery' | 'awaiting_payment';
  refetchInterval?: number | false;
}

export function useOrders({
  branchId,
  status,
  deliveryState,
  refetchInterval,
}: UseOrdersOptions = {}) {
  const useJwtBranch = branchId === undefined;

  return useQuery({
    queryKey: ['orders', useJwtBranch ? 'jwt' : branchId, status, deliveryState],
    queryFn: () =>
      orderService.listOrders(
        useJwtBranch ? undefined : branchId!,
        status,
        undefined,
        deliveryState,
      ),
    enabled: useJwtBranch || Boolean(branchId),
    refetchInterval,
  });
}
