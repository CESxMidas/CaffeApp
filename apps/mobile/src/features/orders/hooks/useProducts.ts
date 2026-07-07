import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productService } from '@shared/lib/api';

export function useProducts(branchId: string | null, includeUnavailable = false) {
  return useQuery({
    queryKey: ['products', branchId, includeUnavailable],
    queryFn: () => productService.listProducts(branchId!, includeUnavailable),
    enabled: Boolean(branchId),
  });
}

export function useSetProductAvailability() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, isAvailable }: { productId: string; isAvailable: boolean }) =>
      productService.setAvailability(productId, isAvailable),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
