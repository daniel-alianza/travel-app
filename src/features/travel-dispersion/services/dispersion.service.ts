import { travelApi } from '@/infrastructure/http/axiosInstance';
import { getAccessToken } from '@/infrastructure/http/interceptors/interceptors';
import { decodeJWT } from '@/lib/jwt';
import type { Expense } from '../interfaces';
import type { BackendTravelRequest } from '@/features/travel-request-review/interfaces';

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

function formatCardNumber(cardNumber: string): string {
  // Remover espacios y guiones existentes
  const cleaned = cardNumber.replace(/[\s-]/g, '');
  // Agregar guiones cada 4 dígitos
  return cleaned.replace(/(.{4})/g, '$1-').replace(/-$/, '');
}

function mapBackendToExpense(backendRequest: BackendTravelRequest): Expense {
  // Obtener nombre completo del usuario
  const username = [
    backendRequest.user.name,
    backendRequest.user.paternalSurname,
    backendRequest.user.maternalSurname,
  ]
    .filter(Boolean)
    .join(' ')
    .toUpperCase();

  // Calcular el monto total solicitado sumando todos los detalles
  const requestedAmount = backendRequest.details.reduce(
    (sum, detail) => sum + detail.amount,
    0,
  );

  // Formatear fechas en formato ISO para que formatDate las procese correctamente
  const formatDate = (date: string | Date): string => {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toISOString().split('T')[0]; // Formato YYYY-MM-DD
  };

  return {
    id: backendRequest.id.toString(),
    username,
    cardNumber: formatCardNumber(backendRequest.card.cardNumber),
    description: backendRequest.travelReason,
    requestedAmount,
    adjustSign: '+' as const,
    adjustAmount: 0,
    startDate: formatDate(backendRequest.departureDate),
    endDate: formatDate(backendRequest.returnDate),
    status: 'sin cambio' as const,
  };
}

interface DisperseRequestResponse {
  data: BackendTravelRequest;
  message: string;
  error: null;
}

export const dispersionService = {
  getApprovedRequests: async (
    limit: number = 5,
    offset: number = 0,
  ): Promise<{
    data: Expense[];
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
        params: {
          userId: userId.toString(),
          statusId: '2', // 2 = approved según el código de travel-request-review
          limit: limit.toString(),
          offset: offset.toString(),
        },
      });

      const backendData = response.data?.data ?? [];
      return {
        data: backendData.map(mapBackendToExpense),
        pagination: response.data?.pagination,
      };
    } catch (error) {
      console.error('Error al obtener solicitudes aprobadas:', error);
      throw error;
    }
  },

  disperseRequest: async (requestId: number): Promise<void> => {
    const approverId = getUserIdFromToken();
    if (!approverId) {
      throw new Error('No se pudo obtener el ID del aprobador');
    }

    await travelApi.patch<DisperseRequestResponse>(
      `/travel-requests/${requestId}/approve`,
      {
        approverId,
        approvedStatusId: 7, // 7 = dispersada según el seed
      },
    );
  },

  disperseMultipleRequests: async (requestIds: number[]): Promise<void> => {
    await Promise.all(
      requestIds.map(id => dispersionService.disperseRequest(id)),
    );
  },
};

