import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { DeliverOrderRequestDto, OrderStatus } from '@caffeapp/shared';
import { orderService } from '@shared/lib/api';

export function useOrder(orderId: string | null) {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => orderService.getOrder(orderId!),
    enabled: Boolean(orderId),
  });
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
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['orders'] });
      void queryClient.invalidateQueries({ queryKey: ['barista-queue'] });
      void queryClient.invalidateQueries({ queryKey: ['order'] });
      void queryClient.invalidateQueries({ queryKey: ['tables'] });
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
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['orders'] });
      void queryClient.invalidateQueries({ queryKey: ['barista-queue'] });
      void queryClient.invalidateQueries({ queryKey: ['order'] });
      void queryClient.invalidateQueries({ queryKey: ['tables'] });
    },
  });
}
