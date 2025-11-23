import { travelApi } from '@/infrastructure/http/axiosInstance';
import type { Branch, BranchesResponse } from '../interfaces/authApiInterfaces';

export const getBranches = async (): Promise<Branch[]> => {
  const response = await travelApi.get<BranchesResponse>('/branches');
  return response.data?.data ?? [];
};
