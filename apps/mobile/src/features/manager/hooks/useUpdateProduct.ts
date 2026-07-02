import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '@shared/lib/api';
import { useSessionStore } from '@shared/stores/session';

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  const activeBranchId = useSessionStore((s) => s.activeBranchId);

  return useMutation({
    mutationFn: (params: {
      productId: string;
      name?: string;
      price?: number;
      categoryId?: string;
      description?: string;
    }) => productService.updateProduct(params),
    onSuccess: () => {
      if (activeBranchId) {
        void queryClient.invalidateQueries({ queryKey: ['products', activeBranchId] });
      }
    },
  });
}
