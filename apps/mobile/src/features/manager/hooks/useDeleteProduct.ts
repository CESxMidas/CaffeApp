import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '@shared/lib/api';
import { useSessionStore } from '@shared/stores/session';

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  const activeBranchId = useSessionStore((s) => s.activeBranchId);

  return useMutation({
    mutationFn: (productId: string) => productService.deleteProduct(productId),
    onSuccess: () => {
      if (activeBranchId) {
        void queryClient.invalidateQueries({ queryKey: ['products', activeBranchId] });
      }
    },
  });
}
