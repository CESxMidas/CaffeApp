import { useQuery } from '@tanstack/react-query';
import { reportService } from '@shared/lib/api';

export type RevenueRangePreset = 'today' | '7d' | '30d' | 'month';

export interface RevenueRange {
  from: string;
  to: string;
}

function toDateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function revenueRangeForPreset(preset: RevenueRangePreset): RevenueRange {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (preset) {
    case '7d': {
      const from = new Date(today);
      from.setDate(from.getDate() - 6);
      return { from: toDateString(from), to: toDateString(today) };
    }
    case '30d': {
      const from = new Date(today);
      from.setDate(from.getDate() - 29);
      return { from: toDateString(from), to: toDateString(today) };
    }
    case 'month': {
      const from = new Date(today.getFullYear(), today.getMonth(), 1);
      return { from: toDateString(from), to: toDateString(today) };
    }
    case 'today':
    default:
      return { from: toDateString(today), to: toDateString(today) };
  }
}

export function useRevenueReport(branchId?: string | null, range?: RevenueRange) {
  const effectiveRange = range ?? revenueRangeForPreset('today');
  return useQuery({
    queryKey: ['revenue-report', branchId, effectiveRange.from, effectiveRange.to],
    queryFn: () =>
      reportService.getRevenue({
        ...effectiveRange,
        ...(branchId ? { branchId } : {}),
      }),
    enabled: Boolean(branchId),
  });
}
