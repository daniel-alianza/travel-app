// Interfaces para la comunicación con el backend

export interface CreateTravelDetailDto {
  concept: string;
  amount: number;
}

export interface CreateTravelRequestDto {
  userId: number;
  statusId: number;
  cardId: number;
  totalAmount: number;
  travelReason: string;
  travelObjectives: string;
  departureDate: string;
  returnDate: string;
  details: CreateTravelDetailDto[];
}

export interface TravelDetail {
  id: number;
  travelRequestId: number;
  concept: string;
  amount: number;
}

export interface TravelRequest {
  id: number;
  userId: number;
  statusId: number;
  cardId: number;
  totalAmount: number;
  travelReason: string;
  travelObjectives: string;
  departureDate: string;
  returnDate: string;
  disbursementDate: string | null;
  approvalDate: string | null;
  approverId: number | null;
  comment: string | null;
  user: {
    id: number;
    name: string;
    paternalSurname: string;
    maternalSurname: string;
    email: string;
  };
  status: {
    id: number;
    name: string;
  };
  approver: {
    id: number;
    name: string;
    email: string;
  } | null;
  card: {
    id: number;
    cardNumber: string;
  };
  details: TravelDetail[];
  createdAt: string;
  updatedAt: string;
}

export interface PaginationDto {
  limit?: number;
  offset?: number;
  statusId?: number;
  userId?: number;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  error: null;
}

export interface CreateTravelRequestResponse {
  id: number;
  userId: number;
  statusId: number;
  cardId: number;
  totalAmount: number;
  travelReason: string;
  travelObjectives: string;
  departureDate: string;
  createdAt: string;
  updatedAt: string;
}
