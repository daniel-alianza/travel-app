import { useQuery } from '@tanstack/react-query';
import { getAreas } from '../services/areasService';

export const useAreas = () => {
  return useQuery({
    queryKey: ['areas'],
    queryFn: getAreas,
    retry: 1,
    staleTime: 5 * 60 * 1000,
    placeholderData: [],
  });
};

