import { useQuery } from '@tanstack/react-query';
import { orderService } from '@shared/lib/api';

/** Kitchen queue — barista branch comes from JWT; auto-refresh every 10s. */
export function useBaristaQueue() {
  return useQuery({
    queryKey: ['barista-queue'],
    queryFn: () => orderService.listOrders(),
    refetchInterval: 10_000,
  });
}
