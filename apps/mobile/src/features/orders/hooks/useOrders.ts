import { useQuery, useQueryClient } from '@tanstack/react-query';
import { orderService, ORDER_WS_EVENTS, connectOrderSocket } from '@shared/lib/api';
import { useSessionStore } from '@shared/stores/session';
import { useEffect } from 'react';

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
  const queryClient = useQueryClient();
  const accessToken = useSessionStore((s) => s.accessToken);
  const useJwtBranch = branchId === undefined;

  const query = useQuery({
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

  // WebSocket: invalidate orders list on real-time events
  useEffect(() => {
    if (!accessToken) return;

    const socket = connectOrderSocket(accessToken);

    const invalidate = () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    };

    socket.on(ORDER_WS_EVENTS.CREATED, invalidate);
    socket.on(ORDER_WS_EVENTS.STATUS_CHANGED, invalidate);
    socket.on(ORDER_WS_EVENTS.QUEUE_UPDATED, invalidate);

    return () => {
      socket.off(ORDER_WS_EVENTS.CREATED, invalidate);
      socket.off(ORDER_WS_EVENTS.STATUS_CHANGED, invalidate);
      socket.off(ORDER_WS_EVENTS.QUEUE_UPDATED, invalidate);
    };
  }, [accessToken, queryClient]);

  return query;
}
