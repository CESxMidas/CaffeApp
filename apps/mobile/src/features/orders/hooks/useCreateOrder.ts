import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateOrderDto } from '@caffeapp/shared';
import { orderService } from '@shared/lib/api';

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateOrderDto) => orderService.createOrder(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['tables'] });
      void queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}
