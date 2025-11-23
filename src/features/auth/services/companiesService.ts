import { travelApi } from '@/infrastructure/http/axiosInstance';
import type { Company, CompaniesResponse } from '../interfaces/authApiInterfaces';

export const getCompanies = async (): Promise<Company[]> => {
  const response = await travelApi.get<CompaniesResponse>('/companies');
  return response.data?.data ?? [];
};
