import { useQuery } from '@tanstack/react-query';
import { reportService } from '@shared/lib/api';

function todayRange(): { from: string; to: string } {
  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const to = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return {
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
  };
}

export function useRevenueReport(branchId?: string | null) {
  const range = todayRange();
  return useQuery({
    queryKey: ['revenue-report', branchId, range.from],
    queryFn: () =>
      reportService.getRevenue({
        ...range,
        ...(branchId ? { branchId } : {}),
      }),
    enabled: Boolean(branchId),
  });
}
