import { useQuery } from '@tanstack/react-query';
import { getCompanies } from '../services/companiesService';

export const useCompanies = () => {
  return useQuery({
    queryKey: ['companies'],
    queryFn: getCompanies,
    retry: 1,
    staleTime: 5 * 60 * 1000,
    placeholderData: [],
  });
};

