import { useQuery } from '@tanstack/react-query';
import { branchesService } from '@shared/lib/api';

export function useBranches() {
  return useQuery({
    queryKey: ['branches'],
    queryFn: () => branchesService.list(),
  });
}
