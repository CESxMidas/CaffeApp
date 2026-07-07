import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { DeliverOrderRequestDto, OrderStatus } from '@caffeapp/shared';

import { orderService, ORDER_WS_EVENTS, connectOrderSocket } from '@shared/lib/api';
import { useSessionStore } from '@shared/stores/session';

export function useOrder(orderId: string | null) {
  const queryClient = useQueryClient();
  const accessToken = useSessionStore((s) => s.accessToken);

  const query = useQuery({
    queryKey: ['order', orderId],

    queryFn: () => orderService.getOrder(orderId!),

    enabled: Boolean(orderId),
  });

  // WebSocket: invalidate order detail on status change
  useEffect(() => {
    if (!accessToken || !orderId) return;

    const socket = connectOrderSocket(accessToken);

    const invalidate = () => {
      queryClient.invalidateQueries({ queryKey: ['order', orderId] });
    };

    socket.on(ORDER_WS_EVENTS.STATUS_CHANGED, invalidate);
    socket.on(ORDER_WS_EVENTS.QUEUE_UPDATED, invalidate);

    return () => {
      socket.off(ORDER_WS_EVENTS.STATUS_CHANGED, invalidate);
      socket.off(ORDER_WS_EVENTS.QUEUE_UPDATED, invalidate);
    };
  }, [accessToken, orderId, queryClient]);

  return query;
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,

      status,

      actedByStaffId,
    }: {
      orderId: string;

      status: OrderStatus;

      actedByStaffId?: string;
    }) => orderService.updateStatus(orderId, { status, actedByStaffId }),

    onSuccess: () => invalidateOrderWorkflow(queryClient),
  });
}

export function useToggleItemPrepared() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      itemId,
      isPrepared,
    }: {
      orderId: string;
      itemId: string;
      isPrepared: boolean;
    }) => orderService.toggleItemPrepared(orderId, itemId, isPrepared),

    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['orders'] });

      void queryClient.invalidateQueries({ queryKey: ['barista-queue'] });

      void queryClient.invalidateQueries({ queryKey: ['order', variables.orderId] });
    },
  });
}

export function useDeliverOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,

      actedByStaffId,
    }: {
      orderId: string;

      actedByStaffId?: string;
    }) => orderService.deliver(orderId, { actedByStaffId } satisfies DeliverOrderRequestDto),

    onSuccess: () => invalidateOrderWorkflow(queryClient),
  });
}

function invalidateOrderWorkflow(queryClient: ReturnType<typeof useQueryClient>) {
  void queryClient.invalidateQueries({ queryKey: ['orders'] });
  void queryClient.invalidateQueries({ queryKey: ['order'] });
  void queryClient.invalidateQueries({ queryKey: ['tables'] });
  void queryClient.invalidateQueries({ queryKey: ['barista-queue'] });
}

export function useTransferOrderTable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      tableId,
      mergeIntoOccupied,
      actedByStaffId,
    }: {
      orderId: string;
      tableId: string;
      mergeIntoOccupied?: boolean;
      actedByStaffId?: string;
    }) => orderService.transferTable(orderId, { tableId, mergeIntoOccupied, actedByStaffId }),

    onSuccess: () => invalidateOrderWorkflow(queryClient),
  });
}

export function useMergeOrders() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      targetOrderId,
      sourceOrderIds,
      actedByStaffId,
    }: {
      targetOrderId: string;
      sourceOrderIds: string[];
      actedByStaffId?: string;
    }) => orderService.mergeOrders({ targetOrderId, sourceOrderIds, actedByStaffId }),

    onSuccess: () => invalidateOrderWorkflow(queryClient),
  });
}

export function useSplitOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      items,
      actedByStaffId,
    }: {
      orderId: string;
      items: Array<{ itemId: string; quantity: number }>;
      actedByStaffId?: string;
    }) => orderService.splitOrder(orderId, { items, actedByStaffId }),

    onSuccess: () => invalidateOrderWorkflow(queryClient),
  });
}
