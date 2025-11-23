import { useQuery } from '@tanstack/react-query';
import { getBranches } from '../services/branchesService';

export const useBranches = () => {
  return useQuery({
    queryKey: ['branches'],
    queryFn: getBranches,
    retry: 1,
    staleTime: 5 * 60 * 1000,
    placeholderData: [],
  });
};

