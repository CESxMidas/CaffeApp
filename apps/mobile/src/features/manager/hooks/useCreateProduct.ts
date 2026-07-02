import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '@shared/lib/api';
import { useSessionStore } from '@shared/stores/session';

export function useCreateProduct() {
  const queryClient = useQueryClient();
  const activeBranchId = useSessionStore((s) => s.activeBranchId);

  return useMutation({
    mutationFn: (params: {
      branchId: string;
      name: string;
      price: number;
      categoryId: string;
      description?: string;
    }) => productService.createProduct(params),
    onSuccess: () => {
      if (activeBranchId) {
        void queryClient.invalidateQueries({ queryKey: ['products', activeBranchId] });
      }
    },
  });
}
