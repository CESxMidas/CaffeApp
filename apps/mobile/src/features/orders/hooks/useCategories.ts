import { useQuery } from '@tanstack/react-query';
import { productService } from '@shared/lib/api';

export function useCategories(branchId?: string | null) {
  return useQuery({
    queryKey: ['categories', branchId],
    queryFn: () => productService.listCategories(branchId ?? undefined),
    enabled: Boolean(branchId),
  });
}
