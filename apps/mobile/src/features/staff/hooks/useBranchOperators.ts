import { useQuery } from '@tanstack/react-query';

import type { StaffRole } from '@caffeapp/shared';

import { staffService } from '@shared/lib/api';

export function useBranchOperators(enabled = true, roles?: StaffRole[]) {
  return useQuery({
    queryKey: ['branch-operators', roles?.join(',') ?? 'all'],

    queryFn: () => staffService.listBranchOperators(roles),

    enabled,

    staleTime: 60_000,
  });
}
