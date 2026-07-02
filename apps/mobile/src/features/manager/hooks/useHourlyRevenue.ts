import { useQuery } from '@tanstack/react-query';
import { reportService } from '@shared/lib/api';

export function useHourlyRevenue(branchId?: string | null, date?: string) {
  return useQuery({
    queryKey: ['hourly-revenue', branchId, date],
    queryFn: () =>
      reportService.getHourlyRevenue({
        ...(branchId ? { branchId } : {}),
        ...(date ? { date } : {}),
      }),
    enabled: Boolean(branchId),
  });
}
