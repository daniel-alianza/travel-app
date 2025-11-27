import { travelApi } from '@/infrastructure/http/axiosInstance';
import { getAccessToken } from '@/infrastructure/http/interceptors/interceptors';
import { decodeJWT } from '@/lib/jwt';
import type {
  TravelRequest,
  ApprovalRequestsResponse,
  ApproveRejectRequestResponse,
  CompaniesResponse,
  TravelRequestsResponse,
  BackendTravelRequest,
} from '../interfaces';

interface BackendUser {
  id: number;
  name: string;
  email: string;
  company: {
    id: number;
    name: string;
  };
  isActive: boolean;
}

interface ApiResponse<T> {
  data: T;
  message: string;
  error: null;
}

function getUserIdFromToken(): number | null {
  const token = getAccessToken();
  if (!token) {
    return null;
  }

  const payload = decodeJWT(token);
  if (!payload || !payload.sub) {
    return null;
  }

  const userId = Number.parseInt(payload.sub, 10);
  return Number.isNaN(userId) ? null : userId;
}

export async function getUserCompanyMap(): Promise<Map<number, string>> {
  try {
    const response = await travelApi.get<ApiResponse<BackendUser[]>>('/users');
    const users = response.data?.data ?? [];
    const companyMap = new Map<number, string>();
    
    users.forEach(user => {
      if (user.company?.name) {
        companyMap.set(user.id, user.company.name);
      }
    });
    
    return companyMap;
  } catch (error) {
    console.error('Error al obtener usuarios para mapeo de compañías:', error);
    return new Map();
  }
}

function mapBackendToFrontend(
  backendRequest: BackendTravelRequest,
  companyMap: Map<number, string>,
): TravelRequest {
  // Mapear los detalles a expenses
  const expenses: TravelRequest['expenses'] = {
    transporte: 0,
    peajes: 0,
    hospedaje: 0,
    alimentos: 0,
    fletes: 0,
    herramientas: 0,
    enviosMensajeria: 0,
    miscelaneos: 0,
  };

  // Mapear los conceptos del backend a las categorías del frontend
  backendRequest.details.forEach(detail => {
    const conceptLower = detail.concept.toLowerCase();
    if (conceptLower.includes('transporte') || conceptLower.includes('vuelo') || conceptLower.includes('taxi')) {
      expenses.transporte += detail.amount;
    } else if (conceptLower.includes('peaje')) {
      expenses.peajes += detail.amount;
    } else if (conceptLower.includes('hospedaje') || conceptLower.includes('hotel')) {
      expenses.hospedaje += detail.amount;
    } else if (conceptLower.includes('alimento') || conceptLower.includes('comida') || conceptLower.includes('restaurante')) {
      expenses.alimentos += detail.amount;
    } else if (conceptLower.includes('flete')) {
      expenses.fletes += detail.amount;
    } else if (conceptLower.includes('herramienta')) {
      expenses.herramientas += detail.amount;
    } else if (conceptLower.includes('envío') || conceptLower.includes('mensajería') || conceptLower.includes('mensajeria')) {
      expenses.enviosMensajeria += detail.amount;
    } else {
      expenses.miscelaneos += detail.amount;
    }
  });

  // Mapear el estado del backend al formato del frontend
  const statusMap: Record<number, TravelRequest['status']> = {
    1: 'pending',
    2: 'approved',
    3: 'rejected',
  };

  const status = statusMap[backendRequest.statusId] || 'pending';

  // Formatear fechas
  const formatDate = (date: string | Date): string => {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Obtener nombre completo del usuario
  const employeeName = [
    backendRequest.user.name,
    backendRequest.user.paternalSurname,
    backendRequest.user.maternalSurname,
  ]
    .filter(Boolean)
    .join(' ');

  // Obtener compañía del mapa usando el userId
  const companyName = companyMap.get(backendRequest.userId) || '';

  return {
    id: backendRequest.id,
    employee: employeeName,
    position: '', // El backend no tiene posición, se puede obtener de otra fuente si es necesario
    company: companyName,
    reason: backendRequest.travelReason,
    startDate: formatDate(backendRequest.departureDate),
    endDate: formatDate(backendRequest.returnDate),
    objectives: backendRequest.travelObjectives
      ? backendRequest.travelObjectives.split(',').map(obj => obj.trim())
      : [],
    status,
    dispersed: backendRequest.disbursementDate !== null,
    expenses,
    createdAt: backendRequest.createdAt,
  };
}

const getApprovalRequests = async (
  statusId: number | undefined,
  limit: number,
  offset: number,
  companyMap: Map<number, string>,
): Promise<{
  data: TravelRequest[];
  pagination?: {
    total: number;
    limit: number;
    offset: number;
    totalPages: number;
    currentPage: number;
  };
}> => {
  try {
    const userId = getUserIdFromToken();
    if (!userId) {
      console.warn('No se pudo obtener el ID del usuario, retornando array vacío');
      return { data: [] };
    }

    const params: Record<string, string> = {
      userId: userId.toString(),
      limit: limit.toString(),
      offset: offset.toString(),
    };

    if (statusId) {
      params.statusId = statusId.toString();
    }

    const response = await travelApi.get<{
      data: BackendTravelRequest[];
      pagination?: {
        total: number;
        limit: number;
        offset: number;
        totalPages: number;
        currentPage: number;
      };
      message: string;
      error: null;
    }>('/travel-requests', {
      params,
    });

    const backendData = response.data?.data ?? [];
    
    // Mapear los datos del backend al formato del frontend usando el mapa de compañías
    const mappedData = backendData.map(request => mapBackendToFrontend(request, companyMap));
    
    return {
      data: mappedData,
      pagination: response.data?.pagination,
    };
  } catch (error) {
    console.error('Error al obtener solicitudes del backend:', error);
    return { data: [] };
  }
};

const getCompanies = async (): Promise<string[]> => {
  const response = await travelApi.get<CompaniesResponse>('/companies');
  const companies = response.data?.data ?? [];
  return companies.map(company => company.name);
};

const approveRequest = async (
  id: number,
  comment?: string,
): Promise<ApproveRejectRequestResponse> => {
  const approverId = getUserIdFromToken();
  if (!approverId) {
    throw new Error('No se pudo obtener el ID del aprobador');
  }

  const response = await travelApi.patch<ApproveRejectRequestResponse>(
    `/travel-requests/${id}/approve`,
    {
      approverId,
      approvedStatusId: 2, // statusId 2 = aprobada
      comment,
    },
  );

  return response.data;
};

const rejectRequest = async (
  id: number,
  comment?: string,
): Promise<ApproveRejectRequestResponse> => {
  const approverId = getUserIdFromToken();
  if (!approverId) {
    throw new Error('No se pudo obtener el ID del aprobador');
  }

  const response = await travelApi.patch<ApproveRejectRequestResponse>(
    `/travel-requests/${id}/reject`,
    {
      approverId,
      rejectedStatusId: 3, // statusId 3 = rechazada
      comment,
    },
  );

  return response.data;
};

const travelRequestReviewService = {
  getApprovalRequests,
  getCompanies,
  approveRequest,
  rejectRequest,
};

export { travelRequestReviewService };
