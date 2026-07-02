import { useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  orderService,
  ORDER_WS_EVENTS,
  connectOrderSocket,
  disconnectOrderSocket,
} from '@shared/lib/api';
import { useSessionStore } from '@shared/stores/session';

/**
 * Kitchen queue — WebSocket primary, polling 10s fallback.
 *
 * - Connects to `/ws` namespace with JWT from session.
 * - On `barista.queue.updated` / `order.created` / `order.status.changed` → invalidate query.
 * - Polling `refetchInterval: 10_000` stays active as fallback when WS disconnects.
 *
 * @see TASK-P2-11 — Sprint 4 P1: WebSocket bếp
 */
export function useBaristaQueue() {
  const queryClient = useQueryClient();
  const accessToken = useSessionStore((s) => s.accessToken);
  const socketRef = useRef<ReturnType<typeof connectOrderSocket> | null>(null);

  const query = useQuery({
    queryKey: ['barista-queue'],
    queryFn: () => orderService.listOrders(),
    refetchInterval: 10_000,
  });

  useEffect(() => {
    if (!accessToken) return;

    // Connect WebSocket
    const socket = connectOrderSocket(accessToken);
    socketRef.current = socket;

    const invalidate = () => {
      queryClient.invalidateQueries({ queryKey: ['barista-queue'] });
    };

    // Listen for server events → invalidate TanStack Query
    socket.on(ORDER_WS_EVENTS.QUEUE_UPDATED, invalidate);
    socket.on(ORDER_WS_EVENTS.CREATED, invalidate);
    socket.on(ORDER_WS_EVENTS.STATUS_CHANGED, invalidate);

    // On reconnect, immediately refetch
    socket.on('connect', invalidate);

    return () => {
      socket.off(ORDER_WS_EVENTS.QUEUE_UPDATED, invalidate);
      socket.off(ORDER_WS_EVENTS.CREATED, invalidate);
      socket.off(ORDER_WS_EVENTS.STATUS_CHANGED, invalidate);
      socket.off('connect', invalidate);
    };
  }, [accessToken, queryClient]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnectOrderSocket();
      socketRef.current = null;
    };
  }, []);

  return query;
}
