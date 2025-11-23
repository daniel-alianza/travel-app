import { travelApi } from '@/infrastructure/http/axiosInstance';
import type { Area, AreasResponse } from '../interfaces/authApiInterfaces';

export const getAreas = async (): Promise<Area[]> => {
  const response = await travelApi.get<AreasResponse>('/areas');
  return response.data?.data ?? [];
};
