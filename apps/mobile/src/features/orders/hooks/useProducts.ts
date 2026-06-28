import { useQuery } from '@tanstack/react-query';
import { productService } from '@shared/lib/api';

export function useProducts(branchId: string | null) {
  return useQuery({
    queryKey: ['products', branchId],
    queryFn: () => productService.listProducts(branchId!),
    enabled: Boolean(branchId),
  });
}
