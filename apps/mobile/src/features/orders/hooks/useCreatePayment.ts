import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreatePaymentDto } from '@caffeapp/shared';
import { paymentService } from '@shared/lib/api';

export function useCreatePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePaymentDto) => paymentService.createPayment(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['orders'] });
      void queryClient.invalidateQueries({ queryKey: ['order'] });
      void queryClient.invalidateQueries({ queryKey: ['tables'] });
    },
  });
}
