import { useQuery } from '@tanstack/react-query';
import { dispersionService } from '../services/dispersion.service';

interface UseApprovedExpensesParams {
  limit?: number;
  offset?: number;
}

export const useApprovedExpenses = (params?: UseApprovedExpensesParams) => {
  const limit = params?.limit ?? 5;
  const offset = params?.offset ?? 0;

  return useQuery({
    queryKey: ['approved-expenses', limit, offset],
    queryFn: () => dispersionService.getApprovedRequests(limit, offset),
    retry: 1,
    staleTime: 30 * 1000,
    placeholderData: { data: [], pagination: undefined },
  });
};

