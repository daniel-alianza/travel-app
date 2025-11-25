import { travelApi } from '@/infrastructure/http/axiosInstance';
import type {
  CreateTravelRequestDto,
  TravelRequest,
  PaginationDto,
  ApiResponse,
  CreateTravelRequestResponse,
} from '../interfaces';
import type { TravelRequestFormData } from '../interfaces';

// Mapeo de conceptos de gastos del formulario
const EXPENSE_CONCEPTS: Record<keyof TravelRequestFormData['expenses'], string> = {
  transporte: 'Transporte',
  peajes: 'Peajes',
  hospedaje: 'Hospedaje',
  alimentos: 'Alimentos',
  fletes: 'Fletes',
  herramientas: 'Herramientas',
  envios: 'Envíos',
  miscelaneos: 'Misceláneos',
};

function mapFormDataToDto(
  formData: TravelRequestFormData,
  userId: number,
  cardId: number,
  statusId: number = 1, // Por defecto statusId = 1 (pendiente)
): CreateTravelRequestDto {
  // Calcular el total de gastos
  const totalAmount = Object.values(formData.expenses).reduce(
    (sum, value) => sum + (Number.parseFloat(value) || 0),
    0,
  );

  // Mapear los objetivos a un string concatenado
  const travelObjectives = formData.objectives
    .map(obj => obj.value.trim())
    .filter(obj => obj.length > 0)
    .join('; ');

  // Mapear los gastos a detalles
  const details = Object.entries(formData.expenses)
    .filter(([, amount]) => {
      const numAmount = Number.parseFloat(amount);
      return !Number.isNaN(numAmount) && numAmount > 0;
    })
    .map(([key, amount]) => ({
      concept: EXPENSE_CONCEPTS[key as keyof typeof EXPENSE_CONCEPTS],
      amount: Number.parseFloat(amount),
    }));

  return {
    userId,
    statusId,
    cardId,
    totalAmount,
    travelReason: formData.motivo,
    travelObjectives: travelObjectives || 'Sin objetivos especificados',
    departureDate: formData.fechaSalida,
    returnDate: formData.fechaRegreso,
    details,
  };
}

async function createTravelRequest(
  formData: TravelRequestFormData,
  userId: number,
  cardId: number,
  statusId: number = 1,
): Promise<CreateTravelRequestResponse> {
  const dto = mapFormDataToDto(formData, userId, cardId, statusId);

  const response = await travelApi.post<
    ApiResponse<CreateTravelRequestResponse>
  >('/travel-requests', dto);

  return response.data.data;
}

async function getAllTravelRequests(
  pagination?: PaginationDto,
): Promise<TravelRequest[]> {
  const response = await travelApi.get<ApiResponse<TravelRequest[]>>(
    '/travel-requests',
    {
      params: pagination,
    },
  );

  return response.data.data;
}

export const travelRequestService = {
  createTravelRequest,
  getAllTravelRequests,
};
